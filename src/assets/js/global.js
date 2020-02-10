/* 全局变量 */
const config = {
  dictionaryPre: 'zx_auth_dictionary_',
  userConfigName: 'userInfo',
  systemSize: 'mini',
  dictionary: {
    dictionaryType: 'dictionaryType',
    sex: 'sex',
    userStatus: 'userStatus',
    accountStatus: 'accountStatus',
    orgList: 'orgList'
  },
  resultCode: {
    success: '0',
    fail: '1',
    noAuth: '2',
    operateRepeat: '3',
    notLogin: '4'
  },
  dataType: {
    string: 'string',
    number: 'number',
    boolean: 'boolean',
    null: 'null',
    undefined: 'undefined',
    array: 'array',
    object: 'object',
    function: 'function'
  },
  businessFlag: {
    system: 'system',
    zxAccount: 'zxAccount',
    zxRole: 'zxRole',
    zxMenu: 'zxMenu',
    zxUser: 'zxUser',
    zxDictionary: 'zxDictionary',
    zxOrganization: 'zxOrganization',
    zxResource: 'zxResource',
    zxRelationRoleMenu: 'zxRelationRoleMenu',
    zxRelationRoleResource: 'zxRelationRoleResource',
    zxRelationAccountRole: 'zxRelationAccountRole'
  },
  handleType: {
    // 系统默认
    add: 'add',
    addBatch: 'addBatch',
    updateAll: 'updateAll',
    updateSelect: 'updateSelect',
    updateAllBatch: 'updateAllBatch',
    updateSelectBatch: 'updateSelectBatch',
    deletePhysical: 'deletePhysical',
    deleteLogical: 'deleteLogical',
    deletePhysicalBatch: 'deletePhysicalBatch',
    deleteLogicalBatch: 'deleteLogicalBatch',
    getInfoById: 'getInfoById',
    getListByCondition: 'getListByCondition',
    getAll: 'getAll',
    getPage: 'getPage',
    // 新增操作
    deleteAndAdd: 'deleteAndAdd',
    updateSelfInfo: 'updateSelfInfo',
    getTree: 'getTree',
    getAuthMenu: 'getAuthMenu',
    listAccountByRole: 'listAccountByRole',
    listRoleByAccountId: 'listRoleByAccountId',
    addRoleAccountsRelation: 'addRoleAccountsRelation',
    addAccountRolesRelation: 'addAccountRolesRelation',
    initialAccountPwd: 'initialAccountPwd'
  },
  dateFormat: {
    YMD: 'YYYY-MM-DD',
    yMd: 'yyyy-MM-dd',
    yMDHm: 'yyyy-MM-DD HH:mm',
    ymdhm: 'YYYY-MM-DD HH:mm',
    ymdhms: 'YYYY-MM-DD HH:mm:ss'
  },
  // 最多条数限制
  limitNum: {
    remind: 5,
    process: 10,
    hear: 5
  }
}
const message = {
  '登陆成功': ''
}
const columns = {}

export default {
  config,
  message,
  columns
}
