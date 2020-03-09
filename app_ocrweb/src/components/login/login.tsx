import { Vue, Component } from 'vue-property-decorator';
import './login.less';
import { Environment } from '@/environments/environment';

@Component({
    i18n: {
        messages: {
            'zh-CN': {
                login: {
                    caption: '欢迎登录',
                    name: '登录',
                    tip: '输入用户名和密码',
                    loginname: {
                        placeholder: '请输入用户名',
                        message: '用户名不能为空',
                    },
                    password: {
                        placeholder: '请输入密码',
                        message: '密码不能为空',
                    },
                    loginfailed: '登陆失败',
                },
            },
            'en-US': {
                login: {
                    caption: 'Welcome to login',
                    name: 'Login',
                    tip: 'Enter username and password',
                    loginname: {
                        placeholder: 'Username',
                        message: 'The username cannot be empty',
                    },
                    password: {
                        placeholder: 'Password',
                        message: 'The password cannot be empty',
                    },
                    loginfailed: 'Login failed'
                },
            }
        }
    }
})
export default class Login extends Vue {

    /**
     * 表单对象
     *
     * @type {*}
     * @memberof Login
     */
    public form: any = { loginname: null, password: null };

    /**
     * 值规则
     *
     * @type {*}
     * @memberof Login
     */
    public rules: any = {
        loginname: [
            { required: true, message: '用户名不能为空', trigger: 'change' },
        ],
        password: [
            { required: true, message: '密码不能为空', trigger: 'change' },
        ],
    };

    /**
     * 登陆处理
     *
     * @memberof Login
     */
    public handleSubmit(): void {
        const form: any = this.$refs.loginForm;
        let validatestate: boolean = true;
        form.validate((valid: boolean) => {
            validatestate = valid ? true : false;
        });
        if (!validatestate) {
            return;
        }
        const post: Promise<any> = this.$http.post(Environment.RemoteLogin, this.form, true);
        post.then((response: any) => {
            if (response && response.status === 200) {
                const data = response.data;
                localStorage.setItem('token', data.token);
                localStorage.setItem('user', JSON.stringify(data.user));
                const url: any = this.$route.query.redirect ? this.$route.query.redirect : '*';
                this.$router.push({ path: url });
            }
        }).catch((error: any) => {
            const loginfailed: any = this.$t('login.loginfailed');
            this.$Notice.error({ title: '错误', desc: loginfailed });
        });

    }

    /**
     * 内容绘制
     *
     * @returns
     * @memberof Login
     */
    public render() {
        return (
            <div class='login'>
                <div class='login-con'>
                    <card bordered={false}>
                        <p slot='title'>
                            <icon type='ios-log-in'></icon>
                            &nbsp;&nbsp;{this.$t('login.caption')}
                        </p>
                        <div class='form-con'>
                            <i-form ref='loginForm' props={{ model: this.form, rules: this.rules }}>
                                <form-item prop={'loginname'}>
                                    <i-input
                                        prefix={'ios-contact'}
                                        v-model={this.form.loginname}
                                        placeholder={this.$t('login.loginname.placeholder')}>
                                    </i-input>
                                </form-item>
                                <form-item prop={'password'}>
                                    <i-input
                                        prefix={'ios-key'}
                                        v-model={this.form.password}
                                        type='password'
                                        placeholder={this.$t('login.password.placeholder')}>
                                    </i-input>
                                </form-item>
                                <form-item>
                                    <i-button
                                        on-click={this.handleSubmit}
                                        type='primary'
                                        long>
                                        {this.$t('login.name')}
                                    </i-button>
                                </form-item>
                            </i-form>
                            <p class='login-tip'>
                                {this.$t('login.tip')}
                            </p>
                        </div>
                    </card>
                </div>
            </div>
        );
    }
}