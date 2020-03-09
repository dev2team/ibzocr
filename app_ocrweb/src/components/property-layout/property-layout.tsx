import { Vue, Component, Prop, Provide, Emit, Watch } from 'vue-property-decorator';
import './property-layout.less';

@Component({})
export default class PropertyLayout extends Vue {

    @Prop()
    public propertyType?: string;
    @Prop()
    public width?: string;
    @Prop()
    public height?: string;


    public render() {
        let className = 'top-and-bottom';
        let style: any = {};
        style.minWidth = this.width ? this.width + 'px' : '';
        style.maxWidth = this.width ? this.width + 'px' : '';
        style.minHeight = this.height ? this.height + 'px' : '';
        style.maxHeight = this.height ? this.height + 'px' : '';
        if(Object.is(this.propertyType, 'RIGHT')) {
            className = 'left-and-right';
        }
        return (
            <div class={className}>
                <div>
                    {this.$slots.default}
                </div>
                <div style={style}>
                    {this.$slots.propertypanel}
                </div>
            </div>
        );
    }
}