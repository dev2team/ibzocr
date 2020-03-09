import { Vue, Component, Prop, Provide, Emit, Watch } from 'vue-property-decorator';
import { Subject } from 'rxjs';
import { CreateElement } from 'vue';
import './index.less';


import view_appmenu from '@widget/app/main-appmenu/main-appmenu';

@Component({
    components: {
        view_appmenu,
    },
    beforeRouteEnter: (to: any, from: any, next: any) => {
        next((vm: any) => {
            vm.$store.commit('addCurPageViewtag', { fullPath: to.fullPath, viewtag: vm.viewtag });
        });
    },
})
export default class Index extends Vue {

    /**
     * 数据变化
     *
     * @param {*} val
     * @returns {*}
     * @memberof Index
     */
    @Emit()
    public viewDatasChange(val: any): any {
        return val;
    }

    /**
     * 数据视图
     *
     * @type {string}
     * @memberof Index
     */
    @Prop() public viewdata!: string;

	/**
	 * 视图标识
	 *
	 * @type {string}
	 * @memberof AppDashboardView
	 */
    public viewtag: string = '030A47FF-D5F9-4FEA-AA24-83DC8B596CDB';

    /**
     * 父数据对象
     *
     * @protected
     * @type {*}
     * @memberof Index
     */
    protected srfparentdata: any = {};

    /**
     * 视图模型数据
     *
     * @type {*}
     * @memberof Index
     */
    public model: any = {
        srfTitle: '',
        srfCaption: 'app.views.index.caption',
        srfSubCaption: '',
        dataInfo: ''
    }

    /**
     * 处理值变化
     *
     * @param {*} newVal
     * @param {*} oldVal
     * @memberof Index
     */
    @Watch('viewdata')
    onViewData(newVal: any, oldVal: any) {
        const _this: any = this;
        if (!Object.is(newVal, oldVal) && _this.engine) {
            _this.engine.setViewData(newVal);
            _this.engine.load();
        }
    }

    /**
     * 容器模型
     *
     * @type {*}
     * @memberof Index
     */
    public containerModel: any = {
        view_appmenu: { name: 'appmenu', type: 'APPMENU' },
    };

    /**
     * 视图状态订阅对象
     *
     * @private
     * @type {Subject<{action: string, data: any}>}
     * @memberof Index
     */
    public viewState: Subject<ViewState> = new Subject();




    /**
     * 引擎初始化
     *
     * @private
     * @memberof Index
     */
    private engineInit(): void {
    }

    /**
     * Vue声明周期
     *
     * @memberof Index
     */
    public created() {
        const secondtag = this.$util.createUUID();
        this.$store.commit('viewaction/createdView', { viewtag: this.viewtag, secondtag: secondtag });
        this.viewtag = secondtag;

    }

    /**
     * 销毁之前
     *
     * @memberof Index
     */
    public beforeDestroy() {
        this.$store.commit('viewaction/removeView', this.viewtag);
    }

    /**
     * Vue声明周期(组件初始化完毕)
     *
     * @memberof Index
     */
    public mounted() {
        const _this: any = this;
        _this.engineInit();
        if (_this.loadModel && _this.loadModel instanceof Function) {
            _this.loadModel();
        }
        this.viewState.next({ tag: 'appmenu', action: 'load', data: {} });
        if (!this.$route.params.ocrid) {
            this.openOcrrecordOcrView();
        }
    }




    /**
     * 关闭视图
     *
     * @param {any[]} args
     * @memberof Index
     */
    public closeView(args: any[]): void {
        let _view: any = this;
        if (_view.viewdata) {
            _view.$emit('viewdataschange', args);
            _view.$emit('close');
        } else if (_view.$tabPageExp) {
            _view.$tabPageExp.onClose(_view.$route.fullPath);
        }
    }

    /**
     * api地址
     *
     * @private
     * @type {string}
     * @memberof Index
     */
    private url: string = 'ocrweb/ocr/Index.do';

