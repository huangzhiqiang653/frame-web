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
      :getCheckedNodes="getCheckedNodes"
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
            setOptions: {
                type: Array
            },
            setDataType: { // 返回的参数类型 value obj
                type: String
            },
            setSize: {
                type: String // medium / small / mini
            }

        },
        data () {
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
                selectValue: null, // 单选值
                radioValue: [], // 多选值
                selectObj: [], // 单选节点对象
                radioObj: [] // 多选节点对象
            }
        },
        mounted () {
            this.init()
        },
        methods: {
            init: function () {
                if (!this.setSize) {
                    this.setSize = 'medium'
                }
                this.setMore = this.setProps
                this.options = this.setOptions
            },
            // 向父组建传值
            sendToParent: function () {
                let _this = this
                if (_this.setMore.multiple === true) {
                    if (_this.setDataType === 'value') {
                        return _this.radioValue
                    } else if (_this.setDataType === 'obj') {
                        return _this.radioObj
                    }
                } else {
                    if (_this.setDataType === 'value') {
                        return _this.selectValue
                    } else if (_this.setDataType === 'obj') {
                        return _this.selectObj
                    }
                }
            },
            // 当选中节点变化时触发 选中节点的值
            selectChange: function (e) {
                let _this = this
                // 单选
                if (_this.setMore.multiple === false) {
                    _this.selectObj = []
                    let temp = _this.getCascaderObj(e, _this.options)
                    let length = temp.length - 1
                    _this.selectObj.push(temp[length])
                    _this.selectValue = temp[length][_this.setMore['value']]
                    console.log(_this.selectObj)
                    console.log(_this.selectValue)
                } else {
                    // 多选
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
                    console.log(_this.radioValue)
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
            // 获取选中的节点
            getCheckedNodes: function (e) {
                console.log(e)
                let _this = this
                // 单选
                if (_this.setMore.multiple === false) {
                    _this.selectValue = e
                } else {
                    // 多选
                    _this.radioValue = e
                }
            },
            // 遍历数据源，返回节点对象
            getCascaderObj: function (val, opt) {
                return val.map(function (value, index, array) {
                    for (let itm of opt) {
                        if (itm.value === value) {
                            opt = itm.children
                            return itm
                        }
                    }
                    return null
                })
            }
        }
    }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
