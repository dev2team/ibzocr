import { Vue, Component, Prop, Provide, Emit, Watch } from 'vue-property-decorator';
import { CreateElement } from 'vue';
import { Subject, Subscription } from 'rxjs';
import { ControlInterface } from '@/interface/control';
import { UICounter } from '@/utils';
import './main-form.less';


import { FormButtonModel, FormPageModel, FormItemModel, FormDRUIPartModel, FormPartModel, FormGroupPanelModel, FormIFrameModel, FormRowItemModel, FormTabPageModel, FormTabPanelModel, FormUserControlModel } from '@/model/form-detail';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';


@Component({
    components: {
         
    }
})
export default class Main extends Vue implements ControlInterface {

    /**
     * 名称
     *
     * @type {string}
     * @memberof Main
     */
    @Prop() public name?: string;

    /**
     * 视图通讯对象
     *
     * @type {Subject<ViewState>}
     * @memberof Main
     */
    @Prop() public viewState!: Subject<ViewState>;

    /**
     * 视图状态事件
     *
     * @protected
     * @type {(Subscription | undefined)}
     * @memberof Main
     */
    protected viewStateEvent: Subscription | undefined;
    


    /**
     * 序列号
     *
     * @private
     * @type {number}
     * @memberof Main
     */
    private serialNumber: number = this.$util.createSerialNumber();

    /**
     * 请求行为序列号数组
     *
     * @private
     * @type {any[]}
     * @memberof Main
     */
    private serialsNumber: any[] = [];

    /**
     * 添加序列号
     *
     * @private
     * @param {*} action
     * @param {number} serialnumber
     * @memberof Main
     */
    private addSerialNumber(action: any, serialnumber: number): void {
        const index = this.serialsNumber.findIndex((serial: any) => Object.is(serial.action, action));
        if (index === -1) {
            this.serialsNumber.push({ action: action, serialnumber: serialnumber })
        } else {
            this.serialsNumber[index].serialnumber = serialnumber;
        }
    }

    /**
     * 删除序列号
     *
     * @private
     * @param {*} action
     * @returns {number}
     * @memberof Main
     */
    private getSerialNumber(action: any): number {
        const index = this.serialsNumber.findIndex((serial: any) => Object.is(serial.action, action));
        return this.serialsNumber[index].serialnumber;
    }

    /**
     * 关闭视图
     *
     * @param {any[]} args
     * @memberof Main
     */
    public closeView(args: any[]): void {
        let _this: any = this;
        _this.$emit('closeview', args);
    }


    /**
     * 获取多项数据
     *
     * @returns {any[]}
     * @memberof Main
     */
    public getDatas(): any[] {
        return [this.data];
    }

    /**
     * 获取单项树
     *
     * @returns {*}
     * @memberof Main
     */
    public getData(): any {
        return this.data;
    }

    /**
     * 是否默认保存
     *
     * @type {boolean}
     * @memberof Main
     */
    @Prop({ default: false }) public autosave?: boolean;

    /**
     * 显示处理提示
     *
     * @type {boolean}
     * @memberof Main
     */
    @Prop({ default: true }) public showBusyIndicator?: boolean;

    /**
     * 部件行为--更新
     *
     * @type {string}
     * @memberof Main
     */
    @Prop() public updateAction?: string;

    /**
     * 部件行为--加载草稿
     *
     * @type {string}
     * @memberof Main
     */
    @Prop() public loaddraftformAction?: string;

    /**
     * 部件行为--删除
     *
     * @type {string}
     * @memberof Main
     */
    @Prop() public removeAction?: string;

    /**
     * 部件行为--加载草稿
     *
     * @type {string}
     * @memberof Main
     */
    @Prop() public loaddraftAction?: string;

    /**
     * 部件行为--加载
     *
     * @type {string}
     * @memberof Main
     */
    @Prop() public loadAction?: string;

    /**
     * 部件行为--创建
     *
     * @type {string}
     * @memberof Main
     */
    @Prop() public createAction?: string;

    /**
     * 视图标识
     *
     * @type {string}
     * @memberof Main
     */
    @Prop() public viewtag!: string;

    /**
     * Api地址
     *
     * @type {string}
     * @memberof Main
     */
    public url: string = 'ocrweb/ibizutil/maineditform/';

    /**
     * 表单状态
     *
     * @type {Subject<any>}
     * @memberof Main
     */
    public formState: Subject<any> = new Subject();

    /**
     * 忽略表单项值变化
     *
     * @type {boolean}
     * @memberof Main
     */
    public ignorefieldvaluechange: boolean = false;

    /**
     * 数据变化
     *
     * @private
     * @type {Subject<any>}
     * @memberof Main
     */
    private dataChang: Subject<any> = new Subject();

    /**
     * 视图状态事件
     *
     * @private
     * @type {(Subscription | undefined)}
     * @memberof Main
     */
    private dataChangEvent: Subscription | undefined;

    /**
     * 原始数据
     *
     * @private
     * @type {*}
     * @memberof Main
     */
    private oldData: any = {};

