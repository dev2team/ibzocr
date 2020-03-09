import { Component, Vue, Prop, Model } from 'vue-property-decorator';
import './app-radio-group.less';

@Component({})
export default class AppRadioGroup extends Vue {

    /**
     * 双向绑定值
     *
     * @type {*}
     * @memberof AppRadioGroup
     */
    @Model('change') item?: any;

    /**
     * 获取值
     *
     * @memberof AppRadioGroup
     */
    get value() {
        return this.item;
    }

    /**
     * 设置值
     *
     * @memberof AppRadioGroup
     */
    set value(val: any) {
        this.$emit('change', val);
    }

    /**
     * 代码表标识
     *
     * @type {string}
     * @memberof AppRadioGroup
     */
    @Prop() public tag?: string;

    /**
     * 是否禁用
     *
     * @type {boolean}
     * @memberof AppRadioGroup
     */
    @Prop() public disabled?: boolean;

    /**
     * 属性名称
     *
     * @type {string}
     * @memberof AppRadioGroup
     */
    @Prop() name?: string;

    /**
     * 是否禁用
     *
     * @readonly
     * @memberof AppRadioGroup
     */
    get isDisabled() {
        if (this.disabled) {
            return true;
        } else {
            return false;
        }
    }

    /**
     * 代码表
     *
     * @type {any[]}
     * @memberof AppRadioGroup
     */
    public items: any[] = [];

    /**
     * vue  生命周期
     *
     * @memberof AppRadioGroup
     */
    public created() {
        const codelist = this.$store.getters.getCodeList(this.tag);
        if (codelist) {
            this.items = [...JSON.parse(JSON.stringify(codelist.items))];
        } else{
            console.log(`----${this.tag}----代码表不存在`);
        }
    }

    /**
     * 渲染组件
     *
     * @returns
     * @memberof AppRadioGroup
     */
    public render() {
        return (
            <radio-group class="app-radio-group" v-model={this.value} >
                {this.items.map((_item: any) => {
                    return <radio label={_item.value} disabled={this.isDisabled || _item.disabled}>
                        <span>{_item.text}</span>
                    </radio>
                })}
            </radio-group>
        );
    }
}