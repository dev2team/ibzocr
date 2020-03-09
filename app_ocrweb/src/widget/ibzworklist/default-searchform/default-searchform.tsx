import { Vue, Component, Prop, Provide, Emit, Watch } from 'vue-property-decorator';
import { CreateElement } from 'vue';
import { Subject, Subscription } from 'rxjs';
import { ControlInterface } from '@/interface/control';
import { UICounter } from '@/utils';
import './default-searchform.less';


import { FormButtonModel, FormPageModel, FormItemModel, FormDRUIPartModel, FormPartModel, FormGroupPanelModel, FormIFrameModel, FormRowItemModel, FormTabPageModel, FormTabPanelModel, FormUserControlModel } from '@/model/form-detail';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';


@Component({
    components: {
         
    }
})
export default class Default extends Vue implements ControlInterface {

    /**
     * 名称
     *
     * @type {string}
     * @memberof Default
     */
    @Prop() public name?: string;

    /**
     * 视图通讯对象
     *
     * @type {Subject<ViewState>}
     * @memberof Default
     */
    @Prop() public viewState!: Subject<ViewState>;

    /**
     * 视图状态事件
     *
     * @protected
     * @type {(Subscription | undefined)}
     * @memberof Default
     */
    protected viewStateEvent: Subscription | undefined;
    


    /**
     * 序列号
     *
     * @private
     * @type {number}
     * @memberof Default
     */
    private serialNumber: number = this.$util.createSerialNumber();

    /**
     * 请求行为序列号数组
     *
     * @private
     * @type {any[]}
     * @memberof Default
     */
    private serialsNumber: any[] = [];

    /**
     * 添加序列号
     *
     * @private
     * @param {*} action
     * @param {number} serialnumber
     * @memberof Default
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
     * @memberof Default
     */
    private getSerialNumber(action: any): number {
        const index = this.serialsNumber.findIndex((serial: any) => Object.is(serial.action, action));
        return this.serialsNumber[index].serialnumber;
    }

    /**
     * 关闭视图
     *
     * @param {any[]} args
     * @memberof Default
     */
    public closeView(args: any[]): void {
        let _this: any = this;
        _this.$emit('closeview', args);
    }


    /**
     * 获取多项数据
     *
     * @returns {any[]}
     * @memberof Default
     */
    public getDatas(): any[] {
        return [this.data];
    }

    /**
     * 获取单项树
     *
     * @returns {*}
     * @memberof Default
     */
    public getData(): any {
        return this.data;
    }

    /**
     * 是否默认保存
     *
     * @type {boolean}
     * @memberof Default
     */
    @Prop({ default: false }) public autosave?: boolean;

    /**
     * 显示处理提示
     *
     * @type {boolean}
     * @memberof Default
     */
    @Prop({ default: true }) public showBusyIndicator?: boolean;

    /**
     * 部件行为--更新
     *
     * @type {string}
     * @memberof Default
     */
    @Prop() public updateAction?: string;

    /**
     * 部件行为--加载草稿
     *
     * @type {string}
     * @memberof Default
     */
    @Prop() public loaddraftformAction?: string;

    /**
     * 部件行为--删除
     *
     * @type {string}
     * @memberof Default
     */
    @Prop() public removeAction?: string;

    /**
     * 部件行为--加载草稿
     *
     * @type {string}
     * @memberof Default
     */
    @Prop() public loaddraftAction?: string;

    /**
     * 部件行为--加载
     *
     * @type {string}
     * @memberof Default
     */
    @Prop() public loadAction?: string;

    /**
     * 部件行为--创建
     *
     * @type {string}
     * @memberof Default
     */
    @Prop() public createAction?: string;

    /**
     * 视图标识
     *
     * @type {string}
     * @memberof Default
     */
    @Prop() public viewtag!: string;

    /**
     * Api地址
     *
     * @type {string}
     * @memberof Default
     */
    public url: string = 'ocrweb/ibizutil/worklist/defaultsearchform/';

    /**
     * 表单状态
     *
     * @type {Subject<any>}
     * @memberof Default
     */
    public formState: Subject<any> = new Subject();

    /**
     * 忽略表单项值变化
     *
     * @type {boolean}
     * @memberof Default
     */
    public ignorefieldvaluechange: boolean = false;

    /**
     * 数据变化
     *
     * @private
     * @type {Subject<any>}
     * @memberof Default
     */
    private dataChang: Subject<any> = new Subject();

