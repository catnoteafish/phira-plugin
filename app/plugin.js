import { mkdir } from 'node:fs/promises'
import Plugin from '../../../lib/plugins/plugin.js'
import { template } from './template.js'
import { templateList } from './api.js'

export default class PhiraPlugin extends Plugin {
    constructor() {
        super({
            name: 'phira-plugin',
            dsc: 'Phira房间列表插件',
            event: 'message',
            priority: 5000,
            rule: [
                {
                    fnc: 'phiraList',
                    reg: '^#?room$',
                }
            ],
        })
    }

    async phiraList(e) {
        await mkdir(template.resourcesPath, { recursive: true })
        const listData = await templateList()
        const base64 = await template.render('template.html', {room: listData}, e)
        return e.reply(base64)
    }
}