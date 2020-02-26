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
    rtCar: '/rts/rt-cars/base',
    zxRole: '/auth/zx-role/base',
    zxMenu: '/auth/zx-menu/base',
    zxUser: '/auth/zx-user/base',
    zxDictionary: '/auth/zx-dictionary/base',
    zxOrganization: '/auth/zx-organization/base',
    zxResource: '/auth/zx-resource/base',
    zxRelationRoleMenu: '/auth/zx-relation-role-menu/base',
    zxRelationRoleResource: '/auth/zx-relation-role-resource/base',
    zxRelationAccountRole: '/auth/zx-relaiton-account-role/base'
  }

}

export default {
  urls
}
