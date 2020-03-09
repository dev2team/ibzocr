import { Vue, Component, Prop, Provide, Emit, Watch } from 'vue-property-decorator';
import { CreateElement } from 'vue';
import { Subject, Subscription } from 'rxjs';
import { ControlInterface } from '@/interface/control';
import { UICounter } from '@/utils';
import './main-grid.less';




@Component({
    components: {
         
    }
})
export default class Main extends Vue implements ControlInterface {

    /**
     * 名称
     *
     * @type {string}
     * @memberof Main
     */
    @Prop() public name?: string;

    /**
     * 视图通讯对象
     *
     * @type {Subject<ViewState>}
     * @memberof Main
     */
    @Prop() public viewState!: Subject<ViewState>;

    /**
     * 视图状态事件
     *
     * @protected
     * @type {(Subscription | undefined)}
     * @memberof Main
     */
    protected viewStateEvent: Subscription | undefined;
    


    /**
     * 序列号
     *
     * @private
     * @type {number}
     * @memberof Main
     */
    private serialNumber: number = this.$util.createSerialNumber();

    /**
     * 请求行为序列号数组
     *
     * @private
     * @type {any[]}
     * @memberof Main
     */
    private serialsNumber: any[] = [];

    /**
     * 添加序列号
     *
     * @private
     * @param {*} action
     * @param {number} serialnumber
     * @memberof Main
     */
    private addSerialNumber(action: any, serialnumber: number): void {
        const index = this.serialsNumber.findIndex((serial: any) => Object.is(serial.action, action));
        if (index === -1) {
            this.serialsNumber.push({ action: action, serialnumber: serialnumber })
        } else {
            this.serialsNumber[index].serialnumber = serialnumber;
        }
    }

    /**
     * 删除序列号
     *
     * @private
     * @param {*} action
     * @returns {number}
     * @memberof Main
     */
    private getSerialNumber(action: any): number {
        const index = this.serialsNumber.findIndex((serial: any) => Object.is(serial.action, action));
        return this.serialsNumber[index].serialnumber;
    }

    /**
     * 关闭视图
     *
     * @param {any[]} args
     * @memberof Main
     */
    public closeView(args: any[]): void {
        let _this: any = this;
        _this.$emit('closeview', args);
    }


    /**
     * 获取多项数据
     *
     * @returns {any[]}
     * @memberof Main
     */
    public getDatas(): any[] {
        return this.selections;
    }

    /**
     * 获取单项树
     *
     * @returns {*}
     * @memberof Main
     */
    public getData(): any {
        return this.selections[0];
    }

    /**
     * 传入url值
     *
     * @type {string}
     * @memberof Main
     */
    private url: string = 'ocrweb/ibizutil/worklist/maingrid/';

    /**
     * 显示处理提示
     *
     * @type {boolean}
     * @memberof Main
     */
    @Prop({ default: true }) public showBusyIndicator?: boolean;
    
    /**
     * 部件行为--加载结果集
     *
     * @type {string}
     * @memberof Main
     */
    @Prop() public searchAction!: string;

    /**
     * 部件行为--默认数据
     *
     * @type {string}
     * @memberof Main
     */
    @Prop() public loaddraftAction?: string;
    
    /**
     * 部件行为--新建
     *
     * @type {string}
     * @memberof Main
     */
    @Prop() public createAction?: string;

    /**
     * 部件行为--加载
     *
     * @type {string}
     * @memberof Main
     */
    @Prop() public loadAction?: string;

    /**
     * 部件行为--更新
     *
     * @type {string}
     * @memberof Main
     */
    @Prop() public updateAction?: string;
    
    /**
     * 部件行为--删除
     *
     * @type {string}
     * @memberof Main
     */
    @Prop() public removeAction?: string;

    /**
     * 部件行为--批量添加
     *
     * @type {string}
     * @memberof Main
     */
    @Prop() public addBatchAction?: string;

