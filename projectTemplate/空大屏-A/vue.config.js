var HtmlWebpackPlugin = require('html-webpack-plugin');

const baseUrl=process.env.VUE_APP_BASE_API // 正常开发用的process.VUE_CLI_SERVICE.mode

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
        // console.log('config.mode')
        // console.log(config.mode)
        config.plugins.forEach((val) => {
            if (val instanceof HtmlWebpackPlugin) {
                val.options.title='数字寿宁大数据指挥平台'
                // console.log(111111111111111111111)
                // console.log(val)
            }
        })
        config.resolve.alias.vue$='vue/dist/vue.esm.js'  // 使用完整版vue（多了模板编译器）
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
