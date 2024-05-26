import { createRouter, createWebHashHistory, createWebHistory } from 'vue-router'
import { staticRouter, errorRouter } from '@/routers/modules/staticRouter'
import { LOGIN_URL, ROUTER_WHITE_LIST } from '@/config'
import NProgress from '@/config/nprogress'
import { useUserStore } from '@/stores/modules/user'
import { useAuthStore } from '@/stores/modules/auth'

const mode = import.meta.env.VITE_ROUTER_MODE

const routerMode = {
  hash: () => createWebHashHistory(),
  history: () => createWebHistory()
}

const router = createRouter({
  history: routerMode[mode](),
  routes: [...staticRouter, ...errorRouter],
  strict: false,
  scrollBehavior: () => ({ left: 0, top: 0 })
})

/**
 * @description 路由拦截 beforeEach
 * */
router.beforeEach(async (to, from, next) => {
  const userStore = useUserStore()
  const authStore = useAuthStore()

  // 1.NProgress 开始
  NProgress.start()

  // 2.动态设置标题
  const title = import.meta.env.VITE_GLOB_APP_TITLE
  document.title = to.meta.title ? `${to.meta.title} - ${title}` : title

  // 3.判断是访问登陆页，有 Token 就在当前页面，没有 Token 重置路由到登陆页
  if (to.path.toLocaleLowerCase() === LOGIN_URL) {
    if (userStore.token) return next(from.fullPath)
    resetRouter()
    return next()
  }

  // 4.判断访问页面是否在路由白名单地址(静态路由)中，如果存在直接放行
  if (ROUTER_WHITE_LIST.includes(to.path)) return next()

  // 5.判断是否有 Token，没有重定向到 login 页面
  if (!userStore.token) return next({ path: LOGIN_URL, replace: true })

  // 6.如果没有菜单列表，就重新请求菜单列表并添加动态路由
  if (!authStore.authMenuListGet.length) {
    // await initDynamicRouter()
    return next({ ...to, replace: true })
  }

  // 7.存储 routerName 做按钮权限筛选
  authStore.setRouteName(to.name as string)

  // 8.正常访问页面
  next()
})

/**
 * @description 路由跳转错误
 * */
router.onError((error) => {
  NProgress.done()
  console.warn('路由错误', error.message)
})

/**
 * @description 路由跳转结束
 * */
router.afterEach(() => {
  NProgress.done()
})

/**
 * @description 重置路由
 * */
export const resetRouter = () => {
  const authStore = useAuthStore()
  authStore.flatMenuListGet.forEach((route) => {
    const { name } = route
    if (name && router.hasRoute(name)) router.removeRoute(name)
  })
}

export default router
