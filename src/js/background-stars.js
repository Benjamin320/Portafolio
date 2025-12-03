function drawStars() {
  const canvas = document.getElementById("stars");
  const ctx = canvas.getContext("2d");
  // tamaño nítido según la pantalla
  const DPR = window.devicePixelRatio || 1;
  canvas.width = window.innerWidth * DPR;
  canvas.height = window.innerHeight * DPR;
  canvas.style.width = window.innerWidth + "px";
  canvas.style.height = window.innerHeight + "px";
  ctx.setTransform(DPR, 0, 0, DPR, 0, 0);

  ctx.clearRect(0, 0, canvas.width, canvas.height);

  const NUM_STARS = 200;
  for (let i = 0; i < NUM_STARS; i++) {
    const x = Math.random() * window.innerWidth;
    const y = Math.random() * window.innerHeight;
    const radius = Math.random() * 1.5 + 0.2;
    ctx.beginPath();
    ctx.arc(x, y, radius, 0, Math.PI * 2);
    ctx.fillStyle = "white";
    ctx.globalAlpha = Math.random() * 0.8 + 0.2;
    ctx.shadowColor = "#fff";
    ctx.shadowBlur = 5;
    ctx.fill();
    ctx.globalAlpha = 1;
    ctx.shadowBlur = 0;
  }
}

drawStars();
// window.addEventListener("resize", drawStars);
