/**
 * Created by hao.cheng on 2017/4/13.
 */
import React, { Component } from 'react';
import { Layout, Menu, Icon } from 'antd';
import { Link } from 'react-router';
const { Sider } = Layout;
const SubMenu = Menu.SubMenu;

class SiderCustom extends Component {
    state = {
        collapsed: false,
        mode: 'inline',
        openKey: '',
        selectedKey: '',
        firstHide: true,        // 点击收缩菜单，第一次隐藏展开子菜单，openMenu时恢复
    };
    componentDidMount() {
        this.setMenuOpen(this.props);
    }
    componentWillReceiveProps(nextProps) {
        this.onCollapse(nextProps.collapsed);
        this.setMenuOpen(nextProps)
    }
    setMenuOpen = props => {
        const {path} = props;
        this.setState({
            openKey: path.substr(0, path.lastIndexOf('/')),
            selectedKey: path
        });
    };
    onCollapse = (collapsed) => {
        this.setState({
            collapsed,
            firstHide: collapsed,
            mode: collapsed ? 'vertical' : 'inline',
        });
    };
    menuClick = e => {
        const { popoverHide } = this.props     // 响应式布局控制小屏幕点击菜单时隐藏菜单操作
        popoverHide && popoverHide()
        this.setState({selectedKey: e.key})
    };
    openMenu = v => {
        this.setState({
            openKey: v[v.length - 1],
            firstHide: false,
        })
    };
    render() {
        return (
            <Sider
                trigger={null}
                breakpoint="lg"
                collapsed={this.props.collapsed}
                style={{overflowY: 'auto'}}
            >
                <div className="logo">杰运好车</div>
                <Menu
                    onClick={this.menuClick}
                    theme="dark"
                    mode="inline"
                    selectedKeys={[this.state.selectedKey]}
                    openKeys={this.state.firstHide ? null : [this.state.openKey]}
                    onOpenChange={this.openMenu}
                >
                    <Menu.Item key="/app/dashboard/index" className="nav-home">
                        <Link to={'/app/dashboard/index'}><Icon type="home" /><span className="nav-text">首页</span></Link>
                    </Menu.Item>
                    <SubMenu
                        key="/app/user"
                        title={<span><Icon type="user" /><span className="nav-text">客户管理</span></span>}
                    >
                        <Menu.Item key="/app/user/userList"><Link to={'/app/user/userList'}>客户列表</Link></Menu.Item>
                        <Menu.Item key="/app/user/rent"><Link to={'/app/user/rent'}>以租代购</Link></Menu.Item>
                        <Menu.Item key="/app/user/driver"><Link to={'/app/user/driver'}>司机招募</Link></Menu.Item>
                        <Menu.Item key="/app/user/violation"><Link to={'/app/user/violation'}>违章录入</Link></Menu.Item>
                    </SubMenu>
                    <SubMenu
                        key="/app/message"
                        title={<span><Icon type="message" /><span className="nav-text">消息管理</span></span>}
                    >
                        <Menu.Item key="/app/message/allMessage"><Link to={'/app/message/allMessage'}>群发消息</Link></Menu.Item>
                        <Menu.Item key="/app/message/custMessage"><Link to={'/app/message/custMessage'}>指定客户发送</Link></Menu.Item>
                        <Menu.Item key="/app/message/listMessage"><Link to={'/app/message/listMessage'}>消息列表</Link></Menu.Item>
                        <Menu.Item key="/app/message/userMessage"><Link to={'/app/message/userMessage'}>客户反馈</Link></Menu.Item>
                    </SubMenu>
                    <SubMenu
                        key="/app/system"
                        title={<span><Icon type="desktop" /><span className="nav-text">系统管理</span></span>}
                    >
                        <Menu.Item key="/app/system/password"><Link to={'/app/system/password'}>密码修改</Link></Menu.Item>
                        <Menu.Item key="/app/system/arguments"><Link to={'/app/system/arguments'}>参数设置</Link></Menu.Item>
                    </SubMenu>
                </Menu>
                <style>
                    {`
                    #nprogress .spinner{
                        left: ${this.state.collapsed ? '70px' : '206px'};
                        right: 0 !important;
                    }
                    `}
                </style>
            </Sider>
        )
    }
}

export default SiderCustom;