import React,{Component} from 'react';
import {Select, Input,Icon, Radio, Modal,TreeSelect,DatePicker, Checkbox} from 'antd';
import connect from "react-redux/es/connect/connect";
import {changeEnterprise} from "../../../redux/action";
import Utils from './../../../utils';
import './style.less'
import SupervisorForm from "./childrenForm/supervisorForm";
import axios from "../../../axios";
import moment from 'moment'
const Option = Select.Option;
const TreeNode = TreeSelect.TreeNode;
const { TextArea } = Input;
@connect(
    state=>({
        input:state.enterprise,
        areaList:state.areaList
    }),
    {
        changeEnterprise,
    }
)
class BasicMsg extends Component{
    state={selectedList:[],gridTree:this.props.areaList}
    componentDidMount() {
        this.requestDeptGrid();
    }
    requestDeptGrid=()=>{
        axios.ajax({
            url:'/supervision/enterprise/getDeptAndGrid',
            data:{
                params:{}
            }
        }).then((res)=>{
            if(res.status == "success"){
                this.setState({
                    deptTree: res.data.deptTree
                })
            }
        })
    }

    loadGridData=()=>new Promise(resolve =>{
        axios.ajax({
            url:'/sys/area/getGridByArea',
            data:{
                params:{
                    id:this.props.input.area
                }
            }
        }).then((res)=>{
            if(res.status == "success"){
                this.setState({
                    gridTree:res.data
                })
                resolve();
            }
        })
    })

  

