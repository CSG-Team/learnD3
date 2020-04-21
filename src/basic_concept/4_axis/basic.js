// svg create
const width = 500;
const height = 500;
const margin = 32;
const paintWidth = width - 2 * margin;
const verticalOffset = 100;

const svg = d3.select('body')
  .append('svg')
  .attr('width', width)
  .attr('height', height);

const scale = d3.scaleLinear()
  .domain([0, 1000])
  .range([0, paintWidth]);


const axis = d3.axisBottom()
  .scale(scale)
  .ticks(5);

svg.append('g')
  .attr('transform',`translate(${margin}, ${verticalOffset})`)
  .call(axis);
