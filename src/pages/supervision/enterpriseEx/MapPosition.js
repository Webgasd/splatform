import React from 'react';
import {Col, message, Row,Radio,Button,Input} from "antd";
import axios from "../../../axios";
import connect from "react-redux/es/connect/connect";
import {changeEnterprise} from "../../../redux/action";

const AMap=window.AMap;


@connect(
    state=>({
        input:state.enterprise,
        industryList:state.industryList,
        areaList:state.areaList
    }),
    {
        changeEnterprise,
    }
)
 class App extends React.Component{
    state={
        AreaId:this.props.input.grid,
        EnterpriseId:this.props.enterpriseId,
    }

    componentDidMount () {
        this.map = new AMap.Map('mapContainer', {
            center:[118.58215,37.44878],
            zoom:12,
            resizeEnable: true
        });
    }
  
    changeInput=(value,option)=>{
        let input = {...this.props.input,[option]:value}
        this.props.changeEnterprise(input);
    }
    getMap = (address,option,type)=>{
       
        let geocoder,marker;
        let that=this;

        if(option === "default"&& type != "detail"){
            that.changeInput(0,"gpsFlag")
            
            AMap.plugin('AMap.Geocoder', function() {
                geocoder = new AMap.Geocoder({
                    // city 指定进行编码查询的城市，支持传入城市名、adcode 和 citycode
                     city: '东营'
                });
               
                geocoder.getLocation(address, function(status, result) {
                    if (status === 'complete' && result.info === 'OK') {
                        that.map.clearMap();
                        let lnglat=[]
                        lnglat = result.geocodes[0].location;
                        message.success("默认定位成功")
                        marker = new AMap.Marker({
                            position: lnglat,   // 经纬度对象，也可以是经纬度构成的一维数组[116.39, 39.9]
                            draggable:false
                        });
                        that.map.add(marker);
                        that.map.setFitView(marker)
                        that.changeInput('',"location")
                    }else {
                        that.map.clearMap();
                         message.error("地址有误，请输入详细地址并点击默认定位按钮刷新地图")
                    }

                })
            })
        }

        if(option === "manual"&& type != "detail"){
            that.changeInput(1,"gpsFlag")
                if(that.props.input.location){
                    that.map.clearMap();
                   let lnglat = that.props.input.location.split(',')
                    marker = new AMap.Marker({
                        position: lnglat,   // 经纬度对象，也可以是经纬度构成的一维数组[116.39, 39.9]
                        draggable:true
                    });
                    that.map.add(marker);
                    that.map.setFitView(marker)
                    message.info("可以拖动地图标记点完成手动定位")
                    marker.on("dragend",function (e) {
                    message.success("经纬度修改成功")
                    that.changeInput((e.lnglat.lng+','+e.lnglat.lat),"location")
                    // that.getAddress(point)///根据拖动得到的点获取地址
                    })

                }else{
                    AMap.plugin('AMap.Geocoder', function() {
                    geocoder = new AMap.Geocoder({
                        // city 指定进行编码查询的城市，支持传入城市名、adcode 和 citycode
                         city: '东营'
                    });
                    geocoder.getLocation(address, function(status, result) {
                        if (status === 'complete' && result.info === 'OK') {
                            that.map.clearMap();
                            let lnglat = result.geocodes[0].location;
                            that.changeInput((lnglat.lng+','+lnglat.lat),"location")
                            marker = new AMap.Marker({
                                position: lnglat,   // 经纬度对象，也可以是经纬度构成的一维数组[116.39, 39.9]
                                draggable:true
                            });
                            that.map.add(marker);
                            that.map.setFitView(marker)
                            message.info("可以拖动地图标记点完成手动定位")
                            marker.on("dragend",function (e) {
                            message.success("经纬度修改成功")
                            that.changeInput((e.lnglat.lng+','+e.lnglat.lat),"location")
                            // that.getAddress(point)///根据拖动得到的点获取地址
                            })
                        }else {
                            that.map.clearMap();
                            let lnglat = [117.621274,35.523047]
                            that.changeInput(lnglat.join(','),"location")
                            marker = new AMap.Marker({
                                position: lnglat,   // 经纬度对象，也可以是经纬度构成的一维数组[116.39, 39.9]
                                draggable:true
                            });
                            that.map.add(marker);
                            that.map.setFitView(marker)
                            message.info("请拖动地图标记点完成手动定位")
                            marker.on("dragend",function (e) {
                            message.success("经纬度修改成功")
                            that.changeInput((e.lnglat.lng+','+e.lnglat.lat),"location")
                            // that.getAddress(point)///根据拖动得到的点获取地址
                            })
                        }
                     })
                    })
                }
        }
        if(option === "input"&& type != "detail"){
            that.map.clearMap();
            marker = new AMap.Marker({
                position: address.split(','),   // 经纬度对象，也可以是经纬度构成的一维数组[116.39, 39.9]
                draggable:true
            });
            that.map.add(marker);
            that.map.setFitView(marker)
            marker.on("dragend",function (e) {
                message.success("经纬度修改成功")
                that.changeInput((e.lnglat.lng+','+e.lnglat.lat),"location")
            })
        }

        if(type == "detail"){
            if(that.props.input.location&&that.props.input.gpsFlag == 1){
                let lnglat = that.props.input.location.split(',')
                marker = new AMap.Marker({
                    position: lnglat,   // 经纬度对象，也可以是经纬度构成的一维数组[116.39, 39.9]
                    draggable:false
                });
                that.map.add(marker);
                that.map.setFitView(marker)
                message.success("已标记手动定位")
            }else if(that.props.input.position){
                let lnglat = that.props.input.position.split(',')
                marker = new AMap.Marker({
                    position: lnglat,   // 经纬度对象，也可以是经纬度构成的一维数组[116.39, 39.9]
                    draggable:false
                });
                that.map.add(marker);
                that.map.setFitView(marker)
                message.success("已标记默认定位")
            }else{
                message.error("无此企业定位")
            }
        }
        if(option === "search"){
            that.changeInput(1,"gpsFlag")

            AMap.plugin('AMap.Geocoder', function() {
                geocoder = new AMap.Geocoder({
                    // city 指定进行编码查询的城市，支持传入城市名、adcode 和 citycode
                     city: '东营'
                });
               
                geocoder.getLocation(address, function(status, result) {
                    if (status === 'complete' && result.info === 'OK') {
                        that.map.clearMap();
                        let lnglat = result.geocodes[0].location;
                        message.success("定位成功，可拖动定位点修改位置")
                        that.changeInput((lnglat.lng+','+lnglat.lat),"location")
                        marker = new AMap.Marker({
                            position: lnglat,   // 经纬度对象，也可以是经纬度构成的一维数组[116.39, 39.9]
                            draggable:true
                        });
                        that.map.add(marker);
                        that.map.setFitView(marker)
                        marker.on("dragend",function (e) {
                        message.success("经纬度修改成功")
                        that.changeInput((e.lnglat.lng+','+e.lnglat.lat),"location")
                        // that.getAddress(point)///根据拖动得到的点获取地址
                        })
                    }else {
                        that.map.clearMap();
                        message.error("未搜索到结果")
                    }

                })
            })
    }
}
    
    handleSearchInput=(value)=>{
        this.setState({
            searchAddress:value
        })

    }
    
    render() {
    
        const formData=this.props.input||{};
        const checkStatus = this.props.type=='detail'?true:false;
        return (
            <div>
                {/* 以下为基础定位 */}
                <div className='commonEnterpriseBox' style={{marginTop:20}}>
                <div className='permission-title-text'>企业基础定位</div>
                <table>
                    <tbody>
                    <tr>
                        <td style={{width:'18%'}}>市场主体名称</td>
                        <td><Input placeholder={"请输入企业名称"} value={formData.enterpriseName} onChange={(e)=>this.changeInput(e.target.value,"enterpriseName")} disabled={checkStatus}/></td>
                    </tr>
                    <tr>
                        <td>企业默认定位<span style={{color:'#FF3300'}}>*</span></td>
                        <td><Input value={formData.registeredAddress} onChange={(e)=>this.changeInput(e.target.value,"registeredAddress")} placeholder={"企业住所或经营场所地址"} disabled={checkStatus}/></td>
                    </tr>
                    </tbody>
                </table>
                </div>

                {/* 以下为定位修正 */}
                <div className='commonEnterpriseBox' style={{marginTop:40}}>     

                    <div className='permission-title-text'>企业定位修正</div>
                    <Row>
                        <Col span={10}>
                            <Row>
                            <div className='commonEnterpriseBoxHead3'>数据定位</div>
                            <table>
                            <tbody>
                                <tr>
                                    <td rowSpan={2} style={{width:'27%'}}>{this.props.type==='detail'?"查看企业定位":"选择定位方式"}<span style={{color:'#FF3300'}}>*</span></td>
                                    <td>
                                        {this.props.type=='detail'?
                                            <Button type="primary" onClick={()=>this.getMap(formData.registeredAddress,"detail",this.props.type)}>查看企业定位</Button>:
                                            <div onClick={()=>this.getMap(formData.registeredAddress,"default",this.props.type)} 
                                                className={formData.gpsFlag===0?'mapOnClick':'mapNoClick'}>使用默认地址定位
                                            </div>}
                                    </td>
                                </tr>
                                <tr>
                                    {this.props.type=='detail'?'':
                                    <td>
                                        <div onClick={()=>this.getMap(formData.registeredAddress,"manual",this.props.type)} 
                                            className={formData.gpsFlag===1?'mapOnClick':'mapNoClick'}>使用经纬度定位
                                         </div>
                                    </td>}
                                </tr>
                                <tr>
                                    <td>经纬度</td>
                                    <td style={{textAlign:'left'}}><Input style={{width:'75%'}} value={formData.location} onChange={(e)=>this.changeInput(e.target.value,"location")} disabled={checkStatus||formData.gpsFlag === 0} />
                                        <Button style={{color:'#558ff2',marginLeft:3}}  onClick={()=>this.getMap(formData.location,"input",this.props.type)} disabled={checkStatus||formData.gpsFlag === 0}>确定</Button>
                                    </td>
                                </tr>
                            </tbody>
                            </table>
                            </Row>
                            <Row style={{marginTop:5}}>
                            <div className='commonEnterpriseBoxHead3'>辅助搜索</div>
                            <table>
                                <tbody>
                                <tr>  
                                    <td><Input value={this.state.searchAddress} onChange={(e)=>this.handleSearchInput(e.target.value)} style={{width:'80%'}} placeholder={"请输入详细地址"} disabled={checkStatus}/>
                                        <Button onClick={()=>this.getMap(this.state.searchAddress,"search",this.props.type)} style={{color:'#558ff2',marginLeft:3}} disabled={checkStatus}>搜索</Button>
                                    </td>
                                    
                                </tr>
                                </tbody>
                            </table>
                            </Row>
                        </Col>
                        <Col span={1}></Col>
                        <Col span={13} style={{ border: '1px solid #ddd'}}>

                            <div id={"mapContainer"} style={{height:260}}/>
                            
                        </Col>
                    </Row>
                </div>
            </div>
        )
    }
}
export default App;