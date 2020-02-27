<template>
  <el-container>
    <el-aside :width="isCollapse?'65px':'200px'">
      <div class="menu-top" v-if="!isCollapse">
        <div class="menu-top-title">{{systemName}}</div>
        <div class="menu-top-title-sub">{{systemSubName}}</div>
      </div>
      <div class="menu-top-close" v-else style="line-height: 60px">
        <i class="el-icon-s-home" size="large"></i>
      </div>
      <el-col :span="24">
        <el-menu
          :default-active="selectMenu"
          class="el-menu-vertical-demo"
          background-color="#545c64"
          text-color="#fff"
          active-text-color="#ffd04b"
          :collapse="isCollapse"
          @select="menuSelect"
        >
<!--          <el-menu-item index="/">-->
<!--            <i class="el-icon-guide"></i>-->
<!--            <span slot="title">代码生成</span>-->
<!--          </el-menu-item>-->
<!--          <el-menu-item index="/redis">-->
<!--            <i class="el-icon-present"></i>-->
<!--            <span slot="title">redis缓存</span>-->
<!--          </el-menu-item>-->
<!--          <el-menu-item index="/dictionary">-->
<!--            <i class="el-icon-notebook-2"></i>-->
<!--            <span slot="title">字典管理</span>-->
<!--          </el-menu-item>-->
          <el-submenu index="1">
            <template slot="title">
              <i class="el-icon-notebook-2"></i>
              <span>基本信息维护</span>
            </template>
            <el-menu-item-group>
              <el-menu-item index="/organization">
                <i class="el-icon-map-location"></i>
                <span slot="title">区划信息管理</span>
              </el-menu-item>
              <el-menu-item index="/villager">
                <i class="el-icon-postcard"></i>
                <span slot="title">村民信息管理</span>
              </el-menu-item>
              <el-menu-item index="/cars">
                <i class="el-icon-truck"></i>
                <span slot="title">抽粪车辆管理</span>
              </el-menu-item>
              <el-menu-item index="/repairUsers">
                <i class="el-icon-user"></i>
                <span slot="title">维修人员管理</span>
              </el-menu-item>
              <el-menu-item index="/">
                <i class="el-icon-setting"></i>
                <span slot="title">系统参数管理</span>
              </el-menu-item>
              <el-menu-item index="/configs">
                <i class="el-icon-set-up"></i>
                <span slot="title">系统配置管理</span>
              </el-menu-item>
            </el-menu-item-group>
          </el-submenu>
          <el-submenu index="/organisation">
            <template slot="title">
              <i class="el-icon-s-tools"></i>
              <span>&nbsp;&nbsp;&nbsp;&nbsp;工作台&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span>
            </template>
            <el-menu-item-group>
              <el-menu-item index="/workApplys">
                <i class="el-icon-setting"></i>
                <span slot="title">管理员工作台</span>
              </el-menu-item>
              <el-menu-item index="/userApplys">
                <i class="el-icon-warning-outline"></i>
                <span slot="title">人员审核</span>
              </el-menu-item>
            </el-menu-item-group>
          </el-submenu>
        </el-menu>
      </el-col>
    </el-aside>
    <el-container>
      <!--头部-->
      <el-header>
        <el-row>
          <el-col :span="1">
            <el-tooltip class="item" effect="dark" :content="isCollapse?'展开模式':'收起模式'" placement="right">
              <i class="menu-fold" :class="isCollapse?'el-icon-caret-right':'el-icon-caret-left'" size="large"
                 @click="isCollapse=!isCollapse"></i>
            </el-tooltip>
          </el-col>
          <el-col :span="20">&nbsp;
            <span class="user-name">{{getUserInfo()?getUserInfo():'--'}}</span></el-col>
          <el-col :span="2">
            <div class="user-area">
              <el-avatar size="medium" :src="headPic"></el-avatar>
              <div class="user-divider"></div>
            </div>
          </el-col>
          <el-col :span="1">
            <el-tooltip class="item" effect="dark" content="退出系统" placement="bottom">
              <el-button @click="exitSystem" icon="el-icon-switch-button" type="info" circle></el-button>
            </el-tooltip>

          </el-col>
        </el-row>
      </el-header>
      <!--主体-->
      <el-main>
        <!--<codeGenerate v-if="selectMenu === 'codeGenerate'"/>
        <testTemplate v-if="selectMenu === 'user'"/>-->
        <router-view></router-view>
      </el-main>
      <el-footer>{{footer}}</el-footer>
    </el-container>
  </el-container>
