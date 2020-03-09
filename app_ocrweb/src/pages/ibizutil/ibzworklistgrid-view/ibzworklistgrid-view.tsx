import { Vue, Component, Prop, Provide, Emit, Watch } from 'vue-property-decorator';
import { Subject } from 'rxjs';
import { CreateElement } from 'vue';
import './ibzworklistgrid-view.less';

import GridViewEngine from '@engine/view/grid-view-engine';

import view_grid from '@widget/ibzworklist/main-grid/main-grid';
import view_searchform from '@widget/ibzworklist/default-searchform/default-searchform';

@Component({
    components: {
        view_grid, 
        view_searchform, 
    },
    beforeRouteEnter: (to: any, from: any, next: any) => {
        next((vm: any) => {
            vm.$store.commit('addCurPageViewtag', { fullPath: to.fullPath, viewtag: vm.viewtag });
        });
    },
})
export default class IBZWorklistGridView extends Vue {

    /**
     * 数据变化
     *
     * @param {*} val
     * @returns {*}
     * @memberof WorklistGridView
     */
    @Emit() 
    public viewDatasChange(val: any):any {
        return val;
    }

    /**
     * 数据视图
     *
     * @type {string}
     * @memberof WorklistGridView
     */
    @Prop() public viewdata!: string;

	/**
	 * 视图标识
	 *
	 * @type {string}
	 * @memberof AppDashboardView
	 */
	public viewtag: string = '184e9cd5e39ff4108d9bc5472938ce2a';

    /**
     * 父数据对象
     *
     * @protected
     * @type {*}
     * @memberof WorklistGridView
     */
    protected srfparentdata: any = {};

    /**
     * 视图模型数据
     *
     * @type {*}
     * @memberof WorklistGridView
     */
    public model: any = {
        srfTitle: '待办工作表格视图',
        srfCaption: '待办任务',
        srfSubCaption: '',
        dataInfo: ''
    }

    /**
     * 处理值变化
     *
     * @param {*} newVal
     * @param {*} oldVal
     * @memberof WorklistGridView
     */
    @Watch('viewdata')
    onViewData(newVal: any, oldVal: any) {
        const _this: any = this;
        if (!Object.is(newVal, oldVal) && _this.engine) {
            _this.engine.setViewData(newVal);
            _this.engine.load();
        }
    }

    /**
     * 容器模型
     *
     * @type {*}
     * @memberof WorklistGridView
     */
    public containerModel: any = {
        view_toolbar: { name: 'toolbar', type: 'TOOLBAR' },
        view_grid: { name: 'grid', type: 'GRID' },
        view_searchform: { name: 'searchform', type: 'SEARCHFORM' },
    };

    /**
     * 视图状态订阅对象
     *
     * @private
     * @type {Subject<{action: string, data: any}>}
     * @memberof WorklistGridView
     */
    public viewState: Subject<ViewState> = new Subject();

    /**
     * 工具栏模型
     *
     * @type {*}
     * @memberof WorklistGridView
     */
    public toolBarModels: any = {
        tbitem5: { name: 'tbitem5', caption: '查看', disabled: false, type: 'DEUIACTION', visabled: true, dataaccaction: '', uiaction: { tag: 'View', target: 'SINGLEKEY' } },

        tbitem7: {  name: 'tbitem7', type: 'SEPERATOR', visabled: true, dataaccaction: '', uiaction: { } },
        tbitem13: { name: 'tbitem13', caption: '导出', disabled: false, type: 'DEUIACTION', visabled: true, dataaccaction: '', uiaction: { tag: 'ExportExcel', target: '' }, MaxRowCount: 1000  },

        tbitem10: {  name: 'tbitem10', type: 'SEPERATOR', visabled: true, dataaccaction: '', uiaction: { } },
        tbitem16: { name: 'tbitem16', caption: '其它', disabled: false, type: 'ITEMS', visabled: true, dataaccaction: '', uiaction: { } }, 
 tbitem21: { name: 'tbitem21', caption: '导出数据模型', disabled: false, type: 'DEUIACTION', visabled: true, dataaccaction: '', uiaction: { tag: 'ExportModel', target: '' } },

 tbitem23: { name: 'tbitem23', caption: '数据导入', disabled: false, type: 'DEUIACTION', visabled: true, dataaccaction: '', uiaction: { tag: 'Import', target: '' } },


        tbitem17: {  name: 'tbitem17', type: 'SEPERATOR', visabled: true, dataaccaction: '', uiaction: { } },
        tbitem19: { name: 'tbitem19', caption: '过滤', disabled: false, type: 'DEUIACTION', visabled: true, dataaccaction: '', uiaction: { tag: 'ToggleFilter', target: '' } },

        tbitem18: { name: 'tbitem18', caption: '帮助', disabled: false, type: 'DEUIACTION', visabled: true, dataaccaction: '', uiaction: { tag: 'Help', target: '' } },

    };



