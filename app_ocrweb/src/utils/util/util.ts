/**
 * 平台工具类
 * 
 * @export
 * @class Util
 */
export class Util {

    /**
     * 错误提示信息
     * 
     * @static
     * @type {string}
     * @memberof Util
     */
    public static errorInfo: string = '';

    /**
     * 创建 UUID
     *
     * @static
     * @returns {string}
     * @memberof Util
     */
    public static createUUID(): string {
        function s4() {
            return Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1);
        }
        return s4() + s4() + '-' + s4() + '-' + s4() + '-' + s4() + '-' + s4() + s4() + s4();
    }

    /**
     * 创建序列号
     *
     * @static
     * @returns {number}
     * @memberof Util
     */
    public static createSerialNumber(): number {
        function s4() {
            return Math.floor((1 + Math.random()) * 0x10000);
        }
        return s4();
    }

    /**
     * 判断是否为一个函数
     *
     * @static
     * @param {*} func
     * @returns {boolean}
     * @memberof Util
     */
    public static isFunction(func: any): boolean {
        return typeof (func) === 'function';
    }

    /**
     * 判断条件是否成立
     * 
     * @static
     * @param {*} value 
     * @param {*} op 
     * @param {*} value2 
     * @returns {boolean} 
     * @memberof Util
     */
    public static testCond(value: any, op: any, value2: any): boolean {
        // 等于操作
        if (Object.is(op, 'EQ')) {
            const _value = `${value}`;
            return _value === value2;
        }
        // 大于操作
        if (Object.is(op, 'GT')) {
            const result: number = this.compare(value, value2);
            if (result !== undefined && result > 0) {
                return true;
            } else {
                return false;
            }
        }
        // 大于等于操作
        if (Object.is(op, 'GTANDEQ')) {
            const result: number = this.compare(value, value2);
            if (result !== undefined && result >= 0) {
                return true;
            } else {
                return false;
            }
        }
        // 值包含在给定的范围中
        if (Object.is(op, 'IN')) {
            return this.contains(value, value2);
        }
        // 不为空判断操作
        if (Object.is(op, 'ISNOTNULL')) {
            return (value != null && value !== '');
        }
        // 为空判断操作
        if (Object.is(op, 'ISNULL')) {
            return (value == null || value === '');
        }
        // 文本左包含
        if (Object.is(op, 'LEFTLIKE')) {
            return (value && value2 && (value.toUpperCase().indexOf(value2.toUpperCase()) === 0));
        }
        // 文本包含
        if (Object.is(op, 'LIKE')) {
            return (value && value2 && (value.toUpperCase().indexOf(value2.toUpperCase()) !== -1));
        }
        // 小于操作
        if (Object.is(op, 'LT')) {
            const result: number = this.compare(value, value2);
            if (result !== undefined && result < 0) {
                return true;
            } else {
                return false;
            }
        }
        // 小于等于操作
        if (Object.is(op, 'LTANDEQ')) {
            const result: number = this.compare(value, value2);
            if (result !== undefined && result <= 0) {
                return true;
            } else {
                return false;
            }
        }
        // 不等于操作
        if (Object.is(op, 'NOTEQ')) {
            const _value = `${value}`;
            return _value !== value2;
        }
        // 值不包含在给定的范围中
        if (Object.is(op, 'NOTIN')) {
            return !this.contains(value, value2);
        }
        // 文本右包含
        if (Object.is(op, 'RIGHTLIKE')) {
            if (!(value && value2)) {
                return false;
            }
            const nPos = value.toUpperCase().indexOf(value2.toUpperCase());
            if (nPos === -1) {
                return false;
            }
            return nPos + value2.length === value.length;
        }
        // 空判断
        if (Object.is(op, 'TESTNULL')) {

        }
        // 自定义包含
        if (Object.is(op, 'USERLIKE')) {

        }
        return false;
    }

    /**
     * 文本包含
     * 
     * @static
     * @param {any} value 
     * @param {any} value2 
     * @returns {boolean} 
     * @memberof Util
     */
    public static contains(value: any, value2: any): boolean {
        if (value && value2) {
            // 定义一数组
            let arr = new Array();
            arr = value2.split(',');
            // 定义正则表达式的连接符
            const S = String.fromCharCode(2);
            const reg = new RegExp(S + value + S);
            return (reg.test(S + arr.join(S) + S));
        }
        return false;
    }

    /**
     * 值比较
     * 
     * @static
     * @param {*} value 
     * @param {*} value2 
     * @returns {number} 
     * @memberof Util
     */
    public static compare(value: any, value2: any): number {
        let result: any;
        if (!Object.is(value, '') && !Object.is(value2, '') && !isNaN(value) && !isNaN(value2)) {
            result = this.compareNumber(parseFloat(value), parseFloat(value2));
        } else if (this.isParseDate(value) && this.isParseDate(value2)) {
            result = this.compareDate((new Date(value)).getTime(), (new Date(value2)).getTime());
        } else if (value && (typeof (value) === 'boolean' || value instanceof Boolean)) {
            result = this.compareBoolean(value, value2);
        } else if (value && (typeof (value) === 'string' || value instanceof String)) {
            result = this.compareString(value, value2);
        }
        return result;
    }

    /**
     * 是否是时间
     *
     * @static
     * @param {string} value
     * @returns {boolean}
     * @memberof Util
     */
    public static isParseDate(value: string): boolean {
        const time = new Date(value);
        if (isNaN(time.getTime())) {
            return false;
        }
        return true;
    }

    /**
     * 时间值比较（毫秒数）
     *
     * @static
     * @param {number} value
     * @param {number} value2
     * @returns {number}
     * @memberof Util
     */
    public static compareDate(value: number, value2: number): number {
        if (value > value2) {
            return 1;
        } else if (value < value2) {
            return -1;
        } else {
            return 0;
        }
    }

    /**
     * 数值比较
     *
     * @static
     * @param {number} value
     * @param {number} value2
     * @returns {number}
     * @memberof Util
     */
    public static compareNumber(value: number, value2: number): number {
        if (value > value2) {
            return 1;
        } else if (value < value2) {
            return -1;
        } else {
            return 0;
        }
    }

    /**
     * 字符串比较
     *
     * @static
     * @param {*} value
     * @param {*} value2
     * @returns {number}
     * @memberof Util
     */
    public static compareString(value: any, value2: any): number {
        return value.localeCompare(value2);
    }

    /**
     * boolean 值比较
     *
     * @static
     * @param {*} value
     * @param {*} value2
     * @returns {number}
     * @memberof Util
     */
    public static compareBoolean(value: any, value2: any): number {
        if (value === value2) {
            return 0;
        } else {
            return -1;
        }
    }

    /**
     *
     *
     * @static
     * @param {*} [o={}]
     * @memberof Util
     */
    public static processResult(o: any = {}): void {
        if (o.url != null && o.url !== '') {
            window.location.href = o.url;
        }
        if (o.code != null && o.code !== '') {
            // tslint:disable-next-line:no-eval
            eval(o.code);
        }

        if (o.downloadurl != null && o.downloadurl !== '') {
            const downloadurl = this.parseURL2(o.downloadurl, '');
            this.download(downloadurl);
        }
    }

    /**
     * 下载文件
     * 
     * @static
     * @param {string} url 
     * @memberof Util
     */
    public static download(url: string): void {
        window.open(url, '_blank');
    }

    /**
     * 
     * 
     * @static
     * @param {any} url 
     * @param {any} params 
     * @returns {string} 
     * @memberof Util
     */
    public static parseURL2(url: string, params: any): string {
        let tmpURL;
        if (url.indexOf('../../') !== -1) {
            tmpURL = url.substring(url.indexOf('../../') + 6, url.length);
        } else if (url.indexOf('/') === 0) {
            tmpURL = url.substring(url.indexOf('/') + 1, url.length);
        } else {
            tmpURL = url;
        }

        if (params) {
            return tmpURL + (url.indexOf('?') === -1 ? '?' : '&');
        } else {
            return tmpURL;
        }
    }

    /**
     * 是否是数字
     * 
     * @param {*} num 
     * @returns {boolean} 
     * @memberof Util
     */
    public static isNumberNaN(num: any): boolean {
        return Number.isNaN(num) || num !== num;
    }

    /**
     * 是否未定义
     * 
     * @static
     * @param {*} value 
     * @returns {boolean} 
     * @memberof Util
     */
    public static isUndefined(value: any): boolean {
        return typeof value === 'undefined';
    }

    /**
     * 是否为空
     * 
     * @static
     * @param {*} value 
     * @returns {boolean} 
     * @memberof Util
     */
    public static isEmpty(value: any): boolean {
        return this.isUndefined(value) || Object.is(value, '') || value === null || value !== value;
    }

    /**
     * 检查属性常规条件
     *
     * @static
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
    public static checkFieldSimpleRule(value: any, op: string, value2: any, errorInfo: string, paramType: string, form: any, primaryModel: boolean): boolean {
        if (Object.is(paramType, 'CURTIME')) {
            value2 = `${new Date()}`;
        }
        if (Object.is(paramType, 'ENTITYFIELD')) {
            value2 = value2 ? value2.toLowerCase() : '';
            const _value2Field = form.findFormItem(value2);
            if (!_value2Field) {
                this.errorInfo = `表单项${value2}未配置`;
                return true;
            }
            value2 = _value2Field.getValue();
        }
        if (this.isEmpty(errorInfo)) {
            errorInfo = '内容必须符合值规则';
        }
        this.errorInfo = errorInfo;
        const result = this.testCond(value, op, value2);
        if (!result) {
            if (primaryModel) {
                throw new Error(this.errorInfo);
            }
        }
        return !result;
    }

    /**
     * 检查属性字符长度规则
     * 
     * @static
     * @param {*} viewValue 
     * @param {number} minLength 
     * @param {boolean} indexOfMin 
     * @param {number} maxLength 
     * @param {boolean} indexOfMax 
     * @param {string} errorInfo 
     * @param {boolean} primaryModel 
     * @returns {boolean} 
     * @memberof Util
     */
    public static checkFieldStringLengthRule(viewValue: string, minLength: number, indexOfMin: boolean, maxLength: number, indexOfMax: boolean, errorInfo: string, primaryModel: boolean): boolean {
        if (this.isEmpty(errorInfo)) {
            this.errorInfo = '内容长度必须符合范围规则';
        } else {
            this.errorInfo = errorInfo;
        }

        const isEmpty = Util.isEmpty(viewValue);
        if (isEmpty) {
            if (primaryModel) {
                throw new Error('值为空');
            }
            this.errorInfo = '值为空';
            return true;
        }

        const viewValueLength: number = viewValue.length;

        // 小于等于
        if (minLength !== null) {
            if (indexOfMin) {
                if (viewValueLength < minLength) {
                    if (primaryModel) {
                        throw new Error(this.errorInfo);
                    }
                    return true;
                }
            } else {
                if (viewValueLength <= minLength) {
                    if (primaryModel) {
                        throw new Error(this.errorInfo);
                    }
                    return true;
                }
            }
        }

        //  大于等于
        if (maxLength !== null) {
            if (indexOfMax) {
                if (viewValueLength > maxLength) {
                    if (primaryModel) {
                        throw new Error(this.errorInfo);
                    }
                    return true;
                }
            } else {
                if (viewValueLength >= maxLength) {
                    if (primaryModel) {
                        throw new Error(this.errorInfo);
                    }
                    return true;
                }
            }
        }

        this.errorInfo = '';
        return false;
    }

    /**
     * 检查属性值正则式规则
     * 
     * @static
     * @param {string} viewValue 属性值
     * @param {*} strReg 验证正则
     * @param {string} errorInfo 错误信息
     * @param {boolean} primaryModel 是否关键条件
     * @returns {boolean} 
     * @memberof Util
     */
    public static checkFieldRegExRule(viewValue: string, strReg: any, errorInfo: string, primaryModel: boolean): boolean {
        if (this.isEmpty(errorInfo)) {
            this.errorInfo = '值必须符合正则规则';
        } else {
            this.errorInfo = errorInfo;
        }
        const isEmpty = Util.isEmpty(viewValue);
        if (isEmpty) {
            if (primaryModel) {
                throw new Error('值为空');
            }
            this.errorInfo = '值为空';
            return true;
        }
        const regExp = new RegExp(strReg);
        if (!regExp.test(viewValue)) {
            if (primaryModel) {
                throw new Error(this.errorInfo);
            }
            return true;
        }

        this.errorInfo = '';
        return false;
    }

    /**
     * 检查属性值范围规则
     * 
     * @static
     * @param {string} viewValue 属性值
     * @param {*} minNumber 最小数值
     * @param {boolean} indexOfMin 是否包含最小数值
     * @param {*} maxNumber 最大数值
     * @param {boolean} indexOfMax 是否包含最大数值
     * @param {string} errorInfo 错误信息
     * @param {boolean} primaryModel 是否关键条件
     * @returns {boolean} 
     * @memberof Util
     */
    public static checkFieldValueRangeRule(viewValue: string, minNumber: any, indexOfMin: boolean, maxNumber: any, indexOfMax: boolean, errorInfo: string, primaryModel: boolean): boolean {

        if (this.isEmpty(errorInfo)) {
            this.errorInfo = '值必须符合值范围规则';
        } else {
            this.errorInfo = errorInfo;
        }

        const isEmpty = Util.isEmpty(viewValue);
        if (isEmpty) {
            if (primaryModel) {
                throw new Error('值为空');
            }
            this.errorInfo = '值为空';
            return true;
        }

        const valueFormat = this.checkFieldRegExRule(viewValue, /^-?\d*\.?\d+$/, '', primaryModel);
        if (valueFormat) {
            return true;
        } else {
            this.errorInfo = errorInfo;
        }

        const data = Number.parseFloat(viewValue);

        // 小于等于
        if (minNumber !== null) {
            if (indexOfMin) {
                if (data < minNumber) {
                    if (primaryModel) {
                        throw new Error(this.errorInfo);
                    }
                    return true;
                }
            } else {
                if (data <= minNumber) {
                    if (primaryModel) {
                        throw new Error(this.errorInfo);
                    }
                    return true;
                }
            }
        }

        // //大于等于
        if (maxNumber != null) {
            if (indexOfMax) {
                if (data > maxNumber) {
                    if (primaryModel) {
                        throw new Error(this.errorInfo);
                    }
                    return true;
                }
            } else {
                if (data >= maxNumber) {
                    if (primaryModel) {
                        throw new Error(this.errorInfo);
                    }
                    return true;
                }
            }
        }

        this.errorInfo = '';
        return false;
    }

    /**
     * 检查属性值系统值范围规则  暂时支持正则表达式
     * 
     * @static
     * @param {string} viewValue 属性值
     * @param {*} strReg 正则
     * @param {string} errorInfo  错误信息
     * @param {boolean} primaryModel 是否关键条件
     * @returns {boolean} 
     * @memberof Util
     */
    public static checkFieldSysValueRule(viewValue: string, strReg: any, errorInfo: string, primaryModel: boolean): boolean {
        return this.checkFieldRegExRule(viewValue, strReg, errorInfo, primaryModel);
    }

    /**
     * 将文本格式的xml转换为dom模式
     * 
     * @static
     * @param {string} strXml 
     * @memberof Util
     */
    public static parseXML(strXml: string): Document | undefined {
        if (strXml) {
            return new DOMParser().parseFromString(strXml, 'text/xml');
        }
        return undefined;
    }

    /**
     * 将xml转换为object对象
     * 
     * @static
     * @param {*} node 
     * @param {*} [obj={}] 
     * @memberof Util
     */
    public static loadXMLNode(node: any, obj: any = {}): void {
        if (node && node.attributes) {
            const arr: any = node.attributes;
            for (let i = 0; i < arr.length; i++) {
                let A = arr.item(i).name;
                const B = arr.item(i).value;
                A = A.toLowerCase();
                obj[A] = B;
            }
        }
    }

    /**
     * 将object转换为xml对象
     * 
     * @static
     * @param {any} XML 
     * @param {any} obj 
     * @memberof Util
     */
    public static saveXMLNode(XML: any, obj: any) {
        const keys: string[] = Object.keys(obj);
        keys.forEach((key: string) => {
            const value = obj[key];
            if (!value || value instanceof Object || typeof (value) === 'function') {
                return;
            }
            const proValue = value.toString();
            if (proValue !== '') {
                XML.attrib(key, proValue);
            }
        });
    }

    /**
     * 格式化矩阵参数
     *
     * @static
     * @param {string} param
     * @returns {any}
     * @memberof Util
     */
    public static formatMatrixParse(param: string): any {
        const data: any = {};
        const params_arr: string[] = param.split(';');
        params_arr.forEach((_data: string, index: number) => {
            if ((index === params_arr.length - 1) && _data.indexOf('?') !== -1) {
                _data = _data.substr(0, _data.indexOf('?'));
            }
            const _data_arr: string[] = [..._data.split('=')];
            data[_data_arr[0]] = _data_arr[1];
        });
        return data;
    }

    /**
     * 处理url参数
     *
     * @static
     * @param {string} param
     * @returns {*}
     * @memberof Util
     */
    public static formatMatrixParse2(param: string): any {
        const viewdata: any = { srfparentdata: {} };
        const params_arr: string[] = param.split(';');
        params_arr.forEach((_data: string, index: number) => {
            if ((index === params_arr.length - 1) && _data.indexOf('?') !== -1) {
                _data = _data.substr(0, _data.indexOf('?'));
            }
            const _data_arr: string[] = [..._data.split('=')];
            if (Object.is(_data_arr[0], 'srfkey')) {
                Object.assign(viewdata, { [_data_arr[0]]: _data_arr[1] });
            } else {
                Object.assign(viewdata.srfparentdata, { [_data_arr[0]]: _data_arr[1] });
            }
        });
        return viewdata;
    }

    /**
     * 转换为矩阵参数
     *
     * @static
     * @param {*} obj
     * @returns {*}
     * @memberof Util
     */
    public static formatMatrixStringify(obj: any): any {
        let str: string = '';
        if (obj && !(obj instanceof Array) && (obj instanceof Object)) {
            const keys: string[] = Object.keys(obj);
            keys.forEach((key: string) => {
                if (!obj[key]) {
                    return;
                }
                if (!Object.is(str, '')) {
                    str += ';';
                }
                str += `${key}=${obj[key]}`;
            });
        }
        return Object.is(str, '') ? undefined : str;
    }

    /**
     * 格式化Url参数
     *
     * @static
     * @param {*} [params={}]
     * @returns {string}
     * @memberof Util
     */
    public static urlEncode(params: any = {}): string {
        let str: string = '';
        for (const key in params) {
            if (params.hasOwnProperty(key)) {
                const val = params[key];
                str += `${key}=${encodeURIComponent(val)}&`;
            }
        }
        return str;
    }

    /**
     * 清除用户信息缓存
     *
     * @static
     * @memberof Util
     */
    public static clearUserInfo(): void {
        window.localStorage.removeItem('user');
        window.localStorage.removeItem('token');
    }

    /**
     * 检查返回数据
     *
     * @param {*} res
     * @returns {boolean}
     * @memberof Util
     */
    public static checkRes(res: any): boolean {
        return (res && res.ret === 0) ? true : false;
    }

    /**
     * 准备路由参数
     *
     * @static
     * @param {*} { route: route, sourceNode: sourceNode, targetNode: targetNode, data: data }
     * @returns {*}
     * @memberof Util
     */
    public static prepareRouteParmas({ route: route, sourceNode: sourceNode, targetNode: targetNode, data: data }: any): any {
        const params: any = {};
        if (!sourceNode || (sourceNode && Object.is(sourceNode, ''))) {
            return params;
        }
        if (!targetNode || (targetNode && Object.is(targetNode, ''))) {
            return params;
        }
        // route.matched.some((_matched: any, index: number, arr: any[]) => {
        //     // 当前视图
        //     if (Object.is(sourceNode, _matched.name && arr.length > 1)) {
        //         Object.assign(params, { [targetNode]: this.formatMatrixStringify(data) });
        //         return true;
        //     }
        //     // 父视图
        //     Object.assign(params, { [_matched.name]: route.params[_matched.name] });
        //     return false;
        // });
        const indexName = route.matched[0].name;
        Object.assign(params, { [indexName]: route.params[indexName] });
        Object.assign(params, { [targetNode]: this.formatMatrixStringify(data) });
        return params;
    }

    /**
     * 获取当前值类型
     *
     * @static
     * @param {*} obj
     * @returns
     * @memberof Util
     */
    public static typeOf(obj: any):string {
        const toString = Object.prototype.toString;
        const map: any = {
            '[object Boolean]': 'boolean',
            '[object Number]': 'number',
            '[object String]': 'string',
            '[object Function]': 'function',
            '[object Array]': 'array',
            '[object Date]': 'date',
            '[object RegExp]': 'regExp',
            '[object Undefined]': 'undefined',
            '[object Null]': 'null',
            '[object Object]': 'object'
        };
        return map[toString.call(obj)];
    }

    /**
     * 深拷贝(deepCopy)
     *
     * @static
     * @param {*} data
     * @returns {*}
     * @memberof Util
     */
    public static deepCopy(data: any): any {
        const t = this.typeOf(data);
        let o: any;

        if (t === 'array') {
            o = [];
        } else if (t === 'object') {
            o = {};
        } else {
            return data;
        }

        if (t === 'array') {
            for (let i = 0; i < data.length; i++) {
                o.push(this.deepCopy(data[i]));
            }
        } else if (t === 'object') {
            for (let i in data) {
                o[i] = this.deepCopy(data[i]);
            }
        }
        return o;
    }

    /**
     * 名称格式化
     *
     * @static
     * @param {string} name
     * @returns {string}
     * @memberof Util
     */
    public static srfFilePath2(name: string): string {
        if (!name || (name && Object.is(name, ''))) {
            throw new Error('名称异常');
        }
        name = name.replace(/[_]/g, '-');
        let state: number = 0;
        let _str = '';
        const uPattern = /^[A-Z]{1}$/;

        const str1 = name.substring(0, 1);
        const str2 = name.substring(1)
        state = uPattern.test(str1) ? 1 : 0;
        _str = `${_str}${str1.toLowerCase()}`;

        for (let chr of str2) {
            if (uPattern.test(chr)) {
                if (state === 1) {
                    _str = `${_str}${chr.toLowerCase()}`;
                } else {
                    _str = `${_str}-${chr.toLowerCase()}`;
                }
                state = 1
            } else {
                _str = `${_str}${chr.toLowerCase()}`;
                state = 0
            }
        }
        _str = _str.replace(/---/g, '-').replace(/--/g, '-');

        return _str;
    }

}