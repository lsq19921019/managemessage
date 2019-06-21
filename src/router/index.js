import Vue from 'vue';
import Router from 'vue-router';

Vue.use(Router);

export default new Router({
    routes: [{
            path: '/',
            redirect: '/login'
        },
        {
            path: '/base',
            component: resolve => require(['../components/common/Home.vue'], resolve),
            children: [{
                    path: '/',
                    component: resolve => require(['../components/page/Base.vue'], resolve)
                }, {
                    path: '/fodder',
                    component: resolve => require(['../components/page/Fodder.vue'], resolve)
                },{
                    path: '/guest',
                    component: resolve => require(['../components/page/Guest.vue'], resolve)
                },
                {
                    path: '/mpMenu',
                    component: resolve => require(['../components/page/MpMenu.vue'], resolve)
                },
                 {
                    path: '/qrInfo',
                    component: resolve => require(['../components/page/qrInfo.vue'], resolve)
                },
                {
                    path: '/Keyword',
                    component: resolve => require(['../components/page/Keyword.vue'], resolve)
                },
                {
                    path: '/signConfig',
                    component: resolve => require(['../components/page/SignConfig.vue'], resolve)
                },
                {
                    path: '/signData',
                    component: resolve => require(['../components/page/SignData.vue'], resolve)
                }, 
                {
                    path: '/turntableConfig',
                    component: resolve => require(['../components/page/TurntableConfig.vue'], resolve)
                },
                {
                    path: '/TurntableData',
                    component: resolve => require(['../components/page/TurntableData.vue'], resolve)
                }, 
                {
                    path: '/scoreAward',
                    component: resolve => require(['../components/page/ScoreAward.vue'], resolve)
                }, 
                {
                    path: '/scoreRecord',
                    component: resolve => require(['../components/page/ScoreRecord.vue'], resolve)
                },  
                {
                    path: '/fansData',
                    component: resolve => require(['../components/page/FansData.vue'], resolve)
                },
                {
                    path: '/tagManage',
                    component: resolve => require(['../components/page/TagManage.vue'], resolve)
                },
                {
                    path: '/templateManage',
                    component: resolve => require(['../components/page/TemplateManage.vue'], resolve)
                },
                {
                    path: '/templateMsg',
                    component: resolve => require(['../components/page/TemplateMsg.vue'], resolve)
                },
                {
                    path: '/templateRecord',
                    component: resolve => require(['../components/page/TemplateRecord.vue'], resolve)
                },
                {
                    path: '/templateServer',
                    component: resolve => require(['../components/page/TemplateServer.vue'], resolve)
                },
                {
                    path: '/templateServerMsgList',
                    component: resolve => require(['../components/page/ServerMsgList.vue'], resolve)
                },
                
                {
                    path: '/remind',
                    component: resolve => require(['../components/page/Remind.vue'], resolve)
                }, {
                    path: '/seller',
                    component: resolve => require(['../components/page/Seller.vue'], resolve)
                }, {
                    path: '/readme',
                    component: resolve => require(['../components/page/Readme.vue'], resolve)
                },
                {
                    path: '/vuetable',
                    component: resolve => require(['../components/page/VueTable.vue'], resolve) // vue-datasource组件
                },
               
                {
                    path: '/vueeditor',
                    component: resolve => require(['../components/page/VueEditor.vue'], resolve) // Vue-Quill-Editor组件
                },
                {
                    path: '/markdown',
                    component: resolve => require(['../components/page/Markdown.vue'], resolve) // Vue-Quill-Editor组件
                },
                {
                    path: '/upload',
                    component: resolve => require(['../components/page/Upload.vue'], resolve) // Vue-Core-Image-Upload组件
                },
                
                {
                    path: '/drag',
                    component: resolve => require(['../components/page/DragList.vue'], resolve) // 拖拽列表组件
                }
            ]
        },
        // {
        //     path: '/login',
        //     component: resolve => require(['../components/page/wls.vue'], resolve)
        // },
        {
            path: '/login',
            component: resolve => require(['../components/page/Login.vue'], resolve)
        },
        
    ]
})
