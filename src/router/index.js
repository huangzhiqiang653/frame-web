import Vue from 'vue'
import Router from 'vue-router'
import GenerateCode from '@/view/CodeGenerate'
import Account from '@/view/system/account/ZxAccountTable'
import User from '@/view/system/user/ZxUserTable'
import Dictionary from '@/view/system/dictionary/ZxDictionaryTable'

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
      path: '/dictionary',
      name: 'Dictionary',
      component: Dictionary
    },
    {
      path: '/user',
      name: 'User',
      component: User
    }, {
      // 系统管理
      path: '/system',
      name: 'system',
      children: [
        {
          // 账号管理
          path: '/account',
          component: Account
        }
      ]
    }
  ]
})
