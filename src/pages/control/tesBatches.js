import React,{Component} from 'react';
import echarts from 'echarts/lib/echarts';
import ReactEcharts from 'echarts-for-react';

class tesBatches extends Component {
    constructor(props) {
        super(props);
        this.state = {
            tempTeamData5: []
        }
    }
    componentDidMount(){      
    }
    componentWillReceiveProps(nextProps, nextContext) {
        this.createCharts3(nextProps.tempTeamData5);
    }
   
    createCharts3(tempTeamData5) {   
    //    console.log(tempTeamData5)   
        const myBar = echarts.init(document.getElementById('quickbar'));
        const teamitem  =tempTeamData5.map((item)=>{
            return item.team5;
        })  
        const teambuy  =tempTeamData5.map((item)=>{
            return item.buy5;
        })  
        myBar.setOption({
        tooltip : {
            trigger: 'axis',
            axisPointer : {            // 坐标轴指示器，坐标轴触发有效
                type : 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
            }
        },
        yAxis: {
            type: 'value',
            axisTick: {
                show: false
            },
            axisLine: {
                show: true,
                lineStyle: {
                    color: '#4EC1EF',
                }
            },
            splitLine: {
                show: true,
                lineStyle: {
                    color: '#363e83 ',
                }
            },
            axisLabel: {
                textStyle: {
                    color: '#4EC1EF',
                    fontWeight: 'normal',
                    fontSize: '12',
                },
            },
        },
        xAxis: [{
            type: 'category',
            axisTick: {
                show: false
            },
            axisLine: {
                show: true,
                lineStyle: {
                    color: '#4EC1EF',
                }
            },
            axisLabel: {
                inside: false,
              //  rotate:40,
                textStyle: {
                    color: '#4EC1EF',
                    fontWeight: 'normal',
                    fontSize: '12',
                  
                },
                formatter:function(val){
                    let str = val.split("")
                    switch (str.length) {
                        case 5:
                            return str[3]+str[0]+"\n"+str[4]+str[1]+"\n"+"   "+str[2]
                        case 4:
                            return str[3]+str[0]+"\n"+"   "+str[1]+"\n"+"   "+str[2]
                        default:
                            return val.split("").join("\n")
                    }
                },
            },
           data: teamitem
        }, {
            type: 'category',
            axisLine: {
                show: false
            },
            axisTick: {
                show: false
            },
            axisLabel: {
                show: false
            },
            splitArea: {
                show: false
            },
            splitLine: {
                show: false
            },
            data: teamitem
        },

        ],
        series: [{
        //     type: 'bar',
        //     xAxisIndex: 1,
        //     zlevel: 1,
        //     itemStyle: {
        //         normal: {
        //             color: '#000',
        //             borderWidth: 0,
        //             shadowBlur: {
        //                 shadowColor: 'rgba(255,255,255,0.31)',
        //                 shadowBlur: 10,
        //                 shadowOffsetX: 0,
        //                 shadowOffsetY: 2,
        //             },
        //         }
        //     },
        //     barWidth: '20%',
        //     data: [1000,1000]
        // }, 
        
            name: '',
            type: 'bar',
     
            itemStyle: {
                normal: {
                    show: true,
                    color: function(params) {
                        let colorList = [
                            new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                                offset: 0,
                                color: '#FAC019'
                            }, {
                                offset: 1,
                                color: '#F32021'
                            }]),
                            new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                                offset: 0,
                                color: '#12ABD5'
                            }, {
                                offset: 1,
                                color: '#8F17FB'
                            }]),
                            new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                                offset: 0,
                                color: '#7317D8'
                            }, {
                                offset: 1,
                                color: '#C80DD0'
                            }]),
                            new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                                offset: 0,
                                color: '#C1ED34'
                            }, {
                                offset: 1,
                                color: '#2FAF58'
                            }]),
                            new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                                offset: 0,
                                color: '#40E15E'
                            }, {
                                offset: 1,
                                color: '#14998D'
                            }]),
                            new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                                offset: 0,
                                color: '#14ACD5'
                            }, {
                                offset: 1,
                                color: '#9017FD'
                            }]),
                            new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                                offset: 0,
                                color: '#41E15D'
                            }, {
                                offset: 1,
                                color: '#15988E'
                            }]),
                            new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                                offset: 0,
                                color: '#FDBF18'
                            }, {
                                offset: 1,
                                color: '#F32021'
                            }]),
                            new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                                offset: 0,
                                color: '#14ACD5'
                            }, {
                                offset: 1,
                                color: '#8E19FB'
                            }]),
                            new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                                offset: 0,
                                color: '#7317D7'
                            }, {
                                offset: 1,
                                color: '#C60FD0'
                            }]),
                            new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                                offset: 0,
                                color: '#BFEC34'
                            }, {
                                offset: 1,
                                color: '#30AF57'
                            }]),
                            new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                                offset: 0,
                                color: '#3FDE5E'
                            }, {
                                offset: 1,
                                color: '#14998D'
                            }]),
                        ];
                        return colorList[params.dataIndex];
                    },
                    barBorderRadius: 50,
                    borderWidth: 0,
                }
            },
            zlevel: 2,
            barWidth: '8%',
            data: teambuy
        }
        ]
    });
    }
    render() {
        return (
            <div className='tesBatches'>
                <div className='boxHeader'>各所快检检测批次</div>
                <div id='quickbar' style={{height: '230px', width: '100%', position:'relative', top:'-40px'}} />        
                {/* <ReactEcharts
                    option={this.option}
                    style={{height: '230px', width: '100%', position:'relative', top:'-40px'}} /> */}
            </div>
        )
    }
}

export default tesBatches