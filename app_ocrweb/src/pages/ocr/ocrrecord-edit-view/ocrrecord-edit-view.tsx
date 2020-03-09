import { Vue, Component, Prop, Provide, Emit, Watch } from 'vue-property-decorator';
import { Subject } from 'rxjs';
import { CreateElement } from 'vue';
import './ocrrecord-edit-view.less';

import EditViewEngine from '@engine/view/edit-view-engine';

import view_form from '@widget/ocrrecord/main-form/main-form';

@Component({
    components: {
        view_form, 
    },
    beforeRouteEnter: (to: any, from: any, next: any) => {
        next((vm: any) => {
            vm.$store.commit('addCurPageViewtag', { fullPath: to.fullPath, viewtag: vm.viewtag });
        });
    },
})
export default class OCRRecordEditView extends Vue {

    /**
     * 数据变化
     *
     * @param {*} val
     * @returns {*}
     * @memberof OCRRecordEditView
     */
    @Emit() 
    public viewDatasChange(val: any):any {
        return val;
    }

    /**
     * 数据视图
     *
     * @type {string}
     * @memberof OCRRecordEditView
     */
    @Prop() public viewdata!: string;

	/**
	 * 视图标识
	 *
	 * @type {string}
	 * @memberof AppDashboardView
	 */
	public viewtag: string = 'b77a4eb1b0ba112c8d13e1ea925d48e2';

    /**
     * 父数据对象
     *
     * @protected
     * @type {*}
     * @memberof OCRRecordEditView
     */
    protected srfparentdata: any = {};

    /**
     * 视图模型数据
     *
     * @type {*}
     * @memberof OCRRecordEditView
     */
    public model: any = {
        srfTitle: '识别记录编辑视图',
        srfCaption: 'ocrrecord.views.editview.caption',
        srfSubCaption: '',
        dataInfo: ''
    }

    /**
     * 处理值变化
     *
     * @param {*} newVal
     * @param {*} oldVal
     * @memberof OCRRecordEditView
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
     * @memberof OCRRecordEditView
     */
    public containerModel: any = {
        view_toolbar: { name: 'toolbar', type: 'TOOLBAR' },
        view_form: { name: 'form', type: 'FORM' },
    };

    /**
     * 视图状态订阅对象
     *
     * @private
     * @type {Subject<{action: string, data: any}>}
     * @memberof OCRRecordEditView
     */
    public viewState: Subject<ViewState> = new Subject();

    /**
     * 工具栏模型
     *
     * @type {*}
     * @memberof OCRRecordEditView
     */
    public toolBarModels: any = {
        tbitem3: { name: 'tbitem3', caption: '保存', disabled: false, type: 'DEUIACTION', visabled: true, dataaccaction: '', uiaction: { tag: 'Save', target: '' } },

        tbitem4: { name: 'tbitem4', caption: '保存并新建', disabled: false, type: 'DEUIACTION', visabled: true, dataaccaction: '', uiaction: { tag: 'SaveAndNew', target: '' } },

        tbitem5: { name: 'tbitem5', caption: '保存并关闭', disabled: false, type: 'DEUIACTION', visabled: true, dataaccaction: '', uiaction: { tag: 'SaveAndExit', target: '' } },

        tbitem6: {  name: 'tbitem6', type: 'SEPERATOR', visabled: true, dataaccaction: '', uiaction: { } },
        tbitem7: { name: 'tbitem7', caption: '删除并关闭', disabled: false, type: 'DEUIACTION', visabled: true, dataaccaction: '', uiaction: { tag: 'RemoveAndExit', target: 'SINGLEKEY' } },

        tbitem8: {  name: 'tbitem8', type: 'SEPERATOR', visabled: true, dataaccaction: '', uiaction: { } },
        tbitem12: { name: 'tbitem12', caption: '新建', disabled: false, type: 'DEUIACTION', visabled: true, dataaccaction: '', uiaction: { tag: 'New', target: '' } },

        tbitem13: {  name: 'tbitem13', type: 'SEPERATOR', visabled: true, dataaccaction: '', uiaction: { } },
        tbitem14: { name: 'tbitem14', caption: '拷贝', disabled: false, type: 'DEUIACTION', visabled: true, dataaccaction: '', uiaction: { tag: 'Copy', target: 'SINGLEKEY' } },

        tbitem16: {  name: 'tbitem16', type: 'SEPERATOR', visabled: true, dataaccaction: '', uiaction: { } },
        tbitem23: { name: 'tbitem23', caption: '第一个记录', disabled: false, type: 'DEUIACTION', visabled: true, dataaccaction: '', uiaction: { tag: 'FirstRecord', target: 'SINGLEKEY' } },

        tbitem24: { name: 'tbitem24', caption: '上一个记录', disabled: false, type: 'DEUIACTION', visabled: true, dataaccaction: '', uiaction: { tag: 'PrevRecord', target: 'SINGLEKEY' } },

        tbitem25: { name: 'tbitem25', caption: '下一个记录', disabled: false, type: 'DEUIACTION', visabled: true, dataaccaction: '', uiaction: { tag: 'NextRecord', target: 'SINGLEKEY' } },

        tbitem26: { name: 'tbitem26', caption: '最后一个记录', disabled: false, type: 'DEUIACTION', visabled: true, dataaccaction: '', uiaction: { tag: 'LastRecord', target: 'SINGLEKEY' } },

        tbitem21: {  name: 'tbitem21', type: 'SEPERATOR', visabled: true, dataaccaction: '', uiaction: { } },
        tbitem22: { name: 'tbitem22', caption: '帮助', disabled: false, type: 'DEUIACTION', visabled: true, dataaccaction: '', uiaction: { tag: 'Help', target: '' } },

    };



