import React,{Component} from 'react';
import echarts from 'echarts';
import axios from "../../axios";
class tesBatches extends Component {
    constructor(props) {
        super(props);
        this.state = {
            tempTeamData: []
        }
    }

    componentDidMount(){}
    componentWillReceiveProps(nextProps, nextContext) {
        this.createCharts(nextProps.tempTeamData);
    }
    createCharts(tempTeamData) {
     const myBar = echarts.init(this.refs.quickpie);
     let sum = 0;
        tempTeamData.forEach(item => {
            sum += item.value * 1 // *1保证sum值为数值
        })
    // console.log(sum)
        myBar.setOption({
            title : {
                text: '食品类别快检批次',
                x:'center',
               
                 textStyle: {//主标题文本样式{"fontSize": 18,"fontWeight": "bolder","color": "#333"}
                fontSize: 16,
                color:'#FFFFFF',
                fontWeight:'normal'
               },
            },
            tooltip:{
                trigger: 'item',
                formatter: "{a} <br/>{b} : {d}%"
            },
            graphic: [{ //环形图中间添加文字
                type: 'text', //通过不同top值可以设置上下显示
                left: 'center',
                top: '55%',
                style: {
                    text:sum,
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
                top: '65%',
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
            series : [
                {
                    name: '快检检测数值',
                    type: 'pie',
                    center:['50%', '60%'],
                    radius : ['60%', '70%'],
                    data:tempTeamData,
                    itemStyle: {
                        emphasis: {
                            shadowBlur: 10,
                            shadowOffsetX: 0,
                            shadowColor: 'rgba(0, 0, 0, 0.5)'
                        }
                    },
                    label: {
                            normal: {
                                formatter: '{a|{b}}{abg|}\n{hr|}\n  {b|{c}}\n  {per|{d}%}',
                             rich: {
                                    a: {                     
                                        lineHeight: 30,
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
                                        fontSize: 14,
                                        lineHeight: 0,
                                        padding:[0,0,10,0] ,
                                    },
                                    per: {
                                        color: '#eee',
                                        fontSize: 10,
                                        padding:[0,0,5,0]
                                    }
                                }
                        }
                    }
                }
            ]
        });
    }
    
        render() {
            const total=this.props.total1;
            return (
                <div className='processing' >
                        <div ref='quickpie' style={{float:'left',marginLeft: '22px',width:'320px',height: '260px'}}></div>                      
                </div>
            )
        }
    }
    
    export default tesBatches