import React,{Component} from 'react';
import {Select, Input,Icon, Radio, Modal,TreeSelect} from 'antd';
import FoodBusiness from "./license/FoodBusiness";
import FoodCommon from './license/FoodCommon';
import FoodCirculate from './license/FoodCirculate';
import FoodProduce from './license/FoodProduce';
import DrugsBusiness from './license/DrugsBusiness';
import MedicalUse from './license/MedicalUse';
import CosmeticsUse from './license/CosmeticsUse';
import connect from "react-redux/es/connect/connect";
import {changeEnterprise} from "../../../redux/action";
import Utils from './../../../utils';
import MarkS from './img/S.png';
import MarkA from './img/A.png';
import MarkB from './img/B.png';
import './style.less'
import SupervisorForm from "./childrenForm/supervisorForm";
import axios from "../../../axios";
const Option = Select.Option;
const TreeNode = TreeSelect.TreeNode;
@connect(
    state=>({
        input:state.enterprise,
        industryList:state.industryList,
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

    
    
    changeYearAssessment=(value,option)=>{
        let configs={'A':'一次','B':'两次','C':'三次','D':'四次','不评定':'一次'}
        let input = {...this.props.input,[option]:value,patrolFrequency:configs[value]}
        this.props.changeEnterprise(input);
    }
   
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


    changeInput=(value,option)=>{
        let input = {...this.props.input,[option]:value}
        this.props.changeEnterprise(input);
    }
    changeMsgIndex(index){
        this.setState({
            msgIndex:index
        })
    }
    onCheckChange=(value,option)=>{
        this.setState( (prevState) => ({
            msgIndex:value[value.length-1]
            }), () => { console.log("value.length："+value.length,"value:"+value,"msgIndex:"+this.state.msgIndex) 
            })

        this.changeInput(value.join(','),option)
    }

    getContent =()=>{console.log("getContent执行")
        let data;
        if(!this.state.msgIndex){console.log("执行 if(!this.state.msgIndex)")
            let permissionType=this.props.input.permissionType||'';
            data = permissionType.split(',')[0];

            if(data){console.log("data"+data)
                this.setState({
                    msgIndex: data
                })
            }
            return;
        }
        switch (this.state.msgIndex) {
            case 'foodBusiness':
                return <FoodBusiness type={this.props.type}/>
            case 'foodCommon':
                return <FoodCommon type={this.props.type}/>
            case 'foodCirculate':
                return <FoodCirculate type={this.props.type}/>
            case 'foodProduce':
                return <FoodProduce type={this.props.type}/>
            case 'drugsBusiness':
                return <DrugsBusiness type={this.props.type}/>
            case 'medicalUse':
                return <MedicalUse type={this.props.type}/>
            case 'cosmeticsUse':
                return <CosmeticsUse type={this.props.type}/>
        }
    }
    render() {
        const formData=this.props.input||{};
        const checkStatus = this.props.type=='detail'?true:false;
       
        return (
            <div>
            <div className='commonEnterpriseBox'>
                <div className='commonEnterpriseBoxHead'>企业基本信息</div>
                <table>
                    <tbody>
                    <tr>
                        <td>企业名称<span style={{color:'#FF3300'}}>*</span></td>
                        <td colSpan={5}><Input placeholder={"请输入企业名称"} value={formData.enterpriseName} onChange={(e)=>this.changeInput(e.target.value,"enterpriseName")} disabled={checkStatus}/></td>
                    </tr>
                    <tr>
                        <td>店招名称</td>
                        <td colSpan={3}><Input value={formData.shopName} onChange={(e)=>this.changeInput(e.target.value,"shopName")} placeholder={"请输入店招名称"} disabled={checkStatus}/></td>
                        <td>邮政编码</td>
                        <td><Input value={formData.postalCode} onChange={(e)=>this.changeInput(e.target.value,"postalCode")} placeholder={"请输入邮政编码"} disabled={checkStatus}/></td>
                    </tr>
                    <tr>
                        <td>注册地址<span style={{color:'#FF3300'}}>*</span></td>
                        <td colSpan={5}><Input value={formData.registeredAddress} onChange={(e)=>this.changeInput(e.target.value,"registeredAddress")} placeholder={"请输入注册地址"} disabled={checkStatus}/></td>
                    </tr>
                    <tr>
                        <td>生产经营地址<span style={{color:'#FF3300'}}>*</span></td>
                        <td colSpan={5}><Input value={formData.businessAddress} onChange={(e)=>this.changeInput(e.target.value,"businessAddress")} placeholder={"请输入生产经营地址"} disabled={checkStatus}/></td>
                    </tr>
                    <tr>
                        <td>法人/负责人<span style={{color:'#FF3300'}}>*</span></td>
                        <td><Input value={formData.legalPerson} onChange={(e)=>this.changeInput(e.target.value,"legalPerson")} placeholder={"请输入法人/负责人"} disabled={checkStatus}/></td>
                        <td>社会信用代码(身份证号)<span style={{color:'#FF3300'}}>*</span></td>
                        <td><Input value={formData.idNumber} onChange={(e)=>this.changeInput(e.target.value,"idNumber")} placeholder={"请输入社会信用代码"} disabled={checkStatus}/></td>
                        <td>营业执照注册号</td>
                        <td><Input value={formData.licenseNumber} onChange={(e)=>this.changeInput(e.target.value,"licenseNumber")} placeholder={"请输入营业执照注册号"} disabled={checkStatus}/></td>
                    </tr>
                    <tr>
                        <td>联系人<span style={{color:'#FF3300'}}>*</span></td>
                        <td><Input value={formData.cantacts} onChange={(e)=>this.changeInput(e.target.value,"cantacts")} placeholder={"请输入联系人"} disabled={checkStatus}/></td>
                        <td>联系方式<span style={{color:'#FF3300'}}>*</span></td>
                        <td><Input value={formData.cantactWay}  onChange={(e)=>this.changeInput(e.target.value,"cantactWay")} placeholder={"请输入联系方式"} disabled={checkStatus}/></td>
                        <td>日常监管责任机构</td>
                        <td><TreeSelect value={formData.regulators} onChange={(value)=>this.changeInput(value,"regulators")} placeholder={"请选择机构"} disabled={checkStatus}>
                            {Utils.renderTreeNodes(this.state.deptTree||[])}
                        </TreeSelect></td>
                    </tr>
                    <tr>
                        <td>所属地区<span style={{color:'#FF3300'}}>*</span></td>
                        <td><TreeSelect placeholder={"请选择所属地区"} value={formData.area} style={{width:"100%"}}onChange={(value)=>this.changeInput(value,"area")} disabled={checkStatus}>
                            {this.renderTreeNodes(this.props.areaList||[])}
                           </TreeSelect></td>
                        <td>所属网格</td>
                        <td><TreeSelect value={formData.grid} onFocus={(treeNode)=>this.loadGridData(treeNode)} disabled={checkStatus?true:(formData.area?false:true)} onChange={(value)=>this.changeInput(value,"grid")} placeholder={"请选择网格"}>
                            {this.renderGridNodes(this.state.gridTree||[])}
                        </TreeSelect></td>
                        <td>日常监管责任人员</td>
                        <td><Input value={formData.supervisor}  disabled={checkStatus?true:(formData.regulators?false:true)} onClick={()=>this.setState({isVisible:true,personType:'supervisor'})} placeholder={"请选择监管人员"} suffix={<Icon type="search" />}/></td>
                    </tr>
                    <tr>
                        <td>企业规模<span style={{color:'#FF3300'}}>*</span></td>
                        <td><Select placeholder={"请选择企业规模"} value={formData.enterpriseScale} style={{width:"100%"}}onChange={(value)=>this.changeInput(value,"enterpriseScale")} disabled={checkStatus}>
                            <Option value="超大">超大</Option>
                            <Option value="大型">大型</Option>
                            <Option value="中型">中型</Option>
                            <Option value="小型">小型</Option>
                           </Select></td>
                        <td>网格人员</td>
                        <td colSpan={3}><Input value={formData.gridPerson} disabled={checkStatus?true:(formData.grid?false:true)} onClick={()=>this.setState({isVisible:true,personType:'gridPerson'})} placeholder={"请选择网格人员"} suffix={<Icon type="search" />}/></td>
                    </tr>
                    <tr>
                        <td>动态等级</td>
                        <td><Radio.Group className="zRaidoGroup" value={formData.dynamicGrade} onChange={(e)=>this.changeInput(e.target.value,"dynamicGrade")} disabled={checkStatus}>
                            <Radio value={"A"}><img src={MarkS} width={20}/></Radio>
                            <Radio value={"B"}><img src={MarkA} width={20}/></Radio>
                            <Radio value={"C"}><img src={MarkB} width={20}/></Radio>
                        </Radio.Group></td>
                        <td>年终评定</td>
                        <td>
                        <Select placeholder={"请选择年终评定"} value={formData.yearAssessment} style={{width:"100%"}}onChange={(value)=>this.changeYearAssessment(value,"yearAssessment")} disabled={checkStatus}>
                            <Option value="A">A</Option>
                            <Option value="B">B</Option>
                            <Option value="C">C</Option>
                            <Option value="D">D</Option>
                            <Option value="不评定">不评定</Option>
                           </Select>
                        </td>
                        <td>Email</td>
                        <td><Input value={formData.email} onChange={(e)=>this.changeInput(e.target.value,"email")} placeholder={"请输入Email"} disabled={checkStatus}/></td>
                    </tr>
                    <tr>
                        <td>办公固话</td>
                        <td><Input value={formData.officePhone} onChange={(e)=>this.changeInput(e.target.value,"officePhone")} placeholder={"请输入办公固话"} disabled={checkStatus}/></td>
                        <td>巡查频次</td>
                        <td><Select placeholder="请选择巡查频次" value={formData.patrolFrequency} style={{width:"100%"}}onChange={(value)=>this.changeInput(value,"patrolFrequency")} disabled={checkStatus}>
                            <Option value="一次">一次</Option>
                            <Option value="两次">两次</Option>
                            <Option value="三次">三次</Option>
                            <Option value="四次">四次</Option>
                            <Option value="五次">五次</Option>
                           </Select></td>
                        <td>明厨亮灶改造类型</td>
                        <td><Select placeholder="请选择明厨改造类型" value={formData.transformationType} style={{width:"100%"}}onChange={(value)=>this.changeInput(value,"transformationType")} disabled={checkStatus}>
                            <Option value="视频">视频</Option>
                            <Option value="玻璃">玻璃</Option>
                            <Option value="未实现明厨亮化">未实现明厨亮化</Option>
                            <Option value="车间亮化">车间亮化</Option>
                           </Select></td>
                    </tr>
                    <tr>
                        <td>许可证状态</td>
                        <td colSpan={5}><Radio.Group value={formData.permissionState} style={{width:"100%"}}onChange={(e)=>this.changeInput(e.target.value,"permissionState")} disabled={checkStatus} >
                            <Radio value={"正常"}>正常</Radio>
                            <Radio value={"延续"}>延续</Radio>
                            <Radio value={"变更"}>变更</Radio>
                            <Radio value={"注销"}>注销</Radio>
                            <Radio value={"撤销"}>撤销</Radio>
                           </Radio.Group></td>
                    </tr>
                    <tr>
                        <td>企业许可证类型</td>
                        <td colSpan={5}><Select value={formData.permissionType?formData.permissionType.split(','):[]} mode="tags" style={{width:800}}
                                onChange={(value)=>this.onCheckChange(value,"permissionType")} disabled={checkStatus}>

                                {(this.props.industryList||[]).map((item)=>(
                                    <Option value={item.remark}>{item.name}</Option>
                                ))}

                                </Select>
                        </td>
                    </tr>
                    </tbody>
                </table>
            </div>
                <div className='commonEnterpriseBox' style={{marginTop:20}}>
                    <div className='permission-title-text'>企业许可信息</div>
                    <div className='permission-content-box'>
                        {(formData.permissionType?formData.permissionType.split(','):[]).map((item)=>{
                            switch (item) {
                                case 'foodBusiness':
                                    return <div className={this.state.msgIndex === 'foodBusiness'?'noClickMsg':'onClickMsg'} onClick={this.changeMsgIndex.bind(this,'foodBusiness')}>食品经营企业</div>
                                case 'foodCommon':
                                    return <div className={this.state.msgIndex === 'foodCommon'?'noClickMsg':'onClickMsg'} onClick={this.changeMsgIndex.bind(this,'foodCommon')}>餐饮服务单位</div>
                                case 'foodCirculate':
                                    return <div className={this.state.msgIndex === 'foodCirculate'?'noClickMsg':'onClickMsg'} onClick={this.changeMsgIndex.bind(this,'foodCirculate')}>食品流通单位</div>
                                case 'foodProduce':
                                    return <div className={this.state.msgIndex === 'foodProduce'?'noClickMsg':'onClickMsg'} onClick={this.changeMsgIndex.bind(this,'foodProduce')}>食品生产许可证</div>
                                case 'drugsBusiness':
                                    return <div className={this.state.msgIndex === 'drugsBusiness'?'noClickMsg':'onClickMsg'} onClick={this.changeMsgIndex.bind(this,'drugsBusiness')}>药品经营企业</div>
                                case 'medicalUse':
                                    return <div className={this.state.msgIndex === 'medicalUse'?'noClickMsg':'onClickMsg'} onClick={this.changeMsgIndex.bind(this,'medicalUse')}>医疗器械使用许可证</div>
                                case 'cosmeticsUse':
                                    return <div className={this.state.msgIndex === 'cosmeticsUse'?'noClickMsg':'onClickMsg'} onClick={this.changeMsgIndex.bind(this,'cosmeticsUse')}>化妆品使用许可证</div>
                            }
                        })}
                        <div style={{clear:'both'}}/>
                    </div>
                    { this.getContent()}

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