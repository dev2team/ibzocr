import Vue, { VNode, CreateElement } from "vue";

/**
 * 工具类
 *
 * @export
 * @interface Util
 */
export declare interface Util {
    /**
     * 错误提示信息
     *
     * @type {string}
     * @memberof Util
     */
    errorInfo: string;
    /**
     * 创建 UUID
     *
     * @returns {string}
     * @memberof Util
     */
    createUUID(): string;
    /**
     * 创建序列号
     *
     * @returns {number}
     * @memberof Util
     */
    createSerialNumber(): number
    /**
     * 判断是否为一个函数
     *
     * @param {*} func
     * @returns {boolean}
     * @memberof Util
     */
    isFunction(func: any): boolean;
    /**
     * 判断条件是否成立
     *
     * @param {*} value
     * @param {*} op
     * @param {*} value2
     * @returns {boolean}
     * @memberof Util
     */
    testCond(value: any, op: any, value2: any): boolean;
    /**
     * 文本包含
     *
     * @param {*} value
     * @param {*} value2
     * @returns {boolean}
     * @memberof Util
     */
    contains(value: any, value2: any): boolean;
    /**
     * 值比较
     *
     * @param {*} value
     * @param {*} value2
     * @returns {number}
     * @memberof Util
     */
    compare(value: any, value2: any): number;
    /**
     * 是否是时间
     *
     * @param {string} value
     * @returns {boolean}
     * @memberof Util
     */
    isParseDate(value: string): boolean;
    /**
     * 时间值比较（毫秒数）
     *
     * @param {number} value
     * @param {number} value2
     * @returns {number}
     * @memberof Util
     */
    compareDate(value: number, value2: number): number;
    /**
     * 数值比较
     *
     * @param {number} value
     * @param {number} value2
     * @returns {number}
     * @memberof Util
     */
    compareNumber(value: number, value2: number): number;
    /**
     * 字符串比较
     *
     * @param {*} value
     * @param {*} value2
     * @returns {number}
     * @memberof Util
     */
    compareString(value: any, value2: any): number;
    /**
     * boolean 值比较
     *
     * @param {*} value
     * @param {*} value2
     * @returns {number}
     * @memberof Util
     */
    compareBoolean(value: any, value2: any): number;
    /**
     * 处理请求结果
     *
     * @param {*} o
     * @memberof Util
     */
    processResult(o: any): void;
    /**
     * 下载文件
     *
     * @param {string} url
     * @memberof Util
     */
    download(url: string): void;
    /**
     * 
     *
     * @param {string} url
     * @param {*} params
     * @returns {string}
     * @memberof Util
     */
    parseURL2(url: string, params: any): string;
    /**
     * 是否是数字
     *
     * @param {*} num
     * @returns {boolean}
     * @memberof Util
     */
    isNumberNaN(num: any): boolean;
    /**
     * 是否未定义
     *
     * @param {*} value
     * @returns {boolean}
     * @memberof Util
     */
    isUndefined(value: any): boolean;
    /**
     * 是否为空
     *
     * @param {*} value
     * @returns {boolean}
     * @memberof Util
     */
    isEmpty(value: any): boolean;
    /**
     * 检查属性常规条件
     *
     * @param {*} value 属性值
     * @param {string} op 检测条件
     * @param {*} value2 预定义值
     * @param {string} errorInfo 错误信息
     * @param {string} paramType 参数类型
     * @param {*} form 表单对象
     * @param {boolean} primaryModel 是否必须条件
     * @returns {boolean}
     * @memberof Util
     */
    checkFieldSimpleRule(value: any, op: string, value2: any, errorInfo: string, paramType: string, form: any, primaryModel: boolean): boolean;
    /**
     * 检查属性字符长度规则
     *
     * @param {string} viewValue
     * @param {number} minLength
     * @param {boolean} indexOfMin
     * @param {number} maxLength
     * @param {boolean} indexOfMax
     * @param {string} errorInfo
     * @param {boolean} primaryModel
     * @returns {boolean}
     * @memberof Util
     */
    checkFieldStringLengthRule(viewValue: string, minLength: number, indexOfMin: boolean, maxLength: number, indexOfMax: boolean, errorInfo: string, primaryModel: boolean): boolean;
    /**
     * 检查属性值正则式规则
     *
     * @param {string} viewValue
     * @param {*} strReg
     * @param {string} errorInfo
     * @param {boolean} primaryModel
     * @returns {boolean}
     * @memberof Util
     */
    checkFieldRegExRule(viewValue: string, strReg: any, errorInfo: string, primaryModel: boolean): boolean;
    /**
     * 检查属性值范围规则
     *
     * @param {string} viewValue
     * @param {*} minNumber
     * @param {boolean} indexOfMin
     * @param {*} maxNumber
     * @param {boolean} indexOfMax
     * @param {string} errorInfo
     * @param {boolean} primaryModel
     * @returns {boolean}
     * @memberof Util
     */
    checkFieldValueRangeRule(viewValue: string, minNumber: any, indexOfMin: boolean, maxNumber: any, indexOfMax: boolean, errorInfo: string, primaryModel: boolean): boolean;
    /**
     * 检查属性值范围规则
     *
     * @param {string} viewValue
     * @param {*} minNumber
     * @param {boolean} indexOfMin
     * @param {*} maxNumber
     * @param {boolean} indexOfMax
     * @param {string} errorInfo
     * @param {boolean} primaryModel
     * @returns {boolean}
     * @memberof Util
     */
    checkFieldValueRangeRule(viewValue: string, minNumber: any, indexOfMin: boolean, maxNumber: any, indexOfMax: boolean, errorInfo: string, primaryModel: boolean): boolean;
    /**
     * 检查属性值系统值范围规则  暂时支持正则表达式
     *
     * @param {string} viewValue
     * @param {*} strReg
     * @param {string} errorInfo
     * @param {boolean} primaryModel
     * @returns {boolean}
     * @memberof Util
     */
    checkFieldSysValueRule(viewValue: string, strReg: any, errorInfo: string, primaryModel: boolean): boolean;
    /**
     * 将文本格式的xml转换为dom模式
     *
     * @param {string} strXml
     * @returns {(Document | undefined)}
     * @memberof Util
     */
    parseXML(strXml: string): Document | undefined;
    /**
     * 将xml转换为object对象
     *
     * @param {*} node
     * @param {*} obj
     * @memberof Util
     */
    loadXMLNode(node: any, obj: any): void;
    /**
     * 将object转换为xml对象
     *
     * @param {*} XML
     * @param {*} obj
     * @memberof Util
     */
    saveXMLNode(XML: any, obj: any):void;
    /**
     * 格式化矩阵参数
     *
     * @param {string} param
     * @returns {*}
     * @memberof Util
     */
    formatMatrixParse(param: string): any;
    /**
     * 处理url参数
     *
     * @param {string} param
     * @returns {*}
     * @memberof Util
     */
    formatMatrixParse2(param: string): any;
    /**
     * 转换为矩阵参数
     *
     * @param {*} obj
     * @returns {*}
     * @memberof Util
     */
    formatMatrixStringify(obj: any): any;
    /**
     * 格式化Url参数
     *
     * @param {*} params
     * @returns {string}
     * @memberof Util
     */
    urlEncode(params: any ): string;
    /**
     * 清除用户信息缓存
     *
     * @memberof Util
     */
    clearUserInfo(): void;
    /**
     * 检查返回数据
     *
     * @param {*} res
     * @returns {boolean}
     * @memberof Util
     */
    checkRes(res: any): boolean;
    /**
     * 准备路由参数
     *
     * @param {*} { route: route, sourceNode: sourceNode, targetNode: targetNode, data: data }
     * @returns {*}
     * @memberof Util
     */
    prepareRouteParmas({ route: route, sourceNode: sourceNode, targetNode: targetNode, data: data }: any): any;
    /**
     * 获取当前值类型
     *
     * @param {*} obj
     * @returns {string}
     * @memberof Util
     */
    typeOf(obj: any):string;
    /**
     * 深拷贝(deepCopy)
     *
     * @param {*} data
     * @returns {*}
     * @memberof Util
     */
    deepCopy(data: any): any;
    /**
     * 名称格式化
     *
     * @param {string} name
     * @returns {string}
     * @memberof Util
     */
    srfFilePath2(name: string): string;
}

declare module "vue/types/vue" {
    interface Vue {
        /**
         * 工具类
         *
         * @type {Util}
         * @memberof Vue
         */
        $util: Util;
    }
}