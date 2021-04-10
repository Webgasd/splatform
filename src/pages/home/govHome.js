import React, { Component } from 'react';
import { Card, Row, Col, List, Table, Modal, message } from 'antd';
import ReactEcharts from 'echarts-for-react';
import { commonUrl, unitName } from '../../axios/commonSrc'
import echartTheme from './echartTheme';
import moment from 'moment';
import Utils from "../../utils";
import connect from "react-redux/es/connect/connect";
import axios from "../../axios";
import Add from "../supervision/enterpriseEx/Add";
import tubiao from "./image/pic1.png";
import InfoWindow from './InfoWindow'
import liXiaApkPicture from './image/lixia.png';
import linQingApkPicture from './image/linqing.png'
import taiAnApkPicture from './image/taian.png'
import pingYuanApkPicture from './image/pingyuan.png'
import dongYingApkPicture from './image/dongying.png'
import pingYiApkPicture from './image/pingyi.png'
import boxingApkPicture from './image/boxing.png'
import zhongduan from './image/zhongduan.png';
import { changeEnterprise, clearEnterprise } from "../../redux/action";
//引入地图的不同标识
import Eat from "./image/eat.png"
//按需加载echarts
import echarts from 'echarts/lib/echarts';
// 引入饼图和折线图
import 'echarts/lib/chart/bar';
import 'echarts/lib/chart/pie';
// 引入提示框和标题组件
import 'echarts/lib/component/tooltip';
import 'echarts/lib/component/title';
import 'echarts/lib/component/legend';
import 'echarts/lib/component/markPoint';
//弹窗图标
import CorporateIcon from "../grid/showGrid/image/弹窗地图定位图标.png";
import ToGaoDeMap from "../grid/showGrid/image/icon_daohang-copy.png";
import CommonCheck from "../grid/showGrid/image/dangan的副本 2.png";
import CheckView from "../grid/showGrid/image/jiankong.png";
import BaseInfo from "../grid/showGrid/image/qiye.png";
//引入地图点位图标
import bussiness from "../grid/showGrid/image/食品经营(小).png";
import eatlocation from "../grid/showGrid/image/餐饮定位(小).png";
import transform from "../grid/showGrid/image/流通定位(小).png";
import produce from "../grid/showGrid/image/食品生产定位(小).png";
import school from "../grid/showGrid/image/学校定位(小).png";

const AMap = window.AMap;
let markers = []
let cluster = []
let zoom = []
const option3 = [
    {
        title: '各监管所电子平台使用情况2019-5-02',
    },
    {
        title: '各监管所电子平台使用情况2019-4-25',
    },
    {
        title: '各监管所电子平台使用情况2019-4-15',
    },
    {
        title: '各监管所电子平台使用情况2019-4-05',
    },
    {
        title: '各监管所电子平台使用情况2019-4-05',
    }
];
const columns = [
    {
        title: '企业名称',
        dataIndex: 'enterpriseName',
    },
    {
        title: '过期时间',
        dataIndex: 'endTime',
        render: Utils.formatDateNoTime
    }
];

@connect(
    state => ({
       // industryList: state.industryList.slice(1),//不含食品经营
        industryList: state.industryList,//全部类型
    }), {
    clearEnterprise,
    changeEnterprise,
}
)
class govHome extends Component {
    constructor(props) {
        super(props)
        this.state = {
            comAmount: '3000',
            perAmount: '300',
            enterpriseStatistics: {},
            visible: false,
            PointsList: [],
            BaseInfo: [],
            AddressForGaoDe: '',
            GaInfo: [],
            areaList: [],
            TopArea: [],
            areaCount: [],
            area: [],
            searchEmployee: ''
        }
        window.getBaseInfo = () => this.getBaseInfo();
        window.ToGaodeLocation = () => this.ToGaodeLocation();
    }

    componentWillMount() {
        echarts.registerTheme('UPC', echartTheme);
    }

