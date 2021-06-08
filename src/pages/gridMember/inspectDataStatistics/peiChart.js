import React, { Component } from 'react';
// 引入 ECharts 主模块
import echarts from 'echarts/lib/echarts';
// 引入柱状图
import 'echarts/lib/chart/bar';
// 引入提示框和标题组件
import 'echarts/lib/component/tooltip';
import 'echarts/lib/component/title';

class PeiChart extends Component {

    componentDidMount() {
        this.initEcharts()
    }
    initEcharts = ()=>{
        // 基于准备好的dom，初始化echarts实例
        var myChart = echarts.init(document.getElementById('pei'));
        // 绘制图表
        myChart.setOption({
            tooltip: {
                trigger: 'item'
            },
            legend: {
                top: '-1%',
                left: 'left'
            },
            series: [
                {
                    name: '访问来源',
                    type: 'pie',
                    radius: ['50%', '70%'],
                    avoidLabelOverlap: false,
                    label: {
                        normal: { // normal 是图形在默认状态下的样式
                            show: true,
                            position: 'center',
                            color: '#000',
                            fontSize: 20,
                            //   fontWeight: 'bold',
                            formatter: '有效率\n' + this.props.valid&&this.props.total!=0?(this.props.valid/this.props.total).toFixed(4)*100 + '%':'无数据'
                        }
                    },
                    // emphasis: {
                    //     label: {
                    //         show: true,
                    //         fontSize: '18',
                    //         fontWeight: 'bold'
                    //     }
                    // },
                    labelLine: {
                        show: false
                    },
                    data: [
                        {
                            value: this.props.valid,
                            name: '有效问题数',
                            itemStyle: {
                                color: '#ff6600'
                            }
                        },
                        {
                            value: this.props.total,
                            name: '总计问题数',
                            itemStyle: {
                                color: '#34c084'
                            }
                        },
                    ]
                }
            ]
        });
    }
    componentDidUpdate() {
        this.initEcharts()
    }
    render() {
        return (
            <div id="pei" style={{ width: '95%', height: '95%' }}></div>
        );
    }
}

export default PeiChart;