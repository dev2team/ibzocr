import { Vue, Component, Prop, Provide, Emit, Watch } from 'vue-property-decorator';
import { CreateElement } from 'vue';
import { Subject, Subscription } from 'rxjs';
import { ControlInterface } from '@/interface/control';
import { UICounter } from '@/utils';
import './main-appmenu.less';



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
        return [];
    }

    /**
     * 获取单项树
     *
     * @returns {*}
     * @memberof Main
     */
    public getData(): any {
        return null;
    }

    /**
     * 显示处理提示
     *
     * @type {boolean}
     * @memberof Main
     */
    @Prop({ default: true }) public showBusyIndicator?: boolean;

    /**
     * 菜单数据
     *
     * @private
     * @type {any[]}
     * @memberof Main
     */
    @Provide()
    private menus: any[] = [];

    /**
     * api地址
     *
     * @private
     * @type {string}
     * @memberof Main
     */
    private url: string = 'ocrweb/ctrl/mainappmenu';

    /**
     * 菜单收缩改变
     *
     * @type {boolean}
     * @memberof Main
     */
    @Prop() public collapsechange?: boolean;

    /**
     * 监听菜单收缩
     *
     * @param {*} newVal
     * @param {*} oldVal
     * @memberof Main
     */
    @Watch('collapsechange')
    onCollapsechangeChange(newVal: any, oldVal: any) {
        if (newVal !== this.isCollapse) {
            this.isCollapse = !this.isCollapse;
        }
    }

    /**
     * 当前模式，菜单在顶部还是在底部
     *
     * @type {*}
     * @memberof Main
     */
    @Prop() mode: any;

    /**
     * 是否默认视图
     *
     * @type {*}
     * @memberof Main
     */
    @Prop({ default: false }) isDefaultPage?: boolean;

    /**
     * 默认打开视图
     *
     * @type {*}
     * @memberof Main
     */
    @Prop() defPSAppView: any;

    /**
     * 默认激活的index
     *
     * @type {*}
     * @memberof Main
     */
    @Provide() defaultActive: any = null;

    /**
     * 当前选中主题
     *
     * @type {*}
     * @memberof Main
     */
    @Prop() selectTheme: any;

    /**
     * 默认打开的index数组
     *
     * @type {any[]}
     * @memberof Main
     */
    @Provide() public defaultOpeneds: any[] = [];

    /**
     * 是否展开
     *
     * @type {boolean}
     * @memberof Main
     */
    @Provide() public isCollapse: boolean = false;

    /**
     * 触发方式，默认click
     *
     * @type {string}
     * @memberof Main
     */
    @Provide() trigger: string = 'click';

    /**
     * 应用功能集合
     *
     * @type {any[]}
     * @memberof Main
     */
    public appFuncs: any[] = [
        {
            appfunctag: '_3',
            appfuncyype: 'APPVIEW',
            pathname: 'ocr_ocrrecordocrview',
        },
        {
            appfunctag: '_2',
            appfuncyype: 'APPVIEW',
            pathname: 'ocr_ocrrecordgridview',
        },
    ];

    /**
     * vue  生命周期
     *
     * @memberof Main
     */
    public created() {
        if (Object.is(this.mode, 'horizontal')) {
            this.trigger = 'hover';
        }
        if (this.viewState) {
            this.viewStateEvent = this.viewState.subscribe(({ tag, action, data }) => {
                if (!Object.is(tag, this.name)) {
                    return;
                }
                this.load(data);
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
     * 处理菜单选中项
     *
     * @private
     * @memberof Dev
     */
    private doMenuSelect(): void {
        if (!this.isDefaultPage) {
            return;
        }
        let hasTwoLevalRoute: boolean = false;
        let hasDefPSAppView: boolean = false;
        if (this.$route && this.$route.matched && this.$route.matched.length == 2) {
            const pathname = this.$route.name;
            const appfunc: any = this.appFuncs.find((_appfunc: any) => Object.is(_appfunc.pathname, pathname) && Object.is(_appfunc.appfuncyype, 'APPVIEW'));
            if (appfunc) {
                this.computeMenuSelect(this.menus, appfunc.appfunctag);
            }
            hasTwoLevalRoute = true;
        } else if (this.defPSAppView && Object.keys(this.defPSAppView).length > 0) {
            const pathname = `${this.defPSAppView.modulename}_${this.defPSAppView.viewname}`.toLowerCase();
            const appfunc: any = this.appFuncs.find((_appfunc: any) => Object.is(_appfunc.pathname, pathname) && Object.is(_appfunc.appfuncyype, 'APPVIEW'));
            if (appfunc) {
                this.computeMenuSelect(this.menus, appfunc.appfunctag);
            }
            hasDefPSAppView = true;
        }

        // 有二级路由
        if (hasTwoLevalRoute) {
            return;
        }

        // 有默认视图，但是默认视图不在菜单项中
        if (hasDefPSAppView && !this.defaultActive) {
            const defPSAppView: any = this.defPSAppView;
            if (Object.is(defPSAppView.openmode, '') || Object.is(defPSAppView.openmode, 'INDEXVIEWTAB')) {
                const pathname = `${defPSAppView.modulename}_${defPSAppView.viewname}`.toLowerCase().toLowerCase();
                const params = this.$util.prepareRouteParmas({
                    route: this.$route,
                    sourceNode: this.$route.name,
                    targetNode: pathname,
                    data: {},
                });
                this.$router.push({ name: pathname, params: params });
            } else {
                console.log('------' + defPSAppView.openmode + '------')
            }
            return;
        }

        let item = this.compute(this.menus, this.defaultActive);
        if (Object.keys(item).length === 0) {
            return;
        }
        this.click(item);
    }

    /**
     * 计算菜单选中项
     *
     * @private
     * @param {any[]} items
     * @param {string} appfunctag
     * @memberof Dev
     */
    private computeMenuSelect(items: any[], appfunctag: string): boolean {
        return items.some((item: any) => {
            if (Object.is(appfunctag, '') && !Object.is(item.appfunctag, '')) {
                const appfunc = this.appFuncs.find((_appfunc: any) => Object.is(_appfunc.appfunctag, item.appfunctag));
                if (appfunc.pathname) {
                    this.defaultActive = item.name;
                    return true;
                }
            }
            if (Object.is(item.appfunctag, appfunctag)) {
                this.defaultActive = item.name;
                return true;
            }
            if (item.items && item.items.length > 0) {
                const state = this.computeMenuSelect(item.items, appfunctag);
                if (state) {
                    this.defaultOpeneds.push(item.name);
                    return true;
                }
            }
            return false;
        });
    }

    /**
     * 获取菜单项数据
     *
     * @private
     * @param {any[]} items
     * @param {string} name
     * @returns
     * @memberof Main
     */
    private compute(items: any[], name: string) {
        const item: any = {};
        items.some((_item: any) => {
            if (name && Object.is(_item.name, name)) {
                Object.assign(item, _item);
                return true;
            }
            if (_item.items && Array.isArray(_item.items)) {
                const subItem = this.compute(_item.items, name);
                if (Object.keys(subItem).length > 0) {
                    Object.assign(item, subItem);
                    return true;
                }
            }
            return false;
        });
        return item;
    }

    /**
     * 菜单项选中处理
     *
     * @param {*} index
     * @param {any[]} indexs
     * @returns
     * @memberof Main
     */
    public select(index: any, indexs: any[]) {
        let item = this.compute(this.menus, index);
        if (Object.keys(item).length === 0) {
            return;
        }
        this.click(item);
    }

    /**
     * 菜单点击
     *
     * @private
     * @param {*} item 菜单数据
     * @memberof Main
     */
    private click(item: any) {
        if (item) {
            switch (item.appfunctag) {
                case '_3': 
                    this.click_3(item);
                    return;
                case '_2': 
                    this.click_2(item);
                    return;
                default:
                    console.warn('未指定应用功能');
            }
        }
    }

    
    /**
     * 通用识别
     *
     * @param {*} [item={}]
     * @memberof Main
     */
    public click_3(item: any = {}) {
        // 打开应用视图
        const viewparam: any = {};
        const _params = this.$util.prepareRouteParmas({
            route: this.$route,
            sourceNode: this.$route.name,
            targetNode: 'ocr_ocrrecordocrview',
            data: Object.assign({}, viewparam),
        });
        this.$router.push({ name: 'ocr_ocrrecordocrview', params: _params });
    }
    
    /**
     * 识别记录
     *
     * @param {*} [item={}]
     * @memberof Main
     */
    public click_2(item: any = {}) {
        // 打开应用视图
        const viewparam: any = {};
        const _params = this.$util.prepareRouteParmas({
            route: this.$route,
            sourceNode: this.$route.name,
            targetNode: 'ocr_ocrrecordgridview',
            data: Object.assign({}, viewparam),
        });
        this.$router.push({ name: 'ocr_ocrrecordgridview', params: _params });
    }

    /**
     * 数据加载
     *
     * @param {*} data
     * @memberof Main
     */
    public load(data: any) {
        const get: Promise<any> = this.$http.get(this.url + '/get', {}, this.showBusyIndicator);
        get.then((response: any) => {
            if (!response || response.status !== 200) {
                this.$Notice.error({ title: '错误', desc: response.info });
            }

            this.dataProcess(response.data.items);
            this.menus = response.data.items;
            this.doMenuSelect();
        }).catch((response: any) => {
            if (response && response.status === 401) {
                return;
            }
            if (!response || !response.status || !response.data) {
                this.$Notice.error({ title: '错误', desc: '系统异常！' });
                return;
            }
            const { data: _data } = response;
            this.$Notice.error({ title: _data.title, desc: _data.message });
        });
    }

    /**
     * 数据处理
     *
     * @private
     * @param {any[]} items
     * @memberof Main
     */
    private dataProcess(items: any[]): void {
        items.forEach((_item: any) => {
            if (_item.expanded) {
                this.defaultOpeneds.push(_item.id);
            }
            if (_item.items && _item.items.length > 0) {
                this.dataProcess(_item.items)
            }
        });
    }


    /**
     * 绘制菜单分组
     *
     * @param {*} item
     * @param {any[]} items
     * @param {number} index
     * @returns
     * @memberof Main
     */
    public renderSubMenu(item: any, items: any[], index: number) {
        const _index = index + 1;
        return (
            <el-submenu v-show={!item.hidden} index={item.name} popper-class={'app-popper-menu ' + (this.selectTheme)}>
                <template slot='title'>
                    {
                        this.renderIcon(item, index)
                    }
                    <span class='text' slot='title'>{this.$t('app.menus.main.' + item.name)}</span>
                </template>
                {
                    items.map((_item: any) => {
                        if (_item.items && Array.isArray(_item.items) && _item.items.length > 0) {
                            return this.renderSubMenu(_item, _item.items, _index);
                        } else {
                            if (Object.is(_item.type, 'MENUITEM')) {
                                return this.renderMenuItem(_item, _index);
                            } else if (Object.is(_item.type, 'SEPERATOR')) {
                                return this.renderSeperator();
                            }
                        }
                    })
                }
            </el-submenu>
        );
    }

    /**
     * 绘制菜单项
     *
     * @param {*} item
     * @param {number} index
     * @returns
     * @memberof Main
     */
    public renderMenuItem(item: any, index: number) {
        return (
            <el-menu-item v-show={!item.hidden} index={item.name}>
                {
                    this.renderIcon(item, index)
                }
                <span class='text' slot='title'>
                {this.$t('app.menus.main.' + item.name)}
                {this.renderBadge(item)}
                </span>
            </el-menu-item>
        );
    }

    /**
     * 绘制分隔项
     *
     * @returns
     * @memberof Main
     */
    public renderSeperator() {
        return (<divider/>);
    }

    /**
     * 绘制计数徽标
     *
     * @param {*} item
     * @returns
     * @memberof Main
     */
    public renderBadge(item: any) {
        const _this: any = this;
        if (_this.counterdata && _this.counterdata[item.counterid] && _this.counterdata[item.counterid] > 0) {
            return (
                <span class='pull-right'>
                    <badge count={_this.counterdata[item.counterid]} overflow-count={9999}>
                    </badge>
                </span>
            );
        } else {
            return "";
        }
    }

    /**
     * 绘制图标
     *
     * @param {*} item
     * @param {number} index
     * @returns
     * @memberof Main
     */
    public renderIcon(item: any, index: number) {
        return (
            item.icon && !Object.is(item.icon, '') ?
                <img src={item.icon} class='app-menu-icon' />
                :
                item.iconcls && !Object.is(item.iconcls, '') ?
                    <i class={item.iconcls + ' app-menu-icon'}></i>
                    :
                    index === 0 ?
                        <i class='fa fa-cogs app-menu-icon'></i>
                        :
                        ''
        );
    }

    /**
     * 绘制菜单
     *
     * @returns
     * @memberof Main
     */
    public render() {
        const index = 0;
        return (
            <div class="app-app-menu">
                <el-menu class="app-menu" default-openeds={this.defaultOpeneds} mode={this.mode} menu-trigger={this.trigger} collapse={this.isCollapse} on-select={this.select} default-active={this.defaultActive}>
                    {
                        this.menus.map((item: any) => {
                            if (item.items && Array.isArray(item.items) && item.items.length > 0) {
                                return this.renderSubMenu(item, item.items, index);
                            } else {
                                if (Object.is(item.type, 'MENUITEM')) {
                                    return this.renderMenuItem(item, index);
                                } else if (Object.is(item.type, 'SEPERATOR')) {
                                    return this.renderSeperator();
                                }
                            }
                        })
                    }
                </el-menu >
            </div>
        );
    }
    
}