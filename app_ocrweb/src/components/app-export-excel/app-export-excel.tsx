import { Vue, Component, Prop, Watch } from 'vue-property-decorator';
import './app-export-excel.less';

/**
 * 数据导出组件
 *
 * @export
 * @class AppExportExcel
 * @extends {Vue}
 */
@Component({})
export default class AppExportExcel extends Vue {

    /**
     * 工具栏项
     *
     * @type {*}
     * @memberof AppExportExcel
     */
    @Prop() public item?: any;

    /**
     * 工具栏项层级
     *
     * @type {number}
     * @memberof AppExportExcel
     */
    @Prop({ default: 0 }) public itemLevel!: number;

    /**
     * 起始页
     *
     * @type {(string | null)}
     * @memberof AppExportExcel
     */
    public startPage: string | null = null;

    /**
     * 结束页
     *
     * @type {(string | null)}
     * @memberof AppExportExcel
     */
    public endPage: string | null = null;

    /**
     * 是否显示下拉菜单
     *
     * @type {boolean}
     * @memberof AppExportExcel
     */
    public visible: boolean = false;

    /**
     * 点击触发相似
     *
     * @memberof AppExportExcel
     */
    public clickVisible(): void {
        this.visible = !this.visible
    }

    /**
     * 导出数据
     *
     * @param {*} $event
     * @param {string} type
     * @returns {void}
     * @memberof AppExportExcel
     */
    public exportExcel($event: any, type: string): void {
        const exportparms: any = { type: type };
        if (Object.is(type, 'maxRowCount')) {
            Object.assign(exportparms, { maxRowCount: this.item.MaxRowCount })
            this.visible = false;
        } else if (Object.is(type, 'activatedPage')) {
            this.visible = false;
        } else if (Object.is(type, 'custom')) {
            if (!this.startPage || !this.endPage) {
                this.$Notice.warning({ title: '警告', desc: '请输入起始页' });
                return;
            }
            const startPage: any = Number.parseInt(this.startPage, 10);
            const endPage: any = Number.parseInt(this.endPage, 10);
            if (Number.isNaN(startPage) || Number.isNaN(endPage)) {
                this.$Notice.warning({ title: '警告', desc: '请输入有效的起始页' });
                return;
            }

            if (startPage < 1 || endPage < 1 || startPage > endPage) {
                this.$Notice.warning({ title: '警告', desc: '请输入有效的起始页' });
                return;
            }
            this.startPage = null;
            this.endPage = null;
            Object.assign(exportparms, { startPage: startPage, endPage: endPage });
            this.visible = false;
        }
        if (!this.visible) {
            Object.assign($event, { exportparms: exportparms });
            this.$emit('exportexcel', $event);
        }
    }

    /**
     * 绘制默认内容
     *
     * @returns
     * @memberof AppExportExcel
     */
    public renderDefault() {
        return (
            <dropdown trigger='custom' transfer={true} visible={this.visible}>
                <i-button disabled={this.item.disabled} on-click={() => this.clickVisible()}>
                    <i class='fa fa-file-excel-o'></i>
                    <span class='caption'>{this.item.caption}</span>
                </i-button>

                <dropdown-menu slot='list'>
                    <dropdown-item>
                        <p on-click={($event: any) => this.exportExcel($event, 'maxRowCount')}>
                            {this.item.caption}全部(最大{this.item.caption}{this.item.MaxRowCount}行)
                        </p>
                    </dropdown-item>
                    <dropdown-item>
                        <p on-click={($event: any) => this.exportExcel($event, 'activatedPage')}>
                            {this.item.caption}当前页
                        </p>
                    </dropdown-item>
                    <dropdown-item>
                        {this.item.caption}第&nbsp;
                        <i-input style="width: 30px;" v-model={this.startPage}> </i-input>&nbsp;至&nbsp;
                        <i-input style="width: 30px;" v-model={this.endPage}></i-input>&nbsp;
                        <i-button on-click={($event: any) => this.exportExcel($event, 'custom')}>Go!</i-button>
                    </dropdown-item>
                </dropdown-menu>
            </dropdown>
        );
    }

    /**
     * 绘制临时方案
     *
     * @returns
     * @memberof AppExportExcel
     */
    public renderTeml() {
        return (
            <dropdown transfer={true} trigger='click'>
                <i-button disabled={this.item.disabled}>
                    <i class='fa fa-file-excel-o'></i>
                    <span class='caption'>{this.item.caption}</span>
                </i-button>

                <dropdown-menu slot='list'>
                    <dropdown-item>
                        <p on-click={($event: any) => this.exportExcel($event, 'maxRowCount')}>
                            {this.item.caption}全部(最大{this.item.caption}{this.item.MaxRowCount}行)
                        </p>
                    </dropdown-item>
                    <dropdown-item>
                        <p on-click={($event: any) => this.exportExcel($event, 'activatedPage')}>
                            {this.item.caption}当前页
                        </p>
                    </dropdown-item>
                </dropdown-menu>
            </dropdown>
        );
    }

    /**
     * 绘制内容
     *
     * @returns
     * @memberof AppExportExcel
     */
    public render() {
        if (this.itemLevel === 0) {
            return this.renderTeml();
        }
    }
} 