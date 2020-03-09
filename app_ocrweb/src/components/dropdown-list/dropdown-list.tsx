import { Vue, Component, Prop, Model, Emit } from 'vue-property-decorator';
import './dropdown-list.less';

@Component({})
export default class DropDownList extends Vue {

    /**
     * 当前选中值
     * @type {any}
     * @memberof SelectPicker
     */
    @Model('change') readonly itemValue!: any;

    /**
     * 代码表标识
     *
     * @type {string}
     * @memberof DropDownList
     */
    @Prop() public tag?: string;

    /**
     * 传入样式对象，没有默认无自定义样式
     */
    @Prop() public ownstyle?: any;

    /**
     * 是否禁用
     * @type {any}
     * @memberof SelectPicker
     * 
     */
    @Prop() public disabled?: any;

    /**
     * 是否支持过滤
     * @type {boolean}
     * @memberof SelectPicker
     */
    @Prop() public filterable?: boolean;

    /**
     * 下拉选提示内容
     * @type {string}
     * @memberof SelectPicker
     */
    @Prop() public placeholder?: string;

    /**
     * 计算属性(当前值)
     * @type {any}
     * @memberof SelectPicker
     */
    set currentVal(val: any) {
        const type: string = this.$util.typeOf(val);
        val = Object.is(type, 'null') || Object.is(type, 'undefined') ? null : val;
        this.$emit('change', val);
    }

    /**
     * 获取值对象
     *
     * @memberof DropDownList
     */
    get currentVal() {
        return this.itemValue;
    }

    /**
     * 代码表
     *
     * @type {any[]}
     * @memberof DropDownList
     */
    public items: any[] = [];

    /**
     * vue  生命周期
     *
     * @memberof DropDownList
     */
    public created() {
        const codelist = this.$store.getters.getCodeList(this.tag);
        if (codelist) {
            this.items = [...JSON.parse(JSON.stringify(codelist.items))];
        } else {
            console.log(`----${this.tag}----代码表不存在`);
        }
    }

    /**
     * 渲染组件
     *
     * @returns
     * @memberof DropDownList
     */
    public render() {
        return (
            <i-select class="dropdown-list" transfer={true} v-model={this.currentVal} disabled={this.disabled === true ? true : false} style={this.ownstyle ? this.ownstyle : ''}
                clearable={true}
                filterable={this.filterable === true ? true : false} placeholder={this.placeholder ? this.placeholder : '请选择'}>
                {this.items.map((item: any) => {
                    return <i-option value={item.value}>{item.text}</i-option>
                })}
            </i-select>
        );
    }
}