import { Vue, Component } from 'vue-property-decorator';

@Component({})
export default class App extends Vue {

    /**
     * vue 生命周期
     *
     * @memberof App
     */
    public mounted() {
        document.body.setAttribute('vue-version', Vue.version);
    }

    /**
     * 绘制内容
     *
     * @returns
     * @memberof App
     */
    public render() {
        return  <router-view/>;
    }
}