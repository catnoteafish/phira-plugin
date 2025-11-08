import axios, { AxiosError } from 'axios'
import config from './config.js'
import { map, tryit } from 'radash'

interface Room {
    id: string
    host: number
    locked: boolean
    cycle: boolean
    chart: number
    state: string
    players: Players[]
}

type ServerList = Room[]

interface Players {
    name: string
    id: number
}

interface templateData {
    name: string
    host: string
    count: number
    status: string
    cycle: string
    locked: string
    chart: string
}

type templateDataList = templateData[]


export async function idToName(userId: number | string): Promise<string> {
  const [err, resp] = await tryit(axios.get)(`https://api.phira.cn/user/${userId}`, {
    timeout: 3000,
  });

  if (!err && resp?.status === 200) {
    return resp.data.name;
  }

  const axiosErr = err as AxiosError;
  if (!axiosErr?.response || [404, 500, 501].includes(axiosErr.response.status)) {
    return "无法连接到服务器";
  }

  throw new Error(`Error fetching name for user_id ${userId}: HTTP ${axiosErr.response.status}`);
}

export async function chartToName(chartId: number): Promise<string> {
  if (chartId < 1) {
    return "无";
  }

  const [err, resp] = await tryit(axios.get)(`https://api.phira.cn/chart/${chartId}`, {
    timeout: 3000,
  });

  if (!err && resp?.status === 200) {
    return resp.data.name;
  }

  const axiosErr = err as AxiosError;
  if (!axiosErr?.response || [404, 500, 501].includes(axiosErr.response.status)) {
    return "无法连接到服务器";
  }

  throw new Error(`Error fetching name for chart_id ${chartId}: HTTP ${axiosErr.response.status}`);
}

export async function GetList(): Promise<ServerList> {
    const data = await axios.get(config.url)
    return data.data
}

export async function templateList(): Promise<templateDataList> {
    const list = await GetList()
    const data = await map(list, async (room: Room): Promise<templateData> => {
        return {
            name: room.id,
            host: await idToName(room.id),
            count: room.players.length,
            status: room.state,
            cycle: room.cycle ? "是" : "否",
            locked: room.locked ? "是" : "否",
            chart: await chartToName(room.chart)
        }
}) as unknown as templateDataList
    return data
}