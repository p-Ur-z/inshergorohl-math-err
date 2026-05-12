/**
 * 理解难度: ☁️☁️
 * 复杂度: ⚡️⚡️
 *
 * 泰勒展开 & 特殊函数计算模块
 *
 * 使用泰勒级数（幂级数展开）近似计算以下特殊函数:
 *   - Si(x)  : 正弦积分 ∫₀ˣ sin(t)/t dt
 *   - Ci(x)  : 余弦积分 -∫ₓ^∞ cos(t)/t dt
 *   - Ei(x)  : 指数积分 ∫₋∞ˣ eᵗ/t dt
 *   - Li(x)  : 对数积分 ∫₂ˣ dt/ln(t) = Ei(ln(x))
 *   - erf(x) : 误差函数 (2/√π)∫₀ˣ e^(-t²) dt
 *
 * 此外也支持标准 Math 函数: sin, cos, tan, exp, arcsin 等
 */

/** 欧拉常数 γ ≈ 0.5772156649... */
const gamma = 0.5772156649015329;

/**
 * 阶乘缓存数组 — 避免重复计算
 * factCache[0] = 0! = 1, factCache[1] = 1! = 1
 */
const factCache = [1, 1];

/**
 * 计算 n 的阶乘（带缓存）
 * @param {number} n - 非负整数
 * @returns {number} n!
 */
function fact(n) {
  // 缓存命中时直接返回
  if (factCache[n] !== undefined) return factCache[n];
  // 从当前缓存最大索引开始递推计算
  for (let i = factCache.length; i <= n; i++) {
    factCache[i] = factCache[i - 1] * i;
  }
  return factCache[n];
}

/**
 * 正弦积分 Si(x) = ∫₀ˣ sin(t)/t dt
 *
 * 泰勒展开: Si(x) = Σₙ₌₀^∞ (-1)ⁿ x^(2n+1) / ((2n+1)·(2n+1)!)
 * 前20项对 |x| ≤ 10 精度较高
 */
function Si(x) {
  let s = 0;
  for (let n = 0; n < 20; n++) {
    s += ((-1) ** n * x ** (2 * n + 1)) / ((2 * n + 1) * fact(2 * n + 1));
  }
  return s;
}

/**
 * 余弦积分 Ci(x) = γ + ln(x) + ∫₀ˣ (cos(t)-1)/t dt
 *
 * 泰勒展开: Ci(x) = γ + ln(x) + Σₙ₌₁^∞ (-1)ⁿ x^(2n) / (2n·(2n)!)
 */
function Ci(x) {
  let s = 0;
  for (let n = 1; n < 20; n++) {
    s += ((-1) ** n * x ** (2 * n)) / (2 * n * fact(2 * n));
  }
  return gamma + Math.log(x) + s;
}

/**
 * 指数积分 Ei(x) = -∫₋ₓ^∞ e^(-t)/t dt  (x > 0)
 *
 * 泰勒展开: Ei(x) = γ + ln|x| + Σₙ₌₁^∞ xⁿ / (n·n!)
 */
function Ei(x) {
  let s = 0;
  for (let n = 1; n < 20; n++) {
    s += x ** n / (n * fact(n));
  }
  return gamma + Math.log(Math.abs(x)) + s;
}

/**
 * 对数积分 Li(x) = ∫₂ˣ dt/ln(t)
 *
 * 与指数积分的关系: Li(x) = Ei(ln(x))
 */
const Li = (x) => Ei(Math.log(x));

/**
 * 误差函数 erf(x) = (2/√π) ∫₀ˣ e^(-t²) dt
 *
 * 泰勒展开: erf(x) = (2/√π) Σₙ₌₀^∞ (-1)ⁿ x^(2n+1) / (n!·(2n+1))
 */
function erf(x) {
  let s = 0;
  for (let n = 0; n < 20; n++) {
    s += ((-1) ** n * x ** (2 * n + 1)) / (fact(n) * (2 * n + 1));
  }
  return (2 / Math.sqrt(Math.PI)) * s;
}

/** 特殊函数映射表: 函数名 → 实现函数 */
const specialFunctions = { Si, Ci, Ei, Li, erf };

/**
 * 根据函数名计算函数值
 *
 * 优先查找 specialFunctions 表中的自定义实现（泰勒级数），
 * 若未找到则回退到 JavaScript 内置 Math 对象（如 Math.sin）
 *
 * @param {string} funcName - 函数名，如 "sin" "Si" "erf"
 * @param {number} x        - 自变量
 * @returns {number} 函数值
 */
function computeTaylor(funcName, x) {
  const fn = specialFunctions[funcName];
  return fn ? fn(x) : Math[funcName](x);
}
