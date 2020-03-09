import { Vue, Component, Prop, Watch } from 'vue-property-decorator';
import { Subject, Unsubscribable } from 'rxjs';
import './app-form-druipart.less';

@Component({})
export default class AppFormDRUIPart extends Vue {

    /**
     * 表单数据
     *
     * @type {string}
     * @memberof AppFormDRUIPart
     */
    @Prop() public data!: string;

    /**
     * 关联视图
     *
     * @type {string}
     * @memberof AppFormDRUIPart
     */
    @Prop() public viewname?: string;

    /**
     * 刷新关系项
     *
     * @type {string}
     * @memberof AppFormDRUIPart
     */
    @Prop({ default: '' }) public refreshitems!: string;

    /**
     * 关系视图类型
     *
     * @type {string}
     * @memberof AppFormDRUIPart
     */
    @Prop() public refviewtype?: string;

    /**
     * 父数据
     *
     * @type {*}
     * @memberof AppFormDRUIPart
     */
    @Prop() public parentdata!: any;

    /**
     * 传入参数项名称
     *
     * @type {string}
     * @memberof AppFormDRUIPart
     */
    @Prop() public paramitem!: string;

    /**
     * 是否忽略表单项值变化
     *
     * @type {boolean}
     * @memberof AppFormDRUIPart
     */
    @Prop() public ignorefieldvaluechange!: boolean;

    /**
     * 表单状态
     *
     * @type {Subject<any>}
     * @memberof AppFormDRUIPart
     */
    @Prop() public formState!: Subject<any>

    /**
     * 表单状态事件
     *
     * @private
     * @type {(Unsubscribable | undefined)}
     * @memberof AppFormDRUIPart
     */
    private formStateEvent: Unsubscribable | undefined;

    /**
     * 监控值
     *
     * @param {*} newVal
     * @param {*} oldVal
     * @memberof AppFormDRUIPart
     */
    @Watch('data')
    onActivedataChange(newVal: any, oldVal: any) {

        if (this.ignorefieldvaluechange) {
            return;
        }
        if (Object.is(newVal, oldVal)) {
            return;
        }
        const newFormData: any = JSON.parse(newVal);
        const oldDormData: any = JSON.parse(oldVal);
        let refreshRefview = false;
        this.hookItems.some((_hookItem: any) => {
            if (!Object.is(newFormData[_hookItem], oldDormData[_hookItem])) {
                refreshRefview = true;
                return refreshRefview;
            }
            return refreshRefview;
        });
        if (refreshRefview) {
            this.refreshDRUIPart();
        }
    }

    /**
     * 是否启用遮罩
     *
     * @type {boolean}
     * @memberof AppFormDRUIPart
     */
    public blockUI: boolean = false;

    /**
     * 遮罩提示信息
     *
     * @type {string}
     * @memberof AppFormDRUIPart
     */
    public blockUITipInfo: string = '请先保存主数据';

    /**
     * 是否刷新关系数据
     *
     * @private
     * @type {boolean}
     * @memberof AppFormDRUIPart
     */
    private isRelationalData: boolean = true;

    /**
     * 刷新节点
     *
     * @private
     * @type {string[]}
     * @memberof AppFormDRUIPart
     */
    private hookItems: string[] = [];

    /**
     * 父数据
     *
     * @type {*}
     * @memberof AppFormDRUIPart
     */
    public srfparentdata: any = {};

    /**
     * 刷新关系页面
     *
     * @private
     * @returns {void}
     * @memberof AppFormDRUIPart
     */
    private refreshDRUIPart(): void {

        if (Object.is(this.parentdata.SRFPARENTTYPE, 'CUSTOM')) {
            this.isRelationalData = false;
        }

        const formData: any = JSON.parse(this.data);
        const _paramitem = formData[this.paramitem];

        this.srfparentdata = {};
        Object.assign(this.srfparentdata, this.parentdata);
        Object.assign(this.srfparentdata, { srfparentkey: _paramitem });
        if (this.isRelationalData) {
            if (!_paramitem || _paramitem == null || Object.is(_paramitem, '')) {
                this.blockUIStart();
                return;
            } else {
                this.blockUIStop();
            }
        }

        // this.$forceUpdate();
    }

    /**
     * vue  生命周期
     *
     * @memberof AppFormDRUIPart
     */
    public created(): void {

        this.hookItems = [...this.refreshitems.split(';')];
        if (!this.formState) {
            return;
        }
        if (!Object.is(this.paramitem, 'srfkey')) {
            this.hookItems.push(this.paramitem);
        }
        this.formStateEvent = this.formState.subscribe(($event: any) => {
            // 表单加载完成
            if (Object.is($event.type, 'load')) {
                this.refreshDRUIPart();
            }
            // 表单保存完成
            if (Object.is($event.type, 'save')) {
                this.refreshDRUIPart();
            }
            // 表单项更新
            if (Object.is($event.type, 'updateformitem')) {
                if (!$event.data) {
                    return;
                }
                let refreshRefview = false;
                Object.keys($event.data).some((name: string) => {
                    const index = this.hookItems.findIndex((_name: string) => Object.is(_name, name));
                    refreshRefview = index !== -1 ? true : false;
                    return refreshRefview;
                });
                if (refreshRefview) {
                    this.refreshDRUIPart();
                }
            }
        });
        this.refreshDRUIPart();
    }

    /**
     * 部件销毁
     *
     * @memberof AppFormDRUIPart
     */
    public destroyed(): void {
        if (this.formStateEvent) {
            this.formStateEvent.unsubscribe();
        }
    }

    /**
     * 开启遮罩
     *
     * @private
     * @memberof AppFormDRUIPart
     */
    private blockUIStart(): void {
        this.blockUI = true;
    }

    /**
     * 关闭遮罩
     *
     * @private
     * @memberof AppFormDRUIPart
     */
    private blockUIStop(): void {
        this.blockUI = false;
    }

    /**
     * 绘制内容
     *
     * @returns
     * @memberof AppFormDRUIPart
     */
    public render() {
        return (
            <div class='form-druipart'>
                {
                    (this.viewname && !Object.is(this.viewname, '')) ?
                        this.$createElement(this.viewname, {
                            class: {
                                viewcontainer2: true,
                            },
                            props: {
                                viewdata: JSON.stringify({ srfparentdata: this.srfparentdata })
                            },
                            on: {
                                mditemsload: ($event: any) => {
                                    console.log('多数据视图加载完成，触发后续表单项更新');
                                },
                                drdatasaved: ($event: any) => {
                                    console.log('DEMEDITVIEW9 关系数据保存完成');
                                },
                                drdatachange: ($event: any) => {
                                    console.log('DEMEDITVIEW9 关系数据值变化');
                                },
                                viewdataschange: ($event: any) => {
                                    console.log('视图数据变化');
                                },
                                viewload: ($event: any) => {
                                    console.log('视图加载完成');
                                }
                            },
                            key: this.$util.createUUID(),
                        })
                        : ''
                }
                {this.blockUI ? <spin class="app-druipart-spin" fix >{this.blockUITipInfo}</spin> : ''}
            </div>
        );
    }
}