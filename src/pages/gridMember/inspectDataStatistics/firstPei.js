import React, { Component } from 'react';
// 引入 ECharts 主模块
import echarts from 'echarts/lib/echarts';
// 引入柱状图
import  'echarts/lib/chart/bar';
// 引入提示框和标题组件
import 'echarts/lib/component/tooltip';
import 'echarts/lib/component/title';

class FirstPei extends Component {
    componentDidMount() {
        this.initEchart()
    }
    initEchart = () =>{
        // 基于准备好的dom，初始化echarts实例
        var myChart = echarts.init(document.getElementById(this.props.id));
        // 绘制图表
        myChart.setOption({
            title: {
                left: 'center'
            },
            tooltip: {
                trigger: 'item'
            },
            series: [
                {
                    name: '访问来源',
                    type: 'pie',
                    radius: ['60%', '80%'],
                    avoidLabelOverlap: false,
                    label: { 
                        normal: { // normal 是图形在默认状态下的样式
                          show: true,
                          position: 'center',
                          color: '#000',
                          fontSize: 20,
                        //   fontWeight: 'bold',
                          formatter: '问题类型\n'+ (this.props.typeNum/this.props.total).toFixed(4)*100 + '%' 
                        }
                    },
                    labelLine: {
                        show: false
                    },
                    data: [
                        {
                            value: this.props.typeNum, 
                            name: '当前类型问题',
                            itemStyle: {
                                color: '#ff6600'
                            }
                        },
                        {
                            value: this.props.total, 
                            name: '问题总计数量',
                            itemStyle: {
                                color: '#34c084'
                            }
                        },
                    ]
                }
            ]
        });
    }
    componentDidUpdate(){
        this.initEchart()
    }
    render() {
        return (
            <div id={this.props.id} style={{ width: '95%', height: '95%' }}></div>
        );
    }
}

export default FirstPei;