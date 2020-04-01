import React,{Component} from 'react';
import ReactEcharts from 'echarts-for-react';
import CommonTableTitle from './commonTableTitle'
import echarts from "echarts/lib/echarts";

class processing extends Component {
    constructor(props) {
        super(props);
        this.state = {
        }
    }
    componentDidMount() {
        this.createCharts(this.props.failedData,this.props.failedname)
    }

    componentWillReceiveProps(nextProps, nextContext) {
        this.createCharts(nextProps.failedData,nextProps.failedname)
    }

    createCharts(failedData,failedname) {
        const myBar = echarts.init(document.getElementById('failedTable'));
        // 绘制图表
        myBar.setOption({
            tooltip : {
                trigger: 'item',
                formatter: "{a} <br/>{b} : {d}%"
            },
            color:['#2C59A1','#F29961','#E15D68','#A682E6','#5DE18F','#bac21a','#057400','#8F544C','#1D82FE','#cb6381','#78878C'],
            legend: {
                orient: 'vertical',
                itemGap:3,
                left: 'left',
                data: failedname,
                textStyle:{
                    fontSize: 8,
                    color: 'aliceblue',
                },
            },
            series : [
                {
                    name: '抽检检查不合格样品',
                    type: 'pie',
                    radius : ['20%', '70%'],
                    data:failedData,
                    itemStyle: {
                        emphasis: {
                            shadowBlur: 10,
                            shadowOffsetX: 0,
                            shadowColor: 'rgba(0, 0, 0, 0.5)'
                        }
                    },
                    label: {
                        normal: {
                            show: true,
                            position: 'inner',
                            formatter: '{d}%',
                            fontSize: 12
                        }
                    }
                }
            ]
        });
    }

    render() {
        return (
            <div className='failedTop'>
                <CommonTableTitle title={'抽检检查不合格样品前十'}/>
                <div className='tdDiv'>
                    <div className='leftTop'></div>
                    <div className='rightTop'></div>
                    <div className='leftBottom'></div>
                    <div className='rightBottom'></div>
                    <div id='failedTable' style={{height: '190px', width: '315px',marginLeft:5,marginTop:5}}></div>
                </div>
            </div>
        )
    }
}

export default processing