    /**
     * api地址
     *
     * @private
     * @type {string}
     * @memberof Index
     */
    private mode: string = 'vertical';

    /**
     * 当前主题
     *
     * @readonly
     * @memberof Index
     */
    get selectTheme() {
        if (this.$router.app.$store.state.selectTheme) {
            return this.$router.app.$store.state.selectTheme;
        } else if (localStorage.getItem('theme-class')) {
            return localStorage.getItem('theme-class');
        } else {
            return 'app-default-theme';
        }
    }

    /**
     * 当前字体
     *
     * @readonly
     * @memberof Index
     */
    get selectFont() {
        if (this.$router.app.$store.state.selectFont) {
            return this.$router.app.$store.state.selectFont;
        } else if (localStorage.getItem('font-family')) {
            return localStorage.getItem('font-family');
        } else {
            return 'Microsoft YaHei';
        }
    }

    /**
     * 菜单收缩变化
     */
    public collapseChange: boolean = false;

    /**
     * 菜单收缩点击
     */
    public handleClick() {
        this.collapseChange = !this.collapseChange;
    }

    /**
     * 默认打开的视图
     *
     * @type {*}
     * @memberof Index
     */
    public defPSAppView: any = {
    };

    /**
     * 应用起始页面
     *
     * @type {boolean}
     * @memberof Index
     */
    public isDefaultPage: boolean = true;


    /**
     * 绘制视图消息 （上方）
     *
     * @returns
     * @memberof Index
     */
    public renderPosTopMsgs() {
        return (
            <div class='view-top-messages'>
            </div>
        );
    }

    /**
     * 绘制视图消息 （下方）
     *
     * @returns
     * @memberof Index
     */
    public renderPosBottomMsgs() {
        return (
            <div class='view-bottom-messages'>
            </div>
        );
    }

    public openOcrGridView() {
        const viewdata: any = {};
        const openIndexViewTab = (viewpath: string, viewdata: any) => {
            const _params = this.$util.prepareRouteParmas({
                route: this.$route,
                sourceNode: this.$route.name,
                targetNode: viewpath,
                data: viewdata
            });
            this.$router.push({ name: viewpath, params: _params });
        }
        openIndexViewTab('ocr_ocrrecordgridview', viewdata);
    }

    public openOcrrecordOcrView() {
        this.$router.push({ name: 'ocr_ocrrecordocrview', params: { ocrid: this.$util.createUUID() } });
    }

    public indexWidth = 20;

