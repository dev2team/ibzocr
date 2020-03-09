import axios from 'axios';
import { Loading } from 'element-ui';
import { ElLoadingComponent } from 'element-ui/types/loading';
import JsonHttp from '../json-http/json-http';
import { Environment } from '@/environments/environment';

/**
 * Http net 对象
 * 调用 getInstance() 获取实例
 *
 * @class Http
 */
export class Http {

    /**
     * 获取 Http 单例对象
     *
     * @static
     * @returns {Http}
     * @memberof Http
     */
    public static getInstance(): Http {
        if (!Http.Http) {
            Http.Http = new Http();
        }
        return this.Http;
    }

    /**
     * 单例变量声明
     *
     * @private
     * @static
     * @type {Http}
     * @memberof Http
     */
    private static Http: Http;

    /**
     * 统计加载
     *
     * @type {number}
     * @memberof Http
     */
    private loadingCount: number = 0;

    /**
     * load状态管理器
     *
     * @private
     * @type {(ElLoadingComponent | any)}
     * @memberof Http
     */
    private elLoadingComponent: ElLoadingComponent | any;

    /**
     * 示例数请求
     *
     * @type {AppSampleHttp}
     * @memberof Http
     */
    public jsonHttp: JsonHttp = JsonHttp.getInstance();

    /**
     * Creates an instance of Http.
     * 私有构造，拒绝通过 new 创建对象
     * 
     * @memberof Http
     */
    private constructor() { }

    /**
     * post请求
     *
     * @param {string} url
     * @param {*} [params={}]
     * @param {boolean} [isloading]
     * @param {number} [serialnumber]
     * @returns {Promise<any>}
     * @memberof Http
     */
    public post(url: string, params: any = {}, isloading?: boolean, serialnumber?: number): Promise<any> {
        if (Environment.SampleMode) {
            return this.jsonHttp.http(url, params);
        }
        if (isloading) {
            this.beginLoading();
        }
        return new Promise((resolve: any, reject: any) => {
            axios({
                method: 'post',
                url: url,
                data: { ...params },
                headers: { 'Content-Type': 'application/json;charset=UTF-8', 'Accept': 'application/json' },
                transformResponse: [(data: any) => {
                    let _data: any = null;
                    try {
                        _data = JSON.parse(JSON.parse(JSON.stringify(data)));
                    } catch (error) {
                    }
                    return _data;
                }],
            }).then((response: any) => {
                if (isloading) {
                    this.endLoading();
                }
                if (serialnumber) {
                    Object.assign(response, { serialnumber: serialnumber });
                }
                resolve(response);
            }).catch((response: any) => {
                if (isloading) {
                    this.endLoading();
                }
                if (serialnumber) {
                    Object.assign(response, { serialnumber: serialnumber });
                }
                reject(response);
            });
        });
    }

    /**
     * 多参数
     *
     * @param {string} url
     * @param {*} [params={}]
     * @param {boolean} [isloading]
     * @param {number} [serialnumber]
     * @returns {Promise<any>}
     * @memberof Http
     */
    public get(url: string, params: any = {}, isloading?: boolean, serialnumber?: number): Promise<any> {
        if (Environment.SampleMode) {
            return this.jsonHttp.http(url, params);
        }
        if (Object.keys(params).length > 0) {
            const _strParams: string = this.transformationOpt(params);
            if (url.endsWith('?')) {
                url = `${url}${_strParams}`;
            } else if (url.indexOf('?') !== -1 && url.endsWith('&')) {
                url = `${url}${_strParams}`;
            } else if (url.indexOf('?') !== -1 && !url.endsWith('&')) {
                url = `${url}&${_strParams}`;
            } else {
                url = `${url}?${_strParams}`;
            }
        }

        if (isloading) {
            this.beginLoading();
        }
        return new Promise((resolve: any, reject: any) => {
            axios.get(url).then((response: any) => {
                if (isloading) {
                    this.endLoading();
                }
                if (serialnumber) {
                    Object.assign(response, { serialnumber: serialnumber });
                }
                resolve(response);
            }).catch((response: any) => {
                if (isloading) {
                    this.endLoading();
                }
                if (serialnumber) {
                    Object.assign(response, { serialnumber: serialnumber });
                }
                reject(response);
            });
        });
    }

    /**
     * 一级参数
     *
     * @param {string} url
     * @param {boolean} [isloading]
     * @param {number} [serialnumber]
     * @returns {Promise<any>}
     * @memberof Http
     */
    public get2(url: string, isloading?: boolean, serialnumber?: number): Promise<any> {
        if (Environment.SampleMode) {
            return this.jsonHttp.http(url);
        }

        if (isloading) {
            this.beginLoading();
        }
        return new Promise((resolve: any, reject: any) => {
            axios.get(url).then((response: any) => {
                if (isloading) {
                    this.endLoading();
                }
                if (serialnumber) {
                    Object.assign(response, { serialnumber: serialnumber });
                }
                resolve(response);
            }).catch((response: any) => {
                if (isloading) {
                    this.endLoading();
                }
                if (serialnumber) {
                    Object.assign(response, { serialnumber: serialnumber });
                }
                reject(response);
            });
        });
    }

    /**
     * 请求参数转义处理
     *
     * @private
     * @param {*} [opt={}]
     * @returns {string}
     * @memberof Http
     */
    private transformationOpt(opt: any = {}): any {
        const params: any = {};
        const postData: string[] = [];

        Object.assign(params, opt);
        const keys: string[] = Object.keys(params);
        keys.forEach((key: string) => {
            const val: any = params[key];
            if (val instanceof Array || val instanceof Object) {
                postData.push(`${key}=${encodeURIComponent(JSON.stringify(val))}`);
            } else {
                postData.push(`${key}=${encodeURIComponent(val)}`);
            }
        });
        return postData.join('&');
    }

    /**
     * 开始加载
     *
     * @private
     * @memberof Http
     */
    private beginLoading(): void {
        if (this.loadingCount === 0) {
            this.elLoadingComponent = Loading.service({
                body: true,
                fullscreen: true,
            });
        }
        this.loadingCount++;
    }

    /**
     * 加载结束
     *
     * @private
     * @memberof Http
     */
    private endLoading(): void {
        if (this.loadingCount > 0) {
            this.loadingCount--;
        }
        setTimeout(() => {
            if (this.loadingCount === 0) {
                this.elLoadingComponent.close();
            }
        }, 500);
    }

}