export const addNavBlur = () => {
  const navbar = document.getElementById("navbar");

  window.addEventListener("scroll", () => {
    if (window.scrollY > 30) {
      navbar.classList.add("nav--blur");
    }

    if (window.scrollY < 30) {
      navbar.classList.remove("nav--blur");
    }
  });
};