    /**
     * 视图引擎
     *
     * @private
     * @type {Engine}
     * @memberof WorklistGridView
     */
    private engine: GridViewEngine = new GridViewEngine();

    /**
     * 引擎初始化
     *
     * @private
     * @memberof WorklistGridView
     */
    private engineInit(): void {
        this.engine.init({
            view: this,
            opendata: (args: any[], params?: any, $event?: any, xData?: any) => {
                this.opendata(args, params, $event, xData);
            },
            grid: this.$refs.grid,
            searchform: this.$refs.searchform,
            isLoadDefault: true,
        });
    }

    /**
     * Vue声明周期
     *
     * @memberof WorklistGridView
     */
    public created() {
        const secondtag = this.$util.createUUID();
        this.$store.commit('viewaction/createdView', { viewtag: this.viewtag, secondtag: secondtag });
        this.viewtag = secondtag;
        
    }

    /**
     * 销毁之前
     *
     * @memberof WorklistGridView
     */
    public beforeDestroy() {
        this.$store.commit('viewaction/removeView', this.viewtag);
    }

    /**
     * Vue声明周期(组件初始化完毕)
     *
     * @memberof WorklistGridView
     */
    public mounted() {
        const _this: any = this;
        _this.engineInit();
        if (_this.loadModel && _this.loadModel instanceof Function) {
            _this.loadModel();
        }
        
    }


    /**
     * toolbar 部件 click 事件
     *
     * @param {*} [args={}]
     * @param {*} $event
     * @memberof WorklistGridView
     */
    public toolbar_click($event: any, $event2?: any) {
        if (Object.is($event.tag, 'tbitem3')) {
            this.toolbar_tbitem3_click($event, '', $event2);
        }
        if (Object.is($event.tag, 'tbitem4')) {
            this.toolbar_tbitem4_click($event, '', $event2);
        }
        if (Object.is($event.tag, 'tbitem5')) {
            this.toolbar_tbitem5_click($event, '', $event2);
        }
        if (Object.is($event.tag, 'tbitem6')) {
            this.toolbar_tbitem6_click($event, '', $event2);
        }
        if (Object.is($event.tag, 'tbitem24')) {
            this.toolbar_tbitem24_click($event, '', $event2);
        }
        if (Object.is($event.tag, 'tbitem25')) {
            this.toolbar_tbitem25_click($event, '', $event2);
        }
        if (Object.is($event.tag, 'tbitem8')) {
            this.toolbar_tbitem8_click($event, '', $event2);
        }
        if (Object.is($event.tag, 'tbitem13')) {
            this.toolbar_tbitem13_click($event, '', $event2);
        }
        if (Object.is($event.tag, 'tbitem11')) {
            this.toolbar_tbitem11_click($event, '', $event2);
        }
        if (Object.is($event.tag, 'tbitem21')) {
            this.toolbar_tbitem21_click($event, '', $event2);
        }
        if (Object.is($event.tag, 'tbitem23')) {
            this.toolbar_tbitem23_click($event, '', $event2);
        }
        if (Object.is($event.tag, 'tbitem19')) {
            this.toolbar_tbitem19_click($event, '', $event2);
        }
        if (Object.is($event.tag, 'tbitem18')) {
            this.toolbar_tbitem18_click($event, '', $event2);
        }
    }


    /**
     * grid 部件 selectionchange 事件
     *
     * @param {*} [args={}]
     * @param {*} $event
     * @memberof WorklistGridView
     */
    public grid_selectionchange($event: any, $event2?: any) {
        this.engine.onCtrlEvent('grid', 'selectionchange', $event);
    }


    /**
     * grid 部件 beforeload 事件
     *
     * @param {*} [args={}]
     * @param {*} $event
     * @memberof WorklistGridView
     */
    public grid_beforeload($event: any, $event2?: any) {
        this.engine.onCtrlEvent('grid', 'beforeload', $event);
    }


    /**
     * grid 部件 rowdblclick 事件
     *
     * @param {*} [args={}]
     * @param {*} $event
     * @memberof WorklistGridView
     */
    public grid_rowdblclick($event: any, $event2?: any) {
        this.engine.onCtrlEvent('grid', 'rowdblclick', $event);
    }


    /**
     * grid 部件 remove 事件
     *
     * @param {*} [args={}]
     * @param {*} $event
     * @memberof WorklistGridView
     */
    public grid_remove($event: any, $event2?: any) {
        this.engine.onCtrlEvent('grid', 'remove', $event);
    }


    /**
     * grid 部件 load 事件
     *
     * @param {*} [args={}]
     * @param {*} $event
     * @memberof WorklistGridView
     */
    public grid_load($event: any, $event2?: any) {
        this.engine.onCtrlEvent('grid', 'load', $event);
    }


