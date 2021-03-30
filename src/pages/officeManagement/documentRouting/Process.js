import React, { Component } from 'react'
import {Row, Col,Radio,Input} from 'antd'
const { TextArea } = Input;

export default class Process extends Component {
    changeInput = (data, option) => {
        let value = this.props.informData
        value[option] = data
        this.props.dispatchInformData(value)
    }
    render() {
        let {informData} = this.props;
        const onChange = e => {
            
        };
        return (
            <div>
               <Row style={{marginTop:10}}>
                    <Col span={8} style={{textAlign:'right',fontSize:15}}>拟办时间：</Col>
                    <Col span={13}>{informData.reviewTime}</Col>
                </Row> 
                <Row style={{marginTop:10}}>
                    <Col span={8} style={{textAlign:'right',fontSize:15}}>拟办结果：</Col>
                    <Radio.Group value={informData.reviewResult} onChange={(e) => this.changeInput(e.target.value, 'reviewResult')} >
                        <Radio value={1}>通过/下发</Radio>
                        <Radio value={2}>不通过/退回</Radio>
                    </Radio.Group>
                </Row> 
                <Row style={{marginTop:10}}>
                    <Col span={8} style={{textAlign:'right',fontSize:15}}>批注/备注：</Col>
                    <Col span={13}><TextArea rows={6} placeholder='请输入内容' value={informData.reviewComment}  onChange={(e) => this.changeInput(e.target.value, 'reviewComment')}/></Col>
                </Row>
            </div>
        )
    }
}
