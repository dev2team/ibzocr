/**
 * jsonp跨域请求
 *
 * @export
 * @class Jsonp
 */
export default class Jsonp {

    /**
     * 请求超时时长
     *
     * @type {number}
     * @memberof Jsonp
     */
    public time: number = 60000;

    /**
     * Creates an instance of Jsonp.
     * @param {number} [time]
     * @memberof Jsonp
     */
    constructor(time?: number) {
        if (time) {
            this.time = time;
        }
    }

    /**
     * 请求入口
     *
     * @param {string} url
     * @param {*} [params={}]
     * @returns {Promise<any>}
     * @memberof Jsonp
     */
    public jsonp(url: string, params: any = {}): Promise<any> {
        return new Promise((resolve, reject) => {
            if (typeof url !== 'string') {
                throw new Error('[url] is not string.')
            }

            let callbackQuery = params.callbackQuery || 'callback'
            let callbackName = params.callbackName || 'jsonp_' + this.randomStr();

            params[callbackQuery] = callbackName;

            delete params.callbackQuery;
            delete params.callbackName;

            let queryStrs: any[] = [];
            Object.keys(params).forEach((queryName) => {
                queryStrs = queryStrs.concat(this.formatParams(queryName, params[queryName]))
            })

            let queryStr = this.flatten(queryStrs).join('&');

            const _window: any = window;

            let headNode: any = document.querySelector('head');
            let paddingScript: any = document.createElement('script');

            let onError = () => {
                removeErrorListener()
                clearTimeout(timeoutTimer)
                reject({
                  status: 400,
                  statusText: 'Bad Request'
                })
            }

            let removeErrorListener = () => {
                paddingScript.removeEventListener('error', onError);
            }

            let timeoutTimer = setTimeout(() => {
                removeErrorListener()
                headNode.removeChild(paddingScript)
                delete _window[callbackName]
                reject({ statusText: 'Request Timeout', status: 408 })
            }, this.time);

            _window[callbackName] = (json: any) => {
                clearTimeout(timeoutTimer)
                removeErrorListener()
                headNode.removeChild(paddingScript)
                resolve(json)
                delete _window[callbackName]
            }

            paddingScript.addEventListener('error', onError);

            paddingScript.src = url + (/\?/.test(url) ? '&' : '?') + queryStr;
            headNode.appendChild(paddingScript);
        });
    }

    /**
     * 随机数
     *
     * @returns
     * @memberof Jsonp
     */
    public randomStr(): string {
        return (Math.floor(Math.random() * 100000) * Date.now()).toString(16);
    }

    /**
     * 格式化参数
     *
     * @param {string} queryName
     * @param {*} value
     * @returns
     * @memberof Jsonp
     */
    public formatParams(queryName: string, value: any): any[] {
        queryName = queryName.replace(/=/g, '');
        let result: any[] = [];

        switch (value.constructor) {
            case String:
            case Number:
            case Boolean:
                result.push(encodeURIComponent(queryName) + '=' + encodeURIComponent(value));
                break;

            case Array:
                value.forEach((item: any) => {
                    result = result.concat(this.formatParams(queryName + '[]=', item));
                })
                break;

            case Object:
                Object.keys(value).forEach((key: string) => {
                    let item = value[key];
                    result = result.concat(this.formatParams(queryName + '[' + key + ']', item));
                })
                break;
        }

        return result;
    }

    /**
     *
     *
     * @param {*} array
     * @returns
     * @memberof Jsonp
     */
    flatten(array: any[]): any[] {
        let querys: string[] = [];
        array.forEach((item: any) => {
            if (typeof item === 'string') {
                querys.push(item);
            } else {
                querys = querys.concat(this.flatten(item));
            }
        });
        return querys;
    }
}