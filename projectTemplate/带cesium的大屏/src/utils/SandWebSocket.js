/* 
- url前面要带斜杆————“/”
- url结尾不能带斜杆

bug
- 瞬间爆发出一堆“该ws断开后进行了重连”
  （不是无限爆发的）
  - bug出现背景：一次从有网切到没网，并过了一段时间后
  - 猜测的原因：ws对js同步代码的响应有可能和js执行顺序不一致

*/
const randomNumber=Math.ceil(Math.random()*1e6) // 应对服务端接到同路径ws后会不响应之前ws的情况
export default class SandWebSocket{
  ws
  isClose
  queryAlive
  listener
  constructor({apiPath,basePath=process.env.VUE_APP_WSS_BASE}){
    const lastPathElement=apiPath.split('/').slice(-1)[0]
    this.wsUrl=`${basePath}${apiPath}/${lastPathElement}${randomNumber}`
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