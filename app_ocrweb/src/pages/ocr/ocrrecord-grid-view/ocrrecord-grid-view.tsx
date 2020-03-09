import { Vue, Component, Prop, Provide, Emit, Watch } from 'vue-property-decorator';
import { Subject } from 'rxjs';
import { CreateElement } from 'vue';
import './ocrrecord-grid-view.less';

import GridViewEngine from '@engine/view/grid-view-engine';

import view_grid from '@widget/ocrrecord/main-grid/main-grid';
import view_searchform from '@widget/ocrrecord/default-searchform/default-searchform';

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
export default class OCRRecordGridView extends Vue {

    /**
     * 数据变化
     *
     * @param {*} val
     * @returns {*}
     * @memberof OCRRecordGridView
     */
    @Emit() 
    public viewDatasChange(val: any):any {
        return val;
    }

    /**
     * 数据视图
     *
     * @type {string}
     * @memberof OCRRecordGridView
     */
    @Prop() public viewdata!: string;

	/**
	 * 视图标识
	 *
	 * @type {string}
	 * @memberof AppDashboardView
	 */
	public viewtag: string = '5b0cdea716a23fad801d706774fb600b';

    /**
     * 父数据对象
     *
     * @protected
     * @type {*}
     * @memberof OCRRecordGridView
     */
    protected srfparentdata: any = {};

    /**
     * 视图模型数据
     *
     * @type {*}
     * @memberof OCRRecordGridView
     */
    public model: any = {
        srfTitle: '识别记录表格视图',
        srfCaption: 'ocrrecord.views.gridview.caption',
        srfSubCaption: '',
        dataInfo: ''
    }

    /**
     * 处理值变化
     *
     * @param {*} newVal
     * @param {*} oldVal
     * @memberof OCRRecordGridView
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
     * @memberof OCRRecordGridView
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
     * @memberof OCRRecordGridView
     */
    public viewState: Subject<ViewState> = new Subject();

    /**
     * 工具栏模型
     *
     * @type {*}
     * @memberof OCRRecordGridView
     */
    public toolBarModels: any = {
        tbitem19: { name: 'tbitem19', caption: '过滤', disabled: false, type: 'DEUIACTION', visabled: true, dataaccaction: '', uiaction: { tag: 'ToggleFilter', target: '' } },

    };



    /**
     * 视图引擎
     *
     * @private
     * @type {Engine}
     * @memberof OCRRecordGridView
     */
    private engine: GridViewEngine = new GridViewEngine();

    /**
     * 引擎初始化
     *
     * @private
     * @memberof OCRRecordGridView
     */
    private engineInit(): void {
        this.engine.init({
            view: this,
            opendata: (args: any[], params?: any, $event?: any, xData?: any) => {
                this.opendata(args, params, $event, xData);
            },
            newdata: (args: any[], params?: any, $event?: any, xData?: any) => {
                this.newdata(args, params, $event, xData);
            },
            grid: this.$refs.grid,
            searchform: this.$refs.searchform,
            isLoadDefault: true,
        });
    }

    /**
     * Vue声明周期
     *
     * @memberof OCRRecordGridView
     */
    public created() {
        const secondtag = this.$util.createUUID();
        this.$store.commit('viewaction/createdView', { viewtag: this.viewtag, secondtag: secondtag });
        this.viewtag = secondtag;
        
    }

    /**
     * 销毁之前
     *
     * @memberof OCRRecordGridView
     */
    public beforeDestroy() {
        this.$store.commit('viewaction/removeView', this.viewtag);
    }

    /**
     * Vue声明周期(组件初始化完毕)
     *
     * @memberof OCRRecordGridView
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
     * @memberof OCRRecordGridView
     */
    public toolbar_click($event: any, $event2?: any) {
        if (Object.is($event.tag, 'tbitem5')) {
            this.toolbar_tbitem5_click($event, '', $event2);
        }
        if (Object.is($event.tag, 'tbitem19')) {
            this.toolbar_tbitem19_click($event, '', $event2);
        }
    }


    /**
     * grid 部件 selectionchange 事件
     *
     * @param {*} [args={}]
     * @param {*} $event
     * @memberof OCRRecordGridView
     */
    public grid_selectionchange($event: any, $event2?: any) {
        this.engine.onCtrlEvent('grid', 'selectionchange', $event);
    }


    /**
     * grid 部件 beforeload 事件
     *
     * @param {*} [args={}]
     * @param {*} $event
     * @memberof OCRRecordGridView
     */
    public grid_beforeload($event: any, $event2?: any) {
        this.engine.onCtrlEvent('grid', 'beforeload', $event);
    }


    /**
     * grid 部件 rowdblclick 事件
     *
     * @param {*} [args={}]
     * @param {*} $event
     * @memberof OCRRecordGridView
     */
    public grid_rowdblclick($event: any, $event2?: any) {
        this.$router.push({ name: 'ocr_ocrrecordocrview', params: {ocrid:$event[0].srfkey} });
    }


    /**
     * grid 部件 remove 事件
     *
     * @param {*} [args={}]
     * @param {*} $event
     * @memberof OCRRecordGridView
     */
    public grid_remove($event: any, $event2?: any) {
        this.engine.onCtrlEvent('grid', 'remove', $event);
    }


    /**
     * grid 部件 load 事件
     *
     * @param {*} [args={}]
     * @param {*} $event
     * @memberof OCRRecordGridView
     */
    public grid_load($event: any, $event2?: any) {
        this.engine.onCtrlEvent('grid', 'load', $event);
    }


