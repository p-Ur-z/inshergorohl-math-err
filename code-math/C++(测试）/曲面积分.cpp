#include <iostream>
#include <cmath>

using namespace std;

double f(double x, double y, double z) {
    return x * y * z;
}

double surface_integral(double (*f)(double, double, double),
                        double xu(double, double), double yu(double, double), double zu(double, double),
                        double xv(double, double), double yv(double, double), double zv(double, double),
                        double u1, double u2, double v1, double v2, int nu, int nv) {
    double du = (u2 - u1) / nu, dv = (v2 - v1) / nv;
    double sum = 0.0;
    for (int i = 0; i < nu; ++i) {
        double u = u1 + (i + 0.5) * du;
        for (int j = 0; j < nv; ++j) {
            double v = v1 + (j + 0.5) * dv;
            double rx = xu(u, v), ry = yu(u, v), rz = zu(u, v);
            double sx = xv(u, v), sy = yv(u, v), sz = zv(u, v);
            double nx = ry * sz - rz * sy;
            double ny = rz * sx - rx * sz;
            double nz = rx * sy - ry * sx;
            double dS = sqrt(nx * nx + ny * ny + nz * nz);
            double x = xu(u, v), y = yu(u, v), z = zu(u, v);
            sum += f(x, y, z) * dS * du * dv;
        }
    }
    return sum;
}

int main() {
    auto sphere_x = [](double u, double v) { return sin(u) * cos(v); };
    auto sphere_y = [](double u, double v) { return sin(u) * sin(v); };
    auto sphere_z = [](double u, double v) { return cos(u); };
    auto sphere_uu = [](double u, double v) { return cos(u) * cos(v); };
    auto sphere_vu = [](double u, double v) { return cos(u) * sin(v); };
    auto sphere_wu = [](double u, double v) { return -sin(u); };
    auto sphere_uv = [](double u, double v) { return -sin(u) * sin(v); };
    auto sphere_vv = [](double u, double v) { return sin(u) * cos(v); };
    auto sphere_wv = [](double u, double v) { return 0; };

    double result = surface_integral(
        f,
        sphere_x, sphere_y, sphere_z,
        sphere_uu, sphere_vu, sphere_wu,
        sphere_uv, sphere_vv, sphere_wv,
        0, M_PI, 0, 2 * M_PI, 100, 100
    );

    cout.precision(10);
    cout << "曲面积分结果: " << result << endl;
    return 0;
}
