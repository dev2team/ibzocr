import { Component, Vue, Prop } from 'vue-property-decorator';
import './app-form.less';

@Component({})
export default class AppForm extends Vue {

    /**
     * 表单数据对象
     *
     * @type {*}
     * @memberof Form
     */
    @Prop() public form?: any;

    /**
     * 表单名称
     *
     * @type {string}
     * @memberof Form
     */
    @Prop() public name?: string;

    /**
     * 内容绘制
     *
     * @returns
     * @memberof Form
     */
    public render() {
        return (
            <i-form form={this.form}>
                <row >
                    {this.$slots.default}
                </row>
            </i-form>
        );
    }
}