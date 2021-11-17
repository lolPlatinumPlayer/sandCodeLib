export function beFlexible() {
    setRootElementFontSize()
    window.addEventListener('resize', setRootElementFontSize)
}
function setRootElementFontSize() {
    const clientH/*窗口高度*/ = document.documentElement.clientHeight
    const size = Math.round(clientH / 1080 * 16)
    document.documentElement.style.fontSize = `${size}px`
}



export function getRemByPx(px) {
    return px * 1.25 / 20 // smallTitleA的20px会转成1.25rem
}



export function getPxAfterFlex(inputPx){
    const rem=getRemByPx(inputPx)
    const rootElementFontSize=document.documentElement.style.getPropertyValue('font-size')
    const rootElementFontSizeNum=Number(rootElementFontSize.match(/\d*/))
    return rem*rootElementFontSizeNum
}
