module.exports = {
    configureWebpack: {
        devServer: {
            disableHostCheck: true,
            open: false,
            // host: '0.0.0.0',
            port: 443,
            https: true,
            hotOnly: false,
        },
    },
};