import { dirname, join } from "node:path"
import { fileURLToPath } from "node:url"

export class Template {
    constructor() {
        this.pluginPath = fileURLToPath(dirname(dirname(import.meta.url)))
        this.resourcesPath = join(this.pluginPath, 'resources')
    }

    /**
     * param {string} templatePath
     * param {object} data
     */
    async render(template, data, e) {
        return await e.runtime.render('phira-plugin', template, data, {'retType':'base64'})
    }
}

export const template = new Template()