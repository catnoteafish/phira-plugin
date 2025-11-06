logger.info('---------------------')
logger.info('加载Phira-plugin...')

const plugin = import('./dist/main.js')

logger.info('加载完成')
export default plugin