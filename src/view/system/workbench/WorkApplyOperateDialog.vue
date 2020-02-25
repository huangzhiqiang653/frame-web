<!--zx_rts_db.t_rt_record_repair（报修记录表）-dialog-->
<template>
    <el-dialog :title="showTitle" :visible.sync="showFlag">
        <el-form
                :inline="true"
                :model="formData"
                class="demo-ruleForm"
                label-width="100px"
                :rules="formRules"
                ref="formData"
                :size="GLOBAL.config.systemSize"
                element-loading-text="数据处理中...请稍等..."
                :disabled="!editableFlag"
                v-loading="loading">
            <el-row class="margin-top-20">
                <el-col :span="4">
                    <el-form-item label="报修人主键：" prop="submitUserId">
                        <el-input v-model="formData.submitUserId" placeholder="报修人主键" maxlength="64"></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="4">
                    <el-form-item label="待修人主键：" prop="targetUserId">
                        <el-input v-model="formData.targetUserId" placeholder="待修人主键" maxlength="64"></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="4">
                    <el-form-item label="维修人主键：" prop="operationUserId">
                        <el-input v-model="formData.operationUserId" placeholder="维修人主键" maxlength="64"></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="4">
                    <el-form-item label="报修时间：" prop="reportTime">
                        <el-date-picker
                                style="width: 100%"
                                v-model="formData.reportTime"
                                type="date"
                                format="yyyy-MM-dd HH:mm:ss"
                                value-format="yyyy-MM-dd HH:mm:ss"
                                placeholder="选择报修时间：" prop="reportTime">
                        </el-date-picker>
                    </el-form-item>
                </el-col>
                <el-col :span="4">
                    <el-form-item label="上门时间：" prop="repairTime">
                        <el-date-picker
                                style="width: 100%"
                                v-model="formData.repairTime"
                                type="date"
                                format="yyyy-MM-dd HH:mm:ss"
                                value-format="yyyy-MM-dd HH:mm:ss"
                                placeholder="选择上门时间：" prop="repairTime">
                        </el-date-picker>
                    </el-form-item>
                </el-col>
                <el-col :span="4">
                    <el-form-item label="完成时间：" prop="finishTime">
                        <el-date-picker
                                style="width: 100%"
                                v-model="formData.finishTime"
                                type="date"
                                format="yyyy-MM-dd HH:mm:ss"
                                value-format="yyyy-MM-dd HH:mm:ss"
                                placeholder="选择完成时间：" prop="finishTime">
                        </el-date-picker>
                    </el-form-item>
                </el-col>
                <el-col :span="4">
                    <el-form-item label="维修状态：" prop="repairStatus">
                        <el-radio-group
                                v-model="formData.repairStatus"
                                placeholder="维修状态">
                            <el-radio
                                    v-for="item in dictionary.repairStatus"
                                    :label="item.code"
                                    :key="item.id">{{item.name}}
                            </el-radio>
                        </el-radio-group>
                    </el-form-item>
                </el-col>
                <el-col :span="4">
                    <el-form-item label="问题描述：" prop="problem">
                        <el-input v-model="formData.problem" placeholder="问题描述" maxlength="64"></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="4">
                    <el-form-item label="是否超时：" prop="overtimeFlag">
                        <el-radio-group
                                v-model="formData.overtimeFlag"
                                placeholder="是否超时">
                            <el-radio
                                    v-for="item in dictionary.overtimeFlag"
                                    :label="item.code"
                                    :key="item.id">{{item.name}}
                            </el-radio>
                        </el-radio-group>
                    </el-form-item>
                </el-col>
            </el-row>
        </el-form>
        <el-row class="margin-top-20">
            <el-button @click="closeDialog" style="margin: 0 20px;" :size="GLOBAL.config.systemSize">关闭</el-button>
                <el-button type="primary" @click="submitForm" style="margin: 0 20px;" :size="GLOBAL.config.systemSize">提交</el-button>
        </el-row>
    </el-dialog>
</template>
<script>export default {
        name: 'recordRepair',
        props: {
            id: {
                type: String
            },
            refresh: {
                type: Function
            },
            closeSelf: {
                type: Function
            }
        },
        data () {
            return {
                formData: {
                    id: '',
                    submitUserId: '',
                    targetUserId: '',
                    operationUserId: '',
                    reportTime: '',
                    repairTime: '',
                    finishTime: '',
                    repairStatus: '',
                    problem: '',
                    overtimeFlag: '',
                },
                // 校验规则
                formRules: {
                    submitUserId: [],
                    targetUserId: [],
                    operationUserId: [],
                    reportTime: [],
                    repairTime: [],
                    finishTime: [],
                    repairStatus: [],
                    problem: [],
                    overtimeFlag: [],
                },
                // 字典数据
                dictionary: {
                    repairStatus: JSON.parse(unescape(localStorage.getItem(this.GLOBAL.config.dictionaryPre + this.GLOBAL.config.dictionary.repairStatus))),
                    overtimeFlag: JSON.parse(unescape(localStorage.getItem(this.GLOBAL.config.dictionaryPre + this.GLOBAL.config.dictionary.overtimeFlag))),
                },
                editableFlag: true,
                loading: false,
                showTitle: '新增',
                showFlag: false
            }
        },
        methods: {
            init: function (type, id) {
                let _title = ''
                if (type === 'add') {
                    _title = '新增'
                } else if (type === 'edit') {
                    _title = '编辑'
                } else if (type === 'view') {
                    _title = '查看'
                    this.editableFlag = false
                }
                this.showTitle = this.showTitle || _title
                this.showFlag = true
                if (id) {
                    this.formData.id = id
                    this.getInfo()
                }
            },
            closeDialog: function () {
                this.showFlag = false
            },
            saveOrUpdateForm: function () {
                this.formData.id ? this.updateForm() : this.saveForm()
            },
            getInfo: function () {
                let _this = this
                this.formData.id && this.FUNCTIONS.systemFunction.interactiveData(
                    _this,
                    _this.GLOBAL.config.businessFlag.recordRepair,
                    _this.GLOBAL.config.handleType.getInfoById,
                    _this.formData.id,
                    null,
                    resultData => {
                        _this.loading = false
                        Object.assign(_this.formData, resultData)
                    }
                )
            },
            // 提交
            submitForm: function () {
                // TODO
            }
        }
    }
</script>
