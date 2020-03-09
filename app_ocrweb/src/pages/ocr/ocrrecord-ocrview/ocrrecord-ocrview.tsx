import { Vue, Component, Prop, Provide, Emit, Watch } from 'vue-property-decorator';
import { Subject } from 'rxjs';
import { CreateElement } from 'vue';
import './ocrrecord-ocrview.less';


@Component({
    components: {
    },
    beforeRouteEnter: (to: any, from: any, next: any) => {
        next((vm: any) => {
            vm.$store.commit('addCurPageViewtag', { fullPath: to.fullPath, viewtag: vm.viewtag });
        });
    },
})
export default class OCRRecordOCRView extends Vue {

    /**
     * 数据变化
     *
     * @param {*} val
     * @returns {*}
     * @memberof OCRRecordOCRView
     */
    @Emit()
    public viewDatasChange(val: any): any {
        return val;
    }

    /**
     * 数据视图
     *
     * @type {string}
     * @memberof OCRRecordOCRView
     */
    @Prop() public viewdata!: string;

	/**
	 * 视图标识
	 *
	 * @type {string}
	 * @memberof AppDashboardView
	 */
    public viewtag: string = 'fc360c80a82ac7fb9be7066e612d042e';

    /**
     * 父数据对象
     *
     * @protected
     * @type {*}
     * @memberof OCRRecordOCRView
     */
    protected srfparentdata: any = {};

    /**
     * 视图模型数据
     *
     * @type {*}
     * @memberof OCRRecordOCRView
     */
    public model: any = {
        srfTitle: '通用识别视图',
        srfCaption: 'ocrrecord.views.ocrview.caption',
        srfSubCaption: '',
        dataInfo: ''
    }

    /**
     * 处理值变化
     *
     * @param {*} newVal
     * @param {*} oldVal
     * @memberof OCRRecordOCRView
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
     * @memberof OCRRecordOCRView
     */
    public containerModel: any = {
    };

    /**
     * 视图状态订阅对象
     *
     * @private
     * @type {Subject<{action: string, data: any}>}
     * @memberof OCRRecordOCRView
     */
    public viewState: Subject<ViewState> = new Subject();



    /**
     * 引擎初始化
     *
     * @private
     * @memberof OCRRecordOCRView
     */
    private engineInit(): void {
    }

    /**
     * Vue声明周期
     *
     * @memberof OCRRecordOCRView
     */
    public created() {
        const secondtag = this.$util.createUUID();
        this.$store.commit('viewaction/createdView', { viewtag: this.viewtag, secondtag: secondtag });
        this.viewtag = secondtag;
        let ocrid: any = this.$route.params.ocrid;
        //如果没有传ocrid则使用每次自动生成的视图唯一id
        if (!ocrid) {
            ocrid = secondtag;
        }
        //加载方法
        this.load(ocrid);
    }

    /**
     * 加载方法
     */
    public load(ocrid: any) {
        const _this: any = this;
        //通过ocrid查询相关数据
        let post: Promise<any> = this.$http.get("ocr/ocrrecord/" + ocrid, {});
        post.then((response) => {
            if (response.status == 200) {
                if (response.data) {
                    _this.ocrPro = response.data;
                    _this.imgItems = response.data.imgItems;
                    _this.$forceUpdate();
                }
            }
        }).catch((e) => {

        });
    }


    /**
     * 销毁之前
     *
     * @memberof OCRRecordOCRView
     */
    public beforeDestroy() {
        this.$store.commit('viewaction/removeView', this.viewtag);
    }

    /**
     * Vue声明周期(组件初始化完毕)
     *
     * @memberof OCRRecordOCRView
     */
    public mounted() {
        const _this: any = this;
        _this.engineInit();
        if (_this.loadModel && _this.loadModel instanceof Function) {
            _this.loadModel();
        }

    }

    /**
     * 关闭视图
     *
     * @param {any[]} args
     * @memberof OCRRecordOCRView
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
     * 绘制视图消息 （上方）
     *
     * @returns
     * @memberof OCRRecordOCRView
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
     * @memberof OCRRecordOCRView
     */
    public renderPosBottomMsgs() {
        return (
            <div class='view-bottom-messages'>
            </div>
        );
    }
    /**
     * websocket连接地址
     */
    public socketurl: string = "ws://" + this.getAddress() + "/websocket/mywebsocket";
    /**
     * 上传加载状态
     */
    public uploading: boolean = false;

