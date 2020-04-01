import React, { Component } from 'react';
import echarts from 'echarts'
import 'echarts-liquidfill'

class PlaceSituation extends Component {
    constructor(props) {
        super(props);
        this.state = {
          
        }
    }
    componentDidMount() {
        // this.createCharts1(this.props.teamitem,this.props.teamyes,this.props.teamno,this.props.teamtotal)
       // this.createCharts()
    }

    componentWillReceiveProps(nextProps, nextContext) {
        // this.createCharts1(nextProps.teamitem,nextProps.teamyes,nextProps.teamno,nextProps.teamtotal)
        this.createCharts(nextProps.enterpriseData)
    }

    createCharts(enterpriseData) {
        const myBar = echarts.init(this.refs.circle1);
        //     var value = 0.48;
        //     var data = [value, value, value, value, value, ];
        //     // 绘制图表
        //     myBar.setOption({
        //       //  backgroundColor: "#000",
        //     //  backgroundColor: '#fff',

        //       graphic: [{
        //           type: 'group',
        //           left: 'center',
        //          // bottom: 10,
        //         //   children: [{
        //         //       type: 'text',
        //         //       z: 100,
        //         //       left: '10',
        //         //       top: 'middle',
        //         //       style: {
        //         //           fill: '#000',
        //         //           //text: '磁盘剩余空间：',
        //         //           font: '16px Microsoft YaHei'
        //         //       }
        //         //   }, {
        //         //       type: 'text',
        //         //       z: 100,
        //         //       left: '120',
        //         //       top: 'middle',
        //         //       style: {
        //         //           fill: '#000',
        //         //        //   text: '128G',
        //         //           font: '24px Microsoft YaHei'
        //         //       }
        //         //   }]
        //       }],
        //       series: [{
        //           type: 'liquidFill',
        //           radius: '70%',
        //           center: ['50%', '50%'],
        //           data: data,
        //           backgroundStyle: {
        //              // borderWidth: 5,
        //               borderColor: '#1daaeb',
        //               color: '#fff'
        //           },
        //           label: {
        //               normal: {
        //                   formatter: (value * 100).toFixed(2) + '%',
        //                   textStyle: {
        //                       fontSize: 20
        //                   }
        //               }
        //           }
        //       }]
        //   })
        var max = 500; //满刻度大小
        var arr = enterpriseData;
        var data = max * arr;
        myBar.setOption({

            title: {
                top: '47%',
                left: 'center',
                text: (arr *100).toFixed(2) + '%',
                textStyle: {
                    color: '#fff',
                    fontStyle: 'normal',
                    fontWeight: 'normal',
                    fontSize: 24
                },
            },
            series: [{
                type: 'liquidFill',
                radius: '70%',
                center: ['50%', '50%'],
                itemStyle: {
                    normal: {
                        opacity: 0.4,
                        shadowBlur: 0,
                        color: "#3B7BF8",
                        shadowColor: '#3B7BF8'
                    }
                },
                color: [new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                        offset: 0,
                        color: "#4A87FF"
                    },
                    {
                        offset: 1,
                        color: '#3B7BF8'
                    }
                ]), new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                        offset: 0,
                        color: "#4A87FF"
                    },
                    {
                        offset: 1,
                        color: '#3B7BF8'
                    }
                ]), new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                        offset: 0,
                        color: "#4A87FF"
                    },
                    {
                        offset: 1,
                        color: '#3B7BF8'
                    }
                ])],
                name: arr,
                data: [{
                    value:enterpriseData,
                    label: {
                        normal: {
                            formatter: (arr * 100).toFixed(2) + '%',
                            textStyle: {
                                fontSize: 20
                            }
                        }
                    },
                    itemStyle: {
                        normal: {
                            color: function (params) {
                                let colorList = [
                                    new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                                        offset: 0,
                                        color: "#4A87FF"
                                    },
                                    {
                                        offset: 1,
                                        color: '#3B7BF8'
                                    }
                                    ]),
                                ];
                                return colorList[params.dataIndex];
                            },
                            // opacity: 1
                        }
                    }
                }],
                background: '#000',
                center: ['50%', '50%'],
                backgroundStyle: {
                    color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                        offset: 0,
                        color: "#3A63E8"
                    },
                    {
                        offset: 1,
                        color: '#3213AB'
                    }
                    ]),
                },
                label: {
                    normal: {
                        formatter: '',
                        textStyle: {
                            fontSize: 12
                        }
                    }
                },
                outline: {
                    itemStyle: {
                        borderColor: '#3F1EB9',
                        borderWidth: 10
                    },
                    borderDistance: 0
                }
            },
                {
                    "color": [new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                            offset: 0,
                            color: "#5A48E6"
                        },
                        {
                            offset: 1,
                            color: "#FFF"
                        }
                    ]), {
                        type: 'linear',
                        x: 0,
                        y: 0,
                        x2: 1,
                        y2: 0,
                        colorStops: [{
                            offset: 0,
                            color: 'rgba(31,70,240,1)' // 0% 处的颜色
                        }, {
                            offset: 1,
                            color: 'rgba(255,255,255,0.8)' // 100% 处的颜色
                        }]
                    }, 'transparent'],
                    "type": "pie",
                    "center": ["50%", "50%"],
                    "radius": ["70%", "70.5%"],
                    "hoverAnimation": false,
                    "data": [{
                            "name": "",
                           // "value": data,
                            "label": {
                                "show": false,
                                "position": "center",
                                "color": "#fff",
                                "fontSize": 38,
                                "fontWeight": "bold",
                                "formatter": function(o) {
                                    return data
                                }
                            }
                        },
                        { //画中间的图标
                            "name": "",
                           // "value": 0,
                            "label": {
                                show: false,
                                position: 'inside',
                                backgroundColor: {

                                },
                                width: 15,
                                height: 15,
                                borderRadius: 7.5,
                                padding: 6
                            }
                },
                         { //画剩余的刻度圆环
                            "name": "",
                           // "value": max - data,
                            "label": {
                                show: false
                            },
                            labelLine: {
                                show: false
                            }
                        }
                    ]
                }
            // ]
        ]
        })
    }
    render() {
    

        return (
            <div>


                <div ref='circle1' style={{ height: 200, width: '70%', marginTop: 0, marginLeft: 'auto' }}></div>




            </div>
        )
    }
}

export default PlaceSituation