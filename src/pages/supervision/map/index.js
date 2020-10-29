import * as React from "react";
// import Map from "./Mapd";
import "./index.css";
//图片
import a0 from "./images/0.png";
import i1 from "./images/11.png";
import i2 from "./images/12.png";
import i3 from "./images/13.png";
import c1 from "./images/21.png";
import c2 from "./images/22.png";
import c3 from "./images/23.png";
import h1 from "./images/31.png";
import h2 from "./images/32.png";
import h3 from "./images/33.png";
import q1 from "./images/41.png";
import q2 from "./images/42.png";
import q3 from "./images/43.png";
import allPic from "./images/all.png";
import newPic from "./images/new.png";
import nomalPic from "./images/nomal.png";
import abnomalPic from "./images/abnomal.png";
import totalPic from "./images/total.png";
import searchPic from "./images/search.png";
import analysisPic from "./images/analysis.png";
import nav1 from "./images/nav1.png";
import nav2 from "./images/nav2.png";
import nav3 from "./images/nav3.png";
import nav4 from "./images/nav4.png";
import detailPic from "./images/detail.png";
//导入饼图
import 'echarts/lib/chart/pie'
import 'echarts/lib/component/tooltip'
import 'echarts/lib/component/title'
import 'echarts/lib/component/legend'
import 'echarts/lib/component/markPoint'
import { Input,Button,message ,Modal ,Row,Col,Card} from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import ReactEcharts from 'echarts-for-react';
import axios from "../../../axios";
import {commonUrl} from "../../../axios/commonSrc";
import connect from "react-redux/es/connect/connect";
import {changeEnterprise, clearEnterprise} from "../../../redux/action";
import  BaseForm  from '../../../components/BaseFormForMap';
import Utils from "../../../utils";
import Add from '../enterpriseEx/Add';
import LedgerTable from "../../grid/gridSupervision/LedgerTable";
import LiveVideo from "../../grid/gridSupervision/LiveVideo";
const { Search } = Input;