</template>
<script>
    import codeGenerate from './view/CodeGenerate'
    import testTemplate from './view/zxMenuTable'

    export default {
        name: 'Index',
        data() {
            return {
                systemName: '旱厕改造系统',
                systemSubName: 'PitToilet Reform System',
                footer: 'Copyright © 2019 - 2029 安徽卓新科技 版权所有',
                headPic: 'https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png',
                isCollapse: false,
                // 默认选中菜单
                selectMenu: 'codeGenerate',
                value3: 50
            }
        },
        components: {
            codeGenerate,
            testTemplate
        },
        methods: {
            init: function () {
                return null
            },
            getInfo: function () {
                return null
            },
            // 菜单选择
            menuSelect: function (target) {
                this.$router.push({path: target})
            },
            // 退出系统
            exitSystem: function () {
                let _this = this
                _this.$confirm('确认退出系统？？？', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    _this.FUNCTIONS.systemFunction.commonGet(
                        _this.CONFIG.urls.root + _this.CONFIG.urls.index.logout,
                        result => {
                            if (result.code === '0') {
                                // 清除前端缓存
                                localStorage.clear()
                                sessionStorage.clear()
                                window.location.reload()
                            } else {
                                this.$message({
                                    message: '退出异常～请联系管理员',
                                    type: 'error'
                                })
                            }
                        }
                    )
                })
            },
            getUserInfo: function () {
                function g() {
                    if (JSON.parse(unescape(localStorage.getItem('userInfo')))) {
                        return JSON.parse(unescape(localStorage.getItem('userInfo'))).userName
                    }
                }

                return g()
            },
            // 初始化脚本方法
            initDictionary: function () {
                let dictionaryData = [
                    {'name': '案件类型', 'code': 'caseType', sort: 1},
                    {'name': '纠纷类型', 'code': 'disputeType', sort: 2},
                    {'name': '服务类型', 'code': 'serviceType', sort: 3},
                    {'name': '风险等级', 'code': 'riskGrade', sort: 4},
                    {'name': '诉求', 'code': 'appealType', sort: 5},
                    {'name': '是否外聘律师', 'code': 'outsideLawerFlag', sort: 6},
                    {'name': '是否产生费用', 'code': 'costFlag', sort: 7},
                    {'name': '案件状态', 'code': 'caseState', sort: 8},
                    {'name': '风险类型', 'code': 'riskType', sort: 9},
                    {'name': '事件状态', 'code': 'eventState', sort: 10},
                    {'name': '审理程序', 'code': 'hearingProcedure', sort: 11},
                    {'name': '结案方式', 'code': 'closingMethod', sort: 12},
                    {'name': '主诉', 'code': 'chief', sort: 1, 'parentCode': 'caseType'},
                    {'name': '应诉', 'code': 'respondent', sort: 2, 'parentCode': 'caseType'},
                    {'name': '买卖合同纠纷', 'code': '0', sort: 1, 'parentCode': 'disputeType'},
                    {'name': '建设工程合同纠纷', 'code': '1', sort: 2, 'parentCode': 'disputeType'},
                    {'name': '技术合同纠份', 'code': '2', sort: 3, 'parentCode': 'disputeType'},
                    {'name': '保险合同纠份', 'code': '3', sort: 4, 'parentCode': 'disputeType'},
                    {'name': '服务合同纠纷', 'code': '4', sort: 5, 'parentCode': 'disputeType'},
                    {'name': '著作权纠纷', 'code': '5', sort: 6, 'parentCode': 'disputeType'},
                    {'name': '商标权纠纷', 'code': '6', sort: 7, 'parentCode': 'disputeType'},
                    {'name': '机动车交通事故责任纠纷', 'code': '7', sort: 8, 'parentCode': 'disputeType'},
                    {'name': '商业秘密纠纷', 'code': '8', sort: 9, 'parentCode': 'disputeType'},
                    {'name': '不正当竞争纠纷', 'code': '9', sort: 10, 'parentCode': 'disputeType'},
                    {'name': '肖像权纠纷', 'code': '10', sort: 11, 'parentCode': 'disputeType'},
                    {'name': '劳动合同纠纷', 'code': '11', sort: 12, 'parentCode': 'disputeType'},
                    {'name': '投融资类纠纷', 'code': '12', sort: 13, 'parentCode': 'disputeType'},
                    {'name': '其它类纠纷', 'code': '13', sort: 14, 'parentCode': 'disputeType'},
                    {'name': '律师函', 'code': '0', sort: 1, 'parentCode': 'serviceType'},
                    {'name': '诉讼、仲裁、应诉', 'code': '1', sort: 2, 'parentCode': 'serviceType'},
                    {'name': '其他函件', 'code': '2', sort: 3, 'parentCode': 'serviceType'},
                    {'name': '催款函', 'code': '3', sort: 4, 'parentCode': 'serviceType'},
                    {'name': '证据公证', 'code': '4', sort: 5, 'parentCode': 'serviceType'},
                    {'name': '一般', 'code': 'common', sort: 1, 'parentCode': 'riskGrade'},
                    {'name': '中等', 'code': 'secondary', sort: 2, 'parentCode': 'riskGrade'},
                    {'name': '重大', 'code': 'major', sort: 3, 'parentCode': 'riskGrade'},
                    {'name': '要求对方履行合同义务', 'code': '01', sort: 1, 'parentCode': 'appealType'},
                    {'name': '要求对方承担缔约过失责任、赔偿损失', 'code': '02', sort: 2, 'parentCode': 'appealType'},
                    {'name': '要求对方承担违约责任', 'code': '03', sort: 3, 'parentCode': 'appealType'},
                    {'name': '要求解除合同', 'code': '04', sort: 4, 'parentCode': 'appealType'},
                    {'name': '要求对方返还已支付款项', 'code': '05', sort: 5, 'parentCode': 'appealType'},
                    {'name': '要求对方承担侵权责任', 'code': '06', sort: 6, 'parentCode': 'appealType'},
                    {'name': '要求对方承担维权合理支出', 'code': '07', sort: 7, 'parentCode': 'appealType'},
                    {'name': '回函/应诉', 'code': '08', sort: 8, 'parentCode': 'appealType'},
                    {'name': '是', 'code': 'yes', sort: 1, 'parentCode': 'outsideLawerFlag'},
                    {'name': '否', 'code': 'no', sort: 2, 'parentCode': 'outsideLawerFlag'},
                    {'name': '是', 'code': 'yes', sort: 1, 'parentCode': 'costFlag'},
                    {'name': '否', 'code': 'no', sort: 2, 'parentCode': 'costFlag'},
                    {'name': '在办', 'code': 'working', sort: 1, 'parentCode': 'caseState'},
                    {'name': '结案', 'code': 'closed', sort: 2, 'parentCode': 'caseState'},
                    {'name': '合同风险', 'code': 'contractRisk', sort: 1, 'parentCode': 'riskType'},
                    {'name': '侵权风险', 'code': 'tortRisk', sort: 2, 'parentCode': 'riskType'},
                    {'name': '违规风险', 'code': 'violationRisk', sort: 3, 'parentCode': 'riskType'},
                    {'name': '法规更新', 'code': 'regulationUpdating', sort: 4, 'parentCode': 'riskType'},
                    {'name': '其他', 'code': 'other', sort: 5, 'parentCode': 'riskType'},
                    {'name': '在办', 'code': 'working', sort: 1, 'parentCode': 'eventState'},
                    {'name': '结案', 'code': 'closed', sort: 2, 'parentCode': 'eventState'},
                    {'name': '仲裁', 'code': 'arbitration', sort: 1, 'parentCode': 'hearingProcedure'},
                    {'name': '一审', 'code': 'firstInstance', sort: 2, 'parentCode': 'hearingProcedure'},
                    {'name': '二审', 'code': 'secondInstance', sort: 3, 'parentCode': 'hearingProcedure'},
                    {'name': '申请再审', 'code': 'applyRetrial', sort: 4, 'parentCode': 'hearingProcedure'},
                    {'name': '再审', 'code': 'retrial', sort: 5, 'parentCode': 'hearingProcedure'},
                    {'name': '执行', 'code': 'implement', sort: 6, 'parentCode': 'hearingProcedure'},
                    {'name': '和解', 'code': 'compromise', sort: 1, 'parentCode': 'closingMethod'},
                    {'name': '调节', 'code': 'adjust', sort: 2, 'parentCode': 'closingMethod'},
                    {'name': '判决', 'code': 'sentence', sort: 3, 'parentCode': 'closingMethod'},
                    {'name': '裁定', 'code': 'rule', sort: 4, 'parentCode': 'closingMethod'}
                ]
                this.FUNCTIONS.systemFunction.interactiveData(this, 'dictionary', 'addBatch', dictionaryData, 'list', result => {
                    this.$message.success('脚本添加成功')
                })
            }
        }
    }
</script>