    /**
     * ocrrecord对象
     */
    public ocrPro: any = {};

    /**
     * 图片列表
     */
    public imgItems: any = [];

    /**
     * 当前选中img对象
     */
    public currentImg: any = {};

    /**
     * 标签页model初始页
     */
    public activeName: any = "second";

    public layoutStatus: boolean = true;
    /**
     * 图片上传状态
     */
    public uploadstatus: boolean = false;
    public disabled: any = false;
    public content: string = "";

    /**
     * 列表视图布局变更对象
     */
    public layout: any = {
        //栅格，列表中每个图片宽度占比
        imgcol: 4,
        //图片列表宽度总占比
        filelistcol: 24,
        //大图片占比
        bigImgcol: 0,
        //间距占比
        interval: 0,
        //是否显示头部
        showheader: true,
        imgclass: "",
    }

    /**
     * 变更为详情模式
     */
    public updateLayout(img: any) {
        //重置为查看
        this.activeName = "first";
        let layout: any = {
            //图片列表每个图片占比为24一整行
            imgcol: 24,
            //栅格布局，修改整个图片列表占比为4
            filelistcol: 4,
            //修改大图片占行比例为19
            bigImgcol: 20,
            //图片列表与大图片间距比例为1
            interval: 0,
            //改变头部显示状态
            showheader: false
        };
        this.layout = layout;
        //将所有图片当前选中样式去掉
        this.imgItems.forEach((item: any) => {
            item.style = undefined;
        });
        this.layout.imgclass = " compclass";
        //加上当前选中样式
        img.style = "border:2px solid red;";
        img.id = "stop";
        //把选中图片属性赋值给当前图片
        this.currentImg = img;
        this.onScrollChange();
    }

    /**
     * 滚动条到相应位置
     */
    public onScrollChange() {
        const _this: any = this;
        if (_this.layoutStatus)
            this.$nextTick(() => {
                let dom: any = document.getElementById("filelist");
                let count: number = 0;
                let status: any = true;
                this.imgItems.forEach((item: any) => {
                    if (Object.is(item.img, this.currentImg.img)) {
                        status = false;
                    }
                    if (status) {
                        count++;
                    }
                });
                //图片高度+上下边框+内边距+文件名高度+外侧上下内边距+图片外内边距
                dom.scrollTo(0, (168 + 1 * 2 + 5 * 2 + 20 + 20 * 2 + 5 * 2) * (count - 1));
                _this.layoutStatus = false;
            });
    }
    /**
    * 变更为列表模式
    */
    public listLayout() {
        let layout: any = {
            imgcol: 4,
            filelistcol: 24,
            bigImgcol: 0,
            interval: 0,
            showheader: true,
            imgclass: undefined
        };
        this.layout = layout;
        this.imgItems.forEach((item: any) => {
            item.style = undefined;
            item.id = undefined;
        });
        this.layoutStatus = true;
    }


    /**
     * 图片上传前事件
     * @param file 当前上传文件对象
     */
    public beforeUpload(file: any) {
        this.uploadstatus = true;
        this.uploading = true;
    }

    /**
     * 文件上传成功时的回调
     * @param response  响应内容
     * @param file      文件信息
     * @param fileList  文件列表
     */
    public onSuccess(response: any, file: any, fileList: any) {
        let arr: Array<any> = [];
        this.imgItems.forEach((_file: any) => {
            arr.push(_file)
        });
        response.forEach((item: any) => {
            arr.push(item);
        });
        this.imgItems = arr;
        this.uploadstatus = false;
        this.uploading = false;
    }

    /**
     * 刷新图片方法
     * @param img 当前图片对象
     * @param data 新的图片对象
     */
    public imgRefresh(img: any, data: any) {
        if (data.width > 0 && data.height > 0)
            img.height = data.height;
        img.width = data.width;
        if (data.base64)
            img.base64 = data.base64;
        this.$forceUpdate();
    }