    /**
     * 表单数据对象
     *
     * @type {*}
     * @memberof Main
     */
    public data: any = {
        srfupdatedate: null,
        srforikey: null,
        srfkey: null,
        srfmajortext: null,
        srftempmode: null,
        srfuf: null,
        srfdeid: null,
        srfsourcekey: null,
        worklistname: null,
        createman: null,
        createdate: null,
        updateman: null,
        updatedate: null,
        worklistid: null,
    };

    /**
     * 属性值规则
     *
     * @type {*}
     * @memberof Main
     */
    public rules: any = {
        worklistname: [
            { required: false, type: 'string', message: '待办工作名称值不能为空!', trigger: 'change' }
        ],
        createman: [
            { required: false, type: 'string', message: '建立人值不能为空!', trigger: 'change' }
        ],
        createdate: [
            { required: false, type: 'string', message: '建立时间值不能为空!', trigger: 'change' }
        ],
        updateman: [
            { required: false, type: 'string', message: '更新人值不能为空!', trigger: 'change' }
        ],
        updatedate: [
            { required: false, type: 'string', message: '更新时间值不能为空!', trigger: 'change' }
        ],
    }

    /**
     * 详情模型集合
     *
     * @type {*}
     * @memberof Main
     */
    public detailsModel: any = {
        worklistname: new FormItemModel({ caption: '待办工作名称', detailType: 'FORMITEM', name: 'worklistname', visible: true, isShowCaption: true, form: this, disabled: false, enableCond: 3 })
, 
        group1: new FormGroupPanelModel({ caption: '待办工作基本信息', detailType: 'GROUPPANEL', name: 'group1', visible: true, isShowCaption: true, form: this, uiActionGroup: { caption: '', langbase: 'worklist.main_form', extractMode: 'ITEM', details: [] } })
, 
        formpage1: new FormPageModel({ caption: '基本信息', detailType: 'FORMPAGE', name: 'formpage1', visible: true, isShowCaption: true, form: this })
, 
        createman: new FormItemModel({ caption: '建立人', detailType: 'FORMITEM', name: 'createman', visible: true, isShowCaption: true, form: this, disabled: false, enableCond: 3 })
, 
        createdate: new FormItemModel({ caption: '建立时间', detailType: 'FORMITEM', name: 'createdate', visible: true, isShowCaption: true, form: this, disabled: false, enableCond: 3 })
, 
        updateman: new FormItemModel({ caption: '更新人', detailType: 'FORMITEM', name: 'updateman', visible: true, isShowCaption: true, form: this, disabled: false, enableCond: 3 })
, 
        updatedate: new FormItemModel({ caption: '更新时间', detailType: 'FORMITEM', name: 'updatedate', visible: true, isShowCaption: true, form: this, disabled: false, enableCond: 3 })
, 
        group2: new FormGroupPanelModel({ caption: '操作信息', detailType: 'GROUPPANEL', name: 'group2', visible: true, isShowCaption: true, form: this, uiActionGroup: { caption: '', langbase: 'worklist.main_form', extractMode: 'ITEM', details: [] } })
, 
        formpage2: new FormPageModel({ caption: '其它', detailType: 'FORMPAGE', name: 'formpage2', visible: true, isShowCaption: true, form: this })
, 
        form: new FormTabPanelModel({ caption: 'form', detailType: 'TABPANEL', name: 'form', visible: true, isShowCaption: true, form: this, tabPages: [{ name: 'formpage1', index: 0, visible: true }, { name: 'formpage2', index: 1, visible: true }] }),
    };

    /**
     * 监控表单属性 srfupdatedate 值
     *
     * @param {*} newVal
     * @param {*} oldVal
     * @memberof Main
     */
    @Watch('data.srfupdatedate')
    onSrfupdatedateChange(newVal: any, oldVal: any) {
        this.formDataChange({ name: 'srfupdatedate', newVal: newVal, oldVal: oldVal });
    }

    /**
     * 监控表单属性 srforikey 值
     *
     * @param {*} newVal
     * @param {*} oldVal
     * @memberof Main
     */
    @Watch('data.srforikey')
    onSrforikeyChange(newVal: any, oldVal: any) {
        this.formDataChange({ name: 'srforikey', newVal: newVal, oldVal: oldVal });
    }

    /**
     * 监控表单属性 srfkey 值
     *
     * @param {*} newVal
     * @param {*} oldVal
     * @memberof Main
     */
    @Watch('data.srfkey')
    onSrfkeyChange(newVal: any, oldVal: any) {
        this.formDataChange({ name: 'srfkey', newVal: newVal, oldVal: oldVal });
    }

    /**
     * 监控表单属性 srfmajortext 值
     *
     * @param {*} newVal
     * @param {*} oldVal
     * @memberof Main
     */
    @Watch('data.srfmajortext')
    onSrfmajortextChange(newVal: any, oldVal: any) {
        this.formDataChange({ name: 'srfmajortext', newVal: newVal, oldVal: oldVal });
    }

