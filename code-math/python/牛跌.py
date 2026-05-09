def newton_method(f, df, x0, tol=1e-10, max_iter=100):
    """
    牛顿迭代法求解 f(x)=0

    参数：
    f       : 原函数 f(x)
    df      : 导函数 f'(x)
    x0      : 初始猜测值
    tol     : 收敛精度
    max_iter: 最大迭代次数

    返回：
    (近似解, 迭代次数)
    """
    x = x0
    for i in range(max_iter):
        fx = f(x)
        dfx = df(x)

        if dfx == 0:
            raise ValueError("导数为 0，牛顿法无法继续")

        x_new = x - fx / dfx

        if abs(x_new - x) < tol:
            return x_new, i + 1

        x = x_new

    raise ValueError("未达到收敛，请检查初值或函数")


# =================== 示例 ===================
if __name__ == "__main__":
    import math

    # 例：求 x^2 - 2 = 0 的正根（√2）
    f = lambda x: x**2 - 2
    df = lambda x: 2 * x

    root, iters = newton_method(f, df, x0=1.0)
    print(f"近似解: {root}")
    print(f"迭代次数: {iters}")
    print(f"误差: {abs(root - math.sqrt(2))}")
