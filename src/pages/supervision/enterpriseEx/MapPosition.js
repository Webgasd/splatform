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
        EnterpriseId:this.props.enterpriseId
    }
    
    changeInput=(value,option)=>{
        let input = {...this.props.input,[option]:value}
        this.props.changeEnterprise(input);
    }
    componentDidMount () {
        this.map = new AMap.Map('mapContainer', {
            center:[118.679394,37.419493],
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
                let address=this.props.input.registeredAddress
                console.log(address)
                geoCode(address);
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
                        <td colSpan={3}><Input placeholder={"请输入企业名称"} value={formData.enterpriseName} disabled={checkStatus}/></td>
                    </tr>
                    <tr>
                        <td>企业默认定位<span style={{color:'#FF3300'}}>*</span></td>
                        <td colSpan={3}><Input value={formData.registeredAddress}  placeholder={"企业住所或经营场所地址"} disabled={checkStatus}/></td>
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
                            <div className='commonEnterpriseBoxHead'>数据定位</div>
                            <table>
                                
                               <Radio.Group style={{width:'100%'}} value={formData.gpsFlag}
                               onChange={(e)=>this.changeInput(e.target.value,"gpsFlag")}  disabled={checkStatus}>
                                <tbody>
                                    <tr>
                                        <td rowSpan={2}>选择定位方式<span style={{color:'#FF3300'}}>*</span></td>
                                        <td style={{textAlign:"left",width:'80%'}}><Radio value={0} >使用默认地址定位</Radio> </td>
                                    </tr>
                                    <tr>
                                        <td style={{textAlign:"left"}}><Radio value={1} >使用经纬度定位</Radio></td>
                                    </tr>
                                </tbody>
                               </Radio.Group>
                            </table>

                            <table style={{marginTop:-5}}>
                               <tbody>
                                <tr>
                                    <td>经纬度</td>
                                    <td><Input placeholder={"请输入经纬度"} /></td>
                                </tr>
                                </tbody>
                            </table>
                            </Row>
                            <Row>
                            <div className='commonEnterpriseBoxHead'>辅助搜索</div>
                            <table>
                                <tbody>
                                <tr>  
                                    <td><Input style={{width:'80%'}} placeholder={"请输入位置或企业名称"}/><Button style={{color:'#558ff2'}}>搜索</Button></td>
                                    
                                </tr>
                                </tbody>
                            </table>
                            </Row>
                        </Col>
                        <Col span={2}></Col>
                        <Col span={12}>
                {/* *******************************以下为旧版mapPosition************** */}
                            {/* <Row> */}
                                {/*<Col span={6}>*/}
                                    {/*<Row>所填地址:</Row>*/}
                                    {/*<Row>{this.state.address}</Row>*/}
                                    {/*<Row> 新定位的地址:</Row>*/}
                                    {/*<Row> {this.state.newAddress} </Row>*/}
                                    <Row>新定位的经纬度：<br/>{this.state.newPoint}</Row>
                                {/*</Col>*/}
                                <Col span={18}>
                                    <input type="button" value="修改保存" onClick={()=>this.save()}/>
                                    <div id={"mapContainer"} style={{width:400,height:240}}/>
                                </Col>
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
