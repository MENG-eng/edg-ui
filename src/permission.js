import router from './router'
import store from './store'
import infoDetail from './components/Introduce/introduce'
import {
  Message
} from 'element-ui'
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'
import {
  getToken
} from '@/utils/auth'
import {
  getRootRouter
} from "@/utils/permission.js";

NProgress.configure({
  showSpinner: false
})

const whiteList = ['/login', '/auth-redirect', '/bind', '/register', '/blog']
const whiteRegList = [/^\/blog\//]

router.beforeEach((to, from, next) => {
  NProgress.start()
  // 当前为博客
  if (process.env.VUE_APP_BLOG === 'true') {
    if (to.path === '' || to.path === '/' || whiteReg(to.path)) {
      next()
    }
    NProgress.done()
    return
  }
  // 当前为管理后台
  if (getToken()) {
    /* has token*/
    if (to.path === '/login' || to.path === '/' || to.path === '' || to.path === '/data') {
      console.log(to.path)
      next(getRootRouter())
      NProgress.done()
    } else {
      if (store.getters.roles.length === 0) {
        // 判断当前用户是否已拉取完user_info信息
        store.dispatch('GetInfo').then(res => {
          // 拉取user_info
          const roles = res.roles
          store.dispatch('GenerateRoutes', {
            roles
          }).then(accessRoutes => {
            // 测试 默认静态页面
            // store.dispatch('permission/generateRoutes', { roles }).then(accessRoutes => {
            // 根据roles权限生成可访问的路由表
            router.addRoutes(accessRoutes) // 动态添加可访问路由表
            next({
              ...to,
              replace: true
            }) // hack方法 确保addRoutes已完成
          })
        })
          .catch(err => {
            store.dispatch('FedLogOut').then(() => {
              Message.error(err)
              next({
                path: getRootRouter()
              })
            })
          })
      } else {
        next()
        // 没有动态改变权限的需求可直接next() 删除下方权限判断 ↓
        // if (hasPermission(store.getters.roles, to.meta.roles)) {
        //   next()
        // } else {
        //   next({ path: '/401', replace: true, query: { noGoBack: true }})
        // }
        // 可删 ↑
      }
    }
  } else {
    // 没有token
    if (whiteList.indexOf(to.path) !== -1 || whiteReg(to.path)) {
      // 在免登录白名单，直接进入
      next()
    } else {
      next(`/login?redirect=${to.fullPath}`) // 否则全部重定向到登录页
      NProgress.done()
    }
  }
})

function whiteReg(path) {
  var arr = whiteRegList.filter(reg => {
    return path.match(reg)
  })
  return arr.length > 0
}

router.afterEach((to) => {
  let info = infoDetail.infoDetail;
  store.dispatch("nav/changeNav", info[to.path])
  NProgress.done()
})
