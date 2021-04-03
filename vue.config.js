
module.exports = {
    devServer: {
        open: true, //是否自动弹出浏览器页面
        host: "localhost",
        port: '8080',
        https: false,
        hotOnly: false,
        proxy: {
            '/api': {
                target: 'http://3u769548e6.zicp.vip', //API服务器的地址(由于此处我nodejs后台用了路由，所以+了api)，正常不加               
                ws: true,  //代理websockets
                //changeOrigin: true, // 虚拟的站点需要更管origin
                origin: true,
                pathRewrite: {   //重写路径 比如'/api/aaa/ccc'重写为'/aaa/ccc'
                    '^/api': ''
                }
            }
        },
    }
}

