import React, {Component} from 'react'
import {Col, Row, Button, Modal} from "antd";
import {Carousel} from 'antd-mobile'
import 'video.js/dist/video-js.min.css'
import videojs from 'video.js'
import './enterpriseInfo.css'
import Image from './icon/bright_kitchen_stove.png'
import Movie from './icon/movie.mp4'
import GradeA from './icon/dynamic_level_excellent.png'
import GradeB from './icon/dynamic_level_good.png'
import GradeC from './icon/dynamic_level_commonly.png'
import GradeNull from './icon/dynamic_level_null.png'
import EnterpriseModularNew from './enterpriseModularNew'
import axios from "../../axios"
import {commonUrl, unitName} from "../../axios/commonSrc"

export default class EnterpriseInfo extends Component {

    constructor() {
        super();
        this.state = {
            width: {},
            transformationType: "",
            gradeLast: "",
            grade: "",
            dynamicGrade: "",
            info: [],
            health: [],
            enclosure: [],

            dept: [],
            deptName: "",

            rawMaterialList: [],
            rawMaterial: [],

            videoInfo: [],

            knowledgeList: [],
        }
    }

    componentDidMount() {
        this.getWidth();
        // this.login();
        this.getDept();
        this.getKnowledge();
    }

    //从地址获取参数
    GetQueryString = (name) => {
        var reg = new RegExp('(^|&|/?)' + name + '=([^&|/?]*)(&|/?|$)');
        var r = window.location.search.substr(1).match(reg);
        // var r = "http://124.128.84.40:8086/supervision/enterprise/getQrcodeById?id=43148".substr(1).match(reg);
        // 0: "id=43148"
        // 1: ""
        // 2: "43148"
        // 3: ""
        // index: 62
        // input: "ttp://124.128.84.40:8086/supervision/enterprise/getQrcodeById?id=43148"
        // length: 4
        console.log(r);
        if (r != null) return decodeURIComponent(r[2]);
        return null;
    };

    getWidth = () => {
        let width = document.body.clientWidth + "px";
        this.setState({
            width: width
        })
    };

    getInfo = () => {
        axios.ajax(
            {
                url: "/supervision/enterprise/getQrcodeById" + this.props.location.search,
                data: {
                    params: {}
                    // params: {id: this.GetQueryString('id')}
                    // params: {id: 43148}//测试
                    // params: {id: 36}//原料索证测试
                    // params: {id: 65561}
                }
            }).then((item) => {
            if (item.status === "success") {
                console.log("data success");
                this.setState({
                    info: item.data.enterprise,
                    health: item.data.caList,
                    grade: item.data.enterprise.yearAssessment,
                    dynamicGrade: item.data.enterprise.dynamicGrade,
                    transformationType: item.data.enterprise.transformationType
                });

                if (item.data.enterprise.propagandaEnclosure !== "" && item.data.enterprise.propagandaEnclosure !== "[]") {
                    this.getEnclosure(JSON.parse(item.data.enterprise.propagandaEnclosure));
                }
                this.handleDept(item.data.enterprise.regulators);
                this.getRawMaterialNew(item.data.enterprise.id);
                if (unitName == "平原县" || unitName == "临清市") {
                    this.getVideoNew(item.data.enterprise.id);
                } else {
                    this.getVideo(item.data.enterprise.id);
                }
            }
        })
    };

    hangleGrade = (data) => {
        if (data == "s") {
            return GradeA;
        } else if (data == "a") {
            return GradeB;
        } else if (data == "b") {
            return GradeC;
        } else {
            return GradeNull;
        }
    };

    //获取证照
    getEnclosure = (json) => {
        let enclosure = [];
        for (var i of json) {
            if (typeof i.response !== "undefined") enclosure.push(i.response.data);
        }
        this.setState({
            enclosure: enclosure
        });
    };

    login = () => {
        axios.ajax({
            url: "/sys/user/loginTest",
            data: {
                params: {loginName: "admin", password: "12345678+"}
            }
        }).then((item) => {
            if (item.status === "success") {
                console.log("login success");
            }
        });
    };

    //获取所有部门
    getDept = () => {
        axios.ajax(
            {
                url: "sys/dept/getAll",
                data: {
                    params: {}
                }
            }).then((item) => {
            if (item.status === "success") {
                console.log("dept data success");
                this.getInfo();
                this.setState({
                    dept: item.data
                });
            }
        })
    };

