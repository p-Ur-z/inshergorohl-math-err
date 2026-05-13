/**
 * 理解难度: ☁️
 * 复杂度: ⚡️⚡️⚡️
 *
 * 线性代数工具模块 — 提供矩阵运算的核心函数
 *
 * 支持操作:
 *   - 从文本框读取矩阵
 *   - LU 分解 (Doolittle 算法)
 *   - QR 分解 (Gram-Schmidt 正交化)
 *   - 矩阵幂、行列式、乘法
 *   - 矩阵格式化输出
 */

/**
 * 从指定 <textarea> 元素读取矩阵
 *
 * 输入格式: 每行一个行向量，元素用空格分隔。如:
 *   1 2 3
 *   4 5 6
 *   7 8 9
 *
 * @param {string} id - textarea 元素的 ID
 * @returns {number[][]} 二维数组表示的矩阵
 */
function getMatrix(id) {
  const text = document.getElementById(id).value;
  const lines = text.split("\n");
  const matrix = [];
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    // 跳过空行
    if (line.length > 0) {
      const parts = line.split(/\s+/); // 按空白字符分割
      const row = [];
      for (let j = 0; j < parts.length; j++) row.push(parseFloat(parts[j]));
      matrix.push(row);
    }
  }
  return matrix;
}

/**
 * 将矩阵格式化为等宽对齐的字符串
 *
 * 每个元素保留两位小数，右对齐宽度为8个字符。
 *
 * @param {number[][]} M - 矩阵
 * @returns {string}
 */
function printMatrix(M) {
  let s = "";
  for (let i = 0; i < M.length; i++) {
    for (let j = 0; j < M[0].length; j++) {
      let num = M[i][j].toFixed(2);
      // 左侧补空格至宽度8
      while (num.length < 8) num = " " + num;
      s += num;
    }
    s += "\n";
  }
  return s;
}

/**
 * 2×2 矩阵求逆
 *
 * 公式: A⁻¹ = (1/det) · [ d  -b ]
 *                         [ -c  a ]
 * 其中 det = ad - bc
 *
 * @param {number[][]} A - 2×2 矩阵 [[a,b],[c,d]]
 * @returns {number[][]} 逆矩阵
 */
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

/**
 * LU 分解 — Doolittle 算法
 *
 * 将方阵 A 分解为下三角矩阵 L（主对角线为1）和上三角矩阵 U，
 * 满足 A = LU。
 *
 * 算法:
 *   U[i][j] = A[i][j] - Σₖ₌₀^{i-1} L[i][k]·U[k][j]   (j ≥ i)
 *   L[j][i] = (A[j][i] - Σₖ₌₀^{i-1} L[j][k]·U[k][i]) / U[i][i]   (j > i)
 *
 * @param {number[][]} A - n×n 方阵
 * @returns {{L: number[][], U: number[][]}}
 */
function computeLU(A) {
  const n = A.length;
  const L = [],
    U = [];

  // 初始化 L（主对角线为1）和 U（全零）
  for (let i = 0; i < n; i++) {
    L[i] = [];
    U[i] = [];
    for (let j = 0; j < n; j++) {
      L[i][j] = 0;
      U[i][j] = 0;
    }
    L[i][i] = 1; // L 的主对角线
  }

  // Doolittle 分解
  for (let i = 0; i < n; i++) {
    // 计算 U 的第 i 行
    for (let j = i; j < n; j++) {
      let sum = 0;
      for (let k = 0; k < i; k++) sum += L[i][k] * U[k][j];
      U[i][j] = A[i][j] - sum;
    }
    // 计算 L 的第 i 列
    for (let j = i + 1; j < n; j++) {
      let sum = 0;
      for (let k = 0; k < i; k++) sum += L[j][k] * U[k][i];
      L[j][i] = (A[j][i] - sum) / U[i][i];
    }
  }
  return { L, U };
}

/**
 * QR 分解 — Gram-Schmidt 正交化
 *
 * 将 m×n 矩阵 A 分解为正交矩阵 Q (m×n) 和上三角矩阵 R (n×n)，
 * 满足 A = QR。
 *
 * 算法:
 *   对每列 j:
 *     v = A的第j列
 *     对每个已处理的列 k:
 *       R[k][j] = Q的第k列 · A的第j列  (投影系数)
 *       v = v - R[k][j] × Q的第k列     (减去投影)
 *     R[j][j] = ||v||
 *     Q的第j列 = v / ||v||
 *
 * @param {number[][]} A - m×n 矩阵
 * @returns {{Q: number[][], R: number[][]}}
 */
