import React from 'react';
import BreadcrumbCustom from '../BreadcrumbCustom';
import { Row, Col, Card, message, Input, Button,Popconfirm } from 'antd'
import {onAllMessages} from '@/action';
const { TextArea } = Input

class AllMessage extends React.Component {
    constructor() {
        super()
        this.state = {
            userDetails: {
                Title: '',
                Content: '',
                IsMass: '1'
            }
        }
    }

    onChangeTitle = (e) => {
        let userDetails = {
            ...this.state.userDetails,
            Title: e.target.value
        }
        this.setState({userDetails})
    }
    onChangeContent = (e) => {
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
        if(!userDetails.Title.trim() || !userDetails.Content.trim()){
            message.info(`标题和内容不能留空`)
            return false
        }
        onAllMessages(userDetails)
    }

    render() {
        const {userDetails} = this.state
        return (
            <div className="gutter-example">
                <BreadcrumbCustom first="消息管理" second="群发消息" />
                <Row gutter={24}>
                    <Col className="gutter-row" md={24}>
                        <div className="gutter-box">
                            <Card bordered={false} style={{height: 600}}>
                                <Input style={{marginTop:25,marginBottom:25 }} size="large" placeholder="请在此输入标题" value={userDetails.Title} onChange={this.onChangeTitle} />
                                <TextArea rows={4} placeholder="请在此输入内容" maxLength="255" value={userDetails.Content} onChange={this.onChangeContent} />
                                <Button style={{margin:20,marginLeft:0}}>
                                    <Popconfirm title="确认重置标题和内容吗?" placement="bottom" onConfirm={this.onEmpty}>
                                        <a href="####">重置</a>
                                    </Popconfirm>
                                </Button>
                                <Button style={{margin:10}} type="primary">
                                    <Popconfirm title="确认群发此消息?" placement="bottom" onConfirm={this.confirmEdit}>
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

export default AllMessage;