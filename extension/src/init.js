import {setupServer} from './server.js'
import config from './config/config.js'
import {getAppLogger} from "./utils/logger.js";

const server = setupServer()
const logger = getAppLogger()

const moduleConfig = config.getModuleConfig()

const port = moduleConfig.port || 443

if (moduleConfig.keepAliveTimeout !== undefined)
    server.keepAliveTimeout = moduleConfig.keepAliveTimeout
server.listen(port, async () => {
    logger.info(`Extension module is running at http://localhost:${port}`)
})
