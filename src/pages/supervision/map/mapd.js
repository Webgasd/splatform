import * as React from "react";
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
import { message } from 'antd';
// import {fetchPost1} from "../../../static/util/fetch";
const AMap = window.AMap;

export default class mapd extends React.Component {
    state = {
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
        companyPic:cp,
        companyName:"东营区荣欣超市有限公司",
        companyBoss:"王小二",
        companyTel:"1554466778",
        companyId:"234239084JK9w403",
        companyAddress:"东营市东营区上独领上可上书法家深刻理解的0923号",
        detailDisplay:"none",
        requestLoading: true,
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
        AMap.plugin('AMap.Geocoder', function(){
            this.geocoder = new AMap.Geocoder({
            city: "370500", //城市设为东营
            });
        });
       

        // this.setData(global.constants.mapData);
       //  let params={}
       //  fetchPost1("http://localhost:8080/back/grid/points/getSmilePoints1",params)
       //      .then(
       //          res => this.setData(res)
       //      ).catch(e => console.log(e))
       //      .finally(() => {
       //          this.setState({
       //              requestLoading: false
       //          })
       //      })



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
        if(searchType=="1"){
            this.detailDispaly({});
        }
        let marker = new AMap.Marker();
        this.geocoder.getLocation(address, (status, result)=> {
            if (status === 'complete' && result.geocodes.length) {
                var lnglat = result.geocodes[0].location
                marker.setPosition(lnglat);
                this.map.setFitView(marker);
            }else{
                message.info('根据地址查询位置失败');
            }
        })
    }
    markerClick = (e) => {
        if(this.map.getZoom()===18) {
            alert(e.target.makers)
            var infoWindow = new AMap.InfoWindow({offset: new AMap.Pixel(0, -30)});
            let content = "<div style='max-height:200px;width:250px;'>";
            content += "<div style='margin-top:-7px;font-size:15px;font-weight:bold;color:#d9363e'>同定位企业</div>";
            content += "<div id='companyLists'style='yellow;max-height:100px;width:250px;overflow-y:auto'>"

            // content+="<div class='bottomGrayBox'style='font-size:13px;font-family:黑体;min-width:200px'>" + e.target.content.enterpriseName + "</div>"
            content += "<div  class='bottomGrayBox'style='font-size:13px;font-family:黑体;min-width:200px'>东营企业1</div>";
            content += "<div class='bottomGrayBox'style='font-size:13px;font-family:黑体;min-width:200px'>东营企业2</div>";
            content += "<div class='bottomGrayBox'style='font-size:13px;font-family:黑体;min-width:200px'>东营企业2</div>";
            content += "<div class='bottomGrayBox'style='font-size:13px;font-family:黑体;min-width:200px'>东营企业2</div>";
            content += "<div class='bottomGrayBox'style='font-size:13px;font-family:黑体;min-width:200px'>东营企业2</div>";
            content += "</div>";
            content += "</div>";
            infoWindow.setContent(content);
           // this.setState({detailDisplay: "inline"})
            let inputs = document.querySelectorAll(".bottomGrayBox");
            inputs.forEach((list)=> {
                list.onClick = ()=>alert();
            });
            infoWindow.open(this.map, e.lnglat);

        }
    }
    detailDispaly =(item)=>{
        this.setState({detailDisplay:"inline"})
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
    toNav1=()=>{

    }
    toNav2=()=>{

    }
    toNav3=()=>{

    }


    render() {
        return (
            <div>
                <div id="container" style={{width: "1010px", height: "620px"}}></div>
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
                    <div className={"bottomGrayBox"}>&nbsp;&nbsp;<img src={detailPic}/>数据信息</div>
                    <div style={{display:this.state.detailDisplay}}>
                        <img src={this.state.companyPic} width={"300px"} height={"150px"}/>
                        <div className={"bottomGrayBox"} style={{fontSize: "18px",fontWeight:"bold"}}>&nbsp;&nbsp;{this.state.companyName}</div>
                        <div className={"bottomGrayBox"} >
                            法&nbsp;定&nbsp;代&nbsp;表&nbsp;人：{this.state.companyBoss}<br/>
                            联&nbsp;&nbsp;系&nbsp;&nbsp;&nbsp;电&nbsp;&nbsp;话：{this.state.companyTel}<br/>
                            统一信用代码：{this.state.companyId}<br/>
                            <div style={{float: "left"}}>企&nbsp;&nbsp;业&nbsp;&nbsp;&nbsp;地&nbsp;&nbsp;址：</div>
                                <div style={{paddingLeft:"100px",width: "290px"}}>{this.state.companyAddress}</div>
                            <div style={{height:"10px"}}></div>
                            <div style={{textAlign: "right"}}>
                                <img src={nav1} onClick={this.toNav1} width='30px' height='30px'/>&nbsp;&nbsp;
                                <img src={nav2} onClick={this.toNav2}  width='30px' height='30px'/>&nbsp;&nbsp;
                                <img src={nav3} onClick={this.toNav3}  width='30px' height='30px'/>&nbsp;&nbsp;
                                <img src={nav4} onClick={this.toGaodeLocation}  width='30px' height='30px'/>&nbsp;&nbsp;
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}
