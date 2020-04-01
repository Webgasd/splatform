import React, { Component } from 'react';
import './style.less';
import picLogo from './img/u100.png'
import FoodCirculate from './foodCirculate'
import FoodProduce from './foodProduce'
import Total from './total'
import Everylink from './everylink'
import FoodCommon from './foodCommon'
import Dcircle from './dcircle'
import axios from "../../axios";
import moment from 'moment';

class takeOut extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isFullScreen: false,
            msgIndex: 0

        }
    }
    componentDidMount() {
       // this.requestList();
        this.watchFullScreen();
    }

    fullScreen = () => {
        // console.log('fullscreen:',this.state.isFullScreen);
        if (!this.state.isFullScreen) {
            this.requestFullScreen();
        } else {
            this.exitFullscreen();
        }
    };

    //进入全屏
    requestFullScreen = () => {
        // console.log('requestFullScreen')
        var de = document.documentElement;
        if (de.requestFullscreen) {
            de.requestFullscreen();
        } else if (de.mozRequestFullScreen) {
            de.mozRequestFullScreen();
        } else if (de.webkitRequestFullScreen) {
            de.webkitRequestFullScreen();
        }
    };

    //退出全屏
    exitFullscreen = () => {
        //console.log('exitFullscreen')
        var de = document;
        if (de.exitFullscreen) {
            de.exitFullscreen();
        } else if (de.mozCancelFullScreen) {
            de.mozCancelFullScreen();
        } else if (de.webkitCancelFullScreen) {
            de.webkitCancelFullScreen();
        }
    };

    //监听fullscreenchange事件
    watchFullScreen = () => {
        const _self = this;
        document.addEventListener(
            "webkitfullscreenchange",
            function () {
                _self.setState({
                    isFullScreen: document.webkitIsFullScreen
                });
            },
            false
        );
    };
    changeMsgIndex(index) {
        this.setState({
            msgIndex: index
        })
    }
    getContent = () => {

        switch (this.state.msgIndex) {
            case 0:
                return <Total
                
                />
            case 1:
                return <FoodCommon

                />
            case 2:
                return <FoodCirculate

                />
            case 3:
                return <FoodProduce
                />
        }
    }
    requestList = () => {
        let _this = this;
        axios.ajax({
            url: '/inspect/dailyFood/getStatistics',
            data: {
                params: {
                }
            }
        }).then((res) => {
            if (res.status == 'success') {
                let enterpriseNumberA = res.data.areaList.map((item) => {
                    return res.data.areaCount[item.id].foodCommon.numberEnterprise +
                        res.data.areaCount[item.id].foodCirculate.numberEnterprise +
                        res.data.areaCount[item.id].foodProduce.numberEnterprise

                })
                let sum = 0;
                enterpriseNumberA.forEach(item => {
                    sum += item
                })
                let enterpriseNumber1 = sum;
                let enterpriseNumber = res.data.enterpriseMarkA+res.data.enterpriseMarkB+res.data.enterpriseMarkC+res.data.enterpriseMarkD+res.data.enterpriseMarkN;
                let checkEnterprise = res.data.enterpriseMarkA+res.data.enterpriseMarkB+res.data.enterpriseMarkC+res.data.enterpriseMarkD;
                let enterpriseMarkA = res.data.enterpriseMarkA;
                let enterpriseMarkB = res.data.enterpriseMarkB;
                let enterpriseMarkC = res.data.enterpriseMarkC;
                let enterpriseMarkD = res.data.enterpriseMarkD;
                let enterpriseMarkN = res.data.enterpriseMarkN;

                let areaName = res.data.areaList.map((item, i) => {
                    item.key = i;
                    return item.name;
                })
                //  let shouldCheck  = res.data.areaCount
                let shouldCheck = res.data.areaList.map((item) => {
                    return res.data.areaCount[item.id].foodCommon.shouldCheck +
                        res.data.areaCount[item.id].foodCirculate.shouldCheck +
                        res.data.areaCount[item.id].foodProduce.shouldCheck

                })
                let haveCheck = res.data.areaList.map((item) => {
                    return res.data.areaCount[item.id].foodCommon.haveCheck +
                        res.data.areaCount[item.id].foodCirculate.haveCheck +
                        res.data.areaCount[item.id].foodProduce.haveCheck

                })
                let shouldCheck1 = res.data.areaList.map((item) => {
                    // return {
                    //     foodCommon: res.data.areaCount[item.id].foodCommon.shouldCheck,
                    //     foodCirculate: res.data.areaCount[item.id].foodCirculate.shouldCheck,
                    //     foodProduce: res.data.areaCount[item.id].foodProduce.shouldCheck,

                    // };
                    return [
                        res.data.areaCount[item.id].foodCommon.shouldCheck,
                        res.data.areaCount[item.id].foodCirculate.shouldCheck,
                        res.data.areaCount[item.id].foodProduce.shouldCheck,

                    ]
                    //  return  res.data.areaCount[item.id].foodCommon.shouldCheck, res.data.areaCount[item.id].foodCirculate.shouldCheck, res.data.areaCount[item.id].foodProduce.shouldCheck


                })
                let haveCheck1 = res.data.areaList.map((item) => {

                    return [
                        res.data.areaCount[item.id].foodCommon.haveCheck,
                        res.data.areaCount[item.id].foodCirculate.haveCheck,
                        res.data.areaCount[item.id].foodProduce.haveCheck,

                    ]

                })
                // let enterpriseData=res.data.map((item)=>{ 

                //     return {
                //         enterpriseNumber:item.enterpriseNumber,
                //         enterpriseNumber:item.checkEnterprise
                //     };

                // })

                let enterpriseData = res.data.checkEnterprise / res.data.enterpriseNumber;
                this.setState({
                    enterpriseNumber1: enterpriseNumber1,
                    checkEnterprise: checkEnterprise,
                    enterpriseMarkA: enterpriseMarkA,
                    enterpriseMarkB: enterpriseMarkB,
                    enterpriseMarkC: enterpriseMarkC,
                    enterpriseMarkD: enterpriseMarkD,
                    enterpriseMarkN: enterpriseMarkN,
                    enterpriseData: enterpriseData,
                    areaName: areaName,
                    shouldCheck: shouldCheck,
                    haveCheck: haveCheck,
                    shouldCheck1: shouldCheck1,
                    haveCheck1: haveCheck1
                })
               // console.log(enterpriseNumber)
            }
        })
    }
    render() {
        //  console.log(this.state.msgIndex)
        return (
            <div className='control' >
                <div className='horizontalLine' />
                {/* <ControlHeader/> */}
                <div className='controlHeader1'>
                    <table>
                        <tr>
                            <td style={{ width: '30%' }}>
                                <div className='left' style={{ border: '2px solid #A7B5C4', verticalAlign: 'middle' }}>
                                    {/* <div className='text1'onClick={this.state.flag=0} style={{backgroundColor: '#A4C93E',cursor:'pointer'}}>全部</div>
                                <div className='text1' onClick={this.state.flag=1} style={{backgroundColor: '#479AD0',width:'23%',cursor:'pointer'}}>餐饮服务</div>
                                <div className='text1' onClick={this.state.flag=2} style={{backgroundColor: '#479AD0',width:'23%',cursor:'pointer'}}>食品流通</div>
                                <div className='text1'onClick={this.state.flag=3} style={{backgroundColor: '#479AD0',width:'23%',cursor:'pointer'}}>食品生产</div> */}
                                    <div className={this.state.msgIndex === 0 ? 'text11' : 'text12'} onClick={this.changeMsgIndex.bind(this, 0)}>全部</div>
                                    <div className={this.state.msgIndex === 1 ? 'text11' : 'text12'} onClick={this.changeMsgIndex.bind(this, 1)}>餐饮服务</div>
                                    <div className={this.state.msgIndex === 2 ? 'text11' : 'text12'} onClick={this.changeMsgIndex.bind(this, 2)}>食品流通</div>
                                    <div className={this.state.msgIndex === 3 ? 'text11' : 'text12'} onClick={this.changeMsgIndex.bind(this, 3)}>食品生产</div>

                                </div>
                            </td>
                            <td style={{ width: '50%' }}>
                                <div className='center' style={{ backgroundColor: '#263D5C' }}>
                                    <img style={{ float: 'left', height: 31, marginLeft: 55, marginTop: 10 }} src={picLogo} />
                                    <div style={{ height: 60, fontSize: 23, color: 'aliceblue', marginLeft: 100 }}>
                                        市场监督管理局日常检查数据分析平台
                            </div>
                                </div>
                            </td>

                            <td>

                                <div className='left' style={{ backgroundColor: '#1A3352', border: '0px solid #A7B5C4' }}>
                                    <div className='text3'  >
                                        <div className='text2' style={{ backgroundColor: '#1A3352', height: 40, border: '0px solid #A7B5C4', color: '#4685B6' }} >检查年度</div>
                                        <div className='text2' style={{ backgroundColor: '#65768A', border: '0px solid #A7B5C4', height: 30, width: '40%' }}>{moment().format('YYYY')}年</div>
                                    </div>
                                    <div className='text1' onClick={this.fullScreen} style={{ marginTop: 0, height: 54, lineHeight: 3.5, width: '30%', color: '#4685B6', cursor: 'pointer' }} >全屏展示</div>
                                </div>





                            </td>
                        </tr>

                    </table>
                </div >
                {this.getContent()}
            </div>




        )
    }
}

export default takeOut