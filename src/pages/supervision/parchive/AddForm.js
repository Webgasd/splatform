import React,{Component} from 'react';
import {Form, Button, Select, Icon, Row, Col, Input, Radio} from 'antd';
const FormItem = Form.Item;
const Option = Select.Option;
const RadioGroup = Radio.Group;

class AddForm extends Component{
    state={
        msgIndex:0
    }

    changeMsgIndex(index){
        this.setState({
            msgIndex:index
        })
    }

    handleInputChange(event) {
        const target = event.target;
        const value = target.type === 'checkbox' ? target.checked : target.value;
        const name = target.name;

        this.setState({
            [name]: value
        });
    }

    render(){
        const { getFieldDecorator } = this.props.form;
        const formItemLayout = {
            labelCol: {span:8},
            wrapperCol: {span: 16}
        };
        return (
            <Form layout="inline">
                <div className='msgIndexBox'>
                    <div className={this.state.msgIndex === 0?'msgIndex showIndex':'msgIndex'} onClick={this.changeMsgIndex.bind(this,0)}>人员信息</div>
                    <div className={this.state.msgIndex === 1?'msgIndex showIndex':'msgIndex'} onClick={this.changeMsgIndex.bind(this,1)}>调离记录信息</div>
                    <div className={this.state.msgIndex === 2?'msgIndex showIndex':'msgIndex'} onClick={this.changeMsgIndex.bind(this,2)}>晨检记录信息</div>
                </div>
                <div className='msgContent'>
                    <div className='commonEnterpriseBox' style={{display:this.state.msgIndex === 0?'block':'none'}}>
                        <RMsg handleInputChange={this.handleInputChange}/>
                    </div>

                    <div className='commonEnterpriseBox' style={{display:this.state.msgIndex === 1?'block':'none'}}>
                        <DMsg handleInputChange={this.handleInputChange}/>
                    </div>

                    <div className='commonEnterpriseBox' style={{display:this.state.msgIndex === 2?'block':'none'}}>
                        <CMsg handleInputChange={this.handleInputChange}/>
                    </div>


                </div>
            </Form>
        );
    }
}
export default Form.create({})(AddForm);


class RMsg extends Component{
    render() {
        const handleInputChange = this.props.handleInputChange.bind(this)
        return (
            <div>
                <table>
                    <tbody>

                    <Row>
                        <Col span={18}>
                            <card>
                                <tr>
                                    <td>姓名</td>
                                    <td ><Input placeholder={"请输入姓名"}/></td>
                                    <td>性别</td>
                                    <td >
                                        <Select value={0}>
                                            <Option value={0}>请选择性别</Option>
                                            <Option value={1}>男</Option>
                                            <Option value={2}>女</Option>
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
                                        <Select value={0}>
                                            <Option value={0}>请选择体检情况</Option>
                                            <Option value={1}>男</Option>
                                            <Option value={2}>女</Option>
                                        </Select>
                                    </td>
                                    <td>培训情况</td>
                                    <td >
                                        <Select value={0}>
                                            <Option value={0}>请选择培训情况</Option>
                                            <Option value={1}>男</Option>
                                            <Option value={2}>女</Option>
                                        </Select>
                                    </td>
                                </tr>
                                <tr>
                                    <td>文化程度</td>
                                    <td >
                                        <Select value={0}>
                                            <Option value={0}>请选择文化程度</Option>
                                            <Option value={1}>男</Option>
                                            <Option value={2}>女</Option>
                                        </Select>
                                    </td>
                                    <td>健康证号</td>
                                    <td><Input placeholder={"请输入健康证号"}/></td>
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
                        </Col>
                        <Col span={6}>
                            <card>
                                <Button style={{marginTop:170,marginLeft:70}}  className="ant-upload-text" type="primary">Upload</Button>
                            </card>
                        </Col>
                    </Row>
                    <Button style={{marginTop:10,marginLeft:320}} type="primary">添加</Button>
                    </tbody>
                </table>
            </div>
        )
    }
}

