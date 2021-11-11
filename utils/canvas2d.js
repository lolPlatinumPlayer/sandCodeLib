/* 
版本：0.0.0 2021.11.02
uniapp可用
【】在uniapp里用时最后要加ctx.draw()才会画出来，有空去普通web端测一下是不是也是这样
*/

// 在canvas上绘制折线
function drawLineString({pointList,color,ctx}){
  ctx.setStrokeStyle(color);
  ctx.setLineWidth(1);
  ctx.beginPath();
  for (var i = 0; i < pointList.length; i++) {
    var point = pointList[i];
    var x = point.x
    var y = point.y
    ctx.moveTo(x, y);
    if (i < pointList.length - 1) {
      var nextX = pointList[i+1].x
      var nextY = pointList[i+1].y
      ctx.lineTo(nextX, nextY);
    }
    ctx.stroke();
  }
}

// 在canvas上绘制多点
function drawMultiPoint({pointList,color,radius,ctx}){
  ctx.setStrokeStyle(color);
  ctx.beginPath();
  for (var i = 0; i < pointList.length; i++) {
    var point = pointList[i];
    var x = point.x
    var y = point.y
    ctx.beginPath();
    ctx.arc(x, y, radius, 0, 2 * Math.PI);
    ctx.setFillStyle(color);
    ctx.fill();
  }
}