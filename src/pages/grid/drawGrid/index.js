import React from 'react'
import './drawtest.css'
import {Row, Col, Button, Modal, message, Tree} from 'antd'
import {Saveform1} from './saveform'
import {unitName} from  '../../../axios/commonSrc'
// import {Form1} from './savePointsForm'
import { commonUrl } from "../../../axios/commonSrc";
import Utils from "../../../utils";
import connect from "react-redux/es/connect/connect";
import axios from "../../../axios";
const AMap=window.AMap;
const {  DirectoryTree,TreeNode } = Tree;
let overlays=[];
let points=[];
let StandardGrid=[];
let polylineEditor;
let TreeArea=[]
@connect(
    state=>({
        areaList:state.areaList
    })
)
class DrawTest extends React.Component{
    constructor(props){
        super(props);
        this.state={
            polygon:[],
            points:[],
            visiable:false,
            gridData:[]
        }
    }
    componentDidMount() {
        this.map = new AMap.Map("container", {
            center: [116.434381, 39.898515],
            zoom: 13,
            resizeEnable: true,
        });

        var district =unitName;
        var polygons=[];
        this.drawBounds(district,polygons)
        this.getdata();
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
                    if (bounds) {
                        for (var i = 0, l = bounds.length; i < l; i++) {
                            //生成行政区划polygon
                            var polygon = new AMap.Polygon({
                                strokeWeight: 1,
                                path: bounds[i],
                                fillOpacity: 0,
                                fillColor: '#80d8ff',
                                strokeColor: '#0091ea'
                            });
                            polygons.push(polygon);
                        }
                    }
                    that.map.add(polygons);
                    that.map.setFitView(polygons);//视口自适应
                })
            })
        })
    }
    drawPolygon=()=>{
        let that=this;
        AMap.service('AMap.MouseTool', function () {//回调函数
            let mouseTool = new AMap.MouseTool(that.map);//监听draw事件可获取画好的覆盖物
            mouseTool.on('draw',function(e){
                overlays.push(e.obj);
                console.log(e.obj)
                that.save()
            });
            mouseTool.polygon({
                strokeColor:'#80d8ff'
                //同Polyline的Option设置
            });
        })
    };
    bind=(e)=>{
        console.log(e)
    }
    draw=(path)=>{
        let i=overlays.length;
        overlays[i] = new AMap.Polygon({
            strokeWeight: 1,
            path: path,
            fillOpacity: 0.4,
            fillColor: '#80d8ff',
            strokeColor: '#0091ea'
        });
        AMap.event.addDomListener(overlays[i], 'click', this.bind);
        this.map.add(overlays[i])
    }
    clear=()=>{
        // for (let i=0,l=overlays.length;i<l;i++) {
        this.map.remove(overlays)
        // }
        //this.map.clearMap();
    };
    save=()=>{
        let l=overlays.length;
        this.setState({
            polygon:overlays[l-1].getPath(),
            visible: true,
        })
    };
    getdata=()=>{
        axios.ajax({
            url:"/grid/grid/getAll",
            data: {
                params:{}
            }
        }).then((res)=>{
            if(res.status == "success"){
                this.setState({
                    gridData:res.data
                })
            }
        })
    }
    onSelect = (keys, event) => {
        let value = this.state.gridData.find((item)=>(item.areaId==keys))
        console.log(value)
        if (value!==undefined&&value.areaId>1){
            let le=value.level.split(".").length;
            if (le==2) {
                TreeArea.push(value.areaId)
            }
            let TreeL=TreeArea.length;
            if (TreeL>=2&&TreeArea[TreeL-1]!==TreeArea[TreeL-2]){
                this.clear()
            }
            let name=value.mapName;
            let id=value.areaId;
            let remark1=value.polygon.split(",");
            let path=[];
            for(let i=0,l=remark1.length;i<l/2;i++){
                let p=[JSON.parse(remark1[2*i+1]),JSON.parse(remark1[2*i])]
                path.push(p)
            }
            let l=overlays.length;
            overlays[l] = new AMap.Polygon({
                strokeWeight: 1,
                path: path,
                fillOpacity: 1,
                fillColor: value.color,
                strokeColor: '#0091ea'
            });
            this.map.add(overlays[l]);
            if (le===2) {this.map.setFitView(overlays[l]);}
            // this.map.setZoom(14);
            this.setState({
                areaId:keys,
                state:'alter',
                ColorKey:value.color,
                BorderKey:value.border
            })
        }else if(value!==undefined&&value.areaId===1){
            this.getdata1(1)
        } else {
            this.setState({
                areaId:keys,
                state:'add'
            })
        }
    };
    getdata1=(id)=>{
        axios.ajax({
            url:"/grid/grid/getByParentId",
            data: {
                params:{id:id}
            }
        }).then((res)=>{
            if(res.status == "success"){
                if(res.data.length>0){
                    res.data.map((item,index)=>{
                        let id=item.areaId;
                        this.changeToPoints(item);
                    })
                }
            }
        })
    }
    changeToPoints=(data)=>{
        let point=data.center.split(",")
        let name=data.name;
        let color=data.color;
        let areaid=data.areaId
        let point1=[JSON.parse(point[1]),JSON.parse(point[0])]
        let remark1=data.polygon.split(",");
        let path=[];
        for(let i=0,l=remark1.length;i<l/2;i++){
            let p=[JSON.parse(remark1[2*i+1]),JSON.parse(remark1[2*i])]
            path.push(p)
        }
        let polygon = new AMap.Polygon({
            path:path,
            strokeColor: '#0091ea', //线颜色
            strokeOpacity: 1,  //线透明度
            strokeWeight: 1,  //线粗细度
            fillColor: color,  //填充颜色
            fillOpacity: 0.2, //填充透明度
            bubble:true,
            lineJoin:'2px',
            mapName:name,
            areaId:areaid
        });
        this.map.add(polygon);
        // polygon.on("click",this.getIn)
        // this.addGridLabel(color,name,point1);
        // this.addGridLabel(path);
    };
    edit=()=>{
        let that=this
        let l=overlays.length
        this.map.plugin(["AMap.PolyEditor"],function(){
            // 实例化多边形编辑器，传入地图实例和要进行编辑的多边形实例
            polylineEditor = new AMap.PolyEditor(that.map, overlays[l-1]);
            // 开启编辑模式
            polylineEditor.open();
            polylineEditor.on('end', function(event) {
                overlays.push(event.target);// event.target 即为编辑后的折线对象
                let l=overlays.length;
                that.setState({
                    polygon:overlays[l-1].getPath(),
                    visible: true,
                })
            })
        });
    }
    endEdit=()=>{
        polylineEditor.close();
    }
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
    render() {
        let modal=(<Modal
            title="添加网格信息"
            visible={this.state.visible}
            onOk={()=>this.setState({visible: false,})}
            onCancel={()=>this.setState({visible: false,})}
            centered
            destroyOnClose
            footer={false}
        >
            <Saveform1 data={this.state.polygon}
                       areaId={this.state.areaId}
                       state={this.state.state}
                       border={this.state.BorderKey}
                       color={this.state.ColorKey}
                       cancelModal={()=>{this.setState({visible:false})}}/>
        </Modal>)
        return(
            <Row>
                <Col span={5}>
                    <div style={{overflowY: "scroll",height:"800px" }}>
                    <DirectoryTree onSelect={this.onSelect}>
                        {this.renderTreeNodes(this.props.areaList||[])}
                    </DirectoryTree>
                    </div>
                </Col>
                <Col span={19}>
                    <div style={{position:'relative'}}>
                        <div id={'container'} className={'container'} style={{width:'1200px',height:'700px'}}></div>
                        <div className='drawTest' id={'drawTest'}>
                            <Row>
                                <Col span={4} offset={1}><Button onClick={this.drawPolygon}>绘制</Button></Col>
                                <Col span={4}  offset={1}><Button onClick={this.edit}>编辑</Button></Col>
                                <Col span={6}  offset={1}><Button onClick={this.endEdit}>结束编辑</Button></Col>
                                <Col span={4}  offset={1}><Button id={'clear'} onClick={this.clear}> 清除</Button></Col>
                                {/*<Col span={6}><Button id={'close'}>关闭绘制</Button></Col>*/}
                            </Row>
                        </div>
                        {modal}
                    </div>
                </Col>
            </Row>
        )
    }
}
export default DrawTest