    /**
     * 当前页
     *
     * @type {number}
     * @memberof Main
     */
    public curPage: number = 1;

    /**
     * 数据
     *
     * @type {any[]}
     * @memberof Main
     */
    public items: any[] = [];

    /**
     * 是否支持分页
     *
     * @type {boolean}
     * @memberof Main
     */
    public isEnablePagingBar: boolean = true;

    /**
     * 是否禁用排序
     *
     * @type {boolean}
     * @memberof Main
     */
    public isNoSort: boolean = false;

    /**
     * 排序方向
     *
     * @type {string}
     * @memberof Main
     */
    public minorSortDir: string = '';

    /**
     * 排序字段
     *
     * @type {string}
     * @memberof Main
     */
    public minorSortPSDEF: string = '';

    /**
     * 分页条数
     *
     * @type {number}
     * @memberof Main
     */
    public limit: number = 20;

    /**
     * 是否显示标题
     *
     * @type {boolean}
     * @memberof Main
     */
    public isHideHeader: boolean = false;

    /**
     * 是否单选
     *
     * @type {boolean}
     * @memberof Main
     */
    @Prop() public isSingleSelect?: boolean;

    /**
     * 总条数
     *
     * @type {number}
     * @memberof Main
     */
    public totalrow: number = 0;

    /**
     * 选中行数据
     *
     * @type {any[]}
     * @memberof Main
     */
    public selections: any[] = [];

    /**
     * 是否开启行编辑
     *
     * @type {boolean}
     * @memberof Main
     */
    public isOpenEdit: boolean = false;

    /**
     * 拦截行选中
     *
     * @type {boolean}
     * @memberof Main
     */
    public stopRowClick: boolean = false;

    /**
     * 部件刷新
     *
     * @param {any[]} args
     * @memberof Main
     */
    public refresh(args: any[]): void {
        this.load();
    }

	/**
	 * 选项框列宽
	 *
	 * @type {number}
	 * @memberof AppIndex
	 */
	public checkboxColWidth: number = 55;

    /**
     * 是否允许拖动列宽
     *
     * @type {boolean}
     * @memberof AppEmbedPicker
     */
    public isDragendCol: boolean = false;

    /**
     * 所有列成员
     *
     * @type {any[]}
     * @memberof Main
     */
    public allColumns: any[] = [
        {
            name: 'startusername',
            label: '发起人',
            langtag: 'ibzworklist.main_grid.columns.startusername',
            show: true,
            util: 'PX'
        },
        {
            name: 'starttime',
            label: '发起时间',
            langtag: 'ibzworklist.main_grid.columns.starttime',
            show: true,
            util: 'PX'
        },
        {
            name: 'workflowname',
            label: '流程',
            langtag: 'ibzworklist.main_grid.columns.workflowname',
            show: true,
            util: 'PX'
        },
        {
            name: 'step',
            label: '流程步骤',
            langtag: 'ibzworklist.main_grid.columns.step',
            show: true,
            util: 'PX'
        },
        {
            name: 'workflowid',
            label: '流程标识',
            langtag: 'ibzworklist.main_grid.columns.workflowid',
            show: false,
            util: 'PX'
        },
        {
            name: 'businesskey',
            label: '业务Key',
            langtag: 'ibzworklist.main_grid.columns.businesskey',
            show: false,
            util: 'PX'
        },
    ]

