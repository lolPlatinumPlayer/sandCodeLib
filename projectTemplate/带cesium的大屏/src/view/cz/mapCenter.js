import entrance from './entrance/entrance'

const mapCenter={
  init({
    container,
  }){
    new entrance.Map({
      container,
    })
  }
}

export default mapCenter