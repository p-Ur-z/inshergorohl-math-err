// 菜单切换
let currentMenu = null;

function switchMenu(menuId) {
  if (currentMenu === menuId) return;
  currentMenu = menuId;

  document.querySelectorAll(".nav-item").forEach((item) => {
    if (item.getAttribute("data-menu") === menuId) {
      item.classList.add("active");
    } else {
      item.classList.remove("active");
    }
  });

  document.querySelectorAll(".page-content").forEach((content) => {
    if (content.id === `page-${menuId}`) {
      content.style.display = "block";
    } else {
      content.style.display = "none";
    }
  });

  // 直接显示当前菜单项的文字
  const activeItem = document.querySelector(".nav-item.active");
  const title = activeItem ? activeItem.innerText : "";
  document.getElementById("page-title").innerText = title;

  if (window.MathJax && typeof MathJax.typesetPromise === "function") {
    MathJax.typesetPromise();
  }
}

document.addEventListener("DOMContentLoaded", () => {
  document.querySelectorAll(".nav-item").forEach((item) => {
    item.addEventListener("click", () => {
      const menuId = item.getAttribute("data-menu");
      if (menuId) switchMenu(menuId);
    });
  });

  const firstMenu = document.querySelector(".nav-item.active");
  if (firstMenu) {
    switchMenu(firstMenu.getAttribute("data-menu"));
  }
});
