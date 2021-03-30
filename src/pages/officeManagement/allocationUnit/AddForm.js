import React, { Component } from 'react'
import { Row, Col, Input} from 'antd'
const { TextArea } = Input;

class AddForm extends Component {
    changeInput = (data, option) => {
        let value = this.props.informData
        value[option] = data
        this.props.dispatchInformData(value)
    }
    render() {
        let sourceData = this.props.informData
        let status = this.props.status=='detail'? true:false
        return (
            <div>
                <Row style={{marginTop:10}}>
                    <Col span={3} style={{textAlign:'right',fontSize:15}}>来文单位：</Col>
                    <Col span={15}><Input placeholder='请输入来文单位' value={sourceData.name} onChange={(e)=>this.changeInput(e.target.value,'name')} disabled={status} /></Col>
                </Row>
                <Row style={{marginTop:10}}>
                    <Col span={3} style={{textAlign:'right',fontSize:15}}>联系人：</Col>
                    <Col span={7}><Input placeholder='请输入联系人' value={sourceData.contactPerson} onChange={(e)=>this.changeInput(e.target.value,'contactPerson')} disabled={status} /></Col>
                    <Col span={3} style={{textAlign:'right',fontSize:15}}>联系电话：</Col>
                    <Col span={7}><Input placeholder='请输入联系电话' value={sourceData.phone} onChange={(e)=>this.changeInput(e.target.value,'phone')}  disabled={status}/></Col>
                </Row>
                <Row style={{marginTop:10}}>
                    <Col span={3} style={{textAlign:'right',fontSize:15}}>备注：</Col>
                    <Col span={7}><TextArea rows={6} placeholder='请输入备注' value={sourceData.remark}  onChange={(e) => this.changeInput(e.target.value, 'remark')} disabled={status}/></Col>
                 </Row>
            </div>
        )
    }
}

export default AddForm
