const urls = {
  root: '/zxauth',
  index: {
    login: '/auth/index/login',
    logout: '/auth/index/logout',
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
    zxAccount: '/auth/zx-account/base',
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
