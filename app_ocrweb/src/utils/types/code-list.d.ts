import Vue, { VNode, CreateElement } from "vue";

/**
 * 代码表
 *
 * @export
 * @interface CodeList
 */
export declare interface CodeList {

    getCodeItemTextByValue(srfkey: string,value: any) :string;
    getCodeItemByValue(srfkey: string,value: any) :any;
    getCodeItemsByValue(srfkey: string,value: any) :any[];
    /**
     * 常规内容绘制
     *
     * @param {CreateElement} h
     * @param {{ srfkey: string; value: string; emtpytext: string; }} { srfkey, value, emtpytext }
     * @returns {VNode}
     * @memberof CodeList
     */
    render(h: CreateElement, { srfkey, value, emtpytext }: { srfkey: string; value: string; emtpytext: string; }): VNode;
    /**
     * 数字或处理
     *
     * @param {CreateElement} h
     * @param {{ srfkey: ''; value: string; emtpytext: string; textSeparator: string; }} { srfkey, value, emtpytext, textSeparator }
     * @returns {VNode}
     * @memberof CodeList
     */
    renderNumOr(h: CreateElement, { srfkey, value, emtpytext, textSeparator }: { srfkey: string; value: string; emtpytext: string; textSeparator: string; }): VNode;
    /**
     * 文本或处理
     *
     * @param {CreateElement} h
     * @param {{ srfkey: string; value: any; emtpytext: any; textSeparator: any; valueSeparator: any; }} { srfkey, value, emtpytext, textSeparator, valueSeparator }
     * @returns {VNode}
     * @memberof CodeList
     */
    renderStrOr(h: CreateElement, { srfkey, value, emtpytext, textSeparator, valueSeparator }: { srfkey: string; value: any; emtpytext: any; textSeparator: any; valueSeparator: any; }): VNode;
}

declare module "vue/types/vue" {
    interface Vue {
        /**
         * 代码表绘制对象
         *
         * @type {CodeList}
         * @memberof Vue
         */
        $codelist: CodeList;
    }
}