const AMap = window.AMap;
let cluster= {};
@connect(
    state=>({
        industryList:state.industryList,
        areaList:state.areaList,
    }),{
        clearEnterprise,
        changeEnterprise,
    }
)
class map extends React.Component{
    constructor(props){
        super(props);

    this.state = {
        datai1: [],
        datai2: [],
        datai3: [],
        datac1: [],
        datac2: [],
        datac3: [],
        datah1: [],
        datah2: [],
        datah3: [],
        dataq1: [],
        dataq2: [],
        dataq3: [],
        t1:0,//全部，企业，个体，合作社，其他
        t2:0,//全部，新增，正常，异常
        propagandaEnclosure:[],
        enterpriseName:"东营区荣欣超市有限公司",
        legalPerson:"王小二",
        cantactWay:"1554466778",
        idNumber:"234239084JK9w403",
        registeredAddress:"东营市东营区上独领上可上书法家深刻理解的0923号",
        detailDisplay:"none",
        requestLoading: true,
        //以下为整合
        iCount:0,
        cCount:0,
        hCount:0,
        qCount:0,
        newCount:0,
        nomalCount:0,
        abnCount:0,
        data:[],
        position:"",
        searchType:"1",
    }
        window.detaiDisplay=(value)=>this.detaiDisplay(value);
    }
    params = {
        pageNo:1,
        industryList:'',
        areaList:''
    }
    componentDidMount() {
        this.map = new AMap.Map("container", {
            center: [118.674413, 37.433808],//东营市政府
            zoom: 15,
            resizeEnable: true,

        });
        this.map.on('click', ()=> {
            this.setState({detailDisplay:"none"})
        });
        let geocoder;
        AMap.plugin('AMap.Geocoder', function() {
            geocoder = new AMap.Geocoder({
                city: "370500",
                // city: '东营'
            });
        })
        this.requestList()
    }

    
    requestList=()=>{
        axios.PostAjax({
            url: "/grid/points/getSmilePoints",
            data: {
                params:{
                    ...this.params,
                    areaList:[this.params.areaList],
                    industryList:[this.params.industryList],
                }
            }
        }).then((res)=>{console.log(res)
            if(res.status == "success"){
                this.setState({
                    datai1:[],datai2:[],datai3:[],datac1:[],datac2:[], datac3:[],
                    datah1:[],datah2:[],datah3:[],dataq1:[],dataq2:[],dataq3:[],t1:0
                })
                this.setData(res.data)
            }
        })

    }
    handleFilterSubmit = (filterParams) => {
        this.params = filterParams;
        this.requestList();
    };
    //赋予表格数据
    setData = (list) => {
        let oms=["个体","公司","合作社","其他"];
        let icons=[i1,i2,i3,c1,c2,c3,h1,h2,h3,q1,q2,q3];
        let data=[this.state.datai1,this.state.datai2,this.state.datai3,
            this.state.datac1,this.state.datac2,this.state.datac3,
            this.state.datah1,this.state.datah2,this.state.datah3,
            this.state.dataq1,this.state.dataq2,this.state.dataq3];
          list.map((item, index) => {
            let k=0;

            for(let i=0;i<oms.length;i++){
                for(let j=1;j<=3;j++){
                    if (item.operationMode === oms[i] && parseInt(item.businessState) === j ) {
                        let ll = item.point.split(",");
                        let marker = new AMap.Marker({
                            position: new AMap.LngLat(ll[0], ll[1]),
                            icon: icons[k],
                        });
                        marker.content = item;
                        marker.on('click', this.markerDisplay);
                        //marker.emit('click', {target: marker});
                        data[k].push(marker);
                    }
                    k++;
                }
            }

        })
        this.displayMakers();
            let iCount=this.state.datai1.length+this.state.datai2.length+this.state.datai3.length;
            let cCount=this.state.datac1.length+this.state.datac2.length+this.state.datac3.length;
            let hCount=this.state.datah1.length+this.state.datah2.length+this.state.datah3.length;
            let qCount=this.state.dataq1.length+this.state.dataq2.length+this.state.dataq3.length;
            let newCount=this.state.datai1.length+this.state.datac1.length+this.state.datah1.length+this.state.dataq1.length;
            let nomalCount=this.state.datai2.length+this.state.datac2.length+this.state.datah2.length+this.state.dataq2.length;
            let abnCount=this.state.datai3.length+this.state.datac3.length+this.state.datah3.length+this.state.dataq3.length;
          let value={"iCount":iCount,"cCount":cCount,"hCount":hCount,"qCount":qCount,
                        "newCount":newCount,"nomalCount":nomalCount,"abnCount":abnCount
          };

        this.setStateFromMap(value);
        this.setState({detailDisplay:"none"})
    }
    setStateFromMap=(value)=>{
        this.setState({
            iCount:value.iCount,
            cCount:value.cCount,
            hCount:value.hCount,
            qCount:value.qCount,
            newCount:value.newCount,
            nomalCount:value.nomalCount,
            abnCount:value.abnCount,
        });
    }

