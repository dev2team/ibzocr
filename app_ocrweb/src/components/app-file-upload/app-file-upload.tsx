import { Component, Vue, Prop, Watch } from 'vue-property-decorator';
import './app-file-upload.less';
import { Environment } from '@/environments/environment';
import { CreateElement } from 'vue';
import { Subject, Unsubscribable } from 'rxjs';

@Component({})
export default class AppFileUpload extends Vue {

    /**
     * 表单状态
     *
     * @type {Subject<any>}
     * @memberof AppFileUpload
     */
    @Prop() public formState?: Subject<any>

    /**
     * 是否忽略表单项书香值变化
     *
     * @type {boolean}
     * @memberof AppFileUpload
     */
    @Prop() public ignorefieldvaluechange?: boolean;

    /**
     * 表单状态事件
     *
     * @private
     * @type {(Unsubscribable | undefined)}
     * @memberof AppFileUpload
     */
    private formStateEvent: Unsubscribable | undefined;

    /**
     * 表单数据
     *
     * @type {string}
     * @memberof AppFileUpload
     */
    @Prop() public data!: string;

    /**
     * 初始化值
     *
     * @type {*}
     * @memberof AppFileUpload
     */
    @Prop() public value?: any;

    /**
     * 数据值变化
     *
     * @param {*} newval
     * @param {*} val
     * @memberof AppFileUpload
     */
    @Watch('value')
    onValueChange(newval: any, val: any) {
        if (this.ignorefieldvaluechange) {
            return;
        }
        if (newval) {
            this.files = JSON.parse(newval);
            this.dataProcess();
        } else {
            this.files = [];
        }
    }

    /**
     * 所属表单项名称
     *
     * @type {string}
     * @memberof AppFileUpload
     */
    @Prop() public name!: string;

    /**
     * 是否禁用
     *
     * @type {boolean}
     * @memberof AppFileUpload
     */
    @Prop() public disabled?: boolean;

    /**
     * 上传参数
     *
     * @type {string}
     * @memberof AppFileUpload
     */
    @Prop() public uploadparams?: string;

    /**
     * 下载参数
     *
     * @type {string}
     * @memberof AppFileUpload
     */
    @Prop() public exportparams?: string;

    /**
     * 自定义参数
     *
     * @type {*}
     * @memberof AppFileUpload
     */
    @Prop() public customparams?: any;

    /**
     * 上传文件路径
     *
     * @memberof AppFileUpload
     */
    public uploadUrl = Environment.BaseUrl + Environment.UploadFile;

    /**
     * 下载文件路径
     *
     * @memberof AppFileUpload
     */
    public downloadUrl = Environment.BaseUrl + Environment.ExportFile;

    /**
     * 文件列表
     *
     * @memberof AppFileUpload
     */
    public files = [];

    /**
     * 上传keys
     *
     * @type {Array<any>}
     * @memberof AppFileUpload
     */
    public upload_keys: Array<any> = [];

    /**
     * 导出keys
     *
     * @type {Array<any>}
     * @memberof AppFileUpload
     */
    public export_keys: Array<any> = [];

    /**
     * 自定义数组
     *
     * @type {Array<any>}
     * @memberof AppFileUpload
     */
    public custom_arr: Array<any> = [];

    /**
     * 数据处理
     *
     * @private
     * @memberof AppFileUpload
     */
    private dataProcess(): void {
        let upload_arr: Array<string> = [];
        let export_arr: Array<string> = [];
        const _data: any = JSON.parse(this.data);
        this.upload_keys.forEach((key: string) => {
            upload_arr.push(`${key}=${_data[key]}`);
        });
        this.export_keys.forEach((key: string) => {
            export_arr.push(`${key}=${_data[key]}`);
        });

        let _url = `${Environment.BaseUrl}${Environment.UploadFile}`;
        if (upload_arr.length > 0 || this.custom_arr.length > 0) {
            _url = `${_url}?${upload_arr.join('&')}${upload_arr.length > 0 ? '&' : ''}${this.custom_arr.join('&')}`;
        }
        this.uploadUrl = _url;

        this.files.forEach((file: any) => {
            let url = `${this.downloadUrl}/${file.id}`;
            if (upload_arr.length > 0 || this.custom_arr.length > 0) {
                url = `${url}?${upload_arr.join('&')}${upload_arr.length > 0 ? '&' : ''}${this.custom_arr.join('&')}`;
            }
            file.url = url;
        });
    }

