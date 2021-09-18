const margin = { top: 20, right: 20, bottom: 40, left: 60 };
const width = 1200 - margin.left - margin.right;
const height = 200 - margin.top - margin.bottom;

data = d3.range(250).map((d) => {
  return {
    x: width * Math.random(),
    y: height * 2 * Math.random(),
    r: 90 * Math.random(),
    c: Math.random(),
  };
});

const svg = d3
  .select("#viz")
  .append("svg")
  .attr("width", width + margin.left + margin.right)
  .attr("height", height + margin.top + margin.bottom)
  .append("g")
  .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

const color = d3.scaleSequential(d3.interpolateSpectral).domain([0, 1]);
const side = 30;

svg
  .selectAll("rect")
  .data(data)
  .enter()
  .append("rect")
  .attr("x", (d) => d.x)
  .attr("y", (d) => d.y)
  .attr("height", side)
  .attr("width", side)
  //   .attr("stroke", "black")
  .attr("fill", (d) => color(d.c))
  .attr("rx", 3)
  .attr("opacity", 0.75)
  .attr("transform", (d) => `rotate(${d.r} ${d.x + 15} ${d.y + 15})`)
  .attr("mix-blend-mode", "color-burn");
