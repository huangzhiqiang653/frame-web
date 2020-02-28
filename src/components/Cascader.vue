<!--级联选择器默认值-->
/*
级联选择器默认值回显传值方法
单选，传code字符串，
多选，传所有code以逗号','拼接的字符串；如：'112,221,3342'
注：code为所选中节点的code
使用 init 方法设置默认值
*/
<template>
  <div class="block">
    <el-cascader
      style="width: 100%;height: 100%"
      :options="options"
      :props="setMore"
      :show-all-levels="false"
      :size="setSize"
      placeholder="请选择"
      @change="selectChange"
      @focus="focus"
      @blur="blur"
      @expand-change="expandChange"
      v-model="checkedValue"
      clearable>
    </el-cascader>
  </div>
</template>

<script>
    export default {
        name: 'Cascader',
        props: {
            setProps: {
                type: Object
            },
            setSize: {
                value: 'mini',
                type: String // medium / small / mini
            }
        },
        data() {
            return {
                showLevels: false, // 不显示完整路径
                setMore: {
                    multiple: false, // 多选
                    checkStrictly: false, // 父节点取消选中关联
                    value: 'value',
                    label: 'label',
                    children: 'children',
                    leaf: 'leaf'
                },
                options: [],
                checkedValue: [],
                oldSelectValue: null, // change事件中单选原始值
                oldRadioValue: null, // change事件中多选原始值
                selectValue: null, // 单选值
                radioValue: [], // 多选值
                selectObj: [], // 单选节点对象
                radioObj: [] // 多选节点对象
            }
        },
        mounted() {
            this.getAreaData()
        },
        methods: {
            // 数据重组
            init: function (val) {
                let _this = this
                if (this.setMore.multiple === true) {
                    // 多选
                    let arr = val.split(',')
                    let temp = []
                    // 对每一个选项进行重组
                    for (let i = 0; i < arr.length; i++) {
                        let nodeArr = _this.fitData(arr[i])
                        temp.push(nodeArr)
                    }
                    _this.checkedValue = temp
                } else {
                    // 单选
                    _this.checkedValue = _this.fitData(val)
                }
            },
            // 请求区划数据
            getAreaData: function () {
                if (!this.setSize) {
                    this.setSize = 'medium'
                }
                this.setMore = this.setProps
                let _this = this
                _this.options = JSON.parse(unescape(localStorage.getItem(this.GLOBAL.config.orgTreeName)))
                // _this.FUNCTIONS.systemFunction.interactiveData(
                //     _this,
                //     _this.GLOBAL.config.businessFlag.rtOrganization,
                //     _this.GLOBAL.config.handleType.getTree,
                //     null,
                //     null,
                //     resultData => {
                //         if (resultData) {
                //             _this.options = resultData
                //             console.log(_this.options)
                //         } else {
                //             _this.$message.warning('获取区划数据失败～')
                //         }
                //     }
                // )
            },
            // 向父组建传值
            // type 为返回值类型 type==value 返回当前节点的code type==obj 返回当前节点对象
            sendToParent: function (type) {
                let _this = this
                if (_this.setMore.multiple === true) {
                    if (type === 'value') {
                        return _this.radioValue
                    } else {
                        return _this.radioObj
                    }
                } else {
                    if (type === 'value') {
                        return _this.selectValue
                    } else {
                        return _this.selectObj
                    }
                }
            },
            // 当选中节点变化时触发 选中节点的值
            selectChange: function (e) {
                let _this = this
                console.log(e)
                // 单选
                if (_this.setMore.multiple === false) {
                    _this.oldSelectValue = e
                    _this.selectObj = []
                    let temp = _this.getCascaderObj(e, _this.options)
                    let length = temp.length - 1
                    _this.selectObj.push(temp[length])
                    _this.selectValue = temp[length][_this.setMore['value']]
                } else {
                    // 多选
                    _this.oldRadioValue = e
                    _this.radioValue = []
                    _this.radioObj = []
                    for (let itm of e) {
                        let temp = _this.getCascaderObj(itm, _this.options)
                        let length = temp.length - 1
                        _this.radioObj.push(temp[length])
                    }
                    for (let val of _this.radioObj) {
                        _this.radioValue.push(val[_this.setMore['value']])
                    }
                }
            },
            // 当展开节点发生变化时触发 各父级选项值组成的数组
            expandChange: function (e) {
            },
            // 当失去焦点时触发
            blur: function () {
            },
            // 当获取焦点时触发
            focus: function () {
            },
            // 遍历数据源，返回节点对象
            getCascaderObj: function (val, opt) {
                let _this = this
                return val.map(function (value, index, array) {
                    for (let itm of opt) {
                        if (itm[_this.setMore['value']] === value) {
                            opt = itm.children
                            return itm
                        }
                    }
                    return null
                })
            },
            // 获取父组建默认值并组装数据
            fitData: function (data) {
                let arr = [] // 在递归时操作的数组
                let returnArr = [] // 存放结果的数组
                let depth = 0 // 定义全局层级
                function childrenEach(childrenData, depthN) {
                    for (let j = 0; j < childrenData.length; j++) {
                        depth = depthN // 将执行的层级赋值 到 全局层级
                        arr[depthN] = (childrenData[j].code)
                        if (childrenData[j].code === data) {
                            returnArr = arr.slice(0, depthN + 1) // 将目前匹配的数组，截断并保存到结果数组
                            break
                        } else {
                            if (childrenData[j].children) {
                                depth++
                                childrenEach(childrenData[j].children, depth)
                            }
                        }
                    }
                    return returnArr
                }
                return childrenEach(this.options, depth)
            }
        }
    }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