    /**
     * 表格数据加载
     *
     * @param {*} [arg={}]
     * @memberof Main
     */
    public load(opt: any = {}): void {
        const arg: any = {...opt};

        const page: any = {};
        if (this.isEnablePagingBar) {
            Object.assign(page, { current: this.curPage, size: this.limit });
        }
        if (!this.isNoSort && !Object.is(this.minorSortDir, '') && !Object.is(this.minorSortPSDEF, '')) {
            const sort: string[] = [this.minorSortPSDEF];
            if (Object.is(this.minorSortDir, 'ASC')) {
                Object.assign(page, { asc: sort });
            } else {
                Object.assign(page, { desc: sort });
            }
        }
        Object.assign(arg, { page: page });

        const parentdata: any = {};
        this.$emit('beforeload', parentdata);
        Object.assign(arg, parentdata);

        this.serialNumber++;
        const serialnumber = this.serialNumber;
        this.addSerialNumber(this.searchAction, serialnumber);

        const post: Promise<any> = this.$http.post(this.url + this.searchAction, arg, this.showBusyIndicator, serialnumber);
        post.then((response: any) => {
            const { serialnumber: _serialnumber } = response;
            const lastserialnumber = this.getSerialNumber(this.searchAction);
            if (_serialnumber && lastserialnumber && _serialnumber < lastserialnumber) {
                return;
            }

            if (!response.status || response.status !== 200) {
                if (response.errorMessage) {
                    this.$Notice.error({ title: '错误', desc: response.errorMessage });
                }
                return;
            }
            const data: any = response.data;
            if (Object.keys(data).length > 0) {
                this.items = JSON.parse(JSON.stringify(data.records));
                this.totalrow = data.total;
            }
            this.$emit('load', this.items);
        }).catch((response: any) => {
            const { serialnumber: _serialnumber } = response;
            const lastserialnumber = this.getSerialNumber(this.searchAction);
            if (_serialnumber && lastserialnumber && _serialnumber < lastserialnumber) {
                return;
            }

            if (response && response.status === 401) {
                return;
            }
            this.$Notice.error({ title: '错误', desc: response.errorMessage });
        });
    }

    /**
     * 删除
     *
     * @param {any[]} datas
     * @returns {Promise<any>}
     * @memberof Main
     */
    public async remove(datas: any[]): Promise<any> {
        if (datas.length === 0) {
            return;
        }
        let dataInfo = '';
        datas.forEach((record: any, index: number) => {
            let srfmajortext = record.srfmajortext;
            if (index < 5) {
                if (!Object.is(dataInfo, '')) {
                    dataInfo += '、';
                }
                dataInfo += srfmajortext;
            } else {
                return false;
            }
        });

        if (datas.length < 5) {
            dataInfo = dataInfo + '共' + datas.length + '条数据';
        } else {
            dataInfo = dataInfo + '...' + '共' + datas.length + '条数据';
        }

        const removeData = () => {
            let keys: any[] = [];
            datas.forEach((data: any) => {
                keys.push(data.srfkey);
            });

            this.serialNumber++;
            const serialnumber = this.serialNumber;
            this.addSerialNumber(this.removeAction, serialnumber);

            const post: Promise<any> = this.$http.post(this.url + this.removeAction, { srfkeys: keys.join(';') }, this.showBusyIndicator, serialnumber);
            return new Promise((resolve: any, reject: any) => {
                post.then((response: any) => {
                    const { serialnumber: _serialnumber } = response;
                    const lastserialnumber = this.getSerialNumber(this.removeAction);
                    if (_serialnumber && lastserialnumber && _serialnumber < lastserialnumber) {
                        return;
                    }

                    if (!response || response.status !== 200) {
                        this.$Notice.error({ title: '', desc: '删除数据失败,' + response.info });
                        return;
                    } else {
                        this.$Notice.success({ title: '', desc: '删除成功!' });
                    }
                    this.load({});
                    this.$emit('remove', null);
                    this.selections = [];
                    resolve(response);
                }).catch((response: any) => {
                    const { serialnumber: _serialnumber } = response;
                    const lastserialnumber = this.getSerialNumber(this.removeAction);
                    if (_serialnumber && lastserialnumber && _serialnumber < lastserialnumber) {
                        return;
                    }

                    if (response && response.status === 401) {
                        return;
                    }
                    if (!response || !response.status || !response.data) {
                        this.$Notice.error({ title: '错误', desc: '系统异常' });
                        reject(response);
                        return;
                    }

                    const { data: _data } = response;
                    this.$Notice.error({ title: _data.title, desc: _data.message });
                    reject(response);
                });
            });
        }

        dataInfo = dataInfo.replace(/[null]/g, '').replace(/[undefined]/g, '').replace(/[ ]/g, '');
        this.$Modal.confirm({
            title: '警告',
            content: '确认要删除 ' + dataInfo + '，删除操作将不可恢复？',
            onOk: () => {
                removeData();
            },
            onCancel: () => { }
        });
        return removeData;
    }


