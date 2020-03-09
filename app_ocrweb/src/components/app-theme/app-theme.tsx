import { Component, Vue } from 'vue-property-decorator';
import './app-theme.less';

@Component({
    i18n: {
        messages: {
            'zh-CN': {
                caption: {
                    theme: '主题',
                    font: '字体',
                },
                fontFamilys: {
                    MicrosoftYaHei: '微软雅黑',
                    SimHei: '黑体',
                    YouYuan: '幼圆',
                },
            },
            'en-US': {
                caption: {
                    theme: 'Theme',
                    font: 'Font family',
                },
                fontFamilys: {
                    MicrosoftYaHei: 'Microsoft YaHei',
                    SimHei: 'SimHei',
                    YouYuan: 'YouYuan',
                },
            }
        }
    }
})
export default class AppTheme extends Vue {

    /**
     * 所选择的主题
     *
     * @type {*}
     * @memberof AppTheme
     */
    selectTheme: any = '';

    /**
     * 激活主题
     *
     * @type {*}
     * @memberof AppTheme
     */
    public activeTheme: any;

    /**
     * 主题集合
     *
     * @type {Array<any>}
     * @memberof AppTheme
     */
    defaultThemes: Array<any> = [
        {
            tag: 'app-default-theme',
            title: 'light',
            color: '#f6f6f6',
        },
        {
            title: 'Blue',
            tag: 'app_theme_blue',
            color: '#6ba1d1'
        },
        {
            title: 'Dark Blue',
            tag: 'app_theme_darkblue',
            color: '#606d80'
        }
    ];

    /**
     * 所选择的字体
     *
     * @type {*}
     * @memberof AppTheme
     */
    public selectFont: any = '';

    /**
     * 字体集合
     *
     * @memberof AppTheme
     */
    public fontFamilys = [
        {
            label: 'MicrosoftYaHei',
            value: 'Microsoft YaHei',
        },
        {
            label: 'SimHei',
            value: 'SimHei',
        },
        {
            label: 'YouYuan',
            value: 'YouYuan',
        },
    ];

    /**
     * 挂载元素事件
     *
     * @memberof AppTheme
     */
    public mounted() {
        if (localStorage.getItem('theme-class')) {
            this.selectTheme = localStorage.getItem('theme-class');
        } else {
            this.selectTheme = 'app-default-theme';
        }
        if (localStorage.getItem('font-family')) {
            this.selectFont = localStorage.getItem('font-family');
        } else {
            this.selectFont = 'Microsoft YaHei';
        }
    }

    /**
     * 主题变化
     *
     * @param {*} val
     * @memberof AppTheme
     */
    public themeChange(val: any) {
        if (!Object.is(this.activeTheme, val)) {
            this.selectTheme = val;
            localStorage.setItem('theme-class', val);
            this.$router.app.$store.commit('setCurrentSelectTheme', val);
        }
    }

    /**
     * 字体变化
     *
     * @param {*} val
     * @memberof AppTheme
     */
    public fontChange(val: any) {
        if (!Object.is(this.selectFont, val)) {
            this.selectFont = val;
            localStorage.setItem('font-family', val);
            this.$router.app.$store.commit('setCurrentSelectFont', val);
        }
    }

    /**
     * 绘制内容
     *
     * @returns
     * @memberof AppTheme
     */
    public render() {
        return (
            <div class='app-theme'>
                <poptip
                    title={this.$t('caption.theme')}
                    popper-class='app-app-theme'
                    placement='bottom-end'
                    width={Object.is(this.$i18n.locale, 'zh-CN') ? 180 : 240}>
                    <a>
                        <icon class='app-theme-icon' type='md-settings' size={22} />
                    </a>
                    <template slot='content'>
                        <div class='app-theme-color'>
                            {
                                this.defaultThemes.map((theme: any, index: any) => {
                                    return (
                                        <tooltip content={theme.title}>
                                            <div
                                                key={index}
                                                class={{ 'active': this.selectTheme == theme.tag, 'app-theme-item': true }}
                                                style={{ 'background': theme.color }}
                                                on-click={() => { this.themeChange(theme.tag) }}>
                                            </div>
                                        </tooltip>
                                    );
                                })
                            }
                        </div>
                        <div>
                            <i-form label-position='left'>
                                <form-item label={this.$t('caption.font')}>
                                    <i-select
                                        value={this.selectFont}
                                        size='small'
                                        style={{ width: Object.is(this.$i18n.locale, 'zh-CN') ? '100px' : '130px' }}
                                        on-on-change={this.fontChange}
                                        transfer>
                                        {
                                            this.fontFamilys.map((font: any) => {
                                                return (
                                                    <i-option
                                                        value={font.value}
                                                        key={font.value}>
                                                        {this.$t(`fontFamilys.${font.label}`)}
                                                    </i-option>
                                                );
                                            })
                                        }
                                    </i-select>
                                </form-item>
                            </i-form>
                        </div>
                    </template>
                </poptip>
            </div>
        );
    }

}