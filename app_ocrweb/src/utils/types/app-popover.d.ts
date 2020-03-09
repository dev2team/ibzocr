import PopperJs from 'popper.js';
import Vue, { VNode, CreateElement } from "vue";

/**
 * 悬浮窗实例
 *
 * @export
 * @interface AppPopover
 */
export declare interface AppPopover {
    /**
     *  打开悬浮窗
     *
     * @param {MouseEvent} event
     * @param {*} view
     * @param {*} data
     * @param {string} [title]
     * @param {string} [position]
     * @param {boolean} [isAutoClose]
     * @param {number} [width]
     * @param {number} [height]
     * @returns {*}
     * @memberof AppPopover
     */
    openPop(event: MouseEvent, view: any, data: any, title?: string, position?: PopperJs.Placement, isAutoClose?: boolean, width?: number, height?: number): any;
    /**
     * 打开悬浮窗
     *
     * @param {MouseEvent} event
     * @param {(h: CreateElement) => any} content
     * @param {string} [title]
     * @param {PopperJs.Placement} [position]
     * @param {boolean} [isAutoClose]
     * @param {number} [width]
     * @param {number} [height]
     * @memberof AppPopover
     */
    openPopover(event: MouseEvent, content: (h: CreateElement) => any, title?: string, position?: PopperJs.Placement, isAutoClose?: boolean, width?: number, height?: number): void;
    /**
     * 销毁popper(带回填数据)
     *
     * @memberof AppPopover
     */
    destroy(): void;
}

declare module "vue/types/vue" {
    interface Vue {
        /**
         * 悬浮窗实例
         *
         * @type {AppPopover}
         * @memberof Vue
         */
        $apppopover: AppPopover;
    }
}
