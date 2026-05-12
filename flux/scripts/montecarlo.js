function monteCarloIntegral(fExpr, region, R, a, b, z0, z1, N = 800000) {
  let inside = 0;
  let sum = 0;

  for (let i = 0; i < N; i++) {
    let x = Math.random() * 2 - 1;
    let y = Math.random() * 2 - 1;
    let z = Math.random() * 2 - 1;

    let ok = false;
    switch (region) {
      case "circle":
        ok = x * x + y * y <= R * R;
        break;
      case "ellipse":
        ok = (x * x) / (a * a) + (y * y) / (b * b) <= 1;
        break;
      case "cylinder":
        ok = x * x + y * y <= R * R && z >= z0 && z <= z1;
        break;
      case "sphere":
        ok = x * x + y * y + z * z <= R * R;
        break;
    }

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

  let vol;
  switch (region) {
    case "circle":
      vol = Math.PI * R * R;
      break;
    case "ellipse":
      vol = Math.PI * a * b;
      break;
    case "cylinder":
      vol = Math.PI * R * R * (z1 - z0);
      break;
    case "sphere":
      vol = (4 / 3) * Math.PI * R * R * R;
      break;
    default:
      vol = 1;
  }

  const result = (vol * sum) / inside;
  return { result, inside, vol, N };
}
