import {serializeError} from 'serialize-error'
import {fileURLToPath} from 'url'
import {getLogger} from './utils/logger.js'
import path from 'path'
import fs from 'node:fs/promises'

/**
 * @type {ReturnType<typeof bunyan.createLogger>}
 */
let logger

function collectRequestData(request) {
    return new Promise((resolve) => {
        const data = []

        request.on('data', (chunk) => {
            data.push(chunk)
        })

        request.on('end', () => {
            const dataStr = Buffer.concat(data).toString()
            resolve(dataStr)
        })
    })
}

function sendResponse({response, statusCode = 200, headers, data}) {
    response.writeHead(statusCode, headers)
    response.end(JSON.stringify(data))
}

function getLogger() {
    return getLogger()
}

function handleUnexpectedPaymentError(paymentObj, err) {
    const errorMessage =
        '[commercetools-adyen-integration-extension] ' +
        `Unexpected error (Payment ID: ${paymentObj?.id}): ${err.message}.`
    const errorStackTrace = `Unexpected error (Payment ID: ${
        paymentObj?.id
    }): ${JSON.stringify(serializeError(err))}`
    getLogger().error(errorStackTrace)
    return {
        errors: [
            {
                code: 'General',
                message: errorMessage,
            },
        ],
    }
}

async function readAndParseJsonFile(pathToJsonFileFromProjectRoot) {
    const currentFilePath = fileURLToPath(import.meta.url)
    const currentDirPath = path.dirname(currentFilePath)
    const projectRoot = path.resolve(currentDirPath, '..')
    const pathToFile = path.resolve(projectRoot, pathToJsonFileFromProjectRoot)
    const fileContent = await fs.readFile(pathToFile)
    return JSON.parse(fileContent)
}

export default {
    collectRequestData,
    sendResponse,
    getLogger,
    handleUnexpectedPaymentError,
    readAndParseJsonFile,
}
