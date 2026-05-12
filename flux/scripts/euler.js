function eulerMethod(funcExpr, x0, y0, h, xn) {
  const f = new Function("x", "y", "return " + funcExpr + ";");
  let x = x0;
  let y = y0;
  const steps = Math.round((xn - x0) / h);
  let output = "x\t| y\n--------------------\n";
  output += x.toFixed(4) + "\t| " + y.toFixed(6) + "\n";

  for (let i = 0; i < steps; i++) {
    y = y + h * f(x, y);
    x = x + h;
    output += x.toFixed(4) + "\t| " + y.toFixed(6) + "\n";
  }
  return output;
}
