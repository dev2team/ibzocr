const path = require('path');
const os = require('os');

function resolve(dir) {
    return path.join(__dirname, dir)
}

module.exports = {
    publicPath: './',
    // 去除 map 文件
    productionSourceMap: false,
    devServer: {
        host: '0.0.0.0',
        port: 8111,
        disableHostCheck: true,
        proxy: "http://localhost:8083"
    },
    lintOnSave: false,
    runtimeCompiler: true, // 是否使用包含运行时编译器的 Vue 构建版本
    productionSourceMap: false, // 生产环境的 source map
    outputDir: '../ibzocr-srv/target/classes/META-INF/resources',
    // 多核打包
    parallel: os.cpus().length > 1,
    chainWebpack: (config) => {
        // 删除自动计算预加载资源
        config.plugins.delete('preload')
            // 删除预加载资源
        config.plugins.delete('prefetch')
        config.resolve.alias
            .set('@ibizsys', resolve('src/ibizsys'))
            .set('@pages', resolve('src/pages'))
            .set('@components', resolve('src/components'))
            .set('@widget', resolve('src/widget'))
            .set('@engine', resolve('src/engine'))
            .set('@interface', resolve('src/interface'))
            .set('@locale', resolve('src/locale'))
    },
    configureWebpack: config => {
        if (Object.is(config.mode, 'production')) {
            // 多核启动编译及内存提升
            const data = config.plugins[10];
            // 最大进程数
            data.workersNumber = os.cpus().length > 4 ? 4 : os.cpus().length; // 会占用额外内存不释放，不建议开发阶段使用
            // 单个进程最大使用内存
            data.memoryLimit = 4096;
        } else {
            // 多核启动编译及内存提升
            const data = config.plugins[8];
            // 最大进程数
            // data.workersNumber = os.cpus().length > 4 ? 4 : os.cpus().length; // 会占用额外内存不释放，不建议开发阶段使用
            // 单个进程最大使用内存
            data.memoryLimit = 4096;
        }
    },
}