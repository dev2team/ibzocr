import { Component, Vue, Prop, Model, Watch } from 'vue-property-decorator';
import './app-code-editor.less';

import CodeMirror from 'codemirror';   // CodeMirror，必要
import "codemirror/theme/blackboard.css"; //主题
// import 'codemirror/addon/hint/show-hint.css';
// import 'codemirror/addon/hint/show-hint.js'; 自动填充
import 'codemirror/lib/codemirror.css';    // css，必要

import 'codemirror/mode/javascript/javascript';  // js的语法高亮
import 'codemirror/mode/clike/clike'; // java的语法高亮
import 'codemirror/mode/jsx/jsx'; // jsx的语法高亮
import 'codemirror/mode/sql/sql'; // sql的语法高亮
import 'codemirror/mode/xml/xml'; // xml的语法高亮
import 'codemirror/mode/htmlmixed/htmlmixed';// html的语法高亮
import 'codemirror/mode/vue/vue';// vue的语法高亮



@Component({})
export default class AppCodeEditor extends Vue {

    /**
     * 高度
     */
    @Prop() height?: any;

    /**
     * 宽度
     */
    @Prop() width?: any;

    /**
     * 传入代码类型
     */
    @Prop() codetype?: any;

    /**
     * 是否禁用
     */
    @Prop() disabled?: boolean;

    /**
     * 双向绑定编辑器的值
     */
    @Prop() code: any;

    /**
     * 当前编辑器
     */
    public currenteditor: any;

    /**
     * 初始化编辑器
     */
    public mounted() {
        this.init();
    }

    /**
     * 初始化参数
     */
    public initParam() {
        let mime;
        let isDisabled = this.disabled === true ? true : false;
        let theme = 'blackboard'//设置主题，不设置的会使用默认主题
        if (!this.codetype) {
            mime = { name: "text/x-java" };//当前代码类型
        } else {
            if (Object.is(this.codetype, 'javascript')) {
                mime = { name: "text/javascript" };
            } else if (Object.is(this.codetype, 'java')) {
                mime = { name: "text/x-java" };
            } else if (Object.is(this.codetype, 'css')) {
                mime = { name: "text/x-less" };
            } else if (Object.is(this.codetype, 'html')) {
                mime = { name: "text/html" };
            } else if (Object.is(this.codetype, 'vue')) {
                mime = { name: "script/x-vue" };
            } else if (Object.is(this.codetype, 'jsx')) {
                mime = { name: "text/jsx" };
            } else if (Object.is(this.codetype, 'xml')) {
                mime = { name: "application/xml" };
            } else if (Object.is(this.codetype, 'sql')) {
                mime = { name: "text/x-mysql" };
            }
        }
        let result = {
            mode: mime,//选择对应代码编辑器的语言，我这边选的是数据库，根据个人情况自行设置即可
            indentWithTabs: true,
            indentUnit: 4,         // 缩进单位为4
            styleActiveLine: true, // 当前行背景高亮
            matchBrackets: true,   // 括号匹配
            lineWrapping: true,    // 自动换行
            lineNumbers: true,
            cursorHeight: 0.85,//光标的高度
            showCursorWhenSelecting: true,//是否处于活动状态时是否应绘制光标
            theme: theme,
            autofocus: true,
            extraKeys: { 'Ctrl': 'autocomplete' },//自定义快捷键
            readOnly: isDisabled
        };
        return result;
    }

    /**
     * 初始化 
     */
    public init() {
        let initParam = this.initParam();
        const refs: any = this.$refs;
        this.currenteditor = CodeMirror.fromTextArea(refs.editorcode, initParam);
        let width = this.width ? this.width : '100%';
        let height = this.height ? this.height : '400px';
        this.currenteditor.setSize(width, height);
        //代码自动提示功能，记住使用cursorActivity事件不要使用change事件，这是一个坑，那样页面直接会卡死
        // this.currenteditor.on('cursorActivity', (editor:any) =>{
        //     editor.showHint();
        // });
        this.currenteditor.on('change', (editor: any) => {
            this.$emit('change', editor.getValue());
        });
    }

    /**
     * 渲染组件
     */
    public render() {
        return (<div>
            <textarea ref="editorcode" class="codecss" v-model={this.code}></textarea>
        </div >);
    }

}