    getOption = ()=>{
        let option = {
            tooltip : {
                show:true,
                trigger: 'item',
                formatter: "{a} <br/>{b} : {c} ({d}%)"
            },
            legend: {
                bottom: 15,
                right: 5,
                data: ['新增','正常','异常']
            },

            color:['#30A5FD', '#99CC00','red'],
            series : [
                {
                    name:'',
                    type:'pie',
                    radius : '60%',//设置饼图大小
                    data:[
                        {value:this.state.newCount, name:'新增'},
                        {value:this.state.nomalCount, name:'正常'},
                        {value:this.state.abnCount, name:'异常'},
                    ],
                }
            ]
        }
        return option;
    }
    changeSearchType=(e)=>{
    this.setState({searchType:e.target.value});
}
    cp =()=>{
        this.changePosition(this.state.searchType,this.state.position);
    }
    changeValue=(event)=>{
        this.setState({position:event.target.value})
    }
    changePosition =(searchType,address)=>{
        let that = this;
        if(searchType=="1"){
            
            axios.PostAjax({
                url: "/grid/points/getSmilePoints",
                data: {
                    params:{
                        ...that.params,
                        areaList:[that.params.areaList],
                        industryList:[that.params.industryList],
                        enterpriseName:address
                    }
                }
            }).then((res)=>{
                if(res.status == "success" && res.data.length == 1){
                    that.map.clearMap()
                    let position1 = res.data[0].point.split(',')
                    let marker = new AMap.Marker({
                        position: position1,   // 经纬度对象，也可以是经纬度构成的一维数组[116.39, 39.9]
                        draggable:false
                    }); 
                    that.map.add(marker);
                    that.map.setFitView(marker)
                    message.success("搜索到一家企业")
                    that.detaiDisplay(JSON.stringify(res.data[0]));
                }else if(res.status == "success" && res.data.length > 1){
                    that.map.clearMap()
                    for(let i in res.data){
                        let position2 = res.data[i].point.split(',')
                        let marker = new AMap.Marker({
                            position: position2,   // 经纬度对象，也可以是经纬度构成的一维数组[116.39, 39.9]
                            draggable:false
                        }); 
                        that.map.add(marker);
                    } 
                    message.success(`${res.data.length}个搜索结果以标记在地图上`)
                        that.detaiDisplay(JSON.stringify({}));
                }
                else{
                    message.error("未搜索到该企业")
                }
            })
        }
        else{
            let marker = new AMap.Marker();
            let geocoder;
        
        AMap.plugin('AMap.Geocoder', function() {
            geocoder = new AMap.Geocoder({
                // city 指定进行编码查询的城市，支持传入城市名、adcode 和 citycode
                // city: '东营'
            });
        geocoder.getLocation(address, (status, result)=> {
            if (status === 'complete' && result.geocodes.length) {
                that.map.clearMap()
                var lnglat = result.geocodes[0].location
                message.success("定位成功")
                marker = new AMap.Marker({
                    position: lnglat,   // 经纬度对象，也可以是经纬度构成的一维数组[116.39, 39.9]
                    draggable:false
                });
                that.map.add(marker);
                that.map.setFitView(marker);
            }else{
                that.map.clearMap()
                message.info('根据地址查询位置失败');
            }
        })
    })
        }
    }
    // onRef = (ref) => {
    //     this.Map = ref
    // }
    //以下为整合过来的函数
    clearAll = () => {
        this.map.clearMap();
        this.map.remove(cluster);
        
    }
    displayMakers=()=>{//先加再减，实现企业主体和状态二维操作
        const {datai1,datai2,datai3,datac1,datac2,datac3,datah1,datah2,datah3,dataq1,dataq2,dataq3}=this.state;

        this.clearAll();
        let dataplus=[];

        if(this.state.t1===0){
            dataplus=datai1.concat(datai2).concat(datai3);
            dataplus=dataplus.concat(datac1).concat(datac2).concat(datac3);
            dataplus=dataplus.concat(datah1).concat(datah2).concat(datah3);
            dataplus=dataplus.concat(dataq1).concat(dataq2).concat(dataq3);
            if(this.state.t2===1)dataplus=datai1.concat(datac1).concat(datah1).concat(dataq1);
            if(this.state.t2===2)dataplus=datai2.concat(datac2).concat(datah2).concat(dataq2);
            if(this.state.t2===3)dataplus=datai3.concat(datac3).concat(datah3).concat(dataq3);
        } else if(this.state.t1===1){
            dataplus=datai1.concat(datai2).concat(datai3);
            if(this.state.t2===1)dataplus=datai1;
            if(this.state.t2===2)dataplus=datai2;
            if(this.state.t2===3)dataplus=datai3;
        } else if(this.state.t1===2){
            dataplus=datac1.concat(datac2).concat(datac3);
            if(this.state.t2===1)dataplus=datac1;
            if(this.state.t2===2)dataplus=datac2;
            if(this.state.t2===3)dataplus=datac3;
         } else if(this.state.t1===3){
            dataplus=datah1.concat(datah2).concat(datah3);
            if(this.state.t2===1)dataplus=datah1;
            if(this.state.t2===2)dataplus=datah2;
            if(this.state.t2===3)dataplus=datah3;
        } else if(this.state.t1===4){
            dataplus=dataq1.concat(dataq2).concat(dataq3);
            if(this.state.t2===1)dataplus=dataq1;
            if(this.state.t2===2)dataplus=dataq2;
            if(this.state.t2===3)dataplus=dataq3;
        }
         cluster=new AMap.MarkerClusterer(this.map, dataplus, {
            gridSize: 80,
        });
        cluster.on('click', this.markerClick);
    }
    markerClick = (e) => {
        if(this.map.getZoom()===18) {
            var infoWindow = new AMap.InfoWindow({offset: new AMap.Pixel(0, -30)});
            let content = "<div style='max-height:200px;width:250px;'>";
            content += "<div style='margin-top:-7px;font-size:15px;font-weight:bold;color:#d9363e'>同定位企业</div>";
            content += "<div id='companyLists'style='yellow;max-height:100px;width:250px;overflow-y:auto'>"
            for(let i=0;i<e.markers.length;i++){
                let asd = JSON.stringify(e.markers[i].content)
                content += "<div  class='bottomGrayBox'style='font-size:13px;font-family:黑体;min-width:200px;cursor:pointer' onclick= detaiDisplay('"+asd+"')>"+e.markers[i].content.enterpriseName+"</div>";
            }
            content += "</div>";
            content += "</div>";
            infoWindow.setContent(content);

            infoWindow.open(this.map, e.lnglat);

        }
    }

