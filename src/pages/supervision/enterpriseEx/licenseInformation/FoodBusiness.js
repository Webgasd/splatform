import React,{Component} from 'react';
import {Select,Input,Radio,DatePicker,Checkbox} from 'antd';
import connect from "react-redux/es/connect/connect";
import {changeEnterprise} from "../../../../redux/action";
import axios from "../../../../axios";
import moment from "moment"


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
    onCheckChange=(value,option,index)=>{
        this.changeInput(value.join(','),option,index)
    }

    changeStartTime=(value,option,index)=>{
        let foodBusinessList = this.props.input.foodBusinessList||[];
        foodBusinessList[index][option]=value;
        foodBusinessList[index].giveTime=value;
        foodBusinessList[index].endTime=moment(value).add(5,'years').subtract(1,'day')
        let input = {...this.props.input,foodBusinessList}
        this.props.changeEnterprise(input);
    }
    changeInput=(value,option,index)=>{
        
        let foodBusinessList = this.props.input.foodBusinessList||[];
        foodBusinessList[index][option] = value;
        let input = {...this.props.input,foodBusinessList}
         this.props.changeEnterprise(input)

        // if(FoodBusiness.filter((item)=>{item.key=1}).length == 1){

        //     FoodBusiness.filter((item)=>{item.key=1})[option]=value;
        //     let input = {...this.props.input,FoodBusiness}
        //     this.props.changeEnterprise(input);
        // }else{

        //     FoodBusiness.push({key:1,[option]:value})
        //     let input = {...this.props.input,FoodBusiness}
        //     this.props.changeEnterprise(input)
        // }
       
    }
    
    render() {

        const checkStatus = this.props.type=='detail'?true:false;
        const foodBusinessList = this.props.input.foodBusinessList||[]
        const index =this.props.index
        const formData =foodBusinessList[index]||{}
        return (
            <div>
                {/* 许可证信息 */}
                <table>
                    <tbody>
                    <tr>
                        <td>经营者名称</td>
                        <td colSpan={3}><Input value={formData.businessName} onChange={(e)=>this.changeInput(e.target.value,"businessName",index)} placeholder={"请输入经营者名称"} disabled={checkStatus}/></td>
                       
                    </tr>
                    <tr>
                        <td>经营场所</td>
                        <td colSpan={3}><Input value={formData.businessAddress} onChange={(e)=>this.changeInput(e.target.value,"businessAddress",index)} placeholder={"请输入企业住所或经营场所地址"} disabled={checkStatus}/></td>
                    </tr>
                    <tr>
                        <td>许可证号<span style={{color:'#FF3300'}}>*</span></td>
                        <td colSpan={3}><Input value={formData.number} onChange={(e)=>this.changeInput(e.target.value,"number",index)} placeholder={"请输入证号"} disabled={checkStatus}/></td>
                    </tr>
                    <tr>
                        <td>主体业态<span style={{color:'#FF3300'}}>*</span></td>
                        <td ><Select placeholder="请选择主体业态" value={formData.businessFormat} onChange={(value)=>this.changeInput(value,"businessFormat",index)}  disabled={checkStatus} >
                            <Option value="餐饮服务经营者">餐饮服务经营者</Option>
                            <Option value="餐饮服务经营者(连锁)">餐饮服务经营者(连锁)</Option>
                            <Option value="餐饮服务经营者(非连锁)">餐饮服务经营者(非连锁)</Option>
                            <Option value="单位食堂">单位食堂</Option>
                            <Option value="食品销售经营者">食品销售经营者</Option>
                            <Option value="食品销售经营者(连锁)">食品销售经营者(连锁)</Option>
                            <Option value="食品销售经营者(非连锁)">食品销售经营者(非连锁)</Option>
                            </Select>
                        </td>
                        <td>经营类别</td>
                        <td ><Select placeholder={"请选择类别"} value={formData.category} onChange={(value)=>this.changeInput(value,"category",index)} disabled={checkStatus} >
                        {this.state.categoryList.map((item)=>(<Option value={item.name}>{item.name}</Option>))}
                            </Select>
                        </td>
                    </tr>
                    <tr>
                        <td>主体业态备注</td>
                        <td colSpan={3} style={{textAlign:'left'}}>
                            <Checkbox.Group  style={{width:'100%'}} value={formData.businessNotes?formData.businessNotes.split(','):[]}
                            onChange={(value)=>this.onCheckChange(value,'businessNotes',index)} disabled={checkStatus}>
                                <Checkbox style={{marginLeft:8}} value={'餐饮服务营业者（中央厨房）'}>餐饮服务营业者（中央厨房）</Checkbox>
                                <Checkbox value={'餐饮服务营业者（集体用餐配送）'}>餐饮服务营业者（集体用餐配送）</Checkbox>
                                <Checkbox value={'是否网络经营'}>是否网络经营</Checkbox>
                            </Checkbox.Group></td>
                    </tr>
                    <tr>
                        <td >经营项目</td>
                        <td colSpan={3}><TextArea placeholder="请填写经营项目" value={formData.businessProject} onChange={(e)=>this.changeInput(e.target.value,"businessProject",index)} rows={5}  disabled={checkStatus}/></td>
                       
                    </tr>
                    <tr>
                        <td>有效期自</td>
                        <td><DatePicker style={{width:'100%'}}
                            disabled={checkStatus}
                            value={formData.startTime==null?null:moment(formData.startTime)}
                            onChange={(date)=>this.changeStartTime(date,'startTime',index)}
                            showTime={true} placeholder="请选择开始时间" format="YYYY-MM-DD"/></td>
                        <td>发证日期</td>
                        <td><DatePicker style={{width:'100%'}}
                            disabled={checkStatus}
                            value={formData.giveTime==null?null:moment(formData.giveTime)}
                            onChange={(date)=>this.changeInput(date,'giveTime',index)}
                            showTime={true} placeholder="请选择发证时间" format="YYYY-MM-DD"/></td>
                    </tr>
                    <tr>
                        <td>有效期至</td>
                        <td><DatePicker
                            style={{width:'100%'}}
                            disabled={checkStatus}
                            value={formData.endTime==null?null:moment(formData.endTime)}
                            onChange={(date)=>this.changeInput(date,'endTime',index)}
                            showTime={true} placeholder="请输入有效期" format="YYYY-MM-DD"/></td>
                        <td>发证机关</td>
                        <td><Select placeholder={"请选择发证机关"} value={formData.licenseAuthority} style={{width:"100%"}}
                            onChange={(value)=>this.changeInput(value,"licenseAuthority",index)}  disabled={checkStatus}>
                                {this.state.licenceList.map((item)=>(<Option value={item.name}>{item.name}</Option>))}
                            </Select></td>
                    </tr>
                    </tbody>
                </table>
            {/* 检查及评定 */}
            
                <div className='commonEnterpriseBoxHead'>检查及评定</div>
                <table>
                
                    <Checkbox.Group  style={{width:'100%'}} value={formData.checkType?formData.checkType.split(','):[]}
                            onChange={(value)=>this.onCheckChange(value,'checkType',index)} disabled={checkStatus}>
                    <tbody>
                    <tr>
                        <td rowSpan={2} style={{width:'10%'}}>检查归类<span style={{color:'#FF3300'}}>*</span></td>
                        <td><img src={require("./imgs/u823.png")} style={{height:'8%'}} alt=""/></td>
                        <td style={{width:'30%',textAlign:"left"}}><Checkbox value={"餐饮服务"} >餐饮服务</Checkbox></td>
                        <td><img src={require("./imgs/u831.png")} style={{height:'8%'}} alt=""/> </td>
                        <td style={{width:'30%',textAlign:"left"}}><Checkbox value={"食品流通"} >食品流通</Checkbox> </td>
                        <td><img src={require("./imgs/u835.png")} style={{height:'8%'}} alt=""/> </td>
                        <td style={{width:'30%',textAlign:"left"}}><Checkbox value={"保健品经营"}>保健品经营</Checkbox> </td> 
                    </tr>
                    <tr>
                        <td><img src={require("./imgs/u829.png")} style={{height:'8%'}} alt=""/> </td>
                        <td style={{textAlign:"left"}}><Checkbox value={"学校食堂"}>学校食堂</Checkbox></td>
                        <td><img src={require("./imgs/u839.png")} style={{height:'8%'}} alt=""/> </td>
                        <td style={{textAlign:"left"}}><Checkbox value={"婴幼儿配方奶粉"}>婴幼儿配方奶粉</Checkbox> </td>
                    </tr>
                    </tbody>
                    </Checkbox.Group>
                
                </table>

                <table style={{marginTop:-6}}>
                   <tbody>
                    <tr>
                        <td style={{width:'10%'}}>动态等级</td>
                        <td style={{width:'40%'}}><Radio.Group style={{float:"left"}} value={formData.dynamicGrade} onChange={(e)=>this.changeInput(e.target.value,"dynamicGrade",index)} disabled={checkStatus}>
                            <Radio value={"A"}><img src={require("./imgs/S.png")} width={20} alt="" /></Radio>
                            <Radio value={"B"}><img src={require("./imgs/A.png")} width={20} alt="" /></Radio>
                            <Radio value={"C"}><img src={require("./imgs/B.png")} width={20} alt="" /></Radio>
                            <Radio value={"未评定"}>未评定</Radio>
                            </Radio.Group>
                        </td>
                        <td style={{width:'10%'}}>年终评定</td>
                        <td style={{width:'40%'}}>
                            <Select placeholder={"请选择年终评定"} value={formData.yearAssessment} style={{width:"100%"}}onChange={(value)=>this.changeInput(value,"yearAssessment",index)} disabled={checkStatus}>
                            <Option value="优秀">优秀</Option>
                            <Option value="良好">良好</Option>
                            <Option value="一般">一般</Option>
                            <Option value="差">差</Option>
                           </Select>
                        </td>
                    </tr>
                    <tr>
                        <td>监管巡查频次</td>
                        <td ><Select placeholder="请选择巡查频次" value={formData.patrolFrequency} style={{width:"100%"}}onChange={(value)=>this.changeInput(value,"patrolFrequency",index)} disabled={checkStatus}>
                            <Option value="一次">一次</Option>
                            <Option value="二次">二次</Option>
                            <Option value="三次">三次</Option>
                            <Option value="四次">四次</Option>
                            </Select>
                        </td>
                        <td>企业规模</td>
                        <td ><Select placeholder={"请选择企业规模"} value={formData.enterpriseScale} style={{width:"100%"}}onChange={(value)=>this.changeInput(value,"enterpriseScale",index)} disabled={checkStatus}>
                            <Option value="特大型">特大型</Option>
                            <Option value="大型">大型</Option>
                            <Option value="中型">中型</Option>
                            <Option value="小型">小型</Option>
                            <Option value="小型">微型</Option>
                           </Select>
                        </td>
                    </tr>
                    </tbody>
                </table>
        </div>
            
        )
    }
}
export default FoodBusiness;

