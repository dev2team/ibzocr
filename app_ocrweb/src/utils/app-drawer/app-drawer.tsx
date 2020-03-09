import Vue from 'vue';
import { Subject } from 'rxjs';
import store from '../../store';
import i18n from '@/locale';

import './app-drawer.less';

export class AppDrawer {

    /**
     * 实例对象
     *
     * @private
     * @static
     * @memberof AppDrawer
     */
    private static readonly $drawer = new AppDrawer();

    /**
     * 构造方法
     * 
     * @memberof AppDrawer
     */
    constructor() {
        if (AppDrawer.$drawer) {
            return AppDrawer.$drawer;
        }
    }

    /**
     * vue 实例
     *
     * @private
     * @type {Vue}
     * @memberof AppDrawer
     */
    private vueExample!: Vue;

    /**
     * 获取实例对象
     *
     * @static
     * @returns
     * @memberof AppDrawer
     */
    public static getInstance() {
        return AppDrawer.$drawer;
    }

    /**
     * 创建 Vue 实例对象
     *
     * @private
     * @param {{ viewname: string, title: string, width?: number, height?: number, placement?: any }} view
     * @param {*} [data={}]
     * @param {string} uuid
     * @returns {Subject<any>}
     * @memberof AppDrawer
     */
    private createVueExample(view: { viewname: string, title: string, width?: number, height?: number, placement?: any }, data: any = {}, uuid: string): Subject<any> {
        let subject: null | Subject<any> = new Subject<any>();
        const div = document.createElement('div');
        div.setAttribute('id', uuid);
        document.body.appendChild(div);
        const vueExample = new Vue({
            store: store,
            i18n: i18n,
            el: div,
            data() {
                let data = {
                    isShow: false,
                    viewname: '',
                    tempResult: { ret: '' },
                    placement: '',
                    width: 256,
                    zIndex: null,
                }
                return data;
            },
            created() {
                this.viewname = view.viewname;
                this.placement = view.placement === 'DRAWER_LEFT' ? 'left' : 'right';
                if (view.width) {
                    if (view.width.toString().indexOf('px') > 0) {
                        if (!Object.is(view.width, '0px')) {
                            this.width = parseInt(view.width.toString().slice(0, view.width.toString().length - 2));
                        } else {
                            this.width = 800;
                        }
                    } else {
                        if (view.width !== 0) {
                            this.width = view.width;
                        } else {
                            this.width = 800;
                        }
                    }
                } else {
                    this.width = 800;
                }
                document.onkeydown = (e) => {
                    var keyCode = e.keyCode || e.which || e.charCode;
                    if (keyCode == 27) {
                        this.isShow = false;
                    }
                }
            },
            mounted() {
                this.isShow = true;
                this.handleZIndex('ivu-drawer-mask', 'ivu-drawer-wrap');
            },
            beforeDestroy() {
                if (this.zIndex) {
                    const zIndex: any = this.zIndex;
                    this.$store.commit('updateZIndex', zIndex - 100);
                }
            },
            methods: {
                // 处理 z-index
                handleZIndex: function (mask: string, wrap: string) {
                    const zIndex = this.$store.getters.getZIndex();
                    if (zIndex) {
                        this.zIndex = zIndex + 100;
                        this.$store.commit('updateZIndex', this.zIndex);
                    }
                    const element: Element = this.$el;
                    const maskTag: any = element.getElementsByClassName(mask)[0];
                    const warpTag: any = element.getElementsByClassName(wrap)[0];
                    maskTag.style.zIndex = this.zIndex;
                    warpTag.style.zIndex = this.zIndex;
                },
                close: function (result: any) {
                    if (result && Array.isArray(result) && result.length > 0) {
                        Object.assign(this.tempResult, { ret: 'OK' }, { datas: JSON.parse(JSON.stringify(result)) });
                    }
                    this.isShow = false;
                },
                dataChange: function (result: any) {
                    this.tempResult = { ret: '' };
                    if (result && Array.isArray(result) && result.length > 0) {
                        Object.assign(this.tempResult, { ret: 'OK' }, { datas: JSON.parse(JSON.stringify(result)) });
                    }
                },
                viewDatasActivated: function (result: any) {
                    if (result && Array.isArray(result) && result.length > 0) {
                        this.close(result);
                    }
                },
                onVisibleChange: function ($event: any) {
                    const component: any = this.$refs[this.viewname];
                    if (component) {
                        const { viewtag: _viewtag } = component;
                        const appview = this.$store.getters['viewaction/getAppView'](_viewtag);
                        if (appview && appview.viewdatachange) {
                            this.isShow = true;
                            const title: any = this.$t('app.tabpage.sureclosetip.title');
                            const contant: any = this.$t('app.tabpage.sureclosetip.content');
                            this.$Modal.confirm({
                                title: title,
                                content: contant,
                                onOk: () => {
                                    this.$store.commit('viewaction/setViewDataChange', { viewtag: _viewtag, viewdatachange: false });
                                    this.isShow = false;
                                },
                                onCancel: () => {
                                    this.isShow = true;
                                }
                            });
                        } else {
                            this.handleShowState($event);
                        }
                    }
                },
                handleShowState: function ($event: any) {
                    if ($event) {
                        return;
                    }
                    if (subject) {
                        if (this.tempResult && Object.is(this.tempResult.ret, 'OK')) {
                            subject.next(this.tempResult);
                        }
                    }
                    setTimeout(() => {
                        vueExample.$destroy();
                        document.body.removeChild(vueExample.$el);
                        subject = null;
                    }, 500)
                },
            },
            render() {
                return (
                    <drawer
                        placement={this.placement}
                        closable={false}
                        v-model={this.isShow}
                        width={this.width}
                        on-on-visible-change={($event: any) => this.onVisibleChange($event)}>
                        {
                            this.viewname && !Object.is(this.viewname, '') ?
                                this.$createElement(this.viewname, {
                                    class: {
                                        viewcontainer2: true,
                                    },
                                    props: {
                                        viewdata: JSON.stringify(data)
                                    },
                                    on: {
                                        viewdataschange: ($event: any) => this.dataChange($event),
                                        viewdatasactivated: ($event: any) => this.viewDatasActivated($event),
                                        close: ($event: any) => this.close($event)
                                    },
                                    ref: this.viewname,
                                }) : ''
                        }
                    </drawer>
                );
            }
        });
        return subject;
    }

    /**
     * 打开抽屉
     *
     * @param {({ viewname: string, title: string, width?: number, height?: number, placement?: 'DRAWER_LEFT' | 'DRAWER_RIGHT'  })} view
     * @param {*} [data={}]
     * @returns {Subject<any>}
     * @memberof AppDrawer
     */
    public openDrawer(view: { viewname: string, title: string, width?: number, height?: number, placement?: 'DRAWER_LEFT' | 'DRAWER_RIGHT' }, data: any = {}): Subject<any> {
        try {
            const uuid = this.getUUID();
            const subject = this.createVueExample(view, data, uuid);
            return subject;
        } catch (error) {
            console.log(error);
            return new Subject<any>();
        }
    }

    /**
     * 生成uuid
     *
     * @private
     * @returns {string}
     * @memberof AppDrawer
     */
    private getUUID(): string {
        function s4() {
            return Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1);
        }
        return s4() + s4() + '-' + s4() + '-' + s4() + '-' + s4() + '-' + s4() + s4() + s4();
    }


}