    detaiDisplay =(item)=>{
        alert(12);
        let content = JSON.parse(item)
        if(content){
            /////
            axios.ajax({
                url: "/supervision/enterprise/getById",
                data: {
                    params:{
                         id:content.enterpriseId
                    }
                }
            }).then((res)=>{
                if(res.status == "success" ){
                    this.setState({
                        detailDisplay:"inline",
                        enterpriseId:res.data.enterpriseId,
                        propagandaEnclosure:JSON.parse(res.data.propagandaEnclosure||JSON.stringify([])),
                        enterpriseName:res.data.enterpriseName,
                        legalPerson:res.data.legalPerson,
                        cantactWay:res.data.cantactWay,
                        idNumber:res.data.idNumber,
                        registeredAddress:res.data.registered_address,
                    })
                }
            })
            /////


        }
    }
    markerDisplay =(e)=>{
        let content = e.target.content
        if(content){
            /////
            axios.ajax({
                url: "/supervision/enterprise/getById",
                data: {
                    params:{
                        id:content.enterpriseId
                    }
                }
            }).then((res)=>{
                if(res.status == "success" ){
                    this.setState({
                        detailDisplay:"inline",
                        enterpriseId:res.data.enterpriseId,
                        propagandaEnclosure:JSON.parse(res.data.propagandaEnclosure||JSON.stringify([])),
                        enterpriseName:res.data.enterpriseName,
                        legalPerson:res.data.legalPerson,
                        cantactWay:res.data.cantactWay,
                        idNumber:res.data.idNumber,
                        registeredAddress:res.data.registered_address,
                    })
                }
            })
            /////

        }
    }
    onlyDisplay=(t1)=>{
        this.setState({t1:t1},()=>{ this.displayMakers()});
    }
    onlyDisplay1=(t2)=>{
        this.setState({t2:t2},()=>{ this.displayMakers()});
    }
   
   
    