    /**
     * 视图状态事件
     *
     * @private
     * @type {(Subscription | undefined)}
     * @memberof Default
     */
    private dataChangEvent: Subscription | undefined;

    /**
     * 原始数据
     *
     * @private
     * @type {*}
     * @memberof Default
     */
    private oldData: any = {};

    /**
     * 表单数据对象
     *
     * @type {*}
     * @memberof Default
     */
    public data: any = {
    };

    /**
     * 属性值规则
     *
     * @type {*}
     * @memberof Default
     */
    public rules: any = {
    }

    /**
     * 详情模型集合
     *
     * @type {*}
     * @memberof Default
     */
    public detailsModel: any = {
        formpage1: new FormPageModel({ caption: '常规条件', detailType: 'FORMPAGE', name: 'formpage1', visible: true, isShowCaption: true, form: this })
, 
    };


    /**
     * 重置表单项值
     *
     * @private
     * @param {{ name: string, newVal: any, oldVal: any }} { name, newVal, oldVal }
     * @memberof Default
     */
    private resetFormData({ name, newVal, oldVal }: { name: string, newVal: any, oldVal: any }): void {
    }

    /**
     * 表单逻辑
     *
     * @private
     * @param {{ name: string, newVal: any, oldVal: any }} { name, newVal, oldVal }
     * @memberof Default
     */
    private formLogic({ name, newVal, oldVal }: { name: string, newVal: any, oldVal: any }): void {
                

    }

    /**
     * 表单值变化
     *
     * @private
     * @param {{ name: string, newVal: any, oldVal: any }} { name, newVal, oldVal }
     * @returns {void}
     * @memberof Default
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
     * @memberof Default
     */
    private onFormLoad(data: any = {}): void {
        this.setFormEnableCond(data);
        this.fillForm(data);
        this.formLogic({ name: '', newVal: null, oldVal: null });
    }

    /**
     * 值填充
     *
     * @param {*} [_datas={}]
     * @memberof Default
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
     * @memberof Default
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
     * @memberof Default
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
     * @memberof Default
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
     * @memberof Default
     */
    public formValidateStatus(): boolean {
        const form: any = this.$refs.searchform;
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
     * @memberof Default
     */
    public getValues(): any {
        return this.data;
    }

    /**
     * 表单项值变更
     *
     * @param {{ name: string, value: any }} $event
     * @returns {void}
     * @memberof Default
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
     * @memberof Default
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
     * @memberof Default
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
     * @memberof Default
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
            });
    }

    /**
     * vue 生命周期
     *
     * @memberof Default
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
     * @memberof @memberof Default
     */
    public copy(arg: any = {}): void {
        this.loadDraft(arg);
    }

    /**
     * 部件刷新
     *
     * @param {any[]} args
     * @memberof Default
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
     * @memberof Default
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
     * @memberof Default
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
     * @memberof Default
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
     * @memberof Default
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
     * @memberof Default
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
     * 表单项更新
     *
     * @param {string} mode 界面行为名称
     * @param {*} [data={}] 请求数据
     * @param {string[]} updateDetails 更新项
     * @param {boolean} [showloading] 是否显示加载状态
     * @returns {void}
     * @memberof Default
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
     * @memberof Default
     */
    public onEnter($event: any): void {
        this.$emit('load', this.data);
    }

    /**
     * 搜索
     *
     * @memberof Default
     */
    public onSearch() {
        this.$emit('load', this.data);
    }

    /**
     * 重置
     *
     * @memberof Default
     */
    public onReset() {
        this.loadDraft();
    }

    /**
     * 内容绘制
     *
     * @returns
     * @memberof Default
     */
    public render() {
        return (
            <i-form props={{ model: this.data }} class='app-search-form' ref='searchform'>
    <input style={{ display: 'none' }}></input>
    <row >
        
    

    </row>

    <el-dropdown 
        class='search_reset' 
        size='small' 
        split-button={true} 
        trigger='click' 
        on-click={() => this.onSearch()} 
        on-command={() => this.onReset()}>
        {this.$t('app.searchButton.search')}
        <el-dropdown-menu slot='dropdown'>
            <el-dropdown-item>{this.$t('app.searchButton.reset')}</el-dropdown-item>
        </el-dropdown-menu>
    </el-dropdown>
</i-form>
        );
    }
}