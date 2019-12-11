/* 全局变量 */
const config = {
  dictionaryPre: 'fwfx_dictionary_',
  userConfigName: 'userInfo',
  psDataName: 'ps_personnel_list',
  systemSize: 'mini',
  dictionary: {
    caseType: 'caseType',
    disputeType: 'disputeType',
    serviceType: 'serviceType',
    riskGrade: 'riskGrade',
    appealType: 'appealType',
    outsideLawerFlag: 'outsideLawerFlag',
    costFlag: 'costFlag',
    caseState: 'caseState',
    riskType: 'riskType',
    eventState: 'eventState',
    hearingProcedure: 'hearingProcedure',
    closingMethod: 'closingMethod'
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
    system: 'system'
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
    updateSelfInfo: 'updateSelfInfo'
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
