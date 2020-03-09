import Vue, { VNode, CreateElement } from "vue";

/**
 * Http net 对象
 *
 * @export
 * @interface Http
 */
export declare interface Http {
    /**
     * post请求
     *
     * @param {string} url
     * @param {*} params
     * @param {boolean} [isloading]
     * @param {number} [serialnumber]
     * @returns {Promise<any>}
     * @memberof Http
     */
    post(url: string, params: any, isloading?: boolean, serialnumber?: number): Promise<any>;
    /**
     * 多参数
     *
     * @param {string} url
     * @param {*} params
     * @param {boolean} [isloading]
     * @param {number} [serialnumber]
     * @returns {Promise<any>}
     * @memberof Http
     */
    get(url: string, params: any, isloading?: boolean, serialnumber?: number): Promise<any>;
    /**
     * url 处理参数
     *
     * @param {string} url
     * @param {boolean} [isloading]
     * @param {number} [serialnumber]
     * @returns {Promise<any>}
     * @memberof Http
     */
    get2(url: string, isloading?: boolean, serialnumber?: number): Promise<any>;
}

declare module "vue/types/vue" {
    interface Vue {
        /**
         * Http net 对象
         *
         * @type {Http}
         * @memberof Vue
         */
        $http: Http;
    }
}