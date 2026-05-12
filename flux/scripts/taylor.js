const gamma = 0.5772156649015329;

// 预计算阶乘缓存
const factCache = [1, 1];
function fact(n) {
  if (factCache[n] !== undefined) return factCache[n];
  for (let i = factCache.length; i <= n; i++) {
    factCache[i] = factCache[i - 1] * i;
  }
  return factCache[n];
}

function Si(x) {
  let s = 0;
  for (let n = 0; n < 20; n++) {
    s += ((-1) ** n * x ** (2 * n + 1)) / ((2 * n + 1) * fact(2 * n + 1));
  }
  return s;
}

function Ci(x) {
  let s = 0;
  for (let n = 1; n < 20; n++) {
    s += ((-1) ** n * x ** (2 * n)) / (2 * n * fact(2 * n));
  }
  return gamma + Math.log(x) + s;
}

function Ei(x) {
  let s = 0;
  for (let n = 1; n < 20; n++) {
    s += x ** n / (n * fact(n));
  }
  return gamma + Math.log(Math.abs(x)) + s;
}

const Li = (x) => Ei(Math.log(x));

function erf(x) {
  let s = 0;
  for (let n = 0; n < 20; n++) {
    s += ((-1) ** n * x ** (2 * n + 1)) / (fact(n) * (2 * n + 1));
  }
  return (2 / Math.sqrt(Math.PI)) * s;
}

const specialFunctions = { Si, Ci, Ei, Li, erf };

function computeTaylor(funcName, x) {
  const fn = specialFunctions[funcName];
  return fn ? fn(x) : Math[funcName](x);
}
