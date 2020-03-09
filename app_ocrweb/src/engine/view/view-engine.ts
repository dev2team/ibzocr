import { Util } from '@/utils';

/**
 * 
 *
 * @export
 * @class ViewEngine
 */
export default class ViewEngine {
    /**
     * 视图部件对象
     *
     * @protected
     * @type {*}
     * @memberof ViewEngine
     */
    protected view: any = null;
    /**
     * 引擎参数
     *
     * @type {*}
     * @memberof ViewEngine
     */
    protected opt: any = {};
    /**
     *
     *
     * @type {*}
     * @memberof ViewEngine
     */
    protected methods: any = {};

    /**
     * 视图数据
     *
     * @type {*}
     * @memberof ViewEngine
     */
    public viewdata: any = {};

    /**
     * 是否默认记载
     *
     * @type {boolean}
     * @memberof ViewEngine
     */
    public isLoadDefault: boolean = true;

    /**
     * Creates an instance of ViewEngine.
     * @memberof ViewEngine
     */
    constructor() { }

    /**
     * 引擎初始化
     *
     * @param {*} [options={}]
     * @memberof ViewEngine
     */
    public init(options: any = {}): void {
        this.opt = options;
        this.methods = options.methods;
        this.view = options.view;
        this.isLoadDefault = options.isLoadDefault;
        const hasviewdata: boolean = this.view.viewdata ? true : false;
        if (hasviewdata) {
            try {
                Object.assign(this.viewdata, JSON.parse(this.view.viewdata));
            } catch (error) {
                console.log(error);
            }
        } else {
            const _viewdata: any = {};
            const router = this.view.$route;
            if (router && router.params && router.params[router.name]) {
                Object.assign(_viewdata, Util.formatMatrixParse2(router.params[router.name]));
            }
            Object.assign(this.viewdata, _viewdata);
        }
        if (this.view.srfparentdata && this.viewdata.srfparentdata) {
            Object.assign(this.view.srfparentdata, this.viewdata.srfparentdata);
        }
        this.load();
    }

    /**
     * 设置视图数据
     *
     * @param {string} viewdata
     * @memberof ViewEngine
     */
    public setViewData(viewdata: string): void {
        this.viewdata = {};
        try {
            Object.assign(this.viewdata, JSON.parse(viewdata));
        } catch (error) {
            console.log(error);
        }
        if (this.view.srfparentdata && this.viewdata.srfparentdata) {
            Object.assign(this.view.srfparentdata, this.viewdata.srfparentdata);
        }
    }

    /**
     * 引擎加载
     *
     * @param {*} [opts={}]
     * @memberof ViewEngine
     */
    public load(opts: any = {}): void {

    }

    /**
     * 部件事件机制
     *
     * @param {string} ctrlName
     * @param {string} eventName
     * @param {*} args
     * @memberof ViewEngine
     */
    public onCtrlEvent(ctrlName: string, eventName: string, args: any): void {

    }

    /**
     * 处理界面行为
     *
     * @param {string} tag
     * @param {string} [actionmode]
     * @memberof ViewEngine
     */
    public doSysUIAction(tag: string, actionmode?: string): void {
        if (Object.is(actionmode, 'FRONT')) {
            if (this.methods.front) {
                this.methods.front(tag);
            }
        }
    }

    /**
     * 处理工作流界面行为
     *
     * @param {string} tag
     * @param {string} [actionmode]
     * @memberof ViewEngine
     */
    public doSysWFUIAction(tag: string, actionmode?: string): void {
        if (Object.is(actionmode, 'WFFRONT')) {
            if (this.methods.wfFront) {
                this.methods.wfFront(tag);
            }
        }
    }

    /**
     * 是否为方法
     *
     * @protected
     * @param {*} func
     * @returns {boolean}
     * @memberof ViewEngine
     */
    protected isFunc(func: any): boolean {
        return func instanceof Function;
    }

    /**
     * 父数据参数模式
     *
     * @param {{ tag: string, action: string, viewdata: any }} { tag, action, viewdata }
     * @memberof ViewEngine
     */
    public setViewState2({ tag, action, viewdata }: { tag: string, action: string, viewdata: any }): void {
        this.view.viewState.next({ tag: tag, action: action, data: viewdata });
    }

    /**
     * 计算工具栏状态
     *
     * @param {boolean} state
     * @param {*} [dataaccaction]
     * @memberof ViewEngine
     */
    public calcToolbarItemState(state: boolean, dataaccaction?: any) {
        const _this: any = this;
        if (!_this.view.toolBarModels || Object.keys(_this.view.toolBarModels).length === 0) {
            return;
        }

        for (const key in _this.view.toolBarModels) {
            if (!_this.view.toolBarModels.hasOwnProperty(key)) {
                return;
            }
            const _item = _this.view.toolBarModels[key];
            if (_item.uiaction && (Object.is(_item.uiaction.target, 'SINGLEKEY') || Object.is(_item.uiaction.target, 'MULTIKEY'))) {
                _item.disabled = state;
            }
        }
    }

}