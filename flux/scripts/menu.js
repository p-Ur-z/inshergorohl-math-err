/**
 * 理解难度: ☁️☁️☁️
 * 复杂度: ⚡️⚡️
 *
 * 侧边栏菜单切换模块
 *
 * 用于工具页面的侧边栏导航。每个工具页可以有多个子页面（如数值积分
 * 包含定积分、二重积分、曲线积分、三重积分），通过点击侧边栏菜单项
 * 来切换显示不同的输入表单。
 *
 * ============================================================
 * 工具页面 DOM 结构约定（新建工具页时请遵循此模板）
 * ============================================================
 *
 * <aside class="sidebar">
 *   <nav class="sidebar-nav">
 *     <!-- 每个菜单项必须有 data-menu 属性和 .nav-item 类 -->
 *     <!-- 第一个菜单项标记 .active 作为默认页 -->
 *     <div class="nav-item active" data-menu="page1">菜单1</div>
 *     <div class="nav-item" data-menu="page2">菜单2</div>
 *   </nav>
 * </aside>
 *
 * <main class="main-content">
 *   <div class="top-bar">
 *     <h1 id="page-title"><!-- 自动填充为当前菜单文字 --></h1>
 *   </div>
 *
 *   <div class="content-scroll">
 *     <!-- 每个页面容器 id 必须是 "page-{data-menu值}" -->
 *     <!-- 且带有 .page-content 类 -->
 *     <div id="page-page1" class="page-content">...</div>
 *     <div id="page-page2" class="page-content" style="display:none">...</div>
 *   </div>
 *
 *   <div class="result-footer">
 *     <div class="result-content" id="result-area"></div>
 *     <button class="calc-icon" onclick="handleCalc()">计算</button>
 *   </div>
 * </main>
 *
 * 关键元素 ID / class:
 *   .nav-item[data-menu]  — 侧边栏菜单项（点击触发切换）
 *   .page-content         — 页面内容容器（通过 display 切换）
 *   #page-title           — 顶部标题（自动更新为菜单文字）
 *   #result-area          — 底部结果展示区（由各 calc 函数填充）
 */

/** 当前激活的菜单 ID，用于避免重复切换 */
let currentMenu = null;

/**
 * 切换到指定菜单对应的页面内容
 *
 * 实现逻辑:
 *  1. 更新侧边栏 .nav-item 的 active 样式
 *  2. 显示/隐藏对应的 .page-content 内容区
 *  3. 更新顶部标题栏文字
 *  4. 如果页面有 LaTeX 公式，通知 MathJax 重新渲染
 *
 * @param {string} menuId - 菜单标识，对应 data-menu 属性值和 page-{menuId} 的 ID
 */
function switchMenu(menuId) {
  // 如果目标菜单已是当前菜单，无需切换
  if (currentMenu === menuId) return;
  currentMenu = menuId;

  // 1. 更新侧边栏高亮：给对应项加 active，其余移除
  document.querySelectorAll(".nav-item").forEach((item) => {
    if (item.getAttribute("data-menu") === menuId) {
      item.classList.add("active");
    } else {
      item.classList.remove("active");
    }
  });

  // 2. 切换内容区：显示目标页面，隐藏其余
  document.querySelectorAll(".page-content").forEach((content) => {
    if (content.id === `page-${menuId}`) {
      content.style.display = "block";
    } else {
      content.style.display = "none";
    }
  });

  // 3. 更新顶部标题为当前菜单项文字
  const activeItem = document.querySelector(".nav-item.active");
  const title = activeItem ? activeItem.innerText : "";
  document.getElementById("page-title").innerText = title;

  // 4. 触发 MathJax 重新渲染（新显示的页面可能包含未渲染的 LaTeX）
  if (window.MathJax && typeof MathJax.typesetPromise === "function") {
    MathJax.typesetPromise();
  }
}

/**
 * 页面加载完成后初始化菜单
 *
 * - 为所有 .nav-item 绑定点击事件
 * - 自动激活第一个标记为 active 的菜单项
 */
document.addEventListener("DOMContentLoaded", () => {
  // 为每个菜单项绑定点击切换事件
  document.querySelectorAll(".nav-item").forEach((item) => {
    item.addEventListener("click", () => {
      const menuId = item.getAttribute("data-menu");
      if (menuId) switchMenu(menuId);
    });
  });

  // 页面初始状态：激活第一个菜单
  const firstMenu = document.querySelector(".nav-item.active");
  if (firstMenu) {
    switchMenu(firstMenu.getAttribute("data-menu"));
  }
});
