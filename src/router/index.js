import Vue from 'vue'
import Router from 'vue-router'
import GenerateCode from '@/view/CodeGenerate'
import Villager from '@/view/system/villager/VillagerView'
import RegisterAccount from '@/view/system/RegisterAccount'

Vue.use(Router)
const VueRouterPush = Router.prototype.push
Router.prototype.push = function push (to) {
  return VueRouterPush.call(this, to).catch(err => err)
}

export default new Router({
  routes: [
    {
      path: '/',
      name: 'GenerateCode',
      component: GenerateCode
    },
    {
      // 村民信息管理
      path: '/villager',
      name: 'Villager',
      component: Villager
    },
    {
      // 注册
      path: '/RegisterAccount',
      name: 'RegisterAccount',
      component: RegisterAccount
    }
  ]
})
