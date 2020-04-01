import React,{Component} from 'react';
import echarts from "echarts/lib/echarts";
import {Col, Row} from "antd";
import axios from "../../axios";
import LeftBar from "./img/leftBar.png";
import RightBar from "./img/rightBar.png";
import CommonTableTitle from "./commonTableTitle";
class PlaceSituation extends Component {
    constructor(props) {
        super(props);
        this.state = {
            steplist:[],
            flag:0
        }
    }
    componentDidMount() {
        this.createCharts1(this.props.teamitem,this.props.teamyes,this.props.teamno,this.props.teamtotal)
        //this.createCharts()
    }

    componentWillReceiveProps(nextProps, nextContext) {
        this.createCharts1(nextProps.teamitem,nextProps.teamyes,nextProps.teamno,nextProps.teamtotal)
        //this.createCharts()
    }

    createCharts1(teamitem,teamyes,teamno,teamtotal) {
        const myBar1 = echarts.init(document.getElementById('place1Table'));
        // 绘制图表
        myBar1.setOption({
            color:['#E15D68','#E8E858','#61A0A8'],
            tooltip: {
                trigger: 'axis',
            },
            toolbox: {
                show:false,
                feature: {
                    dataView: {show: true, readOnly: false},
                    magicType: {show: true, type: ['line', 'bar']},
                    restore: {show: true},
                    saveAsImage: {show: true}
                }
            },
            // grid:{
            //     y:25
            // },
            legend: {
                data:['合格','不合格','总批次'],
                textStyle: {
                    color:'aliceblue',
                    fontSize:9
                },
            },
            xAxis: [
                {
                    type: 'category',
                    data: teamitem,
                    axisPointer: {
                        type: 'shadow'
                    },
                    axisLabel: {
                        show: true,
                        rotate:30,
                        textStyle: {
                            color:'aliceblue',
                            fontSize:8,
                        },
                        interval:0
                    },
                    axisLine: {
                        lineStyle: {
                            color: 'aliceblue'
                        }
                    },
                }
            ],
            yAxis: [
                {
                    type: 'value',
                    axisLabel: {
                        formatter: '{value}',
                        show: true,
                        textStyle: {
                            color:'aliceblue',
                            fontSize:10
                        }
                    },
                    axisLine: {
                        lineStyle: {
                            color: 'aliceblue'
                        }
                    },
                    splitLine:{
                        show:true
                    }
                },
                {
                    type: 'value',
                    axisLabel: {
                        formatter: '{value}',
                        show: false,
                        textStyle: {
                            color:'aliceblue',
                            fontSize:10
                        }
                    },
                    splitLine:{
                        show:false
                    }
                }
            ],
            series: [
                {
                    name:'合格',
                    type:'bar',
                    stack: '总量',
                    data:teamyes
                },
                {
                    name:'不合格',
                    type:'bar',
                    stack: '总量',
                    barWidth : 25,
                    data:teamno
                },
                {
                    name:'总批次',
                    type:'line',
                    yAxisIndex: 1,
                    data:teamtotal
                }
            ]
        });
    }
    createCharts() {
        const myBar = echarts.init(document.getElementById('placeTable'));
        const teamitem=this.state.teamitem;
        const teamyes=this.state.teamyes;
        const teamno=this.state.teamno;
        const teamtotal=this.state.teamtotal;
     //   console.log(this.state.teamitem)
        // 绘制图表
        myBar.setOption({
            color:['#E15D68','#E8E858','#61A0A8'],
            tooltip: {
                trigger: 'axis',
            },
            toolbox: {
                show:false,
                feature: {
                    dataView: {show: true, readOnly: false},
                    magicType: {show: true, type: ['line', 'bar']},
                    restore: {show: true},
                    saveAsImage: {show: true}
                }
            },
            // grid:{
            //    x:-30
            // },
            legend: {
                data:['合格','不合格','总批次'],
                textStyle: {
                    color:'aliceblue',
                    fontSize:9
                },
            },
            xAxis: [
                {
                    type: 'category',
                    data: teamitem,
                    axisPointer: {
                        type: 'shadow'
                    },
                    axisLabel: {
                        show: true,
                        rotate:30,
                        textStyle: {
                            color:'aliceblue',
                            fontSize:8,
                        },
                        interval:0
                    },
                    axisLine: {
                        lineStyle: {
                            color: 'aliceblue'
                        }
                    },
                }
            ],
            yAxis: [
                {
                    type: 'value',
                    axisLabel: {
                        formatter: '{value}',
                        show: true,
                        textStyle: {
                            color:'aliceblue',
                            fontSize:10
                        }
                    },
                    axisLine: {
                        lineStyle: {
                            color: 'aliceblue'
                        }
                    },
                    splitLine:{
                        show:true
                    }
                },
                {
                    type: 'value',
                    axisLabel: {
                        formatter: '{value}',
                        show: false,
                        textStyle: {
                            color:'aliceblue',
                            fontSize:10
                        }
                    },
                    splitLine:{
                        show:false
                    }
                }
            ],
            series: [
                {
                    name:'合格',
                    type:'bar',
                    stack: '总量',
                    data:teamyes
                },
                {
                    name:'不合格',
                    type:'bar',
                    stack: '总量',
                    barWidth : 25,
                    data:teamno
                },
                {
                    name:'总批次',
                    type:'line',
                    yAxisIndex: 1,
                    data:teamtotal
                }
            ]
        });
    }
    handleOperator = (type,item,index)=>{
        if(type =='detail'){
            axios.ajax({
                url: '/spotCheckStatistics/getListTeamStepAllResultByStep',
                data: {
                    params: {
                        step:this.state.steplist[index]
                    }
                }
            }).then((res)=>{
                if(res.status == 'success'){
                    let stepteam  = res.data.map((item,i)=>{
                        item.key = i;
                        return item;})
                    let teamitem  = stepteam.map((item,i)=>{
                        item.key = i;
                        return item.team;})
                    let teamyes  = stepteam.map((item,i)=>{
                        item.key = i;
                        return item.yes;})
                    let teamno  = stepteam.map((item,i)=>{
                        item.key = i;
                        return item.no;})
                    let teamtotal  = stepteam.map((item,i)=>{
                        item.key = i;
                        return item.total;})
                    this.setState({
                        stepteam:stepteam,
                        teamitem:teamitem,
                        teamyes:teamyes,
                        teamno:teamno,
                        teamtotal:teamtotal,
                        flag:1
                    })
                }this.createCharts()
              //  console.log(this.state.teamitem)
            })
        }
    }
    render() {
        this.state.steplist=this.props.totalstepitem||[];
       // console.log(this.state.steplist[0])
       // console.log(this.state.flag)
        return (
            <div>
                   <CommonTableTitle title={'各所抽检检测情况'}/>
                {/* <div style={{color:'#8ECED6',marginLeft:160}}>
                    <img src={LeftBar} alt={''}/>各所抽检检测情况<img src={RightBar} alt={''}/>
                </div> */}
               
                    {this.state.flag==0?<div id='place1Table' style={{height: '250px', width: '560px',marginTop:0,marginLeft:'auto'}}></div>
                        :<div id='placeTable' style={{height: '250px', width: '560px',marginTop:0,marginLeft:'auto'}}></div>}
               
                <div style={{width:500,margin:'auto',border:'1.5px solid #3CA6DA'}}>
                    <Row type="flex" >
                        {this.state.steplist.map((item,index)=>(
                            <Col>
                                <div className="textButton1" onClick={()=>{this.handleOperator('detail',item,index)}}>{this.state.steplist[index]}</div>
                            </Col>
                        ))}
                    </Row>
                </div>
            </div>
        )
    }
}

export default PlaceSituation