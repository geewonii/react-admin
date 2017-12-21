import React, {Component} from 'react'
import { Form, Icon, Input, Button, Checkbox, message } from 'antd'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { onLogin } from '@/action'
import { getAESDecrypt } from '@/common/tool'

const FormItem = Form.Item

class Login extends Component {

    componentDidMount() {
        let aliases = localStorage.getItem('aliases'),
            password = localStorage.getItem('password')
        if(aliases && password){
            aliases = aliases && getAESDecrypt(aliases)
            password = password && getAESDecrypt(password)   
            this.props.onLogin({aliases,password,isFetching:true}, this.callback)
        }
    }

    handleSubmit = e => {
        e.preventDefault()
        this.props.form.validateFields((err, values) => {
            values.isFetching = true
            if (!err) this.props.onLogin(values, this.callback)
        })
    }

    callback = () => {
        const {isFetching, router} = this.props
        isFetching && message.success("登录成功！") && router.push('/app/dashboard/index')
        
    }

    register = () => this.props.router.push('register')

    render() {
        const { getFieldDecorator } = this.props.form
        return (
            <div className="login">
                <div className="login-form" >
                    <div className="login-logo">
                        <span>杰运好车</span>
                    </div>
                    <Form onSubmit={this.handleSubmit} style={{maxWidth: '300px'}}>
                        <FormItem>
                            {getFieldDecorator('aliases', {
                                rules: [{ required: true, message: '请输入手机号/用户名!' }],
                            })(
                                <Input prefix={<Icon type="user" style={{ fontSize: 13 }} />} placeholder="账户名" />
                            )}
                        </FormItem>
                        <FormItem>
                            {getFieldDecorator('password', {
                                rules: [{ required: true, message: '请输入密码!' }],
                            })(
                                <Input prefix={<Icon type="lock" style={{ fontSize: 13 }} />} type="password" placeholder="密码" />
                            )}
                        </FormItem>
                        <FormItem>
                            {getFieldDecorator('isRemember', {
                                valuePropName: 'checked',
                                initialValue: true,
                            })(
                                <Checkbox>记住我</Checkbox>
                            )}
                            {/* <a className="login-form-forgot" href="" style={{float: 'right'}}>忘记密码</a> */}
                            <Button type="primary" htmlType="submit" className="login-form-button" style={{width: '100%'}}>
                                登录
                            </Button>
                            或 <a href=" javascript:;" onClick={this.register} >现在就去注册</a>
                        </FormItem>
                    </Form>
                </div>
            </div>

        );
    }
}

const mapStateToProps = state => {
    const {isFetching} = state.httpData
    return {isFetching}
}
const mapDispatchToProps = dispatch => ({
    onLogin: bindActionCreators(onLogin, dispatch)
})


export default connect(mapStateToProps, mapDispatchToProps)(Form.create()(Login))