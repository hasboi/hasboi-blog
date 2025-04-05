document.addEventListener("DOMContentLoaded", function () {
  document.querySelectorAll(".spoiler-click").forEach((el) => {
    el.addEventListener("click", () => {
      el.classList.toggle("revealed");
    });
  });
});
