import React,{Component} from 'react';
import {Button, Col, message, Modal, Row, Tree} from "antd";
import Add from "../supervision/enterprise/Add";
import LiveVideo from "../grid/gridSupervision/LiveVideo";
import LedgerTable from "../grid/gridSupervision/LedgerTable";
import {commonUrl, unitName} from "../../axios/commonSrc";
import axios from "../../axios";
import moment from 'moment';
import './map.css'
import tubiao from "../grid/showGrid/image/pic1.png";
import school from "../grid/showGrid/image/学校定位(小).png";
import eatlocation from "../grid/showGrid/image/餐饮定位(小).png";
import transform from "../grid/showGrid/image/流通定位(小).png";
import bussiness from "../grid/showGrid/image/食品经营(小).png";
import produce from "../grid/showGrid/image/食品生产定位(小).png";
import Eat from "../home/image/eat.png";
import CorporateIcon from "../grid/showGrid/image/弹窗地图定位图标.png";
import ToGaoDeMap from "../grid/showGrid/image/icon_daohang-copy.png";
import CommonCheck from "../grid/showGrid/image/dangan的副本 2.png";
import CheckView from "../grid/showGrid/image/jiankong.png";
import BaseInfo from "../grid/showGrid/image/qiye.png";
import connect from "react-redux/es/connect/connect";
import {changeEnterprise, clearEnterprise} from "../../redux/action";
const {  DirectoryTree,TreeNode } = Tree;
const AMap=window.AMap;
let bound=[]
let object3Dlayer
let Wall
let cluster=[]
let markers=[]
let overlays=[]
let overlay=[]
let text=[]
let count=1001
@connect(
    state=>({
        areaList:state.areaList,
        industryList:state.industryList,
    }),{
        clearEnterprise,
        changeEnterprise,
    }
)
class wholeNumber extends Component {
    constructor(props){
        super(props)
        this.state={
            visible:false,
            data:[],
            gridData:[],
            PointsList:[],
            isFullScreen: false,
            enterpriseStatistics: {},
            BaseInfo:[],
            AddressForGaoDe:'',
            selectIndustryList:undefined,
            areaList:[],
            staticticsData:[],
            PointsListLength:0,
            IndustryType:[],
            industryList:[],
            NewIndustryList:[],
            NewEnterpriseStatistics:[],
            TopArea:[],
            areaCount:[],
            area:[],
            tablevisible:false,
            searchEnterprise:''
        }
        window.ToGaodeLocation =()=>this.ToGaodeLocation();
        window.getBaseInfo =()=>this.getBaseInfo();
        window.handleOperator =(id)=>this.handleOperator(id);
        window.showLedgerTable =(id)=>this.showLedgerTable(id);
    }
    componentDidMount() {
        var layer = new AMap.TileLayer({
            zooms:[3,20],    //可见级别
            visible:true,    //是否可见
            opacity:0,       //透明度
            zIndex:10         //叠加层级
        })
            this.map = new AMap.Map('gridSupervision', {
                viewMode: '3D',
                showBuildingBlock:true,
                labelzIndex:1500,
                layers: [
                    layer,
                ],
                expandZoomRange:true,
                pitch: 35,
                mapStyle: 'amap://styles/dc506ba56e39a45a3625d6643cb4995e',
                // mapStyle: 'amap://styles/bd3d5ff83fa125a2b5a5dd95fe2c7b66',
            });
            var district = unitName;
            console.log(unitName)
            var polygons=[];
            this.map.AmbientLight = new AMap.Lights.AmbientLight([1, 1, 1], 0.5);
            this.map.DirectionLight = new AMap.Lights.DirectionLight([0, 0, 1], [1, 1, 1], 1);
            object3Dlayer = new AMap.Object3DLayer();
            this.map.add(object3Dlayer);
             this.drawBounds(district,polygons)
        this.getdata()
        this.govGet()
        this.getTree()
        this.getAreaEnterprise()
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
    getTree=()=>{
        axios.noLoadingAjax({
            url:'/sys/area/tree',
            data: {
                params:{}
            }
        }).then((res)=>{
            if (res.status == 'success') {
                let TopArea=[]
                res.data[0].childrenList.map((item)=>{
                    TopArea.push(item)
                })
                this.setState({
                    areaList:res.data,
                    TopArea
                })
            }
        })
        axios.noLoadingAjax({
            url:'/supervision/enterprise/getStatistics',
            data:{
                params:{}
            }
        }).then((res)=>{
            if (res.status == 'success') {
                this.setState({staticticsData:res.data})
            }
        })
    }
    getAreaEnterprise=()=>{
        let that=this
        axios.noLoadingAjax({
            url:'/grid/points/getAreaEnterprise',
            data: {
                params:{}
            }
        }).then((res)=>{
            if (res.status == 'success') {
                let list=res.data.areaList;
                let value=res.data.areaCount
                let areaCount=[]
                let area=[]
                for (var key in list) {
                    let child=list[key]
                    area.push(child.name)
                }
                this.state.NewIndustryList.map((item)=>{//循环业态
                    let litsvalue=[]
                    let name=''
                    for (var key0 in list){//循环地区
                        let id=list[key0].id
                        for (var key1 in value) {//循环取出地数据
                            if (id == key1) {
                                let child=value[key1]
                                for (var key2 in child){//对每个数据取出，加进数组
                                    if (key2 == item.remark) {
                                        litsvalue.push(child[key2]) /////取出对应的业态的数
                                    }
                                }
                            }
                        }
                    }
                    areaCount.push({name:item.name,type:'bar',stack:"叠加",data:litsvalue})
                })
                this.setState({
                    areaCount,
                    area,
                    PointsListLength:res.data.allCount,
                })
            }
        })
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
                    enterpriseStatistics:res.data.enterpriseStatistics,
                    NewEnterpriseStatistics:res.data.enterpriseStatistics
                })
            }
        })
    }
    getdata=()=>{
        this.getIndustryList()
        axios.PostAjax({
            url:"/grid/points/getSmilePoints",
            data: {
                params:{areaList:[''],industryList:['']}
            }
        }).then((res)=>{
            if(res.status == "success"){
                console.log(res.data)
                this.addGridPoints(res.data)
                this.setState({
                    PointsList:res.data,

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
        //             PointsList:res.data,
        //             PointsListLength:res.data.length
        //         })
        //         this.addGridPoints(res.data)
        //     }
        // })
        this.getGridData();
        this.getIndustryType()
    }
    getIndustryType=()=>{
        axios.noLoadingAjax({
            url:'/sys/industry/getList',
            data: {params:{}}
        }).then((res)=>{
            if (res.status=='success'){
                this.setState({IndustryType:res.data})
            }
        })
    }
    getIndustryList=()=>{
        axios.noLoadingAjax({
            url:'/grid/grid/getTest',
            data: {params:{}}
        }).then((res)=>{
            this.setState({
                industryList:res.data.industryList.slice(1),////去除食品经营
                NewIndustryList:res.data.industryList.slice(1),
                industryList7:res.data.industryList,
            })
            console.log(res.data.industryList)
        })
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
                })
            }
        })
    }
    drawGrid=(value,coverValue)=>{
        let centerS=value.center.split(",")
        let center=[JSON.parse(centerS[1]),JSON.parse(centerS[0])]
        let le=value.level.split(".").length;//层级
        let name=value.name;
        let id=value.areaId;///区域的id
        let parentId=value.parentId
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
            // fillOpacity: 1,
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
        if (unitName == "泰山区") {
            this.map.add(polygon)
        }else {
            object3Dlayer.add(overlays[l]);
        }
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
            },
            id:id,
            level:le
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
                info.push("<div class='input-card content-window-card'><div class='labelTitle'>数 据 信 息</div>");
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
            list=this.state.PointsList.filter((item)=>(item.area==id))
        }else if(le==3){
            list=this.state.PointsList.filter((item)=>(item.grid==id))
        }
        let chlid=[]
        this.state.IndustryType.map((item)=>{
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
    addGridPoints=(data)=>{
        let l=markers.length
        markers[l]=[]
        let that=this;
        data.map((item,index)=>{
            // console.log(item,index)
            let point=item.point
            let point1=point.split(",")
            let icon
            for(var key in item){
                that.state.industryList7.map((item1)=>{
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
                let id=e.target.B.enterpriseId
                axios.ajax({
                    url:'/supervision/enterprise/getById',
                    data:{params:{id:id}}
                }).then((res)=>{
                    if(res.status =='success'){
                        console.log(res.data)
                        value=res.data
                        that.setState({
                            BaseInfo:res.data,
                            AddressForGaoDe:res.data.registeredAddress
                        })
                        let start,end
                        for(var key in value){
                            that.state.industryList.map((item)=>{
                                if (item.remark == key && value[key] !== null) {
                                    start=value[key].startTime
                                    end=value[key].endTime
                                }
                            })}
                        let imagelist=JSON.parse(value.propagandaEnclosure||JSON.stringify([]));
                        let startTime=moment(start).format("YYYY-MM-DD")
                        let endTime=moment(end).format("YYYY-MM-DD")
                        var info = [];
                        info.push("<div class='content-window-card'><div class='title'>数 据 信 息</div>");
                        info.push("<div class='pic-dom'>");
                        if (imagelist&&imagelist.length>0){
                            info.push("<div class='pic'><img alt='example'style={{ width: '100%' }} src="+commonUrl+"/upload/picture/"+imagelist[0].response.data+"/></div>")
                        } else {
                            info.push("<div class='pic'><text>企业营业许可证</text></div>")
                        }
                        if (imagelist&&imagelist.length>1) {
                            info.push("<div class='pic'><img alt='example' src="+commonUrl+"/upload/picture/"+imagelist[1].response.data+"/></div>")
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
                        info.push("<div class='bottom-icon'><img src='"+CommonCheck+"' onclick='showLedgerTable("+id+")' width='40px' height='40px'/></div><Divider type=\"vertical\" />");
                        info.push("<div class='bottom-icon'><img src='"+CheckView+"' onclick='handleOperator("+id+")' width='40px' height='40px'/></div><Divider type=\"vertical\" />");
                        info.push("<div class='bottom-icon'><img src='"+BaseInfo+"'id='BaseInfo' onclick='getBaseInfo()'  width='40px' height='40px'/></div><Divider type=\"vertical\" />");
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
    handleOperator(id){
        if(unitName=="平原县" ||unitName=="临清市"){
            axios.ajax({
                url:'/videoIsc/selectByEnterpriseId',
                data:{
                    params:{
                        id:id
                    }
                }
            }).then((res)=>{
                if(res.status =='success'){
                    console.log(res.data)
                    this.setState({
                        isVisible:true,
                        videoInfo:res.data,
                    })
                }
            })
        }else {
            axios.ajax({
                url:'/grid/points/getVideoIdByEnterprise',
                data:{
                    params:{
                        id:id
                    }
                }
            }).then((res)=>{
                if (res.status == "success") {
                    if (res.data==0){
                        message.info("暂无数据")
                    } else {
                        axios.ajax({
                            url:'/video/getById',
                            data:{
                                params:{
                                    id:res.data
                                }
                            }
                        }).then((res)=>{
                            if(res.status =='success'){
                                this.setState({
                                    isVisible:true,
                                    videoInfo:res.data,
                                })
                            }
                        })
                    }
                }
            })
        }
    }
    ToGaodeLocation=()=>{
        const w=window.open('about:blank');
        w.location.href='https://www.amap.com/search?query='+this.state.AddressForGaoDe
    }
    drawBounds(district,polygons){
        let that=this;
        if (unitName == "泰山区") {
            AMap.service('AMap.DistrictSearch', function () {//回调函数
                var opts = {
                    subdistrict: 1,   //返回下一级行政区
                    showbiz: false,  //查询行政级别为 市
                    extensions: 'all',  //返回行政区边界坐标组等具体信息
                    level: "district"  //查询行政级别为 市
                };
                let districtSearch = new AMap.DistrictSearch(opts); //实例化DistrictSearch
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
                                strokeColor: '#8de6ef',
                                strokeWeight: unitName=="泰山区"?5:10,
                                strokeOpacity:1
                            });
                            path.push(bounds[i])
                        }
                    }
                    bound=polygon
                    that.map.add(bound);
                    // that.map.setMask(path)
                    that.map.setFitView(bound)
                    // object3Dlayer.add(Wall);
                    that.map.setZoom(unitName=="历下区"?12.6:11.5)//平原县
                })
            })
        }else {
            AMap.service('AMap.DistrictSearch', function () {//回调函数
                var opts = {
                    subdistrict: 1,   //返回下一级行政区
                    showbiz: false,  //查询行政级别为 市
                    extensions: 'all',  //返回行政区边界坐标组等具体信息
                    level: "district"  //查询行政级别为 市
                };
                let districtSearch = new AMap.DistrictSearch(opts); //实例化DistrictSearch
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
                                strokeWeight: 5,
                                strokeOpacity:0.8
                            });
                            path.push(bounds[i])
                        }
                    }
                    bound=polygon
                    Wall = new AMap.Object3D.Prism({
                        path: bounds,
                        height: 3000,
                        color: 'rgba(255,255,255,0)'
                    });
                    Wall.transparent = true;
                    that.map.add(bound);
                    // that.map.setMask(path)
                    that.map.setFitView(bound)
                    object3Dlayer.add(Wall);
                    that.map.setZoom(unitName=="历下区"?12.6:11.5)//平原县
                })
            })
        }
    }
    onSelect = (keys, info) => {
        let selectInfo=info.props
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
            this.map.setZoom(unitName=="历下区"?12.6:11.5)//平原县
        }else {
            console.log("无信息")
        }
        /////////       //////根据子节点的child长度,找出要显示的点
        let points=[]
        if(child.length==0){
            points=this.state.PointsList.filter((item)=>(item.grid==keys))
        }else if(keys==1){
            points=this.state.PointsList
        }else { points=this.state.PointsList.filter((item)=>(item.area==keys))}
        this.addGridPoints(points)
    };
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
    renderTypeTreeNodes =(data)=>{
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
    onSelectType=(value, node, extra)=>{
        if (value==1){
            this.setState({
                NewIndustryList:this.state.industryList.slice(0,3),
            })
        }else if (value==2) {
            this.setState({
                NewIndustryList:this.state.industryList.slice(3,5),
            })
        }else if (value==3){
            this.setState({
                NewIndustryList:this.state.industryList.slice(5),
            })
        }else {
            this.setState({
                NewIndustryList:this.state.industryList,
            })
        }
    }
    getTitle=(text)=>{
        let title=(
            <Row>
                <text
                    style={{fontWeight:'bold',fontSize:'1.3rem',color:'rgba(255,255,255,1)'}}
                >{text}</text>
            </Row>
        )
        return title
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
    getRandarValue=()=>{
        let randarValue=[]
        let unOverTimeValue=[]
        let OverTimeValue=[]
        const now=new Date().getTime()
        this.state.NewIndustryList.map((item)=>{
            let unOverTimeNum=0
            let OverTimeNum=0
            this.state.PointsList.map((item1)=>{
                if (item.remark=="foodCirculate" && item1["foodBusiness"]!==null) {
                    if (item1["businessType"]=="食品销售经营者" || item1["businessType"]=="食品销售经营者（连锁）"
                        || item1["businessType"]=="食品销售经营者（非连锁）") {
                        let time=item1.endTime
                        if (time < now) {OverTimeNum++}
                        else {unOverTimeNum++}
                    }
                }else if (item.remark=="foodCommon" && item1["foodBusiness"]!==null){

                    if (item1["businessType"]=="餐饮服务经营者" || item1["businessType"]=="餐饮服务经营者（连锁）"
                        || item1["businessType"]=="餐饮服务经营者（非连锁）"|| item1["businessType"]=="单位食堂") {
                        let time=item1.endTime
                        if (time < now) {OverTimeNum++}
                        else {unOverTimeNum++}
                    }
                } else if (item1[item.remark] !== null) {
                    let time=item1.endTime
                    if (time < now) {OverTimeNum++}
                    else {unOverTimeNum++}
                }
            })
            unOverTimeValue.push(unOverTimeNum)
            OverTimeValue.push(OverTimeNum)
        })
        randarValue.push({
                value :unOverTimeValue ,
                name : '证件正常（家）'
            },
            {
                value : OverTimeValue,
                name : '证件过期（家）'
            })
        return randarValue
    }
    setRadarLegend=()=>{
        let value=[]
        this.state.NewIndustryList.map((item)=>{
            value.push({name:item.name,max:this.state.PointsListLength})
        })
        return value
    }
    searchEnterprise=()=>{
        if (this.state.searchEnterprise!=''){
            axios.ajax({
                url:'/grid/points/getEnterpriseIdByName',
                data:{params:{name:this.state.searchEnterprise}}
            }).then((res)=>{
                if (res.status=="success"){
                    let id=res.data[0].id
                    let p=this.state.PointsList.find((item)=>(item.enterpriseId==id))
                    this.showWindow(id,p)
                }
            })
        } else {
            message.info("请输入查询企业")
        }
    }
    showWindow=(id,p)=>{
        let point=p.point
        let point1=point.split(",")
        let that=this
        let value
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
                let start,end
                for(var key in value){
                    that.state.industryList.map((item)=>{
                        if (item.remark == key && value[key] !== null) {
                            start=value[key].startTime
                            end=value[key].endTime
                        }
                    })}
                let imagelist=JSON.parse(value.propagandaEnclosure||JSON.stringify([]));
                let startTime=moment(start).format("YYYY-MM-DD")
                let endTime=moment(end).format("YYYY-MM-DD")
                var info = [];
                info.push("<div class='content-window-card'><div class='title'>数 据 信 息</div>");
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
                info.push("<div class='bottom-icon'><img src='"+CommonCheck+"' onclick='showLedgerTable("+id+")' width='40px' height='40px'/></div><Divider type=\"vertical\" />");
                info.push("<div class='bottom-icon'><img src='"+CheckView+"' onclick='handleOperator("+id+")' width='40px' height='40px'/></div><Divider type=\"vertical\" />");
                info.push("<div class='bottom-icon'><img src='"+BaseInfo+"'id='BaseInfo' onclick='getBaseInfo()'  width='40px' height='40px'/></div><Divider type=\"vertical\" />");
                info.push("</div>");
                let infoWindow = new AMap.InfoWindow({
                    content: info.join(""),  //使用默认信息窗体框样式，显示信息内容
                    offset: new AMap.Pixel(13, -25),
                });
                infoWindow.open(that.map,[JSON.parse(point1[0]),JSON.parse(point1[1])])
            }
        })
    }
    handleSubmit=()=>{
        const {
            recordPerson,
            enterpriseId,
            enterpriseName,
            permissionId,
            charger,
            contact,
            areaName,
            area,
            address,
            recordTime,
            level,
            recordContent,
            type,
            handlePersonName,
            handlePersonId,
            handleContent,
            recordPicture1,
            recordPicture2} = this.state.videoInfo;//获取表单的值

        const data = {
            enterpriseId,
            enterpriseName,
            permissionId,
            charger,
            contact,
            areaName,
            area,
            address,
            recordPerson,
            recordTime,
            level,
            recordContent,
            type,
            handlePersonName,
            handlePersonId,
            handleContent,
            recordPicture1,
            recordPicture2}
        if((data.type==1&&data.handleContent==undefined)||(data.type==2&&data.handlePersonId==null))
        {
            Modal.error({title:"请填写所有带*号的选项"})
            return
        }
        axios.PostAjax({
            url:'/videoRecord/insert',
            data:{
                params:{
                    ...data,
                }
            }
        }).then((res)=>{
            if(res){
                this.setState({
                    isVisible:false,
                    videoInfo:{},
                })
            }
        })
    }
    showLedgerTable=(id)=>{
        this.setState({
            tablevisible:true,
            id
        })
    }
    goToMeituan=()=>{
        const w=window.open('about:blank');
        w.location.href='https://waimai.meituan.com/new/waimaiIndex'
    }
    render() {
        const modal=(<Modal
            title="企业信息"
            visible={this.state.visible}
            destroyOnClose
            getContainer={()=>this.refs.gridSupervision}
            centered={true}
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
        const video=(<Modal
            title={"监控信息"}
            visible={this.state.isVisible}
            width={1200}
            footer={null}
            maskClosable={false}
            destroyOnClose={true}
            onCancel={()=>{
                this.setState({
                    isVisible:false,
                    videoInfo:''
                })
            }}
        >
            <LiveVideo
                videoInfo={this.state.videoInfo||{}}
                dispatchVideoData={(data)=>{this.setState({videoInfo:data})}}
                handleSubmit={this.handleSubmit}
            />
        </Modal>)
        const ledgerTable=(
            <Modal
                title="台账信息"
                visible={this.state.tablevisible}
                destroyOnClose
                centered={true}
                mask={true}
                width={1000}
                onCancel={()=>{
                    this.props.clearEnterprise();
                    this.setState({
                        tablevisible:false,
                    })
                }}
                footer={false}
            >
                <LedgerTable id={this.state.id}/>
            </Modal>
        )
        return (
            <div className='wholeNumber'>
                <div className='wholeNumberHeader' style={{backgroundImage: "url(" + require("./img/wholeNumber.png") + ")"}}>
                    <div className='numberLabel'>扫描店铺总数量：</div>
                    <div className='numberBox'>3</div>
                    <div className='numberBox'>0</div>
                    <div className='numberBox'>0</div>
                    <div className='numberBox'>0</div>
                    <div className='numberBox'>0</div>
                    <div className='numberBox'>0</div>
                    <div className='numberBox'>0</div>
                    <div className='numberBox'>0</div>
                </div>
                <div className='wholeNumberContent'>
                    <a onClick={()=>this.goToMeituan()}>美团</a>
                        <div ref={'gridSupervision'} id={'gridSupervision'} className={'gridSupervision'}>
                            {modal} {ledgerTable}  {video}
                        </div>
                </div>
            </div>
        )
    }
}

export default wholeNumber