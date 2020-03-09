import { Component, Vue, Prop, Model, Watch } from 'vue-property-decorator';
import './app-autocomplete.less';
import { Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';

@Component({})
export default class AppAutocomplete extends Vue {

    /**
     * 表单数据
     *
     * @type {*}
     * @memberof AppAutocomplete
     */
    @Prop() public data: any;

    /**
     * 是否启用
     *
     * @type {boolean}
     * @memberof AppAutocomplete
     */
    @Prop() public disabled?: boolean;

    /**
     * 属性项名称
     *
     * @type {string}
     * @memberof AppAutocomplete
     */
    @Prop() public name!: string;

    /**
     * 值项名称
     *
     * @type {string}
     * @memberof AppAutocomplete
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
     * @memberof AppAutocomplete
     */
    @Prop() public url?: string;

    /**
     * 数组
     *
     * @type {any[]}
     * @memberof AppAutocomplete
     */
    public items: any[] = [];

    /**
     * 输入状态
     *
     * @type {boolean}
     * @memberof AppAutocomplete
     */
    public inputState: boolean = false;

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
    }

    /**
     * 执行搜索数据
     * @param query 
     * @param callback 
     */
    public onSearch(query: any, callback: any): void {
        query = !query ? '' : query;
        if (!this.inputState && Object.is(query, this.value)) {
            query = '';
        }
        this.inputState = false;
        const url = `${this.url}${this.name}/ac`;
        let param: any = {};
        Object.assign(param, this.data);
        // 清除值项
        if (this.valueitem) {
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
     * 失去焦点事件
     * @param e 
     */
    public onBlur(e: any): void {
        let val: string = e.target.value;
        if (!Object.is(val, this.value)) {
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
     * 绘制内容
     *
     * @returns
     * @memberof AppAutocomplete
     */
    public render() {
        return (
            <el-autocomplete class='text-value' value-key='text' disabled={this.disabled} v-model={this.curvalue} size='small'
                trigger-on-focus={true} fetch-suggestions={(query: any, callback: any) => { this.onSearch(query, callback) }} on-select={(item: any) => { this.onACSelect(item) }}
                on-input={($event: any) => this.onInput($event)} on-blur={($event: any) => { this.onBlur($event) }} style='width:100%;'>
                <template slot='suffix'>
                    {(this.curvalue && !this.disabled) ? <i class='el-icon-circle-close' on-click={($event: any) => { this.onClear($event) }}></i> : ''}
                    <i class="el-icon-arrow-down"></i>
                </template >
            </el-autocomplete>
        );
    }
}