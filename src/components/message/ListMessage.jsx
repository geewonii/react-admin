import React from 'react';
import BreadcrumbCustom from '../BreadcrumbCustom';
import { Row, Col, Card, Modal, Tabs } from 'antd'
import { connect } from 'react-redux';
import { onMessageData, onDelectMessage, onMessageForUserData } from '@/action';
import MessageTable from '../tables/MessageTable';
import MessageTableChild from '../tables/MessageTableChild';
const TabPane = Tabs.TabPane

class ListMessage extends React.Component {
    constructor() {
        super()
        this.state = {
            key: "99",
            loading: false,
            modalVisible:false,
            userDetails: null
        }
    }
    // init
    componentDidMount() {
        const { key } = this.state
        this.setState({loading: true})
        this.props.MessageData(key, this.loadCallBack)
    }

    // loading回调
    loadCallBack = () => this.setState({loading: false})

    // 点击回调
    loadDataCallBack = key => {
        this.setState({key, loading: true})
        this.props.MessageData(key, this.loadCallBack)
    }

    // 编辑
    flipModal = userDetails => {
        this.props.MessageForUserData(userDetails)
        this.setState({modalVisible:true})
    }

    // 删除
    confirmDel = Id => onDelectMessage(Id, this.callback)

    // 提交
    confirmEdit = () => this.setState({modalVisible:false})

    // 回调
    callback = () => {
        this.props.MessageData(this.state.key)
        this.setState({modalVisible:false})
    }

    // 渲染modal
    modalRender() {
        const { modalVisible } = this.state
        const { messageUserList } = this.props
        if(messageUserList){
            return (
                <Modal
                    title="用户列表"
                    wrapClassName="vertical-center-modal"
                    width={800}
                    visible={modalVisible}
                    onOk={this.confirmEdit}
                    cancelText="关闭"
                    onCancel={() => this.setState({modalVisible:false})}
                >
                    <MessageTableChild messageUserList={messageUserList} />
                </Modal>
            )
        }
    }

    render() {
        const { messageList } = this.props
        return (
            <div className="gutter-example">
                <BreadcrumbCustom first="消息管理" second="消息列表" />
                <Row gutter={24}>
                    <Col className="gutter-row" md={24}>
                        <div className="gutter-box">
                            <Card title="" bordered={false} style={{minHeight: 600}}>
                                <Tabs defaultActiveKey="99" onChange={this.loadDataCallBack}>
                                    <TabPane tab="全部" key="99">
                                        <MessageTable messageList = {messageList} flipModal={this.flipModal} confirmDel={this.confirmDel} loading={this.state.loading} />
                                    </TabPane>
                                    <TabPane tab="有效消息" key="1">
                                        <MessageTable messageList = {messageList} flipModal={this.flipModal} confirmDel={this.confirmDel} loading={this.state.loading} />
                                    </TabPane>
                                    <TabPane tab="无效消息" key="0">
                                        <MessageTable messageList = {messageList} flipModal={this.flipModal} confirmDel={this.confirmDel} loading={this.state.loading} />
                                    </TabPane>
                                </Tabs>
                            </Card>
                        </div>
                    </Col>
                </Row>
                {this.modalRender()}
            </div>
        )
    }
}
const mapStateToPorps = state => state.httpData
const mapDispatchToProps = dispatch => ({
    MessageData: (keys, loadCallBack) => dispatch(onMessageData(keys, loadCallBack)),
    MessageForUserData: (userDetails, loadCallBack) => dispatch(onMessageForUserData(userDetails, loadCallBack))
});
export default connect(mapStateToPorps, mapDispatchToProps)(ListMessage);