import { Component, Vue, Prop, Model } from 'vue-property-decorator';
import './app-checkbox-list.less';

@Component({})
export default class AppCheckBox extends Vue {

    /**
     * 代码表标识
     *
     * @type {string}
     * @memberof AppCheckBox
     */
    @Prop() public tag?: string;

    /**
     * 是否禁用
     *
     * @type {boolean}
     * @memberof AppCheckBox
     */
    @Prop() disabled?: boolean;

    /**
     * 获取启用禁用状态
     *
     * @readonly
     * @memberof AppCheckBox
     */
    get isDisabled() {
        if (this.disabled) {
            return true;
        } else {
            return false;
        }
    }

    /**
     * 属性名称
     *
     * @type {*}
     * @memberof AppCheckBox
     */
    @Prop() name?: any;

    /**
     * 模式（数字或者字符串）
     *
     * @type {*}
     * @memberof AppCheckBox
     */
    @Prop() mode: any;

    /**
     * 当前模式
     *
     * @readonly
     * @memberof AppCheckBox
     */
    get currentmode() {
        if (this.mode) {
            return this.mode;
        } else {
            return 'str';
        }
    }

    /**
     * 分隔符
     *
     * @type {*}
     * @memberof AppCheckBox
     */
    @Prop() separator: any;

    /**
     * 获取分隔符
     *
     * @readonly
     * @memberof AppCheckBox
     */
    get currentseparator() {
        if (this.separator) {
            return this.separator;
        } else {
            return ';';
        }
    }

    /** 
     * 选中值
     *
     * @type {*}
     * @memberof AppCheckBox
     */
    @Model('change') selects?: any;

    /**
     * 选中数组
     *
     * @memberof AppCheckBox
     */
    get selectArray() {
        if (this.selects) {
            if (Object.is(this.currentmode, 'num') && this.items) {
                let selectsArray: Array<any> = [];
                let num: number = parseInt(this.selects, 10);
                this.items.forEach((item: any) => {
                    if ((num & item.value) == item.value) {
                        selectsArray.push(item.value);
                    }
                });
                return selectsArray;
            } else if (Object.is(this.currentmode, 'str')) {
                if (this.selects !== '') {
                    return this.selects.split(this.currentseparator);
                }
            }
        } else {
            return [];
        }

    }

    /**
     * 设置选中
     *
     * @memberof AppCheckBox
     */
    set selectArray(val: any) {
        let value: null | string | number = null;
        if (Object.is(this.currentmode, 'num')) {
            let temp: number = 0;
            val.forEach((item: any) => {
                temp = temp | parseInt(item, 10);
            });
            value = temp;
        } else if (Object.is(this.currentmode, 'str')) {
            let _datas: string[] = [];
            this.items.forEach((item: any) => {
                const index = val.findIndex((_key: any) => Object.is(item.value, _key));
                if (index === -1) {
                    return;
                }
                _datas.push(item.value);
            });
            value = _datas.join(this.currentseparator);
        }
        this.$emit('change', value);
    }

    /**
     * 代码表数组
     *
     * @type {any[]}
     * @memberof AppCheckBox
     */
    public items: any[] = [];

    /**
     * vue  生命周期
     *
     * @memberof AppCheckBox
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
     * @memberof AppCheckBox
     */
    public render() {
        return (
            <checkbox-group class="app-checkbox-list" v-model={this.selectArray}>
                {this.items.map((item: any) => {
                    return <checkbox label={item.value} disabled={this.isDisabled || item.disabled}>
                        <span>{item.text}</span>
                    </checkbox>
                })}
            </checkbox-group >
        );
    }
}