import React,{Component} from 'react';
import {Input, DatePicker, TimePicker, Icon,Select,Modal, TreeSelect} from 'antd';
import connect from "react-redux/es/connect/connect";
import Utils from "../../../utils";
import moment from "moment";
import EnterpriseForm from "../../../components/CommonForm/EnterpriseForm";
import GaPersonForm from "../../../components/CommonForm/gaPersonForm";
import axios from "../../../axios";
const Option = Select.Option;
const TreeNode = TreeSelect.TreeNode;
@connect(
    state=>({
        areaList:state.areaList
    })
)
class CheckForm extends Component {
    state={gridTree:this.props.areaList}
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
    changeInput=(value,option)=>{
        let data = this.props.inspectData;
        data[option] = value
        this.props.dispatchInspectData(data);
    }

    loadGridData=()=>new Promise(resolve =>{
        axios.ajax({
            url:'/sys/area/getGridByArea',
            data:{
                params:{
                    id:this.props.inspectData.region
                }
            }
        }).then((res)=>{
            if(res.status == "success"){
                this.changeInput(null,'grid')
                this.setState({
                    gridTree:res.data
                })
                resolve();
            }
        })
    })

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
        const formData=this.props.inspectData||{};
        const checkStatus = this.props.type=='detail'?true:false;
        return(
            <div className='commonEnterpriseBox' style={{marginTop:20}}>
                <div className='permission-title-text' style={{width:112}}>检查基本信息</div>
               <table>
                   <tbody>
                   <tr>
                       <th>检查对象类型</th>
                       <td colSpan={3}><Select disabled={checkStatus} value={formData.checkType} placeholder={"请选择检查对象类型"} style={{width:"100%"}} onChange={(value)=>{if(value==3){alert('请先添加档案库')}else{this.changeInput(value,"checkType")}}} >
                           <Option value={1}>有证已建档</Option>
                           <Option value={2}>无证</Option>
                           <Option value={3}>有证未建档</Option>
                       </Select></td>
                   </tr>
                   <tr>
                       <th>被检单位<span style={{color:'#FF3300'}}>*</span></th>
                       <td colSpan={3}><Input disabled={checkStatus} placeholder={"请选择被检单位"} value={formData.checkObject} onChange={formData.checkType==1?null:(e)=>this.changeInput(e.target.value,"checkObject")} onClick={formData.checkType==1?()=>this.setState({isEnterpriseVisible:true}):null} suffix={<Icon type="search" />}/></td>
                   </tr>
                   <tr>
                       <th>所属区域</th>
                       <td><TreeSelect disabled={checkStatus} value={formData.region} onChange={(value)=>this.changeInput(value,"region")} placeholder={"请选择所属地区"} style={{width:"100%"}}>
                           {this.renderTreeNodes(this.props.areaList||[])}
                       </TreeSelect></td>
                       <th>所属网格</th>
                       <td><TreeSelect disabled={checkStatus?true:(formData.region?false:true)} onFocus={(treeNode)=>this.loadGridData(treeNode)} style={{width:"100%"}} value={formData.grid} onChange={(value)=>this.changeInput(value,"grid")} placeholder={"请选择网格"}>
                           {this.renderGridNodes(this.state.gridTree||[])}
                       </TreeSelect></td>
                   </tr>
                   <tr>
                       <th>检查地址<span style={{color:'#FF3300'}}>*</span></th>
                       <td colSpan={3}><Input disabled={checkStatus} placeholder={"请输入检查地址"} value={formData.checkAddress} onChange={(e)=>this.changeInput(e.target.value,"checkAddress")}/></td>
                   </tr>
                   <tr>
                       <th>许可证号<span style={{color:'#FF3300'}}>*</span></th>
                       <td><Input placeholder={"请输入许可证号"} disabled={checkStatus} value={formData.okNumber} onChange={(e)=>this.changeInput(e.target.value,"okNumber")}/></td>
                       <th>被检单位负责人<span style={{color:'#FF3300'}}>*</span></th>
                       <td><Input placeholder={"请输入被检单位负责人"} value={formData.chargePerson} disabled={checkStatus} onChange={(e)=>this.changeInput(e.target.value,"chargePerson")}/></td>
                   </tr>
                   <tr>
                       <th>检查机构</th>
                       <td><TreeSelect disabled={checkStatus} placeholder={"请选择检查机构"} value={formData.checkOrgan} style={{width:"100%"}} onChange={(value)=>this.changeInput(value,"checkOrgan")}>
                           {Utils.renderTreeNodes(this.state.deptTree||[])}
                       </TreeSelect></td>
                       <th>联系方式<span style={{color:'#FF3300'}}>*</span></th>
                       <td><Input placeholder={"请输入联系方式"} value={formData.contactPhone}  disabled={checkStatus} onChange={(e)=>this.changeInput(e.target.value,"contactPhone")}/></td>
                   </tr>
                   <tr>
                       <th>陪同人员</th>
                       <td colSpan={3}><Input disabled={checkStatus} placeholder={"请输入陪同人员"} value={formData.entourage} onChange={(e)=>this.changeInput(e.target.value,"entourage")}/></td>
                   </tr>
                   <tr>
                       <th>执法人员<span style={{color:'#FF3300'}}>*</span></th>
                       <td colSpan={3}><Input placeholder={"请选择执法人员"} value={formData.supervisor}  disabled={checkStatus?true:(formData.checkOrgan?false:true)} onClick={()=>this.setState({isGaPersonVisible:true})} suffix={<Icon type="search" />}/></td>
                   </tr>
                   <tr>
                       <th>执法证号<span style={{color:'#FF3300'}}>*</span></th>
                       <td colSpan={3}><Input disabled={checkStatus} value={formData.supervisorNumber}/></td>
                   </tr>
                   <tr>
                       <th>检查时间</th>
                       <td colSpan={3}><DatePicker disabled={checkStatus} style={{marginRight:5}} value={formData.checkDate?moment(formData.checkDate):moment()}
                                      onChange={(date,dateString)=>this.changeInput(dateString,'checkDate')}
                                      placeholder={['输入日期']} format="YYYY-MM-DD"/>
                          <TimePicker disabled={checkStatus} style={{width:80}} value={formData.checkStartHour?moment(formData.checkStartHour,'HH'):moment()}
                                      onChange={(date,dateString)=>this.changeInput(dateString,'checkStartHour')}
                                       format="HH"/>时
                           <TimePicker disabled={checkStatus} style={{width:80}} value={formData.checkStartMinute?moment(formData.checkStartMinute,'mm'):moment()}
                                       onChange={(date,dateString)=>this.changeInput(dateString,'checkStartMinute')}
                                       format="mm"/>分至
                           <TimePicker disabled={checkStatus} style={{width:80}} value={formData.checkEndHour?moment(formData.checkEndHour,'HH'):moment()}
                                       onChange={(date,dateString)=>this.changeInput(dateString,'checkEndHour')}
                                       format="HH"/>时
                          <TimePicker disabled={checkStatus} style={{width:80}} value={formData.checkEndMinute?moment(formData.checkEndMinute,'mm'):moment()}
                                   onChange={(date,dateString)=>this.changeInput(dateString,'checkEndMinute')}
                                   format="mm"/>分</td>
                   </tr>
                   <tr>
                       <th>最后一次检查日期</th>
                       <td colSpan={3}>{Utils.formatDateNoTime(formData.lastCheckTime)}</td>
                   </tr>
                   </tbody>
               </table>
                <Modal
                    width='1000px'
                    title="企业信息列表"
                    visible={this.state.isEnterpriseVisible}
                    destroyOnClose
                    footer={null}
                    onCancel={()=>{
                        this.setState({
                            isEnterpriseVisible:false
                        })
                    }}
                >
                    <EnterpriseForm
                        industryList={'foodProduce'}
                        dispatchEnterprise={(item)=> {
                        axios.ajax({
                            url:'/inspect/dailyFood/getCheckInfo',
                                data:{
                                params:{
                                    objectId:item.id
                                }
                            }
                        }).then((res)=>{
                            this.setState({isEnterpriseVisible: false})
                            let data = this.props.inspectData;
                                data.checkObjectId=item.id
                                data.checkObject=item.enterpriseName
                                data.checkAddress=item.registeredAddress
                                data.okNumber=(item.foodProduce||{}).number
                                data.chargePerson=item.legalPerson
                                data.contactPhone=item.cantacts
                                data.region=item.area
                                data.grid=item.grid
                                data.checkOrgan=item.regulators
                                data.checkCount=res.data.yearCheckNumber
                                data.lastCheckTime=res.data.lastDate
                                if(item.yearAssessment=='A'){
                                    data.checkFrequence=1
                                }else if(item.yearAssessment=='B'){
                                    data.checkFrequence=2
                                }else if(item.yearAssessment=='C'){
                                    data.checkFrequence=3
                                }else if(item.yearAssessment=='D'){
                                    data.checkFrequence=4
                                }else {
                                    data.checkFrequence=1
                                }
                                this.props.dispatchInspectData(data);
                        })
                        }}/>
                </Modal>
                <Modal
                    width='1000px'
                    title="执法人员列表"
                    visible={this.state.isGaPersonVisible}
                    destroyOnClose
                    footer={null}
                    onCancel={()=>{
                        //this.addForm.props.form.resetFields();//表单重置
                        this.setState({
                            isGaPersonVisible:false
                        })
                    }}
                >
                    <GaPersonForm
                        deptId={this.props.inspectData.checkOrgan||''}
                        dispatchPerson={(item)=> {
                        this.setState({isGaPersonVisible: false})
                        let idData = this.props.inspectData.supervisorId||'';
                        let supervisionData = this.props.inspectData.supervisor||'';
                        let numberData = this.props.inspectData.supervisorNumber||'';
                        let idList = idData.split(',')||[];
                        let supervisionList = supervisionData.split(',')||[];
                        let numberList = numberData.split(',')||[];
                        if(idList.length>1){
                            idList.pop()
                        }
                        idList.push(item.id.toString()||'')
                        if(supervisionList.length>1){
                            supervisionList.pop()
                        }
                        supervisionList.push(item.name||'')
                        if(numberList.length>1){
                            numberList.pop()
                        }
                        numberList.push(item.enforce||'')
                        let data= this.props.inspectData;
                        data.supervisorId=idList.join(',');
                        data.supervisor=supervisionList.join(',');
                        data.supervisorNumber=numberList.join(',');
                        this.props.dispatchInspectData(data);
                    }}/>
                </Modal>
            </div>);
    }
}
export default CheckForm;