// 复数类
class Complex {
  // 实例构造器
  // re: 实部
  // im: 虚部
  constructor(re, im) {
    this.re = re;
    this.im = im;
  }

  // 加法
  // c = c_1 + c_2 ->
  // c.re = c_1.re + c_2.re
  // c.im = c_1.im + c_2.im
  add(c) {
    return new Complex(this.re + c.re, this.im + c.im);
  }

  // 减法
  // c = c_1 - c_2 ->
  // c.re = c_1.re - c_2.re
  // c.im = c_1.im - c_2.im
  sub(c) {
    return new Complex(this.re - c.re, this.im - c.im);
  }

  // 乘法
  // c = c_1 * c_2 ->
  // c.re = c_1.re * c_2.re - c_1.im * c_2.im
  // c.im = c_1.re * c_2.im + c_1.im * c_2.re
  mul(c) {
    return new Complex(
      this.re * c.re - this.im * c.im,
      this.re * c.im + this.im * c.re,
    );
  }

  // 除法
  // c = c_1 / c_2 ->
  // c.re = (c_1.re * c_2.re + c_1.im * c_2.im) / d
  // c.im = (c_1.im * c_2.re - c_1.re * c_2.im) / d
  div(c) {
    const d = c.re * c.re + c.im * c.im;

    if (d === 0) {
      throw new Error("除零溢出");
    }

    const re = (this.re * c.re + this.im * c.im) / d;
    const im = (this.im * c.re - this.re * c.im) / d;
    return new Complex(re, im);
  }

  // 幂运算
  // c = c_1 ^ c_2 ->
  // r = sqrt(c_1.re^2 + c_1.im^2)
  // theta = atan2(c_1.im, c_1.re)
  //
  // lnR = ln(r)
  // expRe = exp(c_2.re * ln(r) - c_2.im * theta)
  // expIm = c_2.re * theta + c_2.im * ln(r)
  //
  // c.re = r * expRe * cos(expIm)
  // c.im = r * expRe * sin(expIm)
  pow(c) {
    const r = Math.sqrt(this.re * this.re + this.im * this.im);
    const theta = Math.atan2(this.im, this.re);

    const lnR = Math.log(r);
    const expRe = Math.exp(c.re * lnR - c.im * theta);
    const expIm = c.re * theta + c.im * lnR;

    const re = expRe * Math.cos(expIm);
    const im = expRe * Math.sin(expIm);
    return new Complex(re, im);
  }

  // 转化为字符串以演示
  toString() {
    const im_sign = this.im >= 0 ? "+" : "-";
    const re_str = this.re.toFixed(4);
    const im_str = Math.abs(this.im).toFixed(4);
    return `${re_str} ${im_sign} ${im_str}i`;
  }
}

// 解析复数输入
// 纯函数，返回 Complex 实例
function parseComplex(str) {
  const parts = str.split(",");

  const re = parseFloat(parts[0]) || 0;
  const im = parseFloat(parts[1]) || 0;
  return new Complex(re, im);
}

// 计算复数运算
// 纯函数，接收参数，返回结果对象
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
      throw new Error("未定义的运算");
  }
}

// 计算复数属性
// 纯函数，接收 Complex 对象，返回模长和辐角
function computeProps(z) {
  const modulus = Math.sqrt(z.re * z.re + z.im * z.im);
  const argument = (Math.atan2(z.im, z.re) * 180) / Math.PI;
  return { modulus, argument };
}
