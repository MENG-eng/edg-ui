import {
  login,
  logout,
  getInfo
} from '@/api/login'
import {
  getToken,
  setToken,
  removeToken
} from '@/utils/auth'

import Cookies from 'js-cookie'

const role_energy = 'energy'
const role_admin = 'admin'

const user = {
  state: {
    token: getToken(),
    name: '',
    avatar: '',
    roles: [],
    permissions: [],
    deptId: '',
  },

  mutations: {
    SET_TOKEN: (state, token) => {
      state.token = token
    },
    SET_NAME: (state, name) => {
      state.name = name
    },
    SET_AVATAR: (state, avatar) => {
      state.avatar = avatar
    },
    SET_ROLES: (state, roles) => {
      state.roles = roles
    },
    SET_PERMISSIONS: (state, permissions) => {
      state.permissions = permissions
    },
    SET_DEPTID: (state, deptId) => {
      state.deptId = deptId
    },
  },

  actions: {
    // 登录
    Login({
      commit
    }, userInfo) {
      const username = userInfo.username.trim()
      const password = userInfo.password
      const code = userInfo.code
      const uuid = userInfo.uuid
      return new Promise((resolve, reject) => {
        login(username, password, code, uuid).then(res => {
          //  设置 token，作为用户已登陆的前端标识，存在 cookie 中
          setToken(res.token)
          commit('SET_TOKEN', res.token)

          getInfo(res.token).then(res => {

            // 设置根路由
            const roles = res.roles || []
            let role = roles.length > 0 ? roles[0] : null

            let rootRouter = 'data/user-center'
            switch (role) {
              case role_energy:
                rootRouter = '/data/index'
                break;

              case role_admin:
                rootRouter = '/data/index'
                break;

              default:
                rootRouter = 'data/user-center'
                break;
            }

            Cookies.set('rootRouter', rootRouter)

            resolve()
          }).catch(error => {
            reject(error)
          })

          //resolve()
        }).catch(error => {
          reject(error)
        })
      })
    },

    // 获取用户信息
    GetInfo({
      commit,
      state
    }) {
      return new Promise((resolve, reject) => {
        getInfo(state.token).then(res => {
          const user = res.user
          const avatar = user.avatar == "" ? require("@/assets/image/profile.jpg") : process.env.VUE_APP_BASE_API + user.avatar;
          if (res.roles && res.roles.length > 0) { // 验证返回的roles是否是一个非空数组
            commit('SET_ROLES', res.roles)
            commit('SET_PERMISSIONS', res.permissions)
          } else {
            commit('SET_ROLES', ['ROLE_DEFAULT'])
          }
          commit('SET_NAME', user.userName)
          commit('SET_AVATAR', avatar)
          commit('SET_DEPTID', user.deptId)
          sessionStorage.setItem('admin', user.admin === true ? 'true' : "false")
          resolve(res)
        }).catch(error => {
          reject(error)
        })
      })
    },

    // 退出系统
    LogOut({
      commit,
      state
    }) {
      return new Promise((resolve, reject) => {
        logout(state.token).then(() => {
          commit('SET_TOKEN', '')
          commit('SET_ROLES', [])
          commit('SET_PERMISSIONS', [])
          removeToken()
          resolve()
        }).catch(error => {
          reject(error)
        })
      })
    },

    // 前端 登出
    FedLogOut({
      commit
    }) {
      return new Promise(resolve => {
        commit('SET_TOKEN', '')
        removeToken()
        resolve()
      })
    }
  }
}

export default user
