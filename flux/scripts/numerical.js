/**
 * 理解难度: ☁️☁️
 * 复杂度: ⚡️⚡️⚡️
 *
 * 数值积分模块 — 提供多种数值积分方法
 *
 * 支持:
 *   - 定积分（左/右/中黎曼和、梯形法、抛物线法/Simpson）
 *   - 二重积分（中点法）
 *   - 曲线积分（I 类弧长、II 类向量场）
 *   - 三重积分（中点法）
 */

/**
 * 将字符串表达式编译为可调用的多元函数
 *
 * 用法: run("x*x + y", { x: 2, y: 3 }) → 返回 7
 *
 * 原理: 利用 new Function 动态创建函数。
 *   - Object.keys(v) → 形参名列表 ["x", "y"]
 *   - Object.values(v) → 实参值列表 [2, 3]
 *   - Function("x","y", "return x*x + y")(2, 3)
 *
 * @param {string} e - 表达式字符串，如 "Math.sin(x) + y"
 * @param {object} v - 变量名到值的映射，如 { x: 1.5, y: 3 }
 * @returns {number} 表达式计算结果
 */
const run = (e, v) =>
  Function(...Object.keys(v), `return ${e}`)(...Object.values(v));

/**
 * 定积分 — 一维函数在 [a, b] 上的数值积分
 *
 * 支持五种方法:
 *   - left      : 左黎曼和    O(h)
 *   - right     : 右黎曼和    O(h)
 *   - mid       : 中点黎曼和  O(h²)
 *   - trapezoid : 梯形法      O(h²)
 *   - parabola  : 抛物线法    O(h⁴) (Simpson 1/3 法则)
 *
 * @param {string} fExpr  - 被积函数 f(x) 的表达式
 * @param {number} a      - 积分下限
 * @param {number} b      - 积分上限
 * @param {number} n      - 区间等分数（越大越精确）
 * @param {string} method - 积分方法
 * @returns {{value: number, error: string}} 积分近似值及误差阶
 */
function definiteIntegral(fExpr, a, b, n, method) {
  // 将表达式编译为函数
  const f = (x) => run(fExpr, { x });
  const h = (b - a) / n; // 每个小区间的宽度
  let s = 0; // 累加器
  let err = ""; // 误差阶描述

  switch (method) {
    case "left":
      // 左黎曼和: Σ_{i=0}^{n-1} f(xᵢ) · h
      for (let i = 0; i < n; i++) s += f(a + i * h);
      s *= h;
      err = "O(h)";
      break;

    case "right":
      // 右黎曼和: Σ_{i=1}^{n} f(xᵢ) · h
      for (let i = 1; i <= n; i++) s += f(a + i * h);
      s *= h;
      err = "O(h)";
      break;

    case "mid":
      // 中点黎曼和: Σ_{i=0}^{n-1} f((xᵢ+xᵢ₊₁)/2) · h
      for (let i = 0; i < n; i++) s += f(a + (i + 0.5) * h);
      s *= h;
      err = "O(h²)";
      break;

    case "trapezoid":
      // 梯形法: h/2 · (f(a) + 2·Σ_{i=1}^{n-1} f(xᵢ) + f(b))
      s = 0.5 * (f(a) + f(b)); // 首尾各半
      for (let i = 1; i < n; i++) s += f(a + i * h);
      s *= h;
      err = "O(h²)";
      break;

    case "parabola":
      // 抛物线法 (Simpson 1/3):
      // h/3 · (f₀ + 4f₁ + 2f₂ + 4f₃ + ... + 2fₙ₋₂ + 4fₙ₋₁ + fₙ)
      // 即奇数点乘4，偶数点乘2
      s = f(a) + f(b);
      for (let i = 1; i < n; i++) {
        s += f(a + i * h) * (i % 2 ? 4 : 2); // 奇索引×4, 偶索引×2
      }
      s *= h / 3;
      err = "O(h⁴)";
      break;
  }

  return { value: s, error: err };
}