    public pushWidth = 2;
    /**
     * 绘制内容
     *
     * @param {CreateElement} h
     * @returns
     * @memberof Index
     */
    public render(h: CreateElement) {
        return (
            <div class="index_view index">
                <layout class={{ 'app_theme_blue': 'app_theme_blue' == this.selectTheme ? true : false, 'app-default-theme': 'app-default-theme' == this.selectTheme ? true : false, 'app_theme_darkblue': 'app_theme_darkblue' == this.selectTheme ? true : false }} style={{ 'font-family': this.selectFont, 'height': '100vh' }}>
                    <header class="index_header">
                        <div class="page-logo">
                            <svg width="150px" height="20px" viewBox="0 0 277 60" version="1.1" xmlns="http://www.w3.org/2000/svg" xlink="http://www.w3.org/1999/xlink">
                                <title>logo</title>
                                <desc>Created with Sketch.</desc>
                                <g id="页面1" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
                                    <g id="Apple-TV" transform="translate(-822.000000, -80.000000)" fill-rule="nonzero">
                                        <g id="logo" transform="translate(822.000000, 80.000000)">
                                            <path d="M84.7587939,33 C84.3400314,33 83.9422129,32.855404 83.5653265,32.5662099 C83.1884404,32.2770158 83,31.9117221 83,31.4703186 C83,30.8006061 83.3517553,30.0547979 84.0552764,29.2328759 C84.7587975,28.4109559 85.4874333,28 86.2412061,28 C86.7437211,28 87.1624774,28.1407903 87.4974874,28.422375 C87.8324974,28.7039598 88,29.1111079 88,29.6438359 C88,30.2983298 87.6566197,31.0213058 86.9698493,31.8127843 C86.2830787,32.6042648 85.5460676,33 84.7587939,33 Z M87,43.1071413 L87,44.8800002 C85.4032842,46.9038197 83.913587,48.4297553 82.5308641,49.4578566 C81.1481411,50.4859558 79.9711982,51 79,51 C77.6501989,51 76.6460938,50.3038162 75.9876542,48.9114271 C75.3292146,47.51904 75,45.9971505 75,44.345713 C75,43.7142826 75.0658429,43.1111916 75.1975308,42.5364271 C75.3292186,41.9616625 75.4855956,41.4880956 75.6666665,41.1157137 C75.8477374,40.7433317 76.1851825,40.1604794 76.6790122,39.3671417 C79.0164725,35.7890278 81.1563689,34 83.0987653,34 C84.1028856,34 84.6049382,34.3804718 84.6049382,35.1414285 C84.6049382,35.6595252 84.2798385,36.4690405 83.6296296,37.5699981 C82.9794205,38.6709579 82.3991795,39.4561863 81.8888887,39.9257136 C80.4567829,41.2857195 79.5226359,42.2328532 79.0864196,42.7671425 C78.6502035,43.3014297 78.4320986,43.9085667 78.4320986,44.5885708 C78.4320986,45.1714317 78.6543186,45.6571409 79.0987654,46.0457134 C79.543212,46.4342859 80.119338,46.62857 80.8271605,46.62857 C81.6008269,46.62857 82.4526703,46.3492873 83.382716,45.7907132 C84.3127617,45.2321392 85.5185111,44.3376253 87,43.1071413 Z M93,51 L93,13 L105.747082,13 C116.805447,13 119.856031,16.3948127 119.856031,23.2391931 C119.856031,27.1815562 118.494163,29.8645533 114.354086,31.0144092 L114.354086,31.2334294 C118.766537,32.3832853 121,35.2853026 121,40.0489914 C121,46.9481268 117.949416,51 106.891051,51 L93,51 Z M101,29 L103.670157,29 C108.853403,29 111,28.1818182 111,24.4727273 C111,20.5454545 108.905759,20 103.670157,20 L101,20 L101,29 Z M101,44 L105.038462,44 C111.211538,44 113,43.1306818 113,39.5 C113,36.1761364 111.269231,35 105.038462,35 L101,35 L101,44 Z M134.5,17 C130.888889,17 130,16.5263158 130,12.9473684 C130,9.36842105 130.888889,9 134.5,9 C138.166667,9 139,9.36842105 139,12.9473684 C139,16.5263158 138.166667,17 134.5,17 Z M130,51 L130,22 L138,22 L138,51 L130,51 Z M147,51 L147,44.3944444 L161.004377,28.5518519 L161.004377,28.2296296 L148.039387,28.2296296 L148.039387,22 L170.851204,22 L170.851204,28.2296296 L156.5186,44.287037 L156.5186,44.6092593 L172,44.6092593 L172,51 L147,51 Z M189.523364,43.7723343 L205,43.7723343 L205,51 L181,51 L181,13 L189.523364,13 L189.523364,43.7723343 Z M225.419162,21 C235.53493,21 239,24.273703 239,30.391771 L239,50.4633274 L231.734531,50.4633274 L230.952096,47.0822898 C229.666667,49.2289803 226.313373,51 221.339321,51 C214.576846,51 211,48.1556351 211,42.1449016 C211,35.4364937 215.303393,33.0214669 223.407186,33.0214669 L230.896208,33.0214669 L230.896208,32.2701252 C230.896208,28.8354204 229.778443,27.4937388 224.469062,27.4937388 C222.289421,27.4937388 220.10978,27.6547406 218.041916,28.0304114 L218.041916,21.4293381 C220.333333,21.1610018 223.239521,21 225.419162,21 Z M222.450704,46 C226.225352,46 228.929577,44.5555556 230,42.5 L230,39 L223.690141,39 C219.633803,39 218,39.6666667 218,42.7222222 C218,45.1111111 219.295775,46 222.450704,46 Z M265.078394,20.4545455 C274.782027,20.4545455 277,26.3454545 277,35.7272727 C277,44.1818182 274.782027,51 265.078394,51 C259.367113,51 257.038241,49.1454545 255.873805,46.3090909 L255.319312,50.4545455 L248,50.4545455 L248,9 L256.040153,9 L256.040153,24.5454545 C257.204589,22.3636364 259.810707,20.4545455 265.078394,20.4545455 Z M262.827731,46 C268.289916,46 269,41.9473684 269,37.0526316 C269,31.8421053 268.180672,28 262.827731,28 C257.420168,28 256,31.3157895 256,37.0526316 C256,42.5263158 257.420168,46 262.827731,46 Z" id="注册iBizLab账号" fill="#333333"></path>
                                            <g id="编组" fill="#01B0FF">
                                                <path d="M33,53.9848293 C39.3232242,53.9848293 45.6616122,53.9848293 52,54 C48.6488428,49.9646018 45.2673584,45.9747155 41.8555467,42 C38.9896249,46.0505689 36.0478851,50.0556258 33,53.9848293 L33,53.9848293 Z M45,37.2539103 C48.4335443,41.4270073 51.7721519,45.6757039 55,50 C54.9525316,40.3383733 55,30.6616267 54.9683544,21 C51.9303797,26.5641293 48.7025316,32.052659 45,37.2539103 L45,37.2539103 Z M21,21 C21.2871111,31.3772333 25.5786667,40.9994895 30.4897778,50 C33.0586667,45.7958142 35.5217778,41.5472179 38,37.2838182 C32.4542222,31.7325166 27.0142222,26.0627871 21,21 L21,21 Z M4.24776231,8 C3.99247773,23.2587549 3.8010143,38.5324254 4.37540459,53.7762646 C11.9062995,54.0894942 19.4531498,53.9701686 27,54 C16.9481699,39.9345006 7.4228642,24.8845655 4.24776231,8 L4.24776231,8 Z M13,5 C22.6175691,13.1440536 31.7201818,21.8107202 40.2472548,31 C44.669822,22.4349525 48.8652025,13.7682858 53,5.07258514 C39.6717152,5.04355109 26.3434305,5.1451703 13,5 L13,5 Z M0,0 L59.7331546,0 C60.0637531,19.995 60.123862,40.005 59.7031002,60 L0,60 L0,0 Z" id="Fill-1"></path>
                                            </g>
                                        </g>
                                    </g>
                                </g>
                            </svg>
                        </div>
                        <div class="header-right" style="display: flex;align-items: center;justify-content: space-between;">
                            <div on-click={this.openOcrrecordOcrView} style='font-size: 15px;padding: 0 10px;cursor: pointer;color:black;   '>
                                <span>通用识别</span>
                            </div>
                            <div on-click={this.openOcrGridView} style='font-size: 15px;padding: 0 10px;cursor: pointer;color:black;'>
                                <span>识别记录</span>
                            </div>
                            <app-user></app-user>
                        </div>
                    </header>
                    <layout>
                        <i-col style="height:100%" xs={{ span: 24, offset: 0, push: 0 }} sm={{ span: 24, offset: 0, push: 0 }} md={{ span: 24, offset: 0, push: 0 }} lg={{ span: 24, offset: 0, push: 0 }} xl={{ span: 24, offset: 0, push: 0 }} xxl={{ span: this.indexWidth, offset: 0, push: this.pushWidth }} id={'ibiz-page'}>
                            <div class="content">
                                <router-view key={this.$route.fullPath}></router-view>
                            </div>
                        </i-col>
                    </layout>
                </layout>
            </div >
        );
    }

}
