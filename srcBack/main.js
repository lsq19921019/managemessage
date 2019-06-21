import Vue from 'vue';
import Vuex from 'vuex';
import App from './App';
import router from './router';
import axios from 'axios';
import vueResource from 'vue-resource'
import ElementUI from 'element-ui';
// import 'element-ui/lib/theme-default/index.css'; // 默认主题  1.3.1 版本
// import '../static/css/theme-green/index.css';       // 浅绿色主题
import 'element-ui/lib/theme-chalk/index.css'; // 2.1.0
import "babel-polyfill";

Vue.use(ElementUI);
Vue.use(vueResource);
Vue.use(Vuex);


Vue.prototype.$axios = axios;
Vue.http.interceptors.push(function (request, next) {

    next(function (response) {
        // console.log(response.data);
        if (response.data == '302') {
            this.$router.push({
                path: '/login'
            });
            //   console.log(next);
        }
    });
});
Vue.http.options.emulateJSON = true;
const baseUrl = (() => {
    let url_arr = window.location.href.split("//");
    let queryArr = [];
    queryArr.push(url_arr[0])
    queryArr = queryArr.concat(url_arr[1].split("/").splice(0, 2));
    let str = `${queryArr[0]}//${queryArr[1]}/${queryArr[2]}`
    return str;
})();

var store = new Vuex.Store({
    state: {
        mpId: 0,
        autherInfos: {},
        baseUrl:baseUrl
    },
    mutations: {
        setMpId(state, id) {
            state.mpId = id;
        },
        setAutherInfos(state, obj) {
            state.autherInfos = obj;
        }
    },
    actions: {
        // getMp(){
        //     this.$http.get("",{

        //     }).then(res =>{
        //         this.$store.commit('setMpId',1);
        //     })
        // }
    }
});
new Vue({
    router,
    store,
    render: h => h(App)
}).$mount('#app');

Date.prototype.Format = function (fmt) {
    var o = {
        "M+": this.getMonth() + 1, //月份 
        "d+": this.getDate(), //日 
        "h+": this.getHours(), //小时 
        "m+": this.getMinutes(), //分 
        "s+": this.getSeconds(), //秒 
        "q+": Math.floor((this.getMonth() + 3) / 3), //季度 
        "S": this.getMilliseconds() //毫秒 
    };
    if (/(y+)/.test(fmt))
        fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
    for (var k in o) {
        if (new RegExp("(" + k + ")").test(fmt)) {
            fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
        }
    }
    return fmt;
};
