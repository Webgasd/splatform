import React from "react";

import {changeParchive,changeParchiveInput} from "../../../redux/action";

import {Select, Input,Tabs} from 'antd';
import {connect} from "react-redux";

const Option = Select.Option;
const TabPane=Tabs.TabPane;

class DetailForm extends React.Component{
    state = {};


    handleName=(target,which)=>{
        // let data = this.props.parchive;
        // data.name=event.target.value;
        console.log(target.value,which)
        this.props.dispatch(changeParchiveInput(target.value,which));
        // this.forceUpdate();
    }


    render(){
        const {parchive} =this.props;
        const type = this.props.type;
        function call_back(key) {

        }
        return (

            <Tabs defaultActiveKey="1" onChange={call_back}>
                <TabPane tab="1.人员信息" key="1">
                    <div className="commonEnterpriseBox">
                        <table>
                            <tbody>
                            <card>
                                <tr>
                                    <td>姓名</td>

                                    <td><Input value={parchive.name} onChange={(e)=>this.handleName(e.target,"name")}/></td>

                                    <td>性别</td>
                                    <td >
                                        <Select value={parchive.sex} onChange={this.handleSex}>
                                            <Option value="男" disabled={type=='detail'?true:false}>男</Option>
                                            <Option value="女" disabled={type=='detail'?true:false}>女</Option>
                                        </Select>
                                    </td>
                                </tr>
                                <tr>
                                    <td>工种</td>
                                    <td ><Input placeholder={"请输入工种"}/></td>
                                </tr>
                                <tr>
                                    <td>体检情况</td>
                                    <td >
                                        <Select value={parchive.test} onChange={this.handleTest}>
                                            <Option value={1} disabled={type=='detail'?true:false}>男</Option>
                                            <Option value={2} disabled={type=='detail'?true:false}>女</Option>
                                        </Select>
                                    </td>
                                    <td>培训情况</td>
                                    <td >
                                        <Select value={0}>
                                            <Option value={1} disabled={type=='detail'?true:false}>男</Option>
                                            <Option value={2} disabled={type=='detail'?true:false}>女</Option>
                                        </Select>
                                    </td>
                                </tr>
                                <tr>
                                    <td>文化程度</td>
                                    <td >
                                        <Select value={0}>
                                            <Option value={1} disabled={type=='detail'?true:false}>男</Option>
                                            <Option value={2} disabled={type=='detail'?true:false}>女</Option>
                                        </Select>
                                    </td>
                                    <td>健康证号</td>
                                    <td><Input value={parchive.number} readOnly={type=='detail'?true:false} onChange={this.handleNumber}/></td>
                                </tr>
                                <tr>
                                    <td>发证日期</td>
                                    <td><Input placeholder={"  "}/></td>
                                    <td>有效截止日期</td>
                                    <td><Input placeholder={"  "}/></td>
                                </tr>
                                <tr>
                                    <td>发证机关</td>
                                    <td colSpan={3}><Input placeholder={"  "}/></td>
                                </tr>
                            </card>
                            </tbody>
                        </table>
                    </div>
                </TabPane>
                <TabPane tab="2.调离记录信息" key="2" >
                    {/*<RMsg handleInputChange={this.handleInputChange}/>*/}
                </TabPane>
                <TabPane tab="3.晨检记录信息" key="3" >
                    {/*<CMsg/>*/}
                </TabPane>
            </Tabs>
        );
    }
}
const mapStateToProps=(state)=>({
    parchive:state.parchive,
})

export default connect(mapStateToProps)(DetailForm);