import axios from 'axios'
import {
  Notification,
  MessageBox,
  Message
} from 'element-ui'
import store from '@/store'
import {
  getToken
} from '@/utils/auth'
import errorCode from '@/utils/errorCode'
import {
  getRootRouter
} from '@/utils/permission'

const whiteList = [
  /^\/api\//
]

axios.defaults.headers['Content-Type'] = 'application/json;charset=utf-8'
// 创建axios实例
const service = axios.create({
  // axios中请求配置有baseURL选项，表示请求URL公共部分
  baseURL: process.env.VUE_APP_BASE_API,
  // 超时
  timeout: 30000
})
// request拦截器
service.interceptors.request.use(config => {
  // 是否需要设置 token
  const isToken = (config.headers || {}).isToken === false

  if (getToken() && !isToken) {
    if (!atWhiteList(config.url)) {
      config.headers['Authorization'] = 'Bearer ' + getToken() // 让每个请求携带自定义token 请根据实际情况自行修改
    }
  }
  return config
}, error => {
  console.log(error)
  Promise.reject(error)
})

function atWhiteList(theUrl) {
  let at = false;
  for (let idx = 0; idx < whiteList.length; idx++) {
    const reg = whiteList[idx];
    if (theUrl.match(reg)) {
      at = true;
      break
    }
  }
  return at
}

// 响应拦截器
service.interceptors.response.use(res => {
    // 未设置状态码则默认成功状态
    const code = res.data.code || 200;
    // 获取错误信息
    const msg = errorCode[code] || res.data.msg || errorCode['default']
    if (code === 401) {
      MessageBox.confirm('登录状态已过期，您可以继续留在该页面，或者重新登录', '系统提示', {
        confirmButtonText: '重新登录',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        store.dispatch('LogOut').then(() => {
          location.href = getRootRouter();
        })
      })
    } else if (code === 500) {
      Notification({
        title: '错误提示',
        message: msg,
        type: 'error',
        duration: 0
      })
      return Promise.resolve('')
    } else if (code !== 200) {
      Notification.error({
        title: msg
      })
      return Promise.reject('error')
    } else {
      return res.data
    }
  },
  error => {
    console.log('err' + error)
    let {
      message
    } = error;
    if (message == "Network Error") {
      message = "后端接口连接异常";
    } else if (message.includes("timeout")) {
      message = "系统接口请求超时";
    } else if (message.includes("Request failed with status code")) {
      message = "系统接口" + message.substr(message.length - 3) + "异常";
    }
    Message({
      message: message,
      type: 'error',
      duration: 5 * 1000
    })
    return Promise.reject(error)
  }
)

export default service
