/* 
说明
- 支持uniapp

注意事项
- url前面要带斜杆————“/”
- url结尾不能带斜杆

bug
- 瞬间爆发出一堆“该ws断开后进行了重连”
  （不是无限爆发的）
  - bug出现背景：一次从有网切到没网，并过了一段时间后
  - 猜测的原因：ws对js同步代码的响应有可能和js执行顺序不一致

版本：0.1.1 2021.11.04
*/

/* 
在uniapp中实现浏览器的EventTarget类
不具有EventTarget类的完整功能，只具有SandWebSocket所需的功能
*/
class BrowserEventTarget{
  eventCallbackDict={}
  addEventListener(eventName,callback){
    if(eventName in this.eventCallbackDict){
      this.eventCallbackDict[eventName].add(callback)
    }else{
      this.eventCallbackDict[eventName]=new Set([callback])
    }
  }
  removeEventListener(eventName,callback){
    if(eventName in this.eventCallbackDict){
      this.eventCallbackDict[eventName].delete(callback)
    }
  }
  dispatchEvent(event,param){
    const {eventName}=event
    if(eventName in this.eventCallbackDict){
      for (let callback of this.eventCallbackDict[eventName]){
        callback(param)
      }
    }
  }
}
const EventTarget=window?.EventTarget??BrowserEventTarget
function BrowserCustomEvent(eventName){
  this.eventName=eventName
}
const CustomEvent=window?.CustomEvent??BrowserCustomEvent

/* 
在uniapp中实现浏览器的WebSocket类
不具有WebSocket类的完整功能，只具有SandWebSocket所需的功能
*/
class BrowserWebSocket extends BrowserEventTarget{
  _socketTask
  constructor(url){
    super()
    this._socketTask = uni.connectSocket({
      url,
      success(...x) {
        console.log("connectSocket调用成功", x);
      },
      fail(...x) {
        console.log("connectSocket调用失败", x);
      },
    });
    this._socketTask.onClose(()=>{
      this.dispatchEvent(new CustomEvent('close'))
    })
    this._socketTask.onMessage((p)=>{
      this.dispatchEvent(new CustomEvent('message'),{data:p.data})
    })
    this._socketTask.onOpen(()=>{
      this.dispatchEvent(new CustomEvent('open'))
    })
  }
  send(msg){
    this._socketTask.send({data:msg})
  }
  close(){
    this._socketTask.close()
  }
}
const WebSocket=window?.WebSocket??BrowserWebSocket

const randomNumber=Math.ceil(Math.random()*1e6) // 应对服务端接到同路径ws后会不响应之前ws的情况
export default class SandWebSocket{
  ws
  isClose
  queryAlive
  listener
  constructor({apiPath,basePath=process?.env?.VUE_APP_WSS_BASE||''}){
    const lastPathElement=apiPath.split('/').slice(-1)[0]
    this.wsUrl=`${basePath}${apiPath}/${lastPathElement}${randomNumber}` // 多加一个lastPathElement方便在network(调试工具)里查看
    console.log('初始化ws：',this.wsUrl)
    this._createWs()
  }
  _createWs(){
    this.ws = new WebSocket(this.wsUrl)
    this._addQueryAlive()
    this.ws.addEventListener('close',this._onBackendClose)
    this.ws.addEventListener('message',({data})=>{
      if(data!==this.queryAlive.resMsg){
        this.listener?.(data)
      }
    })
  }
  _addQueryAlive(){
    this.ws.addEventListener('open',()=>{
      this.queryAlive=new QueryAlive({ws:this.ws})
      this.queryAlive.addEventListener('lose',()=>{
        if(!this.isClose){
          console.log(`该ws响应超过${this.queryAlive.timeLimit}秒后进行了重连：`,this.wsUrl);
          this.ws.removeEventListener('close',this._onBackendClose)
          this.ws.close()
          this._createWs()
        }
      })
    })
  }
  _onBackendClose=()=>{ // 应对服务器会定时断开的情况
    if(!this.isClose){
      console.log('该ws断开后进行了重连：',this.wsUrl);
      this._createWs()
    }
  }
  listen(listener){
    if(typeof listener==='function'){
      this.listener=listener
    }else{
      console.error('传入listen方法的不是函数，而是',listener)
    }
  }
  close(){
    this.isClose=true
    this.ws.close()
  }
}

class QueryAlive extends EventTarget{
  queryMsg
  resMsg
  timeLimit
  _isGetResInThisCycle
  constructor({
    ws,
    queryMsg='queryAlive',
    resMsg='alive',
    timeLimit=5,//单位是秒
  }){
    super()
    this.queryMsg=queryMsg
    this.timeLimit=timeLimit
    this.resMsg=resMsg

    ws.send(this.queryMsg)
    const cycle=setInterval(()=>{
      if(this._isGetResInThisCycle){
        this._isGetResInThisCycle=false
        ws.send(this.queryMsg)
      }else{
        this.dispatchEvent(new CustomEvent('lose'))
      }
    },this.timeLimit*1000)
    ws.addEventListener('message',({data})=>{
      if(data===resMsg){
        this._isGetResInThisCycle=true
      }
    })
    ws.addEventListener('close',()=>{
      clearInterval(cycle)
    })

  }
}
