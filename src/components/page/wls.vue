<template>
  <div class="page">
    <div class="page__bd">
      <div class="weui-toptips weui-toptips_warn" v-if="showTopTips">错误提示</div>

      <div class="weui-cells__title">单选列表项</div>
      <div class="weui-cells weui-cells_after-title">
        <radio-group @change="radioChange" v-model="formObj.sex">
          <label class="weui-cell weui-check__label" v-for="(item,index) in radioItems" :key="index">
            <radio class="weui-check" :value="item.value" :checked="item.checked" />
            <div class="weui-cell__bd">{{item.name}}</div>
            <div class="weui-cell__ft weui-cell__ft_in-radio" v-if="item.checked">
              <icon class="weui-icon-radio" type="success_no_circle" size="16"></icon>
            </div>
          </label>
        </radio-group>
      </div>

      <div class="weui-cells__title">复选列表项</div>
      <div class="weui-cells weui-cells_after-title">
        <checkbox-group @change="checkboxChange"  v-model="formObj.likes">
          <label class="weui-cell weui-check__label" v-for="(item,index) in checkboxItems" :key="index">
            <checkbox class="weui-check" :value="item.value" :checked="item.checked" />
            <div class="weui-cell__hd weui-check__hd_in-checkbox">
              <icon class="weui-icon-checkbox_circle" type="circle" size="20" v-if="!item.checked"></icon>
              <icon class="weui-icon-checkbox_success" type="success" size="20" v-if="item.checked"></icon>
            </div>
            <div class="weui-cell__bd">{{item.name}}</div>
          </label>
        </checkbox-group>
      </div>

      <div class="weui-cells__title">开关</div>
      <div class="weui-cells weui-cells_after-title">
        <div class="weui-cell weui-cell_switch">
          <div class="weui-cell__bd">是否显示</div>
          <div class="weui-cell__ft">
            <switch checked @change="switchChange" v-model="formObj.onoff" />
          </div>
        </div>
      </div>

      <div class="weui-cells__title">公司名称</div>
      <div class="weui-cells weui-cells_after-title">
        <div class="weui-cell weui-cell_input">
          <div class="weui-cell__bd">
            <input class="weui-input" placeholder="请输入公司名称" v-model="formObj.companyname" />
          </div>
        </div>
      </div>

      <div class="weui-cells__title">备注</div>
      <div class="weui-cells weui-cells_after-title">
        <div class="weui-cell">
          <div class="weui-cell__bd">
            <textarea class="" placeholder="请输入备注" style="height: 3.3em" v-model="formObj.remark" />
            <div class="weui-textarea-counter">0/200</div>
          </div>
        </div>
      </div>

      <div class="weui-cells weui-cells_after-title">
        <div class="weui-cell weui-cell_select">
          <div class="weui-cell__hd" style="width: 105px;padding-left:0">
            <picker @change="bindCountryCodeChange" :range="countryCodes">
              <div class="weui-select">{{countryCodes[countryCodesIndex]}}</div>
            </picker>
          </div>
          <div class="weui-cell__bd weui-cell__bd_in-select-before">
            <input class="weui-input" placeholder="请输入手机号码" v-model="formObj.mobile" />
          </div>
        </div>
      </div>

      <div class="weui-cells__title">选择</div>
      <div class="weui-cells weui-cells_after-title">
        <div class="weui-cell weui-cell_select">
          <div class="weui-cell__bd">
            <picker @change="bindAccountChange" :range="accounts" v-model="formObj.account">
              <div class="weui-select">{{accounts[accountsIndex]}}</div>
            </picker>
          </div>
        </div>
        <div class="weui-cell weui-cell_select">
          <div class="weui-cell__hd weui-cell__hd_in-select-after">
            <div class="weui-label">国家/地区</div>
          </div>
          <div class="weui-cell__bd">
            <picker @change="bindCountryChange" :range="countries" v-model="formObj.area">
              <div class="weui-select weui-select_in-select-after">{{countries[countryIndex]}}</div>
            </picker>
          </div>
        </div>
      </div>

      <checkbox-group @click="bindAgreeChange">
        <label class="weui-agree" for="weuiAgree">
          <div class="weui-agree__text">
            <checkbox class="weui-agree__checkbox" id="weuiAgree" value="agree" checked="isAgree" v-model="formObj.agree" />
            <div class="weui-agree__checkbox-icon">
              <icon class="weui-agree__checkbox-icon-check" type="success_no_circle" size="9" v-if="isAgree"></icon>
            </div>
            阅读并同意
            <navigator url="" class="weui-agree__link">《相关条款》</navigator>
          </div>
        </label>
      </checkbox-group>

      <div class="weui-btn-area">
        <button class="weui-btn" type="primary" @click="showTopTipsFun">错误提示演示</button>
        <button class="weui-btn" type="primary" @click="showData">表单提交</button>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    data () {
      return {
        showTopTips: false,
        time: '09:01',
        date: '2015-09-01',
        countryCodes: ['+86', '+80', '+84', '+87'],
        countryCodesIndex: 0,
        countries: ['中国', '美国', '英国'],
        countryIndex: 0,
        accounts: ['微信号', 'QQ', 'Email'],
        accountsIndex: 0,

        radioItems: [
          { name: '女', value: '0' },
          { name: '男', value: '1', checked: true }
        ],
        checkboxItems: [
          { name: '读书', value: '0', checked: true },
          { name: '跑步', value: '1', checked: false }
        ],

        isAgree: false,

        formObj: {
          sex: '',
          onoff: '',
          companyname: '',
          remark: '',
          account: '',
          area: '',
          agree: '',
          likes: ''
        }
      }
    },
    methods: {
      checkboxChange (e) {
        console.log('checkbox发生change事件，携带value值为：' + e.mp.detail.value)
        var checkboxItems = this.checkboxItems
        var values = e.mp.detail.value
        for (var i = 0, lenI = checkboxItems.length; i < lenI; ++i) {
          checkboxItems[i].checked = false

          for (var j = 0, lenJ = values.length; j < lenJ; ++j) {
            if (checkboxItems[i].value === values[j]) {
              checkboxItems[i].checked = true
              break
            }
          }
        }
        this.checkboxItems = checkboxItems
      },
      radioChange (e) {
        console.log('radio发生change事件，携带value值为：' + e.mp.detail.value)
        let radioItems = this.radioItems
        for (let i = 0; i < radioItems.length; ++i) {
          radioItems[i].checked = radioItems[i].value === e.mp.detail.value
        }
        this.radioItems = radioItems
      },
      switchChange (e) {
        console.log('switch发生change事件，携带value值为：' + e.mp.detail.value)
      },
      bindDateChange (e) {
        this.date = e.mp.detail.value
        console.log(e.mp.detail.value)
      },
      bindTimeChange (e) {
        this.time = e.mp.detail.value
        console.log(e.mp.detail.value)
      },
      showTopTipsFun () {
        this.showTopTips = true
        setTimeout(() => {
          this.showTopTips = false
        }, 2000)
      },
      bindCountryChange (e) {
        this.countryIndex = e.mp.detail.value
      },
      bindAccountChange (e) {
        this.accountsIndex = e.mp.detail.value
      },
      bindCountryCodeChange (e) {
        this.countryCodesIndex = e.mp.detail.value
      },
      bindAgreeChange (e) {
        this.isAgree = !this.isAgree
      },
      showData () {
        console.log('表单提交')
        console.log(this.formObj)
        console.log(this.formObj.onoff)
        console.log(this.formObj.companyname)
        console.log(this.formObj.remark)
        console.log(this.formObj.mobile)
        console.log(this.formObj.account)
        console.log(this.formObj.area)
        console.log(this.formObj.agree)
        console.log(this.formObj.likes)
        console.log(this.formObj.sex)
      }
    }
  }
</script>

<style>

</style>