    /**
     * 单个识别方法
     */
    public singleOcr() {
        const _this: any = this;
        _this.disabled = true;
        _this.currentImg.cls = "currentImg-animate";
        _this.updateStauts(_this.currentImg, 2);
        _this.currentImg.loading = true;
        let ocrid: any = _this.ocrPro.ocrrecordid;
        let params: any = { ocrrecordid: ocrid, img: _this.currentImg.img };
        let connection: string = _this.socketurl;
        let socket: any = new WebSocket(connection);
        socket.onopen = () => {
            console.log("连接成功!");
            socket.send(JSON.stringify(params));
        }
        socket.onmessage = ($event: any) => {
            _this.disabled = false;
            _this.currentImg.loading = false;
            _this.currentImg.cls = "";
            let data: any = JSON.parse($event.data);
            _this.currentImg.ocrState = data.ocrState;
            _this.currentImg.content = data.content;
            _this.currentImg.res = data.res;
            _this.imgRefresh(_this.currentImg, data);
            socket.close();
        }
        socket.onclose = () => {
            console.log("连接断开");
        }
    }

    public singleOcr2(params: any) {
        const _this: any = this;
        let connection: string = _this.socketurl;
        let socket: any = new WebSocket(connection);
        socket.onopen = () => {
            console.log("连接成功!");
            socket.send(JSON.stringify(params));
        }
        socket.onmessage = ($event: any) => {
            let data: any = JSON.parse($event.data);
            let store: number = 0;
            _this.imgItems.forEach((item: any, index: any) => {
                if (Object.is(item.img, data.img)) {
                    store = index;
                }
            });
            _this.imgItems[store].ocrState = data.ocrState;
            _this.imgItems[store].content = data.content;
            _this.imgItems[store].res = data.res;
            _this.imgRefresh(_this.imgItems[store], data);
            socket.close();
        }
        socket.onclose = () => {
            console.log("连接断开");
        }
    }

    /**
     * 多个识别方法
     */
    public multOcr() {
        const _this: any = this;
        _this.imgItems.forEach((item: any) => {
            _this.updateStauts(item, 2);
        });
        _this.imgItems.forEach((item: any) => {
            let params: any = { ocrrecordid: _this.ocrPro.ocrrecordid, img: item.img };
            _this.singleOcr2(params);
        });
    }

    /**
     * 更改文件状态
     */
    public updateStauts(prop: any, status: any) {
        this.imgItems.forEach((item: any) => {
            if (Object.is(item.img, prop.img))
                item.ocrState = status;
        });
        this.$forceUpdate();
    }

    /**
     * 绘制表格列
     */
    public columns: any = [
        {
            width: 60,
            title: '序号',
            align: 'center',
            key: 'name'
        }, {
            title: '内容',
            align: 'center',
            render: (h: any, params: any) => {
                //文本框
                return this.renderInput(params.row);
            }
        }
    ];

    /**
     * 绘制文本框
     * @param row 
     */
    public renderInput(row: any) {
        return (
            <el-input v-model={row.text}></el-input>
        )
    }
    /**
     * 预览图片集合
     */
    public preViewImage: any = [];

    /**
     * 预览图片
     */
    public onPreView() {
        this.preViewImage = ["data:image/" + this.currentImg.img.substring(this.currentImg.img.indexOf("."), this.currentImg.img.length) + ";base64," + this.currentImg.base64];
    }

    /**
     * 获取当前后端地址与端口
     */
    public getAddress(): string {
        let host: string = window.location.host;
        return host;
    }

    /**
     * 旋转方法
     * @param deg 旋转度数
     */
    public rotate(deg: any) {
        const _this: any = this;
        let ocrrecordid: any = this.ocrPro.ocrrecordid;
        let param: any = { img: this.currentImg.img };
        let post: Promise<any> = this.$http.post("ocr/ocrrecord/" + ocrrecordid + "/rotateimg/" + deg, param);
        post.then((response: any) => {
            if (response.status == 200) {
                let data: any = response.data;
                if (data)
                    _this.imgRefresh(_this.currentImg, data);
            }
        }).catch(() => {

        });
    }

    /**
     *纠偏
     */
    public rectify() {
        const _this: any = this;
        let ocrrecordid: any = this.ocrPro.ocrrecordid;
        let param: any = { img: this.currentImg.img };
        let post: Promise<any> = this.$http.post("ocr/ocrrecord/" + ocrrecordid + "/deskewimg", param);
        post.then((response: any) => {
            if (response.status == 200) {
                let data: any = response.data;
                if (data)
                    _this.imgRefresh(_this.currentImg, data);
            }
        }).catch(() => {

        });
    }