    /**
     * 监控表单属性 srftempmode 值
     *
     * @param {*} newVal
     * @param {*} oldVal
     * @memberof Main
     */
    @Watch('data.srftempmode')
    onSrftempmodeChange(newVal: any, oldVal: any) {
        this.formDataChange({ name: 'srftempmode', newVal: newVal, oldVal: oldVal });
    }

    /**
     * 监控表单属性 srfuf 值
     *
     * @param {*} newVal
     * @param {*} oldVal
     * @memberof Main
     */
    @Watch('data.srfuf')
    onSrfufChange(newVal: any, oldVal: any) {
        this.formDataChange({ name: 'srfuf', newVal: newVal, oldVal: oldVal });
    }

    /**
     * 监控表单属性 srfdeid 值
     *
     * @param {*} newVal
     * @param {*} oldVal
     * @memberof Main
     */
    @Watch('data.srfdeid')
    onSrfdeidChange(newVal: any, oldVal: any) {
        this.formDataChange({ name: 'srfdeid', newVal: newVal, oldVal: oldVal });
    }

    /**
     * 监控表单属性 srfsourcekey 值
     *
     * @param {*} newVal
     * @param {*} oldVal
     * @memberof Main
     */
    @Watch('data.srfsourcekey')
    onSrfsourcekeyChange(newVal: any, oldVal: any) {
        this.formDataChange({ name: 'srfsourcekey', newVal: newVal, oldVal: oldVal });
    }

    /**
     * 监控表单属性 worklistname 值
     *
     * @param {*} newVal
     * @param {*} oldVal
     * @memberof Main
     */
    @Watch('data.worklistname')
    onWorklistnameChange(newVal: any, oldVal: any) {
        this.formDataChange({ name: 'worklistname', newVal: newVal, oldVal: oldVal });
    }

    /**
     * 监控表单属性 createman 值
     *
     * @param {*} newVal
     * @param {*} oldVal
     * @memberof Main
     */
    @Watch('data.createman')
    onCreatemanChange(newVal: any, oldVal: any) {
        this.formDataChange({ name: 'createman', newVal: newVal, oldVal: oldVal });
    }

    /**
     * 监控表单属性 createdate 值
     *
     * @param {*} newVal
     * @param {*} oldVal
     * @memberof Main
     */
    @Watch('data.createdate')
    onCreatedateChange(newVal: any, oldVal: any) {
        this.formDataChange({ name: 'createdate', newVal: newVal, oldVal: oldVal });
    }

    /**
     * 监控表单属性 updateman 值
     *
     * @param {*} newVal
     * @param {*} oldVal
     * @memberof Main
     */
    @Watch('data.updateman')
    onUpdatemanChange(newVal: any, oldVal: any) {
        this.formDataChange({ name: 'updateman', newVal: newVal, oldVal: oldVal });
    }

    /**
     * 监控表单属性 updatedate 值
     *
     * @param {*} newVal
     * @param {*} oldVal
     * @memberof Main
     */
    @Watch('data.updatedate')
    onUpdatedateChange(newVal: any, oldVal: any) {
        this.formDataChange({ name: 'updatedate', newVal: newVal, oldVal: oldVal });
    }

    /**
     * 监控表单属性 worklistid 值
     *
     * @param {*} newVal
     * @param {*} oldVal
     * @memberof Main
     */
    @Watch('data.worklistid')
    onWorklistidChange(newVal: any, oldVal: any) {
        this.formDataChange({ name: 'worklistid', newVal: newVal, oldVal: oldVal });
    }


    /**
     * 重置表单项值
     *
     * @private
     * @param {{ name: string, newVal: any, oldVal: any }} { name, newVal, oldVal }
     * @memberof Main
     */
    private resetFormData({ name, newVal, oldVal }: { name: string, newVal: any, oldVal: any }): void {
    }

    /**
     * 表单逻辑
     *
     * @private
     * @param {{ name: string, newVal: any, oldVal: any }} { name, newVal, oldVal }
     * @memberof Main
     */
    private formLogic({ name, newVal, oldVal }: { name: string, newVal: any, oldVal: any }): void {
                









    }

    /**
     * 表单值变化
     *
     * @private
     * @param {{ name: string, newVal: any, oldVal: any }} { name, newVal, oldVal }
     * @returns {void}
     * @memberof Main
     */
    private formDataChange({ name, newVal, oldVal }: { name: string, newVal: any, oldVal: any }): void {
        if (this.ignorefieldvaluechange) {
            return;
        }
        this.resetFormData({ name: name, newVal: newVal, oldVal: oldVal });
        this.formLogic({ name: name, newVal: newVal, oldVal: oldVal });
        this.dataChang.next(JSON.stringify(this.data));
    }

    /**
     * 表单加载完成
     *
     * @private
     * @param {*} [data={}]
     * @memberof Main
     */
    private onFormLoad(data: any = {}): void {
        this.setFormEnableCond(data);
        this.fillForm(data);
        this.oldData = {};
        Object.assign(this.oldData, JSON.parse(JSON.stringify(this.data)));
        this.$store.commit('viewaction/setViewDataChange', { viewtag: this.viewtag, viewdatachange: false });
        this.formLogic({ name: '', newVal: null, oldVal: null });
    }

