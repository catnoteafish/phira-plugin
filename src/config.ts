import promises = require("fs/promises")
import jsYaml = require("js-yaml")
import path = require("path")
import radash = require("radash")

interface Config {
    url: string
    rendererNum: number
}

const [err, data] = await radash.tryit(promises.readFile)(path.join(path.dirname(__dirname), 'config', 'config.yml'), 'utf-8')
if (err) throw `Failed to resolve config: ${err}`
if (typeof data !== 'string') throw `Unknown config format`
const config = jsYaml.load(data) as Config
export default config