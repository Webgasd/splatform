import React from 'react'
import {Form, Input, Button, message, Icon, Checkbox} from 'antd'

import Footer from '../../components/Footer'
import './style.less'
import axios from "../../axios";
import startAxios from 'axios'
import connect from "react-redux/es/connect/connect";
import {refreshUser} from "../../redux/action";
import {login, header, words1, words2} from "../../axios/commonSrc";
import picLogo from "../../components/Header/u100.png";

const FormItem = Form.Item;

@connect(
    state => ({}), {
        refreshUser
    }
)
class Login extends React.Component {
    state = {check: 0};

    componentDidMount() {//每次进入登录页清除之前的登录信息
        this.props.refreshUser()
    }

    loginReq = (params) => {
        let _this = this;
        axios.ajax({
            url: '/sys/user/loginTest',
            data: {
                params: {...params}
            }
        }).then((res) => {
            let a = document.cookie
            console.log(a)
            if (res.status == 'success') {
                // console.dir(params);
                startAxios.defaults.headers['token']=res.data
                localStorage.setItem('keyName', params.loginName);
                if (this.state.check === 2) {
                    localStorage.removeItem('keyPass');
                    localStorage.setItem("keyStatus", "false");
                    console.log("unchecked");
                } else if (this.state.check === 0 || this.state.check === 1 || localStorage.getItem("keyStatus") === "true") {
                    localStorage.setItem('keyPass', params.password);
                    localStorage.setItem("keyStatus", "true");
                    console.log("checked");
                }

                window.location.href = '#';//跳转页面
            }
        })

    };

    render() {
        return (
            <div className="login-page">
                <div className="login-header">
                    <div className="logo">
                        <img src={picLogo}/>
                        {header}
                    </div>
                </div>
                <div className="login-content-wrap">
                    <div className="login-content">
                        <div className="word">{words1}<br/>{words2}</div>
                        <div className="login-box">
                            <div className="error-msg-wrap">
                                <div
                                    className={this.state.errorMsg ? "show" : ""}>
                                    {this.state.errorMsg}
                                </div>
                            </div>
                            <div className="title">{login}</div>
                            <LoginForm ref="login" loginSubmit={this.loginReq}/>
                        </div>
                    </div>
                </div>
                <Footer/>
            </div>
        )
    }
}

export default Login;

class LoginForm extends React.Component {
    state = {};

    loginSubmit = (e) => {
        e && e.preventDefault();
        const _this = this;
        this.props.form.validateFieldsAndScroll((err, values) => {
            if (!err) {
                var formValue = _this.props.form.getFieldsValue();
                _this.props.loginSubmit({
                    loginName: formValue.loginName,
                    password: formValue.password
                });
            }
        });
    };

    checkUsername = (rule, value, callback) => {
        var reg = /^\w+$/;
        if (!value) {
            callback('请输入用户名!');
        } else if (!reg.test(value)) {
            callback('用户名只允许输入英文字母');
        } else {
            callback();
        }
    };

    checkPassword = (rule, value, callback) => {
        if (!value) {
            callback('请输入密码!');
        } else {
            callback();
        }
    };

    handleChange = (event) => {
        const target = event.target;
        this.setState({
            check: target.checked === true ? 1 : 2
        });
    };

    handleClick = () => {
        window.open('/#/register', '_blank');
        //window.location.href = '/#/register';
    }

    render() {
        const {getFieldDecorator} = this.props.form;
        return (
            <Form className="login-form">
                <FormItem>
                    {getFieldDecorator('loginName', {
                        initialValue: localStorage.getItem("keyName") ? localStorage.getItem("keyName") : "",
                        rules: [
                            {validator: this.checkUsername},
                        ]
                    })(
                        <Input prefix={<Icon type="user"/>} placeholder="用户名"/>
                    )}
                </FormItem>
                <FormItem>
                    {getFieldDecorator('password', {
                        initialValue: localStorage.getItem("keyPass") ? localStorage.getItem("keyPass") : "",
                        rules: [{validator: this.checkPassword}]
                    })(
                        <Input prefix={<Icon type="lock"/>} type="password"
                               placeholder="密码"
                               wrappedcomponentref={(inst) => this.pwd = inst}/>
                    )}
                </FormItem>
                <FormItem>
                    {getFieldDecorator('remember', {
                        valuePropName: 'checked',
                        initialValue: localStorage.getItem("keyStatus") ? localStorage.getItem("keyStatus") === "true" : true
                    })(
                        <Checkbox onChange={this.handleChange}>记住密码</Checkbox>
                    )}
                    <a href="#" style={{float: 'right'}}>忘记密码</a>
                </FormItem>
                <FormItem>
                    <Button type="primary" onClick={this.loginSubmit} className="login-form-button">
                        登录
                    </Button>
                    {/*<Button className="login-form-button" onClick={this.handleClick}>*/}
                    {/*注册*/}
                    {/*</Button>*/}
                </FormItem>
            </Form>
        )
    }
}

LoginForm = Form.create({})(LoginForm);
