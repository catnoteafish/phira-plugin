import path from 'path'
// @ts-ignore
import plugin  from '../../../lib/plugins/plugin.js'
import { templateList } from './api.js'
import { renderer } from './renderer.js'

export default class Phira extends plugin {
    constructor() {
        super({
            name: 'phira-plugin',
            event: 'message',
            priority: 5000,
            rule: [
                {
                    reg: "^#复读$",
                    fnc: 'handle'
                }
            ]
        })
    }

    async handle(e: any) {
        const data = await templateList()
        await renderer.createTask(path.join(path.dirname(__dirname), 'resource', 'list.art'), data, async (err: Error | null, screenshot: Buffer | null) => {
            if (err) e.reply(`Generate failed: ${err}`)
            if (screenshot) e.reply(screenshot)
        })
    }
}