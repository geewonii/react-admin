import React, { Component } from 'react'
import { Menu, Icon, Layout, Popover } from 'antd'
import screenfull from 'screenfull'
import avater from '../style/imgs/b1.jpg'
import SiderCustom from './SiderCustom'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { onLogin } from '@/action'
import { getAESDecrypt } from '../common/tool'
const { Header } = Layout
const SubMenu = Menu.SubMenu
const MenuItemGroup = Menu.ItemGroup

class HeaderCustom extends Component {
    state = {
        aliases: 'user',
        visible: false,
        loginStr: "退出登录"
    }

    componentDidMount() {
        const { isFetching } = this.props
        let aliases = localStorage.getItem('aliases')
        if(isFetching){
            aliases = aliases && getAESDecrypt(aliases)
            this.setState({aliases})
        }
    }

    // 组件更新时执行
    componentWillReceiveProps(nextProps) {
        const { isFetching, router, path } = nextProps
        !isFetching && path === '/login' && router.push('/login')
    }

    // 全屏
    screenFull = () => screenfull.enabled && screenfull.request()

    // 用户中心
    menuClick = e => e.key === 'logout' && this.logout()

    logout = () => {
        localStorage.removeItem('aliases')
        localStorage.removeItem('fullName')
        localStorage.removeItem('password')
        this.props.router.push('/login')
    }

    popoverHide = () => this.setState({visible: false})

    handleVisibleChange = (visible) => {
        this.setState({ visible });
    };
    render() {
        const { data, path } = this.props
        return (
            <Header style={{ background: '#fff', padding: 0, height: 65 }} className="custom-theme" >
                {
                   data && data.isMobile ? (
                        <Popover 
                            content={<SiderCustom path={path} popoverHide={this.popoverHide} />} 
                            trigger="click" 
                            placement="bottomLeft" 
                            visible={this.state.visible} 
                            onVisibleChange={this.handleVisibleChange}
                        >
                            <Icon type="bars" className="trigger custom-trigger" />
                        </Popover>
                    ) : (
                        <Icon
                            className="trigger custom-trigger"
                            type={this.props.collapsed ? 'menu-unfold' : 'menu-fold'}
                            onClick={this.props.toggle}
                        />
                    )
                }
                <Menu
                    mode="horizontal"
                    style={{ lineHeight: '64px', float: 'right' }}
                    onClick={this.menuClick}
                >
                    <Menu.Item key="full" onClick={this.screenFull} >
                        <Icon type="arrows-alt" onClick={this.screenFull} />
                    </Menu.Item>
                    {/* <Menu.Item key="1">
                        <Badge count={25} overflowCount={10} style={{marginLeft: 10}}>
                            <Icon type="notification" />
                        </Badge>
                    </Menu.Item> */}
                    <SubMenu title={<span className="avatar"><img src={avater} alt="头像" /><i className="on bottom b-white" /></span>}>
                        <MenuItemGroup title="用户中心">
                            <Menu.Item key="setting:1">你好 - {this.state.aliases}</Menu.Item>
                            {/* <Menu.Item key="setting:2">个人信息</Menu.Item> */}
                            <Menu.Item key="logout"><span onClick={this.logout}>{this.state.loginStr}</span></Menu.Item>
                        </MenuItemGroup>
                        {/* <MenuItemGroup title="设置中心">
                            <Menu.Item key="setting:3">个人设置</Menu.Item>
                            <Menu.Item key="setting:4">系统设置</Menu.Item>
                        </MenuItemGroup> */}
                    </SubMenu>
                </Menu>
                <style>{`
                    .ant-menu-submenu-horizontal > .ant-menu {
                        width: 120px;
                        left: -40px;
                    }
                `}</style>
            </Header>
        )
    }
}

const mapStateToProps = state => state.httpData

const mapDispatchToProps = dispatch => ({
    onLogin: bindActionCreators(onLogin, dispatch)
})

export default connect(mapStateToProps, mapDispatchToProps)(HeaderCustom)
