expr = input("请输入通项（用 n 表示）：")
N = int(input("要显示前几项？"))

print("前", N, "项为：")
for n in range(1, N + 1):
    value = eval(expr, {"n": n})
    print(f"a{n} = {value}")
