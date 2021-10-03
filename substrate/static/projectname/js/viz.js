class Line {
  constructor(x1, y1, x2, y2, theta, color, parentId, level) {
    this.x1 = x1;
    this.y1 = y1;
    this.x2 = x2;
    this.y2 = y2;
    this.theta = theta;
    this.parentId = parentId;
    this.resolved = false;
    this.color = color;
    this.hadChildren = false;
    this.intersection = null;
    this.id = `${this.x1}_${this.x2}_${this.x2}_${this.y2}`;
    this.level = level;
  }

  checkIntersections(lines) {
    if (this.x2 <= 0 || this.x2 >= canvas.width || this.y2 <= 0 || this.y2 >= canvas.height) {
      this.resolved = true;
      return true;
    }

    lines
      .filter((d) => d.id !== this.id && d.id !== this.parentId) //&& d.resolved === false
      .forEach((l1) => {
        let intersection = intersect(this, l1);
        if (intersection !== false) {
          let distanceToIntersection = dist(this.x2, this.y2, intersection.x, intersection.y);
          if (distanceToIntersection <= step) {
            // ctx.lineWidth = 1;
            // ctx.beginPath();
            // ctx.arc(intersection.x, intersection.y, 2, 0, 2 * Math.PI);
            // ctx.stroke();
            this.resolved = true;
          }
        }
      });
  }

  increment(step) {
    if (this.resolved === true) {
      return;
    } else {
      this.x2 += Math.cos(this.theta) * step;
      this.y2 += Math.sin(this.theta) * step;
    }
  }

  draw(ctx) {
    ctx.strokeStyle = this.color;
    ctx.lineWidth = 3.5 - this.level;
    let opacity = Math.max(1 - this.level * 0.005, 0.5);
    ctx.globalAlpha = opacity;

    ctx.beginPath();
    ctx.moveTo(this.x1, this.y1);
    ctx.lineTo(this.x2, this.y2);
    ctx.stroke();
  }
}

const dist = (x1, y1, x2, y2) => Math.sqrt((x1 - x2) ** 2 + (y1 - y2) ** 2);

const generateLine = () => {
  let x1 = 50 + Math.floor(Math.random() * canvas.width - 50);
  let y1 = 50 + Math.floor(Math.random() * canvas.height - 50);
  let x2 = x1;
  let y2 = y1;
  let theta = Math.floor(Math.random() * 360) * (Math.PI / 180);
  let color = colorPicker(); //"Black";
  let line = new Line(x1, y2, x2, y2, theta, color, "seed", 0);

  return line;
};

const generateChild = (parent) => {
  let x1 = Math.floor(Math.random() * Math.abs(parent.x1 - parent.x2)) + Math.min(parent.x1, parent.x2);
  imaginaryLine = new Line(x1, 0, x1, canvas.height, 0, 0);
  intersection = intersect(parent, imaginaryLine);

  let y1 = intersection.y;
  let x2 = x1;
  let y2 = y1;
  var clockWise = Math.random() < 0.5 ? 1 : -1; // 1

  let theta = parent.theta + clockWise * (90 * (Math.PI / 180));
  let color = parent.color; //"Black"; //colorPicker();
  let level = parent.level + 1;
  let line = new Line(x1, y2, x2, y2, theta, color, parent.id, level);

  return line;
};

function intersect(l1, l2) {
  x1 = l1["x1"];
  y1 = l1["y1"];
  x2 = l1["x2"];
  y2 = l1["y2"];

  x3 = l2["x1"];
  y3 = l2["y1"];
  x4 = l2["x2"];
  y4 = l2["y2"];

  var ua,
    ub,
    denom = (y4 - y3) * (x2 - x1) - (x4 - x3) * (y2 - y1);
  if (denom == 0) {
    return false;
  }
  ua = ((x4 - x3) * (y1 - y3) - (y4 - y3) * (x1 - x3)) / denom;
  ub = ((x2 - x1) * (y1 - y3) - (y2 - y1) * (x1 - x3)) / denom;
  x = x1 + ua * (x2 - x1);
  y = y1 + ua * (y2 - y1);

  if (x < 0 || x > canvas.width || y < 0 || y > canvas.height) return false;
  if (x < x3 && x < x4) return false;
  if (x > x3 && x > x4) return false;
  if (y < y3 && y < y4) return false;
  if (y > y3 && y > y4) return false;
  return { x, y };
}

const maxLines = 500;
const numChildrenToSpawn = 3;
const maxLevels = 5;

const canvas = document.querySelector("canvas");
const ctx = canvas.getContext("2d");

const step = 1;
const numSeeds = 3;
const spacingTolerance = 5;
const colorPicker = () => d3.rgb(d3.interpolateSinebow(Math.random()));

let lines = Array(numSeeds)
  .fill()
  .map((_, i) => generateLine());

ctx.globalCompositeOperation = "multiply";
ctx.lineCap = "round";
ctx.lineWidth = 3;

const animate = () => {
  requestAnimationFrame(animate);

  if (lines.length >= maxLines) {
    // debugger;
  }
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  lines.forEach((p) => {
    p.increment(step);
    p.checkIntersections(lines);
    if ((p.resolved === true) & (p.hadChildren === false) & (p.level < maxLevels)) {
      if (lines.length < maxLines && Math.abs(p.x1 - p.x2) >= spacingTolerance) {
        let children = Array(numChildrenToSpawn)
          .fill()
          .map((_, i) => generateChild(p));

        lines = [...lines, ...children];
        lines = lines.filter((d) => !Object.values(d).some((x) => x === undefined && x !== null && x !== ""));
        p.hadChildren = true;
      }
    }
    p.draw(ctx);
  });
};

requestAnimationFrame(animate);
