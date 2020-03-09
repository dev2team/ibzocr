import { Vue, Component, Prop } from 'vue-property-decorator';
import './app-form-group.less';

@Component({})
export default class AppFormGroup extends Vue {

    /**
     * 标题
     *
     * @type {string}
     * @memberof AppFormGroup
     */
    @Prop() public caption?: string;

    /**
     * 内置界面样式
     * 
     * @type {string}
     * @memberof AppFormGroup
     */
    @Prop() public uiStyle?: string;

    /**
     * 布局模式
     *
     * @type {string}
     * @memberof AppFormGroup
     */
    @Prop() public layoutType?: string;

    /**
     * 是否显示标题
     *
     * @type {boolean}
     * @memberof AppFormGroup
     */
    @Prop({ default: true }) public isShowCaption!: boolean;

    /**
     * 信息面板模式
     *
     * @type {boolean}
     * @memberof AppFormGroup
     */
    @Prop({ default: false }) public isInfoGroupMode!: boolean;

    /**
     * 界面行为组
     *
     * @type {*}
     * @memberof AppFormGroup
     */
    @Prop() public uiActionGroup?: any;

    /**
     * 标题栏关闭模式
     * 0: 不支持关闭
     * 1: 默认打开
     * 2： 默认关闭
     *
     * @type {(number | 0 | 1 | 2)} 
     * @memberof AppFormGroup
     */
    @Prop({ default: 0 }) public titleBarCloseMode!: number | 0 | 1 | 2;

    /**
     * 收缩内容
     *
     * @type {boolean}
     * @memberof AppFormGroup
     */
    public collapseContant: boolean = false;

    /**
     * 计算样式
     *
     * @readonly
     * @type {string[]}
     * @memberof AppFormGroup
     */
    get classes(): string[] {
        return [
            'app-form-group',
            this.isShowCaption && this.collapseContant ? 'app-group-collapse-contant' : '',
            this.isInfoGroupMode ? 'app-info-group-mode' : '',
            Object.is(this.layoutType, 'FLEX') ? 'app-group-flex': ''
        ];
    }

    /**
     * vue 生命周期
     *
     * @memberof AppFormGroup
     */
    public created() {
        this.collapseContant = this.titleBarCloseMode === 2 ? true : false;
    }

    /**
     * 触发收缩
     *
     * @memberof AppFormGroup
     */
    public clickCollapse(): void {
        this.collapseContant = !this.collapseContant;
    }

    /**
     * 执行界面行
     *
     * @param {*} $event
     * @memberof AppFormGroup
     */
    public doUIAction($event: any, item: any): void {
        this.$emit('groupuiactionclick', { event: $event, item: item });
    }

    /**
     * 绘制界面行为项
     *
     * @param {*} item
     * @returns
     * @memberof AppFormGroup
     */
    public renderActionItem(item: any) {
        return (
            <span class='item' on-click={($event: any) => this.doUIAction($event, item)}>
                {
                    item.icon && !Object.is(item.icon, '') ?
                        <i class={item.icon} ></i> :
                        item.img && !Object.is(item.img, '') ?
                            <img src={item.img} /> :
                            ''
                }
                &nbsp;
                <span>
                    {
                        this.uiActionGroup.langbase && !Object.is(this.uiActionGroup.langbase, '')
                            && item.uiactiontag && !Object.is(item.uiactiontag, '') ?
                            this.$t(`${this.uiActionGroup.langbase}.uiactions.${item.uiactiontag}`)
                            : item.caption
                    }
                </span>
            </span>
        );
    }

    /**
     * 绘制逐项展开
     *
     * @returns
     * @memberof AppFormGroup
     */
    public renderItemExtractMode() {
        return (
            <span class='item-extract-mode'>
                {
                    this.uiActionGroup.details && Array.isArray(this.uiActionGroup.details) ?
                        this.uiActionGroup.details.map((detail: any) => {
                            return this.renderActionItem(detail);
                        })
                        :
                        ''
                }
            </span>
        );
    }

    /**
     * 绘制分组展开项
     *
     * @returns
     * @memberof AppFormGroup
     */
    public renderItemsExtractMode() {
        return (
            <dropdown transfer={true} trigger='click'>
                <a href='javascript:void(0)'>
                    {this.uiActionGroup.caption}
                </a>
                {
                    this.uiActionGroup.details && Array.isArray(this.uiActionGroup.details) ?
                        <dropdown-menu slot='list'>
                            {
                                this.uiActionGroup.details.map((detail: any) => {
                                    return (
                                        <dropdown-item name={detail.name}>{this.renderActionItem(detail)}</dropdown-item>
                                    );
                                })
                            }
                        </dropdown-menu>
                        : ''
                }
            </dropdown>
        );
    }

    /**
     * 绘制界面行为组
     *
     * @returns
     * @memberof AppFormGroup
     */
    public renderUIActionGroup() {
        return (
            <a slot='extra'>
                {
                    this.uiActionGroup.extractMode && Object.is(this.uiActionGroup.extractMode, 'ITEMS') ?
                        this.renderItemsExtractMode() :
                        this.renderItemExtractMode()
                }
            </a >
        );
    }

    /**
     * 绘制标题收缩模式 
     *
     * @returns
     * @memberof AppFormGroup
     */
    public renderTitleBarCloseMode() {
        return (
            this.titleBarCloseMode !== 0 ?
                <icon
                    type={this.collapseContant ? 'ios-arrow-dropright-circle' : 'ios-arrow-dropdown-circle'}
                    on-click={() => this.clickCollapse()}>
                </icon>
                : ''
        );
    }

    /**
     * 内容绘制
     *
     * @memberof AppFormGroup
     */
    public render() {
        if (Object.is(this.uiStyle, 'STYLE2')) {
            return (
                <app-form-group2
                    caption={this.caption}
                    uiStyle={this.uiStyle}
                    layoutType={this.layoutType}
                    isShowCaption={this.isShowCaption}
                    uiActionGroup={this.uiActionGroup}
                    titleBarCloseMode={this.titleBarCloseMode}>
                    {this.$slots.default}
                </app-form-group2>
            );
        } else {
            return (
                this.isShowCaption ?
                    <card bordered={false} dis-hover={true} class={this.classes}>
                        <p class='' slot='title'>
                            {this.renderTitleBarCloseMode()}
                            {this.caption}
                        </p>
                        {this.uiActionGroup ? this.renderUIActionGroup() : ''}
                        {Object.is(this.layoutType, 'FLEX') ? this.$slots.default : <row gutter={10}> {this.$slots.default} </row>}
                    </card> :
                    <row class={this.classes}>
                        {this.$slots.default}
                    </row>
            );
        }
    }
}