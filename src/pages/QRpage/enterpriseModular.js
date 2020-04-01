import React, {Component} from 'react'
import './enterpriseModular.css'
import {withRouter} from 'react-router-dom'
import Image1 from './icon/unit_qualification.png'
import Image2 from './icon/health_notarization.png'
import Image3 from './icon/material_request_notarization.png'
import Image4 from './icon/food_safety_related_knowledge.png'
import Image5 from './icon/notification_notice.png'
import Return from './icon/return_right.png'
import Return1 from './icon/return_bottom.png'
import Null from './icon/null.png'
import HeadMan from './icon/head_portrait_man.png'
import HeadWoman from './icon/head_portrait_woman.png'
import axios from "../../axios"
import {commonUrl} from "../../axios/commonSrc"

class EnterpriseModular extends Component {
    constructor(props) {
        super(props);
        this.state = {
            display: "none",
            visibility: "hidden",
            src: Return,

            //权限、许可证List、区域List
            authorityList: [],

            //许可类型、许可证号、发证机关、核定经营项目、许可期限
            authority: [],
            foodCommon: {},
            foodBusiness: {},
            foodCirculate: {},
            cosmeticsUse: {},
            foodProduce: {},
            drugsBusiness: {},
            medicalUse: {},

            //政府部门
            departmentList: [],
            department: "",

            //单位资质
            unitId: {},
            enterpriseName: "",//企业名称
            businessAddress: "",//生产地址
            regulators: "",//日常监管责任机构
            supervisor: "",//日常监管责任人员

            //健康证公示
            healthCertificateList: [],

            //原料索证公示
            rawMaterialList: [],
            rawMaterial: [],

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
            case "原料索证公示":
                return "linear-gradient(#6fa0de,#597ec1)";
            case "食品安全相关知识":
                return "linear-gradient(#55d48b,#2cb165)";
            case "通知公告":
                return "linear-gradient(#a5adf7,#7e87d1)";
        }
    };

    notice = () => {
        console.log("notice:");
        this.props.history.push('/notice');
    };

    componentDidMount() {
        this.getAuthorityList();//获取许可证id与name对应关系
        this.getDepartment();//获取部门id与name对应关系
        if (this.props.title == "单位资质") {
            this.getUnitQualification();
        } else if (this.props.title == "健康证公示") {
            this.getHealthCertificate();
        } else if (this.props.title == "原料索证公示") {
            this.getRawMaterial();
        }
    }

    //获取许可List
    getAuthorityList = () => {
        axios.ajax({
            url: "/sys/user/getTest",
            data: {
                params: {}
            }
        }).then((item) => {
            if (item.status == "success") {
                this.setState({
                    authorityList: item.data.industryList
                })
            }
        })
    };

