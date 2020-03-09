import { Util } from './utils/util/util';
import { Http } from './utils/http/http';
import { CodeList } from './utils/code-list/code-list';
import { AppPopover } from './utils/app-popover/app-popover';
import { AppModal } from './utils/app-modal/app-modal';
import { AppDrawer } from './utils/app-drawer/app-drawer';
import { Interceptors } from './utils/interceptor/interceptor';

export const AppComponents = {
    install(v: any, opt: any) {
        Interceptors.getInstance();
        v.prototype.$appdrawer = AppDrawer.getInstance();
        v.prototype.$appmodal = AppModal.getInstance();
        v.prototype.$apppopover = AppPopover.getInstance();
        v.prototype.$codelist = CodeList.getInstance();
        v.prototype.$http = Http.getInstance();
        v.prototype.$util = Util;
        v.component('app-tree', () => import('./components/app-tree/app-tree'));
        v.component('app-keep-alive', () => import('./components/app-keep-alive/app-keep-alive.vue'));
        v.component('tab-page-exp', () => import('./components/tab-page-exp/tab-page-exp.vue'));
        v.component('app-form', () => import('./components/app-form/app-form'));
        v.component('app-form-item', () => import('./components/app-form-item/app-form-item'));
        v.component('app-form-item2', () => import('./components/app-form-item2/app-form-item2'));
        v.component('app-form-group', () => import('./components/app-form-group/app-form-group'));
        v.component('app-form-group2', () => import('./components/app-form-group2/app-form-group2'));
        v.component('app-autocomplete', () => import('./components/app-autocomplete/app-autocomplete'));
        v.component('app-picker', () => import('./components/app-picker/app-picker'));
        v.component('app-mpicker', () => import('./components/app-mpicker/app-mpicker'));
        v.component('app-form-druipart', () => import('./components/app-form-druipart/app-form-druipart'));
        v.component('input-box', () => import('./components/input-box/input-box'));
        v.component('dropdown-list', () => import('./components/dropdown-list/dropdown-list'));
        v.component('upload-file', () => import('./components/upload-file/upload-file'));
        v.component('app-theme', () => import('./components/app-theme/app-theme'));
        v.component('app-user', () => import('./components/app-user/app-user'));
        v.component('context-menu', () => import('./components/context-menu/context-menu'));
        v.component('context-menu-container', () => import('./components/context-menu-container/context-menu-container'));
        v.component('app-checkbox-list',() => import('./components/app-checkbox-list/app-checkbox-list'));
        v.component('app-radio-group',() => import('./components/app-radio-group/app-radio-group'));
        v.component('app-embed-picker', () => import('./components/app-embed-picker/app-embed-picker'));
        v.component('app-rich-text-editor',() => import('./components/app-rich-text-editor/app-rich-text-editor'));
        v.component('app-code-editor',() => import('./components/app-code-editor/app-code-editor'));
        v.component('app-file-upload',() => import('./components/app-file-upload/app-file-upload'));
        v.component('app-image-upload',() => import('./components/app-image-upload/app-image-upload'));
        v.component('property-layout',() =>import('./components/property-layout/property-layout'));
        v.component('app-range-editor',() =>import('./components/app-range-editor/app-range-editor'));
        v.component('app-export-excel',() =>import('./components/app-export-excel/app-export-excel'));
        v.component('app-lang',() =>import('./components/app-lang/app-lang'));
    },
};