    /**
     * 值填充
     *
     * @param {*} [_datas={}]
     * @memberof Main
     */
    public fillForm(_datas: any = {}): void {
        this.ignorefieldvaluechange = true;
        Object.keys(_datas).forEach((name: string) => {
            if (this.data.hasOwnProperty(name)) {
                this.data[name] = _datas[name];
            }
        });
        this.$nextTick(function () {
            this.ignorefieldvaluechange = false;
        })
    }

    /**
     * 设置表单项是否启用
     *
     * @protected
     * @param {*} data
     * @memberof Main
     */
    protected setFormEnableCond(data: any): void {
        Object.values(this.detailsModel).forEach((detail: any) => {
            if (!Object.is(detail.detailType, 'FORMITEM')) {
                return;
            }
            const formItem: FormItemModel = detail;
            formItem.setEnableCond(data.srfuf);
        });
    }

    /**
     * 重置校验结果
     *
     * @memberof Main
     */
    public resetValidates(): void {
        Object.values(this.detailsModel).forEach((detail: any) => {
            if (!Object.is(detail.detailType, 'FORMITEM')) {
                return;
            }
            const formItem: FormItemModel = detail;
            formItem.setError('');
        });
    }

    /**
     * 填充校验结果 （后台）
     *
     * @param {any[]} fieldErrors
     * @memberof Main
     */
    public fillValidates(fieldErrors: any[]): void {
        fieldErrors.forEach((error: any) => {
            const formItem: FormItemModel = this.detailsModel[error.field];
            if (!formItem) {
                return;
            }
            this.$nextTick(() => {
                formItem.setError(error.message);
            });
        });
    }

    /**
     * 表单校验状态
     *
     * @returns {boolean} 
     * @memberof Main
     */
    public formValidateStatus(): boolean {
        const form: any = this.$refs.form;
        let validatestate: boolean = true;
        form.validate((valid: boolean) => {
            validatestate = valid ? true : false;
        });
        return validatestate
    }

    /**
     * 获取全部值
     *
     * @returns {*}
     * @memberof Main
     */
    public getValues(): any {
        return this.data;
    }

    /**
     * 表单项值变更
     *
     * @param {{ name: string, value: any }} $event
     * @returns {void}
     * @memberof Main
     */
    public onFormItemValueChange($event: { name: string, value: any }): void {
        if (!$event) {
            return;
        }
        if (!$event.name || Object.is($event.name, '') || !this.data.hasOwnProperty($event.name)) {
            return;
        }
        this.data[$event.name] = $event.value;
    }

    /**
     * 设置数据项值
     *
     * @param {string} name
     * @param {*} value
     * @returns {void}
     * @memberof Main
     */
    public setDataItemValue(name: string, value: any): void {
        if (!name || Object.is(name, '') || !this.data.hasOwnProperty(name)) {
            return;
        }
        if (Object.is(this.data[name], value)) {
            return;
        }
        this.data[name] = value;
    }



    /**
     * 分组界面行为事件
     *
     * @param {*} $event
     * @memberof Main
     */
    public groupUIActionClick($event: any): void {
        if (!$event) {
            return;
        }
        const item:any = $event.item;
    }

    /**
     * Vue声明周期(处理组件的输入属性)
     *
     * @memberof Main
     */
    public created(): void {
        if (this.viewState) {
            this.viewStateEvent = this.viewState.subscribe(({ tag, action, data }) => {
                if (!Object.is(tag, this.name)) {
                    return;
                }
                if (Object.is('autoload', action)) {
                    this.autoLoad(data);
                }
                if (Object.is('load', action)) {
                    this.load(data);
                }
                if (Object.is('loaddraft', action)) {
                    this.loadDraft(data);
                }
                if (Object.is('save', action)) {
                    this.save(data);
                }
            });
        }
        this.dataChang
            .pipe(
                debounceTime(300),
                distinctUntilChanged()
            ).subscribe((data: any) => {
                if (this.autosave) {
                    this.autoSave();
                }
                const state = !Object.is(JSON.stringify(this.oldData), JSON.stringify(this.data)) ? true : false;
                this.$store.commit('viewaction/setViewDataChange', { viewtag: this.viewtag, viewdatachange: state });
            });
    }

    /**
     * vue 生命周期
     *
     * @memberof Main
     */
    public destroyed() {
        if (this.viewStateEvent) {
            this.viewStateEvent.unsubscribe();
        }
        if (this.dataChangEvent) {
            this.dataChangEvent.unsubscribe();
        }
    }

    /**
     * 拷贝内容
     *
     * @param {*} [arg={}]
     * @memberof @memberof Main
     */
    public copy(arg: any = {}): void {
        this.loadDraft(arg);
    }