    //设置许可信息
    setAuthority = () => {
        let authority = [];
        // console.log("foodProduce:" + this.state.foodProduce);
        if (this.state.foodCommon != null) {
            let item1 = {};
            item1.id = 0;
            this.state.authorityList.map((item) => {
                    if (item.remark === "foodCommon") {
                        item1.type = item.premissName;
                    }
                }
            );
            item1.number = this.state.foodCommon.number;
            item1.authority = this.state.foodCommon.licenseAuthority;
            item1.subjectName = "类别";
            item1.subject = this.state.foodCommon.businessType;
            item1.startData = this.state.foodCommon.startTime.substring(0, 10);
            item1.endData = this.state.foodCommon.endTime.substring(0, 10);

            authority.push(item1);
        }
        if (this.state.foodBusiness != null) {
            let item1 = {};
            item1.id = 1;
            this.state.authorityList.map((item) => {
                    if (item.remark === "foodBusiness") {
                        item1.type = item.premissName;
                    }
                }
            );
            item1.number = this.state.foodBusiness.number;
            item1.authority = this.state.foodBusiness.licenseAuthority;
            item1.subjectName = "核定经营项目";
            item1.subject = this.state.foodBusiness.businessProject;
            item1.startData = this.state.foodBusiness.startTime.substring(0, 10);
            item1.endData = this.state.foodBusiness.endTime.substring(0, 10);

            authority.push(item1);
        }
        if (this.state.foodCirculate != null) {
            let item1 = {};
            item1.id = 2;
            this.state.authorityList.map((item) => {
                    if (item.remark === "foodCirculate") {
                        item1.type = item.premissName;
                    }
                }
            );
            item1.number = this.state.foodCirculate.number;
            item1.authority = this.state.foodCirculate.licenseAuthority;
            item1.subjectName = "核定经营项目";
            item1.subject = this.state.foodCirculate.businessProject;
            item1.startData = this.state.foodCirculate.startTime.substring(0, 10);
            item1.endData = this.state.foodCirculate.endTime.substring(0, 10);

            authority.push(item1);
        }
        if (this.state.cosmeticsUse != null) {
            let item1 = {};
            item1.id = 3;
            this.state.authorityList.map((item) => {
                    if (item.remark === "cosmeticsUse") {
                        item1.type = item.premissName;
                    }
                }
            );
            item1.number = this.state.cosmeticsUse.registerCode;
            item1.authority = this.state.cosmeticsUse.licenseAuthority;
            item1.subjectName = "许可项目";
            item1.subject = this.state.cosmeticsUse.licenseProject;
            item1.startData = this.state.cosmeticsUse.startTime.substring(0, 10);
            item1.endData = this.state.cosmeticsUse.endTime.substring(0, 10);

            authority.push(item1);
        }
        if (this.state.foodProduce != null) {
            //查看
            // var property = "";
            // for (var item in this.state.foodProduce) {
            //     property += "属性：" + item + "数值：" + this.state.foodProduce[item] + "\n";
            // }
            // console.log(property);

            let item1 = {};
            item1.id = 4;
            this.state.authorityList.map((item) => {
                    if (item.remark === "foodProduce") {
                        item1.type = item.premissName;
                    }
                }
            );
            item1.number = this.state.foodProduce.number;
            item1.authority = this.state.foodProduce.licenseAuthority;
            item1.subjectName = "添加剂名称";
            item1.subject = "";
            this.state.foodProduce.list.map((item) => {
                // console.log("size:" + this.state.foodProduce.list.length);
                if (this.state.foodProduce.list.length === 0) {

                } else if (this.state.foodProduce.list.length === 1) {
                    item1.subject += item.name;
                } else {
                    item1.subject += item.name + ",";
                }

            });
            item1.startData = this.state.foodProduce.startTime.substring(0, 10);
            item1.endData = this.state.foodProduce.endTime.substring(0, 10);

            authority.push(item1);
        }
        if (this.state.drugsBusiness != null) {
            let item1 = {};
            item1.id = 5;
            this.state.authorityList.map((item) => {
                    if (item.remark === "drugsBusiness") {
                        item1.type = item.premissName;
                    }
                }
            );
            item1.number = this.state.drugsBusiness.number;
            item1.authority = this.state.drugsBusiness.licenseAuthority;
            item1.subjectName = "经营范围";
            item1.subject = this.state.drugsBusiness.businessScope;
            item1.startData = this.state.drugsBusiness.startTime.substring(0, 10);
            item1.endData = this.state.drugsBusiness.endTime.substring(0, 10);

            authority.push(item1);
        }
        if (this.state.medicalUse != null) {
            let item1 = {};
            item1.id = 6;
            this.state.authorityList.map((item) => {
                    if (item.remark === "medicalUse") {
                        item1.type = item.premissName;
                    }
                }
            );
            item1.number = this.state.medicalUse.registerNumber;
            item1.authority = this.state.medicalUse.licenseAuthority;
            item1.subjectName = "诊疗科目";
            item1.subject = this.state.medicalUse.medicalSubject;
            item1.startData = this.state.medicalUse.startTime.substring(0, 10);
            item1.endData = this.state.medicalUse.endTime.substring(0, 10);

            authority.push(item1);
        }
        this.setState({
            authority: authority
        });
    };

    //获取部门List
    getDepartment = () => {
        axios.ajax({
            url: "/supervision/enterprise/getDeptAndGrid",
            data: {
                params: {}
            }
        }).then((item) => {
            if (item.status === "success") {
                this.setState({
                    departmentList: item.data.deptTree
                });
            }
        })
    };

