import React, { Component } from 'react';
import { Col, Row, Modal, Table } from 'antd';
import './style.less';
import echarts from 'echarts/lib/echarts';

class FoodBusiness extends Component {
    constructor(props) {
        super(props);
        this.state = {
            data1: [],
            data4: [],
            data3: []
        }
    }
    componentDidMount() { }
    componentWillReceiveProps(nextProps, nextContext) {
        this.createCharts1(nextProps.data1);
        this.createCharts2(nextProps.data2);
        this.createCharts3(nextProps.data3);
        this.createCharts4(nextProps.data4);
    }
    createCharts1(data1) {
        const myBar = echarts.init(this.refs.charts1);
        // const data1 = this.props.data1;
        //   console.log(data1)
        myBar.setOption({
            tooltip: {
                trigger: 'item',
                formatter: "{a} <br/>{b} : {d}%"
            },
            title: {
                text: '投诉来源',
                x: 'center',
                y: 10,
                textStyle: {
                    fontSize: 16,
                    color: 'black',
                    fontWeight: 'normal'
                },
            },
            legend: {
                //  data:['不合格','合格','总批次'],
                // textStyle: {
                //     color: '#6593B7'
                // },
                y: 'bottom'
            },
            series: [
                {
                    name: '投诉来源',
                    type: 'pie',
                    radius: '60%',
                    data: data1,
                    label: {
                        normal: {
                            formatter: '{b}',
                        }
                    }
                }
            ]
        });
    }
    createCharts2(data2) {
        const myBar = echarts.init(this.refs.charts2);
        // const data1 = this.props.data1;
        //   console.log(data1)
        myBar.setOption({
            tooltip: {
                trigger: 'item',
                formatter: "{a} <br/>{b} : {d}%"
            },
            title: {
                text: '投诉环节',
                x: 'center',
                y: 10,
                textStyle: {
                    fontSize: 16,
                    color: 'black',
                    fontWeight: 'normal'
                },
            },
            legend: {
                //  data:['不合格','合格','总批次'],
                // textStyle: {
                //     color: '#6593B7'
                // },
                y: 'bottom'
            },
            series: [
                {
                    name: '投诉来源',
                    type: 'pie',
                    radius: '60%',
                    data: data2,
                    label: {
                        normal: {
                            formatter: '{b}',
                        }
                    }
                }
            ]
        });
    }
    createCharts3(data3) {
        //   console.log(data3)
        const myBar = echarts.init(this.refs.charts3);
        const type = data3.map((item) => {
            return item.type;
        })
        const number = data3.map((item) => {
            return item.number;
        })
        myBar.setOption({
           // color: ['#90C589', '#E25B33', '#86C2CF'],
            //backgroundColor: 'rgba(46, 126, 139, 0.00)',
            tooltip: {
                trigger: 'item',
                formatter: "{b} : {c}"
            },
            title: {
                text: '投诉分布',
                x: 'center',
                y: 10,
                textStyle: {
                    fontSize: 16,
                    color: 'black',
                    fontWeight: 'normal'
                },
            },
            legend: {
                //  data:['合格','不合格','快检总批次'],
                textStyle: {
                    color: '#6593B7'
                },
                itemWidth: 10,
                itemHeight: 10,
                top: 'bottom',
            },
            xAxis: [{
                type: 'category',
                boundaryGap: true,
                data: type,
                axisLine: {
                    lineStyle: {
                        color: '#6593B7'
                    }
                },
                axisLabel: {
                    color: '#6593B7',
                    interval: 0,  //类目全显
                    fontSize: 14,
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
                    name: '投诉分布',
                    type: 'bar',
                    data: number,
                    barWidth: 30
                }

            ]
        });
    }
    createCharts4(data4) {
        const myBar = echarts.init(this.refs.charts4);
        let sum = 0;
        data4.forEach(item => {
            sum += item.value * 1 // *1保证sum值为数值
        })
       //  console.log(data4)
        myBar.setOption({
            title: {
                // text: '食品类别快检检查指标',
                x: 'center',
                textStyle: {//主标题文本样式{"fontSize": 18,"fontWeight": "bolder","color": "#333"}
                    fontSize: 16,
                    color: '#FFFFFF',
                    fontWeight: 'normal'
                },
            },
            tooltip: {
                trigger: 'item',
                formatter: "{a} <br/>{b} : {d}%"
            },
            legend: {
                textStyle: {
                    color: '#6593B7'
                },
                itemWidth: 20,
                itemHeight: 10,
                top: 'bottom',
            },
            graphic: [{ //环形图中间添加文字
                type: 'text', //通过不同top值可以设置上下显示
                left: 'center',
                top: '46%',
                style: {
                    text: '投诉来源',
                    textAlign: 'center',
                    fill: '#606FB4', //文字的颜色
                    width: 30,
                    height: 30,
                    fontSize: 26,
                    fontFamily: "Microsoft YaHei"
                }
            },
            { //环形图中间添加文字
                type: 'text', //通过不同top值可以设置上下显示
                left: 'center',
                top: '55%',
                style: {
                    text: sum,
                    textAlign: 'center',
                    fill: '#F1C44F', //文字的颜色
                    width: 30,
                    height: 30,
                    fontSize: 26,
                    fontFamily: "Microsoft YaHei"
                }
            }],
            series: [
                {
                    name: '投诉来源',
                    type: 'pie',
                    radius: ['40%', '80%'],
                    center:["50%","50%"],        
                    data: data4,
                    itemStyle: {
                        emphasis: {
                            shadowBlur: 10,
                            shadowOffsetX: 0,
                          //  shadowColor: 'rgba(0, 0, 0, 0.5)'
                        }
                    },
                    label: {
                        normal: {
                            formatter: '{c}次',
                        }
                    }
                }
            ]
        });
    }

    render() {
     //     console.log(this.props.data4)
        return (

            <div >
                <div className='box' style={{ marginLeft: 80, marginTop: 20,float: 'left' }}>
                    <div className='boxName' style={{ color: '#479AD0' }}>投诉统计</div>
                    <div className='boxNumber' style={{ backgroundColor: '#479AD0' }}>{this.props.total}</div>
                </div>
                <div ref='charts1' style={{ height: '300px',marginTop: 20, width: '400px', float: 'left', marginLeft: 100 }}></div>
                <div ref='charts2' style={{ height: '300px',marginTop: 20, width: '400px', float: 'left', marginLeft: 60 }}></div>
                <div ref='charts3' style={{ height: '300px', width: '1000px', float: 'left', marginLeft: 150, marginTop: 20 }}></div>
                <div ref='charts4' style={{ height: '460px', width: '400px', float: 'left', marginLeft: '34%', marginTop: 20 }}></div>
            </div>
        )
    }
}
export default FoodBusiness;
