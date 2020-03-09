import Vue from 'vue';
import Router from 'vue-router';
import { Util, AuthGuard } from '@/utils';
import { Environment } from '@/environments/environment';
import {userrouter} from "@/userrouter";
import {userindexrouter} from "@/userrouter";

Vue.use(Router);

let routes =  [
        {
            path: '/ocr_index/:ocr_index?',
            name: 'ocr_index',
            beforeEnter: (to: any, from: any, next: any) => {
                const routerParamsName = 'ocr_index';
                const params: any = {};
                if (to.params && to.params[routerParamsName]) {
                    Object.assign(params, Util.formatMatrixParse(to.params[routerParamsName]));
                }
                const url: string = 'ocrweb/app/ocrweb/getappdata';
                const auth: Promise<any> = AuthGuard.getInstance().authGuard(url, params, router);
                auth.then(() => {
                    next();
                }).catch(() => {
                    next();
                });
            },
            meta: {
                caption: '通用识别服务',
                viewType: 'APPINDEX',
                requireAuth: true,
            },
            component: () => import('@pages/'+Environment.defaultIndexViewPath),
            children: [...[
                {
                    path: 'ocr_ocrrecordgridview/:ocr_ocrrecordgridview?',
                    name: 'ocr_ocrrecordgridview',
                    meta: {
                        caption: '识别记录',
                        requireAuth: true,
                    },
                    component: () => import('@pages/ocr/ocrrecord-grid-view/ocrrecord-grid-view'),
                },
                {
                    path: 'ocr_ocrrecordeditview/:ocr_ocrrecordeditview?',
                    name: 'ocr_ocrrecordeditview',
                    meta: {
                        caption: '识别记录',
                        requireAuth: true,
                    },
                    component: () => import('@pages/ocr/ocrrecord-edit-view/ocrrecord-edit-view'),
                },
                {
                    path: ':ocrid/ocr_ocrrecordocrview/:ocr_ocrrecordocrview?',
                    name: 'ocr_ocrrecordocrview',
                    meta: {
                        caption: '识别记录',
                        requireAuth: true,
                    },
                    component: () => import('@pages/ocr/ocrrecord-ocrview/ocrrecord-ocrview'),
                },
                {
                    path: 'ibizutil_ibzworklistgridview/:ibizutil_ibzworklistgridview?',
                    name: 'ibizutil_ibzworklistgridview',
                    meta: {
                        caption: '待办任务',
                        requireAuth: true,
                    },
                    component: () => import('@pages/ibizutil/ibzworklistgrid-view/ibzworklistgrid-view'),
                },
            ],...userindexrouter]
        },
        {
            path: '/login/:login?',
            name: 'login',
            meta: {
                caption: '登录',
                viewType: 'login',
                requireAuth: false,
                ignoreAddPage: true,
            },
            beforeEnter: (to: any, from: any, next: any) => {
                router.app.$store.commit('resetRootStateData');
                next();
            },
            component: () => import('@components/'+Environment.loginViewPath),
        },
        {
            path: '*',
            redirect: 'ocr_index'
        },
    ];

const router = new Router({
    routes:[...userrouter, ...routes]
});

export default router;