    changeInput=(value,option)=>{
        let input = {...this.props.input,[option]:value}
        this.props.changeEnterprise(input);
    }
    
   
        

    
    // changeYearAssessment=(value,option)=>{
    //     let configs={'A':'一次','B':'两次','C':'三次','D':'四次','不评定':'一次'}
    //     let input = {...this.props.input,[option]:value,patrolFrequency:configs[value]}
    //     this.props.changeEnterprise(input);
    // }
    // onCheckChange=(value,option)=>{
    //     this.setState({
    //         msgIndex:value[value.length-1]
    //     })
    //     this.changeInput(value.join(','),option)
    // }
    renderTreeNodes =(data)=>{
        return data.map((item) => {
                if (item.childrenList.length) {
                    return <TreeNode title={item.name} value={item.id} key={item.id}>
                            {this.renderTreeNodes(item.childrenList)}
                        </TreeNode>
                }else {
                    return <div></div>
                }
            });
    }
    renderGridNodes = data =>
        data.map(item => {
            if (item.childrenList) {
                return (
                    <TreeNode title={item.name} value={item.id} key={item.id} dataRef={item}>
                        {this.renderGridNodes(item.childrenList)}
                    </TreeNode>
                );
            }
            return <TreeNode title={item.name} value={item.id} key={item.id} dataRef={item}/>;
        });
    
    
    render() {
        const formData=this.props.input||{};
        
        const checkStatus = this.props.type=='detail'?true:false;
        return (
            <div>
            <div className='commonEnterpriseBox' style={{marginTop:20}}>
                <div className='permission-title-text'>企业基本信息</div>
                <table>
                    <tbody>
                    <tr>
                        <td>市场主体名称<span style={{color:'#FF3300'}}>*</span></td>
                        <td colSpan={3}><Input placeholder={"请输入企业名称"} value={formData.enterpriseName} onChange={(e)=>this.changeInput(e.target.value,"enterpriseName")} disabled={checkStatus}/></td>
                    </tr>
                    <tr>
                        <td>店招名称</td>
                        <td><Input  value={formData.shopName} onChange={(e)=>this.changeInput(e.target.value,"shopName")} placeholder={"请输入店招名称"} disabled={checkStatus}/></td>
                        <td>主体分类<span style={{color:'#FF3300'}}>*</span></td>
                        <td><Select placeholder={"请选择企业规模"} value={formData.operationMode} style={{width:"100%"}}onChange={(value)=>this.changeInput(value,"operationMode")} disabled={checkStatus}>
                            <Option value="个体经营户">个体经营户</Option>
                            <Option value="国有企业">国有企业</Option>
                            <Option value="有限责任公司">有限责任公司</Option>
                            <Option value="合伙经营">合伙经营</Option>
                            <Option value="事业单位">事业单位</Option>
                            <Option value="其他">其他</Option>


                           </Select></td>
                    </tr>
                    <tr>
                        <td>统一信用代码<span style={{color:'#FF3300'}}>*</span></td>
                        <td><Input value={formData.idNumber} onChange={(e)=>this.changeInput(e.target.value,"idNumber")} placeholder={"请输入社会信用代码"} disabled={checkStatus}/></td>
                        <td>注册资本</td>
                        <td><Input value={formData.fixedAssets} onChange={(e)=>this.changeInput(e.target.value,"fixedAssets")} placeholder={"请输入注册资本"} disabled={checkStatus}/></td>
                    </tr>
                    <tr>
                        <td>住所/经营场所<span style={{color:'#FF3300'}}>*</span></td>
                        <td colSpan={3}><Input value={formData.registeredAddress} onChange={(e)=>this.changeInput(e.target.value,"registeredAddress")} placeholder={"请输入企业住所或经营场所地址"} disabled={checkStatus}/></td>
                    </tr>
                    <tr>
                        <td>法定代表人<span style={{color:'#FF3300'}}>*</span></td>
                        <td><Input value={formData.legalPerson} onChange={(e)=>this.changeInput(e.target.value,"legalPerson")} placeholder={"请输入法人名称"} disabled={checkStatus}/></td>
                        
                        <td>证件号码</td>
                        <td><Input value={formData.ipIdNumber} onChange={(e)=>this.changeInput(e.target.value,"ipIdNumber")} placeholder={"请输入负责人证件号码"} disabled={checkStatus}/></td>
                    </tr>
                    <tr>
                        <td>负责人/联系人</td>
                        <td><Input value={formData.cantacts} onChange={(e)=>this.changeInput(e.target.value,"cantacts")} placeholder={"请输入负责人/联系人姓名"} disabled={checkStatus}/></td>
                        <td>联系电话</td>
                        <td ><Input value={formData.cantactWay}  onChange={(e)=>this.changeInput(e.target.value,"cantactWay")} placeholder={"请输入联系方式"} disabled={checkStatus}/></td>
                    </tr>
                    <tr>
                        <td>营业期限自</td>
                        <td><Input value={formData.businessTermStart}  onChange={(e)=>this.changeInput(e.target.value,"businessTermStart")} placeholder={"开始日期(例:1900年01月01日)"} disabled={checkStatus}/></td>
                        <td>营业期限至</td>
                        <td><Input value={formData.businessTermEnd}  onChange={(e)=>this.changeInput(e.target.value,"businessTermEnd")} placeholder={"请输入截至日期,不填则默认:长期"} style={{width:'74%'}} disabled={checkStatus}/>
                        {/* 下面的radio还有问题 */}
                            <Checkbox checked={formData.businessTermEnd?false:true} style={{marginLeft:2}} disabled={checkStatus}>默认:长期</Checkbox>
                        </td>
                    </tr>
                    <tr>
                        <td>发证日期</td> 
                        <td><DatePicker style={{width:'100%'}} value={formData.givenDate==null?null:moment(formData.givenDate)} onChange={(value)=>this.changeInput(value,"givenDate")} placeholder="请选择发证日期"format="YYYY-MM-DD" disabled={checkStatus}/></td>
                        <td>登记机关</td>
                        <td ><Input value={formData.givenGov}  onChange={(e)=>this.changeInput(e.target.value,"givenGov")} placeholder={"请输入登记机关"} disabled={checkStatus}/></td>
                    </tr>
                    <tr>
                        <td>经营范围</td>
                        <td colSpan={3}><TextArea value={formData.businessScale}  onChange={(e)=>this.changeInput(e.target.value,"businessScale")} style={{height:100}} placeholder={"请输入登记范围"} disabled={checkStatus}/></td>
                    </tr>
                    </tbody>
                </table>
            </div>
            <div className='commonEnterpriseBox' style={{marginTop:20}}>
                <div className='permission-title-text'>企业监管信息</div>
                <table>
                    <tbody>
                    <tr>
                        <td>所属地区<span style={{color:'#FF3300'}}>*</span></td>
                        <td><TreeSelect placeholder={"请选择所属地区"} value={formData.area} style={{width:"100%"}}onChange={(value)=>this.changeInput(value,"area")} disabled={checkStatus}>
                            {this.renderTreeNodes(this.props.areaList||[])}
                           </TreeSelect></td>
                        <td>视频亮化情况</td>
                        <td><Select placeholder="请选择明厨改造类型" value={formData.transformationType} style={{width:"100%"}}onChange={(value)=>this.changeInput(value,"transformationType")} disabled={checkStatus}>
                        <Option value="未实现视频亮化">未实现视频亮化</Option>
                        <Option value="明厨亮灶">明厨亮灶</Option>
                        <Option value="透明玻璃">透明玻璃</Option>
                        <Option value="车间亮化">车间亮化</Option>
                        </Select></td>
                    </tr>
                    <tr>
                        <td>日常监管机构</td>
                        <td><TreeSelect value={formData.regulators} onChange={(value)=>this.changeInput(value,"regulators")} placeholder={"请选择日常监管责任机构"} disabled={checkStatus}>
                            {Utils.renderTreeNodes(this.state.deptTree||[])}
                        </TreeSelect></td>
                        <td>日常监管负责人</td>
                        <td><Input value={formData.supervisor}  disabled={checkStatus?true:(formData.regulators?false:true)} onClick={()=>this.setState({isVisible:true,personType:'supervisor'})} placeholder={"请选择日常监管负责人"} suffix={<Icon type="search" />}/></td>
                    </tr>
                    <tr>
                        <td>所属网格</td>
                        <td><TreeSelect value={formData.grid} onFocus={(treeNode)=>this.loadGridData(treeNode)} disabled={checkStatus?true:(formData.area?false:true)} onChange={(value)=>this.changeInput(value,"grid")} placeholder={"请选择所属网格"}>
                            {this.renderGridNodes(this.state.gridTree||[])}
                            </TreeSelect></td>
                        <td>网格人员</td>
                        <td ><Input value={formData.gridPerson} disabled={checkStatus?true:(formData.grid?false:true)} onClick={()=>this.setState({isVisible:true,personType:'gridPerson'})} placeholder={"请选择网格人员"} suffix={<Icon type="search" />}/></td>
                    </tr>
                    <tr>
                        <td>企业经营状态</td>
                        <td colSpan={1}><Radio.Group value={formData.businessState} onChange={(e)=>this.changeInput(e.target.value,"businessState")} style={{width:"100%"}} disabled={checkStatus}>
                            <Radio value={1} style={{color:'RGB(179, 204, 0)'}}>新增</Radio>
                            <Radio value={2} style={{color:'red'}}>正常</Radio>
                            <Radio value={3} style={{color:'blue'}}>异常</Radio>
                           </Radio.Group>
                        </td>
                        <td>企业信用等级</td>
                        <td colSpan={1}><Select value={formData.integrityLevel} onChange={(value)=>this.changeInput(value,"integrityLevel")} placeholder="请选择信用等级" style={{width:"100%"}} disabled={checkStatus}>
                            <Option value="AAA">AAA</Option>
                            <Option value="AA">AA</Option>
                            <Option value="A">A</Option>
                            <Option value="BBB">BBB</Option>
                            <Option value="BB">BB</Option>
                            <Option value="B">B</Option>
                            <Option value="CCC">CCC</Option>
                            <Option value="CC">CC</Option>
                            <Option value="C">C</Option>
                            <Option value="D">D</Option>
                           </Select></td>
                        {/* <td colSpan={2}><Select value={formData.abnormalContent} onChange={(value)=>this.changeInput(value,"abnormalContent")} placeholder="请选择经营异常情形" style={{width:"100%"}} disabled={checkStatus}>
                            <Option value="通过登记的住所(经营场所)无法联系">通过登记的住所(经营场所)无法联系</Option>
                            <Option value="未按规定公示应当公示的信息">未按规定公示应当公示的信息</Option>
                            <Option value="公示企业信息隐瞒真实情况弄虚作假">公示企业信息隐瞒真实情况弄虚作假</Option>
                            <Option value="多种异常情形未处理，记录始终存在">多种异常情形未处理，记录始终存在</Option>
                            <Option value="企业已注销/倒闭">企业已注销/倒闭</Option>
                            <Option value="未遵守相关安全协议(暂停账户使用)">未遵守相关安全协议(暂停账户使用)</Option>
                           </Select></td> */}
                    </tr>
                    </tbody>
                </table>   
                    
            </div> 
            
                <Modal
                    width='800px'
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
                        deptId={this.state.personType=='supervisor'?this.props.input.regulators:''}
                        gridId={this.state.personType=='gridPerson'?this.props.input.grid:null}
                        selectedList={this.state.selectedList}
                        dispatchSupervisor={(data)=>{
                        this.setState({selectedList:data})}}/>
                </Modal>
            </div>
        )
    }
}
export default BasicMsg;