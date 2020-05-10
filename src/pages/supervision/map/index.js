import * as React from "react";
import Map from "./mapd";
import "./index.css";
import a0 from "./images/0.png";
import i1 from "./images/11.png";
import c1 from "./images/21.png";
import h1 from "./images/31.png";
import q1 from "./images/41.png";
import allPic from "./images/all.png";
import newPic from "./images/new.png";
import nomalPic from "./images/nomal.png";
import abnomalPic from "./images/abnomal.png";
import totalPic from "./images/total.png";
import searchPic from "./images/search.png";
import analysisPic from "./images/analysis.png";
//导入饼图
import 'echarts/lib/chart/pie'
import 'echarts/lib/component/tooltip'
import 'echarts/lib/component/title'
import 'echarts/lib/component/legend'
import 'echarts/lib/component/markPoint'
import { Input,Button } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
//import {fetchPost} from "../../../static/util/fetch";
import axios from "../../../axios";
import ReactEcharts from 'echarts-for-react'
const { Search } = Input;
export default class map extends React.Component{
    state={
        iCount:0,
        cCount:0,
        hCount:0,
        qCount:0,
        newCount:0,
        nomalCount:0,
        abnCount:0,
        data:[],
        requestLoading:true,
        position:"",
        searchType:1,

    }

