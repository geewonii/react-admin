import React from 'react';
import BreadcrumbCustom from '../BreadcrumbCustom';
import { Row, Col, Card, message, Input, Button,Popconfirm, Select } from 'antd'
import {onLoadUserData, onCustMessages} from '@/action';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
const { TextArea } = Input

class CustMessage extends React.Component {
    constructor() {
      super()
      this.state = {
        userDetails: {
          Title: '',
          Content: '',
          IsMass: '0',
          userIdList: []
        }
      }
    }

    componentDidMount() {
      this.props.LoadUserData()
    }

    onChangeSelect = value => {
        let userDetails = {
            ...this.state.userDetails,
            userIdList: value.join(",")
        }
        this.setState({userDetails})
    }
    onChangeTitle = e => {
        let userDetails = {
            ...this.state.userDetails,
            Title: e.target.value
        }
        this.setState({userDetails})
    }
    onChangeContent = e => {
        let userDetails = {
            ...this.state.userDetails,
            Content: e.target.value
        }
        this.setState({userDetails})
    }
    onEmpty = () => {
        let userDetails = {
            ...this.state.userDetails,
            Title: '',
            Content: ''
        }
        this.setState({userDetails})
    }
    //提交
    confirmEdit = () => {
        const {userDetails} = this.state
        let title = userDetails.Title && userDetails.Title.trim(),
            content = userDetails.Content && userDetails.Content.trim(),
            userIdList = userDetails.userIdList.length
        if(!userIdList){
            message.info(`请先选择用户`)
            return false
        }else if(!title){
            message.info(`标题不能留空`)
            return false
        }else if(!content){
            message.info(`内容不能留空`)
            return false
        }else{
            this.props.onCustMessages(userDetails)
        }
    }

    render() {
        const { userList } = this.props
        const {userDetails} = this.state
        return (
            <div className="gutter-example">
                <BreadcrumbCustom first="消息管理" second="指定客户发送" />
                <Row gutter={24}>
                    <Col className="gutter-row" md={24}>
                        <div className="gutter-box">
                            <Card bordered={false} style={{height: 600}}>
                                <Select style={{ minWidth:250,marginTop:25 }} size="large" mode="multiple" allowClear placeholder="请点击选择用户" onChange = {this.onChangeSelect}>
                                    {
                                     userList && userList.map( (item,idx) => <Select.Option key={idx} value={item.Id}>{item.FullName}</Select.Option>)
                                    }
                                </Select>
                                <Input style={{marginTop:25,marginBottom:25 }} size="large" placeholder="请在此输入标题" value={userDetails.Title} onChange={this.onChangeTitle} />

                                <TextArea rows={4} placeholder="请在此输入内容" maxLength="255" value={userDetails.Content} onChange={this.onChangeContent} />

                                <Button style={{margin:25,marginLeft:0}}>
                                    <Popconfirm title="确认重置标题和内容吗?" placement="bottom" onConfirm={this.onEmpty}>
                                        <a href="####">重置</a>
                                    </Popconfirm>
                                </Button>
                                
                                <Button style={{margin:25}} type="primary">
                                    <Popconfirm title="确认对以上客户发送此消息?" placement="bottom" onConfirm={this.confirmEdit}>
                                        <a href="####">发送</a>
                                    </Popconfirm>
                                </Button>
                            </Card>
                        </div>
                    </Col>
                </Row>
            </div>
        )
    }
}

const mapStateToPorps = state => state.httpData
const mapDispatchToProps = dispatch => ({
  LoadUserData: () => dispatch(onLoadUserData()),
  onCustMessages:bindActionCreators(onCustMessages, dispatch)
});

export default connect(mapStateToPorps, mapDispatchToProps)(CustMessage);