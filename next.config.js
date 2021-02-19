const webpack = require('webpack')
const withCss = require('@zeit/next-css')
const withBundleAnalyzer = require("@zeit/next-bundle-analyzer")

const configs = {
    //编译输出目录
	distDir: 'dest',
	// 是否给每个路由生成Etag
	generateEtags: true,
	// 页面内容缓存配置
	onDemandEntries: {
		// 内容在内存中缓存时间(ms)
		maxInactiveAge: 25 * 1000,
		// 同时缓存多少个页面
		pagesBufferLength: 2,
	},
    // 收到修改webpack config
	webpack(config, options) {
		return config
	},
	assetPrefix: "/home",
    // 修改webpackDevMiddleware配置
	webpackDevMiddleware: (config) => {
		return config
    },
    env: {
		customKey: 'value',
    },
    pageExtensions: ['jsx', 'js'],
}

if (typeof require !== 'undefined') {
	require.extensions['.css'] = (file) => {}
}

module.exports = withBundleAnalyzer(
	withCss({
		webpack(config) {
			// 忽略mement语言包
			config.plugins.push(
				new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/)
			)
			return config
        },
		publicRuntimeConfig: {
            gm_title: "通用后台管理工具",
        },
        serverRuntimeConfig: {
			language: "ch"
		},
		analyzeBrowser: ['browser', 'both'].includes(
			process.env.BUNDLE_ANALYZE
		),
		bundleAnalyzerConfig: {
			server: {
				analyzerMode: 'static',
				reportFilename: '../bundles/server.html',
			},
			browser: {
				analyzerMode: 'static',
				reportFilename: '../bundles/client.html',
			},
		},
	})
)