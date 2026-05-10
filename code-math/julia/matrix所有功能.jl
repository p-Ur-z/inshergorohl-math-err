using LinearAlgebra

A = [1 2 3; 4 5 6; 7 8 9]
B = [9 8 7; 6 5 4; 3 2 1]

C = A * B
d = det(A)
L, U = lu(A)
Q, R = qr(A)
U_svd, S, V = svd(A)

println(C)
println(d)
println(L)
println(U)
println(Q)
println(R)
println(S)