    componentDidMount() {
        var district = unitName;
        var polygons = [];
        this.drawBounds(district, polygons)
        this.map = new AMap.Map('mapHomeContainer', {
            center: [117.050673, 36.659766],
            pitch: 25, // 地图俯仰角度，有效范围 0 度- 83 度//历下区是15
            viewMode: '3D', // 地图模式
            // mask:polygons
        });
        let this_ = this;
        this.map.setZoom(unitName == '历下区' ? 13 : 11.5)
        this.getdata();
        this.govGet();
        this.getTree();
        this.getAreaEnterprise()
        this.map.on("zoomend", function () {
            let nowzoom = this_.map.getZoom();
            zoom.push(nowzoom);
            let l = zoom.length;
            let lastzoom = zoom[l - 2];
            console.log(nowzoom, lastzoom)
            if (nowzoom <= 14 && lastzoom >= 14) {
                this_.clearAll();
                this_.drawBounds(district, polygons)
                this_.getdata();
            }
        });
    }

    govGet = () => {
        axios.noLoadingAjax({
            url: '/sys/user/govGet',
            data: {
                params: {}
            }
        }).then((res) => {
            if (res.status == "success") {
                this.setState({
                    enterpriseList: res.data.enterpriseList,
                    enterpriseStatistics: res.data.enterpriseStatistics
                })
            }
        })
    }
    getAreaEnterprise = () => {
        let that = this
        axios.noLoadingAjax({
            url: '/grid/points/getAreaEnterprise',
            data: {
                params: {}
            }
        }).then((res) => {
            console.log(res)
            if (res.status == 'success') {
                let list = res.data.areaList;
                let value = res.data.areaCount
                let areaCount = []
                let area = []
                for (var key in list) {
                    let child = list[key]
                    area.push(child.name)
                }
                this.props.industryList.map((item) => {//循环业态
                    let litsvalue = []
                    let name = ''
                    for (var key0 in list) {//循环地区
                        let id = list[key0].id
                        for (var key1 in value) {//循环取出地数据
                            if (id == key1) {
                                let child = value[key1]
                                for (var key2 in child) {//对每个数据取出，加进数组
                                    if (key2 == item.remark) {
                                        litsvalue.push(child[key2]) /////取出对应的业态的数
                                    }
                                }
                            }
                        }
                    }
                    areaCount.push({name: item.name, type: 'bar', stack: "叠加", data: litsvalue})
                })
                this.setState({
                    areaCount,
                    area,
                })
            }
        })
    }
    getTree = () => {
        axios.noLoadingAjax({
            url: '/sys/area/tree',
            data: {
                params: {}
            }
        }).then((res) => {
            if (res.status == 'success') {
                let TopArea = []
                res.data[0].childrenList.map((item) => {
                    TopArea.push(item)
                })
                this.setState({
                    areaList: res.data,
                    TopArea
                })
            }
        })
    }
    clearAll = () => {
        this.map.clearMap();
        cluster.map((item, index) => {
            this.map.remove(item);
        })
    }
    getdata = () => {
        axios.ajax({
            url: "/grid/grid/getTop",
            data: {
                params: {}
            }
        }).then((res) => {
            if (res.status == "success") {
                // console.log(res.data)
                this.drawGrid(res);
            }
        })
        if (this.state.PointsList.length > 0) {
            if (unitName !== "历下区") {
                this.addGridPoints(this.state.PointsList)
            }
        } else {
            axios.PostAjax({
                url: "/grid/points/getSmilePoints",
                data: {
                    params: { areaList: [''], industryList: [''] }
                }
            }).then((res) => {
                if (res.status == "success") {
                    if (unitName !== "历下区") {
                        this.addGridPoints(res.data)
                    }
                    this.setState({
                        PointsList: res.data
                    })
                }
            })
        }
    };
    drawGrid = (data1) => {
        this.setState({
            gridData: data1.data
        })
        data1.data.map((item, index) => {
            this.changeToPoints(item);
        })
    };
    addGridPoints = (data) => {
        console.log(data)
        let l = markers.length

        markers[l] = []
        let that = this;
        data.map((item, index) => {
            let icon
            for (var key in item) {
                that.props.industryList.map((item1) => {
                    if (item1.remark == key && item[key] !== null) {
                        switch (key) {
                            case "foodBusiness": {
                                if (item["businessType"] == "餐饮服务经营者" || item["businessType"] == "餐饮服务经营者(连锁)"
                                    || item["businessType"] == "餐饮服务经营者(非连锁)" || item["businessType"] == "单位食堂") {
                                    if (unitName == "泰山区") {
                                        icon = school;
                                        break;
                                    } else {
                                        icon = eatlocation;
                                        break;
                                    }
                                } else if (item["businessType"] == "食品销售经营者" || item["businessType"] == "食品销售经营者(连锁)"
                                    || item["businessType"] == "食品销售经营者(非连锁)") {
                                    icon = transform;
                                    break;
                                } else {
                                    icon = bussiness;
                                    break;
                                }
                            }
                            case "foodCommon": {
                                if (unitName == "泰山区") {
                                    icon = school;
                                    break;
                                } else {
                                    icon = eatlocation;
                                    break;
                                }
                            }
                            case "foodCirculate": {
                                icon = transform;
                                break;
                            }
                            case "foodProduce": {
                                icon = produce;
                                break;
                            }
                            case "drugsBusiness": {
                                icon = Eat;
                                break;
                            }
                            case "medicalUse": {
                                icon = Eat;
                                break;
                            }
                            case "cosmeticsUse": {
                                icon = Eat;
                                break;
                            }
                            default: {
                                icon = Eat;
                            }
                        }
                    }
                })
            }
            let point = item.point;
            //point不为空再把它加到簇里
            if (!!point) {
                let point1 = point.split(",")
                let p = new AMap.Marker({
                    position: point1,
                    // position: [JSON.parse(point1[0]), JSON.parse(point1[1])],
                    icon: icon,
                    enterpriseId: item.enterpriseId
                })
                AMap.event.addListener(p, 'click', function (e) {
                    let id = e.target.w.enterpriseId;
                    axios.ajax({
                        url: '/supervision/enterprise/getById',
                        data: { params: { id: id } }
                    }).then((res) => {
                        if (res.status == 'success') {
                            that.setState({
                                BaseInfo: { ...res.data, enterpriseId: id },
                                AddressForGaoDe: res.data.registeredAddress
                            })
                            let value = res.data
                            let info = [];
                            let imagelist = JSON.parse(value.propagandaEnclosure || JSON.stringify([]));
                            let start, end
                            for (var key in value) {
                                that.props.industryList.map((item) => {
                                    if (item.remark == key && value[key] !== null) {
                                        start = value[key].startTime
                                        end = value[key].endTime
                                    }
                                })
                            }
                            let startTime = moment(start).format("YYYY-MM-DD")
                            let endTime = moment(end).format("YYYY-MM-DD")
                            info.push("<div class='content-window-card'><div class='title'>信息</div>");
                            info.push("<div class='pic-dom'>");
                            if (imagelist && imagelist.length > 0) {
                                info.push("<div class='pic'><img alt='example'style={{ width: '100%' }} src=" + commonUrl + "/upload/picture/" + imagelist[0].response.data + "/></div>")
                            } else {
                                info.push("<div class='pic'><text>企业营业许可证</text></div>")
                            }
                            if (imagelist && imagelist.length > 1) {
                                info.push("<div class='pic'><img alt='example'style={{ width: '100%' }} src=" + commonUrl + "/upload/picture/" + imagelist[1].response.data + "/></div>")
                            } else {
                                info.push("<div class='pic'><text>企业营业许可证</text></div>")
                            }
                            info.push("</div>");
                            info.push("<div class='middle'><img src='" + CorporateIcon + "' width='30px' height='30px'/><text>" + value.enterpriseName + "</text></div>");
                            info.push("<div class='middle-info'><div class='middle-info-text'><text>企业地址:" + value.businessAddress + "</text></div></div>");
                            info.push("<div class='middle-info'><div class='middle-info-text'><text>法人/负责人：" + value.legalPerson + "</text></div>" +
                                "<div class='middle-info-text1'><text>联系电话：" + value.cantactWay + "</text></div></div>");
                            info.push("<div class='middle-info'><div class='middle-info-text'><text>日常监督员：" + value.supervisor + "</text></div></div>");
                            info.push("<div class='middle-info'><div class='middle-info-text'><text>证件有效期：" + startTime + "至" + endTime + "</text></div></div>");
                            info.push("<div class='bottom-icon'><img src='" + ToGaoDeMap + "' onclick='ToGaodeLocation()' width='40px' height='40px'/></div>");
                            info.push("<div class='bottom-icon'><img src='" + CommonCheck + "' width='40px' height='40px'/></div><Divider type=\"vertical\" />");
                            info.push("<div class='bottom-icon'><img src='" + CheckView + "' width='40px' height='40px'/></div><Divider type=\"vertical\" />");
                            info.push("<div class='bottom-icon'><img src='" + BaseInfo + "'id='BaseInfo' onclick='getBaseInfo()'  width='40px' height='40px'/></div><Divider type=\"vertical\" />");
                            info.push("</div>");

                            let infoWindow = new AMap.InfoWindow({
                                content: info.join(""),  //使用默认信息窗体框样式，显示信息内容
                                offset: new AMap.Pixel(13, -25),
                            });
                            infoWindow.open(that.map, p.getPosition())
                        }
                    })
                });
                markers[l].push(p)
            }
        });
        cluster[l] = []
        this.map.plugin(["AMap.MarkerClusterer"], function () {
            cluster[l] = new AMap.MarkerClusterer(that.map, markers[l], {
                gridSize: 60,
                minClusterSize: 5,
            });
        });
    };
    getBaseInfo = () => {
        // console.log(this.state.BaseInfo)
        // this.setState({
        //     visible: true,
        // })
        // let data = this.state.BaseInfo;
        // this.props.changeEnterprise({
        //     ...data,
        //     propagandaEnclosure: JSON.parse(data.propagandaEnclosure || JSON.stringify([]))
        // });
        axios.ajax({
            url: '/supervision/enterprise/getById',
            data: {
                params: {
                    id: this.state.BaseInfo.enterpriseId
                }
            }
        }).then((res) => {
            if (res.status == 'success') {
                this.setState({
                    visible: true,
                    searchEmployee: this.state.BaseInfo.enterpriseId
                })
                let data = res.data;
                this.props.changeEnterprise({
                    ...data,
                    propagandaEnclosure: JSON.parse(data.propagandaEnclosure || JSON.stringify([])),
                    businessLicensePhoto: JSON.parse(data.businessLicensePhoto || JSON.stringify([])),
                    foodBusinessPhotos: JSON.parse(data.foodBusinessPhotos || JSON.stringify([])),
                    smallCaterPhotos: JSON.parse(data.smallCaterPhotos || JSON.stringify([])),
                    smallWorkshopPhotos: JSON.parse(data.smallWorkshopPhotos || JSON.stringify([])),
                    foodProducePhotos: JSON.parse(data.foodProducePhotos || JSON.stringify([])),
                    drugsBusinessPhotos: JSON.parse(data.drugsBusinessPhotos || JSON.stringify([])),
                    drugsProducePhotos: JSON.parse(data.drugsProducePhotos || JSON.stringify([])),
                    cosmeticsUsePhotos: JSON.parse(data.cosmeticsUsePhotos || JSON.stringify([])),
                    medicalProducePhotos: JSON.parse(data.medicalProducePhotos || JSON.stringify([])),
                    medicalBusinessPhotos: JSON.parse(data.medicalBusinessPhotos || JSON.stringify([])),
                    industrialProductsPhotos: JSON.parse(data.industrialProductsPhotos || JSON.stringify([])),
                    publicityPhotos: JSON.parse(data.publicityPhotos || JSON.stringify([])),
                    certificatePhotos: JSON.parse(data.certificatePhotos || JSON.stringify([])),
                    otherPhotos: JSON.parse(data.otherPhotos || JSON.stringify([]))
                });
            }
        })

    }
    ToGaodeLocation = () => {
        const w = window.open('about:blank');
        w.location.href = 'https://www.amap.com/search?query=' + this.state.AddressForGaoDe + "&city=370200"
    }
    changeToPoints = (data) => {
        let parentId = data.parentId
        let point = data.center.split(",")
        let name = data.name;
        let color = data.color;
        let level = data.level.split(".")
        let areaid = data.areaId
        let point1 = [JSON.parse(point[1]), JSON.parse(point[0])]
        let remark1 = data.polygon.split(",");
        let path = [];
        for (let i = 0, l = remark1.length; i < l / 2; i++) {
            let p = [JSON.parse(remark1[2 * i + 1]), JSON.parse(remark1[2 * i])]
            path.push(p)
        }
        let polygon = new AMap.Polygon({
            path: path,
            strokeColor: '#0091ea',  //线颜色
            strokeOpacity: 1,  //线透明度
            strokeWeight: 1,  //线粗细度
            fillColor: color,  //填充颜色
            fillOpacity: 0.3, //填充透明度
            bubble: true,
            lineJoin: '2px',
            mapName: name,
            areaId: areaid,
            level: level.length
        });
        this.map.add(polygon);
        polygon.on("click", this.getIn)
        this.addGridLabel(color, name, point1, areaid, parentId, level.length);
    };
    addGridLabel = (color, gridname, points, areaid, parentId, level) => {
        let text = new AMap.Text({
            text: gridname,
            verticalAlign: 'bottom',
            position: points,
            offset: new AMap.Pixel(0, 15),
            style: {
                'background-color': 'rgba(204,204,204,0.9)',
                'text-align': 'center',
                'border-radius': '.25rem',
                'border-width': 1,
                'width': '100px',
                'padding': '5px 2px 5px',
                'border-color': 'white',
                'box-shadow': '0 2px 6px 0 rgba(114, 124, 245, .5)',
                'color': "black",
                'font-size': '14px',
                'lineJoin': '4px'
            }
        });
        this.map.add(text)
        let that = this;
        this.map.on("zoomend", function () {
            let nowzoom = that.map.getZoom();
            if (nowzoom <= 11) {
                text.hide();
            } else {
                text.show()
            }
        });
        AMap.event.addListener(text, 'click', function () {
            var info = [];
            let value = that.getGridShowNumber(areaid, level)
            let list = that.GaInfo(areaid, parentId, level)
            list.then(res => {
                let findindex = res.findIndex((item, index) => (item.job == 5))
                let leadname = '', leadphone = ''
                if (findindex >= 0) {
                    leadname = res[findindex].name
                    leadphone = res[findindex].mobilePhone
                }
                info.push("<div class='input-card content-window-card'><div class='labelTitle'>信息</div>");
                info.push("<div class='Top'><div class='TopPic'><div class='Pic'><img src='" + tubiao + "' alt={''}/></div></div>");
                info.push("<div class='TopInfo'><text>区域名称:" + gridname + "</text></div>");
                info.push("<div class='TopInfo'><text>负责人:" + leadname + "</text></div>");
                info.push("<div class='TopInfo'><text>联系电话:" + leadphone + "</text></div></div>");
                info.push("<div class='labelMiddle'><div class='middleLeft'><text>执法人员:</text></div>");
                info.push("<div class='middleDiliver'></div>");
                info.push("<div class='middleRight'><text>" + res.map((item, index) => {
                    if (findindex != index) return item.name;
                }) + "</text></div></div>");
                info.push("<div class='Bottom'><div class='BottomTitle'><text>辖区企业总计（家）：" + value.total + "</text></div><div class='BottomDiliver'></div>");
                value.child.map((item, index) => {
                    info.push("<div class='BottomInfo'><text" + index % 4 + ">" + item.name + ":" + item.num + "</text></div>");
                })
                info.push("</div></div>");
                let infoWindow = new AMap.InfoWindow({
                    content: info.join(""),  //使用默认信息窗体框样式，显示信息内容
                    offset: new AMap.Pixel(0, -15),
                });
                infoWindow.open(that.map, text.getPosition());
            })
        });
    };
    GaInfo = (areaid, parentId, level) => {
        let promise
        let that = this
        if (level == 2) {
            promise = new Promise(function (resolve, reject) {
                that.getGaInfo(areaid, level).then(res => {
                    resolve(res)
                })
            })
        } else if (level == 3) {
            promise = new Promise(function (resolve, reject) {
                that.getGaInfo(parentId, level).then(res => {
                    resolve(res)
                })
            })
        }
        return promise
    }
    getGaInfo = (id, level) => {
        let promise = new Promise(function (resolve, reject) {
            axios.noLoadingAjax({
                url: '/supervision/ga/getGaForMap',
                data: {
                    params: { id: id, level: level }
                }
            }).then((res) => {
                if (res.status == 'success') {
                    resolve(res.data)
                }
            })
        })
        return promise;
    }
    getGridShowNumber = (id, le) => {
        console.log(le, id)
        let list = []
        if (le == 2) {
            list = this.state.PointsList.filter((item) => (item.area == id))
        } else if (le == 3) {
            list = this.state.PointsList.filter((item) => (item.grid == id))
        }
        let chlid = []
        this.props.industryList.map((item) => {
            let num = 0
            list.map((item1) => {
                for (var key in item1) {
                    if (key == item.remark && item1[key] !== null) {
                        num++
                    }
                }
            })
            chlid.push({ name: item.name, num: num })
        })
        let value = { total: list.length, child: chlid }
        return value
    }
    getIn = (e) => {
        let name = e.target.w.mapName
        let id = e.target.w.areaId
        let level = e.target.w.level
        let path = e.target.getPath()
        let polygon = new AMap.Polygon({
            strokeWeight: 1,
            path: path,
            fillOpacity: 0.1,
            fillColor: '#051040',
            strokeColor: '#ea5299'
        });
        this.clearAll()
        this.map.setFitView(polygon);//视口自适应
        // this.map.setZoom(14);
        if (level == 2) {
            this.getdata1(id)
        } else {
            this.map.add(polygon);
            this.getdata1(id)
            this.getdata2(id)
        }
    }
    getdata1 = (id) => {
        axios.ajax({
            url: "/grid/grid/getByParentId",
            data: {
                params: { id: id }
            }
        }).then((res) => {
            if (res.status == "success") {
                if (res.data.length > 0) {
                    res.data.map((item, index) => {
                        this.changeToPoints(item);
                        let id = item.areaId;
                        // this.getdata2(id);
                    })
                }
            }
        })
    }
    getdata2 = (id) => {
        let list = []
        list = this.state.PointsList.filter((item) => (item.grid == id))
        this.addGridPoints(list);
        // axios.ajax({
        //     url:"/grid/points/getByAreaId",
        //     data: {
        //         params:{id:id}
        //     }
        // }).then((res)=>{
        //     if(res.status == "success"){
        //         if(res.data.length>0){
        //             if(res.data.length>0){
        //                 console.log("123")
        //                 this.addGridPoints(res.data);
        //             }
        //         }
        //     }
        // })

    }
    //设置Apk二维码图片
    setApkPicture = () => {
        switch (unitName) {
            case "历下区":
                return liXiaApkPicture;
            case "平原县":
                return pingYuanApkPicture;
            case "临清市":
                return linQingApkPicture;
            case "泰山区":
                return taiAnApkPicture;
            case "东营区":
                return dongYingApkPicture;
            case "平邑县":
                return pingYiApkPicture;
            case "博兴县":
                return boxingApkPicture;
            default:
                return liXiaApkPicture;
        }
    };

