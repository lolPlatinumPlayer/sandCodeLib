var HtmlWebpackPlugin = require('html-webpack-plugin');

const baseUrl=process.env.VUE_APP_BASE_API // 正常开发用的process.VUE_CLI_SERVICE.mode






// ↓↓↓引入cz所需的↓↓↓
const CopyWebpackPlugin = require('copy-webpack-plugin')
const webpack = require('webpack')
const path = require('path')

// Cesium源码所在目录
const cesiumSource = './node_modules/cesium/Source'
const cesiumWorkers = '../Build/Cesium/Workers'
// ↑↑↑引入cz所需的↑↑↑







module.exports = {
    outputDir:process.env.VUE_APP_OUTPUT_DIR,
    publicPath:"./",
    devServer: {
        // port: 9527,
        open: true,
        overlay: {
            warnings: false,
            errors: true,
        },
        proxy: baseUrl,
    },
    configureWebpack:  config => {
        // console.log('config.resolve.alias')
        // console.log(config.resolve.alias)
        config.plugins.forEach((val) => {
            if (val instanceof HtmlWebpackPlugin) {
                val.options.title='数字寿宁大数据指挥平台'
            }
        })
        config.resolve.alias.vue$='vue/dist/vue.esm.js'  // 使用完整版vue（多了模板编译器）

        // ↓↓↓引入cz所需的↓↓↓
        config.output.sourcePrefix=' ' // 让webpack 正确处理多行字符串配置 amd参数
        config.amd={
          toUrlUndefined:true // 告诉Cesium，webpack中计算 require声明的AMD 模块里的toUrl 函数和标准的不兼容
        }
        /* 
        定义别名cesium后，cesium代表了cesiumSource的文件路径。有了这行才能用'cesium/Cesium'、'cesium/Widgets/widgets.css'来引用cz代码
        */
        config.resolve.alias.cesium=path.resolve(__dirname, cesiumSource)
        config.plugins.push(
          // 使用 copy-webpack-plugin，它能在编译阶段，把Cesium里静态文件整个拷贝到 dist 目录下，确保我们的服务能访问它
          new CopyWebpackPlugin([{ from: path.join(cesiumSource, cesiumWorkers), to: 'Workers' }]),
          new CopyWebpackPlugin([{ from: path.join(cesiumSource, 'Assets'), to: 'Assets' }]),
          new CopyWebpackPlugin([{ from: path.join(cesiumSource, 'Widgets'), to: 'Widgets' }]),
          new CopyWebpackPlugin([{ from: path.join(cesiumSource, 'ThirdParty/Workers'), to: 'ThirdParty/Workers' }]),
          new webpack.DefinePlugin({
            CESIUM_BASE_URL: JSON.stringify('./') // Cesium载入静态的资源的相对路径
          }),
        )
        config.module.unknownContextCritical= /^.\/.*$/ //打印载入特定库时候的警告
        config.module.unknownContextCritical= false //解决Error: Cannot find module "."
        config.module.rules.push({
          test: /\.js$/, // vue-cli里没给js加loader
          use: {
            loader: '@open-wc/webpack-import-meta-loader',
          },
        })
        // ↑↑↑引入cz所需的↑↑↑
    },
    /*css: {
        loaderOptions: {
            postcss: {
                plugins: [
                    /!*require("autoprefixer")({
                        // 配置使用 autoprefixer
                        overrideBrowserslist: ["last 15 versions"]
                    }),*!/
                    require("postcss-pxtorem")({
                        rootValue: 16, // 换算的基数
                        // 忽略转换正则匹配项。插件会转化所有的样式的px。比如引入了三方UI，也会被转化。目前我使用 selectorBlackList字段，来过滤
                        //如果个别地方不想转化px。可以简单的使用大写的 PX 或 Px 。
                        // selectorBlackList: ["ig"],
                        propList: ["*"],
                        // exclude: /node_modules/,
                    })
                ]
            }
        }
    }*/
}