    //处理对应关系
    handleDept = (deptId) => {
        console.log(this.state.dept);
        console.log(deptId);

        var deptName = "";
        if (this.state.dept && deptId) {
            this.state.dept.map((item) => {
                if (item.id === deptId) {
                    deptName = item.name;
                }
            });
            this.setState({
                deptName: deptName
            })
        }
    };

    GetDateStr = (AddDayCount) => {
        let dd = new Date();
        dd.setDate(dd.getDate() + AddDayCount);//获取AddDayCount天后的日期
        let y = dd.getFullYear();
        let m = dd.getMonth() + 1;//获取当前月份的日期
        let d = dd.getDate();
        return y + "-" + ((m < 10) ? ("0" + m) : m) + "-" + ((d < 10) ? ("0" + d) : d);
    };

    //原料索证List
    getRawMaterial = (name) => {
        console.log("getRawMaterial");


        console.log(this.GetDateStr(-1));
        console.log(this.GetDateStr(0));

        axios.PostAjax({
            url: "/formatoriginrecord/getPage",
            data: {
                params: {
                    enterprise: name,
                    start: this.GetDateStr(-1),
                    end: this.GetDateStr(0)
                }
            }
        }).then((item) => {
            if (item.status === "success") {
                console.log("get Raw Material");
                this.setState({
                    rawMaterialList: item.data.data
                });
                this.getRawMaterialItem();
            }
        })
    };

    //原料索证内容
    getRawMaterialItem = () => {
        console.log("length:" + this.state.rawMaterialList.length);
        let rawMaterial = [];
        this.state.rawMaterialList.map((item) => {
            axios.ajax({
                url: "/formatoriginrecord/getById",
                data: {
                    params: {id: item.id}
                }
            }).then((item) => {
                if (item.status === "success") {
                    // console.log("id:" + item.id);//id:undefined
                    console.log("get Raw Material Item:");
                    for (let i = 0; i < item.data.list.length; i++) {
                        rawMaterial.push(item.data.list[i]);
                    }
                    this.setState({
                        rawMaterial: rawMaterial
                    });
                }
            })
        });
    };

    //原料索证（新）
    getRawMaterialNew = (id) => {
        axios.PostAjax({
            url: "/formatOriginRecordEx/getPageAnd",
            data: {
                params: {
                    id: id,
                    start1: this.GetDateStr(-1),
                    end1: this.GetDateStr(0)
                    // start:"2018-09-16",
                    // end: "2018-09-17"
                }
            }
        }).then((item) => {
            if (item.status === "success") {
                console.log("get Raw Material New Data");
                this.setState({
                    rawMaterialList: item.data.data
                });
            }
        })
    };

    //获取视频
    getVideo = (id) => {
        axios.ajax({
            url: '/video/selectByEnterpriseId',
            data: {
                params: {
                    id: id
                }
            }
        }).then((res) => {
            if (res.status == 'success') {
                this.setState({
                    videoInfo: res.data,
                });
                // this.setUrl(res.data.list[0].number);
                const list = this.state.videoInfo.list || [];
                const {httpIp, httpPort, rtmpIp, rtmpPort, vagIp, vagPort, type} = this.state.videoInfo;
                this.player = videojs('myVideo', {}, function onPlayerReady() { //(id或者refs获取节点，options，回调函数)
                    let url = type == '海康' ? `http://${httpIp}:${httpPort}/pag/${vagIp}/${vagPort}/${list[0].number}/0/MAIN/TCP/live.m3u8` :
                        `http://${httpIp}:${httpPort}/live/cameraid/${list[0].number}%24${list[0].channelNumber}/substream/${list[0].byteType}.m3u8`;
                    this.src(url);
                    this.load();
                    this.play();
                    this.on('ended', function () {
                    });
                });
            }
        })
    };

    //获取视频（新）
    getVideoNew = (id) => {
        axios.ajax({
            url: '/videoIsc/selectByEnterpriseId',
            data: {
                params: {
                    id: id
                }
            }
        }).then((res) => {
            if (res.status == 'success') {
                this.setState({
                    videoInfo: res.data,
                });
                this.player = videojs('myVideo', {}, function onPlayerReady() { //(id或者refs获取节点，options，回调函数)
                    this.on('ended', function () {
                    });
                });
            }
        })
    };

