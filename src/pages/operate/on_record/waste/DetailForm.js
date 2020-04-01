import React,{Component} from 'react';
import {Input, DatePicker, Select, Form, Icon, Modal, Row, Col} from "antd";
import TextArea from 'antd/lib/input/TextArea';
import './style.less';
import SupervisorForm from "./supervisorForm";
import {changeWaste} from "../../../../redux/action";
import connect from "react-redux/es/connect/connect";
import moment from 'moment';
import axios from "../../../../axios";
const FormItem = Form.Item;
const Option = Select.Option;

@connect(
    state=>({
        input:state.waste
    }),
    {
        changeWaste,
    }
)
 class DetailForm extends Component {
    state={
        isVisible:false,
        person:[]
    }
    changeInput=(value,option)=>{
        let input = {...this.props.input,[option]:value}
        this.props.changeWaste(input);
    }

   
    disabledDate = (current) => {
        // 不能选今天之后的日期
        return current > moment();
    }



    componentDidMount(){
        axios.PostAjax({
            url:"/supervision/ca/getSelectByEnterpriseId",
            data:{
                params:{

                }
            }
        }).then((res)=>{
            this.setState({
                person:res.data
            })
        })
    }

    render() {
        const userInfo = this.props.userInfo || {};
        const formData=this.props.input||{};
        const type=this.props.type;
        const { getFieldDecorator } = this.props.form;
        const formItemLayout = {
            labelCol: {span: 7},
            wrapperCol: {span: 14}
        };


        return (
            <div className="commonEnterpriseBox">
               
                <Form >          
                  <FormItem  label="处置日期" {...formItemLayout}>
                      {
                          userInfo && type=='detail'?moment(userInfo.disposaltime).format("YYYY-MM-DD"):
                          getFieldDecorator('disposaltime',{
                              initialValue:userInfo.disposaltime===''?moment():moment(userInfo.disposaltime)
                          })(
                              
                            <DatePicker   format="YYYY-MM-DD" showTime disabledDate={this.disabledDate}/>
                          )
                      }
                  </FormItem>                    
                  <FormItem label="处置人" {...formItemLayout}>
                      {
                           userInfo && type=='detail'?userInfo.disposalperson:
                           getFieldDecorator('disposalperson',{
                               initialValue:userInfo.disposalperson,
                               rules: [
                                 {
                                   required: true,
                                   message: '请选择处置人',
                                 }]
                           },)(
                               <Select
                                   showSearch
                                   style={{width:"100%"}}>
                                   {this.state.person.map((item,index)=>{
                                       return(
                                           <Option value={item.name}>
                                               {item.name}
                                           </Option>
                                       )
                                   })}
                               </Select>
                           )
                      }
                  </FormItem>                         
                  <FormItem label="回收企业" {...formItemLayout}>
                      { userInfo && type=='detail'?userInfo.recyclingenterprises:
                          getFieldDecorator('recyclingenterprises',{
                              initialValue:formData.recyclingenterprises,
                              rules: [
                                {
                                  required: true,
                                  message: '请选择回收企业',
                                }]
                          },)(
                          <Input 
                          onClick={()=>this.setState({isVisible:true,personType:'recyclingenterprises'})} 
                          suffix={<Icon type="search" />}/>
                          )
                      }
                  </FormItem>               
                  <FormItem  label="回收人" {...formItemLayout}>
                      {
                        userInfo && type=='detail'?userInfo.recycler:
                          getFieldDecorator('recycler',{
                              initialValue:userInfo.recycler,
                              rules: [
                                {
                                  required: true,
                                  message: '请输入回收人',
                                }]
                          },)(
                              <Input  style={{width:"76%"}} type="text" />
                          )
                      }
                  </FormItem>                   
                  <FormItem label="种类" {...formItemLayout}>
                      {
                         userInfo && type=='detail'?userInfo.kind:
                          getFieldDecorator('kind',{
                              initialValue:userInfo.kind,
                              rules: [
                                {
                                  required: true,
                                  message: '请输入种类',
                                }]
                          })(
                              <Input style={{width:"76%"}} type="text" />
                          )
                      }
                  </FormItem>                
                  <FormItem label="数量"  {...formItemLayout}>
                      {
                           userInfo && type=='detail'?userInfo.number:
                          getFieldDecorator('number',{
                              initialValue:userInfo.number,
                              rules: [
                                {
                                  required: true,
                                  message: '请输入数量',
                                }]
                          })(
                              <Input style={{width:"76%"}} type="text" />
                          )
                      }
                  </FormItem>  
                  
                  <FormItem  label="登记日期" {...formItemLayout}>
                      {
                          userInfo && type=='detail'?moment(userInfo.registrationtime).format("YYYY-MM-DD"):
                          getFieldDecorator('registrationtime',{
                              initialValue:userInfo.registrationtime===''?moment():moment(userInfo.registrationtime)
                          })(
                              
                            <DatePicker    format="YYYY-MM-DD" showTime disabledDate={this.disabledDate}/>
                          )
                      }
                  </FormItem>        
                  <FormItem label="备注" {...formItemLayout}>
                      {
                          userInfo && type=='detail'?userInfo.extra:
                          getFieldDecorator('extra',{
                              initialValue:userInfo.extra
                          })(
                              <TextArea style={{height:"80px"}}/>
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
                  {/* <Button type="primary" htmlType="submit" onClick={this.handleSubmit1} >
            Log in
          </Button>          */}
                  <Modal
                    width='700px'
                    maskClosable={false}
                   
                    title="选择信息列表"
                    visible={this.state.isVisible}
                    footer={null}
                    onCancel={()=>{
                        this.setState({
                            isVisible:false
                        })
                    }}
                >                
                    <SupervisorForm dispatchSupervisor={(data)=>{
                          console.log(data)
                        this.setState({isVisible:false})
                        this.changeInput(data,this.state.personType);}} 
                        personType={this.state.personType}/>
                        
                </Modal>
            </div>


        );
    }

}
DetailForm = Form.create({})(DetailForm);
export default DetailForm;