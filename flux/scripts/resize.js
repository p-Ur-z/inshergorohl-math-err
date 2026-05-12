/**
 * 布局拖拽调整模块
 *
 * 允许用户拖拽调整:
 *   - 侧边栏宽度（水平拖拽，范围 100px ~ 400px）
 *   - 底部结果栏高度（垂直拖拽，范围 80px ~ 400px）
 *
 * 拖拽时分割线显示主题色 var(--primary)
 */

(function initResize() {
  document.addEventListener("DOMContentLoaded", () => {
    createSidebarResizer();
    createFooterResizer();
  });

  /**
   * 创建侧边栏与主内容区之间的拖拽手柄（垂直分割线）
   */
  function createSidebarResizer() {
    const sidebar = document.querySelector(".sidebar");
    const main = document.querySelector(".main-content");
    if (!sidebar || !main) return;

    // 在 sidebar 和 main-content 之间插入拖拽手柄
    const handle = document.createElement("div");
    handle.className = "resize-handle resize-handle-h";
    sidebar.parentNode.insertBefore(handle, main);

    let startX, startWidth;
    const minW = 100,
      maxW = 400;

    handle.addEventListener("mousedown", (e) => {
      e.preventDefault();
      startX = e.clientX;
      startWidth = sidebar.offsetWidth;
      handle.classList.add("resize-active");
      document.body.style.cursor = "col-resize";
      document.body.style.userSelect = "none";

      function onMove(e) {
        const dx = e.clientX - startX;
        const newW = Math.min(maxW, Math.max(minW, startWidth + dx));
        sidebar.style.width = newW + "px";
      }

      function onUp() {
        handle.classList.remove("resize-active");
        document.body.style.cursor = "";
        document.body.style.userSelect = "";
        document.removeEventListener("mousemove", onMove);
        document.removeEventListener("mouseup", onUp);
      }

      document.addEventListener("mousemove", onMove);
      document.addEventListener("mouseup", onUp);
    });
  }

  /**
   * 创建内容区与底部结果栏之间的拖拽手柄（水平分割线）
   */
  function createFooterResizer() {
    const contentScroll = document.querySelector(".content-scroll");
    const footer = document.querySelector(".result-footer");
    if (!contentScroll || !footer) return;

    // 在 content-scroll 和 result-footer 之间插入拖拽手柄
    const handle = document.createElement("div");
    handle.className = "resize-handle resize-handle-v";
    contentScroll.parentNode.insertBefore(handle, footer);

    let startY, startHeight;
    const minH = 80,
      maxH = 400;

    handle.addEventListener("mousedown", (e) => {
      e.preventDefault();
      startY = e.clientY;
      startHeight = footer.offsetHeight;
      handle.classList.add("resize-active");
      document.body.style.cursor = "row-resize";
      document.body.style.userSelect = "none";

      function onMove(e) {
        // 向上拖 = footer 变高
        const dy = startY - e.clientY;
        const newH = Math.min(maxH, Math.max(minH, startHeight + dy));
        footer.style.height = newH + "px";
      }

      function onUp() {
        handle.classList.remove("resize-active");
        document.body.style.cursor = "";
        document.body.style.userSelect = "";
        document.removeEventListener("mousemove", onMove);
        document.removeEventListener("mouseup", onUp);
      }

      document.addEventListener("mousemove", onMove);
      document.addEventListener("mouseup", onUp);
    });
  }
})();
