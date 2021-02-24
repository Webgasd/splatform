import React, { Component } from 'react'
import { Card, Row,Col } from 'antd'
import './style.less'

class AddForm extends Component {
    state = {

    }
    render() {
        return (
            <div className='addContent'>
                <div className='leftContent'>
                    <Card title="通知类型" style={{ width: 250 }}>
                        <Row>
                            <Col span={8} style={{textAlign:'right',fontSize:15}}>发布人：</Col>
                            <Col span={16}></Col>
                        </Row>
                    </Card>
                    <Card title="发送给" style={{ width: 250 }}>
                        <p>Card content</p>
                        <p>Card content</p>
                    </Card>
                </div>
                <div className='rightContent'>
                    <Card title="通知类型" style={{ width: 600 }}>
                        <p>Card content</p>
                        <p>Card content</p>
                    </Card>
                </div>
            </div>
        )
    }
}
export default AddForm
