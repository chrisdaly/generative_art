const createCanvas = (width, height) => {
  var canvas = document.createElement("canvas");
  canvas.id = "canvas";
  canvas.width = width;
  canvas.height = height;
  canvas.style.border = "1px solid";
  var body = document.getElementsByTagName("body")[0];
  body.appendChild(canvas);
  return canvas;
};

const drawCircles = () => {
  // If the ripple delta has propogated to the next circle, reset ripple.
  ripple = ripple >= padding ? 0 : ripple;

  ctx.clearRect(0, 0, width, height);
  rings.map((n) => {
    let radius = n * padding + ripple;
    let sAngle = Math.random() * Math.PI * 2;
    let eAngle = Math.random() * Math.PI * 2;
    let counterClockise = Math.random() < 0.5;

    ctx.beginPath();
    ctx.arc(width / 2, height / 2, radius, sAngle, eAngle, counterClockise);
    ctx.stroke();
    ctx.closePath();
  });
  ripple += 0.1;
};

const width = 400;
const height = width;
const numRings = 40;
const padding = 8;
let ripple = 0;

const canvas = createCanvas(width, height);
const ctx = canvas.getContext("2d");
const rings = d3.range(numRings);

drawCircles();

// animate
// setInterval(function () {
//   drawCircles();
// }, 5);
