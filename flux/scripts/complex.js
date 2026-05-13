/**
 * 理解难度: ☁️
 * 复杂度: ⚡️
 *
 * 复数类 — 支持加减乘除、幂运算、极坐标转换
 *
 * 复数形式: z = a + bi
 *   - re: 实部 (real part)
 *   - im: 虚部 (imaginary part)
 */
class Complex {
  /**
   * @param {number} re - 实部
   * @param {number} im - 虚部
   */
  constructor(re, im) {
    this.re = re;
    this.im = im;
  }

  /**
   * 加法: (a+bi) + (c+di) = (a+c) + (b+d)i
   * @param {Complex} c - 另一个复数
   * @returns {Complex}
   */
  add(c) {
    return new Complex(this.re + c.re, this.im + c.im);
  }

  /**
   * 减法: (a+bi) - (c+di) = (a-c) + (b-d)i
   * @param {Complex} c - 另一个复数
   * @returns {Complex}
   */
  sub(c) {
    return new Complex(this.re - c.re, this.im - c.im);
  }

  /**
   * 乘法: (a+bi)(c+di) = (ac-bd) + (ad+bc)i
   * @param {Complex} c - 另一个复数
   * @returns {Complex}
   */
  mul(c) {
    return new Complex(
      this.re * c.re - this.im * c.im, // 实部: ac - bd
      this.re * c.im + this.im * c.re, // 虚部: ad + bc
    );
  }

  /**
   * 除法: (a+bi)/(c+di) = ((ac+bd) + (bc-ad)i) / (c²+d²)
   * @param {Complex} c - 除数
   * @returns {Complex}
   * @throws {Error} 当除数为零时抛出异常
   */
  div(c) {
    // 分母: |c|² = c² + d²
    const d = c.re * c.re + c.im * c.im;
    if (d === 0) throw new Error("除以零");
    return new Complex(
      (this.re * c.re + this.im * c.im) / d, // 实部
      (this.im * c.re - this.re * c.im) / d, // 虚部
    );
  }

  /**
   * 幂运算: z₁^z₂，通过极坐标形式计算
   *
   * 原理: z₁ = r·e^(iθ)，则 z₁^z₂ = e^(z₂·ln(z₁))
   * 其中 ln(z₁) = ln(r) + iθ
   * 所以: z₁^(c+di) = e^((c+di)(ln(r)+iθ))
   *                  = e^(c·ln(r) - d·θ) · e^(i(c·θ + d·ln(r)))
   *                  = e^(c·ln(r) - d·θ) · (cos(c·θ + d·ln(r)) + i·sin(c·θ + d·ln(r)))
   *
   * @param {Complex} c - 指数
   * @returns {Complex}
   */
  pow(c) {
    // 将 z₁ 转为极坐标: z₁ = r·e^(iθ)
    const r = Math.hypot(this.re, this.im); // 模长 r = |z₁|
    const theta = Math.atan2(this.im, this.re); // 辐角 θ = arg(z₁)
    const lnR = Math.log(r); // ln(r)

    // 计算指数部分: (c.re + i·c.im) · (ln(r) + i·θ)
    const expRe = Math.exp(c.re * lnR - c.im * theta); // 结果的模长
    const expIm = c.re * theta + c.im * lnR; // 结果的辐角

    // 还原为直角坐标
    return new Complex(expRe * Math.cos(expIm), expRe * Math.sin(expIm));
  }

  /**
   * 将复数格式化为字符串: "a.xxxx ± b.xxxx i"
   * @returns {string}
   */
  toString() {
    const sign = this.im >= 0 ? "+" : "-";
    return `${this.re.toFixed(4)} ${sign} ${Math.abs(this.im).toFixed(4)}i`;
  }
}

/**
 * 从 "a,b" 格式的字符串解析复数
 * @param {string} str - 如 "1,2" 表示 1+2i
 * @returns {Complex}
 */
function parseComplex(str) {
  const parts = str.split(",");
  return new Complex(parseFloat(parts[0]) || 0, parseFloat(parts[1]) || 0);
}

/**
 * 根据运算符对两个复数执行相应的运算
 * @param {Complex} z1 - 第一个复数
 * @param {Complex} z2 - 第二个复数
 * @param {string} op - 运算符: "+" "-" "*" "/" "^"
 * @returns {Complex}
 * @throws {Error} 当运算符未知时抛出
 */
function computeComplex(z1, z2, op) {
  switch (op) {
    case "+":
      return z1.add(z2);
    case "-":
      return z1.sub(z2);
    case "*":
      return z1.mul(z2);
    case "/":
      return z1.div(z2);
    case "^":
      return z1.pow(z2);
    default:
      throw new Error("未知运算");
  }
}

/**
 * 计算复数的模长和辐角（极坐标属性）
 * @param {Complex} z - 复数
 * @returns {{modulus: number, argument: number}} 模长和辐角（度）
 */
function computeProps(z) {
  const modulus = Math.hypot(z.re, z.im); // |z| = √(a²+b²)
  const argument = (Math.atan2(z.im, z.re) * 180) / Math.PI; // arg(z) 转角度
  return { modulus, argument };
}