    /**
     * 增强对比度
     */
    public enhanceContrast() {
        const _this: any = this;
        let ocrrecordid: any = this.ocrPro.ocrrecordid;
        let param: any = { img: this.currentImg.img };
        let post: Promise<any> = this.$http.post("ocr/ocrrecord/" + ocrrecordid + "/normalizeimg", param);
        post.then((response: any) => {
            if (response.status == 200) {
                let data: any = response.data;
                if (data)
                    _this.imgRefresh(_this.currentImg, data);
            }
        }).catch(() => {

        });
    }

    /**
     * 去红
     */
    public removered() {
        const _this: any = this;
        let ocrrecordid: any = this.ocrPro.ocrrecordid;
        let param: any = { img: this.currentImg.img };
        let post: Promise<any> = this.$http.post("ocr/ocrrecord/" + ocrrecordid + "/removered", param);
        post.then((response: any) => {
            if (response.status == 200) {
                let data: any = response.data;
                if (data)
                    _this.imgRefresh(_this.currentImg, data);
            }
        }).catch(() => {

        });
    }


    /**
     * 下载word
     */
    public downloadWord() {
        let url = "../ocr/ocrrecord/ocrFile/downloadWord/" + this.ocrPro.ocrrecordid;
        window.open(url);
    }
    /**
     * 下载pdf
     */
    public downloadPDF() {
        let url = "../ocr/ocrrecord/ocrFile/previewPDF/" + this.ocrPro.ocrrecordid;
        window.open(url);
    }
    public metadata() {
        let url = "../ocr/nlp/" + this.ocrPro.ocrrecordid + ".html";
        window.open(url);
    }

    public dialogVisible: boolean = false;