    /**
     * searchform 部件 save 事件
     *
     * @param {*} [args={}]
     * @param {*} $event
     * @memberof WorklistGridView
     */
    public searchform_save($event: any, $event2?: any) {
        this.engine.onCtrlEvent('searchform', 'save', $event);
    }


    /**
     * searchform 部件 search 事件
     *
     * @param {*} [args={}]
     * @param {*} $event
     * @memberof WorklistGridView
     */
    public searchform_search($event: any, $event2?: any) {
        this.engine.onCtrlEvent('searchform', 'search', $event);
    }


    /**
     * searchform 部件 load 事件
     *
     * @param {*} [args={}]
     * @param {*} $event
     * @memberof WorklistGridView
     */
    public searchform_load($event: any, $event2?: any) {
        this.engine.onCtrlEvent('searchform', 'load', $event);
    }



    /**
     * 逻辑事件
     *
     * @param {*} [params={}]
     * @param {*} [tag]
     * @param {*} [$event]
     * @memberof 
     */
    public toolbar_tbitem3_click(params: any = {}, tag?: any, $event?: any) {
        // 参数

        // 取数
        let datas: any[] = [];
        let xData: any = null;
        // _this 指向容器对象
        const _this: any = this;
        const paramJO = {};
        xData = this.$refs.grid;
        if (xData.getDatas && xData.getDatas instanceof Function) {
            datas = [...xData.getDatas()];
        }

        // 界面行为
        this.New(datas, paramJO,  $event, xData);
    }

    /**
     * 逻辑事件
     *
     * @param {*} [params={}]
     * @param {*} [tag]
     * @param {*} [$event]
     * @memberof 
     */
    public toolbar_tbitem4_click(params: any = {}, tag?: any, $event?: any) {
        // 参数

        // 取数
        let datas: any[] = [];
        let xData: any = null;
        // _this 指向容器对象
        const _this: any = this;
        const paramJO = {};
        xData = this.$refs.grid;
        if (xData.getDatas && xData.getDatas instanceof Function) {
            datas = [...xData.getDatas()];
        }

        // 界面行为
        this.Edit(datas, paramJO,  $event, xData);
    }

    /**
     * 逻辑事件
     *
     * @param {*} [params={}]
     * @param {*} [tag]
     * @param {*} [$event]
     * @memberof 
     */
    public toolbar_tbitem5_click(params: any = {}, tag?: any, $event?: any) {
        // 参数

        // 取数
        let datas: any[] = [];
        let xData: any = null;
        // _this 指向容器对象
        const _this: any = this;
        const paramJO = {};
        xData = this.$refs.grid;
        if (xData.getDatas && xData.getDatas instanceof Function) {
            datas = [...xData.getDatas()];
        }

        // 界面行为
        this.View(datas, paramJO,  $event, xData);
    }

    /**
     * 逻辑事件
     *
     * @param {*} [params={}]
     * @param {*} [tag]
     * @param {*} [$event]
     * @memberof 
     */
    public toolbar_tbitem6_click(params: any = {}, tag?: any, $event?: any) {
        // 参数

        // 取数
        let datas: any[] = [];
        let xData: any = null;
        // _this 指向容器对象
        const _this: any = this;
        const paramJO = {};
        xData = this.$refs.grid;
        if (xData.getDatas && xData.getDatas instanceof Function) {
            datas = [...xData.getDatas()];
        }

        // 界面行为
        this.Copy(datas, paramJO,  $event, xData);
    }

    /**
     * 逻辑事件
     *
     * @param {*} [params={}]
     * @param {*} [tag]
     * @param {*} [$event]
     * @memberof 
     */
    public toolbar_tbitem24_click(params: any = {}, tag?: any, $event?: any) {
        // 参数

        // 取数
        let datas: any[] = [];
        let xData: any = null;
        // _this 指向容器对象
        const _this: any = this;
        const paramJO = {};
        xData = this.$refs.grid;
        if (xData.getDatas && xData.getDatas instanceof Function) {
            datas = [...xData.getDatas()];
        }

        // 界面行为
        this.ToggleRowEdit(datas, paramJO,  $event, xData);
    }

    /**
     * 逻辑事件
     *
     * @param {*} [params={}]
     * @param {*} [tag]
     * @param {*} [$event]
     * @memberof 
     */
    public toolbar_tbitem25_click(params: any = {}, tag?: any, $event?: any) {
        // 参数

        // 取数
        let datas: any[] = [];
        let xData: any = null;
        // _this 指向容器对象
        const _this: any = this;
        const paramJO = {};
        xData = this.$refs.grid;
        if (xData.getDatas && xData.getDatas instanceof Function) {
            datas = [...xData.getDatas()];
        }

        // 界面行为
        this.NewRow(datas, paramJO,  $event, xData);
    }

