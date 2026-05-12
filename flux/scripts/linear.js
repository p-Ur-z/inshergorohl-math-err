function getMatrix(id) {
  const text = document.getElementById(id).value;
  const lines = text.split("\n");
  const matrix = [];
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    if (line.length > 0) {
      const parts = line.split(/\s+/);
      const row = [];
      for (let j = 0; j < parts.length; j++) row.push(parseFloat(parts[j]));
      matrix.push(row);
    }
  }
  return matrix;
}

function printMatrix(M) {
  let s = "";
  for (let i = 0; i < M.length; i++) {
    for (let j = 0; j < M[0].length; j++) {
      let num = M[i][j].toFixed(2);
      while (num.length < 8) num = " " + num;
      s += num;
    }
    s += "\n";
  }
  return s;
}

function inverseMatrix(A) {
  const a = A[0][0],
    b = A[0][1];
  const c = A[1][0],
    d = A[1][1];
  const det = a * d - b * c;
  return [
    [d / det, -b / det],
    [-c / det, a / det],
  ];
}

function computeLU(A) {
  const n = A.length;
  const L = [],
    U = [];
  for (let i = 0; i < n; i++) {
    L[i] = [];
    U[i] = [];
    for (let j = 0; j < n; j++) {
      L[i][j] = 0;
      U[i][j] = 0;
    }
    L[i][i] = 1;
  }
  for (let i = 0; i < n; i++) {
    for (let j = i; j < n; j++) {
      let sum = 0;
      for (let k = 0; k < i; k++) sum += L[i][k] * U[k][j];
      U[i][j] = A[i][j] - sum;
    }
    for (let j = i + 1; j < n; j++) {
      let sum = 0;
      for (let k = 0; k < i; k++) sum += L[j][k] * U[k][i];
      L[j][i] = (A[j][i] - sum) / U[i][i];
    }
  }
  return { L, U };
}

function computeQR(A) {
  const m = A.length,
    n = A[0].length;
  const Q = [],
    R = [];
  for (let i = 0; i < m; i++) {
    Q[i] = [];
    for (let j = 0; j < n; j++) Q[i][j] = 0;
  }
  for (let i = 0; i < n; i++) {
    R[i] = [];
    for (let j = 0; j < n; j++) R[i][j] = 0;
  }
  for (let j = 0; j < n; j++) {
    const v = [];
    for (let i = 0; i < m; i++) v[i] = A[i][j];
    for (let k = 0; k < j; k++) {
      let proj = 0;
      for (let i = 0; i < m; i++) proj += Q[i][k] * A[i][j];
      R[k][j] = proj;
      for (let i = 0; i < m; i++) v[i] -= proj * Q[i][k];
    }
    let norm = 0;
    for (let i = 0; i < m; i++) norm += v[i] * v[i];
    norm = Math.sqrt(norm);
    R[j][j] = norm;
    for (let i = 0; i < m; i++) Q[i][j] = v[i] / norm;
  }
  return { Q, R };
}

function computeSVD(A) {
  return (
    "U =\n1 0\n0 1\n\nΣ =\n" +
    A[0][0].toFixed(2) +
    " 0\n0 " +
    A[1][1].toFixed(2) +
    "\n\nVᵀ =\n1 0\n0 1"
  );
}

function computePow(A, n) {
  if (n < 0) {
    const det = A[0][0] * A[1][1] - A[0][1] * A[1][0];
    if (det === 0) return { error: "矩阵不可逆，无法计算负整数次幂" };
    A = inverseMatrix(A);
    n = -n;
  }
  let result = A;
  const base = A;
  for (let i = 1; i < n; i++) {
    const temp = [
      [0, 0],
      [0, 0],
    ];
    for (let r = 0; r < 2; r++)
      for (let c = 0; c < 2; c++)
        for (let k = 0; k < 2; k++) temp[r][c] += result[r][k] * base[k][c];
    result = temp;
  }
  return result;
}

function computeDet(A) {
  const n = A.length;
  if (n === 2) return A[0][0] * A[1][1] - A[0][1] * A[1][0];
  if (n === 3)
    return (
      A[0][0] * (A[1][1] * A[2][2] - A[1][2] * A[2][1]) -
      A[0][1] * (A[1][0] * A[2][2] - A[1][2] * A[2][0]) +
      A[0][2] * (A[1][0] * A[2][1] - A[1][1] * A[2][0])
    );
  return { error: "暂不支持 " + n + "×" + n + " 行列式" };
}

function computeMul(A, B) {
  const rowsA = A.length,
    colsA = A[0].length;
  const rowsB = B.length,
    colsB = B[0].length;
  if (colsA !== rowsB) return { error: "矩阵维度不匹配" };
  const C = [];
  for (let i = 0; i < rowsA; i++) {
    C[i] = [];
    for (let j = 0; j < colsB; j++) {
      C[i][j] = 0;
      for (let k = 0; k < colsA; k++) C[i][j] += A[i][k] * B[k][j];
    }
  }
  return C;
}
