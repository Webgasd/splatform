import React from 'react'
import './style.less'
import {Card,Form, Input, Button,message,Icon, Checkbox,Radio,Select,Switch,DatePicker,TimePicker,Upload, InputNumber} from 'antd'
import moment from 'moment';
const FormItem=Form.Item;
const RadioGroup = Radio.Group;
const Option = Select.Option;
const TextArea = Input.TextArea;
export default class FormRegister extends React.Component {

    handleClick=()=>{
        window.close('/#/register');
    }
    state={}

    handleSubmit = ()=>{
        let userInfo = this.props.form.getFieldsValue();
        console.log(JSON.stringify(userInfo))
        message.success(`${userInfo.username} 恭喜通关，密码为：${userInfo.password}`)
    }
    getBase64=(img, callback)=> {
        const reader = new FileReader();
        reader.addEventListener('load', () => callback(reader.result));
        reader.readAsDataURL(img);
      }
      
    handleChange = (info) => {
        if (info.file.status === 'uploading') {
          this.setState({ loading: true });
          return;
        }
        if (info.file.status === 'done') {
          // Get this url from response in real world.
          this.getBase64(info.file.originFileObj, imageUrl => this.setState({
            userImg:imageUrl,
            loading: false,
          }));
        }
      }
    render(){
        const {getFieldDecorator} = this.props.form;
        const formItemLayout = {
            labelCol:{
                xs:24,
                sm:4
            },
            wrapperCol:{
                xs:24,
                sm:12
            }
        }
        const offsetLayout = {
            wrapperCol:{
                xs:24,
                sm:{
                    span:12,
                    offset:4
                }
            }
        }
        const rowObject = {minRows: 4,maxRows:6}
        return (
            <div >
             <Card title="注册表单" headStyle={{textAlign:"center"}}>
            
             <Form layout="horizontal">
             <FormItem label="用户名" {...formItemLayout}>
             {getFieldDecorator('username', {
                        initialValue:'',
                        rules: [
                            {validator: this.checkUsername},
                            {min:5,
                            message:'用户名过短'},
                            {max:10,
                            message:'用户名过长'},
                            {required:true,
                            message:'用户名不能为空'}
                        ]
                    })(
                        <Input placeholder="请输入用户名"/>
                    )}
             </FormItem>
             <FormItem label="密码"  {...formItemLayout}>
                    {getFieldDecorator('password', {                      
                        initialValue:'',
                        rules:[
                            {required:true,
                                message:'密码不能为空'}
                        ]
                    })(
                        <Input type="password" placeholder=" 请输入密码"/>
                    )}
                  
                </FormItem>
                <FormItem label="性别"  {...formItemLayout}>
                    {getFieldDecorator('sex', {                      
                        initialValue:'1'
                    })(
                       <RadioGroup>
                           <Radio value="1">男</Radio>
                           <Radio value="2">女</Radio>
                       </RadioGroup>
                    )}
                  
                </FormItem>
                <FormItem label="年龄"  {...formItemLayout}>
                    {getFieldDecorator('age', {                      
                        initialValue:'18'
                    })(
                      <InputNumber />
                    )}
                  
                </FormItem>
                <FormItem label="职务"  {...formItemLayout}>
                    {getFieldDecorator('state', {                      
                        initialValue:'1'
                    })(
                      <Select>
                         <Option value="1">局长</Option>
                         <Option value="2">部长</Option>
                         <Option value="3">职员</Option>
                         <Option value="4">你们都不对</Option>
                         <Option value="5">你对行了吧</Option>
                      </Select>
                    )}                 
                </FormItem>
                <FormItem label="地区"  {...formItemLayout}>
                    {getFieldDecorator('interest', {                      
                        initialValue:['1','7']
                    })(
                      <Select mode="multiple">
                         <Option value="1">黄岛</Option>
                         <Option value="2">崂山</Option>
                         <Option value="3">市南</Option>
                         <Option value="4">市北</Option>
                         <Option value="5">城阳</Option>
                         <Option value="6">都行</Option>
                         <Option value="7">算了</Option>
                      </Select>
                    )}                  
                </FormItem>
                <FormItem label="是否已婚"  {...formItemLayout}>
                    {getFieldDecorator('isMarried', {
                        valuePropName:'checked',                      
                        initialValue:true
                    })(
                      <Switch />
                    )}                 
                </FormItem>
                <FormItem label="生日"  {...formItemLayout}>
                    {getFieldDecorator('birthday', {                                  
                        initialValue:moment('2019-03-27 13:00:59')
                    })(
                      <DatePicker 
                      showTime
                      format="YYYY-MM-DD HH:mm:ss"
                      />
                    )}                 
                </FormItem>
                <FormItem label="联系地址"  {...formItemLayout}>
                    {getFieldDecorator('address',{
                        initialValue:'山东省青岛市黄岛区某个小黄山'
                    })(
                      <TextArea
                      autosize={rowObject}
                      />
                    )}                 
                </FormItem>
                <FormItem label="入职日期"  {...formItemLayout}>
                    {getFieldDecorator('time')(
                      <TimePicker />
                    )}                 
                </FormItem>
                <FormItem label="头像"  {...formItemLayout}>
                    {getFieldDecorator('userImg')(
                      <Upload
                      listType="picture-card"
                      showUploadList={false}
                      action="//jsonplaceholder.typicode.com/posts/"
                      onChange={this.handleChange}>
                      {this.state.userImg?<img src={this.state.userImg}/>:<Icon type="plus"/>}
                          </Upload>
                    )}                 
                </FormItem>
                <FormItem   {...offsetLayout}>
                    {getFieldDecorator('userImg')(
                     <Checkbox>我已阅读过<a href="#">基本协议</a></Checkbox>
                    )}                 
                </FormItem>
                <FormItem   {...offsetLayout}>
                   <Button type="primary" onClick={this.handleSubmit} >注册</Button>              
                </FormItem>
             </Form>
             <Button className="login-form-button" onClick={this.handleClick}>
                    完成
            </Button>
             </Card>
            </div>
        );
    }
}
FormRegister = Form.create({})(FormRegister);
//export default Form.create(FormRegister);