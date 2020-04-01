import React, {Component} from 'react';
import CommonTableTitle from "./commonTableTitle";
import echarts from "echarts/lib/echarts";

class foodType extends Component {
    constructor(props) {
        super(props);
        this.state = {
            tempTeamData: []
        }
    }

    componentDidMount() {
    }

    componentWillReceiveProps(nextProps, nextContext) {
        this.createCharts(nextProps.tempTeamData);
        console.dir(nextProps);
    }

    //从大到小排序
    sortNumber = (a, b) => {
        return b - a;
    };

    createCharts(tempTeamData) {
        const myBar = echarts.init(this.refs.office9);
        let sum = 0;
        tempTeamData.forEach(item => {
            sum += item.value * 1 // *1保证sum值为数值
        });
        // console.dir(tempTeamData);
        // let tempTeamDataNum = [];
        // tempTeamData.map((item, index) => {
        //     tempTeamDataNum[index] = item.value;
        // });
        // console.log(tempTeamDataNum);
        // let tempTeamDataSort = tempTeamDataNum.sort(this.sortNumber);
        // console.dir(tempTeamDataSort);
        // console.log(sum)
        myBar.setOption({
//             title : {
//                // text: '食品类别快检检查指标',
//                 x:'center',
//                  textStyle: {//主标题文本样式{"fontSize": 18,"fontWeight": "bolder","color": "#333"}
//                 fontSize: 16,
//                 color:'#FFFFFF',
//                 fontWeight:'normal'
//                },
//             },
            tooltip: {
                trigger: 'item',
                formatter: "{a} <br/>{b} : {d}%"
            },
            graphic: [{ //环形图中间添加文字
                type: 'text', //通过不同top值可以设置上下显示
                left: 'center',
                top: '45%',
                style: {
                    text: sum,
                    textAlign: 'center',
                    fill: '#F1C44F', //文字的颜色
                    width: 30,
                    height: 30,
                    fontSize: 18,
                    fontFamily: "Microsoft YaHei"
                }
            },
                { //环形图中间添加文字
                    type: 'text', //通过不同top值可以设置上下显示
                    left: 'center',
                    top: '55%',
                    style: {
                        text: '食品类别快检检测数值',
                        textAlign: 'center',
                        fill: '#606FB4', //文字的颜色
                        width: 30,
                        height: 30,
                        fontSize: 12,
                        fontFamily: "Microsoft YaHei"
                    }
                }],
            series: [
                {
                    name: '快检检测数值',
                    type: 'pie',
                    radius: ['60%', '70%'],
                    data: tempTeamData,
                    avoidLabelOverlap: true,//不重叠
                    itemStyle: {
                        emphasis: {
                            shadowBlur: 10,
                            shadowOffsetX: 0,
                            shadowColor: 'rgba(0, 0, 0, 0.5)'
                        }
                    },
                    label: {
                        normal: {
                            // formatter: '{a|{b}}{abg|}\n{hr|}\n  {b|{c}}\n  {per|{d}%}',
                            formatter: '{a|{b}}{abg|}{b|{c}}',
                            rich: {
                                a: {
                                    lineHeight: 25,
                                    align: 'center',
                                    fontSize: 10,
                                },
                                hr: {
                                    borderColor: '#aaa',
                                    width: '100%',
                                    borderWidth: 0.5,
                                    height: 0
                                },
                                b: {
                                    fontSize: 10,
                                    lineHeight: 0,
                                    padding: [0, 0, 0, 5],
                                },
                                per: {
                                    color: '#eee',
                                    fontSize: 10,
                                    padding: [0, 0, 5, 0]
                                }
                            }
                        }
                    }
                }
            ]
        });
    }

    render() {
        return (
            <div>
                <CommonTableTitle title={'食品类别快检检查指标'} style={{width: '380px'}}/>


                <div ref='office9' style={{float: 'left', width: '380px', height: '225px'}}></div>
                <div style={{float: 'left', fontSize: 10, marginTop: -20, marginLeft: '82%', color: 'white'}}>单位：批次
                </div>
            </div>

        )
    }
}

export default foodType