    /**
     * 批量添加
     *
     * @param {*} [arg={}]
     * @memberof Main
     */
    public addBatch(arg: any = {}): void {
        if(!arg) 
            arg = {};
        const post: Promise<any> = this.$http.post(this.url + this.addBatchAction, arg, this.showBusyIndicator);
        post.then((response: any) => {
            if (response.ret !== 200) {
                this.$Notice.error({ title: '', desc: '批量添加失败,' + response.info });
                return;
            }
            this.load({});
            this.$emit('addbatch', null);
        }).catch((response: any) => {
            if (response && response.status === 401) {
                return;
            }
            this.$Notice.error({ title: '', desc: '批量添加失败' });
        });
    }

    /**
     * 数据导出
     *
     * @param {*} data
     * @memberof Main
     */
    public exportExcel(data: any = {}): void {
        const arg: any = {};

        const page: any = {};
        if (!this.isNoSort && !Object.is(this.minorSortDir, '') && !Object.is(this.minorSortPSDEF, '')) {
            const sort: string[] = [this.minorSortPSDEF];
            if (Object.is(this.minorSortDir, 'ASC')) {
                Object.assign(page, { asc: sort });
            } else {
                Object.assign(page, { desc: sort });
            }
        }

        if (Object.is(data.type, 'maxRowCount')) {
            Object.assign(page, { current: 1, size: data.maxRowCount });
        } else if (Object.is(data.type, 'activatedPage')) {
            Object.assign(page, { current: this.curPage, size: this.limit });
        }
        Object.assign(arg, { page: page });

        const parentdata: any = {};
        this.$emit('beforeload', parentdata);
        Object.assign(arg, parentdata);

        this.serialNumber++;
        const serialnumber = this.serialNumber;
        this.addSerialNumber('exportdata', serialnumber);

        const post: Promise<any> = this.$http.post(this.url + 'exportdata/' + this.searchAction, arg, this.showBusyIndicator, serialnumber);
        post.then((response: any) => {
            const { serialnumber: _serialnumber } = response;
            const lastserialnumber = this.getSerialNumber('exportdata');
            if (_serialnumber && lastserialnumber && _serialnumber < lastserialnumber) {
                return;
            }

            if (!response || response.status !== 200) {
                this.$Notice.error({ title: '', desc: '数据导出失败,' + response.info });
                return;
            }
            const { data: _data } = response;
            const { records: _records } = _data;
            if (!_records || _records.length !== 1) {
                return;
            }

            const { downloadurl: _downloadurl } = _records[0];
            window.open('../' + _downloadurl, '_blank');

        }).catch((response: any) => {
            const { serialnumber: _serialnumber } = response;
            const lastserialnumber = this.getSerialNumber('exportdata');
            if (_serialnumber && lastserialnumber && _serialnumber < lastserialnumber) {
                return;
            }

            if (response && response.status === 401) {
                return;
            }
            this.$Notice.error({ title: '', desc: '数据导出失败' });
        });
    }

    /**
     * 生命周期
     *
     * @memberof Main
     */
    public created(): void {
        this.setColState();
        if (this.viewState) {
            this.viewStateEvent = this.viewState.subscribe(({ tag, action, data }) => {
                if (!Object.is(tag, this.name)) {
                    return;
                }
                if (Object.is('load', action)) {
                    this.load(data);
                }
                if (Object.is('remove', action)) {
                    this.load(data);
                }
            });
        }
    }