    drawBounds(district, polygons) {
        let that = this;
        AMap.service('AMap.DistrictSearch', function () {//回调函数
            var opts = {
                subdistrict: 1,   //返回下一级行政区
                showbiz: false,  //查询行政级别为 市
                extensions: 'all',  //返回行政区边界坐标组等具体信息
                level: "district"  //查询行政级别为 市
            };
            //实例化DistrictSearch
            let districtSearch = new AMap.DistrictSearch(opts);
            districtSearch.search(district, function (status, result) {
                let bounds = result.districtList[0].boundaries;//生成行政区划polygon
                var polygon = []
                for (var i = 0; i < bounds.length; i += 1) {
                    var polygon1 = new AMap.Polygon({
                        strokeWeight: 1,
                        path: bounds[i],
                        fillOpacity: unitName == '历下区' ? 0 : 0.3,///0.3
                        fillColor: '#4fb8f5',
                        strokeColor: '#0091ea',
                        zIndex: 0
                    });
                    polygon.push(polygon1)
                }
                that.map.add(polygon1);
                that.map.setFitView(polygon1);//视口自适应
                that.map.setZoom(13)
                // that.map.setZoom(11.5)
                that.map.setZoom(unitName == "历下区" ? 13 : 11.5)
            })
        })
    }

