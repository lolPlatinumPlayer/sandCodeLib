/* 
uniapp的showToast有时不会显示
因此写了这个方法增强显示的概率

版本：0.0.0 2021.11.12
*/
export default function showToastPlus(p){
  const showToast=uni.showToast.bind(uni,p)
  showToast()
  setTimeout(showToast,0)
  setTimeout(showToast,800)
}