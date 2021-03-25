import React, { Component } from 'react'
import { Button, Card, Row, Col, Table, Input, Select,DatePicker} from 'antd'
import moment from "moment";
const { TextArea } = Input;
const ButtonGroup = Button.Group;
const { Option } = Select;
const { RangePicker } = DatePicker;

class AddForm extends Component {
    changeInput = (data, option) => {
        let value = this.props.state.informData
        value[option] = data
        this.props.dispatchInformData(value)
    }
    
    render() {
        const dateFormat = 'YYYY-MM-DD'||undefined;
        let status = this.props.status=='detail'? true:false
        const {InspectionType,informData,mockData,inspectionHandle,InfoValidity} = this.props.state
        return (
            <div>
                <Row style={{marginTop:10}}>
                    <Col span={3} style={{textAlign:'right',fontSize:15}}>网格员：</Col>
                    <Col span={5}><Input placeholder='请输入内容' value={informData.grider} onChange={(e)=>this.changeInput(e.target.value,'grider')} disabled={true} bordered={false}/></Col>
                    <Col span={3} style={{textAlign:'right',fontSize:15}}>上报日期：</Col>
                    <Col span={5}><DatePicker  value={informData.issueDate==undefined?null:moment(informData.issueDate, dateFormat)} format={dateFormat} onChange={(dataString)=>this.changeInput(dataString,'issueDate')} disabled={true} bordered={false}/></Col>
                    <Col span={3} style={{textAlign:'right',fontSize:15}}>问题类型：</Col>
                    <Col span={5}>
                        <Select value={informData.typeId}  style={{ width: 120 }} onChange={(value) => this.changeInput(value, 'typeId')} disabled={true} bordered={false}>
                            {InspectionType.map((item) => {
                                return <Option key={item.id} value={item.id}>{item.className}</Option>
                            })}
                            </Select>
                    </Col>
                </Row>
                <Row style={{marginTop:10}}>
                    <Col span={3} style={{textAlign:'right',fontSize:15}}>巡检问题标题：</Col>
                    <Col span={10}><Input placeholder='请输入内容' value={informData.inspectTitle} onChange={(e)=>this.changeInput(e.target.value,'inspectTitle')} disabled={true} bordered={false}/></Col>
                    <Col span={3} style={{textAlign:'right',fontSize:15}}>巡检区域：</Col>
                    <Col span={5}>
                            <Select value={informData.inspectStreet}  style={{ width: 120 }} onChange={(value) => this.changeInput(value, 'inspectStreet')} disabled={true} bordered={false}>
                                {mockData.map((item) => {
                                    return <Option key={item.id} value={item.id}>{item.name}</Option>
                                })}
                             </Select>
                    </Col>
                </Row>
                <Row style={{marginTop:10}}>
                    <Col span={3} style={{textAlign:'right',fontSize:15}}>问题描述：</Col>
                    <Col span={20}><TextArea rows={6} placeholder='请输入内容' value={informData.problemContent}  onChange={(e) => this.changeInput(e.target.value, 'problemContent')} disabled={true}/></Col>
                </Row>
                 <Card title="违规照片" style={{marginTop:10}}>

                 </Card>
                 <Card title="处理结果反馈" style={{marginTop:10}}>
                      <Row style={{marginTop:10}}>
                        <Col span={3} style={{textAlign:'right',fontSize:15}}>信息有效性：</Col>
                        <Col span={5}>
                                <Select value={informData.infoValid}  style={{ width: 120 }} onChange={(value) => this.changeInput(value, 'infoValid')} disabled={status}>
                                    {InfoValidity.map((item) => {
                                        return <Option key={item.infoValid} value={item.infoValid}>{item.className}</Option>
                                    })}
                                </Select>
                        </Col>
                        <Col span={3} style={{textAlign:'right',fontSize:15}}>处理方式：</Col>
                        <Col span={5}>
                                <Select value={informData.handle}  style={{ width: 120 }} onChange={(value) => this.changeInput(value, 'handle')} disabled={status}>
                                    {inspectionHandle.map((item) => {
                                        return <Option key={item.id} value={item.id}>{item.className}</Option>
                                    })}
                                </Select>
                        </Col>
                        <Col span={3} style={{textAlign:'right',fontSize:15}}>反馈日期：</Col>
                        <Col span={5}><DatePicker  value={informData.reviewDate==undefined?null:moment(informData.reviewDate, dateFormat)} format={dateFormat} onChange={(dataString)=>this.changeInput(dataString,'reviewDate')} disabled={status}/></Col>
                      </Row>
                      <Row style={{marginTop:10}}>
                          <Col span={3} style={{textAlign:'right',fontSize:15}}>反馈答复：</Col>
                          <Col span={21}><TextArea rows={6} placeholder='请输入内容' value={informData.reviewContent}  onChange={(e) => this.changeInput(e.target.value, 'reviewContent')} disabled={status}/></Col>
                      </Row>
                 </Card>
            </div>
        )
    }
}

export default AddForm