    /**
     * vue 生命周期
     *
     * @memberof Main
     */
    public destroyed() {
        if (this.viewStateEvent) {
            this.viewStateEvent.unsubscribe();
        }
    }

    /**
     * 获取选中行胡数据
     *
     * @returns {any[]}
     * @memberof Main
     */
    public getSelection(): any[] {
        return this.selections;
    }

    /**
     * 行双击事件
     *
     * @param {*} $event
     * @returns {void}
     * @memberof Main
     */
    public rowDBLClick($event: any): void {
        if (!$event) {
            return;
        }
        this.selections = [];
        this.selections.push(JSON.parse(JSON.stringify($event)));

        const refs: any = this.$refs;
        if (refs.multipleTable) {
            refs.multipleTable.clearSelection();
            refs.multipleTable.toggleRowSelection($event);
        }

        this.$emit('rowdblclick', this.selections);
        this.$emit('selectionchange', this.selections);
    }

    /**
     * 复选框数据选中
     *
     * @param {*} $event
     * @returns {void}
     * @memberof  Main
     */
    public select($event: any): void {
        if (!$event) {
            return;
        }
        this.selections = [];
        this.selections = [...JSON.parse(JSON.stringify($event))];
        this.$emit('selectionchange', this.selections);
    }

    /**
     * 复选框数据全部选中
     *
     * @param {*} $event
     * @memberof  Main
     */
    public selectAll($event: any): void {
        if (!$event) {
            return;
        }
        this.selections = [];
        this.selections = [...JSON.parse(JSON.stringify($event))];
        this.$emit('selectionchange', this.selections);
    }

    
    /**
     * 行单击选中
     *
     * @param {*} $event
     * @returns {void}
     * @memberof Main
     */
    public rowClick($event: any): void {
        if (!$event) {
            return;
        }
        if(this.stopRowClick) {
            this.stopRowClick = false;
            return;
        }

        this.selections = [];
        this.selections.push(JSON.parse(JSON.stringify($event)));

        const refs: any = this.$refs;
        if (refs.multipleTable) {
            refs.multipleTable.clearSelection();
            refs.multipleTable.toggleRowSelection($event);
        }

        this.$emit('selectionchange', this.selections);
    }


    /**
     * 页面变化
     *
     * @param {*} $event
     * @returns {void}
     * @memberof Main
     */
    public pageOnChange($event: any): void {
        if (!$event) {
            return;
        }
        if ($event === this.curPage) {
            return;
        }
        this.curPage = $event;
        this.load({});
    }

    /**
     * 分页条数变化
     *
     * @param {*} $event
     * @returns {void}
     * @memberof Main
     */
    public onPageSizeChange($event: any): void {
        if (!$event) {
            return;
        }
        if ($event === this.limit) {
            return;
        }
        this.limit = $event;
        if (this.curPage === 1) {
            this.load({});
        }
    }

    /**
     * 分页刷新
     *
     * @memberof Main
     */
    public pageRefresh(): void {
        this.load({});
    }

    /**
     * 排序变化
     *
     * @param {{ column: any, prop: any, order: any }} { column, prop, order }
     * @memberof Main
     */
    public onSortChange({ column, prop, order }: { column: any, prop: any, order: any }): void {
        const dir = Object.is(order, 'ascending') ? 'ASC' : Object.is(order, 'descending') ? 'DESC' : '';
        if (Object.is(dir, this.minorSortDir) && Object.is(this.minorSortPSDEF, prop)) {
            return;
        }
        this.minorSortDir = dir;
        this.minorSortPSDEF = prop ? prop : '';
        this.load({});
    }

