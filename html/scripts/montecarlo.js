// 蒙特卡洛积分计算
function monteCarloIntegral(fExpr, region, R, a, b, z0, z1, N = 800000) {
  let inside = 0;
  let sum = 0;

  for (let i = 0; i < N; i++) {
    let x = Math.random() * 2 - 1;
    let y = Math.random() * 2 - 1;
    let z = Math.random() * 2 - 1;
    let ok = false;

    if (region === "circle") ok = x * x + y * y <= R * R;
    if (region === "ellipse") ok = (x * x) / (a * a) + (y * y) / (b * b) <= 1;
    if (region === "cylinder")
      ok = x * x + y * y <= R * R && z >= z0 && z <= z1;
    if (region === "sphere") ok = x * x + y * y + z * z <= R * R;

    if (ok) {
      inside++;
      try {
        const f = new Function("x", "y", "z", `return ${fExpr}`);
        sum += f(x, y, z);
      } catch (e) {
        return { error: e.message };
      }
    }
  }

  let vol =
    region === "circle"
      ? Math.PI * R * R
      : region === "ellipse"
        ? Math.PI * a * b
        : region === "cylinder"
          ? Math.PI * R * R * (z1 - z0)
          : region === "sphere"
            ? (4 / 3) * Math.PI * R * R * R
            : 1;

  const result = (vol * sum) / inside;

  return {
    result,
    inside,
    vol,
    N,
  };
}
