const canvas = document.getElementById("stars");
const ctx = canvas.getContext("2d");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

window.addEventListener("resize", () => {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
});

// Fondo negro sólido
ctx.fillStyle = "black";
ctx.fillRect(0, 0, canvas.width, canvas.height);

class Meteor {
  constructor() {
    this.reset();
  }

  reset() {
    if (Math.random() < 0.7) {
      // 70% desde la parte superior
      this.x = Math.random() * canvas.width;
      this.y = -50;
    } else {
      // 30% desde la izquierda más abajo
      this.x = -50;
      this.y = (Math.random() * canvas.height) / 2;
    }
    this.vx = Math.random() * 0.5 + 1;
    this.vy = this.vx; // diagonal 45°
    this.length = Math.random() * 80 + 30;
    this.delay = Math.random() * 300;
    this.counter = 0;
    this.active = false;
    this.alpha = Math.random() * 0.5 + 0.5;
  }

  update() {
    if (!this.active) {
      this.counter++;
      if (this.counter > this.delay) this.active = true;
      else return;
    }

    this.x += this.vx;
    this.y += this.vy;

    if (this.x > canvas.width * 1.3 || this.y > canvas.height * 1.3) {
      this.reset();
    }
  }

  draw() {
    if (!this.active) return;

    // Cabeza redonda
    ctx.beginPath();
    ctx.fillStyle = `rgba(255,255,255,${this.alpha})`;
    ctx.shadowBlur = 8;
    ctx.shadowColor = "white";
    ctx.arc(this.x, this.y, 1.3, 0, Math.PI * 2);
    ctx.fill();

    // Triángulo difuminado como estela
    ctx.beginPath();
    const angle = Math.PI / 4; // 45 grados
    const x1 = this.x - this.length * Math.cos(angle);
    const y1 = this.y - this.length * Math.sin(angle);
    const width = 4; // ancho de la base del triángulo

    ctx.moveTo(this.x, this.y); // punta (cabeza)
    ctx.lineTo(x1 - width, y1);
    ctx.lineTo(x1 + width, y1);
    ctx.closePath();

    // Gradiente para difuminar la estela
    const grad = ctx.createLinearGradient(this.x, this.y, x1, y1);
    grad.addColorStop(0, `rgba(255,255,255,${this.alpha})`);
    grad.addColorStop(1, "rgba(255,255,255,0)");

    ctx.fillStyle = grad;
    ctx.fill();
  }
}

const meteors = [];
const NUM_METEORS = 25;
for (let i = 0; i < NUM_METEORS; i++) {
  meteors.push(new Meteor());
}

function animate() {
  // Borrar todo el canvas para mantener fondo negro constante
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Dibujar meteoritos
  for (let meteor of meteors) {
    meteor.update();
    meteor.draw();
  }

  requestAnimationFrame(animate);
}

animate();
