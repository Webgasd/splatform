import React,{Component} from 'react';
import {Select,Input,Radio,DatePicker} from 'antd';
import connect from "react-redux/es/connect/connect";
import {changeEnterprise} from "../../../../redux/action";
import axios from "../../../../axios";


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
        let FoodBusiness = this.props.input.FoodBusiness||{};
        FoodBusiness[option]=value;
        let input = {...this.props.input,FoodBusiness}
        this.props.changeEnterprise(input);
    }
    
    render() {
        const formData=this.props.input||{};
        const checkStatus = this.props.type=='detail'?true:false;
        return (
            <div>
                {/* 许可证信息 */}
                <table>
                    <tbody>
                    <tr>
                        <td>经营者名称</td>
                        <td colSpan={3}><Input disabled={checkStatus}/></td>
                       
                    </tr>
                    <tr>
                        <td>经营场所</td>
                        <td colSpan={3}><Input disabled={checkStatus}/></td>
                    </tr>
                    <tr>
                        <td>许可证号<span style={{color:'#FF3300'}}>*</span></td>
                        <td colSpan={3}><Input placeholder={"请填写许可证号"} disabled={checkStatus}/></td>
                    </tr>
                    <tr>
                        <td>主体业态<span style={{color:'#FF3300'}}>*</span></td>
                        <td ><Select  disabled={checkStatus} >
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
                        <td ><Select  disabled={checkStatus} >
                            <Option value="1">1</Option>
                            <Option value="2">2</Option>
                            <Option value="3">3</Option>
                            </Select>
                        </td>
                    </tr>
                    <tr>
                        <td>主体业态备注</td>
                        <td colSpan={3}><Radio.Group  disabled={checkStatus}>
                            <Radio value={"A"}>通过网络经营</Radio>
                            <Radio value={"B"}>建立中央厨房</Radio>
                            <Radio value={"C"}>从事集体用餐配送</Radio>
                            </Radio.Group></td>
                    </tr>
                    <tr>
                        <td>经营项目</td>
                        <td><Input disabled={checkStatus}/></td>
                       
                    </tr>
                    <tr>
                        <td>营业期限自</td>
                        <td><DatePicker style={{width:'100%'}} showTime placeholder="开始日期"/></td>
                        <td>发证日期</td>
                        <td><DatePicker style={{width:'100%'}} showTime /></td>
                    </tr>
                    <tr>
                        <td>有效期至</td>
                        <td><DatePicker style={{width:'100%'}} showTime /></td>
                        <td>发证机关</td>
                        <td><Input/></td>
                    </tr>
                    <tr>
                        <td>培训情况</td>
                        <td colSpan={5}><TextArea rows={3} value={formData.spTraining} onChange={(e)=>this.changeInput(e.target.value,"spTraining")} placeholder={"请输入培训情况"} disabled={checkStatus}/></td>
                    </tr>
                    </tbody>
                </table>
            {/* 检查及评定 */}
            
                <div className='commonEnterpriseBoxHead'>检查及评定</div>
                <table>
                    <tbody>
                    <tr>
                        <td rowSpan={2}>检查归类<span style={{color:'#FF3300'}}>*</span></td>
                        <td><img src={require("./imgs/u823.png")} style={{height:'8%'}} alt=""/> </td>
                        <td><Radio value={"A"} style={{float:"left"}}>餐饮服务</Radio></td>
                        <td><img src={require("./imgs/u831.png")} style={{height:'8%'}} alt=""/> </td>
                        <td><Radio value={"A"} style={{float:"left"}}>食品流通</Radio> </td>
                        <td><img src={require("./imgs/u835.png")} style={{height:'8%'}} alt=""/> </td>
                        <td><Radio value={"A"} style={{float:"left"}}>保健品经营</Radio> </td> 
                    </tr>
                    <tr>
                        
                        <td><img src={require("./imgs/u829.png")} style={{height:'8%'}} alt=""/> </td>
                        <td><Radio value={"A"}  style={{float:"left"}}>学校食堂</Radio></td>
                        <td><img src={require("./imgs/u839.png")} style={{height:'8%'}} alt=""/> </td>
                        <td><Radio value={"A"}  style={{float:"left"}}>婴幼儿配方奶粉</Radio> </td>
                    </tr>
                    <tr>
                        <td>动态等级</td>
                        <td colSpan={3}><Radio.Group value={formData.dynamicGrade} onChange={(e)=>this.changeInput(e.target.value,"dynamicGrade")} disabled={checkStatus}>
                            <Radio value={"A"}><img src={require("./imgs/S.png")} width={20} alt="" /></Radio>
                            <Radio value={"B"}><img src={require("./imgs/A.png")} width={20}alt="" /></Radio>
                            <Radio value={"C"}><img src={require("./imgs/B.png")} width={20}alt="" /></Radio>
                        </Radio.Group></td>
                        <td>年终评定</td>
                        <td colSpan={2}>
                            <Select placeholder={"请选择年终评定"} value={formData.yearAssessment} style={{width:"100%"}}onChange={(value)=>this.changeYearAssessment(value,"yearAssessment")} disabled={checkStatus}>
                            <Option value="A">优秀</Option>
                            <Option value="B">良好</Option>
                            <Option value="C">一般</Option>
                            <Option value="D">差</Option>
                           </Select>
                        </td>
                    </tr>
                   
                    <tr>
                        <td>检查频次</td>
                        <td colSpan={3}><Select  disabled={checkStatus} >
                            <Option value="一次">一次</Option>
                            <Option value="二次">二次</Option>
                            <Option value="三次">三次</Option>
                            <Option value="四次">四次</Option>
                           
                            </Select>
                        </td>
                        <td>企业规模</td>
                        <td colSpan={2}><Select placeholder={"请选择企业规模"} value={formData.enterpriseScale} style={{width:"100%"}}onChange={(value)=>this.changeInput(value,"enterpriseScale")} disabled={checkStatus}>
                            <Option value="超大">超大</Option>
                            <Option value="大型">大型</Option>
                            <Option value="中型">中型</Option>
                            <Option value="小型">小型</Option>
                            <Option value="小型">微型</Option>
                           </Select></td>
                    </tr>
                    </tbody>
                </table>
           
        </div>
            
        )
    }
}
export default FoodBusiness;

