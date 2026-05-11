using Printf  # 用于格式化输出

"""
    数值积分工具集 (复刻自 inshergorohl-math-err 项目)
    支持定积分、二重积分、三重积分及曲线积分的数值估算。
"""

# ============================================
# 1. 定积分 ∫ f(x) dx
# ============================================
function definite_integral(f, a::Real, b::Real, n::Int; method::Symbol=:mid)
    h = (b - a) / n
    s = 0.0
    err_order = ""

    if method == :left
        s = sum(f(a + i * h) for i in 0:n-1) * h
        err_order = "O(h)"
    elseif method == :right
        s = sum(f(a + i * h) for i in 1:n) * h
        err_order = "O(h)"
    elseif method == :mid
        s = sum(f(a + (i + 0.5) * h) for i in 0:n-1) * h
        err_order = "O(h²)"
    elseif method == :trapezoid
        s = 0.5 * (f(a) + f(b)) + sum(f(a + i * h) for i in 1:n-1)
        s *= h
        err_order = "O(h²)"
    elseif method == :parabola  # Simpson's Rule
        # 确保 n 是偶数
        if n % 2 != 0
            n += 1
            h = (b - a) / n
        end
        s = f(a) + f(b)
        for i in 1:2:n-1
            s += 4 * f(a + i * h)
        end
        for i in 2:2:n-2
            s += 2 * f(a + i * h)
        end
        s *= h / 3
        err_order = "O(h⁴)"
    else
        error("未知方法: $method")
    end
    return (value=s, error_order=err_order)
end

# ============================================
# 2. 二重积分 ∬ f(x,y) dxdy
# ============================================
function double_integral(f, x1::Real, x2::Real, y1::Real, y2::Real, n::Int; method::Symbol=:mid)
    hx = (x2 - x1) / n
    hy = (y2 - y1) / n
    s = 0.0

    if method == :mid
        for i in 0:n-1, j in 0:n-1
            s += f(x1 + (i + 0.5) * hx, y1 + (j + 0.5) * hy)
        end
    end
    return s * hx * hy
end

# ============================================
# 3. 三重积分 ∭ f(x,y,z) dxdydz
# ============================================
function triple_integral(f, x0, x1, y0, y1, z0, z1, n::Int; method::Symbol=:mid)
    hx = (x1 - x0) / n
    hy = (y1 - y0) / n
    hz = (z1 - z0) / n
    s = 0.0

    if method == :mid
        for i in 0:n-1, j in 0:n-1, k in 0:n-1
            s += f(x0 + (i + 0.5) * hx, 
                   y0 + (j + 0.5) * hy, 
                   z0 + (k + 0.5) * hz)
        end
    end
    return s * hx * hy * hz
end

# ============================================
# 4. 曲线积分
# ============================================
function line_integral(x_func, y_func, t0::Real, t1::Real, n::Int; type::Symbol=:I)
    dt = (t1 - t0) / n
    s = 0.0

    for i in 0:n-1
        t = t0 + i * dt
        # 数值微分求 dx, dy
        dx = x_func(t + dt) - x_func(t)
        dy = y_func(t + dt) - y_func(t)
        
        if type == :I  # 第一类：标量场（弧长）
            s += sqrt(dx^2 + dy^2)
        elseif type == :II  # 第二类：向量场（投影）
            s += x_func(t) * dy - y_func(t) * dx
        end
    end
    return s
end

# ============================================
# Demo: 复刻原网页的默认示例
# ============================================
println("="^40)
println("数学分析 · 积分估算 (Julia 版)")
println("="^40)

# 1. 定积分示例: ∫ sin(x) dx from 0 to π
result1 = definite_integral(sin, 0, π, 200, method=:parabola)
@printf("1. 定积分 ∫sin(x) dx [0, π]: %.8f (误差阶: %s)\n", result1.value, result1.error_order)

# 2. 二重积分示例: ∬ (x² + y²) dxdy [0,1]x[0,1]
f2(x, y) = x^2 + y^2
result2 = double_integral(f2, 0, 1, 0, 1, 60)
@printf("2. 二重积分 ∬(x²+y²) dxdy: %.8f\n", result2)

# 3. 曲线积分示例: 单位圆
x(t) = cos(t)
y(t) = sin(t)
result3 = line_integral(x, y, 0, 2π, 400, type=:I)
@printf("3. 曲线积分 (单位圆周长): %.8f (理论值: %.8f)\n", result3, 2π)

# 4. 三重积分示例: ∭ (x+y+z) dxdydz [0,1]^3
f3(x, y, z) = x + y + z
result4 = triple_integral(f3, 0, 1, 0, 1, 0, 1, 40)
@printf("4. 三重积分 ∭(x+y+z) dxdydz: %.8f (理论值: 1.5)\n", result4)

println("="^40)
