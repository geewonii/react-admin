import React, { Component } from 'react';
import { Layout } from 'antd';
import './style/index.less';
import SiderCustom from './components/SiderCustom';
import HeaderCustom from './components/HeaderCustom';
import { receiveData } from './action';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
const { Content, Footer } = Layout;

class App extends Component {
    state = {
        collapsed: false
    }

    componentWillMount() {
        this.getClientWidth()
        window.onresize = () => this.getClientWidth()
    }

    getClientWidth = () => {    // 获取当前浏览器宽度并设置responsive管理响应式
        const { receiveData } = this.props
        const clientWidth = document.body.clientWidth
        receiveData({isMobile: clientWidth <= 992}, 'responsive')
    }
    
    toggle = () => this.setState({ collapsed: !this.state.collapsed })

    render() {
        const { data, router } = this.props
        return (
            <Layout className="ant-layout-has-sider">
                {data && !data.isMobile && <SiderCustom path={this.props.location.pathname} collapsed={this.state.collapsed} />}
              <Layout>
                <HeaderCustom 
                    toggle={this.toggle}
                    collapsed={this.state.collapsed}
                    data={data || {}}
                    router={router}
                    path={this.props.location.pathname}
                />
                <Content style={{ margin: '0 16px', overflow: 'initial' }}> {this.props.children} </Content>
                <Footer style={{ textAlign: 'center' }}>杰运好车后台管理系统</Footer>
              </Layout>
                {
                    data && data.isMobile && (   // 手机端对滚动很慢的处理
                        <style>
                        {`
                            #root{
                                height: auto;
                            }
                        `}
                        </style>
                    )
                }
            </Layout>
        );
    }
}

const mapStateToProps = state => {
    const {data, responsive } = state.httpData
    return {data, responsive}
}
const mapDispatchToProps = dispatch => ({
    receiveData: bindActionCreators(receiveData, dispatch)
})

export default connect(mapStateToProps, mapDispatchToProps)(App)