    /**
     * vue 生命周期
     *
     * @memberof AppFileUpload
     */
    public created() {
        if (this.formState) {
            this.formStateEvent = this.formState.subscribe(($event: any) => {
                // 表单加载完成
                if (Object.is($event.type, 'load')) {
                    if (this.value) {
                        this.files = JSON.parse(this.value);
                    }
                    this.dataProcess();
                }
            });
        }
    }

    /**
     * vue 生命周期
     *
     * @returns
     * @memberof AppFileUpload
     */
    public mounted() {
        let uploadparams: string = '';
        let exportparams: string = '';

        if (this.uploadparams && !Object.is(this.uploadparams, '')) {
            uploadparams = this.uploadparams;
        }
        if (this.exportparams && !Object.is(this.exportparams, '')) {
            exportparams = this.exportparams;
        }
        let upload_keys: Array<string> = uploadparams.split(';');
        let export_keys: Array<string> = exportparams.split(';');
        let custom_arr: Array<string> = [];
        if (this.customparams && !Object.is(this.customparams, '')) {
            Object.keys(this.customparams).forEach((name: string) => {
                custom_arr.push(`${name}=${this.customparams[name]}`);
            });
        }
        this.upload_keys = upload_keys;
        this.export_keys = export_keys;
        this.custom_arr = custom_arr;

        if (this.value) {
            this.files = JSON.parse(this.value);
        }
        this.dataProcess();
    }

    /**
     * 组件销毁
     *
     * @memberof AppFileUpload
     */
    public destroyed(): void {
        if (this.formStateEvent) {
            this.formStateEvent.unsubscribe();
        }
    }

    /**
     * 上传之前
     *
     * @param {*} file
     * @memberof AppFileUpload
     */
    public beforeUpload(file: any) {
        // console.log('上传之前');
    }

    /**
     * 上传成功回调
     *
     * @param {*} response
     * @param {*} file
     * @param {*} fileList
     * @memberof AppFileUpload
     */
    public onSuccess(response: any, file: any, fileList: any) {
        if (!response) {
            return;
        }
        const data = { name: response.name, id: response.id };
        let arr: Array<any> = [];
        this.files.forEach((_file:any) => {
            arr.push({name: _file.name, id: _file.id})
        });
        arr.push(data);

        let value: any = arr.length > 0 ? JSON.stringify(arr) : null;
        this.$emit('formitemvaluechange', { name: this.name, value: value });
    }

    /**
     * 上传失败回调
     *
     * @param {*} error
     * @param {*} file
     * @param {*} fileList
     * @memberof AppFileUpload
     */
    public onError(error: any, file: any, fileList: any) {
        this.$Notice.error({ title: '上传失败' });
    }

    /**
     * 删除文件
     *
     * @param {*} file
     * @param {*} fileList
     * @memberof AppFileUpload
     */
    public onRemove(file: any, fileList: any) {
        let arr: Array<any> = [];
        fileList.forEach((f: any) => {
            if (f.id != file.id) {
                arr.push({ name: f.name, id: f.id });
            }
        });
        let value: any = arr.length > 0 ? JSON.stringify(arr) : null;
        this.$emit('formitemvaluechange', { name: this.name, value: value });
    }

    /**
     * 下载文件
     *
     * @param {*} file
     * @memberof AppFileUpload
     */
    public onDownload(file: any) {
        window.open(file.url);
    }

    /**
     * 绘制内容
     *
     * @param {CreateElement} h
     * @returns
     * @memberof AppFileUpload
     */
    public render(h: CreateElement) {
        return (
            this.$createElement(
                'el-upload',
                {
                    props: {
                        disabled: this.disabled,
                        'file-list': this.files,
                        action: this.uploadUrl,
                        'before-upload': (file: any) => this.beforeUpload(file),
                        'on-success': (response: any, file: any, fileList: any) => this.onSuccess(response, file, fileList),
                        'before-remove': (file: any, fileList: any) => this.onRemove(file, fileList),
                        'on-error': (error: any, file: any, fileList: any) => this.onError(error, file, fileList),
                        'on-preview': (file: any) => this.onDownload(file),
                    }
                },
                [
                    this.renderElButton(),
                ]
            )
        );
    }

    /**
     * 绘制按钮提示框
     *
     * @returns
     * @memberof AppFileUpload
     */
    public renderElButton() {
        return (
            <el-button size='small' icon='el-icon-upload' disabled={this.disabled}>{this.$t('app.fileUpload.caption')}</el-button>
        );
    }
}