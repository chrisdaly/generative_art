const width = 400;
const height = width;

const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

const numRings = 40;
const padding = 8;
let delta = 0;
const rings = d3.range(numRings);

setInterval(function () {
  if (delta >= 8) {
    delta = 0;
  }
  ctx.clearRect(0, 0, width, height);
  rings.map((n) => {
    let radius = n * padding + delta;
    ctx.beginPath();
    ctx.arc(width / 2, height / 2, radius, 0, Math.PI * 2, true);
    ctx.stroke();
  });
  delta += 0.1;
}, 0.5);
