import React,{Component} from 'react';
import {Select,Input,DatePicker,Checkbox } from 'antd';
import connect from "react-redux/es/connect/connect";
import {changeEnterprise} from "../../../../redux/action";
import moment from "moment";
import axios from "../../../../axios";
import NumericInput from "../../../../components/NumericInput";
const Option = Select.Option;
const { TextArea } = Input;
@connect(
    state=>({
        input:state.enterprise
    }),
    {
        changeEnterprise,
    }
)
class FoodBusiness extends Component{
    state={categoryList:[],licenceList:[]}
    componentDidMount() {
        this.requestList();
    }
    requestList=()=>{
        axios.ajax({
            url:'/supervision/enterprise/getCateAndLicence',
            data:{
                params:{id:1}
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
        let foodBusiness = this.props.input.foodBusiness||{};
        foodBusiness[option]=value;
        let input = {...this.props.input,foodBusiness}
        this.props.changeEnterprise(input);
    }
    onCheckChange=(value,option)=>{
        this.changeInput(value.join(','),option)
    }
    changeEndDate=(value,option)=>{
        let foodBusiness = this.props.input.foodBusiness||{};
        foodBusiness[option]=value;
        if(foodBusiness.startTime){
            foodBusiness.endTime=moment(foodBusiness.startTime).add(value,'years').subtract(1,'day');
        }
        let input = {...this.props.input,foodBusiness}
        this.props.changeEnterprise(input);
    }
    changeGiveTime=(value,option)=>{
        let foodBusiness = this.props.input.foodBusiness||{};
        foodBusiness[option]=value;
        foodBusiness.startTime=value;
        let input = {...this.props.input,foodBusiness}
        this.props.changeEnterprise(input);
    }
    render() {
        const formData=this.props.input.foodBusiness||{};
        const checkStatus = this.props.type=='detail'?true:false;
        return (
                <table>
                    <tbody>
                    <tr>
                        <td style={{width:100}}>证号<span style={{color:'#FF3300'}}>*</span></td>
                        <td><Input value={formData.number} onChange={(e)=>this.changeInput(e.target.value,"number")} placeholder={"请输入证号"}  disabled={checkStatus}/></td>
                        <td>核定主体业态<span style={{color:'#FF3300'}}>*</span></td>
                        <td colSpan={3}>
                        <Select value={formData.businessFormat} style={{width:"100%"}}onChange={(value)=>this.changeInput(value,"businessFormat")}  disabled={checkStatus}>
                            <Option value="餐饮服务经营者（非连锁）">餐饮服务经营者（非连锁）</Option>
                            <Option value="餐饮服务经营者（连锁）">餐饮服务经营者（连锁）</Option>
                            <Option value="单位食堂">单位食堂</Option>
                            <Option value="食品销售经营者（非连锁）">食品销售经营者（非连锁）</Option>
                            <Option value="食品销售经营者（连锁）">食品销售经营者（连锁）</Option>
                            <Option value="餐饮服务经营者">餐饮服务经营者</Option>
                            <Option value="食品销售经营者">食品销售经营者</Option>
                           </Select>
                        </td>
                    </tr>
                    <tr>
                        <td>主体业态备注</td>
                        <td colSpan={5} style={{textAlign:'left'}}><Checkbox.Group style={{width:'100%'}} value={formData.formatNotes?formData.formatNotes.split(','):[]} onChange={(value)=>this.onCheckChange(value,'formatNotes')}  disabled={checkStatus}>
                            <Checkbox style={{marginLeft:8}} value={'餐饮服务营业者（中央厨房）'}>餐饮服务营业者（中央厨房）</Checkbox>
                            <Checkbox value={'餐饮服务营业者（集体用餐配送）'}>餐饮服务营业者（集体用餐配送）</Checkbox>
                            <Checkbox value={'是否网络经营'}>是否网络经营</Checkbox>
                        </Checkbox.Group></td>
                    </tr>
                    <tr>
                        <td>核定经营项目<span style={{color:'#FF3300'}}>*</span></td>
                        <td colSpan={5}  style={{textAlign:'left'}}><Checkbox.Group style={{width:'100%'}} value={formData.businessProject?formData.businessProject.split(','):[]} onChange={(value)=>this.onCheckChange(value,'businessProject')}  disabled={checkStatus}>
                            <Checkbox style={{marginLeft:8}} value={'预装食品销售'}>预装食品销售</Checkbox>
                            <Checkbox value={'预包装食品（含冷藏冷冻食品）销售'}>预包装食品（含冷藏冷冻食品）销售</Checkbox>
                            <Checkbox value={'预包装食品（不含冷藏冷冻食品）销售'}>预包装食品（不含冷藏冷冻食品）销售</Checkbox>
                            <Checkbox value={'散装食品销售'}>散装食品销售</Checkbox>
                            <Checkbox value={'散装食品（含冷藏冷冻食品含熟食）销售'}>散装食品（含冷藏冷冻食品含熟食）销售</Checkbox>
                            <Checkbox value={'散装食品（含冷藏冷冻食品不含熟食）销售'}>散装食品（含冷藏冷冻食品不含熟食）销售</Checkbox>
                            <Checkbox value={'散装食品（不含冷藏冷冻食品含熟食）销售'}>散装食品（不含冷藏冷冻食品含熟食）销售</Checkbox>
                            <Checkbox value={'散装食品（不含冷藏冷冻食品不含熟食）销售'}>散装食品（不含冷藏冷冻食品不含熟食）销售</Checkbox>
                            <Checkbox value={'婴幼儿配方乳粉'}>婴幼儿配方乳粉</Checkbox>
                            <Checkbox value={'其他婴幼儿配方食品'}>其他婴幼儿配方食品</Checkbox>
                            <Checkbox value={'保健食品销售'}>保健食品销售</Checkbox>
                            <Checkbox value={'特殊医学用途配方食品'}>特殊医学用途配方食品</Checkbox>
                            <Checkbox value={'其他类食品销售'}>其他类食品销售</Checkbox>
                            <Checkbox value={'热食类食品制售'}>热食类食品制售</Checkbox>
                            <Checkbox value={'冷食类食品制售'}>冷食类食品制售</Checkbox>
                            <Checkbox value={'生食类食品制售'}>生食类食品制售</Checkbox>
                            <Checkbox value={'糕点类食品制售'}>糕点类食品制售</Checkbox>
                            <Checkbox value={'糕点类食品制售（含裱花蛋糕）'}>糕点类食品制售（含裱花蛋糕）</Checkbox>
                            <Checkbox value={'糕点类食品制售（不含裱花蛋糕）'}>糕点类食品制售（不含裱花蛋糕）</Checkbox>
                            <Checkbox value={'自制饮品制售'}>自制饮品制售</Checkbox>
                            <Checkbox value={'自制饮品制售（含使用压力容器制作饮品）'}>自制饮品制售（含使用压力容器制作饮品）</Checkbox>
                            <Checkbox value={'自制饮品制售（不含使用压力容器制作饮品）'}>自制饮品制售（不含使用压力容器制作饮品）</Checkbox>
                            <Checkbox value={'其他类食品制售'}>其他类食品制售</Checkbox>
                        </Checkbox.Group></td>
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
                        <td>经营类别<span style={{color:'#FF3300'}}>*</span></td>
                        <td><Select placeholder={"请选择类别"} value={formData.category} style={{width:"100%"}}onChange={(value)=>this.changeInput(value,"category")}  disabled={checkStatus} >
                            {this.state.categoryList.map((item)=>(<Option value={item.name}>{item.name}</Option>))}
                        </Select></td>
                        <td>发证机关<span style={{color:'#FF3300'}}>*</span></td>
                        <td><Select placeholder={"请选择发证机关"} value={formData.licenseAuthority} style={{width:"100%"}}onChange={(value)=>this.changeInput(value,"licenseAuthority")}  disabled={checkStatus}>
                            {this.state.licenceList.map((item)=>(<Option value={item.name}>{item.name}</Option>))}
                        </Select></td>
                    </tr>
                    <tr>
                        <td>备注</td>
                        <td colSpan={5}><TextArea value={formData.remark} onChange={(e)=>this.changeInput(e.target.value,"remark")} rows={5}  disabled={checkStatus}/></td>
                    </tr>
                    </tbody>
                </table>
        )
    }
}
export default FoodBusiness;
