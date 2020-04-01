import React from 'react';
import {Row, Col, Tree, Divider, Card, Button, Modal} from 'antd'
import moment from 'moment';
import './index.css';
import {commonUrl, unitName} from '../../../axios/commonSrc'
import connect from "react-redux/es/connect/connect";
import axios from "../../../axios";
///地图定位的图标
import Eat from "../../home/image/eat.png";
import school from './image/学校定位(小).png';
import transform from './image/流通定位(小).png'
import produce from './image/食品生产定位(小).png'
import bussiness from './image/食品经营(小).png'
import eatlocation from './image/餐饮定位(小).png'
//信息弹窗里的图标
import CorporateIcon from './image/弹窗地图定位图标.png'
import BaseInfo from './image/qiye.png'
import CheckView from './image/jiankong.png'
import CommonCheck from './image/dangan的副本 2.png'
import ToGaoDeMap from  './image/icon_daohang-copy.png'
import tubiao from "./image/pic1.png";
//引入echart
import echartTheme from './echartTheme';
import ReactEcharts from 'echarts-for-react';
import echarts from 'echarts/lib/echarts';
import 'echarts/lib/chart/line';
import 'echarts/lib/chart/bar';
import 'echarts/lib/chart/pie';
// 引入提示框和标题组件
import 'echarts/lib/component/tooltip';
import 'echarts/lib/component/title';
import 'echarts/lib/component/legend';
import 'echarts/lib/component/markPoint';
import {changeEnterprise, clearEnterprise} from "../../../redux/action";
import Add from "../../supervision/enterprise/Add";
const {  DirectoryTree,TreeNode } = Tree;
const AMap=window.AMap;
let markers=[]
let cluster=[]
let overlays=[];
let overlay=[]
let text=[]
let bound=[]
let object3Dlayer
let Wall
let count=3001
@connect(
    state=>({
        areaList:state.areaList,
        industryList:state.industryList.slice(1),
        industryList7:state.industryList,
    }),{
        clearEnterprise,
        changeEnterprise,
    }
)
class gridShow extends React.Component{
    constructor(props){
        super(props);
        this.state={
            childrenListBounds:[],
            visible:false,
            data:[],
            gridData:[],
            PointsList:[],
            isFullScreen: false,
            enterpriseStatistics: {},
            BaseInfo:[],
            AddressForGaoDe:''
        }
        window.getBaseInfo =()=>this.getBaseInfo();
        window.ToGaodeLocation =()=>this.ToGaodeLocation();
    }
    componentWillMount(){
        echarts.registerTheme('UPC',echartTheme);
    }
    componentDidMount() {
        this.map = new AMap.Map('mapShowContainer', {
            center:[117.000923,36.675807],
            viewMode: '3D',
            showBuildingBlock:true,
             // labelzIndex:4000,
            expandZoomRange:true,
             pitch: 35,
            // mapStyle: 'amap://styles/dc506ba56e39a45a3625d6643cb4995e',
             mapStyle: 'amap://styles/bd3d5ff83fa125a2b5a5dd95fe2c7b66',
        });

        var district = unitName;

        var polygons=[];
        this.map.AmbientLight = new AMap.Lights.AmbientLight([1, 1, 1], 0.5);
        this.map.DirectionLight = new AMap.Lights.DirectionLight([0, 0, 1], [1, 1, 1], 1);
         object3Dlayer = new AMap.Object3DLayer();
        this.map.add(object3Dlayer);
         this.drawBounds(district,polygons)
         this.getdata()
        this.watchFullScreen()
        this.govGet()
    }
    govGet = () =>{
        axios.noLoadingAjax({
            url:'/sys/user/govGet',
            data: {
                params:{}
            }
        }).then((res)=>{
            if(res.status == "success"){
                this.setState({
                    enterpriseList:res.data.enterpriseList,
                    enterpriseStatistics:res.data.enterpriseStatistics
                })
            }
        })
    }
    fullScreen = () => {
        if (!this.state.isFullScreen) {
            this.requestFullScreen();
        } else {
            this.exitFullscreen();
        }
    };
    //监听fullscreenchange事件
    watchFullScreen = () => {
        const _self = this;
        document.addEventListener(
            "webkitfullscreenchange",
            function() {
                _self.setState({
                    isFullScreen: document.webkitIsFullScreen
                });
            },
            false
        );
    };
    //进入全屏
    requestFullScreen = () => {
        // var de = document.documentElement;
        var de =document.getElementById("checkMap")
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
        var de = document;
        if (de.exitFullscreen) {
            de.exitFullscreen();
        } else if (de.mozCancelFullScreen) {
            de.mozCancelFullScreen();
        } else if (de.webkitCancelFullScreen) {
            de.webkitCancelFullScreen();
        }
    };
    getdata=()=>{
        axios.PostAjax({
            url:"/grid/points/getSmilePoints",
            data: {
                params:{areaList:[''],industryList:['']}
            }
        }).then((res)=>{
            if(res.status == "success"){
                this.addGridPoints(res.data)
                this.setState({
                    PointsList:res
                })
            }
        })

        // axios.ajax({
        //     url:"/grid/points/getSmilePoints",
        //     data: {
        //         params:{}
        //     }
        // }).then((res)=>{
        //     if(res.status == "success"){
        //         this.setState({
        //             PointsList:res
        //         })
        //         this.addGridPoints(res.data)
        //     }
        // })
         this.getGridData();
    }
    getGridData=()=>{
        axios.ajax({
            url:"/grid/grid/getAll",
        }).then((res)=>{
            if(res.status == "success"){
                this.setState({
                    gridData:res.data
                })
                let value=res.data.filter((item)=>(item.parentId==1))
                value.map((item,index)=>{
                    this.drawGrid(item,false);
                    // let value1=res.data.filter((item1)=>(item1.parentId==item.areaId))
                    //     value1.map((item1,index1)=>{
                    //         this.drawGrid(item1);
                    //     })
                })
            }
        })
    }
    clearAll=()=>{
        this.map.clearMap();
        cluster.map((item,index)=>{
            this.map.remove(item);
        })
    }
    clear=()=>{
        this.map.clearMap();
         object3Dlayer.remove(Wall)
        overlays.map((item,index)=>{
            object3Dlayer.remove(overlays[index])
        })
        cluster.map((item,index)=>{
            this.map.remove(item);
        })
        text.map((item,index)=>{
            this.map.remove(item);
        })
    };
    showInfo=(e)=>{
        let that=this;
        let name=e.target.getText();
        let marker=e.target.getPosition()
        window.AMapUI.loadUI(['overlay/SimpleInfoWindow'], function(SimpleInfoWindow) {
            var infoWindow = new SimpleInfoWindow({
                infoTitle: '<strong>'+name+'</strong>',
                infoBody: '<p class="my-desc"><strong>'+name+'</strong> <br/> 很大</p>',
                offset: new AMap.Pixel(0, 0),
            });
            infoWindow.open(that.map, marker);
        });
    }
    drawBounds(district,polygons){
        let that=this;
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
                    that.map.remove(polygons)//清除上次结果
                    polygons = [];
                    let bounds = result.districtList[0].boundaries;
                    let childrenListBounds = result.districtList[0].districtList;
                    let path=[]
                    if (bounds) {
                        for (var i = 0, l = bounds.length; i < l; i++) {//生成行政区划polygon
                            var polygon = new AMap.Polygon({
                                path: bounds[i],
                                fillOpacity: 0,
                                fillColor: '#5267ef',
                                strokeColor: '#36a8ef',
                                strokeWeight: 15,
                                strokeOpacity:0.7
                            });
                            path.push(bounds[i])
                        }
                    }
                    bound=polygon
                    Wall = new AMap.Object3D.Prism({
                        path: bounds,
                        height: 3000,
                        color: 'rgba(255,255,255,1)'
                    });

                    Wall.transparent = true;
                     that.map.add(bound);
                     // that.map.setMask(path)
                    that.map.setFitView(bound)
                    object3Dlayer.add(Wall);

                    that.map.setZoom(unitName=="历下区"?12.85:11.35)//平原加上

                })
            })
    }
    // drawBounds(district,polygons) {
    //     let that=this;
    //     let bounds
    //     AMap.service('AMap.DistrictSearch', function () {//回调函数
    //         var opts = {
    //             subdistrict: 1,   //返回下一级行政区
    //             showbiz: false,  //查询行政级别为 市
    //             extensions: 'all',  //返回行政区边界坐标组等具体信息
    //             level: "district"  //查询行政级别为 市
    //         };//实例化DistrictSearch
    //         let districtSearch = new AMap.DistrictSearch(opts);
    //         districtSearch.search(district, function (status, result) {
    //             that.map.remove(polygons)//清除上次结果
    //             polygons = [];
    //             bounds = result.districtList[0].boundaries;
    //             let childrenListBounds = result.districtList[0].districtList;
    //
    //         })
    //     })
    //     var polygon = new AMap.Polygon({
    //         strokeWeight: 1,
    //         path: bounds,
    //         fillOpacity: 0.1,
    //         fillColor: '#051040',
    //         strokeColor: '#0091ea'
    //     });
    //
    //     console.log("1213")
    //     bound=polygon
    //     // console.log(Well)
    //     // object3Dlayer.add(Well);
    //     this.map.add(bound)
    //     this.map.setFitView(bound);//视口自适应
    // }
    onSelect = (keys, info) => {
        let selectInfo=info.selectedNodes[0].props
        let child=selectInfo.children
        this.clear()
        let value=[]
   ///////     ///根据key值,找出网格的信息
        if (keys==1){
            value = this.state.gridData.filter((item)=>(item.parentId==keys))
        } else {
           value = this.state.gridData.find((item)=>(item.areaId==keys))
        }
        if (value!==undefined&&value.areaId>1){
            this.drawGrid(value,false);
              let l=overlay.length
              this.map.setFitView(overlay[l-1]);
        }else if(value&&value.length>0){
            var district = unitName;/////如果选中历下区，画出其子区域
            var  polygons=[];
            this.drawBounds(district,polygons)////
            value.map((item,index)=>{
                this.drawGrid(item,true);
            })
            this.map.setFitView(bound);
            this.map.setZoom(unitName=="历下区"?12.85:11.35)//平原加上
        }else {
            console.log("无信息")
        }
 /////////       //////根据子节点的child长度,找出要显示的点
        let points=[]
        if(child.length==0){
            points=this.state.PointsList.data.filter((item)=>(item.grid==keys))
        }else if(keys==1){
            console.log(keys)
            points=this.state.PointsList.data
        }else { points=this.state.PointsList.data.filter((item)=>(item.area==keys))}
        this.addGridPoints(points)
    };
    addGridPoints=(data)=>{
        let l=markers.length
        markers[l]=[]
        let that=this;
        data.map((item,index)=>{
            let point=item.point
            let point1=point.split(",")
            let icon
            for(var key in item){
                that.props.industryList7.map((item1)=>{
                    if (item1.remark == key && item[key] !== null) {
                        switch (key) {
                            case "foodBusiness": {
                                if (item["businessType"]=="餐饮服务经营者" || item["businessType"]=="餐饮服务经营者(连锁)"
                                    || item["businessType"]=="餐饮服务经营者(非连锁)"|| item["businessType"]=="单位食堂") {
                                    if (unitName == "泰山区") {
                                        icon=school;break;
                                    }else {
                                        icon=eatlocation;break;
                                    }
                                }else if (item["businessType"]=="食品销售经营者" || item["businessType"]=="食品销售经营者(连锁)"
                                    || item["businessType"]=="食品销售经营者(非连锁)") {
                                    icon=transform;break;
                                }else {
                                    icon=bussiness;break;
                                }
                            }
                            case "foodCommon": {
                                if (unitName == "泰山区") {
                                    icon=school;break;
                                }else {
                                    icon=eatlocation;break;
                                }
                            }
                            case "foodCirculate": {icon=transform;break;}
                            case "foodProduce": {icon=produce;break;}
                            case "drugsBusiness": {icon=Eat;break;}
                            case "medicalUse": {icon=Eat;break;}
                            case "cosmeticsUse": {icon=Eat;break;}
                            default:{icon=Eat;}
                        }
                    }
                })
            }
            let p=new AMap.Marker({
                position: [JSON.parse(point1[0]),JSON.parse(point1[1])],
                icon: icon,
                enterpriseId:item.enterpriseId
            })
            let value
            AMap.event.addListener(p, 'click', function (e) {
                let id=e.target.w.enterpriseId
                axios.ajax({
                    url:'/supervision/enterprise/getById',
                    data:{params:{id:id}}
                }).then((res)=>{
                    if(res.status =='success'){
                        value=res.data
                        that.setState({
                            BaseInfo:res.data,
                            AddressForGaoDe:res.data.registeredAddress
                        })
                        var info = [];
                        let imagelist=JSON.parse(value.propagandaEnclosure||JSON.stringify([]));
                        let start,end
                        for(var key in value){
                            that.props.industryList.map((item)=>{
                                if (item.remark == key && value[key] !== null) {
                                    start=value[key].startTime
                                    end=value[key].endTime
                                }
                            })}
                        let startTime=moment(start).format("YYYY-MM-DD")
                        let endTime=moment(end).format("YYYY-MM-DD")
                        info.push("<div class='content-window-card'><div class='title'>信息</div>");
                        info.push("<div class='pic-dom'>");
                        if (imagelist&&imagelist.length>0){
                            info.push("<div class='pic'><img alt='example'style={{ width: '100%' }} src="+commonUrl+"/upload/picture/"+imagelist[0].response.data+"/></div>")
                        } else {
                            info.push("<div class='pic'><text>企业营业许可证</text></div>")
                        }
                        if (imagelist&&imagelist.length>1) {
                            info.push("<div class='pic'><img alt='example'style={{ width: '100%' }} src="+commonUrl+"/upload/picture/"+imagelist[1].response.data+"/></div>")
                        }else {
                            info.push("<div class='pic'><text>企业营业许可证</text></div>")
                        }
                        info.push("</div>");
                        info.push("<div class='middle'><img src='"+CorporateIcon+"' width='30px' height='30px'/><text>"+value.enterpriseName+"</text></div>");
                        info.push("<div class='middle-info'><div class='middle-info-text'><text>企业地址:"+value.businessAddress+"</text></div></div>");
                        info.push("<div class='middle-info'><div class='middle-info-text'><text>法人/负责人："+value.legalPerson+"</text></div>" +
                            "<div class='middle-info-text1'><text>联系电话："+value.cantactWay+"</text></div></div>");
                        info.push("<div class='middle-info'><div class='middle-info-text'><text>日常监督员："+value.supervisor+"</text></div></div>");
                        info.push("<div class='middle-info'><div class='middle-info-text'><text>证件有效期：" +startTime+"至"+endTime+"</text></div></div>");
                        info.push("<div class='bottom-icon'><img src='"+ToGaoDeMap+"' onclick='ToGaodeLocation()' width='40px' height='40px'/></div>");
                        info.push("<div class='bottom-icon'><img src='"+CommonCheck+"' width='40px' height='40px'/></div><Divider type=\"vertical\" />");
                        info.push("<div class='bottom-icon'><img src='"+CheckView+"' width='40px' height='40px'/></div><Divider type=\"vertical\" />");
                        info.push("<div class='bottom-icon'><img src='"+BaseInfo+"'id='BaseInfo' onclick='getBaseInfo()' width='40px' height='40px'/></div><Divider type=\"vertical\" />");
                        info.push("</div>");

                        let infoWindow = new AMap.InfoWindow({
                            content: info.join(""),  //使用默认信息窗体框样式，显示信息内容
                            offset: new AMap.Pixel(13, -25),
                        });
                        infoWindow.open(that.map, p.getPosition())
                    }
                })
            },this);
            markers[l].push(p)
        });
        cluster[l]=[]
        const  sts = [{
            url: "https://a.amap.com/jsapi_demos/static/images/blue.png",
            size: new AMap.Size(32, 32),
            offset: new AMap.Pixel(-16, -16)
        }, {
            url: "https://a.amap.com/jsapi_demos/static/images/green.png",
            size: new AMap.Size(32, 32),
            offset: new AMap.Pixel(-16, -16)
        }, {
            url: "https://a.amap.com/jsapi_demos/static/images/orange.png",
            size: new AMap.Size(36, 36),
            offset: new AMap.Pixel(-18, -18)
        }, {
            url: "https://a.amap.com/jsapi_demos/static/images/red.png",
            size: new AMap.Size(48, 48),
            offset: new AMap.Pixel(-24, -24)
        }, {
            url: "https://a.amap.com/jsapi_demos/static/images/darkRed.png",
            size: new AMap.Size(48, 48),
            offset: new AMap.Pixel(-24, -24)
        }];
        this.map.plugin(["AMap.MarkerClusterer"],function() {
            cluster[l] = new AMap.MarkerClusterer(that.map,markers[l],{
                gridSize: 60,
                minClusterSize:10,
                styles: sts
            });
        });
    };
    getBaseInfo=()=>{
        this.setState({
            visible:true,
        })
        let data = this.state.BaseInfo;
        this.props.changeEnterprise({...data,propagandaEnclosure:JSON.parse(data.propagandaEnclosure||JSON.stringify([]))});
    }
    ToGaodeLocation=()=>{
        const w=window.open('about:blank');
        w.location.href='https://www.amap.com/search?query='+this.state.AddressForGaoDe
    }
    drawGrid=(value,coverValue)=>{
        let parentId=value.parentId
        let centerS=value.center.split(",")
        let center=[JSON.parse(centerS[1]),JSON.parse(centerS[0])]
        let le=value.level.split(".").length;
        let name=value.name;
        let id=value.areaId;
        let remark1=value.polygon.split(",");
        let color=value.color
        let path=[];
        for(let i=0,l=remark1.length;i<l/2;i++){
            let p=[JSON.parse(remark1[2*i+1]),JSON.parse(remark1[2*i])]
            p.transparent = true;
            path.push(p)
        }
        var bounds = path.map(function(path) {
            return new AMap.LngLat(path[0], path[1]);
        });
        let l=overlays.length;
        let polygon = new AMap.Polygon({
            strokeWeight: 1,
            path: path,
            fillOpacity: 1,
            fillColor: color,
            strokeColor: '#0091ea'
        });
        overlays[l] = new AMap.Object3D.Prism({
            path: bounds,
            height: count++,
            color: color
        });
        overlay.push(polygon)
        overlays[l].transparent = true;
         object3Dlayer.add(overlays[l]);
        this.addLabel(name,center,id,parentId,le)
    }
    addLabel=(gridname,points,id,parentId,le)=>{
        if(gridname==null){
            gridname="未命名"
        }
        let that=this;
        let l=overlays.length
        text[l] = new AMap.Text({
            text:gridname,
            // verticalAlign: 'bottom',
            position: points,
            offset: new AMap.Pixel(0, 0),
            height: count,
            style: {
                'background-color': 'rgba(204,204,204,0.9)',
                'text-align': 'center',
                'border-radius': '.25rem',
                'border-width': 1,
                'width':'100px',
                'padding':'5px 2px 5px',
                'border-color':'white',
                'box-shadow': '0 2px 6px 0 rgba(114, 124, 245, .5)',
                'color': "black",
                'font-size': '14px',
                'lineJoin': '4px'
            }
        });
        text[l].setMap(this.map)
        that.map.on("zoomend",function () {
            let nowzoom=that.map.getZoom();
            console.log(nowzoom)
            if(nowzoom<=12.5 ){
                text[l].hide();
            }else {
                text[l].show()
            }
        })
        AMap.event.addListener(text[l], 'click', function () {
            let value=that.getGridShowNumber(id,le)
            var info = [];
            let list=that.GaInfo(id,parentId,le)
            list.then(res=>{
                let findindex=res.findIndex((item,index)=>(item.job==5))
                let leadname='',leadphone=''
                if (findindex>=0){
                    leadname=res[findindex].name
                    leadphone=res[findindex].mobilePhone
                }
                info.push("<div class='input-card content-window-card'><div class='labelTitle'>信息</div>");
                info.push("<div class='Top'><div class='TopPic'><div class='Pic'><img src='"+tubiao+"' alt={''}/></div></div>");
                info.push("<div class='TopInfo'><text>区域名称:"+gridname+"</text></div>");
                info.push("<div class='TopInfo'><text>负责人:"+leadname+"</text></div>");
                info.push("<div class='TopInfo'><text>联系电话:"+leadphone+"</text></div></div>");
                info.push("<div class='labelMiddle'><div class='middleLeft'><text>执法人员:</text></div>");
                info.push("<div class='middleDiliver'></div>");
                info.push("<div class='middleRight'><text>"+res.map((item,index)=>{if(findindex!==index)return item.name;})+"</text></div></div>");
                info.push("<div class='Bottom'><div class='BottomTitle'><text>辖区企业总计（家）："+value.total+"</text></div><div class='BottomDiliver'></div>");
                value.child.map((item,index)=>{
                    info.push("<div class='BottomInfo'><text"+index%4+">"+item.name+":"+item.num+"</text></div>");
                })
                info.push("</div></div>");
                let infoWindow = new AMap.InfoWindow({
                    content: info.join(""),  //使用默认信息窗体框样式，显示信息内容
                    offset: new AMap.Pixel(-5, -25),
                });
                infoWindow.open(that.map, points);
            })
        });
        // text.on('click', this.showInfo);
    };
    GaInfo=(areaid,parentId,level)=>{
        let promise
        let that=this
        if (level==2){
            promise= new Promise(function (resolve, reject) {
                that.getGaInfo(areaid,level).then(res=>{
                    resolve(res)
                })
            })
        }else if (level==3){
            promise=new Promise(function (resolve, reject) {
                that.getGaInfo(parentId,level).then(res=>{
                    resolve(res)
                })
            })
        }
        return promise
    }
    getGaInfo=(id,level)=>{
        let  promise=new Promise(function (resolve, reject) {
            axios.noLoadingAjax({
                url:'/supervision/ga/getGaForMap',
                data: {
                    params:{id:id,level:level}
                }
            }).then((res)=>{
                if (res.status=='success'){
                    resolve(res.data)
                }
            })
        })
        return promise;
    }
    getGridShowNumber=(id,le)=>{
        let list=[]
        if (le==2){
            list=this.state.PointsList.data.filter((item)=>(item.area==id))
        }else if(le==3){
            list=this.state.PointsList.data.filter((item)=>(item.grid==id))
        }
        let chlid=[]
        this.props.industryList.map((item)=>{
            let num=0
            list.map((item1)=>{
                for (var key in item1) {
                    if (key==item.remark&&item1[key]!==null){
                        num++
                    }
                }
            })
            chlid.push({name:item.name,num:num})
        })
        let value={total:list.length,child:chlid}
        return value
    }
    getOption =()=> {
        let option = {
            title:{
                text:'营业额变化',
                x:'center'
            },
            tooltip:{
                trigger:'axis',
            },
            xAxis:{
                data:['周一','周二','周三','周四','周五','周六','周日']
            },
            yAxis:{
                type:'value'
            },
            series:[
                {
                    name:'OFO订单量',
                    type:'line',   //这块要定义type类型，柱形图是bar,饼图是pie
                    data:[1000,2000,1500,3000,2000,1200,800]
                }
            ]
        }
        return option
    }
    getTitle=(text)=>{
        let title=(
            <Row>
                {text}
            </Row>
        )
        return title
    }
    renderTreeNodes =(data)=>{
        return data.map((item) => {
            if (item.childrenList) {
                return (
                    <TreeNode title={item.name} value={item.id} key={item.id}>
                        {this.renderTreeNodes(item.childrenList)}
                    </TreeNode>
                );
            } else {
                return (
                    <TreeNode title={item.name} value={item.id} key={item.id} isLeaf/>
                );
            }
        });
    }
    render(){
        const option = {
            tooltip : {
                trigger: 'axis'
            },
            legend:{
                data:['Top1','Top2','Top3','Top4','Top5',]
            },
            xAxis: {
                data: ['解放路街道','趵突泉街道','大明湖街道','文东街道','龙洞街道']
            },
            yAxis: {
                type: 'value'
            },
            series: [
                {
                    name: 'Top1',
                    type: 'bar',
                    barWidth:20,
                    data: [
                        1000,
                        2000,
                        2500,
                        4000,
                        6000,
                        7000,

                    ]
                },{
                    name: 'Top2',
                    type: 'bar',
                    barWidth:20,
                    data: [
                        1000,
                        2000,
                        4000,
                        6000,
                        7000,

                    ]
                },{
                    name: 'Top3',
                    type: 'bar',
                    barWidth:20,
                    data: [
                        2000,
                        2500,
                        4000,
                        6000,
                        7000,

                    ]
                },{
                    name: 'Top4',
                    type: 'bar',
                    barWidth:20,
                    data: [
                        1000,
                        2000,
                        2500,
                        4000,
                        6000,

                    ]
                },{
                    name: 'Top5',
                    type: 'bar',
                    barWidth:20,
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
        const option2 = {
            title: {
                text: '企业信息',
                x : 'center'
            },
            legend : {
                orient: 'vertical',
                right: 10,
                top: 20,
                bottom: 20,
                data: (this.props.industryList||[]).map((item)=>item.name)||[]
            },
            tooltip: {
                trigger : 'item',
                formatter : "{a} <br/>{b} : {c} ({d}%)"
            },
            series: [
                {
                    name : '数量',
                    type : 'pie',
                    radius : '55%',
                    center : [
                        '50%', '60%'
                    ],
                    data:(this.props.industryList||[]).map((item)=>{return {name:item.name,value:(this.state.enterpriseStatistics)[item.id]}})||[],
                    itemStyle : {
                        emphasis: {
                            shadowBlur: 10,
                            shadowOffsetX: 0,
                            shadowColor: 'rgba(0, 0, 0, 0.5)'
                        }
                    }
                }
            ]
        }
        const option1 = {
            title: {
                text: '企业信息'
            },
            tooltip : {
                trigger: 'axis'
            },
            legend:{
                data:['数量']
            },
            xAxis: {
                data: (this.props.industryList||[]).map((item)=>item.name)||[]
            },
            yAxis: {
                type: 'value'
            },
            series: [
                {
                    name: '数量',
                    type: 'bar',
                    barWidth:30,
                    data: (this.props.industryList||[]).map((item)=>((this.state.enterpriseStatistics)[item.id]))||[],
                    itemStyle: {
                        normal: {
                            // 随机显示
                            //color:function(d){return "#"+Math.floor(Math.random()*(256*256*256-1)).toString(16);}

                            // 定制显示（按顺序）
                            color: function(params) {
                                var colorList = ['#C33531','#EFE42A','#64BD3D','#EE9201','#29AAE3', '#B74AE5','#0AAF9F','#E89589','#16A085','#4A235A','#C39BD3 ','#F9E79F','#BA4A00','#ECF0F1','#616A6B','#EAF2F8','#4A235A','#3498DB' ];
                                return colorList[params.dataIndex]
                            }
                        },
                    },
                },
            ]
        }
        const modal=(<Modal
              title="企业信息"
            visible={this.state.visible}
            destroyOnClose
            // getContainer={()=>this.refs.mapShowContainer}
            centered={true}
            mask={false}
            width={1000}
            onCancel={()=>{
                this.props.clearEnterprise();
                this.setState({
                    visible:false,
                })
            }}
            footer={false}
        >
              <Add type={"detail"} />
        </Modal>)
        return (
            <Row >
                <Row  id='checkMap' >
                    <Col span={18} style={{position:'relative'}}>
                        <Row>
                            <Col span={6}>
                                <DirectoryTree onSelect={this.onSelect}>
                                    {this.renderTreeNodes(this.props.areaList||[])}
                                </DirectoryTree>
                            </Col>
                            <Col span={18}>
                                <div ref='mapShowContainer' id="mapShowContainer" className={'mapShowContainer'}>{modal}</div>
                                <Card title='各业态企业数量' type={'inner'} style={{margin:10}}>
                                    <ReactEcharts
                                        option={option1}
                                        theme="UPC"
                                        notMerge={true}
                                        lazyUpdate={true}
                                        style={{height:250}}/>
                                </Card>
                            </Col>
                        </Row>
                    </Col>
                    <Col span={6} style={{paddingLeft:'10px',}}>
                        <Button type={"primary"} onClick={()=>this.fullScreen()}>切换全屏</Button>
                        <Card title={this.getTitle("业态检查统计")} type={'inner'} style={{margin:10}}>
                            <ReactEcharts
                                option={option2}
                                theme="UPC"
                                notMerge={true}
                                lazyUpdate={true}
                                style={{height:290}}/>
                        </Card>
                        <Card title='业态检查统计' type={'inner'} style={{margin:10}}>
                            <ReactEcharts
                                option={option}
                                theme="UPC"
                                notMerge={true}
                                lazyUpdate={true}
                                style={{height:290}}/>
                        </Card>
                        <Card title='业态检查统计' type={'inner'} style={{margin:10}}>
                            <ReactEcharts
                                option={this.getOption()}
                                theme="UPC"
                                notMerge={true}
                                lazyUpdate={true}
                                style={{height:250}}/>
                        </Card>
                    </Col>
                </Row>
            </Row>
        );
    }
}
export default gridShow;
