import { Component, Vue, Prop, Model, Watch } from 'vue-property-decorator';
import './app-picker.less';
import { Subject } from 'rxjs';
import { AppModal } from '@/utils';

@Component({})
export default class AppPicker extends Vue {

    /**
     * 表单数据
     *
     * @type {*}
     * @memberof AppPicker
     */
    @Prop() public data!: any;

    /**
     * 属性项名称
     *
     * @type {string}
     * @memberof AppPicker
     */
    @Prop() public name!: string;

    /**
     * 是否启用
     *
     * @type {boolean}
     * @memberof AppPicker
     */
    @Prop() public disabled?: boolean;

    /**
     * 类型
     *
     * @type {string}
     * @memberof AppPicker
     */
    @Prop() public editortype?: string;

    /**
     * 视图名称
     *
     * @type {string}
     * @memberof AppPicker
     */
    @Prop() public refviewname?: string;

    /**
     * 视图参数（如：视图name，title，width，height）
     *
     * @type {*}
     * @memberof AppPicker
     */
    @Prop() public pickupView?: any;

    /**
     * 数据链接参数
     *
     * @type {*}
     * @memberof AppPicker
     */
    @Prop() public linkview?: any;

    /**
     * 表单项参数
     * 
     * @type {any}
     * @memberof AppPicker
     */
    @Prop() public itemParam: any;

    /**
     * 值项名称
     *
     * @type {string}
     * @memberof AppPicker
     */
    @Prop() public valueitem?: string;

    /**
     * 值
     *
     * @type {*}
     * @memberof AppPicker
     */
    @Model('change') public value?: any;

    /**
     * 当前值
     *
     * @type {string}
     * @memberof AppPicker
     */
    public curvalue: string = '';

    /**   
     * 远程请求url 地址
     *
     * @type {string}
     * @memberof AppPicker
     */
    @Prop() public url?: string;

    /**
     * 下拉数组
     * @type {any[]}
     * @memberof AppPicker
     */
    public items: any[] = [];

    /** 
     * 下拉图标指向状态管理
     * @type {boolean}
     * @memberof AppPicker 
     */
    public open: boolean = false;

    /**
     * 输入状态
     *
     * @type {boolean}
     * @memberof AppAutocomplete
     */
    public inputState: boolean = false;

    /**
     * 项绘制
     *
     * @type {Function}
     * @memberof AppPicker
     */
    @Prop() renderItem?: Function;

    /**
     * 获取关联数据项值
     *
     * @readonly
     * @memberof AppPicker
     */
    get refvalue() {
        if (this.valueitem && this.data) {
            return this.data[this.valueitem];
        }
        return this.curvalue;
    }

    /**
     * 值变化
     *
     * @param {*} newVal
     * @param {*} oldVal
     * @memberof AppPicker
     */
    @Watch('value')
    public onValueChange(newVal: any, oldVal: any) {
        this.curvalue = newVal;
        if (Object.is(this.editortype, 'dropdown') && this.valueitem) {
            const value = this.data[this.valueitem];
            const index = this.items.findIndex((item: any) => Object.is(item.value, value));
            if (index !== -1) {
                return;
            }
            this.items = [];
            //this.onSearch(newVal, null, false);
        }
    }

    /**
     * vue 生命周期
     *
     * @memberof AppPicker
     */
    public mounted() {
        if (Object.is(this.editortype, 'dropdown') && this.valueitem) {
            const value = this.data[this.valueitem];
            const index = this.items.findIndex((item: any) => Object.is(item.value, value));
            if (index !== -1) {
                return;
            }
            this.items = [];
            if (value) {
                this.items.push({text: this.value, value: value});
            }
        }        
    }

    /**
     * 组件销毁
     *
     * @memberof AppPicker
     */
    public destroyed(): void {
    }

    /**
     * 下拉切换回调
     * @param flag 
     */
    public onSelectOpen(flag: boolean): void {
        this.open = flag;
        if (this.open) {
            this.onSearch(this.curvalue, null, true);
        }
    }

    /**
     * 执行搜索数据
     * @param query 
     * @param callback 
     */
    public onSearch(query: any, callback: any, other: boolean): void {

        query = !query ? '' : query;
        if (!this.inputState && other && Object.is(query, this.value)) {
            query = '';
        }
        this.inputState = false;
        const url = `${this.url}${this.name}/ac`;
        let param: any = {};
        Object.assign(param, this.data);
        // 清除值项
        if (other && this.valueitem) {
            delete param[this.valueitem];
        }
        Object.assign(param, { [this.name]: query });

        this.$http.post(url, param).then((response: any) => {
            if (!response || response.status !== 200) {
                this.$Notice.error({ title: '错误', desc: '请求异常' });
            } else {
                this.items = [...response.data];
            }
            if (callback) {
                callback(this.items);
            }
        }).catch((error: any) => {
            if (callback) {
                callback([]);
            }
        });
    }