    componentDidMount() {

        // let params={}
        // fetchPost("http://localhost:8080/back/grid/points/getSmilePoints1",params)
        //     .then(
        //         res => this.setData(res)
        //     )
        //     .catch(e => console.log(e))
        //     .finally(() => {
        //         this.setState({
        //             requestLoading: false
        //         })
        //     })
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
    changeData =()=>{}
    changeSearchType=(e)=>{
    this.setState({searchType:e.target.value});
}
    cp =()=>{
        this.Map.changePosition(this.state.searchType,this.state.position);
    }
    changeValue=(event)=>{
        this.setState({position:event.target.value})
    }
    onRef = (ref) => {
        this.Map = ref
    }
    render(){
        const {iCount,cCount,qCount,hCount}=this.state;
        return (
            <div style ={{width:"1340px"}}>
                <div id="leftPanel" >
                <div id="topPanel" className="grayBox">
                    <div className="rightGrayBox" style={{textAlign:"center",width:"100px",fontSize:"18px",color:"#1890ff",float:"left" }}>
                        <div style={{fontWeight: "bold"}}>数据地图</div>
                        <div style={{fontWeight: "bold"}}>控制台</div>
                    </div>
                    <div className="grayBox omStat" style={{width: "150px"}}>
                        <div className="rightGrayBox" style={{width: "45px", float: "left"}}>
                            <img src={a0}  width="30px"/></div>
                        <div style={{marginTop: "5px", fontWeight: "bold"}}  onClick={()=>this.Map.onlyDisplay(0)}>市场主体</div>
                        &nbsp;<span > &nbsp;</span>
                    </div>
                    <div className="grayBox omStat">
                        <div className="rightGrayBox" style={{width:"45px",float:"left"}}><img src={i1} width="30px"/></div>
                        <div style={{marginTop: "5px",fontWeight:"bold"}} onClick={()=>this.Map.onlyDisplay(1)}>个体类
                            &nbsp;<span style={{color:"#1890ff"}}>{iCount}</span></div>
                        &nbsp;<span style={{fontSize:"10px",float:"right",color:"lightgray"}}>单位：家 &nbsp;</span>
                    </div>
                    <div className="grayBox omStat">
                        <div className="rightGrayBox" style={{width: "45px", float: "left"}}><img src={c1}
                                                                                                  width="30px"/></div>
                        <div style={{marginTop: "5px",fontWeight:"bold"}} onClick={()=>this.Map.onlyDisplay(2)}>企业类
                            &nbsp;<span style={{color:"#1890ff"}}>{cCount}</span></div>
                        &nbsp;<span style={{fontSize: "10px", float: "right",color:"lightgray"}}>单位：家 &nbsp;</span>
                    </div>
                    <div className="grayBox omStat">
                        <div className="rightGrayBox" style={{width: "45px", float: "left"}}><img src={h1}
                                                                                                  width="30px"/></div>
                        <div style={{marginTop: "5px",fontWeight:"bold"}} onClick={()=>this.Map.onlyDisplay(3)}>合作社
                            &nbsp;<span style={{color:"#1890ff"}}>{hCount}</span></div>
                        &nbsp;<span style={{fontSize: "10px", float: "right",color:"lightgray"}}>单位：家 &nbsp;</span>
                    </div>
                    <div className="grayBox omStat">
                        <div className="rightGrayBox" style={{width: "45px", float: "left"}}><img src={q1}
                                                                                                  width="30px"/></div>
                        <div style={{marginTop: "5px",fontWeight:"bold"}} onClick={()=>this.Map.onlyDisplay(4)}>其他
                            &nbsp;<span style={{color:"#1890ff"}}>{qCount}</span></div>
                        &nbsp;<span style={{fontSize: "10px", float: "right",color:"lightgray"}}>单位：家 &nbsp;</span>
                    </div>

                </div>
                <div style ={{width:"1020px",height:"630px",border:"5px solid #DCDCDC"}} className="grayBox">
                    <Map ref={this.onRef} transferValue={value=>this.setStateFromMap(value)} />
                </div>
                </div>
                <div id="rightPanel" >
                    <div className="grayBox" style ={{width:"300px",height:"100px",marginBottom:"5px"}}>
                        <div className={"bottomGrayBox"} style={{fontSize: "17px",fontWeight:"bold" }}>
                            <img src={totalPic}/>市场主体总计（单位：家）</div>
                        <span style={{fontSize: "40px", color:"red",float: "right",letterSpacing:"8px",fontWeight:"bold"}}>
                            {iCount+cCount+qCount+hCount}&nbsp;&nbsp;</span>
                    </div>
                    <div className="grayBox" style ={{width:"300px",height:"230px",marginBottom:"5px"}}>
                        <div className={"bottomGrayBox"}style={{fontWeight:"bold" }}><img src={searchPic} />数据搜索</div>
                        <div className={"grayBox"} style ={{width:"280px",height:"40px",border:"#cccc00 solid 1px",margin:"10px"}}>
                            <div  className={"rightSearchBox"}style ={{borderRight:"#cccc00 solid 1px"}}>区域筛选</div>
                            <div ><select style ={{width:"180px",marginTop:"5px"}}>
                                <option >加 载 区 域 划 分</option>
                            </select>
                            </div>
                        </div>
                        <div className={"grayBox"} style ={{width:"280px",height:"120px",border:"#cc6600 solid 1px",margin:"10px"}}>
                            <div className={"rightSearchBox"}style ={{borderRight:"#cc6600 solid 1px"}}>搜索聚焦</div>
                            <div style ={{width:"270px",marginTop:"5px"}}>
                                <input type="radio"  name="s1" value="1"  onClick={this.changeSearchType}/>市场主体名称&nbsp;&nbsp;
                                <input type="radio"  name="s1" value="2" onClick={this.changeSearchType}/>位置聚焦

                            </div>
                            <Search
                                placeholder=""
                                onSearch={value => this.cp(value)}
                                onChange={value=>this.changeValue(value)}
                                style={{ width: "260px",marginLeft:"5px"}}
                            />
                            <div style={{ float: "right",margin:"10px"}}>
                                <Button icon={<SearchOutlined />} type="primary" shape="round" onClick={()=>this.cp()}>搜索</Button></div>
                        </div>
                    </div>
                    <div className="grayBox" style ={{width:"300px",height:"365px"}}>
                        <div className={"bottomGrayBox"} style={{fontWeight:"bold" }}><img src={analysisPic}/>企业状态分析</div>
                        <div className={"bottomGrayBox"}>
                            <img src={allPic} width="68px" onClick={()=>this.Map.onlyDisplay1(0)}/>&nbsp;
                            <img src={newPic} width="68px" onClick={()=>this.Map.onlyDisplay1(1)}/>&nbsp;
                            <img src={nomalPic} width="68px" onClick={()=>this.Map.onlyDisplay1(2)}/>&nbsp;
                            <img src={abnomalPic} width="68px" onClick={()=>this.Map.onlyDisplay1(3)}/>
                        </div>
                            <ReactEcharts  option={this.getOption()}/>
                    </div>
                </div>
            </div>
        )
    }
}
