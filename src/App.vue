<template>
  <div id="app" class="app">
    <indexPage/>
  </div>
</template>

<script>
  import indexPage from './Index'

  export default {
    name: 'App',
    data () {
      return {
        hasLogin: true
      }
    },
    components: {
      indexPage
    },
    created: async function () {
      this.hasLogin = false
      let _this = this
      validateAndInitData()

      // 登陆及初始化页面数据
      function validateAndInitData () {
        _this.FUNCTIONS.systemFunction.commonGet(
          _this.CONFIG.urls.root + _this.CONFIG.urls.index.login,
          result => {
            debugger
            if (result.code === _this.GLOBAL.config.resultCode.notLogin) {
              window.location.href = result.data
            } else if (result.code === _this.GLOBAL.config.resultCode.success) {
              // 基本数据缓存-----start--------------
              let userInfo = result.data.userInfo, dictionaryList = result.data.dictionaryList
              userInfo && localStorage.setItem(_this.GLOBAL.config.userConfigName, JSON.stringify(userInfo))
              dictionaryList && dictionaryCache(dictionaryList)
              // 基本数据缓存-----end----------------

              _this.hasLogin = true
            } else if (typeof result === _this.GLOBAL.config.dataType.string) {
              validateAndInitData()
            } else {
              _this.$message.error('登陆校验失败～请联系管理员')
            }
          }
        )
      }

      // 缓存字典数据
      function dictionaryCache (dictionaryList) {
        if (dictionaryList && dictionaryList.length > 0) {
          let parents = dictionaryList.filter(item => !item.parentCode)
          parents && parents.length > 0 && parents.forEach(dictionary => {
            let _parentCode = dictionary.code
            let dictionaryDetails = dictionaryList.filter(item => item.parentCode === _parentCode).sort((a, b) => a.sort - b.sort)
            localStorage.removeItem(_this.GLOBAL.config.dictionaryPre + _parentCode)
            localStorage.setItem(_this.GLOBAL.config.dictionaryPre + _parentCode, escape(JSON.stringify(dictionaryDetails)))
          })
        }
      }
    }
  }
</script>
