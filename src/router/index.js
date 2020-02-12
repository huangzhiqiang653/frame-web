import Vue from 'vue'
import Router from 'vue-router'
import GenerateCode from '@/view/CodeGenerate'
import Account from '@/view/system/account/ZxAccountTable'
import User from '@/view/system/user/ZxUserTable'
import Dictionary from '@/view/system/dictionary/ZxDictionaryTable'
import Role from '@/view/system/role/ZxRoleTable'
import Organisation from '@/view/system/organisation/ZxOrganization'
import Menu from '@/view/system/menu/ZxMenu'
import Redis from '@/view/system/redis/ZxRedisTable'
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
      // 用户管理
      path: '/user',
      name: 'User',
      component: User
    },
    {
      // 账号管理
      path: '/account',
      name: 'Account',
      component: Account
    },
    {
      // 角色管理
      path: '/role',
      name: 'Role',
      component: Role
    },
    {
      // 菜单资源
      path: '/menu',
      name: 'Menu',
      component: Menu
    },
    {
      // 组织机构
      path: '/organisation',
      name: 'Organisation',
      component: Organisation
    },
    {
      // 字典管理
      path: '/dictionary',
      name: 'Dictionary',
      component: Dictionary
    },
    {
      // redis缓存
      path: '/redis',
      name: 'Redis',
      component: Redis
    },
    {
      // 注册
      path: '/RegisterAccount',
      name: 'RegisterAccount',
      component: RegisterAccount
    }
  ]
})
