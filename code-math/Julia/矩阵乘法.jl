function matmul(A, B)
    m, n = size(A)
    _, p = size(B)
    C = zeros(m, p)
    for i in 1:m
        for j in 1:p
            s = 0.0
            for k in 1:n
                s += A[i, k] * B[k, j]
            end
            C[i, j] = s
        end
    end
    return C
end

A = [1 2; 3 4]
B = [5 6; 7 8]
println(matmul(A, B))
