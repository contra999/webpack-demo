/**
 * 如果我们在 src 下新建一个文件h.js，再在index.js中引入它，保存，构建之，
 * 我们发现有些没改变的模块的 hash 也发生了改变，这是因为加入h.js后它们的module.id变了，
 * 但这明显是不合理的。在开发环境，我们可以用 NamedModulesPlugin 将 id 换成具体路径名。
 * 而在生产环境，我们可以使用 HashedModuleIdsPlugin。
 */