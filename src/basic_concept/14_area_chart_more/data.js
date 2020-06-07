let numberOfSeries = 3,
  numberOfDataPoint = 51,
  odata = [];

function randomData() {
  return Math.random() * 9;
}

odata = d3.range(numberOfDataPoint).map(function (i) {
  return {value1: randomData(), value2: randomData(), value3: randomData()};
});


// function updateData() {
//   for (let i = 0; i < data.length; ++i) {
//     let series = data[i];
//     series.length = 0;
//     for (let j = 0; j < numberOfDataPoint; ++j)
//       series.push({x: j, y: randomData()});
//   }
// }


// var chart = stackedAreaChart()
//       .x(d3.scale.linear().domain([0, numberOfDataPoint - 1]))
//       .y(d3.scale.linear().domain([0, 26]));

// data.forEach(function (series) {
//   chart.addSeries(series);
// });
