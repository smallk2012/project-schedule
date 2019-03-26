import Vue from 'vue'
import Router from 'vue-router'
import config from './config'

Vue.use(Router)
const router = new Router(config)
// let _this = Vue.prototype
router.beforeEach((to, from, next) => {
    // 这里写你的一些页面跳转控制逻辑
    next()
})
export default router
