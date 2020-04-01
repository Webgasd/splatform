import React,{Component} from 'react';
import {Card,Table,Input,DatePicker,Select,Form,Icon,Modal} from "antd";
import TextArea from 'antd/lib/input/TextArea';
import {changeInput} from "../../../../redux/action";
import connect from "react-redux/es/connect/connect";
import SupervisorForm from "./supervisorForm";
const FormItem = Form.Item;
const Option = Select.Option;
@connect(
    state=>({
        input:state.input
    }),
    {
        changeInput,
    }
)

 class DetailForm extends Component {
     state={}
     changeInput=(value,option)=>{
        let input = {...this.props.input,[option]:value}
        this.props.changeInput(input);
    }
    render() {
        const userInfo = this.props.userInfo || {};
        const type=this.props.type;
        const formData=this.props.input||{};
        const { getFieldDecorator } = this.props.form;
        const formItemLayout = {
            labelCol: {span: 8},
            wrapperCol: {span: 10}
        };
        return (
            <div className="commonEnterpriseBox">
               
                <Form >          
                  <FormItem  label="原料类型" {...formItemLayout}>
                      {userInfo && type=='detail'?userInfo.materialcategory:
                          getFieldDecorator('materialcategory',{
                              initialValue:formData.materialcategory,
                              rules: [
                                {
                                  required: true,
                                  message: '请输入内容',
                                }]
                          })(
                          <Input  onClick={()=>this.setState({isVisible:true,personType:'materialcategory'})} 
                          placeholder={"请选择原料类型"} suffix={<Icon type="search" />}/>
                          )}
                  </FormItem>                   
                  <FormItem label="原料名称" {...formItemLayout}>
                      {
                          userInfo && type=='detail'?userInfo.materialname:
                          getFieldDecorator('materialname',{
                              initialValue:userInfo.materialname,
                              rules: [
                                {
                                  required: true,
                                  message: '请输入内容',
                                }]
                          })(
                            <Input type="text" />
                          )
                      }
                  </FormItem>                          
                  <FormItem label="品牌" {...formItemLayout}>
                      {
                      userInfo && type=='detail'?userInfo.brand:
                          getFieldDecorator('brand',{
                              initialValue:userInfo.brand
                          })(
                            <Input type="text" />
                          )
                      }
                  </FormItem>  
                  <FormItem  label="生产商" {...formItemLayout}>
                      {
                          userInfo && type=='detail'?userInfo.manufacturer:
                          getFieldDecorator('manufacturer',{
                              initialValue:userInfo.manufacturer
                          })(
                              
                              <Input/>
                          )
                      }
                  </FormItem>                   
                  <FormItem label="净含量/规格" {...formItemLayout}>
                      {
                          userInfo && type=='detail'?userInfo.specifications:
                          getFieldDecorator('specifications',{
                              initialValue:userInfo.specifications
                          })(
                            <Input type="text" />
                          )
                      }
                  </FormItem>                          
                  <FormItem label="状态" {...formItemLayout}>
                      {
                      userInfo && type=='detail'?userInfo.state:
                          getFieldDecorator('state',{
                              initialValue:userInfo.state
                          })(
                            <Input type="text" />
                          )
                      }
                  </FormItem>  
                  <FormItem label="描述" {...formItemLayout}>
                      {
                      userInfo && type=='detail'?userInfo.extra:
                          getFieldDecorator('extra',{
                              initialValue:userInfo.extra
                          })(
                            <Input type="text" />
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
                  <Modal
                    width='700px'
                    maskClosable={false}
                    title="选择列表"
                    visible={this.state.isVisible}
                    footer={null}
                    onCancel={()=>{
                        this.setState({
                            isVisible:false
                        })
                    }}
                >
                    
                    <SupervisorForm dispatchSupervisor={(data)=>{
                        this.setState({isVisible:false})
                        this.changeInput(data,this.state.personType);}} />
                        
                </Modal>
            </div>


        );
    }

}
export default DetailForm = Form.create({})(DetailForm);