    /**
     * 逻辑事件
     *
     * @param {*} [params={}]
     * @param {*} [tag]
     * @param {*} [$event]
     * @memberof 
     */
    public toolbar_tbitem8_click(params: any = {}, tag?: any, $event?: any) {
        // 参数

        // 取数
        let datas: any[] = [];
        let xData: any = null;
        // _this 指向容器对象
        const _this: any = this;
        const paramJO = {};
        xData = this.$refs.grid;
        if (xData.getDatas && xData.getDatas instanceof Function) {
            datas = [...xData.getDatas()];
        }

        // 界面行为
        this.Remove(datas, paramJO,  $event, xData);
    }

    /**
     * 逻辑事件
     *
     * @param {*} [params={}]
     * @param {*} [tag]
     * @param {*} [$event]
     * @memberof 
     */
    public toolbar_tbitem13_click(params: any = {}, tag?: any, $event?: any) {
        // 参数

        // 取数
        let datas: any[] = [];
        let xData: any = null;
        // _this 指向容器对象
        const _this: any = this;
        const paramJO = {};
        xData = this.$refs.grid;
        if (xData.getDatas && xData.getDatas instanceof Function) {
            datas = [...xData.getDatas()];
        }

        // 界面行为
        this.ExportExcel(datas, paramJO,  $event, xData);
    }

    /**
     * 逻辑事件
     *
     * @param {*} [params={}]
     * @param {*} [tag]
     * @param {*} [$event]
     * @memberof 
     */
    public toolbar_tbitem11_click(params: any = {}, tag?: any, $event?: any) {
        // 参数

        // 取数
        let datas: any[] = [];
        let xData: any = null;
        // _this 指向容器对象
        const _this: any = this;
        const paramJO = {};
        xData = this.$refs.grid;
        if (xData.getDatas && xData.getDatas instanceof Function) {
            datas = [...xData.getDatas()];
        }

        // 界面行为
        this.Print(datas, paramJO,  $event, xData);
    }

    /**
     * 逻辑事件
     *
     * @param {*} [params={}]
     * @param {*} [tag]
     * @param {*} [$event]
     * @memberof 
     */
    public toolbar_tbitem21_click(params: any = {}, tag?: any, $event?: any) {
        // 参数

        // 取数
        let datas: any[] = [];
        let xData: any = null;
        // _this 指向容器对象
        const _this: any = this;
        const paramJO = {};
        xData = this.$refs.grid;
        if (xData.getDatas && xData.getDatas instanceof Function) {
            datas = [...xData.getDatas()];
        }

        // 界面行为
        this.ExportModel(datas, paramJO,  $event, xData);
    }

    /**
     * 逻辑事件
     *
     * @param {*} [params={}]
     * @param {*} [tag]
     * @param {*} [$event]
     * @memberof 
     */
    public toolbar_tbitem23_click(params: any = {}, tag?: any, $event?: any) {
        // 参数

        // 取数
        let datas: any[] = [];
        let xData: any = null;
        // _this 指向容器对象
        const _this: any = this;
        const paramJO = {};
        xData = this.$refs.grid;
        if (xData.getDatas && xData.getDatas instanceof Function) {
            datas = [...xData.getDatas()];
        }

        // 界面行为
        this.Import(datas, paramJO,  $event, xData);
    }

    /**
     * 逻辑事件
     *
     * @param {*} [params={}]
     * @param {*} [tag]
     * @param {*} [$event]
     * @memberof 
     */
    public toolbar_tbitem19_click(params: any = {}, tag?: any, $event?: any) {
        // 参数

        // 取数
        let datas: any[] = [];
        let xData: any = null;
        // _this 指向容器对象
        const _this: any = this;
        const paramJO = {};
        xData = this.$refs.grid;
        if (xData.getDatas && xData.getDatas instanceof Function) {
            datas = [...xData.getDatas()];
        }

        // 界面行为
        this.ToggleFilter(datas, paramJO,  $event, xData);
    }

    /**
     * 逻辑事件
     *
     * @param {*} [params={}]
     * @param {*} [tag]
     * @param {*} [$event]
     * @memberof 
     */
    public toolbar_tbitem18_click(params: any = {}, tag?: any, $event?: any) {
        // 参数

        // 取数
        let datas: any[] = [];
        let xData: any = null;
        // _this 指向容器对象
        const _this: any = this;
        const paramJO = {};
        xData = this.$refs.grid;
        if (xData.getDatas && xData.getDatas instanceof Function) {
            datas = [...xData.getDatas()];
        }

        // 界面行为
        this.Help(datas, paramJO,  $event, xData);
    }