    getVideoContent = (value) => {
        value.region = unitName;
        axios.ajax({
            url: '/HIKResource/getPageCamerasByCamerasIndex',
            data: {
                params: value
            }
        }).then((res) => {
            if (res.status == "success" && res.data.code == "0") {
                this.player.pause();
                this.player.src(res.data.data.url);
                this.player.load();
                this.player.play()
            } else if (res.status == "success" && res.data.code == "0x01b01301") {
                Modal.error({
                    title: 'URL',
                    content: "无此监控点位，请检查监控点索引是否正确！",
                })
            } else {
                Modal.error({
                    title: 'URL',
                    content: "请求错误，请检查视频配置项是否正确！",
                })
            }
        })
    };

    // 拼接视频
    setUrl = (number, channelNumber, byteType) => {
        const {httpIp, httpPort, rtmpIp, rtmpPort, vagIp, vagPort, type} = this.state.videoInfo;
        // console.log("httpIp:" + httpIp);
        // console.log("httpPort:" + httpPort);
        // console.log("rtmpIp:" + rtmpIp);
        // console.log("rtmpPort:" + rtmpPort);
        // console.log("vagIp:" + vagIp);
        // console.log("vagPort:" + vagPort);
        console.log("number:" + number + "channelNumber:" + channelNumber + "byteType:" + byteType);
        let url = type == '海康' ? `http://${httpIp}:${httpPort}/pag/${vagIp}/${vagPort}/${number}/0/MAIN/TCP/live.m3u8` :
            `http://${httpIp}:${httpPort}/live/cameraid/${number}%24${channelNumber}/substream/${byteType}.m3u8`;
        console.log("url:" + url);
        this.player.pause();
        this.player.src(url);
        this.player.load();
        this.player.play();
    };

    //食品安全相关知识
    getKnowledge = () => {
        axios.ajax({
            url: "/sys/news/getPageAndroid?",
            data: {
                params: {type: 3, pageNo: 1}
            }
        }).then((item) => {
            if (item.status == "success") {
                console.log("knowledge data success");
                this.setState({
                    knowledgeList: item.data.data
                })
            }
        });
    };

