import axios from 'axios'
import example from './example'
import sysApi from './sysApi'
import { SessionStorage, StorageKeys } from '../utils'
// 接口模块
const token = SessionStorage.get(StorageKeys.token)
// 实例化 ajax请求对象
const ajaxinstance = axios.create({
  baseURL: 'http://localhost:8081',
  timeout: 60000,
  headers: {
    'Content-Type': 'application/json; charset=utf-8',
    'token': token === undefined ? '' : token
  }
})

// 请求拦截器
ajaxinstance
  .interceptors
  .request
  .use((config) => {
    return config
  }, (error) => {
    Promise.reject(error)
  })

// 响应拦截器
ajaxinstance
  .interceptors
  .response
  .use((response) => {
    return response.data
  }, (error) => {
    return Promise.reject(error)
  })

/**
 * [API api接口封装]
 * @type {Object}
 */
const API = {
  ...example,
  ...sysApi
}
export const ajax = ajaxinstance
export default API
