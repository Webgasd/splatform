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
    }
  
    changeInput=(value,option)=>{
        let input = {...this.props.input,[option]:value}
        this.props.changeEnterprise(input);
    }
    getMap = (address,option,type)=>{
        
        this.map = new AMap.Map('mapContainer', {
            center:[118.680936,37.440335],
            zoom:12,
            resizeEnable: true
        });
        let geocoder,marker;
        let that=this;

        if(option === "default"&& type != "detail"){
            that.changeInput(0,"gpsFlag")
            
            AMap.plugin('AMap.Geocoder', function() {
                geocoder = new AMap.Geocoder({
                    // city 指定进行编码查询的城市，支持传入城市名、adcode 和 citycode
                    // city: '东营'
                });
               
                geocoder.getLocation(address, function(status, result) {
                    if (status === 'complete' && result.info === 'OK') {
                        let lnglat=[]
                        lnglat = result.geocodes[0].location;
                        message.success("定位成功")
                        marker = new AMap.Marker({
                            position: lnglat,   // 经纬度对象，也可以是经纬度构成的一维数组[116.39, 39.9]
                            draggable:false
                        });
                        that.map.add(marker);
                        that.map.setFitView(marker)
                        that.changeInput('',"location")
                    }else {
                         message.error("地址有误，请输入详细地址并点击默认定位按钮刷新地图")
                    }

                })
            })
        }

        if(option === "manual"&& type != "detail"){
            that.changeInput(1,"gpsFlag")
                if(that.props.input.location){
                   let lnglat = that.props.input.location.split(',')
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

                }else{
                    AMap.plugin('AMap.Geocoder', function() {
                    geocoder = new AMap.Geocoder({
                        // city 指定进行编码查询的城市，支持传入城市名、adcode 和 citycode
                        // city: '东营'
                    });
                    geocoder.getLocation(address, function(status, result) {
                        if (status === 'complete' && result.info === 'OK') {
                            let lnglat = result.geocodes[0].location;
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
                            let lnglat = [118.680936,37.440335]
                            that.changeInput(lnglat.join(','),"location")
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
                        }
                     })
                    })
                }
        }
        if(option === "input"&& type != "detail"){
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
        // if(option === "search"){

        //     AMap.service(["AMap.PlaceSearch"], function() {
        //         //构造地点查询类
        //         var placeSearch = new AMap.PlaceSearch({ 
        //             map: that.map, // 展现结果的地图实例
                    
        //             city: "东营", // 兴趣点城市
                  
        //         });
        //         //关键字查询
        //         placeSearch.search(address, function (status, result) {
        //             console.log(result)
        //             // 查询成功时，result即对应匹配的POI信息
        //          })
        //     });
        // }
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
                        <td>市场主体名称</td>
                        <td colSpan={3}><Input placeholder={"请输入企业名称"} value={formData.enterpriseName} onChange={(e)=>this.changeInput(e.target.value,"enterpriseName")} disabled={checkStatus}/></td>
                    </tr>
                    <tr>
                        <td>企业默认定位<span style={{color:'#FF3300'}}>*</span></td>
                        <td colSpan={3}><Input value={formData.registeredAddress} onChange={(e)=>this.changeInput(e.target.value,"registeredAddress")} placeholder={"企业住所或经营场所地址"} disabled={checkStatus}/></td>
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
                                            <Button onClick={()=>this.getMap(formData.registeredAddress,"detail",this.props.type)}>查看企业定位</Button>:
                                            <div onClick={()=>this.getMap(formData.registeredAddress,"default",this.props.type)} 
                                                className={formData.gpsFlag===0?'mapOnClick':'mapNoClick'}>使用默认地址定位
                                            </div>}
                                        {/* <div onClick={()=>this.getMap(formData.registeredAddress,"default",this.props.type)} 
                                        className={formData.gpsFlag===0?'mapOnClick':'mapNoClick'}>使用默认地址定位 </div>  */}
                                    </td>
                                    {/* <td style={{display:(this.props.type=='detail'?"block":"none"),textAlign:"left"}}>
                                        <Button onClick={()=>this.getMap(formData.registeredAddress,"detail",this.props.type)}>查看企业定位</Button>
                                    </td> */}
                                </tr>
                                <tr>
                                    <td style={{display:(this.props.type=='detail'?"none":"block")}}>
                                        <div onClick={()=>this.getMap(formData.registeredAddress,"manual",this.props.type)} 
                                         className={formData.gpsFlag===1?'mapOnClick':'mapNoClick'}>使用经纬度定位</div>
                                    </td>
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
                                    <td><Input value={this.state.searchAddress} onChange={(e)=>this.handleSearchInput(e.target.value)} style={{width:'80%'}} placeholder={"请输入位置或企业名称"}/>
                                        <Button onClick={()=>this.getMap(this.state.searchAddress,"search",this.props.type)} style={{color:'#558ff2',marginLeft:3}}>搜索</Button>
                                    </td>
                                    
                                </tr>
                                </tbody>
                            </table>
                            </Row>
                        </Col>
                        <Col span={1}></Col>
                        <Col span={13} style={{ border: '1px solid #ddd'}}>
                {/* *******************************以下为旧版mapPosition************** */}
                            {/* <Row> */}
                                {/*<Col span={6}>*/}
                                    {/*<Row>所填地址:</Row>*/}
                                    {/*<Row>{this.state.address}</Row>*/}
                                    {/*<Row> 新定位的地址:</Row>*/}
                                    {/*<Row> {this.state.newAddress} </Row>*/}
                                    {/* <Row>新定位的经纬度：<br/>{this.state.newPoint}</Row> */}
                                {/*</Col>*/}
                                
                                    {/* <input type="button" value="修改保存" onClick={()=>this.save()}/> */}
                                    <div id={"mapContainer"} style={{height:260}}/>
                                
                            {/* </Row> */}
                {/* *********************** */}
                        </Col>
                    </Row>
                </div>
            </div>
        )
    }
}
export default App;