    /**
     * 打开编辑数据视图
     *
     * @param {any[]} args
     * @param {*} [params]
     * @param {*} [$event]
     * @param {*} [xData]
     * @memberof WorklistGridView
     */
    public opendata(args: any[], params?: any, $event?: any, xData?: any) {
        const data: any = { srfkey: args[0].srfkey, srfsourcekey: args[0].srfsourcekey };
        // 打开顶级分页视图
        const openIndexViewTab = (viewpath: string, data: any) => {
            const _params = this.$util.prepareRouteParmas({
                route: this.$route,
                sourceNode: this.$route.name,
                targetNode: viewpath,
                data: data,
            });
            this.$router.push({ name: viewpath, params: _params });
        }
        // 打开模态
        const openPopupModal = (view: any, data: any) => {
            let container: Subject<any> = this.$appmodal.openModal(view, data);
            container.subscribe((result: any) => {
                if (!result || !Object.is(result.ret, 'OK')) {
                    return;
                }
                if (!xData || !(xData.refresh instanceof Function)) {
                    return;
                }
                xData.refresh(result.datas);
            });
        }
        // 打开抽屉
        const openDrawer = (view: any, data: any) => {
            let container: Subject<any> = this.$appdrawer.openDrawer(view, data);
            container.subscribe((result: any) => {
                if (!result || !Object.is(result.ret, 'OK')) {
                    return;
                }
                if (!xData || !(xData.refresh instanceof Function)) {
                    return;
                }
                xData.refresh(result.datas);
            });
        }
        // 打开气泡卡片
        const openPopOver = (view: any, data: any) => {
            let container: Subject<any> = this.$apppopover.openPop($event, view, data);
            container.subscribe((result: any) => {
                if (!result || !Object.is(result.ret, 'OK')) {
                    return;
                }
                if (!xData || !(xData.refresh instanceof Function)) {
                    return;
                }
                xData.refresh(result.datas);
            });
        }
        // 打开独立程序弹出 
        const openPopupApp = (url: string) => {
            window.open(url, '_blank');
        }
        const url: string = 'ocrweb/ibizutil/worklist/redirectview/getmodel';
        this.$http.get(url, data).then((response: any) => {
            if (!response || response.status !== 200) {
                this.$Notice.error({ title: '错误', desc: '请求异常' });
            }
            if (response.status === 401) {
                return;
            }
            const { data: result } = response;
            if (!result) {
                return;
            }

            const _this: any = this;
            if (_this.srfparentdata) {
                if (Object.is(result.openmode, 'INDEXVIEWTAB') || Object.is(result.openmode, '')) {
                    Object.assign(data, _this.srfparentdata);
                } else {
                    Object.assign(data, { srfparentdata: _this.srfparentdata });
                }
            }

            if (result.viewparams && Object.keys(result.viewparams)) {
                Object.assign(data, result.viewparams);
            }

            if (Object.is(result.openmode, 'POPUPAPP') && result.url && !Object.is(result.url, '')) {
                openPopupApp(result.url);
            } else if (Object.is(result.openmode, 'INDEXVIEWTAB') || Object.is(result.openmode, '')) {
                const viewpath = `${result.viewmodule}_${result.viewname}`.toLowerCase();
                openIndexViewTab(viewpath, data);
            } else if (Object.is(result.openmode, 'POPUPMODAL')) {
                const viewname = this.$util.srfFilePath2(result.viewname);
                const view: any = {
                    viewname: viewname,
                    title: result.title,
                    width: result.width,
                    height: result.height,
                }
                openPopupModal(view, data);
            } else if (result.openmode.startsWith('DRAWER')) {
                const viewname = this.$util.srfFilePath2(result.viewname);
                const view: any = {
                    viewname: viewname,
                    title: result.title,
                    width: result.width,
                    height: result.height,
                    placement: result.openmode,
                }
                openDrawer(view, data);
            } else if (Object.is(result.openmode, 'POPOVER')) {
                const viewname = this.$util.srfFilePath2(result.viewname);
                const view: any = {
                    viewname: viewname,
                    title: result.title,
                    width: result.width,
                    height: result.height,
                    placement: result.openmode,
                }
                openPopOver(view, data);
            }  
        }).catch((response: any) => {
            if (!response || !response.status || !response.data) {
                this.$Notice.error({ title: '错误', desc: '系统异常！' });
                return;
            }
            if (response.status === 401) {
                return;
            }
            const { data: _data } = response;
            this.$Notice.error({ title: _data.title, desc: _data.message });
        })
    }



    /**
     * 新建
     *
     * @param {any[]} args
     * @param {*} [params]
     * @param {*} [$event]
     * @param {*} [xData]
     * @memberof WorklistGridView
     */
    public New(args: any[], params?: any, $event?: any, xData?: any) {
         const _this: any = this;
        if (_this.newdata && _this.newdata instanceof Function) {
            const data: any = {};
            if (_this.srfparentdata) {
                Object.assign(data, _this.srfparentdata);
            }
            _this.newdata([{ ...data }], params, $event, xData);
        } else {
            _this.$Notice.error({ title: '错误', desc: 'newdata 视图处理逻辑不存在，请添加!' });
        }
    }

