import React,{Component} from 'react';
import {Input, Select, DatePicker, Button, Modal, Icon} from 'antd';
import connect from "react-redux/es/connect/connect";
import {changeEnterprise} from "../../../../redux/action";
import moment from "moment";
import axios from "../../../../axios";
import ProduceCateForm from "../childrenForm/ProduceCateForm";
import NumericInput from "../../../../components/NumericInput";

const Option = Select.Option;

@connect(
    state=>({
        input:state.enterprise
    }),
    {
        changeEnterprise,
    }
)
class FoodProduce extends Component {
    state={categoryList:[],licenceList:[]}
    componentDidMount() {
        this.requestList();
    }
    requestList=()=>{
        axios.ajax({
            url:'/supervision/enterprise/getCateAndLicence',
            data:{
                params:{id:5}
            }
        }).then((res)=>{
            if(res.status == "success"){
                this.setState({
                    categoryList:res.data.categoryList,
                    licenceList:res.data.licenceList
                })
            }
        })
    }
    changeInput=(value,option)=>{
        let foodProduce = this.props.input.foodProduce||{};
        foodProduce[option]=value;
        let input = {...this.props.input,foodProduce}
        this.props.changeEnterprise(input);
    }
    changeList=(value,option,index)=>{
        let foodProduce = this.props.input.foodProduce||{};
        let list = foodProduce.list||[];
        list[index][option]=value;
        foodProduce.list=list;
        let input = {...this.props.input,foodProduce}
        this.props.changeEnterprise(input);
    }
    plusList=()=>{
        let foodProduce = this.props.input.foodProduce||{};
        let list = foodProduce.list||[];
        list.push({});
        foodProduce.list=list;
        let input = {...this.props.input,foodProduce}
        this.props.changeEnterprise(input);
    }
    cutList=()=>{
        let foodProduce = this.props.input.foodProduce||{};
        let list = foodProduce.list||[];
        list.pop();
        foodProduce.list=list;
        let input = {...this.props.input,foodProduce}
        this.props.changeEnterprise(input);
    }
    changeEndDate=(value,option)=>{
        let foodProduce = this.props.input.foodProduce||{};
        foodProduce[option]=value;
        if(foodProduce.startTime){
            foodProduce.endTime=moment(foodProduce.startTime).add(value,'years').subtract(1,'day');
        }
        let input = {...this.props.input,foodProduce}
        this.props.changeEnterprise(input);
    }
    changeGiveTime=(value,option)=>{
        let foodProduce = this.props.input.foodProduce||{};
        foodProduce[option]=value;
        foodProduce.startTime=value;
        let input = {...this.props.input,foodProduce}
        this.props.changeEnterprise(input);
    }
    render(){
        const formData=this.props.input.foodProduce||{};
        const checkStatus = this.props.type=='detail'?true:false;
        const list = formData.list||[];
        return(
            <div>
                <table>
                    <tr>
                        <td>证号<span style={{color:'#FF3300'}}>*</span></td>
                        <td><Input value={formData.number} onChange={(e)=>this.changeInput(e.target.value,"number")} placeholder={"请输入证号"}  disabled={checkStatus}/></td>
                        <td>有效期（年）</td>
                        <td><NumericInput value={formData.validityAge} onChange={(value)=>this.changeEndDate(value,"validityAge")}  disabled={checkStatus}/></td>
                        <td>发证机关<span style={{color:'#FF3300'}}>*</span></td>
                        <td><Select placeholder={"请选择发证机关"} value={formData.licenseAuthority} style={{width:"100%"}}onChange={(value)=>this.changeInput(value,"licenseAuthority")}  disabled={checkStatus}>
                            {this.state.licenceList.map((item)=>(<Option value={item.name}>{item.name}</Option>))}
                        </Select></td>
                    </tr>
                    <tr>
                        <td>发证日期<span style={{color:'#FF3300'}}>*</span></td>
                        <td><DatePicker style={{width:'100%'}}
                                        disabled={checkStatus}
                                        value={formData.giveTime==null?null:moment(formData.giveTime)}
                                        onChange={(date)=>this.changeGiveTime(date,'giveTime')}
                                        showTime={true} placeholder="请输入发证时间" format="YYYY-MM-DD"/></td>
                        <td>开始日期<span style={{color:'#FF3300'}}>*</span></td>
                        <td><DatePicker style={{width:'100%'}}
                                        disabled={checkStatus}
                                        value={formData.startTime==null?null:moment(formData.startTime)}
                                        onChange={(date)=>this.changeInput(date,'startTime')}
                                        showTime={true} placeholder="请选择开始时间" format="YYYY-MM-DD"/></td>
                        <td>结束日期<span style={{color:'#FF3300'}}>*</span></td>
                        <td><DatePicker
                            style={{width:'100%'}}
                            disabled={checkStatus}
                            value={formData.endTime==null?null:moment(formData.endTime)}
                            onChange={(date)=>this.changeInput(date,'endTime')}
                            showTime={true} placeholder="请输入截至时间" format="YYYY-MM-DD"/></td>
                    </tr>
                    <tr>
                        <td>备注</td>
                        <td colSpan={5}><Input.TextArea rows={3} value={formData.remark} onChange={(e)=>this.changeInput(e.target.value,"remark")}  disabled={checkStatus}/></td>
                    </tr>
                </table>
                <div style={{marginTop:10}}>
                    <Button type="primary" onClick={this.plusList} icon='plus'  disabled={checkStatus}/>
                    <Button type="primary" style={{marginLeft:10}} onClick={this.cutList} icon='minus'  disabled={checkStatus}/>
                </div>

                <table style={{marginTop:10}}>
                    <tr>
                        <th>添加剂类别</th>
                        <th>类别编号</th>
                        <th>类别名称</th>
                        <th>品种明细</th>
                    </tr>
                    {list.map((item,index)=>(
                        <tr>
                            <td><Input value={item.category} onClick={()=>this.setState({isVisible:true,handleRow:index})} suffix={<Icon type="search" />}  disabled={checkStatus}/></td>
                            <td><Input value={item.code} onChange={(e)=>this.changeList(e.target.value,"code",index)}  disabled={checkStatus}/></td>
                            <td><Input value={item.name} onChange={(e)=>this.changeList(e.target.value,"name",index)}  disabled={checkStatus}/></td>
                            <td><Input value={item.detail} onChange={(e)=>this.changeList(e.target.value,"detail",index)}  disabled={checkStatus}/></td>
                        </tr>
                    ))}

                </table>
                <Modal
                    width='700px'
                    title="添加剂列表"
                    visible={this.state.isVisible}
                    footer={null}
                    onCancel={()=>{
                        this.setState({
                            isVisible:false
                        })
                    }}
                >
                    <ProduceCateForm dispatchSupervisor={(data)=>{
                        this.setState({isVisible:false})
                        let foodProduce = this.props.input.foodProduce||{};
                        let list = foodProduce.list||[];
                        list[this.state.handleRow]["category"]=data.parentName;
                        list[this.state.handleRow]["code"]=data.code;
                        list[this.state.handleRow]["name"]=data.name;
                        list[this.state.handleRow]["detail"]=data.breedDetail;
                        foodProduce.list=list;
                        let input = {...this.props.input,foodProduce}
                        this.props.changeEnterprise(input);}}/>
                </Modal>
            </div>

        );
    }
}
export default FoodProduce;