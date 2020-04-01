import React,{Component} from 'react';
import {Input, Select, DatePicker, Checkbox, Modal, Icon} from 'antd';
import connect from "react-redux/es/connect/connect";
import {changeEnterprise} from "../../../../redux/action";
import moment from "moment";
import axios from "../../../../axios";
import SupervisorForm from "../childrenForm/supervisorForm";
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
class FoodCirculate extends Component {
    state={categoryList:[],licenceList:[],selectedList:[]}
    componentDidMount() {
        this.requestList();
    }
    requestList=()=>{
        axios.ajax({
            url:'/supervision/enterprise/getCateAndLicence',
            data:{
                params:{id:3}
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
        let foodCirculate = this.props.input.foodCirculate||{};
        foodCirculate[option]=value;
        let input = {...this.props.input,foodCirculate}
        this.props.changeEnterprise(input);
    }
    onCheckChange=(value,option)=>{
        this.changeInput(value.join(','),option)
    }
    changeEndDate=(value,option)=>{
        let foodCirculate = this.props.input.foodCirculate||{};
        foodCirculate[option]=value;
        if(foodCirculate.startTime){
            foodCirculate.endTime=moment(foodCirculate.startTime).add(value,'years').subtract(1,'day');
        }
        let input = {...this.props.input,foodCirculate}
        this.props.changeEnterprise(input);
    }
    changeGiveTime=(value,option)=>{
        let foodCirculate = this.props.input.foodCirculate||{};
        foodCirculate[option]=value;
        foodCirculate.startTime=value;
        let input = {...this.props.input,foodCirculate}
        this.props.changeEnterprise(input);
    }
    render(){
        const formData=this.props.input.foodCirculate||{};
        const checkStatus = this.props.type=='detail'?true:false;
        return(
            <table>
                <tr>
                    <td>证号<span style={{color:'#FF3300'}}>*</span></td>
                    <td colSpan={3}><Input value={formData.number} onChange={(e)=>this.changeInput(e.target.value,"number")} placeholder={"请输入证号"}  disabled={checkStatus}/></td>
                    <td>主体类型</td>
                    <td><Select value={formData.bodyType} style={{width:"100%"}}onChange={(value)=>this.changeInput(value,"bodyType")} placeholder='请选择主体类型' disabled={checkStatus}>
                        <Option value={0}>企业</Option>
                        <Option value={1}>个体</Option>
                    </Select>
                    </td>
                </tr>
                <tr>
                    <td>核定经营项目<span style={{color:'#FF3300'}}>*</span></td>
                    <td colSpan={5} style={{textAlign:'left'}}>
                        <Checkbox.Group style={{width:'100%'}} value={formData.businessProject?formData.businessProject.split(','):[]} onChange={(value)=>this.onCheckChange(value,'businessProject')}  disabled={checkStatus}>
                            <Checkbox style={{marginLeft:8}} value={'预包装食品'}>预包装食品</Checkbox>
                            <Checkbox value={'预包装食品（含保健食品）'}>预包装食品（含保健食品）</Checkbox>
                            <Checkbox value={'散装食品'}>散装食品</Checkbox>
                            <Checkbox value={'乳制品（不含婴儿配方乳粉）'}>乳制品（不含婴儿配方乳粉）</Checkbox>
                            <Checkbox value={'乳制品（含婴儿配方乳品）'}>乳制品（含婴儿配方乳品）</Checkbox>
                        </Checkbox.Group>
                    </td>
                </tr>
                <tr>
                    <td style={{width:100}}>经营种类<span style={{color:'#FF3300'}}>*</span></td>
                    <td colSpan={5}  style={{textAlign:'left'}}>
                        <Checkbox.Group style={{width:'100%'}} value={formData.businessType?formData.businessType.split(','):[]} onChange={(value)=>this.onCheckChange(value,'businessType')}  disabled={checkStatus}>
                            <Checkbox style={{marginLeft:8}} value={'保健食品'}>保健食品</Checkbox>
                            <Checkbox value={'奶制品'}>奶制品</Checkbox>
                            <Checkbox value={'食用油脂'}>食用油脂</Checkbox>
                            <Checkbox value={'冷冻食品'}>冷冻食品</Checkbox>
                            <Checkbox value={'果脯蜜饯'}>果脯蜜饯</Checkbox>
                            <Checkbox value={'豆制品'}>豆制品</Checkbox>
                            <Checkbox value={'罐头'}>罐头</Checkbox>
                            <Checkbox value={'禽蛋制品'}>禽蛋制品</Checkbox>
                            <Checkbox value={'调味品'}>调味品</Checkbox>
                            <Checkbox value={'饮料制品'}>饮料制品</Checkbox>
                            <Checkbox value={'酒类'}>酒类</Checkbox>
                            <Checkbox value={'米面制品'}>米面制品</Checkbox>
                            <Checkbox value={'油炸膨化制品'}>油炸、膨化制品</Checkbox>
                            <Checkbox value={'月饼'}>月饼</Checkbox>
                            <Checkbox value={'干果坚果'}>干果坚果</Checkbox>
                            <Checkbox value={'腌制食品'}>腌制食品</Checkbox>
                            <Checkbox value={'专供婴幼儿食用食品'}>专供婴幼儿食用食品</Checkbox>
                            <Checkbox value={'专供老年人食用食品'}>专供老年人食用食品</Checkbox>
                            <Checkbox value={'水产制品'}>水产制品</Checkbox>
                            <Checkbox value={'茶叶'}>茶叶</Checkbox>
                            <Checkbox value={'蔬菜'}>蔬菜</Checkbox>
                            <Checkbox value={'水果'}>水果</Checkbox>
                            <Checkbox value={'鲜肉'}>鲜肉</Checkbox>
                            <Checkbox value={'鲜水产'}>鲜水产</Checkbox>
                            <Checkbox value={'现做蛋糕西点'}>现做蛋糕西点</Checkbox>
                            <Checkbox value={'其他'}>其他</Checkbox>
                        </Checkbox.Group>
                    </td>
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
                    <td>有效期(年)</td>
                    <td><NumericInput value={formData.validityAge} onChange={(value)=>this.changeEndDate(value,"validityAge")}  disabled={checkStatus}/></td>
                    <td>申请副本数量</td>
                    <td><Input value={formData.copiesNumber} onChange={(e)=>this.changeInput(e.target.value,"copiesNumber")}  disabled={checkStatus}/></td>
                    <td>发证机关</td>
                    <td><Select placeholder={"请选择发证机关"} value={formData.licenseAuthority} style={{width:"100%"}}onChange={(value)=>this.changeInput(value,"licenseAuthority")}  disabled={checkStatus}>
                        {this.state.licenceList.map((item)=>(<Option value={item.name}>{item.name}</Option>))}
                    </Select></td>
                </tr>
                <tr>
                    <td>现场检查人</td>
                    <td>
                        <Input value={formData.lssuer} onClick={()=>this.setState({isVisible:true,personType:'lssuer'})} placeholder={"请选择现场检查人"} suffix={<Icon type="search" />}  disabled={checkStatus}/>
                    </td>
                    <td>签发人</td>
                    <td><Input value={formData.inspector} onClick={()=>this.setState({isVisible:true,personType:'inspector'})} placeholder={"请选择签发人"} suffix={<Icon type="search" />} disabled={checkStatus}/></td>
                    <td>经营方式</td>
                    <td><Select value={formData.businessMode} style={{width:"100%"}}onChange={(value)=>this.changeInput(value,"businessMode")}  disabled={checkStatus}>
                        <Option value="食品流通企业（有限公司）">食品流通企业（有限公司）</Option>
                        <Option value="股份有限公司">股份有限公司</Option>
                        <Option value="个体工商户">个体工商户</Option>
                        <Option value="食品自动售货机经营者">食品自动售货机经营者</Option>
                        <Option value="大型商场超市">大型商场超市</Option>
                        <Option value="中型商场超市">中型商场超市</Option>
                        <Option value="食品店（个体）">食品店（个体）</Option>
                        <Option value="固定">固定</Option>
                        <Option value="批发">批发</Option>
                        <Option value="零售">零售</Option>
                        <Option value="批发兼零售">批发兼零售</Option>
                        <Option value="网络食品经营者">网络食品经营者</Option>
                    </Select></td>
                </tr>
                <tr>
                    <td>备注</td>
                    <td colSpan={5}><Input.TextArea value={formData.remark} onChange={(e)=>this.changeInput(e.target.value,"remark")} rows={5}  disabled={checkStatus}/></td>
                </tr>
                <Modal
                    width='700px'
                    title="监管人员信息列表"
                    visible={this.state.isVisible}
                    destroyOnClose={true}
                    onOk={()=>{
                        this.changeInput(this.state.selectedList.map((item)=>item.name).join(','),this.state.personType);
                        this.setState({isVisible:false,selectedList:[]})
                    }}
                    onCancel={()=>{
                        this.setState({
                            isVisible:false,selectedList:[]
                        })
                    }}
                >
                    <SupervisorForm
                        selectedList={this.state.selectedList}
                        dispatchSupervisor={(data)=>{
                        this.setState({selectedList:data})}}/>
                </Modal>
            </table>
        );
    }
}
export default FoodCirculate;