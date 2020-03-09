import Vue from 'vue';
import { Subject } from 'rxjs';
import store from '../../store';
import i18n from '@/locale';

import './app-modal.less';

export class AppModal {

    /**
     * 实例对象
     *
     * @private
     * @static
     * @memberof AppModal
     */
    private static modal = new AppModal();

    /**
     * vue 实例
     *
     * @private
     * @type {Vue}
     * @memberof AppModal
     */
    private vueExample!: Vue;

    /**
     * Creates an instance of AppModal.
     * 
     * @memberof AppModal
     */
    private constructor() {
        if (AppModal.modal) {
            return AppModal.modal;
        }
    }

    /**
     * 获取单例对象
     *
     * @static
     * @returns {AppModal}
     * @memberof AppModal
     */
    public static getInstance(): AppModal {
        if (!AppModal.modal) {
            AppModal.modal = new AppModal();
        }
        return AppModal.modal;
    }

    /**
     * 创建 Vue 实例对象
     *
     * @private
     * @param {{ viewname: string, title: string, width?: number, height?: number }} view
     * @param {*} [data={}]
     * @param {string} uuid
     * @returns {Subject<any>}
     * @memberof AppModal
     */
    private createVueExample(view: { viewname: string, title: string, width?: number, height?: number }, data: any = {}, uuid: string): Subject<any> {
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
                    isfullscreen: false,
                    tempResult: { ret: '' },
                    viewname: '',
                    title: '',
                    width: 0,
                    zIndex: null,
                    style: {},
                }
                return data;
            },
            created() {
                this.viewname = view.viewname;
                this.title = view.title;
                if ((!view.width || view.width === 0 || Object.is(view.width, '0px'))) {
                    let width = 600;
                    if (window && window.innerWidth > 100) {
                        if (window.innerWidth > 100) {
                            width = window.innerWidth - 100;
                        } else {
                            width = window.innerWidth;
                        }
                    }
                    this.width = width;
                } else {
                    this.width = view.width;
                }
                if (view.height && !Object.is(view.height, '0px')) {
                    Object.assign(this.style, { height: view.height + 'px' });
                }
            },
            mounted() {
                const curmodal: any = this.$refs.curmodal;
                curmodal.handleGetModalIndex = () => {
                    return 0;
                };
                const zIndex = this.$store.getters.getZIndex();
                if (zIndex) {
                    this.zIndex = zIndex + 100;
                    this.$store.commit('updateZIndex', this.zIndex);
                }
                this.isShow = true;
            },
            beforeDestroy() {
                if (this.zIndex) {
                    const zIndex: any = this.zIndex;
                    this.$store.commit('updateZIndex', zIndex - 100);
                }
            },
            methods: {
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
                    <modal
                        ref='curmodal'
                        class-name='app-modal'
                        v-model={this.isShow}
                        fullscreen={this.isfullscreen}
                        title={this.title}
                        footer-hide={true}
                        mask-closable={false}
                        width={this.width}
                        styles={this.style}
                        z-index={this.zIndex}
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
                    </modal>
                );
            }
        });
        this.vueExample = vueExample;
        return subject;
    }

    /**
     * 打开模态视图
     *
     * @param {{ viewname: string, title: string, width?: number, height?: number }} view
     * @param {*} [data={}]
     * @returns {Subject<any>}
     * @memberof AppModal
     */
    public openModal(view: { viewname: string, title: string, width?: number, height?: number }, data: any = {}): Subject<any> {
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
     * 获取节点标识
     *
     * @private
     * @returns {string}
     * @memberof AppModal
     */
    private getUUID(): string {
        function s4() {
            return Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1);
        }
        return s4() + s4() + '-' + s4() + '-' + s4() + '-' + s4() + '-' + s4() + s4() + s4();
    }

}