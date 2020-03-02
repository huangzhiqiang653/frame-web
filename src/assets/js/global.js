/* 全局变量 */
const config = {
  dictionaryPre: 'zx_auth_dictionary_',
  userConfigName: 'userInfo',
  orgConfigName: 'orgInfoMap',
  authConfigName: 'authRoles',
  orgTreeName: 'orgTree',
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
    rtCar: 'rtCar',
    rtUser: 'rtUser',
    rtManageArea: 'rtManageArea',
    rtOrganization: 'rtOrganization',
    rtRepair: 'rtRepair',
    rtPump: 'rtPump',
    zxMenu: 'zxMenu',
    zxUser: 'zxUser',
    zxDictionary: 'zxDictionary',
    zxOrganization: 'zxOrganization',
    zxResource: 'zxResource',
    zxRelationRoleMenu: 'zxRelationRoleMenu',
    zxRelationRoleResource: 'zxRelationRoleResource',
    zxRelationAccountRole: 'zxRelationAccountRole',
    rtConfig: 'rtConfig'
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
    deleteUsers: 'deleteUsers',
    deleteConfigs: 'deleteConfigs',
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
    initialAccountPwd: 'initialAccountPwd',

    // rts
    updateBatchPersonnel: "updateBatchPersonnel",
    removeUserRole: "removeUserRole",
    getMyPage: 'getMyPage',
    tellRrepairedPage: 'tellRrepairedPage',
    tellPumpPage: 'tellPumpPage',
    getPageRecordRepair: 'getPageRecordRepair',
    getPageRecordPumpCar: 'getPageRecordPumpCar'
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
  },
  //用户类别
  userType: {
    villager: 'villager',
    villageManage: 'villageManage',
    systemManage: 'systemManage',
    repairPersonnel: 'repairPersonnel',
    driver: 'driver',
  },
  //字典
  dictionaryData: {
    //任务申请类型
    applyType: [
      {id: '1', name: '报修', code: 0},
      {id: '2', name: '报抽', code: 1}
    ],
    //分派状态
    assignStatus: [
      {id: '1', name: '已分派', code: 'assigned'},
      {id: '2', name: '已办结', code: 'finish'},
      {id: '3', name: '未分派', code: 'unassigned'}
    ],
    //区域类别
    orgType: [
      {id: '1', name: '乡镇', code: 0},
      {id: '2', name: '村居', code: 1}
    ],
    //工作状态
    workStatus: [
      {id: '1', name: '在职', code: 0},
      {id: '2', name: '离职', code: 1}
    ],
    //用户类型
    userType: [
      {id: '1', name: '村民', code: 'villager'},
      {id: '2', name: '村管', code: 'villageManage'},
      {id: '3', name: '系统管理员', code: 'systemManage'},
      {id: '4', name: '维修人员', code: 'repairPersonnel'},
      {id: '5', name: '司机', code: 'driver'},
    ],
    //审批状态
    approval_status: [
      {id: '1', name: '待审批', code: 0},
      {id: '2', name: '审批通过', code: 1},
      {id: '3', name: '审批未过', code: 2}
    ],
    //维修状态
    repairStatus: [
      {id: '1', name: '未上门', code: 0},
      {id: '2', name: '维修中', code: 1},
      {id: '3', name: '已维修', code: 2}
    ],
    //抽粪状态
    pumpStatus: [
      {id: '1', name: '未抽', code: 0},
      {id: '2', name: '已抽', code: 1},
    ],
    //超时标志
    overtimeFlag: [
      {id: '1', name: '未超时', code: 0},
      {id: '2', name: '已超时', code: 1},
    ],
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