    /**
     * searchform 部件 save 事件
     *
     * @param {*} [args={}]
     * @param {*} $event
     * @memberof OCRRecordGridView
     */
    public searchform_save($event: any, $event2?: any) {
        this.engine.onCtrlEvent('searchform', 'save', $event);
    }


    /**
     * searchform 部件 search 事件
     *
     * @param {*} [args={}]
     * @param {*} $event
     * @memberof OCRRecordGridView
     */
    public searchform_search($event: any, $event2?: any) {
        this.engine.onCtrlEvent('searchform', 'search', $event);
    }


    /**
     * searchform 部件 load 事件
     *
     * @param {*} [args={}]
     * @param {*} $event
     * @memberof OCRRecordGridView
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
     * 打开新建数据视图
     *
     * @param {any[]} args
     * @param {*} [params]
     * @param {*} [$event]
     * @param {*} [xData]
     * @memberof OCRRecordGridView
     */
    public newdata(args: any[], params?: any, $event?: any, xData?: any) {
        const data: any = {};
        if (args && args.length > 0 && args[0].srfsourcekey) {
            Object.assign(data, { srfsourcekey: args[0].srfsourcekey })
        }
        const _this: any = this;
        if (_this.srfparentdata) {
            Object.assign(data, _this.srfparentdata);
        }
        const openIndexViewTab = (viewpath: string, data: any) => {
            Object.assign(data, {w:(new Date()).getTime()});
            const _params = this.$util.prepareRouteParmas({
                route: this.$route,
                sourceNode: this.$route.name,
                targetNode: viewpath,
                data: data,
            });
            this.$router.push({ name: viewpath, params: _params });
        }
        openIndexViewTab('ocr_ocrrecordeditview', data);
    }


    /**
     * 打开编辑数据视图
     *
     * @param {any[]} args
     * @param {*} [params]
     * @param {*} [$event]
     * @param {*} [xData]
     * @memberof OCRRecordGridView
     */
    public opendata(args: any[], params?: any, $event?: any, xData?: any) {
        const data: any = { srfkey: args[0].srfkey, srfsourcekey: args[0].srfsourcekey };
        const _this: any = this;
        if (_this.srfparentdata) {
            Object.assign(data, _this.srfparentdata);
        }
        const openIndexViewTab = (viewpath: string, data: any) => {
            const _params = this.$util.prepareRouteParmas({
                route: this.$route,
                sourceNode: this.$route.name,
                targetNode: viewpath,
                data: data,
            });
            this.$router.push({ name: viewpath, params: _params });
        }
        openIndexViewTab('ocr_ocrrecordeditview', data);
    }



    /**
     * 查看
     *
     * @param {any[]} args
     * @param {*} [params]
     * @param {*} [$event]
     * @param {*} [xData]
     * @memberof OCRRecordGridView
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
     * 过滤
     *
     * @param {any[]} args
     * @param {*} [params]
     * @param {*} [$event]
     * @param {*} [xData]
     * @memberof OCRRecordGridView
     */
    public ToggleFilter(args: any[], params?: any, $event?: any, xData?: any) {
        const _this: any = this;
        if (_this.hasOwnProperty('isExpandSearchForm')) {
            _this.isExpandSearchForm = !_this.isExpandSearchForm;
        }
    }

    /**
     * 关闭视图
     *
     * @param {any[]} args
     * @memberof OCRRecordGridView
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
     * @memberof OCRRecordGridView
     */
    public isSingleSelect: boolean = false;

    /**
     * 搜索值
     *
     * @type {string}
     * @memberof OCRRecordGridView
     */
    public query: string = '';

    /**
     * 是否展开搜索表单
     *
     * @type {boolean}
     * @memberof OCRRecordGridView
     */
    public isExpandSearchForm: boolean = false;

    /**
     * 表格行数据默认激活模式
     * 0 不激活
     * 1 单击激活
     * 2 双击激活
     *
     * @type {(number | 0 | 1 | 2)}
     * @memberof OCRRecordGridView
     */
    public gridRowActiveMode: number | 0 | 1 | 2 = 2;

    /**
     * 快速搜索
     *
     * @param {*} $event
     * @memberof OCRRecordGridView
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
     * @memberof OCRRecordGridView
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
     * @memberof OCRRecordGridView
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
     * @memberof OCRRecordGridView
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
     * @memberof OCRRecordGridView
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
     * @memberof OCRRecordGridView
     */
    public render(h: CreateElement) {
        return (
        <div class='view-container ocrrecord-grid-view'>
            <card class='view-card'  dis-hover={true} bordered={false}>
        
        <p slot='title'>
            <span class='caption-info'>{this.$t(this.model.srfCaption)}</span>
        </p>
        
        
                <div class='content-container'>
                    {this.renderPosTopMsgs()}
                    <row style='margin-bottom: 6px;'>
                            <i-input placeholder="识别记录名称" v-show={!this.isExpandSearchForm} v-model={this.query} search enter-button on-on-search={($event: any) => this.onSearch($event)} class='pull-left' style='max-width: 400px;margin-top:6px;' />
                        <div class='pull-right'>
                            <div class='toolbar-container'>
                                <tooltip transfer={true} max-width={600}>
                            <i-button v-show={this.toolBarModels.tbitem19.visabled} disabled={this.toolBarModels.tbitem19.disabled} class='' on-click={($event: any) => this.toolbar_click({ tag: 'tbitem19' }, $event)}>
                                <i class='fa fa-filter'></i>
                                <span class='caption'>{this.$t('ocrrecord.gridviewtoolbar_toolbar.tbitem19.caption')}</span>
                            </i-button>
                            <div slot='content'>{this.$t('ocrrecord.gridviewtoolbar_toolbar.tbitem19.tip')}</div>
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
                        searchAction='searchdefault' 
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