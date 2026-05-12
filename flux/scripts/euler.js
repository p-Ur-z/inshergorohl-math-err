/**
 * 理解难度: ☁️
 * 复杂度: ⚡️
 *
 * 欧拉折线法（Euler Method）— 求解一阶常微分方程初值问题
 *
 * 问题形式: dy/dx = f(x, y), 初值 y(x₀) = y₀
 *
 * 递推公式:
 *   yₙ₊₁ = yₙ + h·f(xₙ, yₙ)
 *   xₙ₊₁ = xₙ + h
 *
 * 其中 h 为步长。每一步用当前点的斜率近似下一段区间。
 * 方法为一阶精度 O(h)，简单但误差累积较快。
 *
 * @param {string} funcExpr - f(x,y) 的表达式，如 "x + y"
 * @param {number} x0 - 初始 x 值
 * @param {number} y0 - 初始 y 值
 * @param {number} h  - 步长（越小越精确但计算量越大）
 * @param {number} xn - 终止 x 值
 * @returns {string} 每一步的 (x, y) 表格文本
 */
function eulerMethod(funcExpr, x0, y0, h, xn) {
  // 用 new Function 将字符串编译为可调用的二元函数 f(x, y)
  const f = new Function("x", "y", "return " + funcExpr + ";");

  let x = x0;
  let y = y0;

  // 计算需要的步数（四舍五入避免浮点误差）
  const steps = Math.round((xn - x0) / h);

  // 构建输出表格
  let output = "x\t| y\n--------------------\n";
  output += x.toFixed(4) + "\t| " + y.toFixed(6) + "\n";

  // 逐步迭代
  for (let i = 0; i < steps; i++) {
    y = y + h * f(x, y); // yₙ₊₁ = yₙ + h·f(xₙ, yₙ)
    x = x + h; // xₙ₊₁ = xₙ + h
    output += x.toFixed(4) + "\t| " + y.toFixed(6) + "\n";
  }

  return output;
}
