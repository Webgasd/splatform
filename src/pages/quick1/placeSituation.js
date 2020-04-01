import React, { Component } from 'react';
import echarts from "echarts/lib/echarts";
import { Col, Row } from "antd";
import Indicators from './indicators'
import LeftBar from "./img/leftBar.png";
import RightBar from "./img/rightBar.png";
import CommonTableTitle from "./commonTableTitle";
class PlaceSituation extends Component {
    constructor(props) {
        super(props);
        this.state = {
            tempTeamData2: []
        }
    }
    componentDidMount() {
    }
    componentWillReceiveProps(nextProps, nextContext) {
        this.createCharts1(nextProps.tempTeamData2);
    }

    createCharts1(tempTeamData2) {

        const myBar = echarts.init(document.getElementById('office1'));
        const teamitem = tempTeamData2.map((item) => {
            return item.team2;
        })
        const teamyes = tempTeamData2.map((item) => {
            return item.yes2;
        })
        const teamno = tempTeamData2.map((item) => {
            return item.no2;
        })
        const teamtotal = tempTeamData2.map((item) => {
            return item.total2;
        })
        // 绘制图表
        myBar.setOption({
            color: ['#90C589', '#E25B33', '#86C2CF'],
            backgroundColor: 'rgba(46, 126, 139, 0.00)',
            tooltip: {
                trigger: 'axis'
            },
            //         title : {
            //             text: '各执法所快检检测指标情况',
            //             x:'center',
            //             y:10,
            //              textStyle: {
            //                 fontSize: 16,
            //                 color:'#D6FEFE',
            //                 fontWeight:'normal'
            //                },
            //         },
            grid: {
                y: 30
            },
            legend: {
                data: ['合格', '不合格', '快检总批次'],
                textStyle: {
                    color: '#6593B7'
                },
                itemWidth: 5,
                itemHeight: 5,
                top: 'bottom',
            },
            xAxis: [{
                type: 'category',
                boundaryGap: true,
                data: teamitem,
                axisLine: {
                    lineStyle: {
                        color: '#6593B7'
                    }
                },
                axisLabel: {
                    color: '#6593B7',
                    interval: 0,  //类目全显
                    fontSize: 10,
                },
            }],
            yAxis: [{
                type: 'value',
                axisLine: {
                    lineStyle: {
                        color: '#6593B7'
                    }
                },
            }],
            series: [
                {
                    name: '合格',
                    type: 'bar',
                    data: teamyes,
                    barWidth: 10
                },
                {
                    name: '不合格',
                    type: 'bar',
                    data: teamno,
                    barWidth: 10
                },
                {
                    name: '快检总批次',
                    type: 'line',
                    data: teamtotal,
                }
            ]
        });
    }
    render() {
        this.state.steplist = this.props.totalstepitem || [];

        return (
            <div>
                {/* <div style={{color:'#8ECED6',marginLeft:160}}>
                    <img src={LeftBar} alt={''}/>各所抽检检测情况<img src={RightBar} alt={''}/>
                </div> */}
                 <div className="commonTableTitle3" style={{color:'#8ECED6', textAlign: 'center',marginLeft:'auto',marginRight:'auto',width:'100%'}}>
                    <img src={LeftBar}  alt={''}/>各执法所快检检测费用使用情况<img src={RightBar}  alt={''}/>
                </div> 
                {/* <CommonTableTitle title={'各执法所快检检测指标情况'} /> */}
                <div id='office1' style={{ height: '240px', width: '550px', margin: 'auto' }}></div>
                <Indicators
                    office={this.props.office}
                    percent1={this.props.percent1}
                    yes1={this.props.yes1}
                    no1={this.props.no1}
                    total1={this.props.total1}
                />

            </div>
        )
    }
}

export default PlaceSituation