
import React,{ Component } from 'react';
import "./index.css";
import i1 from "./images/11.png";
import i2 from "./images/12.png";
import i3 from "./images/13.gif";
import c1 from "./images/21.png";
import c2 from "./images/22.png";
import c3 from "./images/23.gif";
import h1 from "./images/31.png";
import h2 from "./images/32.png";
import h3 from "./images/33.gif";
import q1 from "./images/41.png";
import q2 from "./images/42.png";
import q3 from "./images/43.gif";
import detailPic from "./images/detail.png";
import cp from "./images/companyPic.jpg";
import nav1 from "./images/nav1.png";
import nav2 from "./images/nav2.png";
import nav3 from "./images/nav3.png";
import nav4 from "./images/nav4.png";
import { message ,Modal} from 'antd';
// import {fetchPost1} from "../../../static/util/fetch";
import axios from "../../../axios";
import {commonUrl} from "../../../axios/commonSrc";
import connect from "react-redux/es/connect/connect";
import {changeEnterprise, clearEnterprise} from "../../../redux/action";
import Add from '../enterpriseEx/Add'
const AMap = window.AMap;

// @connect(
//     state=>({
//         industryList:state.industryList,
//     }),{
//         clearEnterprise,
//         changeEnterprise,
//     }
// )

 class Map extends Component {
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
    }
    window.detailDispaly=(value)=>this.detailDispaly(value);
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
        
        // this.geocoder = new AMap.Geocoder({
        //     city: "370500", //城市设为东营
        // });

        axios.PostAjax({
            url: "/grid/points/getSmilePoints",
            data: {
                params:{
                    ...this.params,
                    areaList:[this.params.areaList],
                    industryList:[this.params.industryList],
                }
            }
        }).then((res)=>{
            if(res.status == "success"){
                this.setData(res.data)
            }
        })
    }

    displayMakers=()=>{//先加再减，实现企业主体和状态二维操作
        const {datai1,datai2,datai3,datac1,datac2,datac3,datah1,datah2,datah3,dataq1,dataq2,dataq3}=this.state;

        this.map.clearMap();
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
        // dataplus.map((data)=>{
        //     this.map.add(data);
        // })
        let cluster=new AMap.MarkerClusterer(this.map, dataplus, {
            gridSize: 80,
        });
        cluster.on('click', this.markerClick);

    }
    onlyDisplay=(t1)=>{
        this.setState({t1:t1},()=>{ this.displayMakers()});
    }
    onlyDisplay1=(t2)=>{
        this.setState({t2:t2},()=>{ this.displayMakers()});
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
                    let position1 = res.data[0].point.split(',')
                    let marker = new AMap.Marker({
                        position: position1,   // 经纬度对象，也可以是经纬度构成的一维数组[116.39, 39.9]
                        draggable:false
                    }); 
                    that.map.add(marker);
                    that.map.setFitView(marker)
                    message.success("搜索到一家企业")
                    that.detailDispaly(JSON.stringify(res.data[0]));
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
                        that.detailDispaly(JSON.stringify({}));
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
                var lnglat = result.geocodes[0].location
                message.success("定位成功")
                marker = new AMap.Marker({
                    position: lnglat,   // 经纬度对象，也可以是经纬度构成的一维数组[116.39, 39.9]
                    draggable:false
                });
                that.map.add(marker);
                that.map.setFitView(marker);
            }else{
                message.info('根据地址查询位置失败');
            }
        })
    })
        }
        
    
    }
    markerClick = (e) => {console.log(e)
        if(this.map.getZoom()===18) {
            var infoWindow = new AMap.InfoWindow({offset: new AMap.Pixel(0, -30)});
            let content = "<div style='max-height:200px;width:250px;'>";
            content += "<div style='margin-top:-7px;font-size:15px;font-weight:bold;color:#d9363e'>同定位企业</div>";
            content += "<div id='companyLists'style='yellow;max-height:100px;width:250px;overflow-y:auto'>"
            for(let i=0;i<e.markers.length;i++){
                let asd = JSON.stringify(e.markers[i].content)
                content += "<div  class='bottomGrayBox'style='font-size:13px;font-family:黑体;min-width:200px;cursor:pointer' onclick= detailDispaly('"+asd+"')>"+e.markers[i].content.enterpriseName+"</div>";
            }
            content += "</div>";
            content += "</div>";
            infoWindow.setContent(content);

            infoWindow.open(this.map, e.lnglat);

        }
    }

    detailDispaly =(item)=>{
        let content = JSON.parse(item)

        if(content){
            this.setState({
            detailDisplay:"inline",
            enterpriseId:content.enterpriseId,
            propagandaEnclosure:JSON.parse(content.propagandaEnclosure||JSON.stringify([])),
            // propagandaEnclosure:content.propagandaEnclosure,
            enterpriseName:content.enterpriseName,
            legalPerson:content.legalPerson,
            cantactWay:content.cantactWay,
            idNumber:content.idNumber,
            registeredAddress:content.registeredAddress,
        })
        }
    }
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
                        marker.on('click', this.setState({detailDisplay:"inline"}));
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

        this.props.transferValue(value);
        this.setState({detailDisplay:"none"})
    }
    toGaodeLocation=()=>{
        const w=window.open('about:blank');
        w.location.href='https://www.amap.com/search?query='+this.state.companyAddress
    }
    // baseInfo=()=>{
    //     axios.ajax({
    //         url:'/supervision/enterprise/getById',
    //         data:{
    //             params:{
    //                id:this.state.enterpriseId
    //             }
    //         }
    //     }).then((res)=>{
    //         if(res.status =='success'){
    //             this.setState({
    //                 isVisible:true,
    //             })
    //             let data = res.data;
    //             this.props.changeEnterprise({...data,
    //                 propagandaEnclosure:JSON.parse(data.propagandaEnclosure||JSON.stringify([])),
    //                 businessLicensePhoto:JSON.parse(data.businessLicensePhoto||JSON.stringify([])),
    //                 foodBusinessPhotos:JSON.parse(data.foodBusinessPhotos||JSON.stringify([])),
    //                 smallCaterPhotos:JSON.parse(data.smallCaterPhotos||JSON.stringify([])),
    //                 smallWorkshopPhotos:JSON.parse(data.smallWorkshopPhotos||JSON.stringify([])),
    //                 foodProducePhotos:JSON.parse(data.foodProducePhotos||JSON.stringify([])),
    //                 drugsBusinessPhotos:JSON.parse(data.drugsBusinessPhotos||JSON.stringify([])),
    //                 drugsProducePhotos:JSON.parse(data.drugsProducePhotos||JSON.stringify([])),
    //                 cosmeticsUsePhotos:JSON.parse(data.cosmeticsUsePhotos||JSON.stringify([])),
    //                 medicalProducePhotos:JSON.parse(data.medicalProducePhotos||JSON.stringify([])),
    //                 medicalBusinessPhotos:JSON.parse(data.medicalBusinessPhotos||JSON.stringify([])),
    //                 industrialProductsPhotos:JSON.parse(data.industrialProductsPhotos||JSON.stringify([])),
    //                 publicityPhotos:JSON.parse(data.publicityPhotos||JSON.stringify([])),
    //                 certificatePhotos:JSON.parse(data.certificatePhotos||JSON.stringify([])),
    //                 otherPhotos:JSON.parse(data.otherPhotos||JSON.stringify([]))
    //             });
    //         }
    //     })
    // }
    toNav2=()=>{
        //  axios.ajax({

    }
    toNav3=()=>{

    }


    render() {
        const modal=(<Modal
            title="企业信息"
           visible={this.state.isVisible}
           destroyOnClose
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
             <Add type={"detail"}/>
       </Modal>)
        return (
            <div>
                <div id="container" style={{width: "100%", height: "620px"}}></div>
                <div id="input-card">
                    <div style={{height:"25px",background: "#000", color: "#99FFFF",padding:"2px"}}>
                        &nbsp;&nbsp;企业定位坐标</div>
                    <div className="input-item">
                        <span className="locationTitle">&nbsp;&nbsp;个&nbsp;&nbsp;&nbsp;&nbsp;体</span>：
                        新增&nbsp;<img className="smallImg" alt="" src={i1}/>&nbsp;&nbsp;
                        正常&nbsp;<img className="smallImg" alt="" src={i2}/>&nbsp;&nbsp;
                        异常&nbsp;<img className="smallImg" alt="" src={i3}/>
                    </div>
                    <div className="input-item">
                        <span className="locationTitle">&nbsp;&nbsp;公&nbsp;&nbsp;&nbsp;&nbsp;司</span>：
                        新增&nbsp;<img className="smallImg" alt="" src={c1}/>&nbsp;&nbsp;
                        正常&nbsp;<img className="smallImg" alt="" src={c2}/>&nbsp;&nbsp;
                        异常&nbsp;<img className="smallImg" alt="" src={c3}/>
                    </div>
                    <div className="input-item">
                        <span className="locationTitle">&nbsp;&nbsp;合作社</span>：
                        新增&nbsp;<img className="smallImg" alt="" src={h1}/>&nbsp;&nbsp;
                        正常&nbsp;<img className="smallImg" alt="" src={h2}/>&nbsp;&nbsp;
                        异常&nbsp;<img className="smallImg" alt="" src={h3}/>
                    </div>
                    <div className="input-item">
                        <span className="locationTitle">&nbsp;&nbsp;其&nbsp;&nbsp;&nbsp;&nbsp;他</span>：
                        新增&nbsp;<img className="smallImg" alt="" src={q1}/>&nbsp;&nbsp;
                        正常&nbsp;<img className="smallImg" alt="" src={q2}/>&nbsp;&nbsp;
                        异常&nbsp;<img className="smallImg" alt="" src={q3}/>
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
                                <img src={nav2} onClick={this.toNav2}  width='30px' height='30px' alt=''/>&nbsp;&nbsp;
                                <img src={nav3} onClick={this.toNav3}  width='30px' height='30px' alt=''/>&nbsp;&nbsp;
                                <img src={nav4} onClick={this.toGaodeLocation}  width='30px' height='30px' alt=''/>&nbsp;&nbsp;
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}
export default Map;