    /**
     * 表格行选中样式
     *
     * @param {{ row: any, rowIndex: any }} { row, rowIndex }
     * @returns {string}
     * @memberof Main
     */
    public onRowClassName({ row, rowIndex }: { row: any, rowIndex: any }): string {
        const index = this.selections.findIndex((select: any) => Object.is(select.srfkey, row.srfkey));
        return index !== -1 ? 'grid-row-select' : '';
    }

    /**
     * 界面行为
     *
     * @param {*} row
     * @param {*} tag
     * @param {*} $event
     * @memberof Main
     */
	public uiAction(row: any, tag: any, $event: any) {
        this.rowClick(row);
        this.stopRowClick = true;
    }

    /**
     * 设置列状态
     *
     * @memberof Main
     */
    public setColState() {
		const _data: any = localStorage.getItem('worklist_main_grid');
		if (_data) {
			let columns = JSON.parse(_data);
			columns.forEach((col: any) => {
				let column = this.allColumns.find((item) => Object.is(col.name, item.name));
				if (column) {
					Object.assign(column, col);
				}
			});
		}
    }

    /**
     * 列变化
     *
     * @memberof Main
     */
    public onColChange() {
        localStorage.setItem('worklist_main_grid', JSON.stringify(this.allColumns));
    }

    /**
     * 内容绘制
     *
     * @param {CreateElement} h
     * @returns
     * @memberof Main
     */
    public render(h: CreateElement) {
        let content = {scopedSlots: {
            default: (props: any) => {
                return this.renderColumn(h, props.row, props.column, props.$index);
            }
        }};
        return (
            <div class='grid'>
                <el-table  
                    default-sort={{ prop: this.minorSortPSDEF, order: Object.is(this.minorSortDir, 'ASC') ? 'ascending' : Object.is(this.minorSortDir, 'DESC') ? 'descending' : '' }} 
                    on-sort-change={($event: any) => this.onSortChange($event)} 
                    border={this.isDragendCol}
                    stripe height={this.isEnablePagingBar && this.items.length > 0 ? 'calc(100% - 50px)' : '100%'} 
                    on-row-click={($event: any) => this.rowClick($event)} 
                    on-select-all={($event: any) => this.selectAll($event)} 
                    on-select={($event: any) => this.select($event)} 
                    row-class-name={($event: any) => this.onRowClassName($event)} 
                    on-row-dblclick={($event: any) => this.rowDBLClick($event)} 
                    ref='multipleTable' data={this.items} show-header={!this.isHideHeader}>
                        { !this.isSingleSelect ? <el-table-column type='selection' width={this.checkboxColWidth}></el-table-column> : '' }
                        { this.renderstartusername(content) }
                        { this.renderstarttime(content) }
                        { this.renderworkflowname(content) }
                        { this.renderstep(content) }
                        { this.renderworkflowid(content) }
                        { this.renderbusinesskey(content) }
                        { !this.allColumns.find((column: any) => column.show && Object.is(column.util, 'STAR')) ? <el-table-column></el-table-column> : null}
                </el-table>
                <row class='grid-pagination' v-show={this.items.length > 0}>
                    <page class='pull-right' on-on-change={($event: any) => this.pageOnChange($event)}
                        on-on-page-size-change={($event: any) => this.onPageSizeChange($event)}
                        transfer={true} total={this.totalrow}
                        show-sizer current={this.curPage} page-size={this.limit}
                        page-size-opts={[10, 20, 30, 40, 50, 60, 70, 80, 90, 100]} show-elevator show-total>
                        <span>
                            <span class="page-column">
                                <poptip transfer placement="top-start">
                                    <i-button icon="md-menu">{this.$t('app.gridpage.choicecolumns')}</i-button>
                                    <div slot="content">
                                        {
                                            this.allColumns.map((col: any) => {
                                                return <div><el-checkbox v-model={col.show} on-change={() => this.onColChange()}>{this.$t(col.langtag)}</el-checkbox></div>
                                            })
                                        }
                                    </div>
                                </poptip>
                            </span>
                            <span class="page-button"><i-button icon="md-refresh" title={this.$t('app.gridpage.refresh')} on-click={() => this.pageRefresh()}></i-button></span>&nbsp;
                            <span>
                                {this.$t('app.gridpage.show')}&nbsp;
                                <span>
                                    {
                                        this.items.length === 1 ? 1 :
                                            <span>{(this.curPage - 1) * this.limit + 1}&nbsp;-&nbsp;{this.totalrow > this.curPage * this.limit ? this.curPage * this.limit : this.totalrow}</span>
                                    }
                                </span>&nbsp;
                                {this.$t('app.gridpage.records')}，{this.$t('app.gridpage.totle')}&nbsp;{this.totalrow}&nbsp;{this.$t('app.gridpage.records')}
                            </span>
                        </span>
                    </page>
                </row>
            </div>
        );
    }

    
    /**
     * 绘制列
     *
     * @param {*} content
     * @returns
     * @memberof Main
     */
    public renderstartusername(content: any) {
        let column = this.allColumns.find((col: any) => Object.is('startusername', col.name));
        if(column.show) {  
            return (
                <el-table-column show-overflow-tooltip prop='startusername' label={column.label} width="100" align='left' sortable='custom' {...content}>
                </el-table-column>
            );
        }
    }
    
