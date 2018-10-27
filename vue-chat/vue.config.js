module.exports = {
	baseUrl: process.env.NODE_ENV === 'production' ?
	    '/vue-chat/' :
		'/',
	outputDir: 'vue-chat',
	devServer: {
	    proxy: 'http://localhost:8770'
	}
	// configureWebpack: {
	// 	plugins: [
	// 		new QiniuPlugin({
				
	// 		})
	// 	]
	// }
}