export const PageComponents = {
    install(Vue: any, opt: any) {
        Vue.component('index', () => import('@pages/ocr/index/index'));
        Vue.component('ocrrecord-grid-view', () => import('@pages/ocr/ocrrecord-grid-view/ocrrecord-grid-view'));
        Vue.component('ocrrecord-edit-view', () => import('@pages/ocr/ocrrecord-edit-view/ocrrecord-edit-view'));
        Vue.component('ocrrecord-ocrview', () => import('@pages/ocr/ocrrecord-ocrview/ocrrecord-ocrview'));
    }
};