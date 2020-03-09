import { Vue, Component, Provide } from 'vue-property-decorator';
import './app-tree.less';

@Component({})
export default class AppTree extends Vue {
    @Provide()
    public name: string = '右键菜单';
    @Provide()
    public nodes: any[] = [];
    @Provide()
    public centerDialogVisible: boolean = false;
    @Provide()
    public tree: any;

    public setUp(message: string) {
        // this.$message({
        //     message
        // });
    }
    
    public addNodes(node: any) {
        const nodes = [];
        for (let i = 0; i < 10; i++) {
            nodes.push({
                id: `${node.id}-${i}`,
                label: `标题：${node.label}-${i}`
            });
        }
        return nodes;
    }

    public addChildNode(node: any) {
        if (this.tree) {
            const nodes = this.addNodes(node);
            nodes.forEach((data) => {
                this.tree.append(data, node);
            });
        }
    }
    
    public renderContent(h: any, context: any) {
        const { node } = context;
        return (
            <context-menu contextMenuStyle={{ width: '100%' }} data={{ name: '右键菜单' }} renderContent={this.renderContextMenu}>
                <div class='ibiz-tree-node'>
                    <label>{node.label}</label>
                    <div class='ibiz-tree-node-buttons'>
                        <div class='button-item'>
                            <el-popover placement='right'>
                                {this.renderPopoverContent()}
                                <span slot='reference' on-click={() => this.addChildNode(node)}><i class='el-icon-plus'></i></span>
                            </el-popover>
                        </div>
                        <div class='button-item'>
                            <span on-click={() => this.setUp('设置')}><i class='el-icon-setting'></i></span>
                        </div>
                    </div>
                </div>
            </context-menu>
        );
    }

    public renderPopoverContent() {
        return <h1>内容</h1>;
    }

    public lodeChildNodes(node: any, resolve: any) {
        if (node.level === 0) {
            const nodes = [];
            for (let i = 0; i < 10; i++) {
                nodes.push({
                    id: `${i}`,
                    label: `标题：${i}`
                });
            }
            this.nodes = nodes;
        } else {
            setTimeout(() => {
                resolve(this.addNodes(node));
            }, 1000);
        }
    }

    // 绘制右击菜单
    public renderContextMenu(data: any) {
        return <el-button on-click={() => this.setUp('右键菜单')}>{data.name}</el-button>;
    }

    public mounted() {
        this.tree = this.$refs.tree;
    }

    public render() {
        return (
            <context-menu-container>
                <el-tree
                    ref='tree'
                    class='ibiz-tree'
                    data={this.nodes}
                    node-key='id'
                    default-expand-all={false}
                    expand-on-click-node={false}
                    lazy
                    load={this.lodeChildNodes}
                    render-content={this.renderContent}>
                </el-tree>
            </context-menu-container >
        );
    }
}