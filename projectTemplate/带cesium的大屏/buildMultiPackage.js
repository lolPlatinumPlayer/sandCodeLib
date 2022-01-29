const exec = require('child_process').exec
const fs = require('fs')
const path=require('path')

const buildProdTYYCmd = 'npm run build:prodTYY'
const buildProdDomainCmd = 'npm run build:prod'
const buildTestCmd = 'npm run build:test'

const buildProdTYY = new Promise((resolve,reject)=>{
  exec(buildProdTYYCmd, (err, stdout, stderr) => {
    if (err) {
      console.log(err)
      console.warn(new Date(), '打天翼云包失败')
      reject(err)
    } else {
      console.log(stdout)
      console.warn(new Date(), '打天翼云包成功')
      replacePath('./测试包与正式包/天翼云ip正式包/index.html')
      resolve()
    }
  })
})
const buildProdDomain= new Promise((resolve,reject)=>{
  exec(buildProdDomainCmd, (err, stdout, stderr) => {
    if (err) {
      console.log(err)
      console.warn(new Date(), '打域名包失败')
      reject(err)
    } else {
      console.log(stdout)
      console.warn(new Date(), '打域名包成功')
      replacePath('./测试包与正式包/域名正式包/index.html')
      resolve()
    }
  })
})
/* 
*2021.09.26真真要求测试包不要把js分开
*const buildTest = new Promise((resolve,reject)=>{
*exec(buildTestCmd, (err, stdout, stderr) => {
*if (err) {
*console.log(err)
*console.warn(new Date(), '打测试包失败')
*reject(err)
*} else {
*console.log(stdout)
*console.warn(new Date(), '打测试包成功')
*replacePath('./测试包与正式包/测试包/index.html')
*resolve()
*}
*})
*})
*/

function replacePath(filePath){
  fs.readFile(filePath,'utf8',function(err,files){
    var result = files.replace(/js[/]/g, 'https://snxc.fjoss.xstore.ctyun.cn/bigdata/js/');
    fs.writeFile(filePath, result, 'utf8', function (err) {
      if (err) return console.log(err);
    });
  }) 
  console.log(filePath,'js地址替换成功')
}