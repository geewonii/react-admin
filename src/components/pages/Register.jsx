/**
 * Created by hao.cheng on 2017/4/16.
 */
import React from 'react';
import { Form, Icon, Input, Button, message } from 'antd';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { onRegister } from '@/action';


const FormItem = Form.Item;

class Register extends React.Component {
    
    checkPassword = (rule, value, callback) => {
        const form = this.props.form;
        if (value && value !== form.getFieldValue('password')) {
          callback('两次密码输入不一致!')
        } else {
          callback()
        }
    }

    handleSubmit = e => {
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
            if(values.userName.length < 4){
                message.error("用户名太短")
            }else if(values.password.length < 4){
                message.error("密码太短")
            }else if(values.password !== values.passwords){
                message.error("两次输入密码不一致")
            }else if(!values.fullName){
                message.error("姓名不能为空")
            }else{
                if (!err) this.props.onRegister(values,this.callback)
            }
        });
    }

    callback = () => this.props.router.push('login')

    render() {
        const { getFieldDecorator } = this.props.form;
        return (
            <div className="login">
                <div className="login-form" style={{ height:400}} >
                    <div className="login-logo"><span>注册</span></div>
                    <Form onSubmit={this.handleSubmit} style={{maxWidth: '300px'}}>
                        <FormItem>
                            {getFieldDecorator('userName', {
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
                            {getFieldDecorator('passwords', {
                                rules: [
                                    { required: true, message: '请再次输入密码!' }, 
                                    { validator: this.checkPassword }
                                ],
                            })(
                                <Input prefix={<Icon type="lock" style={{ fontSize: 13 }} />} type="password" placeholder="重复输入密码" />
                            )}
                        </FormItem>
                        <FormItem>
                            {getFieldDecorator('fullName', {
                                rules: [{ required: true, message: '请输入真实姓名！' }],
                            })(
                                <Input prefix={<Icon type="bulb" style={{ fontSize: 13 }} />} type="text" placeholder="真实姓名" />
                            )}
                        </FormItem>
                        <FormItem>
                            <Button type="primary" htmlType="submit" className="login-form-button" style={{width: '100%'}}>注册</Button>
                        </FormItem>
                    </Form>
                </div>
            </div>

        );
    }
}

const mapStateToPorps = state => {
    const { data } = state.httpData;
    return { data }
};
const mapDispatchToProps = dispatch => ({
    onRegister: bindActionCreators(onRegister, dispatch)
});


export default connect(mapStateToPorps, mapDispatchToProps)(Form.create()(Register));