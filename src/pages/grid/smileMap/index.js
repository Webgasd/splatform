import React,{ Component } from 'react';
import axios from "../../../axios";
import Eat from "../../home/image/eat.png";
import connect from "react-redux/es/connect/connect";
import {changeEnterprise, clearEnterprise} from "../../../redux/action";
import A from "./image/A.png"
import B from "./image/B.png"
import C from "./image/C.png"
import Undefined from "./image/undefined.png"
import {Modal,Collapse,Botton,Input,Select,message} from "antd";
import InfoWindow from "../../home/govHome";
import Add from '../../supervision/enterpriseEx/Add';
import Button from "antd/lib/button";
import moment from 'moment'
import CorporateIcon from "../showGrid/image/弹窗地图定位图标.png";
import ToGaoDeMap from "../showGrid/image/icon_daohang-copy.png";
import CommonCheck from "../showGrid/image/dangan的副本 2.png";
import CheckView from "../showGrid/image/jiankong.png";
import BaseInfo from "../showGrid/image/qiye.png";
import './index.css'
import {commonUrl, unitName} from '../../../axios/commonSrc'
const AMap=window.AMap;
const { Panel } = Collapse;
const { Option } = Select;
let markers=[]
let cluster=[]
@connect(
    state=>({
        industryList:state.industryList,
    }),{
        clearEnterprise,
        changeEnterprise,
    }
)
class SmileMap extends Component{
    constructor(props){
        super(props)
        this.state={
            visiable:false,
            baseInfoVisible:false,
            PointData:[],
            grade:[],
            BaseInfo:[],
            AddressForGaoDe:'',
            searchEnterprise:''
        }
        window.getBaseInfo =()=>this.getBaseInfo();
        window.ToGaodeLocation =()=>this.ToGaodeLocation();
    }
    componentDidMount() {
        this.map = new AMap.Map('mapSmileContainer', {
            center:[117.000923,36.675807],
            zoom:12,
        });
        var district = unitName;
        var polygons=[];
        this.drawBounds(district,polygons)
        this.getdata()
    }
    getdata=()=>{
        axios.PostAjax({
            url:"/grid/points/getSmileAllFoodBu",

            }).then((res)=>{
                if(res.status == "success"){
                    this.addGridPoints(res.data)
                    this.setState({PointData:res.data})
                }
            })
    }
    addGridPoints=(data)=>{
        let l=markers.length
        markers[l]=[]
        let that=this;
        data.map((item,index)=>{
            let point=item.point;
             let point1=point.split(",");
            let grade=item.dynamic_grade
            let icon;
            if(grade=='s' || grade=='A'){icon=A}
            else if (grade=='a'|| grade=='B'){icon=B}
            else if(grade=='b'|| grade=='C'){icon=C}
            else {icon=Undefined}
            let p=new AMap.Marker({
                position: [JSON.parse(point1[0]),JSON.parse(point1[1])],
                icon: icon,
                enterpriseId:item.enterpriseId
            })
            AMap.event.addListener(p, 'click', function (e) {
                let id=e.target.w.enterpriseId;
                axios.ajax({
                    url:'/supervision/enterprise/getById',
                    data:{params:{id:id}}
                }).then((res)=>{
                    if(res.status =='success'){
                        that.setState({
                            // visible:true,
                            enterpriseId: id,
                            BaseInfo:res.data,
                            AddressForGaoDe:res.data.registeredAddress
                        })
                        let value=res.data
                        let info = [];
                        let start,end
                        for(var key in value){
                            that.props.industryList.map((item)=>{
                                if (item.remark == key && value[key] !== null) {
                                    start=value[key].startTime
                                    end=value[key].endTime
                                }
                            })}
                        let imagelist=JSON.parse(value.propagandaEnclosure||JSON.stringify([]));
                        let startTime=moment(start).format("YYYY-MM-DD")
                        let endTime=moment(end).format("YYYY-MM-DD")
                        info.push("<div class='content-window-card'><div class='title'>数 据 信 息</div>");
                        info.push("<div class='pic-dom'>");
                        if (imagelist&&imagelist.length>0){
                            info.push("<div class='pic'><img alt='example' src="+commonUrl+"/upload/picture/"+imagelist[0].response.data+"/></div>")
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
                        info.push("<div class='bottom-icon'><img src='"+BaseInfo+"'id='BaseInfo' onclick='getBaseInfo()'  width='40px' height='40px'/></div><Divider type=\"vertical\" />");
                        info.push("</div>");

                        let infoWindow = new AMap.InfoWindow({
                            content: info.join(""),  //使用默认信息窗体框样式，显示信息内容
                            offset: new AMap.Pixel(8, -25),
                        });
                        infoWindow.open(that.map, p.getPosition())
                       //  let data = res.data;
                       // that.props.changeEnterprise({...data,propagandaEnclosure:JSON.parse(data.propagandaEnclosure||JSON.stringify([]))});
                    }
                })
            });
            markers[l].push(p)
        });
        cluster[l]=[]
        this.map.plugin(["AMap.MarkerClusterer"],function() {
            cluster[l] = new AMap.MarkerClusterer(that.map,markers[l],{
                gridSize: 60,
                minClusterSize:5,
            });
        });
    };
    getBaseInfo=()=>{
        console.log(this.state.enterpriseId)
        axios.ajax({
            url: '/supervision/enterprise/getById',
            data: {
                params: {
                    id: this.state.enterpriseId
                }
            }
        }).then((res) => {
            if (res.status == 'success') {
                this.setState({
                    baseInfoVisible: true,
                    searchEmployee: this.state.enterpriseId
                })
                let data = res.data;
                this.props.changeEnterprise({
                    ...data,
                    propagandaEnclosure: JSON.parse(data.propagandaEnclosure || JSON.stringify([])),
                    businessLicensePhoto: JSON.parse(data.businessLicensePhoto || JSON.stringify([])),
                    foodBusinessPhotos: JSON.parse(data.foodBusinessPhotos || JSON.stringify([])),
                    smallCaterPhotos: JSON.parse(data.smallCaterPhotos || JSON.stringify([])),
                    smallWorkshopPhotos: JSON.parse(data.smallWorkshopPhotos || JSON.stringify([])),
                    foodProducePhotos: JSON.parse(data.foodProducePhotos || JSON.stringify([])),
                    drugsBusinessPhotos: JSON.parse(data.drugsBusinessPhotos || JSON.stringify([])),
                    drugsProducePhotos: JSON.parse(data.drugsProducePhotos || JSON.stringify([])),
                    cosmeticsUsePhotos: JSON.parse(data.cosmeticsUsePhotos || JSON.stringify([])),
                    medicalProducePhotos: JSON.parse(data.medicalProducePhotos || JSON.stringify([])),
                    medicalBusinessPhotos: JSON.parse(data.medicalBusinessPhotos || JSON.stringify([])),
                    industrialProductsPhotos: JSON.parse(data.industrialProductsPhotos || JSON.stringify([])),
                    publicityPhotos: JSON.parse(data.publicityPhotos || JSON.stringify([])),
                    certificatePhotos: JSON.parse(data.certificatePhotos || JSON.stringify([])),
                    otherPhotos: JSON.parse(data.otherPhotos || JSON.stringify([]))
                });
            }
        })
    }
    ToGaodeLocation=()=>{
        const w=window.open('about:blank');
        w.location.href='https://www.amap.com/search?query='+this.state.AddressForGaoDe
    }
    drawBounds(district,polygons) {
        let that=this;
        return new Promise((resolve,reject)=> {
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
                    if (bounds) {
                        for (var i = 0, l = bounds.length; i < l; i++) {
                            //生成行政区划polygon
                            var polygon = new AMap.Polygon({
                                strokeWeight: 1,
                                path: bounds[i],
                                fillOpacity: unitName=="临清市"?0.3:0,
                                fillColor: '#4fb8f5',
                                strokeColor: '#0091ea'
                            });
                            polygons.push(polygon);
                        }
                    }
                    that.map.add(polygons);
                    that.map.setFitView(polygons);//视口自适应
                    resolve(childrenListBounds) ;
                })
            })
        })
    }
    handleChange=(value)=>{
        this.setState({
            grade:value
        })
    }
    checkData=()=>{
        let {grade,PointData}=this.state
        let grade1=[]
        grade.forEach((item,index,arr)=>{
            if (item=="A") {
                grade1.push("s")
            }
            if (item=="B") {
                grade1.push("a")
            }
            if (item=="C") {
                grade1.push("b")
            }
        })
        console.log(grade1)
        let value=PointData.filter((item,index,self)=>{
            let l=grade.length
            if(l==0){
                return self
            }else if (l==1){
                return item.dynamic_grade==grade[0]||item.dynamic_grade==grade1[0]
            } else if (l==2){
                return item.dynamic_grade==grade[0]||item.dynamic_grade==grade[1]||item.dynamic_grade==grade1[0]||item.dynamic_grade==grade1[1]
            } else if (l==3){
                return item.dynamic_grade==grade[0]||item.dynamic_grade==grade[1]||item.dynamic_grade==grade[2]||item.dynamic_grade==grade1[0]||item.dynamic_grade==grade1[1]||item.dynamic_grade==grade1[2]
            }
        })
        this.clear()
         this.addGridPoints(value)
    }
    clear=()=>{
        // this.map.clearMap();
        cluster.map((item,index)=>{
            this.map.remove(item);
        })
    }
    searchEnterprise=()=>{
        let {searchEnterprise,PointData}=this.state
         if (this.state.searchEnterprise!=''){
             axios.ajax({
                 url:'/grid/points/getEnterpriseIdByName',
                 data:{params:{name:this.state.searchEnterprise}}
             }).then((res)=>{
                 if (res.status=="success"){
                     let id=res.data[0].id
                     let p=this.state.PointData.find((item)=>(item.enterpriseId==id))
                     this.showWindow(id,p)
                 }
             })
         }else {
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
                    that.props.industryList.map((item)=>{
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
                    offset: new AMap.Pixel(8, -25),
                });
                infoWindow.open(that.map,[JSON.parse(point1[0]),JSON.parse(point1[1])])
            }
        })
    }
    render() {
        const children = [<Option key={'A'}>A</Option>,
            <Option key={'B'}>B</Option>,
            <Option key={'C'}>C</Option>,
        ];
        const modal = (<Modal
            title="企业信息"
            visible={this.state.baseInfoVisible}
            destroyOnClose
            centered={true}
            width={1000}
            onCancel={() => {
                this.props.clearEnterprise();
                this.setState({
                    baseInfoVisible: false,
                })
            }}
            onOk={() => {
                this.handleSubmit()
            }}
        >
            <Add type={"edit"} searchEmployee={this.state.searchEmployee} />
        </Modal>)
        return (<div>
            <div style={{paddingBottom:'1%',marginRight:'5%',float:'right'}} >
                <Input style={{ width: 300 }}   placeholder="企业名称" onChange={(e)=>this.setState({searchEnterprise:e.target.value})}/>
                <Button style={{width:100,marginLeft:20}} type={"primary"} onClick={()=>this.searchEnterprise()}>查询</Button>
                <Select
                    mode="multiple"
                    style={{ width: 200,marginLeft:20 }}
                    placeholder="动态评级"
                    onChange={this.handleChange}
                >
                    {children}
                </Select>
                <Button style={{width:100,marginLeft:20}} type={"primary"} onClick={this.checkData} >查询</Button>
            </div>
            <div id='mapSmileContainer' style={{width:'100%',height:'800px'}}>
                {modal}
            </div>
        </div>);
    }
}
export default SmileMap