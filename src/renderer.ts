import Puppeteer, { Browser, Page } from 'puppeteer'
import { tryit } from 'radash'
import template from 'art-template'

type templateData = {
    templatePath: string
    data: object
    callback: (err: Error | null, screenshot: Buffer | null) => Promise<void>
}

class Renderer {
    private browser!: Browser
    private page!: Page
    private queue: templateData[]
    private screenshoting = false
    constructor() {
        this.init()
        this.queue = []
    }

    async init() {
        const [err, data] = await tryit(Puppeteer.launch)({
            headless: true,
            args: [
                '--no-sandbox',
                'disable-setuid-sandbox'
            ]
        })
        if (err) throw `Create new chromium process failed: ${err}`
        this.browser = data
        this.page = await this.browser.newPage()
    }

    async createTask(templatePath: string, data: object, callback: (err: Error | null, screenshot: Buffer | null) => Promise<void>) {
        this.queue.push({
            templatePath,
            data,
            callback
        })
        await this.screenShot()
    }

    async screenShot() {
        if (this.screenshoting) return
        while (this.queue.length !== 0) {
            this.screenshoting = true
            try {
                const data = this.queue.shift() as templateData
                const html = template(data.templatePath, data.data)
                this.page.setContent(html, { waitUntil: ['load', 'networkidle0'] })
                let [err, screenshot] = await tryit(this.page.screenshot)({
                    type: 'png',
                    fullPage: true
                })
                if (err) await data.callback(err, null)
                screenshot = screenshot as Uint8Array
                await data.callback(null, Buffer.from(screenshot))
                await this.page.close()
                this.page = await this.browser.newPage()
            } finally {
                this.screenshoting = false
            }
        }
    }
}

export const renderer = new Renderer()