// 安全执行数学表达式
const run = (e, v) =>
  Function(...Object.keys(v), `return ${e}`)(...Object.values(v));

// 定积分计算
function definiteIntegral(fExpr, a, b, n, method) {
  const f = (x) => run(fExpr, { x });
  const h = (b - a) / n;
  let s = 0;
  let err = "";

  if (method === "left") {
    for (let i = 0; i < n; i++) s += f(a + i * h);
    s *= h;
    err = "O(h)";
  } else if (method === "right") {
    for (let i = 1; i <= n; i++) s += f(a + i * h);
    s *= h;
    err = "O(h)";
  } else if (method === "mid") {
    for (let i = 0; i < n; i++) s += f(a + (i + 0.5) * h);
    s *= h;
    err = "O(h²)";
  } else if (method === "trapezoid") {
    s = 0.5 * (f(a) + f(b));
    for (let i = 1; i < n; i++) s += f(a + i * h);
    s *= h;
    err = "O(h²)";
  } else if (method === "parabola") {
    s = f(a) + f(b);
    for (let i = 1; i < n; i++) {
      s += f(a + i * h) * (i % 2 ? 4 : 2);
    }
    s *= h / 3;
    err = "O(h⁴)";
  }

  return { value: s, error: err };
}

// 二重积分（中点法则）
function doubleIntegral(fExpr, x1, x2, y1, y2, n) {
  const f = (x, y) => run(fExpr, { x, y });
  const hx = (x2 - x1) / n;
  const hy = (y2 - y1) / n;
  let s = 0;

  for (let i = 0; i < n; i++) {
    for (let j = 0; j < n; j++) {
      s += f(x1 + (i + 0.5) * hx, y1 + (j + 0.5) * hy);
    }
  }

  return s * hx * hy;
}

// 曲线积分
function curveIntegral(xExpr, yExpr, t0, t1, n, type) {
  const x = (t) => run(xExpr, { t });
  const y = (t) => run(yExpr, { t });
  const dt = (t1 - t0) / n;
  let s = 0;

  for (let i = 0; i < n; i++) {
    const t = t0 + i * dt;
    const dx = x(t + dt) - x(t);
    const dy = y(t + dt) - y(t);

    if (type === "I") {
      s += Math.hypot(dx, dy);
    } else {
      s += x(t) * dy - y(t) * dx;
    }
  }

  return s;
}

// 三重积分（中点法则）
function tripleIntegral(fExpr, x0, x1, y0, y1, z0, z1, n) {
  const f = (x, y, z) => run(fExpr, { x, y, z });
  const hx = (x1 - x0) / n;
  const hy = (y1 - y0) / n;
  const hz = (z1 - z0) / n;
  let s = 0;

  for (let i = 0; i < n; i++) {
    for (let j = 0; j < n; j++) {
      for (let k = 0; k < n; k++) {
        s += f(x0 + (i + 0.5) * hx, y0 + (j + 0.5) * hy, z0 + (k + 0.5) * hz);
      }
    }
  }

  return s * hx * hy * hz;
}
