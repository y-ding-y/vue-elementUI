// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.

import Vue from 'vue'
import ElementUI from 'element-ui' //element-ui的全部组件 
import './assets/css/theme-green/index.css' // 浅绿色主题
import './assets/css/icon.css'
import App from './App'
import router from './router'
import axios from 'axios'
import VueAxios from 'vue-axios'

import store from './store'
import VueHighcharts from 'vue-highcharts'
import Highcharts from 'highcharts'
import loadExporting from 'highcharts/modules/exporting'
import exportdata from 'highcharts/modules/export-data'
import drilldown from 'highcharts/modules/drilldown'
import jquery from 'jquery'
import XLSX from "xlsx";
import promise from 'es6-promise';
import moment from 'moment'
import html2canvas from 'html2canvas'
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-table/dist/bootstrap-table.css'
import 'bootstrap-table/dist/bootstrap-table.js'
import 'bootstrap-table/dist/locale/bootstrap-table-zh-TW.js' 
Vue.use(VueAxios, axios, XLSX, moment, html2canvas);
Vue.use(VueHighcharts);
promise.polyfill();
Vue.config.productionTip = false;
Vue.prototype.$ajax = axios;
Vue.prototype.$ = jquery;
Vue.prototype.XLSX = XLSX;
loadExporting(Highcharts)
exportdata(Highcharts)
drilldown(Highcharts)
Vue.use(ElementUI, {
  size: 'small'
});//使用elementUI  

import { Message } from 'element-ui'
import { Loading } from 'element-ui'
import { SearchInfo } from '@/api/index'

//使用钩子函数对路由进行权限跳转
router.beforeEach((to, from, next) => {
  if (to.path == '/dashboard') { 
    next();
  }
  else {
    var params = {
      mode: "getflag",
      userid: sessionStorage.getItem('userid') == null ? "" : sessionStorage.getItem('userid')
    };
    SearchInfo(params).then(function (res) {
      var userid = sessionStorage.getItem('userid') == null ? "" : sessionStorage.getItem('userid');
      var haspermission = false
      var isspecail = false
      var specialpath = []
      var params1 = {
        mode: 'getspecialpath',
      }
      SearchInfo(params1).then(function (res1) {
        specialpath = res1.data.rows
        specialpath.forEach(item => {
          if (item.MainModuleID == to.path) {
            isspecail = true
          }
        })
        if (isspecail) {
          if (userid == "") {
            next('/dashboard');
            Message.error("請先登錄");
          } else {
            res.data.rows.forEach(item => {
              if (item.MainModuleID == to.path) {
                haspermission = true
              }
            });
            if (haspermission) {
              next();
            } else {
              next('/dashboard');
              Message.error("權限不足");
            }
          }
        }
        else {
          next();
        }
      })
      //  if (to.path == '/addcomponent' || to.path == '/oqcform' || to.path == '/ipqc') {
      //    {
      //     if (userid == "") {
      //       next('/dashboard');
      //       Message.error("請先登錄");
      //     }
      //     else {
      //       console.log(res.data)
      //       res.data.rows.forEach(item => {
      //         if(item.MainModuleID==to.path){
      //           haspermission=true
      //         }
      //       });
      //       if(haspermission){
      //         next();
      //       }else{
      //         next('/dashboard');
      //         Message.error("權限不足");
      //       }
      //     }
      //    }
      //  }
      //  else {
      //    next();
      //  }
    })
      .catch(function (error) { console.log(error) });
  }

});


new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app');  