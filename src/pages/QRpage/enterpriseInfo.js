import React, {Component} from 'react'
import {Col, Row} from "antd";
import {Carousel} from 'antd-mobile'
import './enterpriseInfo.css'
import Image from './icon/bright_kitchen_stove.png'
import Movie from './icon/movie.mp4'
import GradeA from './icon/dynamic_level_excellent.png'
import GradeB from './icon/dynamic_level_good.png'
import GradeC from './icon/dynamic_level_commonly.png'
import GradeNull from './icon/dynamic_level_null.png'
import EnterpriseModular from './enterpriseModular'
import axios from "../../axios"

export default class EnterpriseInfo extends Component {

    constructor() {
        super();
        this.state = {
            width: {},
            transformationType: "",
            gradeLast: "",
            grade: ""
        }
    }

    componentDidMount() {
        this.getWidth();
        this.login();
    }

    getWidth = () => {
        let width = document.body.clientWidth + "px";
        this.setState({
            width: width
        })
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
            this.getUnitQualification();
        });
    };

    //单位资质List筛选
    getUnitQualification = () => {
        axios.PostAjax({
            url: "/supervision/enterprise/getPage",
            data: {
                params: {
                    enterpriseName: "张晨晨的小店",
                    storeName: "",
                    creditCode: "",
                    startTime: "",
                    endTime: "",
                    areaList: [""],
                    enterpriseScale: "",
                    isStop: "",
                    permissionStatus: "",
                    dept: "",
                    supervisor: "",
                    industryList: [""]
                }
            }
        }).then((item) => {
            if (item.status === "success") {
                console.log("Get Unit Qualification");
                this.setState({
                    unitId: item.data.total === 0 ? "" : item.data.data[0].id
                });
                this.getUnitQualificationItem();//进入详情页
            }
        })
    };

    //单位资质内容
    getUnitQualificationItem = () => {
        axios.ajax({
            url: "/supervision/enterprise/getById",
            data: {
                // params: {id: this.state.unitId}
                params: {id: 133}
            }
        }).then((item) => {
            if (item.status === "success") {
                console.log("getUnitQualificationItem1:");
                this.setState({
                    transformationType: item.data.transformationType,
                    gradeLast: item.data.yearAssessment,
                    grade: item.data.dynamicGrade,
                });
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

    render() {
        return (
            <div className="EnterpriseInfo-outer">
                {/*禁止双击放大*/}
                <meta name="viewport"
                      content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=0"/>
                <div className="EnterpriseInfo">
                    <div className="EnterpriseInfo-head">
                        {this.state.transformationType === "未实现明厨亮灶" || this.state.transformationType === "" ?
                            <img src={Image}
                                 style={{width: this.state.width}}
                                 alt=""/> :
                            <video src={Movie}
                                   style={{width: this.state.width}}
                                   controls/>
                        }
                    </div>
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
                                    <img src={this.hangleGrade(this.state.grade)}
                                         style={this.hangleGrade(this.state.grade) === GradeNull ?
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
                        <EnterpriseModular title="单位资质"
                            // dispatchParent={(item) => {
                            //     this.setState({
                            //         transformationType: item.data.transformationType,
                            //         gradeLast: item.data.yearAssessment,
                            //         grade: item.data.dynamicGrade
                            //     })
                            // }}
                        />
                    </div>
                    <div>
                        <EnterpriseModular title="健康证公示"/>
                    </div>
                    <div>
                        <EnterpriseModular title="原料索证公示"/>
                    </div>
                    <div>
                        <EnterpriseModular title="食品安全相关知识"/>
                    </div>
                    <div style={{marginBottom: "50px"}}>
                        <EnterpriseModular title="通知公告"/>
                    </div>
                    <footer>
                        投诉电话:12345 12331 12315
                    </footer>
                </div>
            </div>
        );
    }
}