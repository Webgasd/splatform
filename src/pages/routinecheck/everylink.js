import React, {Component} from 'react';
import echarts from "echarts/lib/echarts";
import {Col, Row} from "antd";
import axios from "../../axios";
import {promised} from 'q';


class PlaceSituation extends Component {
    constructor(props) {
        super(props);
        this.state = {

            haveChecked: [1, 1, 1],
            shouldChecked: [1, 0.5, 0.5]
        }
    }

    componentDidMount() {
        // this.createCharts1()
        //this.createCharts()
    }

    componentWillReceiveProps(nextProps, nextContext) {
        this.createCharts1()
        //this.createCharts()
    }

    createCharts1 = () => {
        const myBar1 = echarts.init(this.refs.plac1);
        // 绘制图表
        // console.log(this.state.haveChecked)
        myBar1.setOption({
            tooltip: {},
            legend: {
                textStyle: {
                    color: '#fff',
                    // backgroundColor: '#999',
                    borderRadius: 3,

                    // padding: [3, 5]
                },
                top: '5%',
                data: ['应完成检查（次数）', '已完成检查（次数）']
            },
            radar: {
                // shape: 'circle',
                center: ['50%', '64%'], // 图的位置
                name: {
                    textStyle: {
                        color: '#fff',
                        // backgroundColor: '#999',
                        borderRadius: 3,
                        // padding: [3, 5]
                    }
                },
                indicator: [
                    {name: '餐饮服务', max: 2000},
                    {name: '食品流通', max: 2000},

                    {name: '食品生产', max: 2000},
                ]
            },
            series: [{
                //name: '预算 vs 开销（Budget vs spending）',
                type: 'radar',
                areaStyle: {normal: {}},
                data: [

                    {
                        value: this.state.haveChecked,
                        name: '已完成检查（次数）',
                        itemStyle: {
                            normal: {
                                color: '#CFFDF0',
                                // lineStyle: {
                                //     color: 'rgba(255,225,0,.3)',
                                // },
                            },
                        },
                    },
                    {
                        value: this.state.shouldChecked,
                        name: '应完成检查（次数）',
                        itemStyle: {
                            normal: {
                                color: '#DD5853',
                                // lineStyle: {
                                //     color: 'rgba(255,225,0,.3)',
                                // },
                            },
                        },
                    },
                ]
            }]
        })
    }
    // createCharts=(index)=> {
    //    let myBar = echarts.init(this.refs.plac);
    // //   let index  = index.map((item)=>{
    // //     return  res.data.areaCount[item.id].foodCommon.haveCheck+
    // //     res.data.areaCount[item.id].foodCirculate.haveCheck+
    // //     res.data.areaCount[item.id].foodProduce.haveCheck

    // // })
    //    console.log(index)
    //     // 绘制图表

    //         myBar.setOption({
    //             tooltip: {},
    //             legend: {
    //                 textStyle:{
    //                     color: '#fff',
    //                     // backgroundColor: '#999',
    //                     borderRadius: 3,

    //                     // padding: [3, 5]
    //                 },
    //                 top:'5%',
    //                 data: ['应完成检查（次数）', '已完成检查（次数）']
    //             },
    //             radar: {
    //                 // shape: 'circle',
    //                 center:['50%','64%'], // 图的位置
    //                 name: {
    //                     textStyle: {
    //                         color: '#fff',
    //                        // backgroundColor: '#999',
    //                         borderRadius: 3,
    //                         // padding: [3, 5]
    //                     }
    //                 },
    //                 indicator: [
    //                     { name: '餐饮服务', max: 160},
    //                     { name: '食品流通', max: 650},                      
    //                     { name: '食品生产', max: 300},
    //                 ]
    //             },
    //             series: [{
    //                // name: '预算 vs 开销（Budget vs spending）',
    //                 type: 'radar',
    //                 areaStyle: {normal: {}},
    //                 data : [
    //                     {
    //                         value :[10,10,10],
    //                         name : '已完成检查（次数）',
    //                         itemStyle: {
    //                             normal: {
    //                                 color: '#CFFDF0',
    //                                 // lineStyle: {
    //                                 //     color: 'rgba(255,225,0,.3)',
    //                                 // },
    //                             },
    //                         },
    //                     },
    //                     {
    //                         value :[10,10,10],
    //                         name : '应完成检查（次数）',
    //                         itemStyle: {
    //                             normal: {
    //                                 color: '#DD5853',
    //                                 // lineStyle: {
    //                                 //     color: 'rgba(255,225,0,.3)',
    //                                 // },
    //                             },
    //                         },
    //                     },

    //                 ]
    //             }]
    //         })
    //     }

    handleOperator = (item, index1, index2) => {

        //console.log(index2)
        let that = this
        let p = new Promise(function (resolve, reject) {
            that.setState({
                shouldChecked: index1,
                haveChecked: index2,

            });
            let index = {
                index1,
                index2
            }
            resolve(index)
        });

        p.then((res) => {
            //  console.log(this.state.shouldChecked)
            // console.log(this.state.haveChecked)
            this.createCharts1()
        })


    }

    colorChange = (index) => {
        this.setState({
            index: index,
            areaColor: "#CDCB43"
        });
    };