    /**
     * 编辑
     *
     * @param {any[]} args
     * @param {*} [params]
     * @param {*} [$event]
     * @param {*} [xData]
     * @memberof WorklistGridView
     */
    public Edit(args: any[], params?: any, $event?: any, xData?: any) {
        if (args.length === 0) {
            return;
        }
        const _this: any = this;
        if (_this.opendata && _this.opendata instanceof Function) {
            const data: any = { };
            if (args.length > 0) {
                Object.assign(data, { srfkey: args[0].srfkey })
            }
            if (_this.srfparentdata) {
                Object.assign(data, _this.srfparentdata);
            }
            _this.opendata([{ ...data }], params, $event, xData);
        } else {
            _this.$Notice.error({ title: '错误', desc: 'opendata 视图处理逻辑不存在，请添加!' });
        }
    }

    /**
     * 查看
     *
     * @param {any[]} args
     * @param {*} [params]
     * @param {*} [$event]
     * @param {*} [xData]
     * @memberof WorklistGridView
     */
    public View(args: any[], params?: any, $event?: any, xData?: any) {
        if (args.length === 0) {
            return;
        }
        const _this: any = this;
        if (_this.opendata && _this.opendata instanceof Function) {
            const data: any = { };
            if (args.length > 0) {
                Object.assign(data, { srfkey: args[0].srfkey })
            }
            if (_this.srfparentdata) {
                Object.assign(data, _this.srfparentdata);
            }
            _this.opendata([{ ...data }], params, $event, xData);
        } else {
            _this.$Notice.error({ title: '错误', desc: 'opendata 视图处理逻辑不存在，请添加!' });
        }
    }

    /**
     * 拷贝
     *
     * @param {any[]} args
     * @param {*} [params]
     * @param {*} [$event]
     * @param {*} [xData]
     * @memberof WorklistGridView
     */
    public Copy(args: any[], params?: any, $event?: any, xData?: any) {
        if (args.length === 0) {
            return;
        }
        const _this: any = this;
        if (_this.newdata && _this.newdata instanceof Function) {
            const data: any = {};
            if (args.length > 0) {
                Object.assign(data, { srfsourcekey: args[0].srfkey })
            }
            if (_this.srfparentdata) {
                Object.assign(data, _this.srfparentdata);
            }
            _this.newdata([{ ...data }], params, $event, xData);
        } else if (xData && xData.copy instanceof Function) {
            const data2: any = {};
            if (args.length > 0) {
                Object.assign(data2, { srfsourcekey: args[0].srfkey })
            }
            if (_this.srfparentdata) {
                Object.assign(data2, _this.srfparentdata);
            }
            xData.copy(data2);
        } else {
            _this.$Notice.error({ title: '错误', desc: 'opendata 视图处理逻辑不存在，请添加!' });
        }
    }

    /**
     * 行编辑
     *
     * @param {any[]} args
     * @param {*} [params]
     * @param {*} [$event]
     * @param {*} [xData]
     * @memberof WorklistGridView
     */
    public ToggleRowEdit(args: any[], params?: any, $event?: any, xData?: any) {

    }

    /**
     * 新建行
     *
     * @param {any[]} args
     * @param {*} [params]
     * @param {*} [$event]
     * @param {*} [xData]
     * @memberof WorklistGridView
     */
    public NewRow(args: any[], params?: any, $event?: any, xData?: any) {

    }

    /**
     * 删除
     *
     * @param {any[]} args
     * @param {*} [params]
     * @param {*} [$event]
     * @param {*} [xData]
     * @memberof WorklistGridView
     */
    public Remove(args: any[], params?: any, $event?: any, xData?: any) {
        const _this: any = this;
        if (!xData || !(xData.remove instanceof Function)) {
            return ;
        }
        xData.remove(args);
    }


    /**
     * 导出
     *
     * @param {any[]} args
     * @param {*} [params]
     * @param {*} [$event]
     * @param {*} [xData]
     * @memberof WorklistGridView
     */
    public ExportExcel(args: any[], params?: any, $event?: any, xData?: any) {
        const _this: any = this;
        if (!xData || !(xData.exportExcel instanceof Function) || !$event) {
            return ;
        }
        xData.exportExcel($event.exportparms);
    }

    /**
     * 打印
     *
     * @param {any[]} args
     * @param {*} [params]
     * @param {*} [$event]
     * @param {*} [xData]
     * @memberof WorklistGridView
     */
    public Print(args: any[], params?: any, $event?: any, xData?: any) {

    }

    /**
     * 导出数据模型
     *
     * @param {any[]} args
     * @param {*} [params]
     * @param {*} [$event]
     * @param {*} [xData]
     * @memberof WorklistGridView
     */
    public ExportModel(args: any[], params?: any, $event?: any, xData?: any) {
        const _this: any = this;
        if (!xData || !(xData.exportModel instanceof Function)) {
            return ;
        }
        xData.exportModel(args);
    }

