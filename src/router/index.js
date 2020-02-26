import Vue from 'vue'
import Router from 'vue-router'
import GenerateCode from '@/view/CodeGenerate'
import Organization from '@/view/system/organization/OrganizationTable'
import Villager from '@/view/system/villager/VillagerView'
import VillagerInfo from '@/view/system/villager/VillagerInfo'
import Cars from '@/view/system/car/CarsTable'
import CarsInfo from '@/view/system/car/CarsInfo'
import RepairUsers from '@/view/system/repair/RepairUserTable'
import RepairUserInfo from '@/view/system/repair/RepairUserInfo'
import Configs from '@/view/system/config/ConfigTable'
import WorkApplys from '@/view/system/workbench/WorkApplyTable'
import WorkApplyOperateDialog from '@/view/system/workbench/WorkApplyOperateDialog'
import UserApplys from '@/view/system/workbench/UserApplyTable'

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
      // 区域信息管理
      path: '/organization',
      name: 'Organization',
      component: Organization
    },
    {
      // 村民信息管理
      path: '/villager',
      name: 'Villager',
      component: Villager
    },
    {
      path: '/villager/villagerInfo',
      name: 'VillagerInfo',
      component: VillagerInfo
    },
    {
      // 抽粪车辆信息
      path: '/cars/carsInfo',
      name: 'CarsInfo',
      component: CarsInfo
    },
    {
      // 抽粪车辆管理
      path: '/cars',
      name: 'Cars',
      component: Cars
    },
    {
      // 维修人员管理
      path: '/repairUsers',
      name: 'RepairUsers',
      component: RepairUsers
    },
    {
      path: '/repairUsers/repairUserInfo',
      name: 'RepairUserInfo',
      component: RepairUserInfo
    },
    {
      // 配置管理
      path: '/configs',
      name: 'Configs',
      component: Configs
    },
    {
      // 工作台列表
      path: '/workApplys',
      name: 'WorkApplys',
      component: WorkApplys
    },
    {
      // 工作台详细
      path: '/workApplys/WorkApplyOperateDialog',
      name: 'WorkApplyOperateDialog',
      component: WorkApplyOperateDialog
    },
    {
      // 人员审核
      path: '/userApplys',
      name: 'UserApplys',
      component: UserApplys
    }
  ]
})