    toGaodeLocation=()=>{
        const w=window.open('about:blank');
        w.location.href='https://www.amap.com/search?query='+this.state.registeredAddress
    }
    baseInfo=()=>{
        axios.ajax({
            url:'/supervision/enterprise/getById',
            data:{
                params:{
                   id:this.state.enterpriseId
                }
            }
        }).then((res)=>{
            if(res.status =='success'){
                this.setState({
                    baseInfoVisible:true,
                    searchEmployee:this.state.enterpriseId
                })
                let data = res.data;
                this.props.changeEnterprise({...data,
                    propagandaEnclosure:JSON.parse(data.propagandaEnclosure||JSON.stringify([])),
                    businessLicensePhoto:JSON.parse(data.businessLicensePhoto||JSON.stringify([])),
                    foodBusinessPhotos:JSON.parse(data.foodBusinessPhotos||JSON.stringify([])),
                    smallCaterPhotos:JSON.parse(data.smallCaterPhotos||JSON.stringify([])),
                    smallWorkshopPhotos:JSON.parse(data.smallWorkshopPhotos||JSON.stringify([])),
                    foodProducePhotos:JSON.parse(data.foodProducePhotos||JSON.stringify([])),
                    drugsBusinessPhotos:JSON.parse(data.drugsBusinessPhotos||JSON.stringify([])),
                    drugsProducePhotos:JSON.parse(data.drugsProducePhotos||JSON.stringify([])),
                    cosmeticsUsePhotos:JSON.parse(data.cosmeticsUsePhotos||JSON.stringify([])),
                    medicalProducePhotos:JSON.parse(data.medicalProducePhotos||JSON.stringify([])),
                    medicalBusinessPhotos:JSON.parse(data.medicalBusinessPhotos||JSON.stringify([])),
                    industrialProductsPhotos:JSON.parse(data.industrialProductsPhotos||JSON.stringify([])),
                    publicityPhotos:JSON.parse(data.publicityPhotos||JSON.stringify([])),
                    certificatePhotos:JSON.parse(data.certificatePhotos||JSON.stringify([])),
                    otherPhotos:JSON.parse(data.otherPhotos||JSON.stringify([]))
                });
            }
        })
    }
    showVideo=()=>{
        axios.ajax({
            url:'/grid/points/getVideoIdByEnterprise',
            data:{
                params:{
                    id:this.state.enterpriseId
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
                                videoVisible:true,
                                videoInfo:res.data,
                            })
                        }
                    })
                }
            }
        })

    }
    showLedgerTable=()=>{
        this.setState({
            tablevisible:true,
        })

    }
    handleVideoSubmit=()=>{
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
                    videoVisible:false,
                    videoInfo:{},
                })
            }
        })
    }
    render(){
        const {iCount,cCount,qCount,hCount}=this.state;
        const formList = [
            
            {
                type: 'AREA_TREE',
                field: 'areaList',
                width: 200,
                list: Utils.getDataSource(this.props.areaList||[])
            },
        ]
        const SearchForm =<div > <BaseForm formList={formList} filterSubmit={this.handleFilterSubmit}/></div>
        const modal=(<Modal
            title="企业信息"
           visible={this.state.baseInfoVisible}
           destroyOnClose
           centered={true}
           width={1000}
           onCancel={()=>{
               this.props.clearEnterprise();
               this.setState({
                baseInfoVisible:false,
               })
           }}
           footer={false}
       >
             <Add type={"detail"} searchEmployee={this.state.searchEmployee}/>
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
           <LedgerTable id={this.state.enterpriseId}/>
        </Modal>
    )
    const videoModal=(<Modal
        title={"监控信息"}
        visible={this.state.videoVisible}
        width={1200}
        footer={null}
        maskClosable={false}
        destroyOnClose={true}
        onCancel={()=>{
            this.setState({
                videoVisible:false,
                videoInfo:''
            })
        }}
    >
        <LiveVideo
            videoInfo={this.state.videoInfo||{}}
            dispatchVideoData={(data)=>{this.setState({videoInfo:data})}}
            handleSubmit={this.handleVideoSubmit}
        />
    </Modal>)
        return (
            <div>
                        {modal}{ledgerTable}{videoModal}
                <Row gutter={16}>
                    <Col span={18}>
                        <div id="topPanel" className="grayBox">
                            <div className="rightGrayBox" style={{textAlign:"center",width:"10%",fontSize:"18px",color:"#1890ff",float:"left" }}>
                                <div style={{fontWeight: "bold"}}>数据地图</div>
                                <div style={{fontWeight: "bold"}}>控制台</div>
                            </div>

                            <div className="grayBox omStat" onClick={()=>this.onlyDisplay(0)} style={this.state.t1===0?{background:'#e8e6e1'}:{}}>
                                <div className="rightGrayBox" style={{width: "45px", float: "left"}}>
                                    <img src={a0}  width="30px"/></div>
                                <div style={{marginTop: "5px", fontWeight: "bold"}}>市场主体</div>
                                &nbsp;<span style={{color:"#1890ff",fontWeight:"bold"}}>{iCount+cCount+qCount+hCount}&nbsp;</span>
                            </div>

                            <div className="grayBox omStat" onClick={()=>this.onlyDisplay(2)} style={this.state.t1===2?{background:'#e8e6e1'}:{}}>
                                <div className="rightGrayBox" style={{width: "45px", float: "left"}}><img src={require("./images/公司正常.png")} width="30px"/></div>                                                                      
                                <div style={{marginTop: "5px",fontWeight:"bold"}} >公司类
                                    &nbsp;<span style={{color:"#1890ff"}}>{cCount}</span></div>
                                &nbsp;<span style={{fontSize: "10px", float: "right",color:"lightgray"}}>单位：家 &nbsp;</span>
                            </div>

                            <div className="grayBox omStat" onClick={()=>this.onlyDisplay(1)} style={this.state.t1===1?{background:'#e8e6e1'}:{}}>
                                <div className="rightGrayBox" style={{width:"45px",float:"left"}}><img src={require("./images/个体正常.png")} width="30px"/></div>
                                <div style={{marginTop: "5px",fontWeight:"bold"}} >个体类
                                    &nbsp;<span style={{color:"#1890ff"}}>{iCount}</span></div>
                                &nbsp;<span style={{fontSize:"10px",float:"right",color:"lightgray"}}>单位：家 &nbsp;</span>
                            </div>
                            
                            <div className="grayBox omStat" onClick={()=>this.onlyDisplay(3)} style={this.state.t1===3?{background:'#e8e6e1'}:{}}>
                                <div className="rightGrayBox" style={{width: "45px", float: "left"}}><img src={require("./images/合作社正常.png")}width="30px"/></div>
                                <div style={{marginTop: "5px",fontWeight:"bold"}} >合作社
                                    &nbsp;<span style={{color:"#1890ff"}}>{hCount}</span></div>
                                &nbsp;<span style={{fontSize: "10px", float: "right",color:"lightgray"}}>单位：家 &nbsp;</span>
                            </div>
                            <div className="grayBox omStat" onClick={()=>this.onlyDisplay(4)} style={this.state.t1===4?{background:'#e8e6e1'}:{}}>
                                <div className="rightGrayBox" style={{width: "45px", float: "left"}}><img src={require("./images/其他正常.png")} width="30px"/></div>                                                                              
                                <div style={{marginTop: "5px",fontWeight:"bold"}}>其他
                                    &nbsp;<span style={{color:"#1890ff"}}>{qCount}</span></div>
                                &nbsp;<span style={{fontSize: "10px", float: "right",color:"lightgray"}}>单位：家 &nbsp;</span>
                            </div>
                        </div>

                    {/* 以下为地图，坐标提示，数据信息 */}
                        <div style ={{width:"100%",height:"720px",border:"5px solid #DCDCDC",marginTop:10}} className="grayBox">
                            <div id="container" style={{width: "100%", height: "710px"}}></div>
                            <div id="input-card">
                                <div style={{height:"25px",background: "#000", color: "#99FFFF",padding:"2px"}}>
                                    &nbsp;&nbsp;企业定位坐标</div>
                                <div className="input-item">
                                    <span className="locationTitle">&nbsp;&nbsp;个&nbsp;&nbsp;&nbsp;&nbsp;体</span>：
                                    新增&nbsp;<img className="smallImg" alt="" src={require("./images/个体新增.png")}/>&nbsp;&nbsp;
                                    正常&nbsp;<img className="smallImg" alt="" src={require("./images/个体正常.png")}/>&nbsp;&nbsp;
                                    异常&nbsp;<img className="smallImg" alt="" src={require("./images/个体异常.png")}/>
                                </div>
                                <div className="input-item">
                                    <span className="locationTitle">&nbsp;&nbsp;公&nbsp;&nbsp;&nbsp;&nbsp;司</span>：
                                    新增&nbsp;<img className="smallImg" alt="" src={require("./images/公司新增.png")}/>&nbsp;&nbsp;
                                    正常&nbsp;<img className="smallImg" alt="" src={require("./images/公司正常.png")}/>&nbsp;&nbsp;
                                    异常&nbsp;<img className="smallImg" alt="" src={require("./images/公司异常.png")}/>
                                </div>
                                <div className="input-item">
                                    <span className="locationTitle">&nbsp;&nbsp;合作社</span>：
                                    新增&nbsp;<img className="smallImg" alt="" src={require("./images/合作社新增.png")}/>&nbsp;&nbsp;
                                    正常&nbsp;<img className="smallImg" alt="" src={require("./images/合作社正常.png")}/>&nbsp;&nbsp;
                                    异常&nbsp;<img className="smallImg" alt="" src={require("./images/合作社异常.png")}/>
                                </div>
                                <div className="input-item">
                                    <span className="locationTitle">&nbsp;&nbsp;其&nbsp;&nbsp;&nbsp;&nbsp;他</span>：
                                    新增&nbsp;<img className="smallImg" alt="" src={require("./images/其他新增.png")}/>&nbsp;&nbsp;
                                    正常&nbsp;<img className="smallImg" alt="" src={require("./images/其他正常.png")}/>&nbsp;&nbsp;
                                    异常&nbsp;<img className="smallImg" alt="" src={require("./images/其他异常.png")}/>
                                </div>
                            </div>
                            <div id="companyInfo" >
                                <div className={"bottomGrayBox"}>&nbsp;&nbsp;<img src={detailPic} alt=''/>数据信息</div>
                                <div style={{display:this.state.detailDisplay}}>
                                    {this.state.propagandaEnclosure.length>=1?
                                        <img src={commonUrl+"/upload/picture/"+this.state.propagandaEnclosure[0].response.data} width={"300px"} height={"150px"}/>:
                                        <img src=""  width={"300px"} height={"150px"}/>
                                    }
                                    <div className={"bottomGrayBox"} style={{fontSize: "18px",fontWeight:"bold"}}>&nbsp;&nbsp;{this.state.enterpriseName}</div>
                                    <div className={"bottomGrayBox"} >
                                        法&nbsp;定&nbsp;代&nbsp;表&nbsp;人：{this.state.legalPerson}<br/>
                                        联&nbsp;&nbsp;系&nbsp;&nbsp;&nbsp;电&nbsp;&nbsp;话：{this.state.cantactWay}<br/>
                                        统一信用代码：{this.state.idNumber}<br/>
                                        <div style={{float: "left"}}>企&nbsp;&nbsp;业&nbsp;&nbsp;&nbsp;地&nbsp;&nbsp;址：</div>
                                            <div style={{paddingLeft:"100px",width: "290px"}}>{this.state.registeredAddress}</div>
                                        <div style={{height:"10px"}}></div>
                                        <div style={{textAlign: "right"}}>
                                            <img src={nav1} onClick={()=>this.baseInfo()} width='30px' height='30px' alt=''/>&nbsp;&nbsp;
                                            <img src={nav2} onClick={()=>this.showVideo()}  width='30px' height='30px' alt=''/>&nbsp;&nbsp;
                                            <img src={nav3} onClick={()=>this.showLedgerTable()}  width='30px' height='30px' alt=''/>&nbsp;&nbsp;
                                            <img src={nav4} onClick={this.toGaodeLocation}  width='30px' height='30px' alt=''/>&nbsp;&nbsp;
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        {/* 以上为地图，坐标提示，数据信息 */}
                   
                    </Col>
               
                    <Col span={6}>
        
                    <div className="grayBox" style ={{width:"100%",height:"120px",marginBottom:"15px"}}>
                        <div className={"bottomGrayBox"} style={{fontSize: "17px",fontWeight:"bold" }}><img src={totalPic}/>市场主体总计（单位：家）</div>
                        <span style={{fontSize: "40px", color:"red",float: "right",letterSpacing:"8px",fontWeight:"bold"}}>
                            {iCount+cCount+qCount+hCount}&nbsp;&nbsp;</span>
                    </div>
                   
                    
                    <div className="grayBox" style ={{width:"100%",height:"230px",marginBottom:"15px"}}>
                        <div className={"bottomGrayBox"}style={{fontWeight:"bold" ,fontSize: "17px"}}><img src={searchPic} />数据搜索</div>
                        <div className={"grayBox"} style ={{width:"96%",height:"40px",border:"#cccc00 solid 1px",margin:"10px"}}>
                            <div  className={"rightSearchBox"}style ={{borderRight:"#cccc00 solid 1px"}}>区域筛选</div>
                            <div >{SearchForm}</div>
                        </div>

                        <div className={"grayBox"} style ={{width:"96%",height:"120px",border:"#cc6600 solid 1px",margin:"10px"}}>
                            <div className={"rightSearchBox"}style ={{borderRight:"#cc6600 solid 1px"}}>搜索聚焦</div>
                            <div style ={{marginTop:"5px"}}>
                                <input type="radio"  name="s1" value="1"  onClick={this.changeSearchType}/>市场主体名称&nbsp;&nbsp;
                                <input type="radio"  name="s1" value="2" onClick={this.changeSearchType}/>位置聚焦
                            </div>
                            <Search
                                placeholder=""
                                onSearch={value => this.cp(value)}
                                onChange={value=>this.changeValue(value)}
                                style={{ width: "96%",marginLeft:"5px"}}
                            />
                            <div style={{ float: "right",margin:"10px"}}>
                                <Button icon={<SearchOutlined />} type="primary" shape="round" onClick={()=>this.cp()}>搜索</Button></div>
                        </div>
                    </div>
                  
                    <div className="grayBox" style ={{width:"100%",height:"400px"}}>
                        <div className={"bottomGrayBox"} style={{fontWeight:"bold",fontSize: "17px" }}><img src={analysisPic}/>企业状态分析</div>
                        <div style={{margin:8}}>
                            <img src={allPic} width="68px" style={{cursor:'pointer'}} alt='' onClick={()=>this.onlyDisplay1(0)}/>&nbsp;
                            <img src={newPic} width="68px" style={{cursor:'pointer'}}alt='' onClick={()=>this.onlyDisplay1(1)}/>&nbsp;
                            <img src={nomalPic} width="68px" style={{cursor:'pointer'}}alt='' onClick={()=>this.onlyDisplay1(2)}/>&nbsp;
                            <img src={abnomalPic} width="68px" style={{cursor:'pointer'}}alt='' onClick={()=>this.onlyDisplay1(3)}/>
                        </div>
                        <div style={{width:'96%',height:5,background:'#DCDCDC'}}></div>
                            <ReactEcharts  option={this.getOption()}/>
                    </div>
                </Col>
                </Row>
            </div>
        )
    }
}
export default  map;