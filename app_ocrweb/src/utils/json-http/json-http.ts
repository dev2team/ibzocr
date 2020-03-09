import Jsonp from '../jsonp/jsonp';

/**
 * 示例数请求对象
 *
 * @export
 * @class AppSamle
 */
export default class JsonHttp {

    /**
     * 获取 Http 单例对象
     *
     * @static
     * @returns {Http}
     * @memberof SampleHttp
     */
    public static getInstance(): JsonHttp {
        return new JsonHttp();
    }

    /**
     * jsonp跨域请求对象
     *
     * @type {Jsonp}
     * @memberof JsonHttp
     */
    public jsonpHttp: Jsonp = new Jsonp();

    /**
     * 请求
     *
     * @param {string} url
     * @returns {Promise<any>}
     * @memberof SampleHttp
     */
    public http(url: string, params: any = {}): Promise<any> {
        return new Promise((resolve: any, reject: any) => {
            let action = url.substring(url.lastIndexOf('/') + 1);
            let type: string = url.substring(url.indexOf('/') + 1, url.indexOf('/', url.indexOf('/') + 1));
            url = `./assets/sampledata/${url.substring(0, url.lastIndexOf('/'))}.json`;
            let fileName: string = url.substring(url.lastIndexOf('/') + 1, url.lastIndexOf('.'));
            this.jsonp(url, fileName).then((data: any) => {
                if (Object.is(type, 'app')) {
                    let result = this.setResultData(data);
                    resolve(result);
                } else {
                    let result: Promise<any>;
                    if (Object.is(type, 'ctrl')) {
                        result = this.ctrlHttp(url, action, data, params);
                    } else {
                        result = this.DEHttp(url, action, data, params);
                    }
                    result.then((response: any) => {
                        resolve(this.setResultData(response));
                    }).catch((response: any) => {
                        reject(response);
                    })
                }

            }).catch((error: any) => {
                reject(error);
            });
        });
    }

    /**
     * 实体部件类请求
     *
     * @param {string} url
     * @param {string} action
     * @param {*} data
     * @param {*} [params={}]
     * @memberof SampleHttp
     */
    public DEHttp(url: string, action: string, data: any, params: any = {}): Promise<any> {
        return new Promise((resolve: any, reject: any) => {
            let ctrlName: string = url.substring(url.lastIndexOf('/') + 1, url.lastIndexOf('.'));
            url = url.substring(0, url.lastIndexOf('/'));
            let deName: string = url.substring(url.lastIndexOf('/') + 1);
            url += `/${deName}.json`;
            this.jsonp(url, deName).then((json: any) => {
                resolve(this.getResultData(ctrlName, json, data, params));
            }).catch((error: any) => {
                reject(error);
            });
        });
    }

    /**
     * 获取返回数据
     *
     * @param {string} ctrlName
     * @param {any[]} items
     * @param {*} mode
     * @returns {*}
     * @memberof SampleHttp
     */
    public getResultData(ctrlName: string, items1: any[] = [], items2: any[] = [], params: any = {}): any {
        let data: any = {};
        if (ctrlName.endsWith('form')) {
            if (params.srfkey) {
                let index = items1.findIndex((item: any) => Object.is(item.srfkey, params.srfkey));
                if (index >= 0) {
                    Object.assign(data, items1[index]);
                    data.srfuf = "1";
                }
            }
        }
        if (ctrlName.endsWith('grid') || ctrlName.endsWith('list') || ctrlName.endsWith('dataview')) {
            let items: any[] = [];
            items1.forEach((item1: any) => {
                let data: any = {};
                items2.forEach((item2: any) => {
                    data[item2.name] = item1[item2.valueitem] != undefined ? item1[item2.valueitem] : null;
                });
                items.push(data);
            });
            Object.assign(data, { records: items, total: items1.length });
        }

        return data;
    }

    /**
     * ctrl类请求
     *
     * @param {string} url
     * @param {string} action
     * @param {*} data
     * @param {*} [params={}]
     * @returns {Promise<any>}
     * @memberof SampleHttp
     */
    public ctrlHttp(url: string, action: string, data: any, params: any = {}): Promise<any> {
        return new Promise((resolve: any, reject: any) => {
            let ctrlName: string = url.substring(url.lastIndexOf('/') + 1, url.lastIndexOf('.'));
            if (ctrlName.endsWith('appmenu')) {
                resolve(data);
            }
            if (ctrlName.endsWith('treeview')) {
                if (params.srfnodeid) {
                    let index: number = data.findIndex((item: any) => Object.is(item.id, params.srfnodeid));
                    if(index >= 0) {
                        let node: any = data[index];
                        let items: any[] = [];
                        node.childNode.forEach((id: string) => {
                            let item = data.find((item: any) => Object.is(item.id, id));
                            items.push(item);
                        });
                        resolve(items);
                    }
                }
            }
        });
    }

    /**
     * 请求
     *
     * @param {string} url
     * @param {string} callbackName
     * @returns
     * @memberof SampleHttp
     */
    public jsonp(url: string, callbackName: string) {
        return new Promise((resolve: any, reject: any) => {
            this.jsonpHttp.jsonp(url, {
                callbackName: callbackName
            }).then((json: any) => {
                resolve(json);
            }).catch((error: any) => {
                reject(error);
            });
        });
    }

    /**
     * 设置返回数据
     *
     * @param {*} resolve
     * @param {*} data
     * @memberof SampleHttp
     */
    public setResultData(data: any): any {
        return {
            status: 200,
            data: data,
            statusText: "OK"
        };
    }
}
