import fs from "fs"
import jsYaml from "js-yaml"
import path from "path"
import { fileURLToPath } from "url"
interface Config {
    url: string
}


const data = fs.readFileSync(path.join(path.dirname(path.dirname(fileURLToPath(import.meta.url))), 'config', 'config.yml'), 'utf-8')
const config = jsYaml.load(data) as Config
export default config