    /**
     * 部件刷新
     *
     * @param {any[]} args
     * @memberof Main
     */
    public refresh(args: any[]): void {
        let arg: any = {};
        if (this.data.srfkey && !Object.is(this.data.srfkey, '')) {
            Object.assign(arg, { srfkey: this.data.srfkey });
            this.load(arg);
            return;
        }
        if (this.data.srfkeys && !Object.is(this.data.srfkeys, '')) {
            Object.assign(arg, { srfkey: this.data.srfkeys });
            this.load(arg);
            return;
        }
    }

    /**
     * 自动加载
     *
     * @param {*} [arg={}]
     * @returns {void}
     * @memberof Main
     */
    public autoLoad(arg: any = {}): void {
        if (arg.srfkey && !Object.is(arg.srfkey, '')) {
            Object.assign(arg, { srfkey: arg.srfkey });
            this.load(arg);
            return;
        }
        if (arg.srfkeys && !Object.is(arg.srfkeys, '')) {
            Object.assign(arg, { srfkey: arg.srfkeys });
            this.load(arg);
            return;
        }
        this.loadDraft(arg);
    }

    /**
     * 加载
     *
     * @private
     * @param {*} [opt={}]
     * @memberof Main
     */
    private load(opt: any = {}): void {
        const arg: any = { ...opt };

        this.serialNumber++;
        const serialnumber = this.serialNumber;
        this.addSerialNumber(this.loadAction, serialnumber);

        const get: Promise<any> = this.$http.get(this.url + this.loadAction, arg, this.showBusyIndicator, serialnumber);
        get.then((response: any) => {
            const { serialnumber: _serialnumber } = response;
            const lastserialnumber = this.getSerialNumber(this.loadAction);
            if (_serialnumber && lastserialnumber && _serialnumber < lastserialnumber) {
                return;
            }

            if (response && response.status === 200) {
                const data = response.data;
                this.onFormLoad(data);
                this.$emit('load', data);
                this.$nextTick(() => {
                    this.formState.next({ type: 'load', data: data });
                });
            }
        }).catch((response: any) => {
            const { serialnumber: _serialnumber } = response;
            const lastserialnumber = this.getSerialNumber(this.loadAction);
            if (_serialnumber && lastserialnumber && _serialnumber < lastserialnumber) {
                return;
            }

            if (response && response.status === 401) {
                return;
            }
            if (!response || !response.status || !response.data) {
                this.$Notice.error({ title: '错误', desc: '系统异常' });
                return;
            }

            const { data: _data } = response;
            this.$Notice.error({ title: _data.title, desc: _data.message });
        });
    }

    /**
     * 加载草稿
     *
     * @param {*} [opt={}]
     * @memberof Main
     */
    public loadDraft(opt: any = {}): void {
        const arg: any = { ...opt } ;

        this.serialNumber++;
        const serialnumber = this.serialNumber;
        this.addSerialNumber(this.loaddraftAction, serialnumber);

        let post: Promise<any> = this.$http.post(this.url + this.loaddraftAction, arg, this.showBusyIndicator, serialnumber);
        post.then((response: any) => {
            const { serialnumber: _serialnumber } = response;
            const lastserialnumber = this.getSerialNumber(this.loaddraftAction);
            if (_serialnumber && lastserialnumber && _serialnumber < lastserialnumber) {
                return;
            }

            if (response && response.status === 200) {
                const data = response.data;
                this.onFormLoad(data);
                this.$emit('load', data);
                this.$nextTick(() => {
                    this.formState.next({ type: 'load', data: data });
                });
            }
        }).catch((response: any) => {
            const { serialnumber: _serialnumber } = response;
            const lastserialnumber = this.getSerialNumber(this.loaddraftAction);
            if (_serialnumber && lastserialnumber && _serialnumber < lastserialnumber) {
                return;
            }

            if (response && response.status === 401) {
                return;
            }
            if (!response || !response.status || !response.data) {
                this.$Notice.error({ title: '错误', desc: '系统异常' });
                return;
            }

            const { data: _data } = response;
            this.$Notice.error({ title: _data.title, desc: _data.message });
        });
    }

    /**
     * 自动保存
     *
     * @param {*} [opt={}]
     * @memberof Main
     */
    public autoSave(opt: any = {}): void {
        if (!this.formValidateStatus()) {
            return;
        }

        const arg: any = { ...opt };
        const data = this.getValues();
        Object.assign(arg, data);
        const action: any = Object.is(data.srfuf, '1') ? this.updateAction : this.createAction;

        this.serialNumber++;
        const serialnumber = this.serialNumber;
        this.addSerialNumber(action, serialnumber);

        const post: Promise<any> = this.$http.post(this.url + action, arg, false, serialnumber);
        post.then((response: any) => {
            const { serialnumber: _serialnumber } = response;
            const lastserialnumber = this.getSerialNumber(action);
            if (_serialnumber && lastserialnumber && _serialnumber < lastserialnumber) {
                return;
            }

            if (response && response.status === 200) {
                const data = response.data;
                this.onFormLoad(data);
                this.$emit('save', data);
                this.$store.dispatch('viewaction/datasaved', { viewtag: this.viewtag });
                this.$nextTick(() => {
                    this.formState.next({ type: 'save', data: data });
                });
            }
        }).catch((response: any) => {
            const { serialnumber: _serialnumber } = response;
            const lastserialnumber = this.getSerialNumber(action);
            if (_serialnumber && lastserialnumber && _serialnumber < lastserialnumber) {
                return;
            }

            if (response && response.status === 401) {
                return;
            }
            if (!response || !response.status || !response.data) {
                this.$Notice.error({ title: '错误', desc: '系统异常' });
                return;
            }

            const { data: _data } = response;
            if (Object.is(_data.status, 'BAD_REQUEST') && _data.parameters && _data.parameters.fieldErrors) {
                this.resetValidates();
                this.fillValidates(_data.parameters.fieldErrors)
            }
            this.$Notice.error({ title: _data.title, desc: _data.message });
        });
    }

