import { Vue, Component, Prop, Watch } from 'vue-property-decorator';

import './app-embed-picker.less';
import { CreateElement } from 'vue';
import { Subject, Subscription } from 'rxjs';

@Component({})
export default class AppEmbedPicker extends Vue {

    /**
     * 表单数据
     *
     * @type {*}
     * @memberof AppPicker
     */
    @Prop() public data!: any;

    /**
     * 值
     *
     * @type {*}
     * @memberof AppEmbedPicker
     */
    @Prop() public value: any;

    /**
     * 表单状态
     *
     * @type {Subject<any>}
     * @memberof AppEmbedPicker
     */
    @Prop() public formState!: Subject<any>

    /**
     * 视图状态事件
     *
     * @protected
     * @type {(Subscription | undefined)}
     * @memberof SelectType
     */
    protected formStateEvent: Subscription | undefined;

    /**
     * 值项名称
     *
     * @type {string}
     * @memberof AppPicker
     */
    @Prop() public valueItem?: string;

    /**
     * 关联视图名称
     *
     * @type {string}
     * @memberof AppPicker
     */
    @Prop() public refviewname?: string;

    /**
     * 提示信息
     *
     * @type {string}
     * @memberof AppEmbedPicker
     */
    @Prop() public placeholder!: string;

    /**
     * 空值文本
     *
     * @type {string}
     * @memberof EmbedPicker
     */
    @Prop() public emptyText?: string;

    /**
     * 属性项名称
     *
     * @type {string}
     * @memberof AppPicker
     */
    @Prop() public name!: string;

    /**
     * 关联视图参数
     *
     * @type {*}
     * @memberof AppEmbedPicker
     */
    @Prop() public itemParam: any;

    /**
     * 是否忽略之变化
     *
     * @type {boolean}
     * @memberof AppEmbedPicker
     */
    @Prop() public ignorefieldvaluechange!: boolean;

    /**
     * 重置项
     *
     * @type {string}
     * @memberof AppEmbedPicker
     */
    @Prop() public refreshitems?: string;

    /**
     * 视图参数
     *
     * @type {string}
     * @memberof AppEmbedPicker
     */
    public srfparentdata: any = '';

    /**
     * 设置视图参数
     *
     * @memberof AppEmbedPicker
     */
    public setViewParam(activeData: any) {
        if (!this.itemParam || !activeData) {
            return;
        }
        let arg: any = {};
        if (this.itemParam.parentdata) {
            let parentData: any = {};
            Object.keys(this.itemParam.parentdata).every((name: string) => {
                let value: string = this.itemParam.parentdata[name];
                if (value.startsWith('%') && value.endsWith('%')) {
                    const key: string = value.substring(1, value.length - 1);
                    if (!activeData.hasOwnProperty(key)) {
                        this.$Notice.error({ title: '错误', desc: `操作失败,未能找到当前表单项${key}，无法继续操作` });
                        return false;
                    }
                    value = activeData[key];
                }
                Object.assign(parentData, { [name]: value });
                return true;
            });
            Object.assign(arg, parentData);
        }
        this.srfparentdata = arg;
    }

    /**
     * 监控值
     *
     * @param {*} newVal
     * @param {*} oldVal
     * @memberof AppFormDRUIPart
     */
    @Watch('data')
    onActivedataChange(newVal: any, oldVal: any) {
        const newFormData: any = JSON.parse(newVal);
        const oldDormData: any = JSON.parse(oldVal);
        this.setViewParam(newFormData);
        if (!this.refreshitems || this.ignorefieldvaluechange) {
            return;
        }
        if(Object.is(newFormData[this.refreshitems], oldDormData[this.refreshitems])) {
            return;
        }
        this.setValue([{srfmajortext: null, srfkey: null}]);
        let param = this.srfparentdata;
        this.srfparentdata = {};
        Object.assign(this.srfparentdata, param);
    }

    /**
     * 生命周期
     *
     * @memberof AppEmbedPicker
     */
    public created() {
        if(this.formState) {
            this.formStateEvent = this.formState.subscribe(({ tag, action, data }) => {
                if (Object.is('load', action)) {
                    this.setViewParam(JSON.parse(this.data));
                }
            });
        }
    }

    /**
     * vue 生命周期
     *
     * @memberof SelectType
     */
    public destroyed() {
        if (this.formStateEvent) {
            this.formStateEvent.unsubscribe();
        }
    }

    /**
     * 设置值
     *
     * @param {*} item
     * @memberof AppEmbedPicker
     */
    public setValue(item: any) {
        if (this.name) {
            this.$emit('formitemvaluechange', { name: this.name, value: item[0].srfmajortext });
        }
        if (this.valueItem) {
            this.$emit('formitemvaluechange', { name: this.valueItem, value: item[0].srfkey });
        }
    }

    /**
     * 绘制内容
     *
     * @param {CreateElement} h
     * @returns
     * @memberof AppEmbedPicker
     */
    public render(h: CreateElement) {
        if (this.refviewname) {
            return (
                <div class="app-embed-picker">
                    <div style={{ height: this.placeholder ? 'calc(100% - 32px)' : '100%' }}>
                        {
                            this.$createElement(this.refviewname, {
                                props: {
                                    viewdata: JSON.stringify({ srfparentdata: this.srfparentdata })
                                },
                                on: {
                                    'viewdataschange': (args: any) => {
                                        if (args && args.length > 0) {
                                            this.setValue(args);                                         
                                        }
                                    }
                                },
                                style: {
                                    height: '100%'
                                }
                            })
                        }
                    </div>
                    { this.placeholder ? ( this.value ? <div class="app-embed-value">{this.value}</div> : <div class="app-embed-placeholder">{this.placeholder}</div> ) : '' }
                </div>
            );
        } else {
            return (<div>{this.emptyText}</div>);
        }
    }
}