class DMsg extends Component{
    render() {
        const handleInputChange = this.props.handleInputChange.bind(this)
        return (
            <div>
                <table>
                    <tbody>

                    <Row>
                        <Col span={18}>
                            <card>
                                <tr>
                                    <td>单位名称</td>
                                    <td ><Input placeholder={"请输入单位名称"} name={"name"} onChange={handleInputChange}/></td>
                                    <td>部门名称</td>
                                    <td >
                                        <Select value={0}>
                                            <Option value={0}>请选择部门名称</Option>
                                            <Option value={1}>博士</Option>
                                            <Option value={2}>硕士</Option>
                                            <Option value={3}>本科</Option>
                                        </Select>
                                    </td>
                                    <td>姓名</td>
                                    <td ><Input placeholder={"请输入姓名"}/></td>
                                </tr>
                                <tr>
                                    <td>性别</td>
                                    <td >
                                        <Select value={0}>
                                            <Option value={0}>请选择性别</Option>
                                            <Option value={1}>男</Option>
                                            <Option value={2}>女</Option>
                                        </Select>
                                    </td>
                                    <td>职务</td>
                                    <td>
                                        <Select value={0}>
                                            <Option value={0}>请选择职务</Option>
                                            <Option value={1}>博士</Option>
                                            <Option value={2}>硕士</Option>
                                            <Option value={3}>本科</Option>
                                        </Select>
                                    </td>
                                    <td>类型</td>
                                    <td>
                                        <Select value={0}>
                                            <Option value={0}>请选择类型</Option>
                                            <Option value={1}>博士</Option>
                                            <Option value={2}>硕士</Option>
                                            <Option value={3}>本科</Option>
                                        </Select>
                                    </td>
                                </tr>
                                <tr>
                                    <td>身份证号</td>
                                    <td><Input placeholder={"请输入身份证号"}/></td>
                                    <td>执法证号</td>
                                    <td><Input placeholder={"请输入执法证号"}/></td>
                                    <td>移动电话</td>
                                    <td><Input placeholder={"请输入移动电话"}/></td>
                                </tr>
                                <tr>
                                    <td>办公电话</td>
                                    <td><Input placeholder={"请输入办公电话"}/></td>
                                    <td>序号</td>
                                    <td><Input placeholder={"请输入序号"}/></td>
                                    <td>工作移动电话</td>
                                    <td><Input placeholder={"请输入工作移动电话"}/></td>
                                </tr>
                                <tr>
                                    <td>人员类别</td>
                                    <td colSpan={5}>
                                        <RadioGroup>
                                            <Radio value={1}>执法人员</Radio>
                                            <Radio value={2}>协管人员</Radio>
                                            <Radio value={3}>其他</Radio>
                                        </RadioGroup>
                                    </td>
                                </tr>
                            </card>
                        </Col>
                        <Col span={6}>
                            <card>
                                <Button style={{marginTop:170,marginLeft:70}}  className="ant-upload-text" type="primary">Upload</Button>
                            </card>
                        </Col>
                    </Row>
                    <Button style={{marginLeft:570}} type="primary">添加</Button>
                    </tbody>
                </table>
            </div>
        )
    }
}

class CMsg extends Component{
    render() {
        const handleInputChange = this.props.handleInputChange.bind(this)
        return (
            <div>
                <table>
                    <tbody>

                    <Row>
                        <Col span={18}>
                            <card>
                                <tr>
                                    <td>单位名称</td>
                                    <td ><Input placeholder={"请输入单位名称"} name={"name"} onChange={handleInputChange}/></td>
                                    <td>部门名称</td>
                                    <td >
                                        <Select value={0}>
                                            <Option value={0}>请选择部门名称</Option>
                                            <Option value={1}>博士</Option>
                                            <Option value={2}>硕士</Option>
                                            <Option value={3}>本科</Option>
                                        </Select>
                                    </td>
                                    <td>姓名</td>
                                    <td ><Input placeholder={"请输入姓名"}/></td>
                                </tr>
                                <tr>
                                    <td>性别</td>
                                    <td >
                                        <Select value={0}>
                                            <Option value={0}>请选择性别</Option>
                                            <Option value={1}>男</Option>
                                            <Option value={2}>女</Option>
                                        </Select>
                                    </td>
                                    <td>职务</td>
                                    <td>
                                        <Select value={0}>
                                            <Option value={0}>请选择职务</Option>
                                            <Option value={1}>博士</Option>
                                            <Option value={2}>硕士</Option>
                                            <Option value={3}>本科</Option>
                                        </Select>
                                    </td>
                                    <td>类型</td>
                                    <td>
                                        <Select value={0}>
                                            <Option value={0}>请选择类型</Option>
                                            <Option value={1}>博士</Option>
                                            <Option value={2}>硕士</Option>
                                            <Option value={3}>本科</Option>
                                        </Select>
                                    </td>
                                </tr>
                                <tr>
                                    <td>身份证号</td>
                                    <td><Input placeholder={"请输入身份证号"}/></td>
                                    <td>执法证号</td>
                                    <td><Input placeholder={"请输入执法证号"}/></td>
                                    <td>移动电话</td>
                                    <td><Input placeholder={"请输入移动电话"}/></td>
                                </tr>
                                <tr>
                                    <td>办公电话</td>
                                    <td><Input placeholder={"请输入办公电话"}/></td>
                                    <td>序号</td>
                                    <td><Input placeholder={"请输入序号"}/></td>
                                    <td>工作移动电话</td>
                                    <td><Input placeholder={"请输入工作移动电话"}/></td>
                                </tr>
                                <tr>
                                    <td>人员类别</td>
                                    <td colSpan={5}>
                                        <RadioGroup>
                                            <Radio value={1}>执法人员</Radio>
                                            <Radio value={2}>协管人员</Radio>
                                            <Radio value={3}>其他</Radio>
                                        </RadioGroup>
                                    </td>
                                </tr>
                            </card>
                        </Col>
                        <Col span={6}>
                            <card>
                                <Button style={{marginTop:170,marginLeft:70}}  className="ant-upload-text" type="primary">Upload</Button>
                            </card>
                        </Col>
                    </Row>
                    <Button style={{marginLeft:570}} type="primary">添加</Button>
                    </tbody>
                </table>
            </div>
        )
    }
}