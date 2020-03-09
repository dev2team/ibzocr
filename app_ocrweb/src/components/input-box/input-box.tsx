import { Vue, Component, Prop, Model, Emit } from 'vue-property-decorator';
import './input-box.less';
import { Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';

@Component({})
export default class InputBox extends Vue {

    /**
     * 双向绑定值
     * @type {any}
     * @memberof InputBox
     */
    @Model('change') readonly itemValue?: any;

    /**
     * placeholder值
     * @type {String}
     * @memberof InputBox
     */
    @Prop() public placeholder?: string;

    /**
     * 是否禁用
     * @type {boolean}
     * @memberof InputBox
     */
    @Prop() public disabled?: boolean;

    /**
     * 属性类型
     *
     * @type {string}
     * @memberof InputBox
     */
    @Prop() public type?: string;

    /**
     * 当前值
     *
     * @memberof InputBox
     */
    get CurrentVal() {
        return this.itemValue;
    }

    /**
     * 值变化
     *
     * @memberof InputBox
     */
    set CurrentVal(val: any) {
        let _data: any = val;
        if (Object.is(this.type, 'float') && val && !isNaN(val)) {
            try {
                _data = isNaN(parseFloat(val)) ? null : parseFloat(val);
            } catch (error) {
            }
        }
        if (Object.is(this.type, 'number') && val && !isNaN(val)) {
            try {
                _data = isNaN(parseInt(val, 10)) ? null : parseInt(val, 10);
            } catch (error) {
            }
        }
        if (Object.is(_data, '')) {
            _data = null;
        }
        this.$emit('change', _data);
    }

    /**
     * 回车事件
     *
     * @param {*} $event
     * @memberof InputBox
     */
    @Emit()
    public enter($event: any) {
        if (!$event || $event.keyCode !== 13) {
            return;
        }
        return $event;
    }

    /**
     * 渲染组件
     *
     * @returns
     * @memberof InputBox
     */
    public render() {
        return (
            <i-input
                placeholder={this.placeholder}
                v-model={this.CurrentVal}
                disabled={this.disabled ? true : false}
                on-on-enter={($event: any) => this.enter($event)}>
            </i-input>
        );
    }
}