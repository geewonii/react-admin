import React from 'react'
import BreadcrumbCustom from '../BreadcrumbCustom'
import { Row, Col, Card, Input, Button, message} from 'antd'
import {onSubmitPaword} from '@/action'

class Password extends React.Component {
    constructor() {
        super()
        this.state = {
            data: null
        }
    }

    onChangePaword = (e) => {
        let data = {
            ...this.state.data,
            paword: e.target.value
        }
        this.setState({data})
    }
    onChangePaword1 = (e) => {
        let data = {
            ...this.state.data,
            paword1: e.target.value
        }
        this.setState({data})
    }
    onChangePaword2 = (e) => {
        let data = {
            ...this.state.data,
            paword2: e.target.value
        }
        this.setState({data})
    }
    submitPaword = () => this.state.data ? this.checkedPaword(this.state.data) : message.info("请填写密码")

    checkedPaword(data){
        let on = this.filtrationErr(data.paword, '请输入原密码') && this.filtrationErr(data.paword1, '请输入新密码') && this.filtrationErr(data.paword2, '请再次输入原密码')
        if (on) {
            let patrn = /^(\w){6,20}$/
            let rep = /^(?:0(?=1)|1(?=2)|2(?=3)|3(?=4)|4(?=5)|5(?=6)|6(?=7)|7(?=8)|8(?=9))|(?:9(?=8)|8(?=7)|7(?=6)|6(?=5)|5(?=4)|4(?=3)|3(?=2)|2(?=1)|1(?=0))|([\d])\1{2,}$/
            !patrn.exec(data.paword) ? message.error("请正确输入密码，密码为6到20位的字母或数字组合")
            : 
            !rep.exec(data.paword1) ? message.error("新密码太简单")
            : 
            data.paword1 === "123456" ? message.error("新密码太简单")
            : 
            data.paword1 === "12345678" ? message.error("新密码太简单")
            : 
            data.paword1 !== data.paword2 ? message.error("两次输入密码不一致，请重新输入")
            : 
            onSubmitPaword(data,this.callback)
        }
    }

    // 回调
    callback = () => {

    }

    //过滤func
    filtrationErr = (value, str) => {
        let s = typeof (value ? value : message.error(str))
        if (s === 'function') {
            return false
        } else {
            return true
        }
    }

    render() {
        return (
            <div className="gutter-example">
                <BreadcrumbCustom first="系统管理" second="修改密码" />
                <Row gutter={24}>
                    <Col className="gutter-row" md={24}>
                        <div className="gutter-box">
                            <Card bordered={false} style={{height: 600,paddingTop:100}}>
                                <div style={{width:250,margin:"auto"}}>
                                    <div style={{marginBottom:25,fontSize:20,textAlign:"center" }}>修改密码</div>
                                    <Input style={{marginBottom:25 }} size="large" type="password" placeholder="请输入原密码" onChange={this.onChangePaword} />
                                    <Input style={{marginBottom:25 }} size="large" type="password" placeholder="请输入新密码" onChange={this.onChangePaword1} />
                                    <Input style={{marginBottom:25 }} size="large" type="password" placeholder="请再次输入新密码" onChange={this.onChangePaword2} />
                                    <Button style={{width: 250}} type="primary" onClick={this.submitPaword}>提交</Button>
                                </div>
                            </Card>
                        </div>
                    </Col>
                </Row>
            </div>
        )
    }
}

export default Password