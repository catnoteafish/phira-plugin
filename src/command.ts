import path from 'path'
// @ts-ignore
import plugin  from '../../../lib/plugins/plugin.js'
import { templateList } from './api.js'
import { renderer } from './renderer.js'
import { fileURLToPath } from 'url'

export default class Phira extends plugin {
    constructor() {
        super({
            name: 'phira-plugin',
            event: 'message',
            priority: 5000,
            dsc: '',
            rule: [
                {
                    reg: "^#room$",
                    fnc: 'handle'
                }
            ]
        })
    }

    async handle(e: any) {
        const data = await templateList()
        await renderer.createTask(path.join(path.dirname(path.dirname(fileURLToPath(import.meta.url))), 'resource', 'list.art'), data, async (err: Error | null, screenshot: Buffer | null) => {
            if (err) e.reply(`Generate failed: ${err}`)
            if (screenshot) e.reply(screenshot)
        })
    }
}