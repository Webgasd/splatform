import React,{Component} from 'react';
import CommonTableTitle from "./commonTableTitle";
import echarts from "echarts/lib/echarts";
import {Row,Col} from 'antd'
import axios from "../../axios";
import './style.less'
import LeftBar from "./img/leftBar.png";
import RightBar from "./img/rightBar.png";

class PlaceSituation extends Component {
    constructor(props) {
        super(props);
        this.state = {
            list:[],
            flag:0
        }
    }
    componentDidMount() {
        this.createCharts1(this.props.stepitem,this.props.steptotal,this.props.stepyes,this.props.stepno)
    }

    componentWillReceiveProps(nextProps, nextContext) {
        this.createCharts1(nextProps.stepitem,nextProps.steptotal,nextProps.stepyes,nextProps.stepno)
    }

    createCharts1(stepitem,steptotal,stepyes,stepno) {
        const myBar1 = echarts.init(document.getElementById('business1Table'));
        // 绘制图表
        myBar1.setOption({
            color:['#E15D68','#F8F85B','#479AD0'],
            tooltip: {
                trigger: 'axis',
            },
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
                    data: stepitem,
                    axisPointer: {
                        type: 'shadow'
                    },
                    axisLabel: {
                        show: true,
                        rotate:30,
                        textStyle: {
                            color:'aliceblue',
                            fontSize:9
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
                            color:'aliceblue'  //这里用参数代替了
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
                    barWidth : 25,
                    data:stepyes
                },
                {
                    name:'不合格',
                    type:'bar',
                    barWidth : 25,
                    data:stepno
                },
                {
                    name:'总批次',
                    type:'bar',
                    barWidth : 25,
                    //type:'line',
                    //yAxisIndex: 1,
                    data:steptotal
                }
            ]
        });
    }

    createCharts() {
        const myBar = echarts.init(document.getElementById('businessTable'));
        // 绘制图表
        const teamstepstep=this.state.teamstepstep;
        const teamsteptotal=this.state.teamsteptotal;
        const teamstepyes=this.state.teamstepyes;
        const teamstepno=this.state.teamstepno;
        myBar.setOption({
            color:['#E15D68','#F8F85B','#479AD0'],
            tooltip: {
                trigger: 'axis',
            },
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
                    data: teamstepstep,
                    axisPointer: {
                        type: 'shadow'
                    },
                    axisLabel: {
                        show: true,
                        rotate:30,
                        textStyle: {
                            color:'aliceblue',
                            fontSize:9
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
                            color:'aliceblue'  //这里用参数代替了
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
                    barWidth : 25,
                    data:teamstepyes
                },
                {
                    name:'不合格',
                    type:'bar',
                    barWidth : 25,
                    data:teamstepno
                },
                {
                    name:'总批次',
                    type:'bar',
                    barWidth : 25,
                    // type:'line',
                    // yAxisIndex: 1,
                    data:teamsteptotal
                }
            ]
        });
    }
    handleOperator = (type,item,index)=>{
        if(type =='detail'){
            axios.ajax({
                url: '/spotCheckStatistics/getListTeamStepSingleResultByTeam',
                data: {
                    params: {
                        team:this.state.list[index]
                    }
                }
            }).then((res)=>{
                if(res.status == 'success'){
                    let teamstep  = res.data.map((item,i)=>{
                        item.key = i;
                        return item;})
                    let teamstepstep  = teamstep.map((item,i)=>{
                        item.key = i;
                        return item.step;})
                    let teamsteptotal  = teamstep.map((item,i)=>{
                        item.key = i;
                        return item.total;})
                    let teamstepyes  = teamstep.map((item,i)=>{
                        item.key = i;
                        return item.yes;})
                    let teamstepno  = teamstep.map((item,i)=>{
                        item.key = i;
                        return item.no;})
                    this.setState({
                        teamstep:teamstep,
                        teamstepstep:teamstepstep,
                        teamsteptotal:teamsteptotal,
                        teamstepyes:teamstepyes,
                        teamstepno:teamstepno,
                        flag:1
                    })
                }this.createCharts()
            //    console.log(this.state.teamstep)
            })
        }
    }
    render() {
        this.state.list=this.props.totalteamitem||[];
     //   console.log(this.state.list[0])
        return (
            <div>
                {/* <div style={{color:'#8ECED6',marginLeft:135,marginTop:-15}}>
                    <img src={LeftBar} alt={''}/>各业态环节抽检检测情况<img src={RightBar} alt={''}/>
                </div> */}
                <CommonTableTitle title={'各业态环节抽检检测情况'}/>
                    {this.state.flag==0?<div id='business1Table' style={{height: '230px', width: '540px',marginTop:15,marginLeft:'auto'}}></div>
                        :<div id='businessTable' style={{height: '230px', width: '540px',marginTop:15,marginLeft:'auto'}}></div>}
            
                <div style={{width:520,margin:'auto',border:'1.5px solid #3CA6DA'}}>
                    <Row type="flex">
                    {this.state.list.map((item,index)=>(
                        <Col>
                            <div className="textButton1" onClick={()=>{this.handleOperator('detail',item,index)}}>{this.state.list[index]}</div>
                        </Col>
                    ))}
                    </Row>
                </div>
            </div>
        )
    }
}

export default PlaceSituation