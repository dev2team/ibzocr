import { Component, Vue, Prop, Watch } from 'vue-property-decorator';
import './app-mpicker.less';
import { Subject } from 'rxjs';
import { AppModal } from '@/utils';

@Component({})
export default class AppMpicker extends Vue {

    /**
     * 传入url
     */
    @Prop() url?: any;

    /**
     * 表单数据
     */
    @Prop() activeData?: any;

    /**
     * 是否禁用
     */
    @Prop() disabled?: boolean;

    /**
     * 编辑器参数
     */
    @Prop() editorParams?: any;

    /**
     * 表单项值
     */
    @Prop() curvalue?: any;

    /**
     * 表单项名称
     */
    @Prop() name: any;


    /**
     * 打开对应的选择视图
     */
    @Prop() pickupView?: any;

    /**
     * 当前表单项绑定值key的集合
     */
    public value: any;

    /**
     * 所有操作过的下拉选选项
     */
    public items: Array<any> = [];

    /**
     * 选中项key-value键值对
     * 
     */
    public selectItems: Array<any> = [];

    /**
     * 监听curvalue值
     * @param newVal 
     * @param val 
     */
    @Watch('curvalue', { deep: true })
    oncurvalueChange(newVal: any, val: any) {
        this.value = [];
        this.selectItems = [];
        if (newVal) {
            this.selectItems = JSON.parse(newVal);
            this.selectItems.forEach((item: any) => {
                this.value.push(item.srfkey);
                let index = this.items.findIndex((i) => Object.is(i.value, item.srfkey));
                if (index < 0) {
                    this.items.push({ text: item.srfmajortext, value: item.srfkey });
                }
            });
        }
        this.$forceUpdate();
    }

    /**
     * 远程执行搜索
     *
     * @param {*} query
     * @memberof AppMpicker
     */
    public onSearch(query: any) {
        if (this.url) {
            let param: any = {
                srfaction: 'itemfetch',
                query: query
            };
            if (this.activeData) {
                Object.assign(param, { srfreferdata: this.activeData });
            }
            this.$http.post(`${this.url}${this.name}/ac`, param).then((data: any) => {
                this.items = data.items;
            })
        }
    }

    /**
     * 下拉选中回调
     *
     * @param {*} selects
     * @memberof AppMpicker
     */
    public onSelect(selects: any) {
        let val: Array<any> = [];
        if (selects.length > 0) {
            selects.forEach((select: any) => {
                let index = this.items.findIndex((item) => Object.is(item.value, select));
                if (index >= 0) {
                    let item = this.items[index];
                    val.push({ srfkey: item.value, srfmajortext: item.text });
                } else {
                    index = this.selectItems.findIndex((item: any) => Object.is(item.srfkey, select));
                    if (index >= 0) {
                        let item = this.selectItems[index];
                        val.push(item);
                    }
                }
            });
            let value = val.length > 0 ? JSON.stringify(val) : '';
            this.$emit('formitemvaluechange', { name: this.name, value: value });
        }
    }

    /**
     * 移除标签回调
     *
     * @param {*} tag
     * @memberof AppMpicker
     */
    public onRemove(tag: any) {
        let index = this.selectItems.findIndex((item: any) => Object.is(item.srfkey, tag));
        if (index >= 0) {
            this.selectItems.splice(index, 1);
            let value = this.selectItems.length > 0 ? JSON.stringify(this.selectItems) : '';
            this.$emit('formitemvaluechange', { name: this.name, value: value });
        }
    }

    /**
     * 打开视图
     *
     * @returns
     * @memberof AppMpicker
     */
    public openView() {
        if (this.disabled) {
            return;
        }
        let data = { srfparentdata: { srfparentkey: this.activeData.srfkey }, selectedData: [...this.selectItems], };
        if (this.pickupView && Object.keys(this.pickupView).length > 0) {
            const view = { ...this.pickupView };
            const modal: Subject<any> = AppModal.getInstance().openModal(view, data);
            modal.subscribe((result: any) => {
                if (!result || !Object.is(result.ret, 'OK')) {
                    return;
                }
                let selects: Array<any> = [];
                if (result.datas && Array.isArray(result.datas)) {
                    result.datas.forEach((select: any) => {
                        selects.push({ srfkey: select.srfkey, srfmajortext: select.srfmajortext });
                        let index = this.items.findIndex((item) => Object.is(item.value, select.srfkey));
                        if (index < 0) {
                            this.items.push({ text: select.srfmajortext, value: select.srfkey });
                        }
                    });
                }
                if (this.name && this.activeData) {
                    let value = selects.length > 0 ? JSON.stringify(selects) : '';
                    this.$emit('formitemvaluechange', { name: this.name, value: value });
                }
            })
        }
    }

    /**
     * 渲染组件
     *
     * @returns
     * @memberof AppMpicker
     */
    public render() {
        return (<div>
            <div style="position: relative;width: 100%;">
                <el-select value={this.value} multiple filterable remote remote-method={this.onSearch} size="small" style="width:100%;" on-change={this.onSelect} on-remove-tag={this.onRemove} disabled={this.disabled}>
                    {this.items.map((item: any) => {
                        return <el-option label={item.text} value={item.value}></el-option>
                    })}
                </el-select>
                <span style="position: absolute;right: 5px;color: #c0c4cc;top: 0;font-size: 13px;">
                    <i class="el-icon-search" on-click={this.openView}></i>
                </span>
            </div>
        </div>);
    }
}