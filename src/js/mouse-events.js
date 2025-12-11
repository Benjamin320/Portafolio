const escena = document.querySelector(".hero");
const montanaMain = document.querySelector(".montana-main");
const montanaSecond = document.querySelector(".montana-second");
const montanaThird = document.querySelector(".montana-third");
const personaje = document.querySelector(".contenedor-escena__img");

let targetX = 0;
let currentX = 0;

escena.addEventListener("mousemove", (e) => {
  const rect = escena.getBoundingClientRect();
  targetX = e.clientX - rect.left - rect.width / 2;
});

function animate() {
  currentX += (targetX - currentX) * 0.1;

  montanaMain.style.transform = `translateX(${currentX / 100}px)`;
  montanaSecond.style.transform = `translateX(${currentX / 60}px)`;
  montanaThird.style.transform = `translateX(${currentX / 40}px)`;
  personaje.style.transform = `translateX(${currentX / 20}px)`;

  requestAnimationFrame(animate);
}

animate();

// escena.addEventListener("mouseleave", () => {
//   montanaMain.style.transform = `translateX(0px)`;
//   montanaSecond.style.transform = `translateX(0px)`;
//   montanaThird.style.transform = `translateX(0px)`;
//   personaje.style.transform = `translateX(0px)`;
// });
