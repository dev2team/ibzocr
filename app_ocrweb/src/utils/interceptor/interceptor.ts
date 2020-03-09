import axios from 'axios';
import { Environment } from '@/environments/environment';
import router from '../../router';


/**
 * 拦截器
 *
 * @export
 * @class Interceptors
 */
export class Interceptors {

    /**
     * 拦截器实现接口
     *
     * @private
     * @memberof Interceptors
     */
    private intercept(): void {
        axios.interceptors.request.use((config: any) => {
            const rootapp: any = router.app;
            const appdata: string = rootapp.$store.getters.getAppData();
            if (!Object.is(appdata, '')) {
                config.headers.srfappdata = appdata;
            }
            if (window.localStorage.getItem('token')) {
                const token = window.localStorage.getItem('token');
                config.headers.Authorization = `Bearer ${token}`;
            }
            if (!config.url.startsWith('https://') && !config.url.startsWith('http://')) {
                config.url = Environment.BaseUrl + config.url;
            }
            return config;
        }, (error: any) => {
            return Promise.reject(error);
        });

        axios.interceptors.response.use((response: any) => {
            return response;
        }, (error: any) => {
            error = error ? error : { response: {} };
            // tslint:disable-next-line:prefer-const
            let { response: res } = error;
            let { data: _data } = res;

            if (_data && _data.status === 401) {
                this.doNoLogin(_data.data);
            }

            return Promise.reject(res);
        });
    }

    /**
     * 处理未登录异常情况
     *
     * @private
     * @param {*} [data={}]
     * @memberof Interceptors
     */
    private doNoLogin(data: any = {}): void {
        if (data.loginurl && !Object.is(data.loginurl, '') && data.originurl && !Object.is(data.originurl, '')) {
            let _url = encodeURIComponent(encodeURIComponent(window.location.href));
            let loginurl: string = data.loginurl;
            const originurl: string = data.originurl;

            if (originurl.indexOf('?') === -1) {
                _url = `${encodeURIComponent('?RU=')}${_url}`;
            } else {
                _url = `${encodeURIComponent('&RU=')}${_url}`;
            }
            loginurl = `${loginurl}${_url}`;

            window.location.href = loginurl;
        } else {
            if (Object.is(router.currentRoute.name, 'login')) {
                return;
            }
            router.push({ name: 'login', query: { redirect: router.currentRoute.fullPath } });
        }
    }


    /**
     * 构建对象
     * 
     * @memberof Interceptors
     */
    private constructor() {
        this.intercept();
    }

    /**
     * 初始化变量
     *
     * @private
     * @static
     * @type {Interceptors}
     * @memberof Interceptors
     */
    private static interceptors: Interceptors;

    /**
     * 获取单例对象
     *
     * @static
     * @returns {Interceptors}
     * @memberof Interceptors
     */
    public static getInstance(): Interceptors {
        if (!Interceptors.interceptors) {
            Interceptors.interceptors = new Interceptors();
        }
        return this.interceptors;
    }
}

