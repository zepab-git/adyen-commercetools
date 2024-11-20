import bunyan from 'bunyan'
import config from '../config/config.js'

const { logLevel } = config.getModuleConfig()

let obj

function getLogger() {
  if (obj === undefined) {
    const EXTENSION_MODULE_NAME = 'ctp-adyen-integration-extension'
    obj = bunyan.createLogger({
      name: EXTENSION_MODULE_NAME,
      stream: process.stdout,
      level: logLevel || bunyan.INFO,
      serializers: {
        err: bunyan.stdSerializers.err,
        cause: bunyan.stdSerializers.err,
      },
    })
  }
  return obj
}

export { getLogger }
