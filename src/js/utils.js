const button__nav = document.querySelector(".button__nav");
const navbar = document.querySelector(".nav__menu");

export const addNavBlur = () => {
  const navbar = document.getElementById("navbar");
  const theme = document.querySelector(".theme");

  window.addEventListener("scroll", () => {
    if (window.scrollY + window.innerHeight >= document.body.scrollHeight) {
      // console.log("hiola");
      hideBox(theme);
      return;
    }

    if (window.scrollY > 30) {
      navbar.classList.add("nav--blur");
      showBox(theme);
      return;
    }

    if (window.scrollY < 30) {
      navbar.classList.remove("nav--blur");

      if (window.scrollY == 0) {
        hideBox(theme);
      }
      return;
    }
  });
};

const showBox = (element) => {
  element.style.display = "flex";
  requestAnimationFrame(() => {
    element.classList.add("theme--visible");
    element.classList.remove("theme--hidden");
  });
};

const hideBox = (element) => {
  // console.log(element);
  element.classList.add("theme--hidden");
  element.classList.remove("theme--visible");
  element.addEventListener(
    "transitionend",
    () => {
      element.style.display = "none";
    },
    { once: true }
  );
};

export const toggleTheme = (theme) => {
  document.documentElement.setAttribute("data-theme", theme);
  localStorage.setItem("theme", theme);
};

button__nav.addEventListener("click", () => {
  navbar.classList.toggle("nav--open");
});
