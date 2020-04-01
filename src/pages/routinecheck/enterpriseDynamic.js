import React,{Component} from 'react';
import echarts from 'echarts';
import {Col, Row} from "antd";
import axios from "../../axios";
import ProvinceMap from './provinceMap'
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
        const myBar1 =  echarts.init(this.refs.plac1);
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
        const myBar = echarts.init(this.refs.plac);
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
      
        return (
            <div>

               
                    {this.state.flag==0?<div ref='plac1' style={{height: '400px',width:'100%',marginTop:0,marginLeft:'auto'}}></div>
                        :<div ref='plac' style={{height: '400px', width:'100%',marginTop:0,marginLeft:'auto'}}></div>}
               
              
                          <div className='textbox1' style={{backgroundColor:'#CDCB43' }}>
                          区域企业数量（家）
                           
                          </div>
                       
                <div style={{width:'100%',marginTop:30}}>
                    <Row type="flex" >
                        {/* {this.state.steplist.map((item,index)=>( */}
                            <Col>
                                {/* <div className="textbox3" style={{width:'110px',margin:10}} onClick={()=>{this.handleOperator('detail',item,index)}}>{this.state.steplist[index]}</div> */}
                               
                                <div className="textbox3" style={{width:'110px',margin:10}} >王打卦镇</div>
                            </Col>
                            <Col>
                                {/* <div className="textbox3" style={{width:'110px',margin:10}} onClick={()=>{this.handleOperator('detail',item,index)}}>{this.state.steplist[index]}</div> */}
                               
                                <div className="textbox3" style={{width:'110px',margin:10}} >三唐乡</div>
                            </Col>
                            <Col>
                                {/* <div className="textbox3" style={{width:'110px',margin:10}} onClick={()=>{this.handleOperator('detail',item,index)}}>{this.state.steplist[index]}</div> */}
                               
                                <div className="textbox3" style={{width:'110px',margin:10}} >坊子乡</div>
                            </Col>
                        {/* ))} */}
                    </Row>
                </div>
                {/* <ProvinceMap steplist={this.state.steplist} handleOperator={this.handleOperator} totalstepitem={this.state.totalstepitem} teamitem={this.state.teamitem} teamyes={this.state.teamyes} teamno={this.state.teamno} teamtotal={this.state.teamtotal}></ProvinceMap> */}
            </div>
        )
    }
}

export default PlaceSituation