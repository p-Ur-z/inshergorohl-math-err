/**
 * 理解难度: ☁️☁️
 * 复杂度: ⚡️
 *
 * MathJax 4.x 全局配置
 *
 * MathJax 是一个开源 LaTeX 渲染引擎，能将页面中的 LaTeX 公式
 * 转换为美观的数学符号显示。本配置告诉 MathJax 如何识别公式。
 */
window.MathJax = {
  tex: {
    // 行内公式分隔符（与正文混排的公式）
    inlineMath: [
      ["$", "$"], // 例: $x^2 + y^2 = 1$
      ["\\(", "\\)"], // 例: \(x^2 + y^2 = 1\)
    ],
    // 独立公式分隔符（独占一行的公式）
    displayMath: [
      ["$$", "$$"], // 例: $$\sum_{i=1}^n i$$
      ["\\[", "\\]"], // 例: \[\int_0^1 x dx\]
    ],
    // 允许在文本中转义 $ 符号
    processEscapes: true,
  },
  options: {
    // 跳过带有 "no-mathjax" 类的元素，不渲染其中的公式
    ignoreHtmlClass: "no-mathjax",
    // 只处理带有 "math" 类的元素
    processHtmlClass: "math",
  },
};

/**
 * 动态加载 MathJax 脚本
 *
 * 使用 IIFE（立即执行函数）创建 <script> 标签并插入 <head>，
 * 避免阻塞页面渲染（async 加载）。
 */
(function loadMathJax() {
  const script = document.createElement("script");
  script.id = "MathJax-script";
  script.async = true; // 异步加载，不阻塞页面
  script.src = "https://cdn.jsdelivr.net/npm/mathjax@4/tex-mml-chtml.js";
  document.head.appendChild(script);
})();