    /**
     * 绘制列
     *
     * @param {*} content
     * @returns
     * @memberof Main
     */
    public renderstarttime(content: any) {
        let column = this.allColumns.find((col: any) => Object.is('starttime', col.name));
        if(column.show) {  
            return (
                <el-table-column show-overflow-tooltip prop='starttime' label={column.label} width="250" align='left' sortable='custom' {...content}>
                </el-table-column>
            );
        }
    }
    
    /**
     * 绘制列
     *
     * @param {*} content
     * @returns
     * @memberof Main
     */
    public renderworkflowname(content: any) {
        let column = this.allColumns.find((col: any) => Object.is('workflowname', col.name));
        if(column.show) {  
            return (
                <el-table-column show-overflow-tooltip prop='workflowname' label={column.label} width="200" align='left' sortable='custom' {...content}>
                </el-table-column>
            );
        }
    }
    
    /**
     * 绘制列
     *
     * @param {*} content
     * @returns
     * @memberof Main
     */
    public renderstep(content: any) {
        let column = this.allColumns.find((col: any) => Object.is('step', col.name));
        if(column.show) {  
            return (
                <el-table-column show-overflow-tooltip prop='step' label={column.label} width="200" align='left' sortable='custom' {...content}>
                </el-table-column>
            );
        }
    }
    
    /**
     * 绘制列
     *
     * @param {*} content
     * @returns
     * @memberof Main
     */
    public renderworkflowid(content: any) {
        let column = this.allColumns.find((col: any) => Object.is('workflowid', col.name));
        if(column.show) {  
            return (
                <el-table-column show-overflow-tooltip prop='workflowid' label={column.label} width="100" align='left' sortable='custom' {...content}>
                </el-table-column>
            );
        }
    }
    
    /**
     * 绘制列
     *
     * @param {*} content
     * @returns
     * @memberof Main
     */
    public renderbusinesskey(content: any) {
        let column = this.allColumns.find((col: any) => Object.is('businesskey', col.name));
        if(column.show) {  
            return (
                <el-table-column show-overflow-tooltip prop='businesskey' label={column.label} width="100" align='left' sortable='custom' {...content}>
                </el-table-column>
            );
        }
    }

    /**
     * 绘制列
     *
     * @param {CreateElement} h
     * @param {*} row
     * @param {*} column
     * @param {*} $index
     * @returns
     * @memberof Main
     */
    public renderColumn(h: CreateElement, row: any, column: any, $index: any) {
        if(row && column) {
            return row[column.property];
        }
    }
}