    render() {
        this.state.areaName = this.props.areaName || [];
        const shouldCheck1 = this.props.shouldCheck1 || [];
        const haveCheck1 = this.props.haveCheck1 || [];
        //  console.log(shouldCheck1)
        return (
            <div>

                <div ref='plac1' style={{height: '400px', width: '100%', marginTop: 0, marginLeft: 'auto'}}/>


                <div className='textbox1' style={{
                    height: '50px',
                    fontSize: 24,
                    lineHeight: 2,
                    backgroundColor: '#E0DF8C',
                    color: '#F06F2C'
                }}>
                    <div className='textbox3' style={{
                        height: '50px',
                        fontSize: 20,
                        lineHeight: 2.6,
                        margin: 0,
                        width: '50%',
                        backgroundColor: '#CDCB43'
                    }}>

                        区域企业数量（家）
                    </div>
                    {this.props.enterpriseNumber}

                </div>

                <div style={{width: '100%', marginTop: 30}}>
                    <Row type="flex">
                        {this.state.areaName.map((item, index) => (
                            <Col>
                                <div className="textbox3" style={{
                                    width: '110px',
                                    borderRadius: 5,
                                    margin: 10,
                                    backgroundColor: index === this.state.index ? this.state.areaColor : '#4899CE',
                                    cursor: 'pointer'
                                }}
                                     onClick={() => {
                                         this.colorChange(index);
                                         this.handleOperator(item, shouldCheck1[index], haveCheck1[index])
                                     }}>{this.state.areaName[index]}</div>
                            </Col>
                        ))}
                    </Row>
                    {/* <Row type="flex" >
                        {this.state.steplist.map((item,index)=>(
                            <Col>
                                <div className="textbox3" style={{width:'110px',margin:10}} onClick={()=>{this.handleOperator('detail',item,index)}}>{this.state.steplist[index]}</div>
                               
                                <div className="textbox3" style={{width:'110px',borderRadius:5,margin:10,backgroundColor:'#4899CE'}} >王打卦镇</div>
                            </Col>
                            <Col>
                                <div className="textbox3" style={{width:'110px',margin:10}} onClick={()=>{this.handleOperator('detail',item,index)}}>{this.state.steplist[index]}</div>
                               
                                <div className="textbox3" style={{width:'110px',borderRadius:5,margin:10,backgroundColor:'#4899CE'}} >三唐乡</div>
                            </Col>
                            <Col>
                                <div className="textbox3" style={{width:'110px',margin:10}} onClick={()=>{this.handleOperator('detail',item,index)}}>{this.state.steplist[index]}</div>
                               
                                <div className="textbox3" style={{width:'110px',borderRadius:5,margin:10,backgroundColor:'#4899CE'}} >坊子乡</div>
                            </Col>
                            <Col>
        
                               
                                <div className="textbox3" style={{width:'110px',borderRadius:5,margin:10,backgroundColor:'#4899CE'}} >龙门街道</div>
                            </Col>
                            <Col>
                                <div className="textbox3" style={{width:'110px',margin:10}} onClick={()=>{this.handleOperator('detail',item,index)}}>{this.state.steplist[index]}</div>
                               
                                <div className="textbox3" style={{width:'110px',borderRadius:5,margin:10,backgroundColor:'#4899CE'}} >开发区</div>
                            </Col>
                            <Col>
                                <div className="textbox3" style={{width:'110px',margin:10}} onClick={()=>{this.handleOperator('detail',item,index)}}>{this.state.steplist[index]}</div>
                               
                                <div className="textbox3" style={{width:'110px',borderRadius:5,margin:10,backgroundColor:'#4899CE'}} >桃园街道</div>
                            </Col>
                            <Col>
                                <div className="textbox3" style={{width:'110px',margin:10}} onClick={()=>{this.handleOperator('detail',item,index)}}>{this.state.steplist[index]}</div>
                               
                                <div className="textbox3" style={{width:'110px',borderRadius:5,margin:10,backgroundColor:'#4899CE'}} >前曹镇</div>
                            </Col>
                            <Col>
        
                               
                                <div className="textbox3" style={{width:'110px',borderRadius:5,margin:10,backgroundColor:'#4899CE'}} >恩城镇</div>
                            </Col>
                            <Col>
                                <div className="textbox3" style={{width:'110px',margin:10}} onClick={()=>{this.handleOperator('detail',item,index)}}>{this.state.steplist[index]}</div>
                               
                                <div className="textbox3" style={{width:'110px',borderRadius:5,margin:10,backgroundColor:'#4899CE'}} >王凤楼镇</div>
                            </Col>
                            <Col>
                                <div className="textbox3" style={{width:'110px',margin:10}} onClick={()=>{this.handleOperator('detail',item,index)}}>{this.state.steplist[index]}</div>
                               
                                <div className="textbox3" style={{width:'110px',borderRadius:5,margin:10,backgroundColor:'#4899CE'}} >王杲铺镇</div>
                            </Col>
                            <Col>
                                <div className="textbox3" style={{width:'110px',margin:10}} onClick={()=>{this.handleOperator('detail',item,index)}}>{this.state.steplist[index]}</div>
                               
                                <div className="textbox3" style={{width:'110px',borderRadius:5,margin:10,backgroundColor:'#4899CE'}} >张华镇</div>
                            </Col>
                            <Col>
        
                               
                                <div className="textbox3" style={{width:'110px',borderRadius:5,margin:10,backgroundColor:'#4899CE'}} >王庙镇</div>
                            </Col>
                            <Col> */}


                    {/* <div className="textbox3" style={{width:'110px',borderRadius:5,margin:10,backgroundColor:'#4899CE'}} >腰站镇</div>
    </Col> */}
                    {/* ))} */}
                    {/* </Row> */}
                </div>
                {/* <ProvinceMap steplist={this.state.steplist} handleOperator={this.handleOperator} totalstepitem={this.state.totalstepitem} teamitem={this.state.teamitem} teamyes={this.state.teamyes} teamno={this.state.teamno} teamtotal={this.state.teamtotal}></ProvinceMap> */}
            </div>
        )
    }
}

export default PlaceSituation