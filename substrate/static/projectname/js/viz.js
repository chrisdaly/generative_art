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
    this.level = level; // console.log(this);
  }

  checkIntersections(lines) {
    // take closest intersection?
    // only needs to check interesections in one vector direction
    if (this.x2 <= 0 || this.x2 >= canvas.width || this.y2 <= 0 || this.y2 >= canvas.height) {
      this.resolved = true;
      return true;
    }
    let point = { x: this.x2, y: this.y2 };
    lines
      .filter((d) => d.id !== this.id && d.id !== this.parentId)
      .forEach((l1) => {
        // let pointisOnLine = isOnLine(point, l1, 0.05);
        // if (pointisOnLine === true) {
        //   console.log("POINT ON LINE", point, l1);
        // ctx.beginPath();
        // ctx.arc(point.x, point.y, 4, 0, 2 * Math.PI);
        // ctx.stroke();
        // ctx.fill();
        //   this.resolved = true;
        //   return;
        // }

        let possibleIntersection = intersect(this, l1);

        if (possibleIntersection !== false) {
          // this.intersection = possibleIntersection;

          if (dist(this.x2, this.y2, possibleIntersection.x, possibleIntersection.y) <= 0.5) {
            // console.log("SMALL DISTLINE", point, l1);
            // ctx.beginPath();
            // ctx.arc(point.x, point.y, 1, 0, 2 * Math.PI);
            // ctx.stroke();
            this.resolved = true;
          }

          // console.log(possibleIntersection);
          // ctx.beginPath();
          // ctx.arc(possibleIntersection.x, possibleIntersection.y, 2, 0, 2 * Math.PI);
          // ctx.stroke();
        }
      });
  }

  increment(step) {
    // console.log(this.intersection(lines) === true);
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

function isOnLine(point, line, tolerance) {
  const a = dist(line.x1, line.y1, point.x, point.y);
  const b = dist(line.x2, line.y2, point.x, point.y);
  const c = dist(line.x1, line.y1, line.x2, line.x2);

  return tolerance >= a + b - c && a + b - c >= tolerance * -1;
}

function isBetween(a, b, c) {
  epsilon = 0;
  crossproduct = (c.y - a.y) * (b.x - a.x) - (c.x - a.x) * (b.y - a.y);

  // compare versus epsilon for floating point values, or != 0 if using integers
  if (Math.abs(crossproduct) > epsilon) return false;

  dotproduct = (c.x - a.x) * (b.x - a.x) + (c.y - a.y) * (b.y - a.y);
  if (dotproduct < 0) return false;

  squaredlengthba = (b.x - a.x) * (b.x - a.x) + (b.y - a.y) * (b.y - a.y);
  if (dotproduct > squaredlengthba) return false;

  return true;
}

// const checkInterSections = (line, otherLines) => {};

const generateLine = () => {
  let x1 = Math.floor(Math.random() * canvas.width);
  let y1 = Math.floor(Math.random() * canvas.height);
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
  // console.log("imaginaryLine", imaginaryLine);
  intersection = intersect(parent, imaginaryLine);
  // console.log("intersection", intersection);
  let y1 = intersection.y;
  let x2 = x1;
  let y2 = y1;
  var clockWise = Math.random() < 0.5 ? 1 : -1;

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

  return { x, y };
}

let maxLines = 500;
let numChildrenToSpawn = 2;
let maxLevels = 8;

const canvas = document.querySelector("canvas");
const ctx = canvas.getContext("2d");

const step = 3;
const numSeeds = 2;
const colorPicker = () => d3.rgb(d3.interpolateWarm(Math.random()));

let lines = Array(numSeeds)
  .fill()
  .map((_, i) => generateLine());

ctx.globalCompositeOperation = "multiply";
ctx.lineCap = "round";
ctx.lineWidth = 3;

const animate = () => {
  requestAnimationFrame(animate);
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  lines.forEach((p) => {
    p.increment(step);
    p.checkIntersections(lines);
    // console.log(p);
    // length = dist(p.x1, p.y1, p.x2, p.y2);
    if ((p.resolved === true) & (p.hadChildren === false) & (p.level < maxLevels)) {
      if (lines.length < maxLines) {
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

// TODO
// filter lines by unresolved / active is a better name
