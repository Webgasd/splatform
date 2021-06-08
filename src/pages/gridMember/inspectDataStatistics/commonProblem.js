import React, { Component } from 'react';
// 引入 ECharts 主模块
import echarts from 'echarts/lib/echarts';
// 引入柱状图
import 'echarts/lib/chart/bar';
// 引入提示框和标题组件
import 'echarts/lib/component/tooltip';
import 'echarts/lib/component/title';

class CommonProblem extends Component {
    componentDidMount() {
        this.initEchart()
    }
    initEchart = () => {
        // 基于准备好的dom，初始化echarts实例
        var myChart = echarts.init(document.getElementById('pei-left'));
        // 绘制图表
        myChart.setOption({
            title: {
                left: 'center'
            },
            tooltip: {
                trigger: 'item'
            },
            // legend: {
            //     orient: 'vertical',
            //     left: 'left',
            // },
            series: [
                {
                    name: '访问来源',
                    type: 'pie',
                    radius: '50%',
                    data: this.props.data?this.props.data:[],
                    emphasis: {
                        itemStyle: {
                            shadowBlur: 10,
                            shadowOffsetX: 0,
                            shadowColor: 'rgba(0, 0, 0, 0.5)'
                        }
                    }
                }
            ]
        });
    }
    componentDidUpdate() {
        this.initEchart()
    }
    render() {
        return (
            <div id="pei-left" style={{ width: '90%', height: '90%' }}></div>
        );
    }
}

export default CommonProblem;