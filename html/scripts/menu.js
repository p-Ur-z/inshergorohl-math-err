// 侧边栏折叠
function toggleSidebar() {
  const sidebar = document.getElementById("sidebar");
  sidebar.classList.toggle("collapsed");
}

// 菜单切换
let currentMenu = null;

function switchMenu(menuId) {
  if (currentMenu === menuId) return;
  currentMenu = menuId;

  // 更新菜单激活状态
  document.querySelectorAll(".nav-item").forEach((item) => {
    if (item.getAttribute("data-menu") === menuId) {
      item.classList.add("active");
    } else {
      item.classList.remove("active");
    }
  });

  // 切换内容
  document.querySelectorAll(".page-content").forEach((content) => {
    if (content.id === `page-${menuId}`) {
      content.style.display = "block";
    } else {
      content.style.display = "none";
    }
  });

  // 更新标题
  const activeItem = document.querySelector(".nav-item.active");
  const title = activeItem ? activeItem.querySelector("span").innerText : "";
  document.getElementById("page-title").innerText = title;

  // 重新渲染 MathJax
  if (window.MathJax) {
    MathJax.typesetPromise();
  }
}

document.addEventListener("DOMContentLoaded", () => {
  // 绑定菜单点击
  document.querySelectorAll(".nav-item").forEach((item) => {
    item.addEventListener("click", () => {
      const menuId = item.getAttribute("data-menu");
      if (menuId) switchMenu(menuId);
    });
  });

  // 默认选中第一个
  const firstMenu = document.querySelector(".nav-item.active");
  if (firstMenu) {
    switchMenu(firstMenu.getAttribute("data-menu"));
  }
});
