// 复数类
class Complex {
  constructor(re, im) {
    this.re = re;
    this.im = im;
  }

  add(c) {
    return new Complex(this.re + c.re, this.im + c.im);
  }

  sub(c) {
    return new Complex(this.re - c.re, this.im - c.im);
  }

  mul(c) {
    return new Complex(
      this.re * c.re - this.im * c.im,
      this.re * c.im + this.im * c.re,
    );
  }

  div(c) {
    const d = c.re * c.re + c.im * c.im;
    if (d === 0) throw new Error("除以零");
    return new Complex(
      (this.re * c.re + this.im * c.im) / d,
      (this.im * c.re - this.re * c.im) / d,
    );
  }

  pow(c) {
    const r = Math.hypot(this.re, this.im);
    const theta = Math.atan2(this.im, this.re);
    const lnR = Math.log(r);
    const expRe = Math.exp(c.re * lnR - c.im * theta);
    const expIm = c.re * theta + c.im * lnR;
    return new Complex(expRe * Math.cos(expIm), expRe * Math.sin(expIm));
  }

  toString() {
    const sign = this.im >= 0 ? "+" : "-";
    return `${this.re.toFixed(4)} ${sign} ${Math.abs(this.im).toFixed(4)}i`;
  }
}

function parseComplex(str) {
  const parts = str.split(",");
  return new Complex(parseFloat(parts[0]) || 0, parseFloat(parts[1]) || 0);
}

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

function computeProps(z) {
  const modulus = Math.hypot(z.re, z.im);
  const argument = (Math.atan2(z.im, z.re) * 180) / Math.PI;
  return { modulus, argument };
}
