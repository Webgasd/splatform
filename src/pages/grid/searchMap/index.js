import React, {Component} from 'react'
import './index.css'
import {Card, Row, Col, List, Table, Modal, message,Divider, Button, Upload} from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import {commonUrl, unitName} from '../../../axios/commonSrc'
import moment from 'moment';
import Utils from "../../../utils";
import connect from "react-redux/es/connect/connect";
import axios from "../../../axios";
import {changeEnterprise, clearEnterprise} from "../../../redux/action";
//弹窗图标
import CorporateIcon from "../showGrid/image/弹窗地图定位图标.png";
import ToGaoDeMap from "../showGrid/image/icon_daohang-copy.png";
import CommonCheck from "../showGrid/image/dangan的副本 2.png";
import CheckView from "../showGrid/image/jiankong.png";
import BaseInfo from "../showGrid/image/qiye.png";
//引入地图点位图标
import bussiness from "../showGrid/image/食品经营(小).png";
import eatlocation from "../showGrid/image/餐饮定位(小).png";
import transform from "../showGrid/image/流通定位(小).png";
import produce from "../showGrid/image/食品生产定位(小).png";
import school from "../showGrid/image/学校定位(小).png";
import echarts from "echarts/lib/echarts";
import echartTheme from "../../home/echartTheme";
import Eat from "../../home/image/eat.png";
import Add from "../../supervision/enterprise/Add";
const AMap = window.AMap
let zoom = []
let markers = []
let cluster = []
@connect(
    state => ({
        industryList: state.industryList.slice(1),
        industryList7: state.industryList,
    }), {
        clearEnterprise,
        changeEnterprise,
    }
)
class SearchMap extends Component {
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
        }
        window.getBaseInfo = () => this.getBaseInfo();
        window.ToGaodeLocation = () => this.ToGaodeLocation();
    }
    componentDidMount() {
        var district = unitName
        var polygons = []
        this.drawBound(district,polygons)
        this.map = new AMap.Map('mapSearchContainer',{
            center: [117.050673, 36.659766],
            pitch: 25, // 地图俯仰角度，有效范围 0 度- 83 度//历下区是15
            viewMode: '3D', // 地图模式
            mapStyle: 'amap://styles/dark',
            // mask:polygons
        })
        this.map.setZoom(unitName == '历下区'? 13:11.5)
        let this_ = this
        this.getData()
        // this.getAreaEnterprise()
        this.map.on("zoomend", function () {
            let nowzoom = this_.map.getZoom();
            zoom.push(nowzoom);
            let l = zoom.length;
            let lastzoom = zoom[l - 2];
            console.log(nowzoom, lastzoom)
            if (nowzoom <= 14 && lastzoom >= 14) {
                // this_.clearAll();
                this_.drawBound(district, polygons)
                // this_.getdata();
            }
        });
    }
    getData = () => {
        axios.PostAjax({
            url:"/ImportEnterprisePoints/getAll"
        }).then((res) => {
            if(res.status == "success"){
                if(unitName !== "历下区"){
                    this.addGridPoints(res.data)
                }
                this.setState({
                    PointsList: res.data
                })
                this.getNumber()
            }
        })
    }
    getNumber = () => {
        let addNum = 0
        let normalNum = 0
        let abnormalNum = 0
        let outBusinessNum = 0
        let logoutNum = 0
        this.state.PointsList.map((item) => {
            if(item.businessState !== null) {
                if (item.businessState == 1) {
                    addNum++
                } else if (item.businessState == 2) {
                    normalNum++
                } else if (item.businessState == 3) {
                    abnormalNum++
                } else if (item.businessState == 4) {
                    outBusinessNum++
                } else if (item.businessState == 5) {
                    logoutNum++
                }
            }
        })
        this.setState({
            total:this.state.PointsList.length,
            addNum:addNum,
            normalNum:normalNum,
            abnormalNum:abnormalNum,
            outBusinessNum:outBusinessNum,
            logoutNum:logoutNum
        })
    }
    addGridPoints = (data) => {console.log(data)
        let l = markers.length
        markers[l] = []
        let that = this;
        data.map((item, index) => {
            let icon
            if(item.businessState !== null){
                switch (item.businessState){
                    case 1:{
                        icon = school;
                        break;
                    }
                    case 2:{
                        icon = school;
                        break;
                    }
                    case 3:{
                        icon = school;
                        break;
                    }
                    case 4:{
                        icon = school;
                        break;
                    }
                    case 5:{
                        icon = school;
                        break;
                    }
                }
            };
            let point = item.point
            let point1 = point.split(",")
            let p = new AMap.Marker({
                position:point1,
                // position: [JSON.parse(point1[0]), JSON.parse(point1[1])],
                icon: icon,
                enterpriseId: item.enterpriseId
            })
            AMap.event.addListener(p, 'click', function (e) {
                let id = e.target.w.enterpriseId;
                axios.ajax({
                    url: '/supervision/enterprise/getById',
                    data: {params: {id: id}}
                }).then((res) => {
                    if (res.status == 'success') {
                        that.setState({
                            BaseInfo: res.data,
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
        });
        cluster[l] = []
        this.map.plugin(["AMap.MarkerClusterer"], function () {
            cluster[l] = new AMap.MarkerClusterer(that.map, markers[l], {
                gridSize: 60,
                minClusterSize: 5,
            });
        });
    };
    drawBound = (district,polygons) =>{
        let that = this
        AMap.service('AMap.DistrictSearch',function (){//回调函数
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
                        fillColor: '#6d7272',
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
    ToGaodeLocation = () => {
        const w = window.open('about:blank');
        w.location.href = 'https://www.amap.com/search?query=' + this.state.AddressForGaoDe + "&city=370200"
    }
    getBaseInfo = () => {
        console.log(this.state.BaseInfo)
        this.setState({
            visible: true,
        })
        let data = this.state.BaseInfo;
        this.props.changeEnterprise({
            ...data,
            propagandaEnclosure: JSON.parse(data.propagandaEnclosure || JSON.stringify([]))
        });
    }
    handleFile=(info)=> {
        if (info.file.status !== 'uploading') {
            console.log(info.file, info.fileList);
        }
        if (info.file.status === 'done') {
            message.success(`${info.file.name} file uploaded successfully`);
            this.getData()
        } else if (info.file.status === 'error') {
            message.error(`${info.file.name} file upload failed.`);
        }
    }
    downLoadFile = () => {
        window.location.href = commonUrl+"/upload/templates/导入地图点位模板.xlsx"
    }
    render() {
        const modal = (<Modal
            title="企业信息"
            visible={this.state.visible}
            destroyOnClose
            getContainer={() => this.refs.mapHomeCard}
            centered={true}
            mask={false}
            width={"90%"}
            onCancel={() => {
                this.props.clearEnterprise();
                this.setState({
                    visible: false,
                })
            }}
            footer={false}
        >
            <Add type={"detail"}/>
            {/*<InfoWindow  />*/}
        </Modal>)
        return (
            <div className='page'>
                <div className='info'>
                    <Divider style={{color:"#263786"}}><span className="control">双随机<br></br>部署控制台</span></Divider>
                    <Button style={{marginTop:"40px",width:"90%"}} onClick={this.downLoadFile}>
                        数据导入模板下载
                    </Button>
                    <Upload action={commonUrl+"/supervision/enterprise/importInspectExcel"}
                            showUploadList={false}
                            onChange={(info)=>this.handleFile(info)}
                    >
                        <Button  style={{marginTop:"10px",width:"270px"}}>点击进行数据导入</Button>
                    </Upload>
                    <div className="total">
                        <p style={{marginTop:"10px"}}>当前双随机任务量（单位：家）</p>
                        <div className="number">
                            <span>{this.state.total}</span>
                        </div>
                    </div>
                    <Divider><span className="control">市场主体经营状态</span></Divider>
                    <div className="detail">
                        <p style={{marginTop:"10px"}}>经营状态：新增（单位：家）</p>
                        <div className="groupNumber" style={{color:"#4fe310"}}>
                            <span>{this.state.addNum}</span>
                        </div>
                    </div>
                    <div className="detail">
                        <p style={{marginTop:"10px"}}>经营状态：正常（单位：家）</p>
                        <div className="groupNumber" style={{color:"#2435c6"}}>
                            <span>{this.state.normalNum}</span>
                        </div>
                    </div>
                    <div className="detail">
                        <p>经营状态：异常（单位：家）</p>
                        <div className="groupNumber" style={{color:"#d61111"}}>
                            <span>{this.state.abnormalNum}</span>
                        </div>
                    </div>
                    <div className="detail">
                        <p style={{marginTop:"10px"}}>经营状态：已倒闭（单位：家）</p>
                        <div className="groupNumber" style={{color:"#d61111"}}>
                            <span>{this.state.outBusinessNum}</span>
                        </div>
                    </div>
                    <div className="detail">
                        <p style={{marginTop:"10px"}}>经营状态：已注销（单位：家）</p>
                        <div className="groupNumber" style={{color:"#d61111"}}>
                            <span>{this.state.logoutNum}</span>
                        </div>
                    </div>
                </div>
                <div className='map'>
                    <div className="map-wrap">
                        <div ref='mapHomeCard' id="mapSearchContainer"
                             style={{height: '800px', width: '100%'}}></div>
                    </div>
                </div>
                {modal}
            </div>
        )
    }
}

export default SearchMap