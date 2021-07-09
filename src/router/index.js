import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      redirect: '/dashboard'
    },
    {
      path: '/',
      component: () => import('../components/Home.vue'),
      meta: { title: '下載頁面' },
      children: [
        {
          path: '/dashboard',
          component: () => import('../components/Dashboard.vue'),
          meta: { title: '首頁' }
        },
        {
          path: '/charts',
          component: () => import('../components/Charts.vue'),
          meta: { title: '首頁' }
        },
        {
          path: '/sip_search',
          component: () => import('../components/SIPSearch.vue'),
          meta: { title: 'SIP查询' }

        },
        {
          path: '/iqc_search',
          component: () => import('../components/IQCSearch.vue'),
          meta: { title: 'IQC查詢' }

        },
        {
          path: '/ipqc',
          component: () => import('../components/IPQC.vue'),
          meta: { title: 'IPQC维护' }

        },
        {
          path: '/errorsearch',
          component: () => import('../components/ErrorSearch.vue'),
          meta: { title: '不良查詢' }
        },
        {
          path: "/discsearch",
          component: () => import('../components/DISC.vue'),
          meta: { title: "DISC出货检验记录" }
        },
        {
          path: '/showiqc',
          component: () => import('../components/showIQC.vue'),
          meta: { title: 'IQC Detail' }

        },
        {
          path: '/trace',
          component: () => import('../components/Trace.vue'),
          meta: { title: '產品追溯' }

        },
        {
          path: '/process',
          component: () => import('../components/ProcessSearch.vue'),
          meta: { title: '過站信息查詢' }

        },
        {
          path: "addcomponent",
          component: () => import("../components/Addcomponent.vue"),
          meta: { title: "研發規格值管理" }
        },
        {
          path: "oqcform",
          component: () => import("../components/OQCForm.vue"),
          meta: { title: "OQC維護" }
        },
        {
          path: "excelupload",
          component: () => import("../components/Excelupload.vue"),
          meta: { title: "Excel上傳" }
        },
        {
          path: "uploadfile",
          component: () => import("../components/UploadFile.vue"),
          meta: { title: "IQC附件上傳" }
        },
        {
          path: "iqc_sip",
          component: () => import("../components/IQC_SPI.vue"),
          meta: { title: "SIP" }
        },
        {
          path: "vendor",
          component: () => import("../components/BasVendor.vue"),
          meta: { title: "供应商维护" }
        },
        {
          path: "component",
          component: () => import('../components/BasComponent.vue'),
          meta: { title: "物料维护" }
        },
        {
          path: "wo",
          component: () => import('../components/Wo.vue'),
          meta: { title: "企劃-工令維護" }
        },
        {
          path: "allview",
          component: () => import('../components/Allview.vue'),
          meta: { title: "生產率達成看板" }
        },
        {
          path: "plans",
          component: () => import('../components/woplans/search.vue'),
          meta: { title: "生产计划量维护" }
        }
      ]
    },
  ]
})

