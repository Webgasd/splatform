import React,{Component} from 'react';
import ReactEcharts from 'echarts-for-react';
import CommonTableTitle from "./commonTableTitle";
import echarts from "echarts/lib/echarts";
import LeftBar from "./img/leftBar.png";
import RightBar from "./img/rightBar.png";

class AgencyCost extends Component {
    constructor(props) {
        super(props);
        this.state = {
        }
    }
    componentDidMount() {
        this.createCharts(this.props.expenseorg,this.props.expensebuy,this.props.expensesample,this.props.expensecheck)
    }

    componentWillReceiveProps(nextProps, nextContext) {
        this.createCharts(nextProps.expenseorg,nextProps.expensebuy,nextProps.expensesample,nextProps.expensecheck)
    }

    createCharts(expenseorg,expensebuy,expensesample,expensecheck) {
        const myBar = echarts.init(document.getElementById('agencyTable'));
        // 绘制图表
        myBar.setOption({
            color:['#EA407A','#4BAAF8','#7156F6'],
            tooltip : {
                trigger: 'axis',
                axisPointer : {            // 坐标轴指示器，坐标轴触发有效
                    type : 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
                }
            },
            legend: {
                data: ['买样费', '检测费','采样费'],
                y:10,
                textStyle:{
                    fontSize: 8,
                    color: 'aliceblue',
                },
            },
            grid: {
                x:-30,
                //left: '3%',
                //right: '4%',
               // bottom: '3%',
                containLabel: true
            },
            xAxis:  {
                type: 'value',
                name: '数量',
                color: 'white',
                axisLabel: {
                    formatter: '{value}',
                    show: true,
                    textStyle: {
                        color: 'aliceblue',
                        fontSize:8
                    }
                }
            },
            yAxis: {
                type: 'category',
                data: expenseorg,
                axisLabel: {
                    show: true,
                    textStyle: {
                        color: 'aliceblue',
                        fontSize:8
                    }
                }
            },
            series: [
                {
                    name: '买样费',
                    type: 'bar',
                    barWidth:'25',
                    stack: '总量',
                    label: {
                        normal: {
                            show: true,
                            position: 'insideRight'
                        }
                    },
                    data: expensebuy
                },
                {
                    name: '检测费',
                    type: 'bar',
                    stack: '总量',
                    label: {
                        normal: {
                            show: true,
                            position: 'insideRight'
                        }
                    },
                    data: expensecheck
                },
                {
                    name: '采样费',
                    type: 'bar',
                    stack: '总量',
                    label: {
                        normal: {
                            show: true,
                            position: 'insideRight'
                        }
                    },
                    data: expensesample
                }
            ]
        });
    }

    render() {
        return (
            <div>
                {/* <div style={{color:'#8ECED6',marginLeft:'auto'}}>
                    <img src={LeftBar} alt={''}/>机构所耗费用<img src={RightBar} alt={''}/>
                </div> */}
                   <CommonTableTitle title={'机构所耗费用'}/>
                    <div id='agencyTable' style={{height: '500px', width: '365px',marginTop:0}}></div>
                
            </div>
        )
    }
}

export default AgencyCost