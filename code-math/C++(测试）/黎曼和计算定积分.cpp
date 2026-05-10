#include <iostream>
#include <cmath>
#include <functional>

using namespace std;

// 这个是黎曼和（中点法）
double riemann(const function<double(double)>& f,
               double a, double b, int n) {
    double dx = (b - a) / n;
    double sum = 0.0;

    for (int i = 0; i < n; ++i) {
        double x = a + (i + 0.5) * dx;
        sum += f(x) * dx;
    }
    return sum;
}

int main() {
    double a, b;
    int n;

    cout << "请输入积分下限 a: ";
    cin >> a;
    cout << "请输入积分上限 b: ";
    cin >> b;
    cout << "请输入分割数 n: ";
    cin >> n;

    cout << "\n请选择被积函数：" << endl;
    cout << "1. f(x) = x^2" << endl;
    cout << "2. f(x) = sin(x)" << endl;
    cout << "3. f(x) = exp(x)" << endl;
    cout << "4. f(x) = x * sin(x)" << endl;
    cout << "5. f(x) = sqrt(x)" << endl;
    cout << "请输入选择（1-5）: ";

    int choice;
    cin >> choice;

    function<double(double)> f;

    switch (choice) {
        case 1:
            f = [](double x) { return x * x; };
            break;
        case 2:
            f = [](double x) { return sin(x); };
            break;
        case 3:
            f = [](double x) { return exp(x); };
            break;
        case 4:
            f = [](double x) { return x * sin(x); };
            break;
        case 5:
            f = [](double x) { return sqrt(x); };
            break;
        default:
            cout << "错误：无效的选择！" << endl;
            return 1;
    }

    double result = riemann(f, a, b, n);
    cout << "\n定积分近似值为: " << result << endl;

    return 0;
}