    /**
     * 保存
     *
     * @param {*} [opt={}]
     * @param {boolean} [showResultInfo]
     * @returns {Promise<any>}
     * @memberof Main
     */
    public async save(opt: any = {}, showResultInfo?: boolean): Promise<any> {
        showResultInfo = showResultInfo === undefined ? true : false;
        if (!this.formValidateStatus()) {
            this.$Notice.error({ title: '错误', desc: '值规则校验异常' });
            return;
        }

        const arg: any = { ...opt };
        const data = this.getValues();
        Object.assign(arg, data);
        const action: any = Object.is(data.srfuf, '1') ? this.updateAction : this.createAction;

        this.serialNumber++;
        const serialnumber = this.serialNumber;
        this.addSerialNumber(action, serialnumber);

        const post: Promise<any> = this.$http.post(this.url + action, arg, this.showBusyIndicator, serialnumber);
        return new Promise((resolve: any, reject: any) => {
            post.then((response: any) => {
                const { serialnumber: _serialnumber } = response;
                const lastserialnumber = this.getSerialNumber(action);
                if (_serialnumber && lastserialnumber && _serialnumber < lastserialnumber) {
                    return;
                }

                if (!response.status || response.status !== 200) {
                    if (response.errorMessage) {
                        this.$Notice.error({ title: '错误', desc: response.errorMessage });
                    }
                    return;
                }

                const data = response.data;
                this.onFormLoad(data);
                this.$emit('save', data);
                this.$store.dispatch('viewaction/datasaved', { viewtag: this.viewtag });
                this.$nextTick(() => {
                    this.formState.next({ type: 'save', data: data });
                });
                if (showResultInfo) {
                    this.$Notice.success({ title: '', desc: (data.srfmajortext ? data.srfmajortext : '') + '&nbsp;保存成功！' });
                }

                resolve(response);
            }).catch((response: any) => {
                const { serialnumber: _serialnumber } = response;
                const lastserialnumber = this.getSerialNumber(action);
                if (_serialnumber && lastserialnumber && _serialnumber < lastserialnumber) {
                    return;
                }

                if (response && response.status === 401) {
                    return;
                }
                if (!response || !response.status || !response.data) {
                    this.$Notice.error({ title: '错误', desc: '系统异常' });
                    reject(response);
                    return;
                }

                const { data: _data } = response;
                if (Object.is(_data.status, 'BAD_REQUEST') && _data.parameters && _data.parameters.fieldErrors) {
                    this.resetValidates();
                    this.fillValidates(_data.parameters.fieldErrors)
                }
                this.$Notice.error({ title: _data.title, desc: _data.message });
                reject(response);
            });
        })
    }

    /**
     * 工作流提交
     *
     * @param {*} [data={}]
     * @returns {Promise<any>}
     * @memberof Main
     */
    public async wfstart(data: any = {}): Promise<any> {
        if (!data.srfkey || Object.is(data.srfkey, '')) {
            return;
        }

        const arg: any = { ...data };

        const action = 'wfstart';
        this.serialNumber++;
        const serialnumber = this.serialNumber;
        this.addSerialNumber(action, serialnumber);

        const post: Promise<any> = this.$http.post(this.url + action, arg, this.showBusyIndicator, serialnumber);

        return new Promise((resolve: any, reject: any) => {
            post.then((response: any) => {
                const { serialnumber: _serialnumber } = response;
                const lastserialnumber = this.getSerialNumber(action);
                if (_serialnumber && lastserialnumber && _serialnumber < lastserialnumber) {
                    return;
                }
                if (response && response.status === 401) {
                    return;
                }

                if (!response || response.status !== 200) {
                    this.$Notice.error({ title: '', desc: '工作流提交失败, ' + response.info });
                    return;
                }
                this.$Notice.info({ title: '', desc: '工作流启动成功' });
                resolve(response);
            }).catch((response: any) => {
                const { serialnumber: _serialnumber } = response;
                const lastserialnumber = this.getSerialNumber(action);
                if (_serialnumber && lastserialnumber && _serialnumber < lastserialnumber) {
                    return;
                }

                if (response && response.status === 401) {
                    return;
                }
                if (!response || !response.status || !response.data) {
                    this.$Notice.error({ title: '错误', desc: '系统异常' });
                    reject(response);
                    return;
                }

                const { data: _data } = response;
                if (Object.is(_data.status, 'BAD_REQUEST') && _data.parameters && _data.parameters.fieldErrors) {
                    this.resetValidates();
                    this.fillValidates(_data.parameters.fieldErrors)
                }
                this.$Notice.error({ title: _data.title, desc: _data.message });
                reject(response);
            });
        });
    }

