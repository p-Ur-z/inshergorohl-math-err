// 特殊函数
const gamma = 0.5772156649015329;
const factorial = (k) => (k <= 1 ? 1 : k * factorial(k - 1));

function Si(x) {
  let s = 0;
  for (let n = 0; n < 20; n++)
    s +=
      (Math.pow(-1, n) * Math.pow(x, 2 * n + 1)) /
      ((2 * n + 1) * factorial(2 * n + 1));
  return s;
}

function Ci(x) {
  let s = 0;
  for (let n = 1; n < 20; n++)
    s += (Math.pow(-1, n) * Math.pow(x, 2 * n)) / (2 * n * factorial(2 * n));
  return gamma + Math.log(x) + s;
}

function Ei(x) {
  let s = 0;
  for (let n = 1; n < 20; n++) s += Math.pow(x, n) / (n * factorial(n));
  return gamma + Math.log(Math.abs(x)) + s;
}

function Li(x) {
  return Ei(Math.log(x));
}

function erf(x) {
  let s = 0;
  for (let n = 0; n < 20; n++)
    s +=
      (Math.pow(-1, n) * Math.pow(x, 2 * n + 1)) / (factorial(n) * (2 * n + 1));
  return (2 / Math.sqrt(Math.PI)) * s;
}

// 计算泰勒展开值
function computeTaylor(funcName, x) {
  switch (funcName) {
    case "Si":
      return Si(x);
    case "Ci":
      return Ci(x);
    case "Ei":
      return Ei(x);
    case "Li":
      return Li(x);
    case "erf":
      return erf(x);
    default:
      return Math[funcName](x);
  }
}