    /**
     * 选中数据回调
     * @param item 
     */
    public onACSelect(item: any): void {
        if (this.name) {
            this.$emit('formitemvaluechange', { name: this.name, value: item.text });
        }
        if (this.valueitem) {
            this.$emit('formitemvaluechange', { name: this.valueitem, value: item.value });
        }

    }

    /**
     * 下拉选中
     *
     * @param {string} val
     * @memberof AppPicker
     */
    public onSelect(val: string) {
        let index = this.items.findIndex((item) => Object.is(item.value, val));
        if (index >= 0) {
            this.onACSelect(this.items[index]);
        }
    }

    /**
     * 失去焦点事件
     * @param e 
     */
    public onBlur(e: any): void {
        let val: string = e.target.value;
        if (!Object.is(val, this.curvalue)) {
            this.onACSelect({ text: val, value: '' });
        }
        this.$forceUpdate();
    }

    /**
     * 清除
     */
    public onClear($event: any): void {
        if (this.name) {
            this.$emit('formitemvaluechange', { name: this.name, value: '' });
        }
        if (this.valueitem) {
            this.$emit('formitemvaluechange', { name: this.valueitem, value: '' });
        }
        this.$forceUpdate();
    }

    /**
     * 打开视图
     */
    public openView($event: any): void {
        if (this.disabled) {
            return;
        }
        // 填充条件判断
        let arg: any = {};
        const bcancel: boolean = this.fillPickupCondition(arg);
        if (!bcancel) {
            return;
        }

        let data = { srfparentdata: arg };
        const view = { ...this.pickupView };
        let modalContainer: Subject<any>;
        if (view.placement && !Object.is(view.placement, '')) {
            if (Object.is(view.placement, 'POPOVER')) {
                modalContainer = this.$apppopover.openPop($event, view, data);
            } else {
                modalContainer = this.$appdrawer.openDrawer(view, data);
            }
        } else {
            modalContainer = AppModal.getInstance().openModal(view, data);
        }
        modalContainer.subscribe((result: any) => {
            if (!result || !Object.is(result.ret, 'OK')) {
                return;
            }

            this.openViewClose(result);
        })
    }

    /**
     * 路由模式打开视图
     *
     * @private
     * @param {string} viewpath
     * @param {*} data
     * @memberof AppPicker
     */
    private openIndexViewTab(viewpath: string, data: any): void {
        const _params = this.$util.prepareRouteParmas({
            route: this.$route,
            sourceNode: this.$route.name,
            targetNode: viewpath,
            data: data,
        });
        this.$router.push({ name: viewpath, params: _params });
    }

    /**
     * 模态模式打开视图
     *
     * @private
     * @param {*} view
     * @param {*} data
     * @memberof AppPicker
     */
    private openPopupModal(view: any, data: any): void {
        let container: Subject<any> = this.$appmodal.openModal(view, data);
        container.subscribe((result: any) => {
            if (!result || !Object.is(result.ret, 'OK')) {
                return;
            }
            this.openViewClose(result);
        });
    }

    /**
     * 抽屉模式打开视图
     *
     * @private
     * @param {*} view
     * @param {*} data
     * @memberof AppPicker
     */
    private openDrawer(view: any, data: any): void {
        let container: Subject<any> = this.$appdrawer.openDrawer(view, data);
        container.subscribe((result: any) => {
            if (!result || !Object.is(result.ret, 'OK')) {
                return;
            }
            this.openViewClose(result);
        });
    }

    /**
     * 气泡卡片模式打开
     *
     * @private
     * @param {*} $event
     * @param {*} view
     * @param {*} data
     * @memberof AppPicker
     */
    private openPopOver($event: any, view: any, data: any): void {
        let container: Subject<any> = this.$apppopover.openPop($event, view, data);
        container.subscribe((result: any) => {
            if (!result || !Object.is(result.ret, 'OK')) {
                return;
            }
            this.openViewClose(result);
        });
    }

    /**
     * 独立里面弹出
     *
     * @private
     * @param {string} url
     * @memberof AppPicker
     */
    private openPopupApp(url: string): void {
        window.open(url, '_blank');
    }

