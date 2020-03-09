import ViewEngine from './view-engine';

/**
 * 多数据引擎
 *
 * @export
 * @class MDViewEngine
 * @extends {ViewEngine}
 */
export default class MDViewEngine extends ViewEngine {

    /**
     * 表格部件
     *
     * @type {*}
     * @memberof GridViewEngine
     */
    protected md: any;

    /**
     * 表单部件
     *
     * @type {*}
     * @memberof GridViewEngine
     */
    protected searchForm: any;

    /**
     * 属性面板
     *
     * @protected
     * @type {*}
     * @memberof PickupGridViewEngine
     */
    protected propertypanel: any;

    /**
     * 打开数据
     *
     * @protected
     * @memberof MDViewEngine
     */
    protected openData?: (args: any[], params?: any, $event?: any, xData?: any) => void;

    /**
     * 新建数据
     *
     * @protected
     * @memberof GridViewEngine
     */
    protected newData?: (args: any[], params?: any, $event?: any, xData?: any) => void;

    /**
     * Creates an instance of GridViewEngine.
     * @memberof GridViewEngine
     */
    constructor() {
        super();
    }

    /**
     * 引擎初始化
     *
     * @param {*} [options={}]
     * @memberof GridViewEngine
     */
    public init(options: any = {}): void {
        this.propertypanel = options.propertypanel;
        this.searchForm = options.searchform;
        this.openData = options.opendata;
        this.newData = options.newdata;
        super.init(options);
    }

    /**
     * 引擎加载
     *
     * @param {*} [opts={}]
     * @memberof MDViewEngine
     */
    public load(opts: any = {}): void {
        super.load(opts);
        const _srfparentdata = this.viewdata.srfparentdata ? { srfparentdata: this.viewdata.srfparentdata } : { srfparentdata: {} };
        if (this.getSearchForm()) {
            const tag = this.getSearchForm().name;
            this.setViewState2({ tag: tag, action: 'loaddraft', viewdata: _srfparentdata });
        } else if (this.getMDCtrl() && this.isLoadDefault) {
            const tag = this.getMDCtrl().name;
            this.setViewState2({ tag: tag, action: 'load', viewdata: _srfparentdata });
        } else {
            this.isLoadDefault = true;
        }
    }

    /**
     * 部件事件
     *
     * @param {string} ctrlName
     * @param {string} eventName
     * @param {*} args
     * @memberof GridViewEngine
     */
    public onCtrlEvent(ctrlName: string, eventName: string, args: any): void {
        super.onCtrlEvent(ctrlName, eventName, args);
        if (Object.is(ctrlName, 'searchform')) {
            this.searchFormEvent(eventName, args);
        }
    }

    /**
     * 搜索表单事件
     *
     * @param {string} eventName
     * @param {*} [args={}]
     * @memberof MDViewEngine
     */
    public searchFormEvent(eventName: string, args: any = {}): void {
        if (Object.is(eventName, 'load')) {
            this.onSearchFormLoad(args);
        }else if (Object.is(eventName, 'search')) {
            this.onSearchFormSearch(args);
        }
    }

    /**
     * 事件处理
     *
     * @param {string} eventName
     * @param {any[]} args
     * @memberof MDViewEngine
     */
    public MDCtrlEvent(eventName: string, args: any): void {
        if (Object.is(eventName, 'rowclick')) {
        }
        if (Object.is(eventName, 'rowdblclick')) {
            this.doEdit(args);
        }
        if (Object.is(eventName, 'selectionchange')) {
            this.selectionChange(args);
        }
        if (Object.is(eventName, 'load')) {
            this.MDCtrlLoad(args);
        }
        if (Object.is(eventName, 'beforeload')) {
            this.MDCtrlBeforeLoad(args)
        }
    }

    /**
     * 搜索表单加载完成
     *
     * @param {*} [args={}]
     * @memberof MDViewEngine
     */
    public onSearchFormLoad(args: any = {}): void {
        if (this.getMDCtrl() && this.isLoadDefault) {
            const tag = this.getMDCtrl().name;
            this.setViewState2({ tag: tag, action: 'load', viewdata: {} });
        }
        //this.isLoadDefault = true;
    }

    /**
     * 搜索表单搜索
     *
     * @param {*} [args={}]
     * @memberof MDViewEngine
     */
    public onSearchFormSearch(args: any = {}): void {
        if (this.getMDCtrl()) {
            const tag = this.getMDCtrl().name;
            this.setViewState2({ tag: tag, action: 'load', viewdata: {} });
        }
    }

