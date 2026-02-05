import fs from 'node:fs'
import jsYaml from 'js-yaml'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const configPath = path.join(path.dirname(fileURLToPath(import.meta.url)), '../config/config.yml')
const data = fs.readFileSync(configPath, 'utf8')
const config = jsYaml.load(data)

if (!config?.url) throw new Error('config.url is required')

export default config