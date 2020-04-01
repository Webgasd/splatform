import React,{Component} from 'react';
import echarts from 'echarts/lib/echarts';
import ReactEcharts from 'echarts-for-react';
import CommonTableTitle from './commonTableTitle'

class qualifiedNumber extends Component {
    constructor(props) {
        super(props);
        this.state = {
        }
    }

    option = {
        tooltip : {
            trigger: 'axis',
            axisPointer : {            // 坐标轴指示器，坐标轴触发有效
                type : 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
            }
        },
        xAxis: {
            type : 'category',
            data: ['趵突泉','大明湖','甸柳','东关','建新新村','解放路','龙洞','千佛山','泉城路','文东','燕山','姚家','致远'],
            axisLine: {
                lineStyle: {
                    color: '#6593B7'
                }
            },
            axisLabel: {
                color:'#6593B7',
                rotate:50,
                interval:0
            },
            axisTick: {
                alignWithLabel: true
            }
        },
        yAxis: {
            name:'数量',
            type: 'value',
            axisLine: {
                lineStyle: {
                    color: '#6593B7'
                }
            },
            axisLabel: {
                formatter: '{value}',
                color:'#6593B7',
            }
        },
        dataZoom: [
            {
                type: 'inside'
            }
        ],
        series: [
            {
                name:'复验合格数量',
                type: 'bar',
                barWidth: '40%',
                itemStyle: {
                    normal: {
                        color: new echarts.graphic.LinearGradient(
                            0, 0, 0, 1,
                            [
                                {offset: 0, color: '#D10CD2'},
                                {offset: 0.5, color: '#A015D5'},
                                {offset: 1, color: '#7416DD'}
                            ]
                        )
                    },
                    emphasis: {
                        color: new echarts.graphic.LinearGradient(
                            0, 0, 0, 1,
                            [
                                {offset: 0, color: '#7416DD'},
                                {offset: 0.7, color: '#A015D5'},
                                {offset: 1, color: '#D10CD2'}
                            ]
                        )
                    }
                },
                data: [50,80,80,50,80,80,40,60,70,80,70,50,90]
            }
        ]
    };

    render() {
        return (
            <div className='qualifiedNumber'>
                <CommonTableTitle title={'复验合格数量'}/>
                <div className='tdDiv'>
                    <div className='leftTop'></div>
                    <div className='rightTop'></div>
                    <div className='leftBottom'></div>
                    <div className='rightBottom'></div>
                    <ReactEcharts
                        option={this.option}
                        style={{height: '230px', width: '386px'}} />
                </div>
            </div>
        )
    }
}

export default qualifiedNumber