module.exports = {
    plugins: {
        autoprefixer: {
            browsers: ['Android >= 4.0', 'iOS >= 8'],
        },
        // flexible配置
        "postcss-pxtorem": {
            "rootValue": 37.5, // 设计稿宽度的1/10
            "propList": ["*"] // 需要做转化处理的属性，如`hight`、`width`、`margin`等，`*`表示全部
        }
    }
}