    render() {
        const option = {
            tooltip: {
                trigger: 'axis'
            },
            legend: {
                data: ['Top1', 'Top2', 'Top3', 'Top4', 'Top5',]
            },
            xAxis: {
                data: ['解放路街道', '趵突泉街道', '大明湖街道', '文东街道', '龙洞街道']
            },
            yAxis: {
                type: 'value'
            },
            series: [
                {
                    name: 'Top1',
                    type: 'bar',
                    barWidth: 20,
                    data: [
                        1000,
                        2000,
                        2500,
                        4000,
                        6000,
                        7000,

                    ]
                }, {
                    name: 'Top2',
                    type: 'bar',
                    barWidth: 20,
                    data: [
                        1000,
                        2000,
                        4000,
                        6000,
                        7000,

                    ]
                }, {
                    name: 'Top3',
                    type: 'bar',
                    barWidth: 20,
                    data: [
                        2000,
                        2500,
                        4000,
                        6000,
                        7000,

                    ]
                }, {
                    name: 'Top4',
                    type: 'bar',
                    barWidth: 20,
                    data: [
                        1000,
                        2000,
                        2500,
                        4000,
                        6000,

                    ]
                }, {
                    name: 'Top5',
                    type: 'bar',
                    barWidth: 20,
                    data: [
                        7000,
                        1000,
                        2000,
                        2500,
                        4000,
                    ]
                },
            ]
        }
        const option1 = {
            title: {
                text: '企业信息'
            },
            tooltip: {
                trigger: 'axis'
            },
            legend: {
                data: ['数量']
            },
            xAxis: {
                data: (this.props.industryList || []).map((item) => item.name) || []
            },
            yAxis: {
                type: 'value'
            },
            series: [
                {
                    name: '数量',
                    type: 'bar',
                    barWidth: 30,
                    data: (this.props.industryList || []).map((item) => ((this.state.enterpriseStatistics)[item.id])) || [],
                    itemStyle: {
                        normal: {
                            // 随机显示
                            //color:function(d){return "#"+Math.floor(Math.random()*(256*256*256-1)).toString(16);}

                            // 定制显示（按顺序）
                            color: function (params) {
                                var colorList = ['#C33531', '#EFE42A', '#64BD3D', '#EE9201', '#29AAE3', '#B74AE5', '#0AAF9F', '#E89589', '#16A085', '#4A235A', '#C39BD3 ', '#F9E79F', '#BA4A00', '#ECF0F1', '#616A6B', '#EAF2F8', '#4A235A', '#3498DB'];
                                return colorList[params.dataIndex]
                            }
                        },
                    },
                },
            ]
        }
        const option2 = {
            title: {
                text: '企业信息',
                x: 'center'
            },
            legend: {
                orient: 'vertical',
                right: 10,
                top: 20,
                bottom: 20,
                data: (this.props.industryList || []).map((item) => item.name) || []
            },
            tooltip: {
                trigger: 'item',
                formatter: "{a} <br/>{b} : {c} ({d}%)"
            },
            series: [
                {
                    name: '数量',
                    type: 'pie',
                    radius: '55%',
                    center: [
                        '50%', '60%'
                    ],
                    data: (this.props.industryList || []).map((item) => {
                        return { name: item.name, value: (this.state.enterpriseStatistics)[item.id] }
                    }) || [],
                    itemStyle: {
                        emphasis: {
                            shadowBlur: 10,
                            shadowOffsetX: 0,
                            shadowColor: 'rgba(0, 0, 0, 0.5)'
                        }
                    }
                }
            ]
        }
        const modal = (<Modal
            title="企业信息"
            visible={this.state.visible}
            destroyOnClose
            getContainer={() => this.refs.mapHomeCard}
            centered={true}
            mask={false}
            width={"90%"}
            height={"100%"}
            onCancel={() => {
                this.props.clearEnterprise();
                this.setState({
                    visible: false,
                })
            }}
            footer={false}
        >
            <Add type={"detail"} searchEmployee={this.state.searchEmployee} />
            {/*<InfoWindow  />*/}
        </Modal>)
        const option4 = {
            tooltip: {
                trigger: 'axis',
                axisPointer: {            // 坐标轴指示器，坐标轴触发有效
                    type: 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
                }
            },
            legend: {
                textStyle: {
                    color: '#000000',
                    // backgroundColor: '#999',
                    borderRadius: 3,
                    padding: [3, 5]
                },
                data: (this.props.industryList || []).map((item) => item.name) || []
            },
            grid: {
                left: '4%',
                right: '3%',
                bottom: '4%',
                containLabel: true
            },
            xAxis: [
                {
                    type: 'category',
                    data: this.state.area || []
                }
            ],
            yAxis: [
                {
                    type: 'value'
                }
            ],
            series: this.state.areaCount || []
        };
        return (
            <div ref='mapHomeCard'>
                <Row gutter={16}>
                    <Col span={16}>
                        <Card title='网格地图'>
                            <div className="map-wrap">
                                <div ref='mapHomeCard' id="mapHomeContainer"
                                    style={{ height: '800px', width: '100%' }}></div>
                            </div>
                        </Card>
                    </Col>
                    <Col span={8}>
                        <Card title='业态检查统计' type='inner' extra={<a>更多</a>}>
                            <ReactEcharts
                                option={option2}
                                theme="UPC"
                                notMerge={true}
                                lazyUpdate={true}
                                style={{ height: 230 }} />
                        </Card>
                        <Card title='移动执法终端下载' className='overTimeCard' type='inner' extra={<a>More</a>}
                            style={{ marginTop: 10 }}>
                            <Row>
                                <Col span={12}>
                                    <img src={zhongduan} style={{ height: 120, marginLeft: 20, marginTop: 10 }} />
                                    <div style={{ marginLeft: 20 }}>移动执法终端下载</div>
                                </Col>
                                <Col span={12}>
                                    <img src={this.setApkPicture()}
                                        style={{ height: 150, marginLeft: 20, marginTop: 10, marginBottom: 10 }} />
                                </Col>
                            </Row>
                        </Card>
                        {/*<Card title='通知公告' className='overTimeCard' type='inner' extra={<a>More</a>} style={{marginTop:10}}>*/}
                        {/*<List*/}
                        {/*itemLayout="horizontal"*/}
                        {/*dataSource={option3}*/}
                        {/*renderItem={item => (*/}
                        {/*<List.Item>*/}
                        {/*<List.Item.Meta*/}
                        {/*title={<a>{item.title}</a>}*/}
                        {/*/>*/}
                        {/*</List.Item>*/}
                        {/*)}*/}
                        {/*/>*/}
                        {/*</Card>*/}
                        <Card title='过期企业数' className='overTimeCard' type='inner' style={{ marginTop: 10 }}>
                            <Table size={'small'} bordered={false} dataSource={this.state.enterpriseList || []}
                                columns={columns} pagination={false} />
                        </Card>
                    </Col>
                </Row>
                <Card title={"各执法单位管辖情况"}
                    // type={'inner'}
                    style={{ marginTop: 20 }}>
                    <ReactEcharts
                        option={option4}
                        theme="UPC"
                        notMerge={true}
                        lazyUpdate={true}
                        style={{ height: 500 }}
                    />
                </Card>
                {/*<Card title='各业态企业数量' style={{marginTop:20}}>*/}
                {/*<ReactEcharts*/}
                {/*option={option1}*/}
                {/*theme="UPC"*/}
                {/*notMerge={true}*/}
                {/*lazyUpdate={true}*/}
                {/*style={{ height: 500 }} />*/}
                {/*</Card>*/}
                {/*<Card title='食品检查问题出现频率Top5' style={{marginTop: 20}}>*/}
                {/*<Row>*/}
                {/*<Col span={10}>*/}
                {/*<Card style={{marginTop: 50, marginLeft: 50}}>*/}
                {/*<List*/}
                {/*style={{height: 350}}*/}
                {/*itemLayout="horizontal"*/}
                {/*dataSource={this.state.enterpriseList || []}*/}
                {/*renderItem={item => (*/}
                {/*<List.Item>*/}
                {/*<List.Item.Meta*/}
                {/*title={<a>{item.enterpriseName}</a>}*/}
                {/*/>*/}
                {/*</List.Item>*/}
                {/*)}*/}
                {/*/>*/}
                {/*</Card>*/}
                {/*</Col>*/}
                {/*<Col span={14}>*/}
                {/*<ReactEcharts option={option} theme="UPC" notMerge={true} lazyUpdate={true}*/}
                {/*style={{height: 500}}/>*/}
                {/*</Col>*/}
                {/*</Row>*/}
                {/*</Card>*/}
                {modal}
            </div>
        );
    }
}

export default govHome;

