// const width = 400;
// const height = width;

// const canvas = document.getElementById("canvas");
// const ctx = canvas.getContext("2d");

// const numRings = 10;
// const distance = 10;

// const rings = d3.range(numRings);

// rings.map((n) => {
//   let radius = n * distance;
//   ctx.beginPath();
//   ctx.arc(width / 2, height / 2, radius, 0, Math.PI * 2, true);
//   ctx.stroke();
// });

// let spacing = 1;

// if (spacing === 8) {
//   spacing = 0;
//   radius = n * d;
// }

// while (true) {
// ctx.clearRect(0, 0, width, height);

// });
// }
// spacing = spacing + .5;

const canvas = document.querySelector("canvas");
const ctx = canvas.getContext("2d");

// Draw shapes
for (let i = 0; i <= 3; i++) {
  for (let j = 0; j <= 2; j++) {
    ctx.beginPath();
    let x = 25 + j * 50; // x coordinate
    let y = 25 + i * 50; // y coordinate
    let radius = 20; // Arc radius
    let startAngle = 0; // Starting point on circle
    let endAngle = Math.PI + (Math.PI * j) / 2; // End point on circle
    let counterclockwise = i % 2 == 1; // Draw counterclockwise

    ctx.arc(x, y, radius, startAngle, endAngle, counterclockwise);

    if (i > 1) {
      ctx.fill();
    } else {
      ctx.stroke();
    }
  }
}
