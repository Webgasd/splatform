import React,{Component} from 'react';
import {Input,DatePicker,Select,Form,Icon,Modal} from "antd";
import TextArea from 'antd/lib/input/TextArea';
import './style.less';
import SupervisorForm from "./supervisorForm";
import {changeWaste} from "../../../../redux/action";
import connect from "react-redux/es/connect/connect";
import moment from 'moment';
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
    state={isVisible:false}
  
    changeInput=(value,option)=>{
        let input = {...this.props.input,[option]:value}
        this.props.changeInput(input);
    }
    disabledDate = (current) => {
        // 不能选今天之后的日期
        return current > moment();
    };

    optionList1=()=>{
        let options=[];
        let num=0;
        for(var i=0;i<2;i++){
            for (var j=0;j<10;j++){
                num=i+""+j;
                options.push(<Option value={num} key={num}>{num}</Option>)
            }
        }
        for (var j=0;j<4;j++){
            let num="2"+""+j;
            options.push(<Option value={num} key={num}>{num}</Option>)
        }
        return options;
    }
    optionList2=()=>{
        let options=[];
        for(var i=0;i<6;i++){
            for (var j=0;j<10;j++){
                let num=i+""+j;
                options.push(<Option value={num} key={num}>{num}</Option>)
            }
        }
        return options;
    }

    render() {
        const userInfo = this.props.userInfo || {};
        const formData=this.props.input||{};
        const type=this.props.type;
        const { getFieldDecorator } = this.props.form;
     //   console.log(formData.recyclingenterprises)
        const formItemLayout = {
            labelCol: {span: 7},
            wrapperCol: {span: 14}
        };
        return (
            <div className="commonEnterpriseBox">
               
                <Form >          
                  <FormItem  label="处置日期" {...formItemLayout}>
                      {
                          userInfo && type=='detail'?moment(userInfo.disposaltime).format("YYYY-MM-DD hh:mm:ss"):
                          getFieldDecorator('disposaltime',{
                              initialValue:userInfo.disposaltime===''?moment():moment(userInfo.disposaltime)
                          })(
                              
                            <DatePicker   format="YYYY-MM-DD hh:mm:ss" showTime disabledDate={this.disabledDate}/>
                          )
                      }
                  </FormItem>
                  {/* <tr>
                 <div className="text">时间 : </div>
                 <td style={{width:"15%"}} >
                  <FormItem  >
                      {
                          userInfo && type=='detail'?userInfo.disposalhour:
                          getFieldDecorator('disposalhour',{
                              initialValue:userInfo.disposalhour
                          })(
                            <Select >
                            {this.optionList1()}
                        </Select>   
                          )
                      }
                  </FormItem> 
                  </td>
                  <div className="time">时 </div>
                  <td style={{width:"15%"}} >
                  <FormItem  >
                      {
                          userInfo && type=='detail'?userInfo.disposalmin:
                          getFieldDecorator('disposalmin',{
                              initialValue:userInfo.disposalmin
                          })(
                            <Select >
                             {this.optionList2()}
                        </Select>   
                          )
                      }
                  </FormItem> 
                </td>
                <div className="time">分  </div>
                  </tr>   */}                     
                  <FormItem label="处置人" {...formItemLayout}>
                      {
                          <td ><Input value={formData.disposalperson} disabled={type=='detail'?true:false}
                           onClick={()=>this.setState({isVisible:true,personType:'disposalperson'})} 
                          placeholder={"请选择人员"} suffix={<Icon type="search" />}/></td>
                      }
                  </FormItem>                         
                  <FormItem label="回收企业" {...formItemLayout}>
                      {
                          <td ><Input value={formData.recyclingenterprises} disabled={type=='detail'?true:false} 
                          onClick={()=>this.setState({isVisible:true,personType:'recyclingenterprises'})} 
                          suffix={<Icon type="search" />}/></td>
                      }
                  </FormItem>               
                  <FormItem  label="回收人" {...formItemLayout}>
                      {
                        userInfo && type=='detail'?userInfo.recycler:
                          getFieldDecorator('recycler',{
                              initialValue:userInfo.recycler
                          })(
                              <Input style={{width:"76%"}} type="text" />
                          )
                      }
                  </FormItem>                   
                  <FormItem label="种类" {...formItemLayout}>
                      {
                         userInfo && type=='detail'?userInfo.kind:
                          getFieldDecorator('kind',{
                              initialValue:userInfo.kind
                          })(
                              <Input style={{width:"76%"}} type="text" />
                          )
                      }
                  </FormItem>                
                  <FormItem label="数量"  {...formItemLayout}>
                      {
                           userInfo && type=='detail'?userInfo.number:
                          getFieldDecorator('number',{
                              initialValue:userInfo.number
                          })(
                              <Input style={{width:"76%"}} type="text" />
                          )
                      }
                  </FormItem>  
                  
                  <FormItem  label="登记日期" {...formItemLayout}>
                      {
                          userInfo && type=='detail'?moment(userInfo.registrationtime).format("YYYY-MM-DD hh:mm:ss"):
                          getFieldDecorator('registrationtime',{
                              initialValue:userInfo.registrationtime===''?moment():moment(userInfo.registrationtime)
                          })(
                              
                            <DatePicker    format="YYYY-MM-DD hh:mm:ss" showTime disabledDate={this.disabledDate}/>
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
                  <Modal
                    width='700px'
                    destroyOnClose
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