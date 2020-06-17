
const myColors = [
  '#8c8c8c', '#722ed1', '#2f54eb',
  '#1890ff', '#13c2c2', '#52c41a',
  '#faad14', '#fadb14', '#d4380d',
  '#ff85c0', 

];
const colorScaleMine = d3.scaleOrdinal()
  .domain([1, 2, 3, 4, 5, 6, 7, 8, 9, 10])
  .range(myColors);

function randomColor(){
  const count = myColors.length;
  const rIndex = Math.floor(Math.random() * count) ;
  return colorScaleMine(rIndex);

}

