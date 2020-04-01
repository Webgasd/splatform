import React,{Component} from 'react';
import {Input,Form} from "antd";

const FormItem = Form.Item;
class DetailForm extends Component {
 

    render() {
        const userInfo = this.props.userInfo || {};
        const type=this.props.type;
        const { getFieldDecorator } = this.props.form;
    
        return (
            <div>
                <Form layout="inline">              
                <FormItem  label="检查结果" >
                    {
                        userInfo && type=='detail'?userInfo.type:
                        getFieldDecorator('type',{
                            initialValue:userInfo.type,
                            rules: [
                              {
                                required: true,
                                message: 'Please input!',
                              }]
                        })(
                      <Input style={{width:200}}/>  
                        )
                    }
                </FormItem>    
                <FormItem >
                      {
                        
                          getFieldDecorator('id',{
                              initialValue:userInfo.id
                          })(
                              <Input type="hidden" />
                          )
                      }
                  </FormItem>         
                </Form > 
            </div>


        );
    }

}
export default DetailForm = Form.create({})(DetailForm);