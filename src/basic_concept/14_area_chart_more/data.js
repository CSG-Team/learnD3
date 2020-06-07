let numberOfDataPoint = 51,
  odata = [];

function randomData() {
  return Math.random() * 9;
}

odata = d3.range(numberOfDataPoint).map(function (i) {
  return {value1: randomData(), value2: randomData(), value3: randomData()};
});

