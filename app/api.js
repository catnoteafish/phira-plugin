import axios from 'axios';
import config from './config.js';

/**
 * @param {number|string} userId 
 * @returns {Promise<string>} 
 * @throws {Error} 
 */
export async function idToName(userId) {
  const resp = await axios.get(`https://api.phira.cn/user/${userId}`, { timeout: 3000 })
  if (resp.status !== 200) throw new Error(`获取用户失败，状态码: ${resp.status}`)
  return resp.data.name
}

/**
 * @param {number} chartId
 * @returns {Promise<string>} 
 * @throws {Error} 
 */
export async function chartToName(chartId) {
  if (chartId < 1) return '无'
  const resp = await axios.get(`https://api.phira.cn/chart/${chartId}`, { timeout: 3000 })
  if (resp.status !== 200) throw new Error(`获取谱面失败，状态码: ${resp.status}`)
  return resp.data.name
}

/**
 * @returns {Promise<Array<Room>>} 
 * @throws {Error} 
 */
export async function GetList() {
  const resp = await axios.get(`${config.url}/room`, { timeout: 5000 })
  if (resp.status !== 200) throw new Error(`获取房间列表失败，状态码: ${resp.status}`)
  return resp.data
}

/**
 * 
 * @returns {Promise<Array<templateData>>}
 * @throws {Error}
 */
export async function templateList() {
  const list = await GetList()
  return Promise.all(list['rooms'].map(async (room) => {
    const hostName = room.host.name || await idToName(room.host.id)
    const chartName = room.chart?.name || '空'
    return {
      name: room.id,
      host: hostName,
      count: room.players.length,
      status: room.state,
      cycle: room.cycle ? '是' : '否',
      locked: room.locked ? '是' : '否',
      chart: chartName
    }
  }))
}

export default {
  idToName,
  chartToName,
  GetList,
  templateList
}