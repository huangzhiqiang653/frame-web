import axios from 'axios'

const systemFunction = {
  login: function (url, callback) {
    axios({
      method: 'GET',
      headers: {
        'Content-type': 'application/x-www-form-urlencoded'
      },
      url: url
    }).then(respData => {
      if (respData && respData.data && respData.data.code && (respData.data.code === '302')) {
        location.href = respData.data.data
      } else {
        callback && callback()
      }
    }).catch(resp => {

    })
  },
  /**
   * 数据交互
   * @param _this
   * @param businessType
   * @param handleType
   * @param data
   * @param dataType
   * @param callback
   */
  interactiveData: function (_this, businessType, handleType, data, dataType, callback) {
    // 基本校验========start====================
    if (typeof _this === 'undefined') {
      alert('this参数未传，请联系管理员处理～')
      return
    }
    if (typeof businessType === 'undefined') {
      _this.$message({
        showClose: true,
        message: '业务模块参数未传～',
        type: 'warning'
      })
      return
    }
    if (typeof handleType === 'undefined') {
      _this.$message({
        showClose: true,
        message: '操作类型参数未传～',
        type: 'warning'
      })
      return
    }
    // 基本校验========end++====================
    let paramsInfo = {
      'type': handleType,
      'info': data
    }, paramsInfos = {
      'type': handleType,
      'infos': data
    }
    _this.FUNCTIONS.systemFunction.jsonPost(
      _this.CONFIG.urls.root + _this.CONFIG.urls.business[businessType],
      (dataType ? paramsInfos : paramsInfo),
      resultData => {
        if (resultData.code === '0') {
          callback && callback(resultData.data)
        } else {
          _this.$message({
            showClose: true,
            message: '操作失败～',
            type: 'warning'
          })
        }
      },
      () => {
        _this.$message({
          showClose: true,
          message: '请求异常，请联系管理员～',
          type: 'error'
        })
      }
    )

  },
  jsonPost: (url, params, callback, errorback) => {
    url && axios({
      method: 'POST',
      headers: {
        'Content-type': 'application/json;charset=UTF-8'
      },
      url: url,
      data: JSON.stringify(params)
    }).then(resp => {
      callback && callback(resp.data)
    }).catch(resp => {
      if (resp && resp.response && resp.response.status) {
        switch (resp.response.status) {
          case 400:
            break
          default:
            errorback && errorback(resp)
        }
      } else {
        errorback && errorback(resp)
      }
    })
  },
  formPost: (url, params, callback, errorback) => {
    url && axios({
      method: 'POST',
      headers: {
        'Content-type': 'application/x-www-form-urlencoded'
      },
      url: url,
      data: params
    }).then(resp => {
      callback && callback(resp.data)
    }).catch(resp => {
      if (resp && resp.response && resp.response.status) {
        switch (resp.response.status) {
          case 400:
            break
          default:
            errorback && errorback(resp)
        }
      } else {
        errorback && errorback(resp)
      }
    })
  },
  commonGet: (url, callback, errorback) => {
    url && axios({
      method: 'GET',
      headers: {
        'Content-type': 'application/x-www-form-urlencoded'
      },
      url: url
    }).then(resp => {
      callback && callback(resp.data)
    }).catch(resp => {
      errorback && errorback(resp)
    })
  },
  downloadGet: (url, callback, errorback) => {
    url && axios({
      method: 'GET',
      headers: {
        'Content-type': 'application/json;charset=UTF-8'
      },
      url: url,
      responseType: 'arraybuffer'
    }).then(resp => {
      callback && callback(resp.data)
    }).catch(resp => {
      errorback && errorback(resp)
    })
  },
  getDictionary: (keyId, callback) => {

  },
  getConfigData: function (cacheType, keyId, callback, _this) {
    if (!localStorage.getItem(cacheType)) {
      _this.FUNCTIONS.systemFunction.getDictionary(keyId, data => {
        localStorage.setItem(cacheType, escape(JSON.stringify(data)))
        callback && callback(data)
      })
    } else {
      callback && callback(JSON.parse(unescape(localStorage.getItem(cacheType))))
    }
  },
  formatTime: function (number, format) {
    function formatNumber (n) {
      n = n.toString()
      return n[1] ? n : '0' + n
    }

    let formateArr = ['Y', 'M', 'D', 'h', 'm', 's']
    let returnArr = []

    let date = new Date(number)
    returnArr.push(date.getFullYear())
    returnArr.push(formatNumber(date.getMonth() + 1))
    returnArr.push(formatNumber(date.getDate()))

    returnArr.push(formatNumber(date.getHours()))
    returnArr.push(formatNumber(date.getMinutes()))
    returnArr.push(formatNumber(date.getSeconds()))

    for (let i in returnArr) {
      format = format.replace(formateArr[i], returnArr[i])
    }
    return format
  },
  getConfigDataBatch: function (cfgList, _this) {
    cfgList.forEach(function (item) {
      _this.FUNCTIONS.systemFunction.getConfigData(item.data.listName, item.data.keyId, item.callback, _this)
    })
  },
  ages: function (str) {
    let r = str.match(/^(\d{1,4})(-|\/)(\d{1,2})\2(\d{1,2})$/)
    if (r == null) return false
    let d = new Date(r[1], r[3] - 1, r[4])
    if (d.getFullYear() == r[1] && (d.getMonth() + 1) == r[3] && d.getDate() == r[4]) {
      let Y = new Date().getFullYear()
      return ('年龄   =   ' + (Y - r[1]) + '   周岁')
    }
    return ('输入的日期格式错误！')
  },
  // 清除对象中的空字符
  removeNullFields: function (entry) {
    for (let key in entry) {
      if (!entry[key]) {
        delete entry[key]
      }
      if (entry[key] && entry[key].length === 0) {
        delete entry[key]
      }
    }
    return entry
  },
  // 分页参数设置
  paginationSet: function (currentPage, pageSize, infoData) {
    currentPage = currentPage || 1
    pageSize = pageSize || 10
    return {
      current: currentPage,
      size: pageSize,
      records: [infoData]
    }
  },
  /**
   * 获取字典数据
   * @param targetCode
   * @param listName
   * @returns {string}
   */
  getConfigValue: function (targetCode, listName) {
    let resultName = '--'
    let storageData = localStorage.getItem(listName)
    if (storageData) {
      let resultData = JSON.parse(unescape(storageData)) || []
      resultData.forEach(function (entry) {
        if (entry.code === targetCode) {
          resultName = entry.name
        }
      })
    }
    return resultName
  },
  /**
   * 获取服务人员名字数据
   * @param targetValue
   * @param listName
   * @returns {string}
   */
  getPsValue: function (targetValue, listName) {
    let resultName = '--'
    let storageData = localStorage.getItem(listName)
    if (storageData) {
      let resultData = JSON.parse(unescape(storageData)) || []
      resultData.forEach(function (entry) {
        if (entry.id === targetValue) {
          resultName = entry.name
        }
      })
    }
    return resultName
  },
  /**
   * 系统时间转换
   * @param _this， 系统this
   * @param object 需要转换的对象
   * @param fieldList 需要转换的字段
   * @returns {*}
   */
  dateFormatChange: function (_this, object, fieldList) {
    fieldList && (fieldList.length > 0) && fieldList.forEach(field => {
      if (
        typeof object[field] === 'number' ||
        typeof object[field] === 'string'
      ) {
        object[field] = _this.$moment(object[field])
      }
    })
    return object
  },
  /**
   * 获取部门名称
   * @param _this 当前vue
   * @param targetValue 目标值
   * @param targetType 目标类型，id或code
   * @returns {string}
   */
  getOrgName: function (_this, targetValue, targetType) {
    let orgName = '--',
      cacheDataStr = unescape(localStorage.getItem('os')),
      cacheData = cacheDataStr ? JSON.parse(cacheDataStr) : null
    if (cacheData) {
      for (let i = 0; i < cacheData.length; i++) {
        if (cacheData[i][targetType] === targetValue) {
          orgName = cacheData[i].name
          break
        }
      }
      return orgName
    } else {
      _this.FUNCTIONS.systemFunction.commonGet(
        _this.GLOBAL.url[_this.CONFIG.projectRoot] + _this.CONFIG.urls.system.getAllOrgData,
        resultData => {
          if (resultData.code === '0') {
            localStorage.setItem('os', escape(JSON.stringify(resultData.data)))
            callback && callback()
          } else {
            _this.$message.warn('获取组织数据失败，请刷新页面～')
          }
        },
        () => _this.$message.error('获取组织数据异常～，请联系管理员～')
      )
      return '-.-'
    }

  },
  timeToDate: function (_this, dateTime, formate) {
    return _this.$moment(dateTime).format(formate || 'YYYY-MM-DD')
  },
  /**
   * 导出
   * @param 当前vue
   * @param 请求参数集合
   *
   * */
  exportFunction: function (_this, params) {
    let date = new Date().getTime()
    let paramsStr = '?'
    for (let key in params) {
      paramsStr = paramsStr + key + '=' + params[key] + '&'
    }
    paramsStr = paramsStr + 'date=' + date
  },

  exportText: function (_this, params, model, template) {
    let keyArr = []
    let valueArr = []
    for (let key in params) {
      keyArr.push(key)
      valueArr.push(params[key])
    }
  },
  fileDownload: function (file) {
    (file && file.response && (file.response.code === '0') && file.response.data.fileUrl)
      ?
      window.open(encodeURI(file.response.data.fileUrl), '_blank')
      :
      this.$message.warning('下载参数有误～请联系管理员～')
  },
  fileTypeView: function (_this, file) {
    if ((file && file.response &&
      (file.response.code === '0') && file.response.data.fileType)) {
      switch (file.response.data.fileType) {
        case 'xls':
        case 'xlsx':
        case 'xlsm':
        case 'xltx':
        case 'xltm':
        case 'xlsb':
        case 'xlam':
          return require('../../assets/image/file/excel.png')
        case 'doc':
        case 'docx':
        case 'docm':
        case 'dotx':
        case 'dotm':
          return require('../../assets/image/file/word.png')
        case 'ppt':
        case 'pptx':
        case 'pptm':
        case 'ppsx':
        case 'potx':
        case 'potm':
        case 'ppam':
          return require('../../assets/image/file/ppt.png')
        case 'pdf':
          return require('../../assets/image/file/pdf.png')
        case 'bmp':
        case 'image':
        case 'jpg':
        case 'jpeg':
        case 'png':
        case 'gif':
        case 'pcx':
        case 'tiff':
        case 'svg':
        case 'psd':
          return file.response.data.fileUrl
        default:
          return require('../../assets/image/file/file.png')
      }
    }
  },
  postDownFile: function (_this, params) {
    axios({
      method: 'post',
      url: _this.CONFIG.urls.root + _this.CONFIG.urls.system.downFile,
      data: params,
      responseType: 'blob'
    }).then(response => {
      if (!response) {
        _this.$message.warn('返回数据为空')
      } else {
        const headers = response.headers
        const content = response.data
        const blob = new Blob([content])
        let fileName = headers.filename ? decodeURI(headers.filename) : 'nameNull'
        if ('download' in document.createElement('a')) { // 非IE下载
          const elink = document.createElement('a')
          elink.download = fileName
          elink.style.display = 'none'
          elink.href = URL.createObjectURL(blob)
          document.body.appendChild(elink)
          elink.click()
          URL.revokeObjectURL(elink.href) // 释放URL 对象
          document.body.removeChild(elink)
        } else { // IE10+下载
          navigator.msSaveBlob(blob, fileName)
        }
      }
    }).catch((error) => {
      _this.$message.error('请求异常～请联系管理员')
    })
  }
}

export default {
  systemFunction
}
