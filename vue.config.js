module.exports = {
    configureWebpack: {
        devServer: {
            disableHostCheck: true,
            open: false,
            port: 443,
            https: true,
            hotOnly: false,
        },
    },
};