import React from 'react';
import {Col, message, Row} from "antd";
import {commonUrl} from "../../../axios/commonSrc";
import axios from "../../../axios";
const AMap=window.AMap;
export default class App extends React.Component{
    state={
        AreaId:this.props.AreaId,
        EnterpriseId:this.props.enterpriseId
    }
    componentDidMount () {
        this.map = new AMap.Map('mapContainer', {
            center:[117.000923,36.675807],
            zoom:12,
            resizeEnable: true
        });
        let geocoder,marker;
        let that=this;
        function geoCode(address) {
            AMap.plugin('AMap.Geocoder', function() {
                geocoder = new AMap.Geocoder({
                    // city 指定进行编码查询的城市，支持传入城市名、adcode 和 citycode
                    // city: '济南'
                });
                let lnglat=[]
                geocoder.getLocation(address, function(status, result) {
                    if (status === 'complete' && result.info === 'OK') {
                        lnglat = result.geocodes[0].location;
                        // message.success("定位成功")
                    }else {
                        lnglat = [117.076455,36.666412];
                         message.error("地址有误，请重新定位")
                    }
                    marker = new AMap.Marker({
                        position: lnglat,   // 经纬度对象，也可以是经纬度构成的一维数组[116.39, 39.9]
                        draggable:true
                    });
                    that.map.add(marker);
                    that.map.setFitView(marker)
                    marker.on("dragend",function (e) {
                        let point=e.lnglat
                        let point1=[];
                        point1.push(point.lng);
                        point1.push(point.lat);
                        let point2=point1.join(",");
                        that.setState({
                            newPoint:point2,
                        })
                        console.log(point2)
                        // that.getAddress(point)///根据拖动得到的点获取地址
                    });
                })

            })
        }
        function getEnterpriseAddress(){
            axios.ajax({
                url:'/supervision/enterprise/getById',
                data:{params:{id:that.state.EnterpriseId}}
            }).then((res)=>{
                if (res.status == "success") {
                    let address=res.data.registeredAddress
                    console.log(address)
                    geoCode(address);
                }
            })
        }
        axios.ajax({
            url:'/grid/points/getPointByEnterpriseId',
            data:{
                params:{id:this.state.EnterpriseId}
            }
        }).then((res)=>{
           if (res.status == "success") {
               if (res.data && res.data.point.length>0) {
                   let point=res.data.point
                   let point1=point.split(",")
                   marker = new AMap.Marker({
                       position: [JSON.parse(point1[0]),JSON.parse(point1[1])],   // 经纬度对象，也可以是经纬度构成的一维数组[116.39, 39.9]
                       draggable:true
                   });
                   that.map.add(marker);
                   that.map.setFitView(marker)
                   marker.on("dragend",function (e) {
                       let point=e.lnglat
                       let point1=[];
                       point1.push(point.lng);
                       point1.push(point.lat);
                       let point2=point1.join(",");
                       that.setState({
                           newPoint:point2,
                       })
                   });
               }else {
                   getEnterpriseAddress();
               }
           }else {
               getEnterpriseAddress();
           }
        })
    }
    save=()=>{
        axios.PostAjax({
            url:"/grid/points/addPoint",
            data:{
                params:{
                    areaId:this.state.AreaId,
                    enterpriseId:this.state.EnterpriseId,
                    point:this.state.newPoint
                }
            }
        }).then((res)=>{
            if(res.status=="success"){
               if (res.data.done == true) {
                   message.success("更新成功")
               }
            }
        })
    }
    render() {
        return (
            <Row>
                {/*<Col span={6}>*/}
                    {/*<Row>所填地址:</Row>*/}
                    {/*<Row>{this.state.address}</Row>*/}
                    {/*<Row> 新定位的地址:</Row>*/}
                    {/*<Row> {this.state.newAddress} </Row>*/}
                    <Row>新定位的经纬度：<br/>{this.state.newPoint}</Row>
                {/*</Col>*/}
                <Col span={18}>
                    <input type="button" value="修改保存" onClick={()=>this.save()}/>
                    <Row id={"mapContainer"} style={{width:700,height:400}}/>
                </Col>
            </Row>
        );
    }
}