/**
 * 二重积分 — 矩形区域上的中点法积分
 *
 * ∬_{[x₁,x₂]×[y₁,y₂]} f(x,y) dxdy
 * ≈ hx·hy · Σᵢ Σⱼ f(x₁+(i+0.5)hx, y₁+(j+0.5)hy)
 *
 * @param {string} fExpr - f(x,y) 表达式
 * @param {number} x1, x2 - x 积分区间
 * @param {number} y1, y2 - y 积分区间
 * @param {number} n      - 每维分段数
 * @returns {number}
 */
function doubleIntegral(fExpr, x1, x2, y1, y2, n) {
  const f = (x, y) => run(fExpr, { x, y });
  const hx = (x2 - x1) / n; // x 方向步长
  const hy = (y2 - y1) / n; // y 方向步长
  let s = 0;

  // 双重循环遍历每个小矩形中点
  for (let i = 0; i < n; i++) {
    for (let j = 0; j < n; j++) {
      s += f(x1 + (i + 0.5) * hx, y1 + (j + 0.5) * hy);
    }
  }

  return s * hx * hy; // 乘上每个小矩形面积
}

/**
 * 曲线积分 — 参数曲线上的积分
 *
 * I 类（标量弧长）: ∫_C ds ≈ Σ √(dx² + dy²)
 * II 类（向量场）: ∫_C x dy - y dx ≈ Σ (x·Δy - y·Δx)
 *
 * @param {string} xExpr - x(t) 参数表达式
 * @param {string} yExpr - y(t) 参数表达式
 * @param {number} t0, t1 - 参数 t 的范围
 * @param {number} n - 分段数
 * @param {string} type - "I" 或 "II"
 * @returns {number}
 */
function curveIntegral(xExpr, yExpr, t0, t1, n, type) {
  const x = (t) => run(xExpr, { t });
  const y = (t) => run(yExpr, { t });
  const dt = (t1 - t0) / n;
  let s = 0;

  for (let i = 0; i < n; i++) {
    const t = t0 + i * dt;
    const dx = x(t + dt) - x(t); // x 的增量
    const dy = y(t + dt) - y(t); // y 的增量

    if (type === "I") {
      // I 类: 弧长元素 ds = √(dx²+dy²)
      s += Math.hypot(dx, dy);
    } else {
      // II 类: 1/2(x dy - y dx) 或直接累加
      s += x(t) * dy - y(t) * dx;
    }
  }
  return s;
}

/**
 * 三重积分 — 长方体区域上的中点法积分
 *
 * ∭_{[x₀,x₁]×[y₀,y₁]×[z₀,z₁]} f(x,y,z) dxdydz
 * ≈ hx·hy·hz · Σᵢ Σⱼ Σₖ f(xᵢ₊₀.₅, yⱼ₊₀.₅, zₖ₊₀.₅)
 *
 * @param {string} fExpr - f(x,y,z) 表达式
 * @param {number} x0,x1,y0,y1,z0,z1 - 各维度积分区间
 * @param {number} n - 每维分段数
 * @returns {number}
 */
function tripleIntegral(fExpr, x0, x1, y0, y1, z0, z1, n) {
  const f = (x, y, z) => run(fExpr, { x, y, z });
  const hx = (x1 - x0) / n;
  const hy = (y1 - y0) / n;
  const hz = (z1 - z0) / n;

  // 辅助函数: 计算第 idx 个小格子的中点坐标
  const mid = (val, step, idx) => val + (idx + 0.5) * step;

  let s = 0;
  // 三重循环遍历每个小长方体中点
  for (let i = 0; i < n; i++) {
    const x = mid(x0, hx, i);
    for (let j = 0; j < n; j++) {
      const y = mid(y0, hy, j);
      for (let k = 0; k < n; k++) {
        s += f(x, y, mid(z0, hz, k));
      }
    }
  }
  return s * hx * hy * hz; // 乘上每个小长方体体积
}
