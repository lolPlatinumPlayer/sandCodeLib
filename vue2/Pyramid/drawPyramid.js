
/*
* 这个方法里从上到下为正序，反之为反序。
* 反序的变量背后会加上`_reverse`
* */
export default function drawPyramid({
  container,
  itemNum = 5,
  colorList = [ // 长度不必等于itemNum
    'rgba(51, 198, 135, 1)',
    'rgba(16, 170, 240, 1)',
    'rgba(108, 104, 251, 1)',
    'rgba(62, 79, 252, 1)',
    'rgba(44, 56, 204, 1)',
  ],
  markLineXLen = 20, // 线条在x方向上投影的长度（单位：像素）
  pyramidWRatio = .7, // 金字塔在x方向上的占比
  pyramidHRatio = .7, // 金字塔在y方向上的占比
}) {
  const canvasW = container.getBoundingClientRect().width
  const canvasH = container.getBoundingClientRect().height
  const graphicW = Math.floor(canvasW * pyramidWRatio)
  const graphicH = Math.floor(canvasH * pyramidHRatio)
  const canvasDom = document.createElement('canvas')
  canvasDom.width = canvasW
  canvasDom.height = canvasH
  container.appendChild(canvasDom)
  const ctx = canvasDom.getContext('2d')
  const colorList_reverse = [...colorList].reverse()

  const centerPoint = [canvasW / 2, canvasH / 2]

  const maxT = centerPoint[1] + graphicH / 2
  const minT = centerPoint[1] - graphicH / 2
  // const maxL=centerPoint[0]+graphicW/2
  // const minL=centerPoint[0]-graphicW/2

  const triangleTopPoint = [centerPoint[0], minT]

  const itemH = graphicH / itemNum

  // 从下到上排序
  const emptyItemList = new Array(itemNum).fill(0)
  const triangleBottomLineTopList = emptyItemList.map((x, i) => {
    return maxT - i * itemH
  })
  const itemCenterLineTopList = triangleBottomLineTopList.map(x => x - itemH / 2)

  // 大三角形序号小
  const trianglePathList = emptyItemList.map((x, i) => {
    const halfItemW = ((itemNum - i) / itemNum) * graphicW / 2
    const rightBottom = [centerPoint[0] + halfItemW, triangleBottomLineTopList[i]]
    const leftBottom = [centerPoint[0] - halfItemW, triangleBottomLineTopList[i]]
    return {
      top: triangleTopPoint,
      rightBottom,
      leftBottom,
    }
  })

  trianglePathList.forEach(({top, rightBottom, leftBottom}, i) => {
    ctx.beginPath() //清除上一次的绘制参数 开始绘制
    ctx.moveTo(...top) //线条起点moveToX,moveToY
    ctx.lineTo(...rightBottom)
    ctx.lineTo(...leftBottom)
    ctx.closePath()//封闭多边形结束方法
    ctx.fillStyle = colorList_reverse[i % colorList_reverse.length] //颜色
    ctx.fill() //多边形填充
  })

  const markLineEndPointList_reverse = drawMarkLine()
  function drawMarkLine() {
    const markLineEndPointList_reverse = []
    for (let i = 0; i < itemNum; i++) {
      const isLeft = i % 2 === 1
      const edgeToCenterDistance = ((itemNum - i - 0.5) / itemNum) * (graphicW / 2)
      const startPoint = [
        isLeft
          ? centerPoint[0] - edgeToCenterDistance
          : centerPoint[0] + edgeToCenterDistance
        ,
        itemCenterLineTopList[i]
      ]
      const middlePoint = [
        isLeft
          ? startPoint[0] - markLineXLen / 2
          : startPoint[0] + markLineXLen / 2
        ,
        startPoint[1] - markLineXLen / 2,
      ]
      const endPoint = [
        isLeft
          ? middlePoint[0] - markLineXLen / 2
          : middlePoint[0] + markLineXLen / 2
        ,
        middlePoint[1]
      ]
      markLineEndPointList_reverse.push({
        point: endPoint,
        isLeft,
      })

      ctx.beginPath() //清除上一次的绘制参数 开始绘制
      ctx.moveTo(...startPoint) //线条起点moveToX,moveToY
      ctx.lineTo(...middlePoint)
      ctx.lineTo(...endPoint)
      ctx.strokeStyle = colorList_reverse[i % colorList_reverse.length]
      ctx.lineWidth = 2
      ctx.stroke()

    }
    return markLineEndPointList_reverse
  }

  const itemCenterPointList_reverse = itemCenterLineTopList.map(top => {
    return [triangleTopPoint[0], top]
  })

  return {
    itemCenterPointList: [...itemCenterPointList_reverse].reverse(),
    markLineEndPointList: [...markLineEndPointList_reverse].reverse(),
  }
}
