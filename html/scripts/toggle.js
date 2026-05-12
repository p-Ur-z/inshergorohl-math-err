function toggleCard(header) {
  const content = header.nextElementSibling;
  const img = header.querySelector(".toggle-icon img");
  content.classList.toggle("expanded");

  if (content.classList.contains("expanded")) {
    img.src = "../icons/collapse.svg";
    img.alt = "收起";
  } else {
    img.src = "../icons/expand.svg";
    img.alt = "展开";
  }
}