    /**
     * 数据导入
     *
     * @param {any[]} args
     * @param {*} [params]
     * @param {*} [$event]
     * @param {*} [xData]
     * @memberof WorklistGridView
     */
    public Import(args: any[], params?: any, $event?: any, xData?: any) {
        const _this: any = this;
        if (!xData || !(xData.import instanceof Function)) {
            return ;
        }
        xData.import(args);
    }

    /**
     * 过滤
     *
     * @param {any[]} args
     * @param {*} [params]
     * @param {*} [$event]
     * @param {*} [xData]
     * @memberof WorklistGridView
     */
    public ToggleFilter(args: any[], params?: any, $event?: any, xData?: any) {
        const _this: any = this;
        if (_this.hasOwnProperty('isExpandSearchForm')) {
            _this.isExpandSearchForm = !_this.isExpandSearchForm;
        }
    }

    /**
     * 帮助
     *
     * @param {any[]} args
     * @param {*} [params]
     * @param {*} [$event]
     * @param {*} [xData]
     * @memberof WorklistGridView
     */
    public Help(args: any[], params?: any, $event?: any, xData?: any) {

    }

    /**
     * 关闭视图
     *
     * @param {any[]} args
     * @memberof WorklistGridView
     */
    public closeView(args: any[]): void {
        let _view: any = this;
        if (_view.viewdata) {
            _view.$emit('viewdataschange', args);
            _view.$emit('close');
        } else if (_view.$tabPageExp) {
            _view.$tabPageExp.onClose(_view.$route.fullPath);
        }
    }

    /**
     * 是否单选
     *
     * @type {boolean}
     * @memberof WorklistGridView
     */
    public isSingleSelect: boolean = false;

    /**
     * 搜索值
     *
     * @type {string}
     * @memberof WorklistGridView
     */
    public query: string = '';

    /**
     * 是否展开搜索表单
     *
     * @type {boolean}
     * @memberof WorklistGridView
     */
    public isExpandSearchForm: boolean = false;

    /**
     * 表格行数据默认激活模式
     * 0 不激活
     * 1 单击激活
     * 2 双击激活
     *
     * @type {(number | 0 | 1 | 2)}
     * @memberof WorklistGridView
     */
    public gridRowActiveMode: number | 0 | 1 | 2 = 2;

    /**
     * 快速搜索
     *
     * @param {*} $event
     * @memberof WorklistGridView
     */
    public onSearch($event: any): void {
        const grid: any = this.$refs.grid;
        if (grid) {
            grid.load({});
        }
    }

    /**
     * 刷新数据
     *
     * @readonly
     * @type {(number | null)}
     * @memberof WorklistGridView
     */
    get refreshdata(): number | null {
        return this.$store.getters['viewaction/getRefreshData'](this.viewtag);
    }

    /**
     * 监控数据变化
     *
     * @param {*} newVal
     * @param {*} oldVal
     * @returns
     * @memberof WorklistGridView
     */
    @Watch('refreshdata')
    onRefreshData(newVal: any, oldVal: any) {
        if (newVal === null || newVal === undefined) {
            return;
        }
        if (newVal === 0) {
            return;
        }
        const grid: any = this.$refs.grid;
        if (grid) {
            grid.load({});
        }
    }


    /**
     * 绘制视图消息 （上方）
     *
     * @returns
     * @memberof WorklistGridView
     */
    public renderPosTopMsgs() {
        return (
            <div class='view-top-messages'>
            </div>
        );
    }

    /**
     * 绘制视图消息 （下方）
     *
     * @returns
     * @memberof WorklistGridView
     */
    public renderPosBottomMsgs() {
        return (
            <div class='view-bottom-messages'>
            </div>
        );
    }
    