    /**
     * 工作流提交
     *
     * @param {*} [data={}]
     * @returns {Promise<any>}
     * @memberof Main
     */
    public async wfsubmit(data: any = {}): Promise<any> {
        if (!data.srfkey || Object.is(data.srfkey, '')) {
            return;
        }

        const arg: any = { ...data };

        const action = 'wfsubmit';
        this.serialNumber++;
        const serialnumber = this.serialNumber;
        this.addSerialNumber(action, serialnumber);

        const post: Promise<any> = this.$http.post(this.url + action, arg, this.showBusyIndicator, serialnumber);

        return new Promise((resolve: any, reject: any) => {
            post.then((response: any) => {
                const { serialnumber: _serialnumber } = response;
                const lastserialnumber = this.getSerialNumber(action);
                if (_serialnumber && lastserialnumber && _serialnumber < lastserialnumber) {
                    return;
                }
                if (response && response.status === 401) {
                    return;
                }

                if (!response || response.status !== 200) {
                    this.$Notice.error({ title: '', desc: '工作流提交失败, ' + response.info });
                    return;
                }
                const { data: _data } = response;
                resolve(_data)

            }).catch((response: any) => {
                const { serialnumber: _serialnumber } = response;
                const lastserialnumber = this.getSerialNumber(action);
                if (_serialnumber && lastserialnumber && _serialnumber < lastserialnumber) {
                    return;
                }

                if (response && response.status === 401) {
                    return;
                }
                if (!response || !response.status || !response.data) {
                    this.$Notice.error({ title: '错误', desc: '系统异常' });
                    reject(response);
                    return;
                }

                const { data: _data } = response;
                if (Object.is(_data.status, 'BAD_REQUEST') && _data.parameters && _data.parameters.fieldErrors) {
                    this.resetValidates();
                    this.fillValidates(_data.parameters.fieldErrors)
                }
                this.$Notice.error({ title: _data.title, desc: _data.message });
                reject(response);
            });
        });
    }

    /**
     * 表单项更新
     *
     * @param {string} mode 界面行为名称
     * @param {*} [data={}] 请求数据
     * @param {string[]} updateDetails 更新项
     * @param {boolean} [showloading] 是否显示加载状态
     * @returns {void}
     * @memberof Main
     */
    public updateFormItems(mode: string, data: any = {}, updateDetails: string[], showloading?: boolean): void {
        if (!mode || (mode && Object.is(mode, ''))) {
            return;
        }
        const action = mode.toLowerCase();
        const arg: any = { ...data };

        this.serialNumber++;
        const serialnumber = this.serialNumber;
        this.addSerialNumber('updateformitem/' + action, serialnumber);

        const post: Promise<any> = this.$http.post(this.url + 'updateformitem/' + action, arg, showloading, serialnumber);
        post.then((response: any) => {
            const { serialnumber: _serialnumber } = response;
            const lastserialnumber = this.getSerialNumber('updateformitem/' + action);
            if (_serialnumber && lastserialnumber && _serialnumber < lastserialnumber) {
                return;
            }

            if (!response || response.status !== 200) {
                this.$Notice.error({ title: '错误', desc: '表单项更新失败' });
                return;
            }
            const data = response.data;
            const _data: any = {};
            updateDetails.forEach((name: string) => {
                if (!data.hasOwnProperty(name)) {
                    return;
                }
                Object.assign(_data, { [name]: data[name] });
            });
            this.setFormEnableCond(_data);
            this.fillForm(_data);
            this.formLogic({ name: '', newVal: null, oldVal: null });
            this.dataChang.next(JSON.stringify(this.data));
            this.$nextTick(() => {
                this.formState.next({ type: 'updateformitem', ufimode: arg.srfufimode, data: _data });
            });
        }).catch((response: any) => {
            const { serialnumber: _serialnumber } = response;
            const lastserialnumber = this.getSerialNumber('updateformitem/' + action);
            if (_serialnumber && lastserialnumber && _serialnumber < lastserialnumber) {
                return;
            }

            if (response && response.status === 401) {
                return;
            }
            if (!response || !response.status || !response.data) {
                this.$Notice.error({ title: '错误', desc: '系统异常' });
                return;
            }

            const { data: _data } = response;
            if (Object.is(_data.status, 'BAD_REQUEST') && _data.parameters && _data.parameters.fieldErrors) {
                this.resetValidates();
                this.fillValidates(_data.parameters.fieldErrors)
            }
            this.$Notice.error({ title: _data.title, desc: _data.message });
        });
    }

    /**
     * 回车事件
     *
     * @param {*} $event
     * @memberof Main
     */
    public onEnter($event: any): void {
    }