    public showDialog(show: boolean) {
        if (show) {
            const _this: any = this;
            //通过ocrid查询相关数据
            let post: Promise<any> = this.$http.get("ocr/result/" + this.$route.params.ocrid, {});
            post.then((response) => {
                if (response.status == 200) {
                    if (response.data) {
                        let data: any = response.data;
                        _this.content = data.content;
                        _this.$forceUpdate();
                    }
                }
            }).catch((e) => {

            });
        }
        this.dialogVisible = show;
    }
    /**
     * 绘制内容
     *
     * @param {CreateElement} h
     * @returns
     * @memberof OCRRecordOCRView
     */
    public render(h: CreateElement) {
        return (
            <div class={"view-container ocrrecord-ocrview"} >
                <div class={"view-body"}>
                    <card class={'view-card'} dis-hover={true} padding={0} bordered={false}>
                        {/* <p slot={"title"}>识别记录</p> */}
                        <div class={"content-container"}>
                            <div v-show={this.layout.showheader}>
                                <el-row class={"mode"}>
                                    <div v-loading={this.uploading} element-loading-spinner={"el-icon-loading"} element-loading-text={"上传中"}>
                                        {this.renderUpload()}
                                    </div>
                                </el-row>
                                <el-row class={"operation mode"}>
                                    <el-col class={"item"} span={5}>
                                        <el-button on-click={this.multOcr} type={"primary"} round><i class={"el-icon-caret-right"}></i>开始识别</el-button>
                                    </el-col>
                                    <el-col class={"item"} span={5}>
                                        <el-button type={"primary"} on-click={() => this.downloadWord()} round><icon type={"logo-wordpress"} />下载word</el-button>
                                    </el-col>
                                    <el-col class={"item"} span={5}>
                                        <el-button type={"primary"} on-click={() => this.downloadPDF()} round><icon type={"md-images"} />下载pdf</el-button>
                                    </el-col>
                                    <el-col class={"item"} span={5}>
                                        <el-button type={"primary"} on-click={() => this.metadata()} round>
                                            <icon type={"md-images"} />
                                            元数据提取
                                        </el-button>
                                    </el-col>
                                    <el-col class={"item"} span={4}>
                                        <el-button on-click={() => this.showDialog(true)} type={"primary"} round><icon type={"el-icon-s-order"} />识别结果</el-button>
                                        <el-dialog
                                            title={"识别内容"}
                                            modal-append-to-body={false}
                                            visible={this.dialogVisible}
                                            before-close={() => this.showDialog(false)}
                                            width={"50%"}>
                                            <div>
                                                <el-input style={"height:400px;"} resize={"none"} type={"textarea"} v-model={this.content}></el-input>
                                            </div>
                                            <span slot={"footer"} class={"dialog-footer"}>
                                                <el-button type={"primary"} on-click={() => this.showDialog(false)}>确 定</el-button>
                                            </span>
                                        </el-dialog>
                                    </el-col>
                                </el-row>
                            </div>
                            <div></div>
                            <div>
                                <el-row style={"min-height:500px;"} class={"mode"}>
                                    <el-col id={"filelist"} span={this.layout.filelistcol}>
                                        <el-row>
                                            {this.imgItems.length > 0 ?
                                                this.imgItems.map((img: any) => {
                                                    return <el-col class={"item"} span={this.layout.imgcol}>
                                                        <div id={img.id} style={img.style} on-click={(!Object.is(img.ocrState, 2) && !this.disabled) ? () => this.updateLayout(img) : ''} class={Object.is(this.layout.imgclass, undefined) ? "imgDiv" : "imgDiv" + this.layout.imgclass}>
                                                            <el-link underline={false}/*  disabled={true} */>
                                                                <div class={Object.is(img.ocrState, 2) ? "swiper-animate" : ""}></div>
                                                                <el-card v-loading={Object.is(img.ocrState, 2) ? "loading" : ""} element-loading-spinner="el-icon-loading" element-loading-text="识别中" style="padding:5px" class={"box-card"}>
                                                                    {!Object.is(img.ocrState, 2) ? (Object.is(img.ocrState, 1) ? <i class="iconsize el-icon-upload-success el-icon-circle-check"></i> : '' ||
                                                                        Object.is(img.ocrState, 0) ? <i class={"iconsize el-icon-more-outline el-icon-circle-check"}><p class={"psize"}>待识别</p></i> : '' ||
                                                                            Object.is(img.ocrState, -1) ? <i class={"iconsize el-icon-warning-outline el-icon-error"}><p class={"psize"}>识别失败</p></i> : '') : ''}
                                                                    <el-image src={"data:image/" + img.img.substring(img.img.indexOf("."), img.img.length) + ";base64," + img.base64}></el-image>
                                                                </el-card>
                                                            </el-link>
                                                            <p class={"filename"}>{img.img}</p>
                                                        </div>
                                                    </el-col>
                                                }) : ''}
                                        </el-row>
                                    </el-col>
                                    <el-col span={this.layout.interval}>

                                    </el-col>
                                    <el-col span={this.layout.bigImgcol}>
                                        <el-card class={"recordContent"} ref={"box"}>
                                            <el-row>
                                                <el-col span={12}>
                                                    <el-row class="toolbar">
                                                        <el-col class={"item"}>
                                                            <el-button disabled={this.disabled} on-click={() => this.rotate(-90)} size={"mini"} icon={"el-icon-refresh-left"} circle></el-button>
                                                        </el-col>
                                                        <el-col class={"item"}>
                                                            <el-button disabled={this.disabled} on-click={this.rectify} size={"mini"} icon={"el-icon-finished"}>纠偏</el-button>
                                                        </el-col>
                                                        <el-col class={"item"}>
                                                            <el-button disabled={this.disabled} on-click={this.enhanceContrast} size={"mini"} icon={"el-icon-search"}>+对比度</el-button>
                                                        </el-col>
                                                        <el-col class={"item"}>
                                                            <el-button disabled={this.disabled}
                                                                on-click={this.removered} size={"mini"}
                                                                icon={"el-icon-search"}>去红
                                                            </el-button>
                                                        </el-col>
                                                        <el-col class={"item"}>
                                                            <el-button disabled={this.disabled}
                                                                on-click={this.singleOcr} size={"mini"}
                                                                icon={"el-icon-caret-right"}>识别
                                                                        </el-button>
                                                        </el-col>
                                                        <el-col class={"item"}>
                                                            <el-button disabled={this.disabled} on-click={() => this.rotate(90)} size={"mini"} icon={"el-icon-refresh-right"} circle></el-button>
                                                        </el-col>
                                                    </el-row>
                                                    <div class={"isScrollDiv"} style={"text-align:left;"}>
                                                        <el-link underline={false}>
                                                            <div class={this.currentImg.cls}></div>
                                                            <el-card v-loading={Object.is(this.currentImg.loading, true) ? "loading" : ''} element-loading-spinner={Object.is(this.currentImg.loading, true) ? "el-icon-loading" : ''} element-loading-text={Object.is(this.currentImg.loading, true) ? "识别中" : ''} class="currentImgCard">
                                                                {this.currentImg.img ?
                                                                    <el-image on-click={this.onPreView} preview-src-list={this.preViewImage} style={"width: 600px;"} src={"data:image/" + this.currentImg.img.substring(this.currentImg.img.indexOf("."), this.currentImg.img.length) + ";base64," + this.currentImg.base64}></el-image> : ''}
                                                            </el-card>
                                                        </el-link>
                                                    </div>
                                                </el-col>
                                                <el-col span={12}>
                                                    <el-button disabled={this.disabled} type={"primary"} class={"item"} icon={"el-icon-s-grid"} size={"mini"} style={"position:absolute; top:5px; right:0px;"}
                                                        on-click={() => this.listLayout()}>
                                                        返回到列表
                                                    </el-button>
                                                    <el-tabs class={"isScrollDiv"} style="border: 1px solid #EBEEF5;" v-model={this.activeName}>
                                                        <el-tab-pane style={"width:" + 600 + "px;height:" + this.currentImg.height * (600 / this.currentImg.width) + "px;"} label={"查看"} name={"first"} class={"discernContent"}>
                                                            {/* <canvas width={1000} height={1500} ref={"myCanvas"}></canvas> */}
                                                            {this.currentImg.res ? this.currentImg.res.map((item: any) => {
                                                                let lh = (item.box[7] - item.box[1]) * (600 / this.currentImg.width);
                                                                if (lh > 1)
                                                                    lh = lh - 1;
                                                                let lstyle = "";
                                                                if (lh < 12)
                                                                    lstyle = "font-family:宋体;line-height:" + lh + "px;font-size:20px;--lscale:" + lh / 20;
                                                                else
                                                                    lstyle = "font-family:宋体;line-height:" + lh + "px;font-size:" + lh + "px;";
                                                                return <div style={"position:absolute;left:" + item.box[0] / this.currentImg.width * 100 + "%;top:" + item.box[1] / this.currentImg.height * 100 + "%;border: 1px solid #ccc;width:" + (item.box[2] - item.box[0]) * (600 / this.currentImg.width) + "px;height:" + ((item.box[7] - item.box[1]) * (600 / this.currentImg.width) + 2) + "px;"}>
                                                                    <div style={lstyle} class={"ocrlinesmallfont"}>{item.text}</div>
                                                                </div>
                                                            }) : ''}
                                                        </el-tab-pane>
                                                        <el-tab-pane label={"识别结果"} name={"second"}>
                                                            {this.currentImg.res ? <div>
                                                                <i-table data={this.currentImg.res} columns={this.columns}></i-table>
                                                            </div> : ''}
                                                        </el-tab-pane>
                                                        <el-tab-pane label={"内容"} name={"last"}>
                                                            {this.currentImg.content ? <div>
                                                                <el-input resize={"none"} style={"height:" + this.currentImg.height * (600 / this.currentImg.width) + "px;"} type="textarea" v-model={this.currentImg.content}></el-input>
                                                            </div> : ''}
                                                        </el-tab-pane>
                                                    </el-tabs>
                                                </el-col>
                                            </el-row>
                                        </el-card>
                                    </el-col>
                                </el-row>

                            </div>

                        </div>
                    </card >
                </div>
            </div >
        );
    }

    /**
     * 上传组件
     */
    public renderUpload() {
        return (
            this.$createElement(
                'el-upload',
                {
                    props: {
                        class: "upload-demo",
                        disabled: this.uploadstatus,
                        accept: '.jpg,.png,.bmp,.jpeg,.gif,.pdf,.JPG,.PNG,.BMP,.JPEG,.GIF,.PDF',
                        drag: true,
                        'show-file-list': false,
                        action: "ocr/ocrrecord/" + this.ocrPro.ocrrecordid + "/upload",
                        'on-success': (response: any, file: any, fileList: any) => this.onSuccess(response, file, fileList),
                        'before-upload': (file: any) => this.beforeUpload(file),
                    }
                },
                [
                    <div>
                        {Object.is(this.uploadstatus, false) ?
                            <div>
                                <i class={"el-icon-upload"}></i>
                                <div class={"el-upload__text"}>将.jpg/.png/.bmp/.jpeg/.gif/.pdf文件拖到此处，或<em>点击上传</em></div>
                            </div> : ''}
                    </div>
                ]
            )
        )
    }
}