    /**
     * 视图引擎
     *
     * @private
     * @type {Engine}
     * @memberof OCRRecordEditView
     */
    private engine: EditViewEngine = new EditViewEngine();

    /**
     * 引擎初始化
     *
     * @private
     * @memberof OCRRecordEditView
     */
    private engineInit(): void {
        this.engine.init({
            view: this,
            form: this.$refs.form,
            p2k: '0',
            isLoadDefault: true,
        });
    }

    /**
     * Vue声明周期
     *
     * @memberof OCRRecordEditView
     */
    public created() {
        const secondtag = this.$util.createUUID();
        this.$store.commit('viewaction/createdView', { viewtag: this.viewtag, secondtag: secondtag });
        this.viewtag = secondtag;
        
    }

    /**
     * 销毁之前
     *
     * @memberof OCRRecordEditView
     */
    public beforeDestroy() {
        this.$store.commit('viewaction/removeView', this.viewtag);
    }

    /**
     * Vue声明周期(组件初始化完毕)
     *
     * @memberof OCRRecordEditView
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
     * @memberof OCRRecordEditView
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
        if (Object.is($event.tag, 'tbitem7')) {
            this.toolbar_tbitem7_click($event, '', $event2);
        }
        if (Object.is($event.tag, 'tbitem9')) {
            this.toolbar_tbitem9_click($event, '', $event2);
        }
        if (Object.is($event.tag, 'tbitem10')) {
            this.toolbar_tbitem10_click($event, '', $event2);
        }
        if (Object.is($event.tag, 'tbitem12')) {
            this.toolbar_tbitem12_click($event, '', $event2);
        }
        if (Object.is($event.tag, 'tbitem14')) {
            this.toolbar_tbitem14_click($event, '', $event2);
        }
        if (Object.is($event.tag, 'tbitem15')) {
            this.toolbar_tbitem15_click($event, '', $event2);
        }
        if (Object.is($event.tag, 'tbitem23')) {
            this.toolbar_tbitem23_click($event, '', $event2);
        }
        if (Object.is($event.tag, 'tbitem24')) {
            this.toolbar_tbitem24_click($event, '', $event2);
        }
        if (Object.is($event.tag, 'tbitem25')) {
            this.toolbar_tbitem25_click($event, '', $event2);
        }
        if (Object.is($event.tag, 'tbitem26')) {
            this.toolbar_tbitem26_click($event, '', $event2);
        }
        if (Object.is($event.tag, 'tbitem22')) {
            this.toolbar_tbitem22_click($event, '', $event2);
        }
    }


    /**
     * form 部件 save 事件
     *
     * @param {*} [args={}]
     * @param {*} $event
     * @memberof OCRRecordEditView
     */
    public form_save($event: any, $event2?: any) {
        this.engine.onCtrlEvent('form', 'save', $event);
    }


    /**
     * form 部件 remove 事件
     *
     * @param {*} [args={}]
     * @param {*} $event
     * @memberof OCRRecordEditView
     */
    public form_remove($event: any, $event2?: any) {
        this.engine.onCtrlEvent('form', 'remove', $event);
    }


