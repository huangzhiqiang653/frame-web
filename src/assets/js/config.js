const urls = {
  root: '/rts',
  index: {
    toLogin: '/rts/index/toLogin',
    login: '/auth/index/login',
    logout: '/auth/index/logout',
    registerAccount: '/auth/index/register',
    getMenu: '',
    getSource: ''
  },
  system: {
    upload: '/auth/zx-system/upload',
    downloadFastDFS: '/auth/zx-system/downFastDFS',
    downFile: '/auth/zx-system/downFile',
    validateDbConnect: '/auth/zx-system/validateDbConnect',
    getTableData: '/auth/zx-system/getTableData'
  },
  business: {
    rtManageArea: '/rts/rt-manage-area/base',
    rtCar: '/rts/rt-cars/base',
    rtUser: '/rts/rt-user/base',
    rtOrganization: '/rts/rt-organization/base',
    rtRepair: '/rts/rt-record-repair/base',
    rtPump: '/rts/rt-record-pump/base',
    rtConfig: '/rts/rt-config/base'
  }

}

export default {
  urls
}