    /**
     * 打开重定向视图
     *
     * @private
     * @param {*} $event
     * @param {*} view
     * @param {*} data
     * @memberof AppPicker
     */
    private openRedirectView($event: any, view: any, data: any): void {
        this.$http.get(view.url, data).then((response: any) => {
            if (!response || response.status !== 200) {
                this.$Notice.error({ title: '错误', desc: '请求异常' });
            }
            if (response.status === 401) {
                return;
            }
            const { data: result } = response;

            if (result.viewparams && !Object.is(result.viewparams.srfkey, '')) {
                Object.assign(data, { srfkey: result.viewparams.srfkey });
            }

            if (Object.is(result.openmode, 'POPUPAPP') && result.url && !Object.is(result.url, '')) {
                this.openPopupApp(result.url);
            } else if (Object.is(result.openmode, 'INDEXVIEWTAB') || Object.is(result.openmode, '')) {
                const viewpath = `${result.viewmodule}_${result.viewname}`.toLowerCase();
                // 所有数据保持在同一级
                if (data.srfparentdata) {
                    Object.assign(data, data.srfparentdata);
                    delete data.srfparentdata;
                }
                this.openIndexViewTab(viewpath, data);
            } else if (Object.is(result.openmode, 'POPUPMODAL')) {
                const viewname = this.$util.srfFilePath2(result.viewname);
                const view: any = {
                    viewname: viewname,
                    title: result.title,
                    width: result.width,
                    height: result.height,
                }
                this.openPopupModal(view, data);
            } else if (result.openmode.startsWith('DRAWER')) {
                const viewname = this.$util.srfFilePath2(result.viewname);
                const view: any = {
                    viewname: viewname,
                    title: result.title,
                    width: result.width,
                    height: result.height,
                    placement: result.openmode,
                }
                this.openDrawer(view, data);
            } else if (Object.is(result.openmode, 'POPOVER')) {
                const viewname = this.$util.srfFilePath2(result.viewname);
                const view: any = {
                    viewname: viewname,
                    title: result.title,
                    width: result.width,
                    height: result.height,
                    placement: result.openmode,
                }
                this.openPopOver($event, view, data);
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
        });
    }

    /**
     * 打开链接视图
     *
     * @memberof AppPicker
     */
    public openLinkView($event: any): void {
        let srfkey: string;
        if (!this.data || !this.valueitem || !this.data[this.valueitem]) {
            this.$Notice.error({ title: '错误', desc: '值项异常!' });
            return;
        }
        srfkey = this.data[this.valueitem];
        let data = { srfkey: srfkey };
        const view = JSON.parse(JSON.stringify(this.linkview));
        const viewname2: string = this.$util.srfFilePath2(view.viewname);

        if (view.isRedirectView) {
            this.openRedirectView($event, view, data);
        } else if (Object.is(view.placement, 'INDEXVIEWTAB') || Object.is(view.placement, '')) {
            let viewname = `${this.linkview.viewmodule}_${this.linkview.viewname}`.toLocaleLowerCase();
            this.openIndexViewTab(viewname, data);
        } else if (Object.is(view.placement, 'POPOVER')) {
            view.viewname = viewname2;
            this.openPopOver($event, view, data);
        } else if (Object.is(view.placement, 'POPUPMODAL')) {
            view.viewname = viewname2;
            this.openPopupModal(view, data);
        } else if (view.placement.startsWith('DRAWER')) {
            view.viewname = viewname2;
            this.openDrawer(view, data);
        }
    }

    /**
     * 打开页面关闭
     *
     * @param {*} result
     * @memberof AppPicker
     */
    public openViewClose(result: any) {
        let item: any = {};
        if (result.datas && Array.isArray(result.datas)) {
            Object.assign(item, result.datas[0]);
        }

        if (this.data) {
            if (this.name) {
                this.$emit('formitemvaluechange', { name: this.name, value: item.srfmajortext });
            }
            if (this.valueitem) {
                this.$emit('formitemvaluechange', { name: this.valueitem, value: item.srfkey });
            }
        }
    }

    /**
     * 填充表单条件
     *
     * @param {*} arg
     * @returns
     * @memberof AppPicker
     */
    public fillPickupCondition(arg: any): boolean {
        if (!this.itemParam) {
            return true;
        }
        if (!this.data) {
            this.$Notice.error({ title: '错误', desc: '表单数据异常' });
            return false;
        }
        if (this.itemParam.parentdata) {
            return Object.keys(this.itemParam.parentdata).every((name: string) => {
                if (!name) {
                    return true;
                }
                let value: string = this.itemParam.parentdata[name];
                if (value && value.startsWith('%') && value.endsWith('%')) {
                    const key: string = value.substring(1, value.length - 1);
                    if (!this.data.hasOwnProperty(key)) {
                        this.$Notice.error({ title: '错误', desc: `操作失败,未能找到当前表单项${key}，无法继续操作` });
                        return false;
                    }
                    value = this.data[key];
                }
                Object.assign(arg, { [name]: value });
                return true;
            });
        }
        return true;
    }

    /**
     * 输入过程中
     *
     * @memberof AppAutocomplete
     */
    public onInput($event: any) {
        if (Object.is($event, this.value)) {
            this.inputState = true;
        }
    }

    /**
     * 展开下拉
     *
     * @memberof AppPicker
     */
    public openDropdown() {
        const appPicker: any = this.$refs.appPicker;
        if(appPicker) {
            appPicker.focus();
        }
    }

    /**
     * 收起下拉
     *
     * @memberof AppPicker
     */
    public closeDropdown() {
        const appPicker: any = this.$refs.appPicker;
        if(appPicker) {
            appPicker.blur();
        }
    }
    
    /**
     * 其他绘制
     *
     * @returns
     * @memberof AppPicker
     */
    public renderOther() {
        let content = {
            scopedSlots: {
                default: (props: any) => {
                    if (this.renderItem) {
                        return this.renderItem(props.item);
                    }
                }
            }
        };
        return (
            <div class='app-picker'>
                <el-autocomplete class='text-value' value-key='text' disabled={this.disabled} v-model={this.curvalue} size='small'
                    trigger-on-focus={true} fetch-suggestions={(query: any, callback: any) => { this.onSearch(query, callback, true) }} on-select={(item: any) => { this.onACSelect(item) }}
                    on-input={($event: any) => this.onInput($event)} on-blur={($event: any) => { this.onBlur($event) }} style='width:100%;' {...content}>
                    <template slot='suffix'>
                        {(this.curvalue && !this.disabled) ? <i class='el-icon-circle-close' on-click={($event: any) => { this.onClear($event) }}></i> : ''}
                        {!Object.is(this.editortype, 'ac') ? <i class='el-icon-search' on-click={($event: any) => { this.openView($event) }}></i> : ''}
                        {this.linkview ? <icon type="ios-open-outline" on-click={($event: any) => { this.openLinkView($event) }} /> : ''}
                    </template >
                </el-autocomplete >
            </div >
        );
    }

    /**
     * 绘制选择无ac
     *
     * @returns
     * @memberof AppPicker
     */
    public renderPickupNoAC() {
        return (
            <div class='app-picker'>
                <el-input class='text-value' value={this.curvalue} readonly size='small' disabled={this.disabled}>
                    <template slot='suffix'>
                        {(this.curvalue && !this.disabled) ? <i class='el-icon-circle-close' on-click={($event: any) => this.onClear($event)}></i> : ''}
                        <i class='el-icon-search' on-click={($event: any) => this.openView($event)}></i>
                        {this.linkview ? <icon type="ios-open-outline" on-click={($event: any) => { this.openLinkView($event) }} /> : ''}
                    </template>
                </el-input>
            </div >
        );
    }

    /**
     * 绘制下拉
     *
     * @returns
     * @memberof AppPicker
     */
    public renderDropdown() {
        return (
            <div class='app-picker'>
                <el-select ref="appPicker" remote remote-method={(query: any) => this.onSearch(query, null, true)} value={this.refvalue} size='small' filterable
                    on-change={($event: any) => this.onSelect($event)} disabled={this.disabled} style='width:100%;' clearable
                    on-clear={($event: any) => this.onClear($event)} on-visible-change={($event: any) => this.onSelectOpen($event)}>
                    {this.items ? this.items.map((_item: any) => {
                        return <el-option key={_item.value} value={_item.value} label={_item.text} disabled={_item.disabled}></el-option>;
                    }) : ''}
                </el-select>
                <span style='position: absolute;right: 5px;color: #c0c4cc;top:0;font-size: 13px;'>
                    <i v-show={this.open} class='el-icon-arrow-up' on-click={() => this.closeDropdown()}></i> 
                    <i v-show={!this.open} class='el-icon-arrow-down' on-click={() => this.openDropdown()}></i>
                </span>
            </div >
        );
    }

    /**
     * 数据链接
     *
     * @returns
     * @memberof AppPicker
     */
    public renderLinkOnly() {
        return (
            <div class='app-picker'>
                <a on-click={($event: any) => { this.openLinkView($event) }}>{this.curvalue}</a>
            </div>
        );
    }

    /**
     * 绘制内容
     *
     * @memberof AppPicker
     */
    public render() {
        if (Object.is(this.editortype, 'linkonly')) {
            return this.renderLinkOnly();
        } else if (!Object.is(this.editortype, 'pickup-no-ac') && !Object.is(this.editortype, 'dropdown')) {
            return this.renderOther();
        } else if (Object.is(this.editortype, 'pickup-no-ac')) {
            return this.renderPickupNoAC();
        } else if (Object.is(this.editortype, 'dropdown')) {
            return this.renderDropdown();
        }
    }
}