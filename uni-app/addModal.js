/* 
该方法和uni.showModal的区别： 
- 保证确认按钮都在右边（uni.showModal在安卓app下在左边）
- 用户点击按钮后的回调由success改为onConfirm和onCancel  
  onConfirm和onCancel记得用箭头函数

版本
2021.06.24
*/
let platform

export default function addModal(inputConfig){
	if(!platform) {
		platform=uni.getSystemInfoSync().platform
	}
	let outputConfig
	// #ifndef MP||H5
	if(platform==='android'){
		outputConfig={
			...inputConfig,
			cancelText:inputConfig.confirmText??'确定',
			confirmText:inputConfig.cancelText??'取消',
			success:function (res){
				if(res.confirm){
					inputConfig.onCancel?.()
				}else if(res.cancel){
					inputConfig.onConfirm?.()
				}
			}
		}
	}else{
	// #endif
		outputConfig={
			...inputConfig,
			success:function (res){
				if(res.confirm){
					inputConfig.onConfirm?.()
				}else if(res.cancel){
					inputConfig.onCancel?.()
				}
			}
		}
	// #ifndef MP||H5
	}
	// #endif
	// console.log('platform',platform);
	// console.log('outputConfig',outputConfig);
	uni.showModal(outputConfig)
}