    render() {
        const list = this.state.videoInfo.list || [];
        const {httpIp, httpPort, rtmpIp, rtmpPort, vagIp, vagPort} = this.state.videoInfo;

        return (
            <div className="EnterpriseInfo-outer">
                {/*禁止双击放大*/}
                <meta name="viewport"
                      content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=0"/>
                <div className="EnterpriseInfo">
                    <div className="EnterpriseInfo-head"
                         style={{display: this.state.transformationType === "视频" || this.state.transformationType === "车间量化" ? "block" : "none"}}>
                        <video
                            id="myVideo"
                            className="video-js vjs-default-skin vjs-big-play-centered"
                            controls
                            //解决微信自动全屏
                            //android
                            x5-playsinline="true"
                            //ios
                            webkit-playsinline="true" playsinline="true"
                            preload="auto"
                            data-setup="{}"
                            style={{width: this.state.width, height: "250px"}}>
                            <source id="source"
                                // src={"http://124.128.248.250:83/pag/10.15.10.90/7302/001085/0/MAIN/TCP/live.m3u8"}
                                // src={"rtmp://124.128.248.250:1935/live/pag/10.15.10.90/7302/001078/0/MAIN/TCP"}
                                    src={Movie}
                                    type="application/x-mpegURL"/>
                        </video>
                    </div>
                    <img src={Image}
                         style={{
                             width: this.state.width,
                             display: this.state.transformationType === "视频" || this.state.transformationType === "车间量化" ? "none" : "block"
                         }}
                         alt=""/>
                    {(list.length !== 0 && (this.state.transformationType === "视频" || this.state.transformationType === "车间量化")) ?
                        <div style={{width: this.state.width, height: "30px", border: '1px solid #ddd'}}>
                            {list.map((item) => (
                                <div key={item.id}
                                     style={{float: "left"}}>
                                    <Button
                                        style={{
                                            backgroundColor: "#F2F2F2",
                                            height: "30px",
                                            padding: "0 5px 0",
                                            minWidth: 50
                                        }}
                                        onClick={() => {
                                            if (unitName == "平原县" || unitName == "临清市") {
                                                this.getVideoContent(item);
                                            } else {
                                                this.setUrl(item.number, item.channelNumber, item.byteType);
                                            }
                                        }}>
                                        {item.position}
                                    </Button>
                                </div>
                            ))}
                        </div> : <div style={{width: 0, height: 0}}/>
                    }
                    <div className="EnterpriseInfo-grade">
                        <div className="EnterpriseInfo-grade-title">
                            明厨亮灶 请您监督
                        </div>
                        <div className="EnterpriseInfo-grade-body">
                            <div style={{width: this.state.width, float: "left", padding: "20px 0"}}>
                                <div style={{
                                    width: "50%",
                                    float: "left",
                                    textAlign: "center",
                                    paddingTop: "6px"
                                }}>
                                    <span
                                        style={{color: "#fff"}}>{this.state.grade !== "" ? this.state.grade : "未评定"}</span>
                                    <div className="EnterpriseInfo-grade-body-text"
                                         style={{marginTop: "10px"}}>
                                        上一年度综合等级
                                    </div>
                                </div>
                                <div style={{width: "50%", float: "left", textAlign: "center"}}>
                                    <img src={this.hangleGrade(this.state.dynamicGrade)}
                                         style={this.hangleGrade(this.state.dynamicGrade) === GradeNull ?
                                             {width: "50px", margin: "-8px 0"} : {width: "34px"}}
                                         alt=""/>
                                    <div className="EnterpriseInfo-grade-body-text">
                                        本次检查动态等级
                                    </div>
                                </div>
                            </div>
                            <div style={{width: this.state.width, float: "left", padding: "10px 0"}}>
                                <div style={{width: "33%", float: "left", textAlign: "center"}}>
                                    <img src={GradeA}
                                         style={{width: "34px"}}
                                         alt=""/>
                                    <div>
                                        <span style={{color: "#20f129", fontSize: "1.1rem"}}>A</span>
                                        <span style={{color: "#20f129", fontSize: "15px"}}>（优秀）</span>
                                    </div>
                                </div>
                                <div style={{width: "33%", float: "left", textAlign: "center"}}>
                                    <img src={GradeB}
                                         style={{width: "34px"}}
                                         alt=""/>
                                    <div>
                                        <div>
                                            <span style={{color: "#FFFF00", fontSize: "1.1rem"}}>B</span>
                                            <span style={{color: "#FFFF00", fontSize: "15px"}}>（良好）</span>
                                        </div>
                                    </div>
                                </div>
                                <div style={{width: "33%", float: "left", textAlign: "center"}}>
                                    <img src={GradeC}
                                         style={{width: "34px"}}
                                         alt=""/>
                                    <div>
                                        <span style={{color: "#FB0103", fontSize: "1.1rem"}}>C</span>
                                        <span style={{color: "#FB0103", fontSize: "15px"}}>（一般）</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div>
                        <EnterpriseModularNew title="单位资质"
                                              info={this.state.info}
                                              dept={this.state.deptName}
                                              foodCommon={this.state.info.foodCommon}
                                              foodBusiness={this.state.info.foodBusiness}
                                              foodCirculate={this.state.info.foodCirculate}
                                              cosmeticsUse={this.state.info.cosmeticsUse}
                                              foodProduce={this.state.info.foodProduce}
                                              drugsBusiness={this.state.info.drugsBusiness}
                                              medicalUse={this.state.info.medicalUse}/>
                    </div>
                    <div>
                        <EnterpriseModularNew title="健康证公示"
                                              health={this.state.health}/>
                    </div>
                    <div>
                        <EnterpriseModularNew title="证照信息"
                                              photo={this.state.enclosure.length >= 3 ? this.state.enclosure.slice(1, 3) : this.state.enclosure}
                                              width={this.state.width}/>
                    </div>
                    <div>
                        <EnterpriseModularNew title="原料索证公示"
                                              rawMaterialList={this.state.rawMaterialList}/>
                    </div>
                    <div>
                        <EnterpriseModularNew title="食品安全相关知识"
                                              knowledgeList={this.state.knowledgeList.length > 5 ? this.state.knowledgeList.slice(0, 5) : this.state.knowledgeList}/>
                    </div>
                    <div style={{marginBottom: "50px"}}>
                        <EnterpriseModularNew title="通知公告"/>
                    </div>
                    <footer>
                        投诉电话:12345 12331 12315
                    </footer>
                </div>
            </div>
        );
    }
};