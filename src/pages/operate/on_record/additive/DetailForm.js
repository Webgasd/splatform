import React,{Component} from 'react';
import {Card,Input,DatePicker,Select,Form,Button,Icon,Modal} from "antd";
import SupervisorForm from "./supervisorForm";
import connect from "react-redux/es/connect/connect";
import {changeAdditive} from "../../../../redux/action";
import moment from 'moment';
const Option=Select.Option;
@connect(
    state=>({
        input:state.additive
    }),
    {
        changeAdditive,
    }
)
class DetailForm extends Component {
    state={
        selectedRowKeys: [], // Check here to configure the default column
       
    }
    params = {
        pageNo:1
    }
 
    changeInput=(value,option)=>{
        
        let additive= this.props.input||{};
        additive[option]=value;
        let input = {...this.props.input,additive}
        this.props.changeAdditive(input);
    }
    changeList=(value,option,index)=>{
        let additive = this.props.input||{};
        let list = additive.list||[];
        list[index][option]=value;
        additive.list=list;
        let input = {...this.props.input,additive}
        this.props.changeAdditive(input);
    }
    plusList=()=>{
     //   console.log("value")
        let additive = this.props.input||{};
        let list = additive.list||[];
        list.push({});
        additive.list=list;
        let input = {...this.props.input,additive}
        this.props.changeAdditive(input);
    }
    cutList=()=>{
        let additive = this.props.input||{};
        let list = additive.list||[];
        list.pop();
        additive.list=list;
        let input = {...this.props.input,additive}
        this.props.changeAdditive(input);
    }
    render() {
        const type=this.props.type;
        const formData=this.props.input||{};
        const list = formData.list||[];

        return (
            <div>
                <Card  style={{marginLeft:15,marginRight:15}}>
                    <div className='commonEnterpriseBox'>
                        <table>
                            <tbody>
                    {/* <th>使用单位</th>
                        <td><Input value={formData.enterpriseName} onChange={(e)=>this.changeInput(e.target.value,"enterpriseName")} disabled/></td> */}
                        
                        <th>食品安全管理员</th>
                        <td ><Input  value={formData.administrator} disabled onClick={()=>this.setState({isVisible:true,personType:'administrator'})} placeholder={"请选择管理员"} suffix={<Icon type="search" />}/></td>
                        <th><span style={{color:'#FF3300'}}>*</span>备案日期</th>
                        <td><DatePicker style={{width:'100%'}}
                        disabled={type=='detail'?true:false}
                                        value={formData.recordDate=moment(formData.recordDate)}
                                        onChange={(date)=>this.changeInput(date,'recordDate')}
                                        format="YYYY-MM-DD"/></td>
                       <tr>
                        <th>备案号</th>
                        <td><Input required={true} value={formData.recordNo} onChange={(e)=>this.changeInput(e.target.value,"recordNo")} disabled={type=='detail'?true:false}/></td>
                       
                        <th>公示状态</th>
                        <td><Select  value={formData.publicity} placeholder="请选择"style={{width:"100%"}} onChange={(value)=>this.changeInput(value,"publicity")} disabled={type=='detail'?true:false}>
                             <Option value="未公示">未公示</Option>
                            <Option value="已公示">已公示</Option>
                            </Select>
                           </td>
                        </tr>
                        </tbody>
                        </table>
                    </div>
                </Card>
                <Card  style={{marginRight:15,marginLeft:15,marginTop:15}}>
                <div style={{marginTop:10}}>
                    <Button type="primary" onClick={this.plusList} disabled={type=='detail'?true:false} icon='plus'/>
                    <Button type="primary" style={{marginLeft:10}} disabled={type=='detail'?true:false} onClick={this.cutList} icon='minus'/>
                </div>
                <div className='commonEnterpriseBox'>
                <table style={{marginTop:10}}>
                    <tbody>
                <tr>
        <th>序号</th>
        <th>使用的食品添加剂名称</th>
        <th>生产厂家</th>
        <th>规格</th>
        <th>数量</th>
        <th>用途</th>
        <th>添加剂添加量规定量</th>
        <th>实际量</th>
        <th>添加用计量器具名称</th>
        <th>使用日期</th>
        <th>备注</th>
        </tr>
        {list.map((item,index)=>(
                        <tr>
                            <td style={{width:60}}><Input  value={index==0?item.seq=1:item.seq=index+1} onChange={(e)=>this.changeList(e.target.value,"seq",index)} disabled={type=='detail'?true:false}/></td>
                            <td><Input value={item.foodadditive} onChange={(e)=>this.changeList(e.target.value,"foodadditive",index)}disabled={type=='detail'?true:false}/></td>
                            <td><Input value={item.manufacturer} onChange={(e)=>this.changeList(e.target.value,"manufacturer",index)}disabled={type=='detail'?true:false}/></td>
                            <td><Input value={item.specifications} onChange={(e)=>this.changeList(e.target.value,"specifications",index)}disabled={type=='detail'?true:false}/></td>
                            <td><Input value={item.number} onChange={(e)=>this.changeList(e.target.value,"number",index)}disabled={type=='detail'?true:false}/></td>
                            <td><Input value={item.purpose} onChange={(e)=>this.changeList(e.target.value,"purpose",index)}disabled={type=='detail'?true:false}/></td>
                            <td><Input value={item.quantity} onChange={(e)=>this.changeList(e.target.value,"quantity",index)}disabled={type=='detail'?true:false}/></td>
                            <td><Input value={item.actualquantity} onChange={(e)=>this.changeList(e.target.value,"actualquantity",index)}disabled={type=='detail'?true:false}/></td>
                            <td><Input value={item.instrument} onChange={(e)=>this.changeList(e.target.value,"instrument",index)}disabled={type=='detail'?true:false}/></td>
                            <td style={{width:120}}><DatePicker value={item.usedate=moment(item.usedate)} onChange={(date)=>this.changeList(date,"usedate",index)}  disabled={type=='detail'?true:false} format="YYYY-MM-DD"/></td>
                            <td><Input value={item.extra} onChange={(e)=>this.changeList(e.target.value,"extra",index)} disabled={type=='detail'?true:false}/></td>
                           
                        </tr>
                    ))}
                    </tbody>
                  </table>
                 <table>
                     <td>说明</td>
                     <td>
                    <tr>1、餐饮服务单位必须如实填写，并对填写内容的真实性负责。</tr>
                    <tr>2、使用新的食品添加剂或使用的食品添加剂需变动时，必须先备案。</tr>
                    <tr>3、本表一式二份，辖区食品药品监督管理局审核签章后，一份餐饮服务单位存档，一份由食品药品监督管理局存档。</tr>
                     </td>
                 </table>
                 </div>
                </Card>
                <Modal
                    width='700px'
                    maskClosable={false}
                    title="监管人员信息列表"
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