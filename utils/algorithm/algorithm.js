// 本文件算法提供测试数据，测试数据位于testData文件夹内
import {isArr} from '../js'

/* 
输入多维数组，返回一维版本（lodash的同名方法有相同功能）
*/
export function flattenDeep(arr) {
  let resultOfThisLevel = []
  if (isArr(arr)) {
    for (let i = 0; i < arr.length; i++) {
      resultOfThisLevel = [...resultOfThisLevel, ...flattenDeep(arr[i])]
    }
    return resultOfThisLevel
  } else {
    return [arr]
  }
}

// 依据一维数组生成树级数据（生成数据也是个数组）
export function getTreeByList({
  list: inputList,
  idKey,
  rootId, // 树的第一级元素的parentIdKey的值
  parentIdKey,
  childrenKey = 'children',
}) {
  const remainingItemList = JSON.parse(JSON.stringify(inputList))
  const tree = []
  for (let i = remainingItemList.length - 1; i >= 0; i--) {
    if (remainingItemList[i][parentIdKey] === rootId) {
      tree.push(...remainingItemList.splice(i, 1))
    }
  }
  if (tree.length) {
    addOneLevel(2)
  }
  function addOneLevel(level) {
    const parentLevel = level - 1
    const parentList = getTreeLevel(tree, parentLevel)
    let isNothingToAdd = true

    for (let i = remainingItemList.length - 1; i >= 0; i--) {
      const item = remainingItemList[i]
      const parent = parentList.find((x) => x[idKey] === item[parentIdKey])
      if (parent) {
        isNothingToAdd = false
        if (parent[childrenKey] && parent[childrenKey].length) {
          parent[childrenKey].push(...remainingItemList.splice(i, 1))
        } else {
          parent[childrenKey] = remainingItemList.splice(i, 1)
        }
      }
    }
    console.log(remainingItemList.length, isNothingToAdd)
    if (remainingItemList.length && !isNothingToAdd) {
      addOneLevel(level + 1)
    }
  }
  return tree
}

// 获得树的指定层级
export function getTreeLevel(tree, level, childrenKey = 'children') {
  if (level === 1) {
    return tree
  } else {
    const result = []
    tree.forEach((item) => {
      result.push(...getTreeLevel(item[childrenKey], level - 1))
    })
    return result
  }
}



// ------- 下方是算法demo，并不是通用的工具函数 -------

// 递归树来生成新的树。并在新树中加入一个属性，用来代表后代层级数。新树存在结果的result属性里
function getTreeData(backEndData) {
  const result = []
  let posterityLevel = backEndData.length ? 1 : 0 // 因为第一级比较特殊，所以有这个判断
  backEndData.forEach(backEndItem => {
    const item = {
      id: backEndItem.id,
      name: backEndItem.name,
      geojson: backEndItem.layer,
      styleType: backEndItem.cssType,
      zIndex: backEndItem.zIndex,
    }

    if (backEndItem.children && backEndItem.children.length) {
      const {
        result: children,
        posterityLevel: itemPosterityLevel,
      } = getTreeData(backEndItem.children)
      item.posterityLevel = itemPosterityLevel
      item.children = children
      posterityLevel = Math.max(posterityLevel, itemPosterityLevel + 1)
    } else {
      item.posterityLevel = 0
    }

    result.push(item)
  })
  return {result, posterityLevel}
}