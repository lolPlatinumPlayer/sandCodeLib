import {isArray} from "@/utils/validate"

// 返回内容赋值给children变量
export default function dealVal(inputChildren, vm) {
  if (isArray(inputChildren)) {
    if (inputChildren.length === 1 && inputChildren[0].tag === undefined) {
      // 进入这个分支说明插槽里只有文本
      inputChildren[0].text = transformVal(inputChildren[0].text, vm)
    } else {
      const valTag = findValTag(inputChildren)
      if (valTag) {
        /* if(vm.label==='合规校验总条数'){
          debugger
        } */
        vm.$nextTick(() => {
          const lastDom = findLastDom(valTag.elm)
          // console.log(lastDom,'lastDom',vm.label)
      /* if(vm.label==='合规校验总条数'){
        console.log(lastDom.innerText,'lastDom.innerText')
         debugger
      } */
      if(valTag.componentOptions){
        lastDom.innerText = transformVal(valTag.componentOptions.children[0].text, vm)
      }
          // lastDom.innerText = transformVal(lastDom.innerText, vm) // 这个lastDom.innerText可能会是残留的
          // console.log(transformVal(lastDom.innerText, vm),'transformVal',vm.label)
        })
      }
    }
    return inputChildren
  } else {
    return transformVal(inputChildren, vm)
  }
}

// 值的转换
const emptyValList=[null,undefined,'',' ','  ','   ']
function transformVal(originVal, vm) {
  /* if(vm.label==='合规校验总条数'){
    debugger
  } */
  if (vm.isChangeEmptyVal) {
    if (emptyValList.some(x=>x===originVal)) {
      return vm.changeEmptyValTo
    }
  }
  if (vm.isUseThousandthSignForce) {
    return Number(originVal).toLocaleString()
  } else if (typeof originVal === 'number' && vm.isUseThousandthSignInNum) {
    return originVal.toLocaleString()
  }

  return originVal
}

// 找到『存有值的标签』（vNode）
//（目前设计只允许有一个『存有值的标签』，且这个标签要是“没有枝叶”的）
function findValTag(vNodeTree) {
  for (let i = 0; i < vNodeTree.length; i++) {
    const vNode = vNodeTree[i]
    if (vNode.tag !== undefined) { // 排除文本节点
      if ('attrs' in vNode.data&&'valTag' in vNode.data.attrs) {
        return vNode
      }else if (isArray(vNode.children)) { // vNode的children不会出现空数组的情况
        return findValTag(vNode.children)
      } 
    }
  }
}

function findLastDom(inputDom) { 
    if (
      inputDom.children.length === 0
    ) {
      return inputDom
    } else {
      return findLastDom(inputDom.children[0])
    }
}

let VNode
function isVNode(input, vm) {
  if (!VNode) {
    let vnode = vm.$createElement('span', '')
    VNode = vnode.constructor
  }
  return input instanceof VNode
}