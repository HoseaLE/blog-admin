export default {
    entry: "src/index.js",
    theme: {
        "@primary-color": "#1DA57A"
    },
    extraBabelPlugins: [
        ["import", { "libraryName": "antd", "libraryDirectory": "es", "style": "css" }]
    ],
    ignoreMomentLocale:true,
    "proxy": {
        "/adminapi": {
          "target": "http://localhost:3000/",
          "changeOrigin": true,
        },
        "/api": {
            "target": "http://localhost:3000/",
            "changeOrigin": true,
          }
    }
}
