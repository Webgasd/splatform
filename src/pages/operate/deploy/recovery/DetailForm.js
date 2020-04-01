import React,{Component} from 'react';
import {Card,Table,Input,DatePicker,Select,Form} from "antd";



const FormItem = Form.Item;
const Option = Select.Option;


export default class DetailForm extends Component {
    render() {
        const userInfo = this.props.userInfo || {};
        const type=this.props.type;
        const { getFieldDecorator } = this.props.form;
        const formItemLayout = {
            labelCol: {span: 8},
            wrapperCol: {span: 12}
        };
        return (
            <div className="commonEnterpriseBox">
               
                <Form >          
                  <FormItem  label="回收企业名称" {...formItemLayout}>
                      {
                          userInfo && type=='detail'?userInfo.recoveryEnterprise:
                          getFieldDecorator('recoveryEnterprise',{
                              initialValue:userInfo.recoveryEnterprise,
                              rules: [
                                  {
                                      required: true,
                                      message: '请填写回收企业名称',
                                  }]
                          })(
                              
                              <Input/>
                          )
                      }
                  </FormItem>                   
                  <FormItem label="负责人" {...formItemLayout}>
                      {
                          userInfo && type=='detail'?userInfo.charger:
                          getFieldDecorator('charger',{
                              initialValue:userInfo.charger,
                          rules: [
                      {
                          required: true,
                          message: '请填写负责人',
                      }]
                          })(
                            <Input/>
                          )
                      }
                  </FormItem>         
                  <FormItem  label="地址" {...formItemLayout}>
                      {
                          userInfo && type=='detail'?userInfo.address:
                          getFieldDecorator('address',{
                              initialValue:userInfo.address,
                              rules: [
                                  {
                                      required: true,
                                      message: '请填写地址',
                                  }]
                          })(
                              
                              <Input/>
                          )
                      }
                  </FormItem>                   
                  <FormItem label="联系方式" {...formItemLayout}>
                      {
                          userInfo && type=='detail'?userInfo.phone:
                          getFieldDecorator('phone',{
                              initialValue:userInfo.phone,
                              rules: [
                                  {
                                      required: true,
                                      message: '请填写联系方式',
                                  }]
                          })(
                            <Input/>
                          )
                      }
                  </FormItem>                          
                  <FormItem {...formItemLayout}>
                      {
                        
                          getFieldDecorator('id',{
                              initialValue:userInfo.id
                          })(
                              <Input type="hidden" />
                          )
                      }
                  </FormItem>         
                  </Form>                       
            </div>
        );
    }

}
DetailForm = Form.create({})(DetailForm);