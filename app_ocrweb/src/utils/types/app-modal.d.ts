import Vue, { VNode, CreateElement } from "vue";
import { Subject } from "rxjs";

/**
 * 模态框实例
 *
 * @export
 * @interface AppModal
 */
export declare interface AppModal {
    /**
     * 打开模态视图
     *
     * @param {{ viewname: string, title: string, width: number, height: number }} view
     * @param {*} data
     * @returns {Subject<any>}
     * @memberof AppModal
     */
    openModal(view: { viewname: string, title: string, width: number, height: number }, data: any): Subject<any>;
}

declare module "vue/types/vue" {
    interface Vue {
        /**
         * 模态框实例
         *
         * @type {AppModal}
         * @memberof Vue
         */
        $appmodal: AppModal;
    }
}