import React,{Component} from 'react';
import echarts from 'echarts';
import {Col, Row} from "antd";
import axios from "../../axios";
import ProvinceMap from './provinceMap'
class PlaceSituation extends Component {
    constructor(props) {
        super(props);
        this.state = {
            steplist:[],
            flag:0
        }
    }
    componentDidMount() {
       
        //this.createCharts()
    }

    componentWillReceiveProps(nextProps, nextContext) {
        this.createCharts1(nextProps.areaName,nextProps.shouldCheck,nextProps.haveCheck,nextProps.numberEnterprise,nextProps.checkEnterprise)
        //this.createCharts()
    }

    createCharts1(areaName,shouldCheck,haveCheck,numberEnterprise,checkEnterprise) {
       // console.log(numberEnterprise)
        const myBar1 =  echarts.init(this.refs.bar1);
        // 绘制图表
        myBar1.setOption({
            color:['#77FCFB','#BFF5A7','#4B8C96','#E76660'],
            tooltip: {
                trigger: 'axis',
            },
            toolbox: {
                show:false,
                feature: {
                    dataView: {show: true, readOnly: false},
                    magicType: {show: true, type: ['line', 'bar']},
                    restore: {show: true},
                    saveAsImage: {show: true}
                }
            },
            grid:{
                y:20
            },
            legend: {
                data:['应检查家数','已检查家数','应检查次数','已检查次数'],
                textStyle: {
                    color:'aliceblue',
                    fontSize:9
                },
                top:'bottom'
            },
            xAxis: [
                {
                    type: 'category',
                   // data: teamitem,
                   data:areaName,
                //    ['龙门街道','开发区','桃园街道','前曹镇','恩城镇','王凤楼镇','王杲铺镇','张华镇','王庙镇','腰站镇','王打卦镇','三唐乡','坊子乡'],
                    axisPointer: {
                        type: 'shadow'
                    },
                    axisLabel: {
                        show: true,
                        rotate:30,
                        textStyle: {
                            color:'aliceblue',
                            fontSize:8,
                        },
                        interval:0
                    },
                    axisLine: {
                        lineStyle: {
                            color: 'aliceblue'
                        }
                    },
                }
            ],
            yAxis: [
                {
                    type: 'value',
                    axisLabel: {
                        formatter: '{value}',
                        show: true,
                        textStyle: {
                            color:'aliceblue',
                            fontSize:10
                        }
                    },
                    axisLine: {
                        lineStyle: {
                            color: 'aliceblue'
                        }
                    },
                    splitLine:{
                        show:true
                    }
                },
                {
                    type: 'value',
                    axisLabel: {
                        formatter: '{value}',
                        show: false,
                        textStyle: {
                            color:'aliceblue',
                            fontSize:10
                        }
                    },
                    splitLine:{
                        show:false
                    }
                }
            ],
            series: [
                {
                    name:'应检查家数',
                    type:'bar',
                   // stack: '总量',
                    data:numberEnterprise
                },
                {
                    name:'已检查家数',
                    type:'bar',
                   // stack: '总量',
                   // barWidth : 25,
                    data:checkEnterprise
                },
                {
                    name:'应检查次数',
                    type:'line',
                    yAxisIndex: 1,
                    data:shouldCheck
                },
                {
                    name:'已检查次数',
                    type:'line',
                    yAxisIndex: 1,
                    data:haveCheck
                }
            ]
        });
    }
   
    render() {
     
      
        return (
            <div>

               
   <div ref='bar1' style={{height: '340px',width:'100%',marginTop:0,marginLeft:'auto'}}></div>
                       
               
                       
                
            </div>
        )
    }
}

export default PlaceSituation