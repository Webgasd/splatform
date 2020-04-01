import React from "react";
import {connect} from "react-redux";
import {Input, Select, Tabs} from "antd";
import KeyMsg from './KeyMsg'
import ResultMsg from './ResultMsg'
import ExtraMsg from './ExtraMsg'
import TextMsg from './TextMsg'


const Option = Select.Option;
const TabPane = Tabs.TabPane;


class ViewForm extends React.Component{
    state = {};

    render() {
        const {smallcatering} =this.props;
        const type = this.props.type;
        const checkId=smallcatering.id;
        console.log("okokok")
        return (
            <div className="commonEnterpriseBox">
                <Tabs>
                    <TabPane tab="1.基本信息" key="1">
                        <table>
                            <tbody>
                            <tr>
                                <td >检查对象类型</td>
                                <td>
                                <Select value={smallcatering.checkType} style={{width:"100%"}}>
                                    <Option value="检查类型" disabled={type=='detail'?true:false}>检查类型</Option>
                                    <Option value="日常检查" disabled={type=='detail'?true:false}>日常检查</Option>
                                    <Option value="1" disabled={type=='detail'?true:false}>1</Option>
                                </Select>
                                </td>
                                <td>被检查对象</td>
                                <td>
                                <Select value={smallcatering.checkObject} style={{width:"100%"}}>
                                    <Option value={"被检对象"} disabled={type=='detail'?true:false}>被检对象</Option>
                                    <Option value={"1"} disabled={type=='detail'?true:false}>1</Option>
                                </Select>
                                </td>
                            </tr>
                            <tr>
                                <td>所属区域</td>
                                <td>
                                    <Select value={smallcatering.region} style={{width:"100%"}}>
                                        <Option value={"所属区域"} disabled={type=='detail'?true:false}>所属区域</Option>
                                        <Option value={"大明湖街道"} disabled={type=='detail'?true:false}>大明湖街道</Option>
                                        <Option value={"1"} disabled={type=='detail'?true:false}>1</Option>
                                    </Select>
                                </td>
                                <td>所属网格</td>
                                <td>
                                    <Select value={smallcatering.grid} style={{width:"100%"}}>
                                        <Option value={"所属网格"} disabled={type=='detail'?true:false}>所属网格</Option>
                                        <Option value={"一区"} disabled={type=='detail'?true:false}>一区</Option>
                                        <Option value={"1"} disabled={type=='detail'?true:false}>1</Option>
                                    </Select>
                                </td>
                            </tr>
                            <tr>
                                <td>检查地址</td>
                                <td colSpan={5}><Input value={smallcatering.checkAddress} readOnly={type=='detail'?true:false}/></td>
                            </tr>
                            <tr>
                                <td>许可证号</td>
                                <td><Input value={smallcatering.okNumber} readOnly={type=='detail'?true:false}/></td>
                                <td>被检单位负责人</td>
                                <td><Input value={smallcatering.chargePerson} readOnly={type=='detail'?true:false}/></td>
                            </tr>
                            <tr>
                                <td>检查机构</td>
                                <td><Input value={smallcatering.checkOrgan} readOnly={type=='detail'?true:false} /></td>
                                <td>联系方式</td>
                                <td><Input value={smallcatering.contactPhone} readOnly={type=='detail'?true:false}/></td>
                            </tr>
                            <tr>
                                <td>陪同人员</td>
                                <td colSpan={5}><Input value={smallcatering.entourage} readOnly={type=='detail'?true:false}/></td>
                            </tr>
                            <tr>
                                <td>执法人员</td>
                                <td>
                                <Select value={smallcatering.supervisor} style={{width:"100%"}}>
                                    <Option value={"执法人员"} disabled={type=='detail'?true:false}>执法人员</Option>
                                    <Option value={"王兵，陶瑜"} disabled={type=='detail'?true:false}>王兵，陶瑜</Option>
                                </Select>
                                </td>
                            </tr>
                            <tr>
                                <td>执法证号</td>
                                <td colSpan={5}><Input value={smallcatering.supervisorNumber} readOnly={type=='detail'?true:false} onChange={this.handleSupervisorNumber}/></td>
                            </tr>
                            <tr>
                                <td>检查时间</td>
                                <td colSpan={5}><Input value={smallcatering.checkDate} readOnly={type=='detail'?true:false} onChange={this.handleCheckDate}/></td>
                            </tr>
                            <tr>
                                <td>执法证号最后一次检查日期</td>
                                <td colSpan={5}><Input value={smallcatering.lastCheckTime} readOnly={type=='detail'?true:false} onChange={this.handleLastCheckTime}/></td>
                            </tr>
                            </tbody>
                        </table>
                        <KeyMsg  id={checkId} />
                        <ResultMsg/>
                        <ExtraMsg/>
                    </TabPane>
                    <TabPane tab="2.文书处理" key="2" >
                        <TextMsg />
                    </TabPane>
                </Tabs>
            </div>
        )
    }
}

const mapStateToProps=(state)=>({
    smallcatering:state.smallcatering,
})
export default connect(mapStateToProps)(ViewForm);