    /**
     * form 部件 load 事件
     *
     * @param {*} [args={}]
     * @param {*} $event
     * @memberof OCRRecordEditView
     */
    public form_load($event: any, $event2?: any) {
        this.engine.onCtrlEvent('form', 'load', $event);
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
        xData = this.$refs.form;
        if (xData.getDatas && xData.getDatas instanceof Function) {
            datas = [...xData.getDatas()];
        }

        // 界面行为
        this.Save(datas, paramJO,  $event, xData);
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
        xData = this.$refs.form;
        if (xData.getDatas && xData.getDatas instanceof Function) {
            datas = [...xData.getDatas()];
        }

        // 界面行为
        this.SaveAndNew(datas, paramJO,  $event, xData);
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
        xData = this.$refs.form;
        if (xData.getDatas && xData.getDatas instanceof Function) {
            datas = [...xData.getDatas()];
        }

        // 界面行为
        this.SaveAndExit(datas, paramJO,  $event, xData);
    }

    /**
     * 逻辑事件
     *
     * @param {*} [params={}]
     * @param {*} [tag]
     * @param {*} [$event]
     * @memberof 
     */
    public toolbar_tbitem7_click(params: any = {}, tag?: any, $event?: any) {
        // 参数

        // 取数
        let datas: any[] = [];
        let xData: any = null;
        // _this 指向容器对象
        const _this: any = this;
        const paramJO = {};
        xData = this.$refs.form;
        if (xData.getDatas && xData.getDatas instanceof Function) {
            datas = [...xData.getDatas()];
        }

        // 界面行为
        this.RemoveAndExit(datas, paramJO,  $event, xData);
    }

    /**
     * 逻辑事件
     *
     * @param {*} [params={}]
     * @param {*} [tag]
     * @param {*} [$event]
     * @memberof 
     */
    public toolbar_tbitem9_click(params: any = {}, tag?: any, $event?: any) {
        // 参数

        // 取数
        let datas: any[] = [];
        let xData: any = null;
        // _this 指向容器对象
        const _this: any = this;
        const paramJO = {};
        xData = this.$refs.form;
        if (xData.getDatas && xData.getDatas instanceof Function) {
            datas = [...xData.getDatas()];
        }

        // 界面行为
        this.SaveAndStart(datas, paramJO,  $event, xData);
    }

    /**
     * 逻辑事件
     *
     * @param {*} [params={}]
     * @param {*} [tag]
     * @param {*} [$event]
     * @memberof 
     */
    public toolbar_tbitem10_click(params: any = {}, tag?: any, $event?: any) {
        // 参数

        // 取数
        let datas: any[] = [];
        let xData: any = null;
        // _this 指向容器对象
        const _this: any = this;
        const paramJO = {};
        xData = this.$refs.form;
        if (xData.getDatas && xData.getDatas instanceof Function) {
            datas = [...xData.getDatas()];
        }

        // 界面行为
        this.ViewWFStep(datas, paramJO,  $event, xData);
    }