    //设置部门
    setDepartment = () => {
        this.state.departmentList.map((item) => {
            // console.log("item.id:" + item.id);
            // console.log("this.state.regulators:" + this.state.regulators);
            if (item.id === this.state.regulators) {
                this.setState({
                    department: item.name
                });
            }
        })
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
                console.log("getUnitQualificationItem:");
                this.setState({
                    enterpriseName: item.data.enterpriseName,
                    businessAddress: item.data.businessAddress,
                    regulators: item.data.regulators,
                    supervisor: item.data.supervisor,
                    foodCommon: item.data.foodCommon,
                    foodBusiness: item.data.foodBusiness,
                    foodCirculate: item.data.foodCirculate,
                    cosmeticsUse: item.data.cosmeticsUse,
                    foodProduce: item.data.foodProduce,
                    drugsBusiness: item.data.drugsBusiness,
                    medicalUse: item.data.medicalUse,
                });
                this.setAuthority();//匹配许可
                this.setDepartment();//匹配部门
                // this.props.dispatchParent(item);
            }
        })
    };

    //健康证List
    getHealthCertificate = () => {
        axios.PostAjax({
                url: "/supervision/ca/getPage",
                data: {
                    params: {
                        companyName: "张晨晨的小店",
                        areaList: [""],
                        name: "",
                        education: "",
                        sexy: "",
                        workType: "",
                        health: "",
                        healthNumber: "",
                        startTime: "",
                        endTime: ""
                    }
                }
            }
        ).then((item) => {
            if (item.status === "success") {
                console.log("get Health Certificate");
                this.setState({
                    healthCertificateList: item.data.data
                })
            }
        })
    };

    //原料索证List
    getRawMaterial = () => {
        console.log("getRawMaterial");
        axios.PostAjax({
            url: "/formatoriginrecord/getPage",
            data: {
                params: {
                    enterprise: "企业s名4称123",
                    start: "",
                    end: ""
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

    render() {
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
                                <label>{this.state.enterpriseName}</label>
                            </li>
                            <li>
                                生产地址：
                                <label>{this.state.businessAddress}</label>
                            </li>
                            <li>
                                日常监管责任机构：
                                <label>{this.state.department}</label>
                            </li>
                            <li>
                                日常监管责任人员：
                                <label>{this.state.supervisor}</label>
                            </li>
                            <div>
                                {this.state.authority.map((item) => (
                                    <div key={item.id}>
                                        <li style={{fontWeight: "bold"}}>
                                            许可证类型：
                                            <label>{item.type}</label>
                                        </li>
                                        <li>
                                            许可证号：
                                            <label>{item.number}</label>
                                        </li>
                                        <li>
                                            发证机关：
                                            <label>{item.authority}</label>
                                        </li>
                                        <li>
                                            {item.subjectName}：
                                            <label>{item.subject}</label>
                                        </li>
                                        <li>
                                            许可期限：
                                            <label>{item.startData}至{item.endData}</label>
                                        </li>
                                    </div>
                                ))}
                            </div>
                        </ul> :
                        <div>
                            {this.props.title == "健康证公示" ?
                                <div>
                                    {this.state.healthCertificateList.length === 0 ?
                                        <div style={{width: "100%", textAlign: "center"}}>
                                            <img src={Null}
                                                 style={{width: "126px"}}
                                                 alt=""/>
                                        </div> :
                                        <div>
                                            {this.state.healthCertificateList.map((item) => (
                                                <div key={item.id}
                                                     style={{
                                                         padding: "10px 10px",
                                                         borderBottom: "1px solid #d3d2d2",
                                                         overflow: "hidden"
                                                     }}>
                                                    <div style={{
                                                        width: "30%",
                                                        display: "inline-block",
                                                        float: "left",
                                                        textAlign: "center",
                                                        marginTop: "25px"
                                                    }}>
                                                        {item.photo === "" || item.photo === "[]" ?
                                                            <img src={item.sexy === 0 ? HeadMan : HeadWoman}
                                                                 style={{width: "60px"}}
                                                                 alt=""/> :
                                                            <img
                                                                src={commonUrl + '/upload/picture/' + JSON.parse(item.photo)[0].response.data}
                                                                style={{width: "60px"}}
                                                                alt=""/>}
                                                    </div>
                                                    <div style={{width: "70%", float: "right"}}>
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
                                                                {item.startTime.substring(0, 10)}至
                                                                {item.endTime.substring(0, 10)}
                                                            </li>

                                                        </ul>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    }

                                </div> :
                                <div>
                                    {this.props.title == "原料索证公示" ?
                                        <div>
                                            {this.state.rawMaterialList.length === 0 ?
                                                <div style={{width: "100%", textAlign: "center"}}>
                                                    <img src={Null}
                                                         style={{width: "126px"}}
                                                         alt=""/>
                                                </div> :
                                                <div>
                                                    {this.state.rawMaterial.map((item) => (
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
                                                                    {item.produceDate.substring(0, 10)}至
                                                                    {item.deadDate.substring(0, 10)}
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
                                                    {this.state.knowledgeList.length === 0 ?
                                                        <div style={{width: "100%", textAlign: "center"}}>
                                                            <img src={Null}
                                                                 style={{width: "126px"}}
                                                                 alt=""/>
                                                        </div> :
                                                        <div>
                                                            {this.state.knowledgeList.map((item) => (
                                                                <div>

                                                                </div>
                                                            ))}
                                                        </div>
                                                    }
                                                </div> :
                                                <div>
                                                    {this.props.title == "通知公告" ?
                                                        <div>
                                                            {this.state.noticeList.length !== 0 ?
                                                                <div style={{width: "100%", textAlign: "center"}}>
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
            </div>
        );
    }
}

export default withRouter(EnterpriseModular);