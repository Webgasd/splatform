import React, { Component } from 'react'
import {Button,Card,Col,Row,Input,DatePicker} from 'antd'
const { Search } = Input;
const { RangePicker } = DatePicker;

class InspectDataStatistics extends Component {
    render() {
        const onSearch = value => console.log(value);
        return (
            <div className='Content'>
                <Row style={{backgroundColor:'white'}}>
                  <Col style={{float:'left',fontSize:16,marginLeft:15}}>数据查询</Col>
                  <Col style={{float:'left',marginLeft:800}}><RangePicker /></Col>
                  <Col><Button>搜索</Button></Col>
                </Row>
                <div style={{marginTop:10}} className='TopContent'>
                    <Card   title='网格员巡查问题反馈量' style={{width:300,height:460,float:'left',marginTop:10,marginLeft:15}}>
                        <Row style={{marginLeft:50}}>
                            <Col style={{fontSize:48,fontfamily: 'ArialMT'}}>8923</Col>
                            <Col style={{fontfamily: 'ArialMT'}}>反馈问题数量</Col>
                        </Row>
                        <Row style={{marginLeft:20,marginTop:10}}>
                            <Col style={{fontSize:16,fontfamily: 'ArialMT'}}>巡检反馈有效率</Col>
                        </Row>
                    </Card>
                    <Card   title='常见问题类型前五名' style={{width:1130,height:460,float:'left',marginTop:10,marginLeft:20}}></Card>
                </div>
                <div style={{marginTop:10}} className='BelowContent'>
                    <Card  title='常见问题分布图' style={{width:500,height:410,float:'left',marginTop:10,marginLeft:15}}></Card>
                    <Card  title='辖区问题分布' style={{width:930,height:410,float:'left',marginTop:10,marginLeft:20}}></Card>
                </div>
            </div>
        )
    }
}

export default InspectDataStatistics;