import React, {Component} from 'react'
import './enterpriseModular.css'
import {withRouter} from 'react-router-dom'
import Image1 from './icon/unit_qualification.png'
import Image2 from './icon/health_notarization.png'
import Image3 from './icon/material_request_notarization.png'
import Image4 from './icon/food_safety_related_knowledge.png'
import Image5 from './icon/notification_notice.png'
import Image6 from './icon/certificate_information.png'
import Return from './icon/return_right.png'
import Return1 from './icon/return_bottom.png'
import Null from './icon/null.png'

import {commonUrl} from "../../axios/commonSrc"
import Health from './icon/health_certificate.png'

class EnterpriseModular extends Component {
    constructor(props) {
        super(props);
        this.state = {
            display: "none",
            visibility: "hidden",
            src: Return,

            //政府部门
            departmentList: [],
            department: "",

            //证照信息
            certificateInfoList: [],

            //食品安全相关知识
            knowledgeList: [],

            //通知公告
            noticeList: []
        }
    }

    //显示/隐藏
    show = () => {
        if (this.state.display == "block") {
            this.setState({
                display: "none",
                visibility: "hidden",
                src: Return
            })
        } else {
            this.setState({
                display: "block",
                visibility: "visible",
                src: Return1
            })
        }
    };

    //设置标题图片
    showImg = () => {
        switch (this.props.title) {
            case "单位资质":
                return Image1;
            case "健康证公示":
                return Image2;
            case "证照信息":
                return Image6;
            case "原料索证公示":
                return Image3;
            case "食品安全相关知识":
                return Image4;
            case "通知公告":
                return Image5;
        }
    };

    //设置标题背景颜色
    setColor = () => {
        switch (this.props.title) {
            case "单位资质":
                return "linear-gradient(#a5adf7,#7e87d1)";
            case "健康证公示":
                return "linear-gradient(#52b8e4,#0b87c5)";
            case "证照信息":
                return "linear-gradient(#1DD4A7,#26AEB1)";
            case "原料索证公示":
                return "linear-gradient(#6fa0de,#597ec1)";
            case "食品安全相关知识":
                return "linear-gradient(#55d48b,#2cb165)";
            case "通知公告":
                return "linear-gradient(#a5adf7,#7e87d1)";
        }
    };

    //公告信息详情
    notice = () => {
        console.log("notice:");
        this.props.history.push('/notice');
    };

