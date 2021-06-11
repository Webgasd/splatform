import React, { Component } from 'react'
import { Button, Card, Col, Row, Input, DatePicker } from 'antd'
import axios from '../../../axios';
import Histogram from './histogram'
import PeiChart from './peiChart'
import FirstPei from './firstPei'
import Common from './commonProblem'
import './style.less'
import moment from 'moment'
const { Search } = Input;
const { RangePicker } = DatePicker;

class InspectDataStatistics extends Component {
    state = {
        data: {},
        date: null,
        label: [], //区域
        areaNum: [], //区域
        fiveQuestion: [],//前五
        color: ['#ff0000', '#0f58a4', '#3fd49a', '#6c6cce', '#1c1818'],
    }
    componentDidMount() {
        let startDate = moment().format("YYYY")+'-01-01'
        let endDate =  moment().format("YYYY-MM-DD")
        this.getData(startDate,endDate)
    }
    
    getData = (startDate,endDate) => {
        axios.PostAjax({
            url: '/gridInspection/getCount',
            data: {
                params: {
                    "startDate": startDate,
                    "endDate": endDate
                }
            }
        }).then((res) => {
            if (res.status == 'success') {
                let data = res.data
                //解析地域问题数据
                let label = this.state.label
                let areaNum = this.state.areaNum
                for (var i = 0; i < data.areaCount.length; i++) {
                    label[i] = data.areaCount[i].name
                    areaNum[i] = data.areaCount[i].value
                }
                console.log(data)
                //取常见类型前五
                let fiveQuestion = data.typeCount.slice(0,5)
                // console.log('fiveQuestion',fiveQuestion)
                this.setState({data,fiveQuestion})
            }
        })
    }
    
    getDataByDate = () => {
        let startDate = this.state.startTime||null
        let endDate = this.state.endTime||null
        // console.log(startDate,endDate)
        this.getData(startDate,endDate)
    }
    handlTime = (date, dateString) => {
        let startTime = moment(date[0]._d, "YYYY-MM-DD")
        let endTime = moment(date[1]._d, "YYYY-MM-DD")
        this.setState({ startTime, endTime })
    }
    render() {
        const { data,fiveQuestion, label, useful, areaNum, startTime, endTime } = this.state
        const dateFormat = 'YY-MM-DD'
        return (
            <div>

                <div className='top-style'>
                    <Row>
                        <Col span={16} style={{ fontSize: 16, marginTop: 8, marginLeft: 20, fontWeight: 650, color: 'white' }}>数据查询</Col>
                        <Col span={6} style={{ marginTop: 5 }}>
                            <RangePicker
                                format={dateFormat}
                                onChange={this.handlTime}
                                value={startTime === undefined || endTime === undefined || startTime == '' || endTime == ''
                                    ? null : [moment(startTime, dateFormat), moment(endTime, dateFormat)]}
                            />
                        </Col>
                        <Col span={1} style={{ marginTop: 5, marginLeft: 10 }}><Button onClick={this.getDataByDate}>搜索</Button></Col>
                    </Row>
                </div>
                <div style={{ marginTop: 20 }}>
                    <Card title='网格员巡查问题反馈量' style={{ width: '18%', height: 430, float: 'left' }}>
                        <Row style={{ marginLeft: "20%", marginTop: 20 }}>
                            <h1 >{data.allNumber || '暂无数据'}</h1>
                            <Col style={{ fontfamily: 'ArialMT', alignContent: 'center' }}>反馈问题数量</Col>
                        </Row>
                        <Row style={{ marginTop: 30 }}>
                            <Col style={{ fontSize: 16, fontfamily: 'ArialMT', fontWeight: 650 }}>巡检反馈有效率</Col>
                        </Row>
                        <div style={{ width: '100%', height: 260 }}><PeiChart total={data.allNumber || 0} valid={data.validNumber || 0} useful={useful || 0} /></div>
                    </Card>
                    <Card title='常见问题类型前五名' style={{ width: '81%', height: 430, float: 'right' }}>
                        <div className='quest-type-top5'>
                            {
                                (fiveQuestion || []).map((item) => {
                                    return <div className='top1'><h1 style={{ color: '#ff0000' }}>{item.value}</h1></div>
                                })
                            }
                        </div>
                        <div className='quest-type-top5-bottom'>
                            {
                                (fiveQuestion || []).map((item) => {
                                    return <div className='top1'>{item.name}</div>
                                })
                            }
                        </div>
                        <div>
                            <Row>
                                <Col span={16} style={{ fontSize: 16, fontWeight: 650 }}>常见问题类型占比</Col>
                                <Col span={1}><div style={{ backgroundColor: '#ff6600', width: 20, height: 10, marginTop: 8 }} /></Col>
                                <Col span={3}>当前类型问题</Col>
                                <Col span={1}><div style={{ backgroundColor: '#34c084', width: 20, height: 10, marginTop: 8 }} /></Col>
                                <Col span={3}>问题总计数量</Col>
                            </Row>
                            <Row><Col>说明：常见巡查问题占比=当前时间段类型问题数/当前时间段问题总计数量</Col></Row>
                            <div className='quest-type-top5-show'>
                                {
                                    (fiveQuestion || []).map((item) => {
                                        return <div className='top-show'><FirstPei total={data.allNumber} typeNum={item.value} id={item.name} /></div>
                                    })
                                }
                                
                            </div>
                        </div>
                    </Card>
                </div>
                <div>
                    <Card title='常见问题分布图' style={{ width: '29%', height: 430, float: 'left', marginTop: 10 }}>
                        <div style={{ width: 400, height: 420, marginTop: 10, marginLeft: 5 }}>
                            <Common data={data.typeCount||{}} />
                        </div>
                    </Card>
                    <Card title='辖区问题分布' style={{ width: '70%', height: 430, float: 'right', marginTop: 10 }}>
                        <Histogram label={label} areaNum={areaNum} />
                    </Card>
                </div>
            </div>
        )
    }
}

export default InspectDataStatistics;