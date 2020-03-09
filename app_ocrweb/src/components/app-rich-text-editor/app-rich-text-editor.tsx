import { Vue, Component, Prop, Model, Watch } from 'vue-property-decorator';
import './app-rich-text-editor.less';
import { Subject } from 'rxjs';
import { Environment } from '@/environments/environment';
import axios from 'axios';

import tinymce from "tinymce/tinymce";

// theme
import 'tinymce/themes/modern';

// plugins
import 'tinymce/plugins/link';
import 'tinymce/plugins/paste';
import 'tinymce/plugins/table';
import 'tinymce/plugins/codesample';
import 'tinymce/plugins/code';

import 'tinymce/plugins/fullscreen';
import 'tinymce/plugins/preview';
import 'tinymce/plugins/textcolor';
import 'tinymce/plugins/hr';
import 'tinymce/plugins/lists';

import 'tinymce/plugins/charmap';
import 'tinymce/plugins/print';
import 'tinymce/plugins/anchor';
import 'tinymce/plugins/pagebreak';
import 'tinymce/plugins/spellchecker';

import 'tinymce/plugins/searchreplace';
import 'tinymce/plugins/visualchars';
import 'tinymce/plugins/visualblocks';
import 'tinymce/plugins/imagetools';
import 'tinymce/plugins/emoticons';

const tinymceCode: any = tinymce;

@Component({})
export default class AppRichTextEditor extends Vue {


    /**
     * 传入值
     *
     * @type {*}
     * @memberof AppRichTextEditor
     */
    @Prop() value?: any;

    /**
     * 监听value值
     *
     * @param {*} newval
     * @param {*} val
     * @memberof AppRichTextEditor
     */
    @Watch('value', { immediate: true, deep: true })
    oncurrentContent(newval: any, val: any) {
        if (newval) {
            if (this.editor) {
                tinymceCode.remove('#' + this.id);
            }
            this.init(newval);
        }
    }

    /**
     * 输入name
     *
     * @type {string}
     * @memberof AppRichTextEditor
     */
    @Prop() name?: string;

    /**
     * 输入高度
     *
     * @type {*}
     * @memberof AppRichTextEditor
     */
    @Prop() height?: any;

    /**
     * 是否禁用
     *
     * @type {*}
     * @memberof AppRichTextEditor
     */
    @Prop() disabled?: any;

    /**
     * 当前语言,默认中文
     *
     * @type {string}
     * @memberof AppRichTextEditor
     */
    @Prop() langu?: string;

    /**
     * 上传文件路径
     *
     * @memberof AppRichTextEditor
     */
    public uploadUrl = '/' + Environment.BaseUrl + Environment.UploadFile;

    /**
     * 下载路径
     *
     * @memberof AppRichTextEditor
     */
    public downloadUrl = '/' + Environment.BaseUrl + Environment.ExportFile;

    /**
     * 当前富文本
     *
     * @type {*}
     * @memberof AppRichTextEditor
     */
    public editor: any = null;

    /**
     * 当前富文本id
     *
     * @type {string}
     * @memberof AppRichTextEditor
     */
    id: string = this.$util.createUUID();

    /**
     * 初始化富文本
     *
     * @memberof AppRichTextEditor
     */
    public mounted() {
        this.init('');
    }

    /**
     * 销毁富文本
     *
     * @memberof AppRichTextEditor
     */
    public destoryed() {
        tinymceCode.remove(this.editor);
    }

    /**
     * 初始化富文本
     *
     * @param {*} val
     * @memberof AppRichTextEditor
     */
    public init(val: any) {
        let richtexteditor = this;
        tinymceCode.init({
            selector: '#' + this.id,
            height: this.height,
            min_height: 400,
            branding: false,

            paste_data_images: true,
            plugins: [
                'link', 'paste', 'table', 'codesample', 'code',
                'fullscreen', 'preview', 'textcolor', 'hr', 'lists',
                'charmap', 'print', 'anchor', 'pagebreak', 'spellchecker',
                'searchreplace', 'visualchars', 'visualblocks', 'imagetools', 'emoticons'
            ],
            menubar: false, //'edit insert view format table',
            toolbar: [
                `styleselect | bold italic underline strikethrough | formatselect fontselect fontsizeselect emoticons | forecolor backcolor |  
                alignleft aligncenter alignright alignjustify | removeformat | print preview | fullscreen`,
                `cut copy paste pastetext undo redo | outdent indent blockquote | subscript superscript hr |  
                bullist numlist | link unlink openlink code charmap | codesample | anchor pagebreak spellchecker searchreplace visualblocks visualchars`,
                `insert | image rotateleft rotateright flipv fliph editimage imageoptions |  
                table tabledelete tablecellprops tablemergecells tablesplitcells tableinsertrowbefore tableinsertrowafter tabledeleterow  
                tablerowprops tableinsertcolbefore tableinsertcolafter tabledeletecol `
            ],

            codesample_languages: [
                { text: 'HTML/XML', value: 'markup' },
                { text: 'JavaScript', value: 'javascript' },
                { text: 'CSS', value: 'css' },
                { text: 'PHP', value: 'php' },
                { text: 'Ruby', value: 'ruby' },
                { text: 'Python', value: 'python' },
                { text: 'Java', value: 'java' },
                { text: 'C', value: 'c' },
                { text: 'C#', value: 'csharp' },
                { text: 'C++', value: 'cpp' }
            ],
            codesample_content_css: 'assets/tinymce/prism.css',
            skin_url: './assets/tinymce/skins/lightgray',
            emoticons_database_urlL: './assets/tinymce/plugins/emoticons',
            language_url: './assets/tinymce/langs/' + (this.langu ? this.langu : 'zh_CN') + '.js',
            setup: (editor: any) => {
                this.editor = editor;
                editor.on('blur', () => {
                    const content = editor.getContent();
                    this.$emit('change', content);
                });
            },
            images_upload_handler: (bolbinfo: any, success: any, failure: any) => {
                const formData = new FormData();
                formData.append('file', bolbinfo.blob(), bolbinfo.filename());
                const _url = richtexteditor.uploadUrl;
                richtexteditor.uploadFile(_url, formData).subscribe((response: any) => {
                    if (response.ret === 0 && response.files.length > 0) {
                        const id: string = response.files[0].id;
                        const url: string = `${richtexteditor.downloadUrl}?fileid=${id}`
                        success(url);
                    }
                }, (error: any) => {
                    console.log(error);
                });
            },
            init_instance_callback: (editor: any) => {
                this.editor = editor;
                let value = (this.value && this.value.length > 0) ? this.value : '';
                if (this.editor) {
                    this.editor.setContent(value);
                }
                if (this.disabled) {
                    this.editor.setMode('readonly');
                }
            }
        });
    }

    /**
     * 上传文件
     *
     * @param {string} url
     * @param {*} formData
     * @returns
     * @memberof AppRichTextEditor
     */
    public uploadFile(url: string, formData: any) {
        let _this = this;
        const subject: Subject<any> = new Subject<any>();
        axios({
            method: 'post',
            url: url,
            data: formData,
            headers: { 'Content-Type': 'image/png', 'Accept': 'application/json' },
        }).then((response: any) => {
            if (response.status === 200) {
                subject.next(response.data);
            } else {
                subject.error(response);
            }
        }).catch((response: any) => {
            subject.error(response);
        });
        return subject;
    }
    
    /**
     * 渲染组件
     *
     * @returns
     * @memberof AppRichTextEditor
     */
    public render() {
        return (
            <textarea id={this.id}></textarea>
        );
    }
}