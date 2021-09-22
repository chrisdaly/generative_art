const canvas = document.querySelector("canvas");
const ctx = canvas.getContext("2d");

const colors = d3.scaleSequential(d3.interpolateSpectral).domain([0, 1]);
const random = () => Math.random() > 0.5;

const size = 600;
const step = 40;
const child = 4;

function draw(x, y, width, height, top) {
  ctx.lineWidth = 0.1;
  ctx.beginPath();
  ctx.moveTo(x, y);
  if (top) {
    ctx.bezierCurveTo(x, y + height, x + width, y + height, x + width, y);
  } else {
    ctx.bezierCurveTo(x, y - height, x - width, y - height, x - width, y);
  }

  ctx.strokeStyle = colors(Math.random());
  ctx.stroke();
  while (width > 0 && height > 0) {
    width -= child;
    height -= child;
    draw(x, y, width, height, top);
  }
}

for (var x = 0; x < size; x += step) {
  for (var y = 0; y < size; y += step) {
    draw(x, y, step, step, false);
    draw(x, y, step, step, true);
  }
}