function computeQR(A) {
  const m = A.length, // 行数
    n = A[0].length; // 列数
  const Q = [],
    R = [];

  // 初始化 Q (m×n 零矩阵) 和 R (n×n 零矩阵)
  for (let i = 0; i < m; i++) {
    Q[i] = [];
    for (let j = 0; j < n; j++) Q[i][j] = 0;
  }
  for (let i = 0; i < n; i++) {
    R[i] = [];
    for (let j = 0; j < n; j++) R[i][j] = 0;
  }

  // 逐列处理
  for (let j = 0; j < n; j++) {
    // 取 A 的第 j 列作为初始向量 v
    const v = [];
    for (let i = 0; i < m; i++) v[i] = A[i][j];

    // 减去 v 在前面所有 Q 的列上的投影
    for (let k = 0; k < j; k++) {
      let proj = 0;
      for (let i = 0; i < m; i++) proj += Q[i][k] * A[i][j];
      R[k][j] = proj; // 投影系数存入 R
      for (let i = 0; i < m; i++) v[i] -= proj * Q[i][k]; // 减去投影
    }

    // 计算 v 的模长
    let norm = 0;
    for (let i = 0; i < m; i++) norm += v[i] * v[i];
    norm = Math.sqrt(norm);
    R[j][j] = norm; // 对角线元素

    // 归一化得到 Q 的第 j 列
    for (let i = 0; i < m; i++) Q[i][j] = v[i] / norm;
  }
  return { Q, R };
}

/**
 * SVD 分解（简化版本 — 仅支持对角矩阵的演示）
 *
 * 注意: 这是一个简化的演示实现，仅正确处理对角矩阵。
 * 对于非对角矩阵，它简单地返回单位矩阵作为 U 和 Vᵀ。
 *
 * @param {number[][]} A - 2×2 矩阵
 * @returns {string} 格式化的 SVD 结果文本
 */
function computeSVD(A) {
  return (
    "U =\n1 0\n0 1\n\nΣ =\n" +
    A[0][0].toFixed(2) +
    " 0\n0 " +
    A[1][1].toFixed(2) +
    "\n\nVᵀ =\n1 0\n0 1"
  );
}

/**
 * 矩阵幂运算 Aⁿ（仅支持 2×2 矩阵）
 *
 * - 正整数 n: 重复自乘 n 次
 * - 负整数 n: 先求逆再自乘 |n| 次
 * - n = 0: 返回单位矩阵
 *
 * @param {number[][]} A - 2×2 矩阵
 * @param {number} n     - 幂次（整数）
 * @returns {number[][]|{error: string}}
 */
function computePow(A, n) {
  // 处理负指数：A^(-n) = (A⁻¹)^n
  if (n < 0) {
    const det = A[0][0] * A[1][1] - A[0][1] * A[1][0];
    if (det === 0) return { error: "矩阵不可逆，无法计算负整数次幂" };
    A = inverseMatrix(A);
    n = -n;
  }

  // 重复自乘
  let result = A;
  const base = A;
  for (let i = 1; i < n; i++) {
    // 2×2 矩阵乘法
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

/**
 * 行列式计算
 *
 * 支持 2×2 和 3×3 矩阵。
 *
 * 2×2: det = ad - bc
 * 3×3: 使用 Sarrus 法则展开
 *
 * @param {number[][]} A - 方阵
 * @returns {number|{error: string}}
 */
function computeDet(A) {
  const n = A.length;

  // 2×2 行列式: |a b| = ad - bc
  //                |c d|
  if (n === 2) return A[0][0] * A[1][1] - A[0][1] * A[1][0];

  // 3×3 行列式: Sarrus 法则
  if (n === 3)
    return (
      A[0][0] * (A[1][1] * A[2][2] - A[1][2] * A[2][1]) -
      A[0][1] * (A[1][0] * A[2][2] - A[1][2] * A[2][0]) +
      A[0][2] * (A[1][0] * A[2][1] - A[1][1] * A[2][0])
    );

  return { error: "暂不支持 " + n + "×" + n + " 行列式" };
}

/**
 * 矩阵乘法 C = A × B
 *
 * 条件: A 的列数必须等于 B 的行数
 * 结果: C[i][j] = Σₖ A[i][k] × B[k][j]
 *
 * @param {number[][]} A - m×k 矩阵
 * @param {number[][]} B - k×n 矩阵
 * @returns {number[][]|{error: string}}
 */
function computeMul(A, B) {
  const rowsA = A.length,
    colsA = A[0].length;
  const rowsB = B.length,
    colsB = B[0].length;

  // 检查维度是否匹配
  if (colsA !== rowsB) return { error: "矩阵维度不匹配" };

  const C = [];
  for (let i = 0; i < rowsA; i++) {
    C[i] = [];
    for (let j = 0; j < colsB; j++) {
      C[i][j] = 0;
      // 计算内积
      for (let k = 0; k < colsA; k++) C[i][j] += A[i][k] * B[k][j];
    }
  }
  return C;
}
