import React from 'react';
import BreadcrumbCustom from '../BreadcrumbCustom';
import { Row, Col, Card, Modal, Input } from 'antd'
import { connect } from 'react-redux';
import { getAESDecrypt } from '@/common/tool';
import { onUserMessageData, onsignsUserMessage, onDelectUserMessage } from '@/action';
import UserMessageTable from '../tables/UserMessageTable';
const TextArea = Input.TextArea
class ListMessage extends React.Component {
    constructor() {
        super()
        this.state = {
            loading: false,
            modalVisible:false,
            userDetails: null
        }
    }
    // init
    componentDidMount() {
        this.setState({loading: true})
        this.props.UserMessageData(this.loadCallBack)
    }

    // loading回调
    loadCallBack = () => this.setState({loading: false})

    
    // 编辑
    flipModal = userDetails => {
        this.setState({modalVisible:true,userDetails})
    }

    // 标记信息
    signs = userDetails => onsignsUserMessage(userDetails, this.callback)

    // 删除
    confirmDel = Id => onDelectUserMessage(Id, this.callback)

    // 提交
    confirmEdit = () => this.setState({modalVisible:false})

    // 回调
    callback = () => this.props.UserMessageData()

    // 渲染modal
    modalRender() {
        const { modalVisible, userDetails } = this.state
        let Name = localStorage.getItem("fullName")
            Name = typeof(Name) === "string" && getAESDecrypt(Name)
        if(userDetails){
            return (
                <Modal
                    title="用户列表"
                    wrapClassName="vertical-center-modal"
                    visible={modalVisible}
                    onOk={this.confirmEdit}
                    cancelText="关闭"
                    onCancel={() => this.setState({modalVisible:false})}
                >
                    <div style={{marginBottom:10}}>姓名：{userDetails.FullName}</div>
                    <div style={{marginBottom:10}}>手机号：{userDetails.Phone}</div>
                    <TextArea style={{marginBottom:10, color:"#999"}} rows={4} disabled value={userDetails.Content} />
                    <div style={{marginBottom:10}}>审核人：{Name}</div>
                </Modal>
            )
        }
    }

    render() {
        const { userMessageList } = this.props
        return (
            <div className="gutter-example">
                <BreadcrumbCustom first="消息管理" second="客户反馈" />
                <Row gutter={24}>
                    <Col className="gutter-row" md={24}>
                        <div className="gutter-box">
                            <Card bordered={false} style={{minHeight: 600}}>
                                <UserMessageTable userMessageList = {userMessageList} flipModal={this.flipModal} confirmDel={this.confirmDel} signs={this.signs} loading={this.state.loading} />
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
    UserMessageData: (loadCallBack) => dispatch(onUserMessageData(loadCallBack))
});
export default connect(mapStateToPorps, mapDispatchToProps)(ListMessage);