import React,{Component} from 'react';
import {Input, Form} from 'antd';
const FormItem = Form.Item;

class ChangePsdForm extends Component{
  render() {
      const { getFieldDecorator } = this.props.form;
      const formItemLayout = {
          labelCol: {span: 6},
          wrapperCol: {span: 13}
      };
      return (
          <Form layout="horizontal">
              <FormItem label="输入密码" {...formItemLayout}>
                  {
                      getFieldDecorator('inputPsd',{
                          initialValue:''
                      })(
                          <Input type="password" placeholder="请输入密码"/>
                      )
                  }
              </FormItem>
              <FormItem label="确认密码" {...formItemLayout}>
                  {
                      getFieldDecorator('confirmPsd',{
                          initialValue:''
                      })(
                          <Input type="password" placeholder="确认密码"/>
                      )
                  }
              </FormItem>
          </Form>
      );
  }
}
export default Form.create({})(ChangePsdForm);