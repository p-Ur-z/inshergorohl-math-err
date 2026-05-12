// MathJax 配置和加载
window.MathJax = {
  tex: {
    inlineMath: [
      ["$", "$"],
      ["\\(", "\\)"],
    ],
    displayMath: [
      ["$$", "$$"],
      ["\\[", "\\]"],
    ],
    processEscapes: true,
  },
  options: {
    ignoreHtmlClass: "no-mathjax",
    processHtmlClass: "math",
  },
};

// 动态加载 MathJax
(function loadMathJax() {
  const script = document.createElement("script");
  script.id = "MathJax-script";
  script.async = true;
  script.src = "https://cdn.jsdelivr.net/npm/mathjax@4/tex-mml-chtml.js";
  document.head.appendChild(script);
})();