    /**
     * 处理实体界面行为
     *
     * @param {string} tag
     * @param {string} [actionmode]
     * @returns {void}
     * @memberof MDViewEngine
     */
    public doSysUIAction(tag: string, actionmode?: string): void {
        // if (Object.is(tag, 'Help')) {
        //     this.doHelp(params);
        //     return;
        // }
        if (Object.is(tag, 'Edit')) {
            this.doEdit();
            return;
        }
        // if (Object.is(tag, 'View')) {
        //     this.doView(params);
        //     return;
        // }
        // if (Object.is(tag, 'Print')) {
        //     this.doPrint(params);
        //     return;
        // }
        // if (Object.is(tag, 'ExportExcel')) {
        //     this.doExportExcel(params);
        //     return;
        // }
        // if (Object.is(tag, 'ExportModel')) {
        //     this.doExportModel(params);
        //     return;
        // }
        // if (Object.is(tag, 'Copy')) {
        //     this.doCopy(params);
        //     return;
        // }
        if (Object.is(tag, 'Remove')) {
            this.doRemove();
            return;
        }
        // if (Object.is(tag, 'Import')) {
        //     this.doImport(params);
        //     return;
        // }
        // if (Object.is(tag, 'Refresh')) {
        //     this.doRefresh(params);
        //     return;
        // }
        // if (Object.is(tag, 'NewRow')) {
        //     this.doCheck(params);
        //     return;
        // }
        if (Object.is(tag, 'SaveRow')) {
            this.doSaveEditRow();
            return;
        }
        if (Object.is(tag, 'New')) {
            this.doNew();
            return;
        }
        if (Object.is(tag, 'OpenRowEdit')) {
            this.doOpenRowEdit();
            return;
        }
        if (Object.is(tag, 'CloseRowEdit')) {
            this.doCloseRowEdit();
            return;
        }
        // if (Object.is(tag, 'ToggleRowEdit')) {
        //     this.doToggleRowEdit(params);
        //     return;
        // }
        // if (Object.is(tag, 'ToggleFilter')) {
        //     this.doToggleFilter(params);
        //     return;
        // }
        super.doSysUIAction(tag, actionmode);
    }

    /**
     * 多数据项界面_开启行编辑操作
     *
     * @memberof MDViewEngine
     */
    public doOpenRowEdit(): void {
        if (this.getMDCtrl()) {
            const tag = this.getMDCtrl().name;
            this.setViewState2({ tag: tag, action: 'openEdit', viewdata: {} });
        }
    }

    /**
     * 多数据项界面_关闭行编辑操作
     *
     * @memberof MDViewEngine
     */
    public doCloseRowEdit(): void {
        if (this.getMDCtrl()) {
            const tag = this.getMDCtrl().name;
            this.setViewState2({ tag: tag, action: 'closeEdit', viewdata: {} });
        }
    }

    /**
     * 多数据项界面_提交编辑数据操作
     *
     * @memberof MDViewEngine
     */
    public doSaveEditRow(): void {
        if (this.getMDCtrl()) {
            const tag = this.getMDCtrl().name;
            this.setViewState2({ tag: tag, action: 'submitEidt', viewdata: {} });
        }
    }

    /**
     * 多数据项界面_编辑操作
     *
     * @param {*} [params={}]
     * @returns {void}
     * @memberof MDViewEngine
     */
    public doEdit(params: any = {}): void {
        // 获取要编辑的数据集合
        if (params && params.srfkey) {
            if (this.isFunc(this.getMDCtrl().findItem)) {
                params = this.getMDCtrl().findItem('srfkey', params.srfkey);
            }
            const arg = { data: params };
            this.onEditData(arg);
            return;
        }
        if (this.isFunc(this.getMDCtrl().getSelection)) {
            const selectedData = this.getMDCtrl().getSelection();
            if (selectedData == null || selectedData.length === 0) {
                return;
            }
            this.onEditData({ data: selectedData[0] });
        }
    }

    /**
     * 编辑数据
     *
     * @param {*} arg
     * @memberof MDViewEngine
     */
    public onEditData(arg: any): void {
        const loadParam: any = {};
        // if (this.getViewParam()) {
        //     Object.assign(loadParam, this.getViewParam());
        // }
        // if (this.getParentMode()) {
        //     Object.assign(loadParam, this.getParentMode());
        // }
        // if (this.getParentData()) {
        //     Object.assign(loadParam, this.getParentData());
        // }

        if (arg.srfcopymode) {
            Object.assign(loadParam, {
                srfsourcekey: arg.data.srfkey
            });
        } else {
            Object.assign(loadParam, { srfkey: arg.data.srfkey, srfdeid: arg.data.srfdeid });
        }

        if (this.openData && this.isFunc(this.openData)) {
            this.openData([loadParam], null, null, this.getMDCtrl());
        }
    }

    /**
     * 多数据项界面_新建操作
     *
     * @param {*} [params={}]
     * @memberof MDViewEngine
     */
    public doNew(params: any = {}): void {
        this.onNewData();
    }

