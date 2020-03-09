import { Component, Vue, Prop, Model, Watch } from 'vue-property-decorator';
import './app-range-editor.less';
import { Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';

@Component({})
export default class AppPicker extends Vue {

    /**
     * 编辑项名称
     *
     * @type {string}
     * @memberof AppPicker
     */
    @Prop() public name!: string;

    /**
     * 是否禁用
     *
     * @type {boolean}
     * @memberof AppPicker
     */
    @Prop() public disabled!: boolean;

    /**
     * 表单数据对象
     *
     * @type {*}
     * @memberof AppPicker
     */
    @Prop() public activeData: any;

    /**
     * 值格式
     *
     * @type {string}
     * @memberof AppPicker
     */
    @Prop() public format!: string;

    /**
     * 编辑器类型
     *
     * @type {string}
     * @memberof AppPicker
     */
    @Prop() public editorType!: string;

    /**
     * 关系表单项集合
     *
     * @type {string[]}
     * @memberof AppPicker
     */
    @Prop() public refFormItem!: string[];

    /**
     * 值变化时间
     *
     * @private
     * @type {Subject<any>}
     * @memberof InputBox
     */
    private inputDataChang: Subject<any> = new Subject()

    /**
     * 处理值格式
     *
     * @readonly
     * @memberof AppPicker
     */
    get valFormat() {
        return this.format.replace('YYYY', 'yyyy').replace('DD', 'dd');
    }

    /**
     * 获取值
     *
     * @param {string} name
     * @returns
     * @memberof AppPicker
     */
    public getValue(name: string) {
        return this.activeData[name];
    }

    /**
     * 设置值
     *
     * @param {string} name
     * @param {*} val
     * @memberof AppPicker
     */
    public setValue(name: string, val: any) {
        this.inputDataChang.next({ name: name, value: val });
    }

    /**
     * vue  声明周期 debounceTime
     *
     * @memberof InputBox
     */
    public created() {
        this.inputDataChang
            .pipe(
                debounceTime(500),
                distinctUntilChanged()
            ).subscribe((data: any) => {
                this.$emit('formitemvaluechange', { name: data.name, value: data.value });
            });
    }

    /**
     * 值改变
     *
     * @param {string} name
     * @param {*} value
     * @memberof AppPicker
     */
    public onValueChange(name: string, value: any) {
        this.$emit('formitemvaluechange', { name: name, value: value });
    }

    /**
     * 绘制内容
     *
     * @memberof AppPicker
     */
    public render() {
        return (
            <div class="app-range-editor">
                {
                    this.refFormItem.map((item, index) => {
                        if (this.editorType.startsWith('DATEPICKEREX')) {
                            if(Object.is(this.editorType, 'DATEPICKEREX') || Object.is(this.editorType, 'DATEPICKEREX_NOTIME')) {
                                return [index > 0 ? <span class="editor-space">~</span> : null, this.renderDateEditor(item)];
                            } else {
                                return [index > 0 ? <span class="editor-space">~</span> : null, this.renderTimeEditor(item)];
                            }
                        } else {
                            return [index > 0 ? <span class="editor-space">~</span> : null, this.renderNumberEditor(item)];
                        }
                    })
                }
            </div>
        );
    }

    /**
     * 日期范围编辑器
     *
     * @returns
     * @memberof AppPicker
     */
    public renderDateEditor(name: string) {
        return (<date-picker type="date" transfer={true} format={this.valFormat} placeholder="请选择时间..." value={this.activeData[name]} disabled={this.disabled} on-on-change={(val1: any, val2: any) => { this.onValueChange(name, val1) }}></date-picker>);
    }

    /**
     * 时间范围编辑器
     *
     * @returns
     * @memberof AppPicker
     */
    public renderTimeEditor(name: string) {
        return (<time-picker value={this.activeData[name]} transfer={true} disabled={this.disabled} format={this.valFormat} placeholder="请选择时间..."  on-on-change={(val: any) => {this.onValueChange(name, val)}}></time-picker>);
    }

    /**
     * 数字范围编辑器
     *
     * @memberof AppPicker
     */
    public renderNumberEditor(name: string) {
        return (<i-input type="number" value={this.getValue(name)} disabled={this.disabled} placeholder="请输入" on-on-change={($event: any) => { this.setValue(name, $event) }}></i-input>);
    }
}