    /**
     * 内容绘制
     *
     * @returns
     * @memberof Main
     */
    public render() {
        return (
            <i-form props={{ model: this.data }} class='app-form' ref='form' style="">
    <input style={{ display: 'none' }}></input>
    <row >
    <tabs animated={false} name='form' value={this.detailsModel.form.activiedPage} 
        on-on-click={($event: any) => this.detailsModel.form.clickPage($event)}>
        {
            this.detailsModel.formpage1.visible ?
            <tab-pane name='formpage1' index={0} tab='form' class=''  
                label={
                    (h: any) => {
                        return (
                            <span class='caption'>
                                {this.$t('worklist.main_form.details.formpage1')}
                            </span>
                        );
                    }
                }>
                
    <i-col v-show={this.detailsModel.group1.visible} style=''  lg={{ span: 24, offset: 0 }}>
    <app-form-group layoutType="TABLE_24COL" class='' uiActionGroup={this.detailsModel.group1.uiActionGroup} on-groupuiactionclick={($event:any) => this.groupUIActionClick($event)} caption={this.$t('worklist.main_form.details.group1')} isShowCaption={true} uiStyle={'DEFAULT'} titleBarCloseMode={0} isInfoGroupMode={false}>
    <row>
        <i-col v-show={this.detailsModel.worklistname.visible} style=''  lg={{ span: 24, offset: 0 }}>
    <app-form-item name='worklistname' itemRules={JSON.stringify(this.rules.worklistname)} class='' caption={this.$t('worklist.main_form.details.worklistname')} uiStyle='DEFAULT' labelWidth={130} isShowCaption={true} error={this.detailsModel.worklistname.error} isEmptyCaption={false} labelPos='LEFT'> 
    <input-box v-model={this.data.worklistname}  on-enter={($event: any) => this.onEnter($event)} disabled={this.detailsModel.worklistname.disabled} type='string'  style=""></input-box>
</app-form-item>

</i-col>

    </row>
</app-form-group>
</i-col>


            </tab-pane> 
            : ''
        }
        {
            this.detailsModel.formpage2.visible ?
            <tab-pane name='formpage2' index={1} tab='form' class=''  
                label={
                    (h: any) => {
                        return (
                            <span class='caption'>
                                {this.$t('worklist.main_form.details.formpage2')}
                            </span>
                        );
                    }
                }>
                
    <i-col v-show={this.detailsModel.group2.visible} style=''  lg={{ span: 24, offset: 0 }}>
    <app-form-group layoutType="TABLE_24COL" class='' uiActionGroup={this.detailsModel.group2.uiActionGroup} on-groupuiactionclick={($event:any) => this.groupUIActionClick($event)} caption={this.$t('worklist.main_form.details.group2')} isShowCaption={true} uiStyle={'DEFAULT'} titleBarCloseMode={0} isInfoGroupMode={false}>
    <row>
        <i-col v-show={this.detailsModel.createman.visible} style=''  lg={{ span: 24, offset: 0 }}>
    <app-form-item name='createman' itemRules={JSON.stringify(this.rules.createman)} class='' caption={this.$t('worklist.main_form.details.createman')} uiStyle='DEFAULT' labelWidth={130} isShowCaption={true} error={this.detailsModel.createman.error} isEmptyCaption={false} labelPos='LEFT'> 
    <span style="">{this.data.createman}</span>
</app-form-item>

</i-col>
<i-col v-show={this.detailsModel.createdate.visible} style=''  lg={{ span: 24, offset: 0 }}>
    <app-form-item name='createdate' itemRules={JSON.stringify(this.rules.createdate)} class='' caption={this.$t('worklist.main_form.details.createdate')} uiStyle='DEFAULT' labelWidth={130} isShowCaption={true} error={this.detailsModel.createdate.error} isEmptyCaption={false} labelPos='LEFT'> 
    <span style="">{this.data.createdate}</span>
</app-form-item>

</i-col>
<i-col v-show={this.detailsModel.updateman.visible} style=''  lg={{ span: 24, offset: 0 }}>
    <app-form-item name='updateman' itemRules={JSON.stringify(this.rules.updateman)} class='' caption={this.$t('worklist.main_form.details.updateman')} uiStyle='DEFAULT' labelWidth={130} isShowCaption={true} error={this.detailsModel.updateman.error} isEmptyCaption={false} labelPos='LEFT'> 
    <span style="">{this.data.updateman}</span>
</app-form-item>

</i-col>
<i-col v-show={this.detailsModel.updatedate.visible} style=''  lg={{ span: 24, offset: 0 }}>
    <app-form-item name='updatedate' itemRules={JSON.stringify(this.rules.updatedate)} class='' caption={this.$t('worklist.main_form.details.updatedate')} uiStyle='DEFAULT' labelWidth={130} isShowCaption={true} error={this.detailsModel.updatedate.error} isEmptyCaption={false} labelPos='LEFT'> 
    <span style="">{this.data.updatedate}</span>
</app-form-item>

</i-col>

    </row>
</app-form-group>
</i-col>


            </tab-pane> 
            : ''
        }
    </tabs>
    </row>
</i-form>
        );
    }
}