    /**
     * 绘制内容
     *
     * @param {CreateElement} h
     * @returns
     * @memberof WorklistGridView
     */
    public render(h: CreateElement) {
        return (
        <div class='view-container worklist-grid-view'>
            <card class='view-card'  dis-hover={true} bordered={false}>
        
        <p slot='title'>
            <span class='caption-info'>{this.$t(this.model.srfCaption)}</span>
        </p>
        
        
                <div class='content-container'>
                    {this.renderPosTopMsgs()}
        
        <row style='margin-bottom: 6px;'>
            <i-input v-show={!this.isExpandSearchForm} v-model={this.query} search enter-button on-on-search={($event: any) => this.onSearch($event)} class='pull-left' style='max-width: 400px;margin-top:6px;' />
            <div class='pull-right'>
                <div class='toolbar-container'>
                        <tooltip transfer={true} max-width={600}>
                    <i-button v-show={this.toolBarModels.tbitem5.visabled} disabled={this.toolBarModels.tbitem5.disabled} class='' on-click={($event: any) => this.toolbar_click({ tag: 'tbitem5' }, $event)}>
                        <i class='fa fa-edit'></i>
                        <span class='caption'>{this.toolBarModels.tbitem5.caption}</span>
                    </i-button>
                    <div slot='content'>{this.toolBarModels.tbitem5.tip}</div>
                </tooltip>
                
                
                    <span class='seperator'>|</span>
                    <tooltip transfer={true} max-width={600}>
                    <app-export-excel item={this.toolBarModels.tbitem13} on-exportexcel={($event:any) => this.toolbar_click({ tag: 'tbitem13' }, $event)}></app-export-excel>
                    <div slot='content'>{this.toolBarModels.tbitem13.tip}</div>
                </tooltip>
                
                
                    <span class='seperator'>|</span>
                    <dropdown v-show={this.toolBarModels.tbitem16.visabled} trigger='click'>
                    <tooltip transfer={true} max-width={600}>
                        <i-button class=''>
                            <i class=''></i>
                            <span class='caption'>{this.toolBarModels.tbitem16.caption}</span>
                            <icon type="ios-arrow-down"></icon>
                        </i-button>
                        <div slot='content'>{this.toolBarModels.tbitem16.tip}</div>
                    </tooltip>
                    <dropdown-menu slot='list'>
                        <dropdown-item>
                            <tooltip transfer={true} max-width={600}>
                    <i-button v-show={this.toolBarModels.tbitem21.visabled} disabled={this.toolBarModels.tbitem21.disabled} class='' on-click={($event: any) => this.toolbar_click({ tag: 'tbitem21' }, $event)}>
                        <i class='fa fa-download'></i>
                        <span class='caption'>{this.toolBarModels.tbitem21.caption}</span>
                    </i-button>
                    <div slot='content'>{this.toolBarModels.tbitem21.tip}</div>
                </tooltip>
                
                
                        </dropdown-item>
                        <dropdown-item>
                            <tooltip transfer={true} max-width={600}>
                    <i-button v-show={this.toolBarModels.tbitem23.visabled} disabled={this.toolBarModels.tbitem23.disabled} class='' on-click={($event: any) => this.toolbar_click({ tag: 'tbitem23' }, $event)}>
                        <i class='fa fa-upload'></i>
                        <span class='caption'>{this.toolBarModels.tbitem23.caption}</span>
                    </i-button>
                    <div slot='content'>{this.toolBarModels.tbitem23.tip}</div>
                </tooltip>
                
                
                        </dropdown-item>
                    </dropdown-menu>
                </dropdown>
                    <span class='seperator'>|</span>
                    <tooltip transfer={true} max-width={600}>
                    <i-button v-show={this.toolBarModels.tbitem19.visabled} disabled={this.toolBarModels.tbitem19.disabled} class='' on-click={($event: any) => this.toolbar_click({ tag: 'tbitem19' }, $event)}>
                        <i class='fa fa-filter'></i>
                        <span class='caption'>{this.toolBarModels.tbitem19.caption}</span>
                    </i-button>
                    <div slot='content'>{this.toolBarModels.tbitem19.tip}</div>
                </tooltip>
                
                
                    <tooltip transfer={true} max-width={600}>
                    <i-button v-show={this.toolBarModels.tbitem18.visabled} disabled={this.toolBarModels.tbitem18.disabled} class='' on-click={($event: any) => this.toolbar_click({ tag: 'tbitem18' }, $event)}>
                        <i class='fa fa-question'></i>
                        <span class='caption'>{this.toolBarModels.tbitem18.caption}</span>
                    </i-button>
                    <div slot='content'>{this.toolBarModels.tbitem18.tip}</div>
                </tooltip>
                
                
                </div>
            </div>
        </row>
        <view_searchform 
            viewState={this.viewState} 
                loaddraftAction='loaddraft' 
            showBusyIndicator={true} 
            v-show={this.isExpandSearchForm} 
         
            name='searchform' 
            ref='searchform' 
            on-save={($event: any) => this.searchform_save($event)} 
            on-search={($event: any) => this.searchform_search($event)} 
            on-load={($event: any) => this.searchform_load($event)} 
            on-closeview={($event: any) => this.closeView($event)}>
        </view_searchform>
        <view_grid 
            viewState={this.viewState} 
                isSingleSelect={this.isSingleSelect} 
            showBusyIndicator={true} 
            searchAction='searchmy' 
            updateAction='update' 
            removeAction='remove' 
            loadAction='get' 
            loaddraftAction='getdraft' 
            createAction='create' 
         
            name='grid' 
            ref='grid' 
            on-selectionchange={($event: any) => this.grid_selectionchange($event)} 
            on-beforeload={($event: any) => this.grid_beforeload($event)} 
            on-rowdblclick={($event: any) => this.grid_rowdblclick($event)} 
            on-remove={($event: any) => this.grid_remove($event)} 
            on-load={($event: any) => this.grid_load($event)} 
            on-closeview={($event: any) => this.closeView($event)}>
        </view_grid>
        
                    {this.renderPosBottomMsgs()}
                </div>
            </card>
        </div>
        );
    }

}