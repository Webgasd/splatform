import React from 'react';
import {Row,Col,message}from 'antd'
import {commonUrl} from "../../../axios/commonSrc";

let marker='';
const AMap=window.AMap;
class AddLocation extends React.Component{
    constructor(props){
        super(props)
        this.state={
            address:this.props.address,
            id:this.props.id,
            newAddress:'',
            newPoint:''
        }
    }
    componentDidMount() {
        this.map = new AMap.Map("mapLocation", {
            resizeEnable: true
        });
        let geocoder,marker;
        let that=this;
        function geoCode() {
            AMap.plugin('AMap.Geocoder', function() {
                geocoder = new AMap.Geocoder({
                    // city 指定进行编码查询的城市，支持传入城市名、adcode 和 citycode
                    city: '济南'
                });
                let lnglat=[]
                geocoder.getLocation(that.state.address, function(status, result) {
                    console.log(result)
                    if (status === 'complete' && result.info === 'OK') {
                         lnglat = result.geocodes[0].location;
                        message.success("定位成功")
                    }else {
                        lnglat = [117.076455,36.666412];
                        message.error("定位不准，请重新定位")
                    }
                    marker = new AMap.Marker({
                        position: lnglat,   // 经纬度对象，也可以是经纬度构成的一维数组[116.39, 39.9]
                        draggable:true
                    });
                    that.map.add(marker);
                    that.map.setFitView(marker)
                    marker.on("dragend",function (e) {
                        console.log(e)////拖拽后的点位置
                        let point=e.lnglat
                        let point1=[];
                        point1.push(point.lat);
                        point1.push(point.lng);
                        let point2=point1.join(",");
                        that.setState({
                            newPoint:point2,
                        })
                        that.getAddress(point)///根据拖动得到的点获取地址
                    });
                })

            })
        }
        geoCode();
    }
    getAddress=(point)=>{
        let addresss='';
        let geocoder;
        let that=this;
        AMap.plugin('AMap.Geocoder', function() {
            geocoder = new AMap.Geocoder({
                // city 指定进行编码查询的城市，支持传入城市名、adcode 和 citycode
                city: '济南'
            });
            geocoder.getAddress(point, function (status, result) {
                if (status === 'complete' && result.info === 'OK') {
                    console.log(result.regeocode.formattedAddress)
                    addresss = result.regeocode.formattedAddress
                    that.setState({
                        newAddress:addresss
                    })
                }
            })
        })
    }
    save=()=>{
        const url=commonUrl+"/points/updatePoint?point="+this.state.newPoint+"&address="+this.state.newAddress+"&id="+this.state.id;
        fetch(url, {
            method : 'POST',
            mode:"cors",
            headers:{
                'Content-type':'application/json'
            },
        }).then(res =>res.json())
            .then(data=>{
               message.success("定位修改成功")
            })
    }
    render() {
        return(
            <Row>
                <Col span={6}>
                    <Row>所填地址:</Row>
                    <Row>{this.state.address}</Row>
                    <Row> 新定位的地址:</Row>
                    <Row> {this.state.newAddress} </Row>
                    <Row>新定位的经纬度：<br/>{this.state.newPoint}</Row>
                </Col>
                <Col span={18}>
                    <input type="button" value="修改保存" onClick={this.save}/>
                    <Row id={"mapLocation"} className={"mapLocation"} style={{width:'100%',height:'400px'}}/>
                </Col>
            </Row>
        )
    }
}
export default AddLocation