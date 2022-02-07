module.exports = {
	runtimeCompiler: true,

	chainWebpack: config => {
		config
			.plugin('html')
			.tap(args => {
				args[0].title = '行云 - Serverless工作流可视化编辑器'
				return args
			})
	}
}