    /**
     * 逻辑事件
     *
     * @param {*} [params={}]
     * @param {*} [tag]
     * @param {*} [$event]
     * @memberof 
     */
    public toolbar_tbitem12_click(params: any = {}, tag?: any, $event?: any) {
        // 参数

        // 取数
        let datas: any[] = [];
        let xData: any = null;
        // _this 指向容器对象
        const _this: any = this;
        const paramJO = {};
        xData = this.$refs.form;
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
    public toolbar_tbitem14_click(params: any = {}, tag?: any, $event?: any) {
        // 参数

        // 取数
        let datas: any[] = [];
        let xData: any = null;
        // _this 指向容器对象
        const _this: any = this;
        const paramJO = {};
        xData = this.$refs.form;
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
    public toolbar_tbitem15_click(params: any = {}, tag?: any, $event?: any) {
        // 参数

        // 取数
        let datas: any[] = [];
        let xData: any = null;
        // _this 指向容器对象
        const _this: any = this;
        const paramJO = {};
        xData = this.$refs.form;
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
    public toolbar_tbitem23_click(params: any = {}, tag?: any, $event?: any) {
        // 参数

        // 取数
        let datas: any[] = [];
        let xData: any = null;
        // _this 指向容器对象
        const _this: any = this;
        const paramJO = {};
        xData = this.$refs.form;
        if (xData.getDatas && xData.getDatas instanceof Function) {
            datas = [...xData.getDatas()];
        }

        // 界面行为
        this.FirstRecord(datas, paramJO,  $event, xData);
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
        xData = this.$refs.form;
        if (xData.getDatas && xData.getDatas instanceof Function) {
            datas = [...xData.getDatas()];
        }

        // 界面行为
        this.PrevRecord(datas, paramJO,  $event, xData);
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
        xData = this.$refs.form;
        if (xData.getDatas && xData.getDatas instanceof Function) {
            datas = [...xData.getDatas()];
        }

        // 界面行为
        this.NextRecord(datas, paramJO,  $event, xData);
    }

    /**
     * 逻辑事件
     *
     * @param {*} [params={}]
     * @param {*} [tag]
     * @param {*} [$event]
     * @memberof 
     */
    public toolbar_tbitem26_click(params: any = {}, tag?: any, $event?: any) {
        // 参数

        // 取数
        let datas: any[] = [];
        let xData: any = null;
        // _this 指向容器对象
        const _this: any = this;
        const paramJO = {};
        xData = this.$refs.form;
        if (xData.getDatas && xData.getDatas instanceof Function) {
            datas = [...xData.getDatas()];
        }

        // 界面行为
        this.LastRecord(datas, paramJO,  $event, xData);
    }

    /**
     * 逻辑事件
     *
     * @param {*} [params={}]
     * @param {*} [tag]
     * @param {*} [$event]
     * @memberof 
     */
    public toolbar_tbitem22_click(params: any = {}, tag?: any, $event?: any) {
        // 参数

        // 取数
        let datas: any[] = [];
        let xData: any = null;
        // _this 指向容器对象
        const _this: any = this;
        const paramJO = {};
        xData = this.$refs.form;
        if (xData.getDatas && xData.getDatas instanceof Function) {
            datas = [...xData.getDatas()];
        }

        // 界面行为
        this.Help(datas, paramJO,  $event, xData);
    }


    /**
     * 保存
     *
     * @param {any[]} args
     * @param {*} [params]
     * @param {*} [$event]
     * @param {*} [xData]
     * @memberof OCRRecordEditView
     */
    public Save(args: any[], params?: any, $event?: any, xData?: any) {
        // 界面行为容器对象 _this
        const _this: any = this;
        if (xData && xData.save instanceof Function) {
            const _data = { srfparentdata: _this.srfparentdata };
            xData.save(_data).then((response: any) => {
                if (!response || response.status !== 200) {
                    return;
                }
                _this.$emit('viewdataschange', [{ ...response.data }]);
            });
        } else if (_this.save && _this.save instanceof Function) {
            _this.save();
        }
    }


    /**
     * 保存并新建
     *
     * @param {any[]} args
     * @param {*} [params]
     * @param {*} [$event]
     * @param {*} [xData]
     * @memberof OCRRecordEditView
     */
    public SaveAndNew(args: any[], params?: any, $event?: any, xData?: any) {
        const _view: any = this;
        if (!xData || !(xData.save instanceof Function)) {
            return;
        }
        const _data = { srfparentdata: _view.srfparentdata };
        xData.save(_data).then((response: any) => {
            if (!response || response.status !== 200) {
                return;
            }
            if (xData.autoLoad instanceof Function) {
                xData.autoLoad(_data);
            }
        });
    }

    /**
     * 保存并关闭
     *
     * @param {any[]} args
     * @param {*} [params]
     * @param {*} [$event]
     * @param {*} [xData]
     * @memberof OCRRecordEditView
     */
    public SaveAndExit(args: any[], params?: any, $event?: any, xData?: any) {
        // _this 指向容器对象
        // xData 数据对象
        const _this: any = this;
        if (xData && xData.save instanceof Function) {
            const _data = { srfparentdata: _this.srfparentdata };
            xData.save(_data).then((response: any) => {
                if (!response || response.status !== 200) {
                    return;
                }
                if (_this.viewdata) {
                    _this.$emit('viewdataschange', [{ ...response.data }]);
                    _this.$emit('close');
                } else if (_this.$tabPageExp) {
                    _this.$tabPageExp.onClose(_this.$route.fullPath);
                }
            });
        } else if (_this.save && _this.save instanceof Function) {
            _this.save().then((response: any) => {
                if (!response || response.status !== 200) {
                    return;
                }
                _this.$emit('closeview', [{ ...response.data }]);
            });
        }
    }

    /**
     * 删除并关闭
     *
     * @param {any[]} args
     * @param {*} [params]
     * @param {*} [$event]
     * @param {*} [xData]
     * @memberof OCRRecordEditView
     */
    public RemoveAndExit(args: any[], params?: any, $event?: any, xData?: any) {
        const _this: any = this;
        if (!xData || !(xData.remove instanceof Function)) {
            return ;
        }
        xData.remove(args).then((response: any) => {
            if (!response || response.status !== 200) {
                return ;
            }
            if (_this.viewdata) {
                _this.$emit('close');
            } else {
                _this.$tabPageExp.onClose(_this.$route.fullPath);
            }
        });
    }

    /**
     * 开始流程
     *
     * @param {any[]} args
     * @param {*} [params]
     * @param {*} [$event]
     * @param {*} [xData]
     * @memberof OCRRecordEditView
     */
    public SaveAndStart(args: any[], params?: any, $event?: any, xData?: any) {
        // _this 指向容器对象
        // xData 数据对象
        const _this: any = this;
        if (xData && xData.save instanceof Function) {
            const _data = { srfparentdata: _this.srfparentdata };
            xData.save(_data, false).then((response: any) => {
                if (!response || response.status !== 200) {
                    return;
                }
                const { data: _data } = response;
                if (!xData || !(xData.wfstart instanceof Function)) {
                    return;
                }
                xData.wfstart(_data).then((response2: any) => {
                    if (!response2 || response2.status !== 200) {
                        return;
                    }
                    const { data: _data2 } = response2;

                    if (_this.viewdata) {
                        _this.$emit('viewdataschange', [{ ..._data2 }]);
                        _this.$emit('close');
                    } else if (_this.$tabPageExp) {
                        _this.$tabPageExp.onClose(_this.$route.fullPath);
                    }
                    this.$store.dispatch('viewaction/datasaved', { viewtag: this.viewtag });
                });
            });
        }
    }

    /**
     * 当前流程步骤
     *
     * @param {any[]} args
     * @param {*} [params]
     * @param {*} [$event]
     * @param {*} [xData]
     * @memberof OCRRecordEditView
     */
    public ViewWFStep(args: any[], params?: any, $event?: any, xData?: any) {

    }

    /**
     * 新建
     *
     * @param {any[]} args
     * @param {*} [params]
     * @param {*} [$event]
     * @param {*} [xData]
     * @memberof OCRRecordEditView
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
     * 拷贝
     *
     * @param {any[]} args
     * @param {*} [params]
     * @param {*} [$event]
     * @param {*} [xData]
     * @memberof OCRRecordEditView
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
     * 打印
     *
     * @param {any[]} args
     * @param {*} [params]
     * @param {*} [$event]
     * @param {*} [xData]
     * @memberof OCRRecordEditView
     */
    public Print(args: any[], params?: any, $event?: any, xData?: any) {

    }

    /**
     * 第一个记录
     *
     * @param {any[]} args
     * @param {*} [params]
     * @param {*} [$event]
     * @param {*} [xData]
     * @memberof OCRRecordEditView
     */
    public FirstRecord(args: any[], params?: any, $event?: any, xData?: any) {

    }

    /**
     * 上一个记录
     *
     * @param {any[]} args
     * @param {*} [params]
     * @param {*} [$event]
     * @param {*} [xData]
     * @memberof OCRRecordEditView
     */
    public PrevRecord(args: any[], params?: any, $event?: any, xData?: any) {

    }


    /**
     * 下一个记录
     *
     * @param {any[]} args
     * @param {*} [params]
     * @param {*} [$event]
     * @param {*} [xData]
     * @memberof OCRRecordEditView
     */
    public NextRecord(args: any[], params?: any, $event?: any, xData?: any) {

    }


    /**
     * 最后一个记录
     *
     * @param {any[]} args
     * @param {*} [params]
     * @param {*} [$event]
     * @param {*} [xData]
     * @memberof OCRRecordEditView
     */
    public LastRecord(args: any[], params?: any, $event?: any, xData?: any) {

    }

    /**
     * 帮助
     *
     * @param {any[]} args
     * @param {*} [params]
     * @param {*} [$event]
     * @param {*} [xData]
     * @memberof OCRRecordEditView
     */
    public Help(args: any[], params?: any, $event?: any, xData?: any) {

    }

    /**
     * 关闭视图
     *
     * @param {any[]} args
     * @memberof OCRRecordEditView
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
     * 获取表单数据
     *
     * @returns {*}
     */
    get formData():any {
        const form:any = this.$refs.form;
        if (form) {
            return JSON.stringify(form.data);
        }
        return null;
    }


    /**
     * 绘制视图消息 （上方）
     *
     * @returns
     * @memberof OCRRecordEditView
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
     * @memberof OCRRecordEditView
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
     * @memberof OCRRecordEditView
     */
    public render(h: CreateElement) {
        return (
        <div class="view-container ocrrecord-edit-view">
            <card class='view-card' dis-hover={true} bordered={false}>
        
        <p slot='title'>
            <span class='caption-info'>
                {this.$t(this.model.srfCaption)}
                {
                    this.model.dataInfo && !Object.is(this.model.dataInfo, '') ?
                        ': ' + this.model.dataInfo
                        : ''
                }
            </span>
        </p>
        
                <p slot="extra">
                <div class='toolbar-container'>
                        <tooltip transfer={true} max-width={600}>
                    <i-button v-show={this.toolBarModels.tbitem3.visabled} disabled={this.toolBarModels.tbitem3.disabled} class='' on-click={($event: any) => this.toolbar_click({ tag: 'tbitem3' }, $event)}>
                        <i class='fa fa-save'></i>
                        <span class='caption'>{this.$t('ocrrecord.editviewtoolbar_toolbar.tbitem3.caption')}</span>
                    </i-button>
                    <div slot='content'>{this.$t('ocrrecord.editviewtoolbar_toolbar.tbitem3.tip')}</div>
                </tooltip>
                
                
                    <tooltip transfer={true} max-width={600}>
                    <i-button v-show={this.toolBarModels.tbitem4.visabled} disabled={this.toolBarModels.tbitem4.disabled} class='' on-click={($event: any) => this.toolbar_click({ tag: 'tbitem4' }, $event)}>
                        <i class='sx-tb-saveandnew'></i>
                        <span class='caption'>{this.$t('ocrrecord.editviewtoolbar_toolbar.tbitem4.caption')}</span>
                    </i-button>
                    <div slot='content'>{this.$t('ocrrecord.editviewtoolbar_toolbar.tbitem4.tip')}</div>
                </tooltip>
                
                
                    <tooltip transfer={true} max-width={600}>
                    <i-button v-show={this.toolBarModels.tbitem5.visabled} disabled={this.toolBarModels.tbitem5.disabled} class='' on-click={($event: any) => this.toolbar_click({ tag: 'tbitem5' }, $event)}>
                        <i class='sx-tb-saveandclose'></i>
                        <span class='caption'>{this.$t('ocrrecord.editviewtoolbar_toolbar.tbitem5.caption')}</span>
                    </i-button>
                    <div slot='content'>{this.$t('ocrrecord.editviewtoolbar_toolbar.tbitem5.tip')}</div>
                </tooltip>
                
                
                    <span class='seperator'>|</span>
                    <tooltip transfer={true} max-width={600}>
                    <i-button v-show={this.toolBarModels.tbitem7.visabled} disabled={this.toolBarModels.tbitem7.disabled} class='' on-click={($event: any) => this.toolbar_click({ tag: 'tbitem7' }, $event)}>
                        <i class='fa fa-remove'></i>
                        <span class='caption'>{this.$t('ocrrecord.editviewtoolbar_toolbar.tbitem7.caption')}</span>
                    </i-button>
                    <div slot='content'>{this.$t('ocrrecord.editviewtoolbar_toolbar.tbitem7.tip')}</div>
                </tooltip>
                
                
                    <span class='seperator'>|</span>
                    <tooltip transfer={true} max-width={600}>
                    <i-button v-show={this.toolBarModels.tbitem12.visabled} disabled={this.toolBarModels.tbitem12.disabled} class='' on-click={($event: any) => this.toolbar_click({ tag: 'tbitem12' }, $event)}>
                        <i class='fa fa-file-text-o'></i>
                        <span class='caption'>{this.$t('ocrrecord.editviewtoolbar_toolbar.tbitem12.caption')}</span>
                    </i-button>
                    <div slot='content'>{this.$t('ocrrecord.editviewtoolbar_toolbar.tbitem12.tip')}</div>
                </tooltip>
                
                
                    <span class='seperator'>|</span>
                    <tooltip transfer={true} max-width={600}>
                    <i-button v-show={this.toolBarModels.tbitem14.visabled} disabled={this.toolBarModels.tbitem14.disabled} class='' on-click={($event: any) => this.toolbar_click({ tag: 'tbitem14' }, $event)}>
                        <i class='fa fa-copy'></i>
                        <span class='caption'>{this.$t('ocrrecord.editviewtoolbar_toolbar.tbitem14.caption')}</span>
                    </i-button>
                    <div slot='content'>{this.$t('ocrrecord.editviewtoolbar_toolbar.tbitem14.tip')}</div>
                </tooltip>
                
                
                    <span class='seperator'>|</span>
                    <tooltip transfer={true} max-width={600}>
                    <i-button v-show={this.toolBarModels.tbitem23.visabled} disabled={this.toolBarModels.tbitem23.disabled} class='' on-click={($event: any) => this.toolbar_click({ tag: 'tbitem23' }, $event)}>
                        <i class='fa fa-fast-backward'></i>
                        
                    </i-button>
                    <div slot='content'>{this.$t('ocrrecord.editviewtoolbar_toolbar.tbitem23.tip')}</div>
                </tooltip>
                
                
                    <tooltip transfer={true} max-width={600}>
                    <i-button v-show={this.toolBarModels.tbitem24.visabled} disabled={this.toolBarModels.tbitem24.disabled} class='' on-click={($event: any) => this.toolbar_click({ tag: 'tbitem24' }, $event)}>
                        <i class='fa fa-step-backward'></i>
                        
                    </i-button>
                    <div slot='content'>{this.$t('ocrrecord.editviewtoolbar_toolbar.tbitem24.tip')}</div>
                </tooltip>
                
                
                    <tooltip transfer={true} max-width={600}>
                    <i-button v-show={this.toolBarModels.tbitem25.visabled} disabled={this.toolBarModels.tbitem25.disabled} class='' on-click={($event: any) => this.toolbar_click({ tag: 'tbitem25' }, $event)}>
                        <i class='fa fa-step-forward'></i>
                        
                    </i-button>
                    <div slot='content'>{this.$t('ocrrecord.editviewtoolbar_toolbar.tbitem25.tip')}</div>
                </tooltip>
                
                
                    <tooltip transfer={true} max-width={600}>
                    <i-button v-show={this.toolBarModels.tbitem26.visabled} disabled={this.toolBarModels.tbitem26.disabled} class='' on-click={($event: any) => this.toolbar_click({ tag: 'tbitem26' }, $event)}>
                        <i class='fa fa-fast-forward'></i>
                        
                    </i-button>
                    <div slot='content'>{this.$t('ocrrecord.editviewtoolbar_toolbar.tbitem26.tip')}</div>
                </tooltip>
                
                
                    <span class='seperator'>|</span>
                    <tooltip transfer={true} max-width={600}>
                    <i-button v-show={this.toolBarModels.tbitem22.visabled} disabled={this.toolBarModels.tbitem22.disabled} class='' on-click={($event: any) => this.toolbar_click({ tag: 'tbitem22' }, $event)}>
                        <i class='fa fa-question'></i>
                        <span class='caption'>{this.$t('ocrrecord.editviewtoolbar_toolbar.tbitem22.caption')}</span>
                    </i-button>
                    <div slot='content'>{this.$t('ocrrecord.editviewtoolbar_toolbar.tbitem22.tip')}</div>
                </tooltip>
                
                
                </div>
                
                </p>
                <div class="content-container">
                    {this.renderPosTopMsgs()}
                <view_form 
                    viewState={this.viewState} 
                        autosave={false} 
                    viewtag={this.viewtag} 
                    showBusyIndicator={true} 
                    updateAction='update' 
                    removeAction='remove' 
                    loaddraftAction='getdraft' 
                    loadAction='get' 
                    createAction='create' 
                    style='' 
                 
                    name='form' 
                    ref='form' 
                    on-save={($event: any) => this.form_save($event)} 
                    on-remove={($event: any) => this.form_remove($event)} 
                    on-load={($event: any) => this.form_load($event)} 
                    on-closeview={($event: any) => this.closeView($event)}>
                </view_form>
                    {this.renderPosBottomMsgs()}
                </div>
            </card>
        </div>
        );
    }


}