    render() {
        var index = 0;

        return (
            <div className="EnterpriseModular">
                <div className="EnterpriseModular-title"
                     style={{background: this.setColor()}}
                     onClick={() => this.show()}>
                    <img className="EnterpriseModular-title-img"
                         src={this.showImg()}
                         alt=""/>
                    <span className="EnterpriseModular-title-text">{this.props.title}</span>
                    <img id="img"
                         className="EnterpriseModular-title-return"
                         src={this.state.src}
                         alt=""/>
                </div>
                <div className="EnterpriseModular-body"
                     style={{
                         display: this.state.display,
                         visibility: this.state.visibility
                     }}>
                    {this.props.title == "单位资质" ?
                        <ul>
                            <li style={{color: "#494949", fontSize: ".95rem"}}>
                                企业名称：
                                <label>{this.props.info.enterpriseName}</label>
                            </li>
                            <li>
                                经营类别：
                                <label>{this.props.info.businessScale}</label>
                            </li>
                            <li>
                                生产地址：
                                <label>{this.props.info.businessAddress!=""?this.props.info.businessAddress:this.props.info.registeredAddress}</label>
                            </li>
                            <li>
                                日常监管责任机构：
                                <label>{this.props.dept}</label>
                            </li>
                            <li>
                                日常监管责任人员：
                                <label>{this.props.info.legalPerson}</label>
                            </li>
                            <div>
                                {this.props.foodCommon ?
                                    <div>
                                        <li style={{fontWeight: "bold"}}>
                                            许可证类型：
                                            <label>餐饮服务单位</label>
                                        </li>
                                        <li>
                                            许可证号：
                                            <label>{this.props.foodCommon.number}</label>
                                        </li>
                                        <li>
                                            发证机关：
                                            <label>{this.props.foodCommon.licenseAuthority}</label>
                                        </li>
                                        <li>
                                            类别：
                                            <label>{this.props.foodCommon.businessType}</label>
                                        </li>
                                        <li>
                                            许可期限：
                                            <label>{this.props.foodCommon.startTime ? this.props.foodCommon.startTime.substring(0, 10) : ""}至
                                                {this.props.foodCommon.endTime ? this.props.foodCommon.endTime.substring(0, 10) : ""}</label>
                                        </li>
                                    </div> : null
                                }
                                {this.props.foodBusiness ?
                                    <div>
                                        <li style={{fontWeight: "bold"}}>
                                            许可证类型：
                                            <label>食品经营企业</label>
                                        </li>
                                        <li>
                                            许可证号：
                                            <label>{this.props.foodBusiness[0].number}</label>
                                        </li>
                                        <li>
                                            发证机关：
                                            <label>{this.props.foodBusiness[0].licenseAuthority}</label>
                                        </li>
                                        <li>
                                            核定经营项目：
                                            <label>{this.props.foodBusiness[0].businessProject}</label>
                                        </li>
                                        <li>
                                            许可期限：
                                            <label>{this.props.foodBusiness[0].startTime ? this.props.foodBusiness[0].startTime.substring(0, 10) : ""}至
                                                {this.props.foodBusiness[0].endTime ? this.props.foodBusiness[0].endTime.substring(0, 10) : ""}</label>
                                        </li>
                                    </div> : null
                                }
                                {this.props.foodCirculate ?
                                    <div>
                                        <li style={{fontWeight: "bold"}}>
                                            许可证类型：
                                            <label>食品流通单位</label>
                                        </li>
                                        <li>
                                            许可证号：
                                            <label>{this.props.foodCirculate.number}</label>
                                        </li>
                                        <li>
                                            发证机关：
                                            <label>{this.props.foodCirculate.licenseAuthority}</label>
                                        </li>
                                        <li>
                                            核定经营项目：
                                            <label>{this.props.foodCirculate.businessProject}</label>
                                        </li>
                                        <li>
                                            许可期限：
                                            <label>{this.props.foodCirculate.startTime ? this.props.foodCirculate.startTime.substring(0, 10) : ""}至
                                                {this.props.foodCirculate.endTime ? this.props.foodCirculate.endTime.substring(0, 10) : ""}</label>
                                        </li>
                                    </div> : null
                                }
                                {this.props.cosmeticsUse ?
                                    <div>
                                        <li style={{fontWeight: "bold"}}>
                                            许可证类型：
                                            <label>化妆品使用许可证</label>
                                        </li>
                                        <li>
                                            许可证号：
                                            <label>{this.props.cosmeticsUse.registerCode}</label>
                                        </li>
                                        <li>
                                            发证机关：
                                            <label>{this.props.cosmeticsUse.licenseAuthority}</label>
                                        </li>
                                        <li>
                                            许可项目：
                                            <label>{this.props.cosmeticsUse.licenseProject}</label>
                                        </li>
                                        <li>
                                            许可期限：
                                            <label>{this.props.cosmeticsUse.startTime ? this.props.cosmeticsUse.startTime.substring(0, 10) : ""}至
                                                {this.props.cosmeticsUse.endTime ? this.props.cosmeticsUse.endTime.substring(0, 10) : ""}</label>
                                        </li>
                                    </div> : null
                                }
                                {this.props.foodProduce ?
                                    <div>
                                        <li style={{fontWeight: "bold"}}>
                                            许可证类型：
                                            <label>食品生产许可证</label>
                                        </li>
                                        <li>
                                            许可证号：
                                            <label>{this.props.foodProduce.number}</label>
                                        </li>
                                        <li>
                                            发证机关：
                                            <label>{this.props.foodProduce.licenseAuthority}</label>
                                        </li>
                                        {this.props.foodProduce.list.map((item) => (
                                            <li key={item.id}>
                                                添加剂名称：
                                                <label>{item.name}</label>
                                            </li>
                                        ))}
                                        <li>
                                            许可期限：
                                            <label>{this.props.foodProduce.startTime ? this.props.foodProduce.startTime.substring(0, 10) : ""}至
                                                {this.props.foodProduce.endTime ? this.props.foodProduce.endTime.substring(0, 10) : ""}</label>
                                        </li>
                                    </div> : null
                                }
                                {this.props.drugsBusiness ?
                                    <div>
                                        <li style={{fontWeight: "bold"}}>
                                            许可证类型：
                                            <label>药品经营企业</label>
                                        </li>
                                        <li>
                                            许可证号：
                                            <label>{this.props.drugsBusiness.number}</label>
                                        </li>
                                        <li>
                                            发证机关：
                                            <label>{this.props.drugsBusiness.licenseAuthority}</label>
                                        </li>
                                        <li>
                                            经营范围：
                                            <label>{this.props.drugsBusiness.businessScope}</label>
                                        </li>
                                        <li>
                                            许可期限：
                                            <label>{this.props.drugsBusiness.startTime ? this.props.drugsBusiness.startTime.substring(0, 10) : ""}至
                                                {this.props.drugsBusiness.endTime ? this.props.drugsBusiness.endTime.substring(0, 10) : ""}</label>
                                        </li>
                                    </div> : null
                                }
                                {this.props.medicalUse ?
                                    <div>
                                        <li style={{fontWeight: "bold"}}>
                                            许可证类型：
                                            <label>医疗器械使用许可证</label>
                                        </li>
                                        <li>
                                            许可证号：
                                            <label>{this.props.medicalUse.registerNumber}</label>
                                        </li>
                                        <li>
                                            发证机关：
                                            <label>{this.props.medicalUse.lssueAuthority}</label>
                                        </li>
                                        <li>
                                            诊疗科目：
                                            <label>{this.props.medicalUse.medicalSubject}</label>
                                        </li>
                                        <li>
                                            许可期限：
                                            <label>{this.props.medicalUse.startTime ? this.props.medicalUse.startTime.substring(0, 10) : ""}至
                                                {this.props.medicalUse.endTime ? this.props.medicalUse.endTime.substring(0, 10) : ""}</label>
                                        </li>
                                    </div> : null
                                }

                            </div>
                        </ul> :
                        <div>
                            {this.props.title == "健康证公示" ?
                                <div>
                                    {this.props.health.length === 0 ?
                                        <div style={{width: "100%", textAlign: "center"}}>
                                            <img src={Null}
                                                 style={{width: "126px"}}
                                                 alt=""/>
                                        </div> :
                                        <div>
                                            {this.props.health.map((item) => (
                                                <div key={item.id}
                                                     style={{
                                                         padding: "10px 10px",
                                                         borderBottom: "1px solid #d3d2d2",
                                                         overflow: "hidden"
                                                     }}>
                                                    <div style={{
                                                        width: "40%",
                                                        display: "inline-block",
                                                        float: "left",
                                                        textAlign: "center",
                                                        marginTop: "25px"
                                                    }}>
                                                        {item.photo === "" || item.photo === "[]" || typeof JSON.parse(item.photo)[0].response == "undefined" ?
                                                            <img src={Health}
                                                                 style={{width: "120px", marginLeft: "-20px"}}
                                                                 alt=""/> :
                                                            <img
                                                                src={commonUrl + '/upload/' + JSON.parse(item.photo)[0].response.data}
                                                                style={{width: "120px", marginLeft: "-20px"}}
                                                                alt=""/>}
                                                    </div>
                                                    <div style={{width: "60%", float: "right"}}>
                                                        <ul>
                                                            <li>
                                                                姓名：{item.name}
                                                            </li>
                                                            <li>
                                                                性别：{item.sexy === 0 ? "男" : "女"}
                                                            </li>
                                                            <li>
                                                                体检情况：{item.health}
                                                            </li>
                                                            <li>
                                                                健康证号：{item.healthNumber}
                                                            </li>
                                                            <li>
                                                                健康证有效期限：
                                                                {item.startTime == null ? "" : item.startTime.substring(0, 10)}至
                                                                {item.endTime == null ? "" : item.endTime.substring(0, 10)}
                                                            </li>

                                                        </ul>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    }

                                </div> :
                                <div>
                                    {this.props.title == "证照信息" ?
                                        <div>
                                            {this.props.photo.length === 0 ?
                                                <div style={{width: "100%", textAlign: "center"}}>
                                                    <img src={Null}
                                                         style={{width: "126px"}}
                                                         alt=""/>
                                                </div> :
                                                <div style={{textAlign: "center"}}>
                                                    {this.props.photo.map((item) => (
                                                        < img
                                                            key={index++}
                                                            src={commonUrl + '/upload/picture/' + item}
                                                            style={{width: "90%", marginTop: "5px"}}
                                                            alt=""/>
                                                    ))}
                                                </div>
                                            }

                                        </div> :
                                        <div>
                                            {this.props.title == "原料索证公示" ?
                                                <div>
                                                    {this.props.rawMaterialList.length === 0 ?
                                                        <div style={{width: "100%", textAlign: "center"}}>
                                                            <img src={Null}
                                                                 style={{width: "126px"}}
                                                                 alt=""/>
                                                        </div> :
                                                        <div>
                                                            {this.props.rawMaterialList.map((item) => (
                                                                <div key={item.id}
                                                                     style={{
                                                                         padding: "10px 10px",
                                                                         borderBottom: "1px solid #d3d2d2",
                                                                         overflow: "hidden"
                                                                     }}>
                                                                    <ul>
                                                                        <li>
                                                                            原料名称：{item.originName}
                                                                        </li>
                                                                        <li>
                                                                            有效期限：
                                                                            {item.produceTime == null ? "" : item.produceTime.substring(0, 10)}至
                                                                            {item.deadTime == null ? "" : item.deadTime.substring(0, 10)}
                                                                        </li>
                                                                        <li>
                                                                            供应商：{item.supplier}
                                                                        </li>
                                                                        <li>
                                                                            验收人：{item.person}
                                                                        </li>
                                                                    </ul>
                                                                </div>
                                                            ))}
                                                        </div>
                                                    }
                                                </div> :
                                                <div>
                                                    {this.props.title == "食品安全相关知识" ?
                                                        <div>
                                                            {this.props.knowledgeList.length === 0 ?
                                                                <div style={{width: "100%", textAlign: "center"}}>
                                                                    <img src={Null}
                                                                         style={{width: "126px"}}
                                                                         alt=""/>
                                                                </div> :
                                                                <div>
                                                                    {this.props.knowledgeList.map((item) => (
                                                                        <div key={item.id}
                                                                             onClick={() => window.location.href = '#/knowledge?id=' + item.id}>
                                                                            <li style={{
                                                                                padding: "8px",
                                                                                backgroundColor: "white",
                                                                                marginBottom: "5px"
                                                                            }}>
                                                                                <p style={{
                                                                                    fontSize: ".95rem",
                                                                                    marginBottom: "5px",
                                                                                    overflow: "hidden",
                                                                                    textOverflow: "ellipsis",
                                                                                    whiteSpace: "nowrap"
                                                                                }}>
                                                                                    {item.title}
                                                                                </p>
                                                                                <p style={{fontSize: ".8rem"}}>{item.publicTime ? item.publicTime.substring(0, 10) : ""} {item.publicTime ? item.publicTime.substring(11, 16) : ""}</p>
                                                                            </li>
                                                                        </div>
                                                                    ))}
                                                                </div>
                                                            }
                                                        </div> :
                                                        <div>
                                                            {this.props.title == "通知公告" ?
                                                                <div>
                                                                    {this.state.noticeList.length === 0 ?
                                                                        <div style={{
                                                                            width: "100%",
                                                                            textAlign: "center"
                                                                        }}>
                                                                            <img src={Null}
                                                                                 style={{width: "126px"}}
                                                                                 alt=""/>
                                                                        </div> :
                                                                        <div>
                                                                            {/*{this.state.noticeList.map((item) => (*/}
                                                                            {/*<div></div>*/}
                                                                            {/*))}*/}
                                                                            <div onClick={() => this.notice()}>
                                                                                <div>
                                                                                    <div>
                                                                                        地点
                                                                                    </div>
                                                                                    <div>
                                                                                        2018-11-26 10:34:44
                                                                                    </div>
                                                                                </div>
                                                                            </div>
                                                                        </div>
                                                                    }
                                                                </div> : null
                                                            }
                                                        </div>
                                                    }
                                                </div>
                                            }
                                        </div>
                                    }
                                </div>
                            }
                        </div>
                    }
                </div>
            </div>
        );
    }
}

export default withRouter(EnterpriseModular);