    /**
     * 新建数据
     *
     * @returns {void}
     * @memberof MDViewEngine
     */
    public onNewData(): void {

        // tslint:disable-next-line:prefer-const
        let loadParam: any = {};
        // if (this.getViewParam()) {
        //     Object.assign(loadParam, this.getViewParam());
        // }
        // if (this.getParentMode()) {
        //     Object.assign(loadParam, this.getParentMode());
        // }
        // if (this.getParentData()) {
        //     Object.assign(loadParam, this.getParentData());
        // }
        // if (this.isEnableRowEdit() && (this.getMDCtrl() && this.getMDCtrl().getOpenEdit())) {
        //     this.doNewRow(loadParam);
        //     return;
        // }
        // if (this.isEnableBatchAdd()) {
        //     this.doNewDataBatch(loadParam);
        //     return;
        // }
        // if (this.doNewDataWizard(loadParam)) {
        //     return;
        // }

        Object.assign(loadParam, this.view.srfparentdata);
        this.doNewDataNormal(loadParam);
    }

    /**
     * 常规新建数据
     *
     * @param {*} arg
     * @returns {*}
     * @memberof MDViewEngine
     */
    public doNewDataNormal(arg: any): any {

        // let view = this.getNewDataView(arg);
        // if (view == null) {
        //     return false;
        // }
        // const openMode = view.openMode;
        // if (!openMode || Object.is(openMode, '')) {
        //     view.openMode = 'INDEXVIEWTAB';
        // }
        // if (!view.state) {
        //     view.state = 'new';
        //     let viewParam: any = {};
        //     Object.assign(viewParam, view.viewParam);

        //     if (viewParam && viewParam.srfnewmode && !Object.is(viewParam.srfnewmode, '')) {
        //         const srfnewmode: string = viewParam.srfnewmode.split('@').join('__');
        //         view.state = view.state + '_' + srfnewmode.toLowerCase();
        //     }
        // }
        return this.openDataView(arg);
    }

    /**
     * 多数据项界面_删除操作
     *
     * @memberof MDViewEngine
     */
    public doRemove(): void {
    }


    public openDataView(view: any = {}): boolean {

        const openMode = view.openMode;

        // if (view.redirect) {
        //     this.redirectOpenView(view);
        //     return false;
        // }

        if (openMode !== undefined) {
            if (Object.is(openMode, 'POPUPMODAL')) {
                view.modal = true;
            } else if (Object.is(openMode, 'POPUP')) {
                view.modal = true;
            } else if (Object.is(openMode, '') || Object.is(openMode, 'INDEXVIEWTAB')) {
                view.modal = false;
            }
        }

        // if (view.modal) {
        //     let modalview = this.openModal(view);
        //     modalview.subscribe((result: any) => {
        //         if (result && Object.is(result.ret, 'OK')) {
        //             this.onRefresh();
        //         }
        //     });
        //     return true;
        // } 
        // else {
        //     this.openWindow(view.viewurl, view.viewparam);
        // }

        if (this.newData && this.isFunc(this.newData)) {
            this.newData([], null, null, this.getMDCtrl());
        }

        return true;
    }

    /**
     * 选中变化
     *
     * @param {any[]} args
     * @memberof MDViewEngine
     */
    public selectionChange(args: any[]): void {
        if (this.view) {
            this.view.$emit('viewdataschange', args);
        }
        if (this.getPropertyPanel()) {
            const tag = this.getPropertyPanel().name;
            this.setViewState2({ tag: tag, action: 'load', viewdata: args[0] });
        }
        const state = args.length > 0 && !Object.is(args[0].srfkey, '') ? false : true;
        this.calcToolbarItemState(state);
    }

    /**
     * 多数据部件加载完成
     *
     * @param {any[]} args
     * @memberof MDViewEngine
     */
    public MDCtrlLoad(args: any[]) {
        if (this.view) {
            this.view.$emit('viewload', args);
        }
        this.calcToolbarItemState(true);
    }

    /**
     * 多数据部件加载之前
     *
     * @param {*} [arg={}]
     * @memberof MDViewEngine
     */
    public MDCtrlBeforeLoad(arg: any = {}): void {
        if (this.viewdata.srfparentdata && Object.keys(this.viewdata.srfparentdata).length > 0) {
            Object.assign(arg, { srfparentdata: this.viewdata.srfparentdata });
        }
        if (this.getSearchForm()) {
            Object.assign(arg, this.getSearchForm().getData());
        }
        if (this.view && !this.view.isExpandSearchForm) {
            Object.assign(arg, { query: this.view.query });
        }
        //表格填充params和query中n_开始的过滤参数
        if (this.view && this.view.$route) {
            const router = this.view.$route;
            if(router.params){
                const keys: string[] = Object.keys(router.params);
                keys.forEach((key: string) => {
                    if (key.indexOf('n_') == 0) {
                        arg[key] = router.params[key];
                    }
                });
            }
            if(router.query){
                const keys: string[] = Object.keys(router.query);
                keys.forEach((key: string) => {
                    if (key.indexOf('n_') == 0) {
                        arg[key] = router.query[key];
                    }
                });
            }
        }
    }

    /**
     * 获取多数据部件
     *
     * @returns {*}
     * @memberof MDViewEngine
     */
    public getMDCtrl(): any {

    }

    public getSearchForm(): any {
        return this.searchForm;
    }

    /**
     * 获取属性面板
     *
     * @returns
     * @memberof MDViewEngine
     */
    public getPropertyPanel() {
        return this.propertypanel;
    }

}