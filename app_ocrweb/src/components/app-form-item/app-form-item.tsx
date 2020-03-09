import { Vue, Component, Prop, Watch } from 'vue-property-decorator';
import './app-form-item.less';

@Component({})
export default class AppFormItem extends Vue {

    /**
     * 名称
     *
     * @type {string}
     * @memberof AppFormItem2
     */
    @Prop() public caption!: string;

    /**
     * 错误信息
     *
     * @type {string}
     * @memberof AppFormItem2
     */
    @Prop() public error?: string;

    /**
     * 标签位置
     *
     * @type {(string | 'BOTTOM' | 'LEFT' | 'NONE' | 'RIGHT' | 'TOP')}
     * @memberof AppFormItem2
     */
    @Prop() public labelPos?: string | 'BOTTOM' | 'LEFT' | 'NONE' | 'RIGHT' | 'TOP';

    /**
     * 标签宽度
     *
     * @type {number}
     * @memberof AppFormItem2
     */
    @Prop({}) public labelWidth!: number;

    /**
     * 是否显示标题
     *
     * @type {boolean}
     * @memberof AppFormItem2
     */
    @Prop() public isShowCaption?: boolean;

    /**
     * 标签是否空白
     *
     * @type {boolean}
     * @memberof AppFormItem2
     */
    @Prop() public isEmptyCaption?: boolean;

    /**
     * 表单项名称
     *
     * @type {string}
     * @memberof AppFormItem2
     */
    @Prop() public name!: string;

    /**
     * 内置样式
     *
     * @type {string}
     * @memberof AppFormItem2
     */
    @Prop() public uiStyle?: string;

    /**
     * 表单项值规则
     *
     * @type {string}
     * @memberof AppFormItem2
     */
    @Prop() public itemRules!: string;

    /**
     * 值规则数组
     *
     * @type {any[]}
     * @memberof AppFormItem2
     */
    public rules: any[] = [];

    /**
     * 表单项值规则监控
     *
     * @param {*} newVal
     * @param {*} oldVal
     * @memberof AppFormItem2
     */
    @Watch('itemRules')
    onItemRulesChange(newVal: any, oldVal: any) {
        if (newVal) {
            try {
                this.rules = [];
                const _rules: any[] = JSON.parse(newVal);
                this.rules = [..._rules];
            } catch (error) {
            }
        }
    }

    /**
     * 计算样式
     *
     * @readonly
     * @type {string[]}
     * @memberof AppFormItem2
     */
    get classes(): string[] {
        return [
            'app-form-item2',
            Object.is(this.labelPos, 'TOP') ? 'app-form-item-label-top' : ''
        ];
    }

    /**
     * vue 生命周期
     *
     * @memberof AppFormItem2
     */
    public mounted() {
        if (this.itemRules) {
            try {
                const _rules: any[] = JSON.parse(this.itemRules);
                this.rules = [..._rules];
            } catch (error) {
            }
        }
    }

    /**
     * 绘制提示框
     *
     * @returns
     * @memberof AppFormItem2
     */
    public renderErrorTip() {
        const _formitem: any = this.$refs[this.name];
        return (
            _formitem && _formitem.validateState && Object.is(_formitem.validateState, 'error') ?
                <div class='app-error-tip'>
                    <poptip trigger='hover' placement='left' width={300} word-wrap={true} transfer={true}>
                        <icon type='ios-information-circle-outline' color='#ed4014' size={20}></icon>
                        <div slot='content' class='app-form-item-error-info'>
                            <div class='icon'>
                                <icon type='ios-information-circle-outline' color='#ed4014' size={20}></icon>
                            </div>
                            <div class='contant'>
                                {_formitem.validateMessage}
                            </div>
                        </div>
                    </poptip>
                </div>
                : ''
        );
    }

    /**
     * 绘制内容
     *
     * @returns
     * @memberof AppFormItem2
     */
    public render() {
        return (
            <form-item
                prop={this.name}
                error={this.error}
                rules={this.rules}
                class={this.classes}
                label-width={this.isShowCaption ? !Object.is(this.labelPos, 'TOP') ? this.labelWidth : null : 0}
                ref={this.name}>
                {
                    this.isShowCaption && this.labelWidth > 0 ?
                        <span slot='label'>
                            {this.isEmptyCaption ? '' : this.caption}
                        </span>
                        : ''
                }
                <div class='app-editor-contant'>
                    {this.$slots.default}
                </div>
                {this.renderErrorTip()}
            </form-item>
        )
    }
}