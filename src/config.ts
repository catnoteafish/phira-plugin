import fs from "fs/promises"
import jsYaml from "js-yaml"
import path from "path"
import * as radash from "radash"
interface Config {
    url: string
}

const [err, data] = await radash.tryit(fs.readFile)(path.join(path.dirname(__dirname), 'config', 'config.yml'), 'utf-8')
if (err) throw `Failed to resolve config: ${err}`
if (typeof data !== 'string') throw `Unknown config format`
const config = jsYaml.load(data) as Config
export default config