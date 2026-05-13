/**
 * 理解难度: ☁️☁️
 * 复杂度: ⚡️⚡️
 *
 * 蒙特卡洛积分 — 通过随机撒点估计定积分值
 *
 * 核心思想: 在积分区域 Ω 内均匀随机采样 N 个点，用样本均值 × 区域体积
 * 来近似积分值。
 *
 * 公式: ∬∭_Ω f dV ≈ V(Ω) × (Σ f(xᵢ) / N_inside)
 *
 * 优点: 对高维积分和复杂区域尤其有效
 * 缺点: 收敛慢，误差 ∝ 1/√N，需要大量采样点
 *
 * @param {string} fExpr   - 被积函数表达式，如 "x*x + y*y"
 * @param {string} region  - 积分区域类型: "circle" | "ellipse" | "cylinder" | "sphere"
 * @param {number} R       - 半径参数
 * @param {number} a       - 椭圆半长轴
 * @param {number} b       - 椭圆半短轴
 * @param {number} z0      - 圆柱下底面 z 坐标
 * @param {number} z1      - 圆柱上底面 z 坐标
 * @param {number} N       - 采样点数（默认80万）
 * @returns {{result: number, inside: number, vol: number, N: number}|{error: string}}
 */
function monteCarloIntegral(fExpr, region, R, a, b, z0, z1, N = 800000) {
  let inside = 0; // 落在积分区域内的样本数
  let sum = 0; // 落在区域内样本的函数值累加

  // 主体循环：逐个随机采样
  for (let i = 0; i < N; i++) {
    // 在 [-1, 1]³ 立方体内均匀随机取点
    // 注意: 此范围需要覆盖积分区域（圆半径R=1时正好匹配）
    let x = Math.random() * 2 - 1;
    let y = Math.random() * 2 - 1;
    let z = Math.random() * 2 - 1;

    // 判断采样点是否落在指定区域内
    let ok = false;
    switch (region) {
      case "circle":
        // 圆: x² + y² ≤ R²
        ok = x * x + y * y <= R * R;
        break;
      case "ellipse":
        // 椭圆: x²/a² + y²/b² ≤ 1
        ok = (x * x) / (a * a) + (y * y) / (b * b) <= 1;
        break;
      case "cylinder":
        // 圆柱: x² + y² ≤ R² 且 z ∈ [z₀, z₁]
        ok = x * x + y * y <= R * R && z >= z0 && z <= z1;
        break;
      case "sphere":
        // 球: x² + y² + z² ≤ R²
        ok = x * x + y * y + z * z <= R * R;
        break;
    }

    // 只对区域内的点计算函数值
    if (ok) {
      inside++;
      try {
        // 将字符串编译为三元函数 f(x, y, z)
        const f = new Function("x", "y", "z", `return ${fExpr}`);
        sum += f(x, y, z);
      } catch (e) {
        return { error: e.message };
      }
    }
  }

  // 计算积分区域的精确体积（用于最终估算）
  let vol;
  switch (region) {
    case "circle":
      vol = Math.PI * R * R; // 圆面积: πR²
      break;
    case "ellipse":
      vol = Math.PI * a * b; // 椭圆面积: πab
      break;
    case "cylinder":
      vol = Math.PI * R * R * (z1 - z0); // 圆柱体积: πR²h
      break;
    case "sphere":
      vol = (4 / 3) * Math.PI * R * R * R; // 球体积: (4/3)πR³
      break;
    default:
      vol = 1;
  }

  // 积分 ≈ 区域体积 × 样本均值
  const result = (vol * sum) / inside;
  return { result, inside, vol, N };
}
