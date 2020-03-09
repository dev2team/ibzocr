import { Vue, Component } from 'vue-property-decorator';
import { Environment } from '@/environments/environment';

import './app-user.less';

@Component({})
export default class AppUser extends Vue {
    /***
     * 
     */
    public show:any;
    /**
     * 用户信息
     */
    public user = {
        name:   '',
        avatar: './assets/img/avatar.png',
    }

    /**
     * 下拉选选中回调
     * @param $event 
     */
    public userSelect(data: any) {
         if(Object.is(data, 'logout')) {
            this.$Modal.confirm({
                title: '确认要退出登陆？',
                onOk: () => {
                    this.logout();
                }
            })
        }
    }

    /**
     * vue  生命周期
     *
     * @memberof AppUser
     */
    public mounted() {
        if (window.localStorage.getItem('user')) {
            const _user: any = window.localStorage.getItem('user') ? window.localStorage.getItem('user') : '';
            const user = JSON.parse(_user);
            this.user.name = user.personname;
            Object.assign(this.user, user, {
                time: +new Date
            });
        }
    }


    /**
     * 退出登录
     *
     * @memberof AppUser
     */
    public logout() {
        window.localStorage.removeItem('user');
        window.localStorage.removeItem('token');
        this.$router.push({ name: 'login' });
    }
    /**
     * 渲染组件
     */
    public render() {
        return (
            <div class="ibiz-header-user">
                <dropdown on-on-click={this.userSelect}>
                    <div style="font-size: 15px;cursor: pointer;margin-right: 20px">
                        <span class='username' style="margin-left: 10px;">{this.user.name}<i class='icon-triangle'></i></span>
                    </div>
                    <dropdown-menu slot="list" style="font-size: 14px !important;">
                        <dropdown-item name="logout" style="font-size: 14px !important;">
                            <span> <i aria-hidden="true" class="fa fa-cogs" style="margin-right: 6px;"></i></span>
                            <span>退出登陆</span>
                        </dropdown-item>
                    </dropdown-menu>
                </dropdown>
            </div>
        )
    }
}