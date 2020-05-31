import React,{Component} from 'react';
import {Row,Col} from 'antd';
import connect from "react-redux/es/connect/connect";
import {changeEnterprise} from "../../../../redux/action";
import '../style.less'
import axios from "../../../../axios";

import ReactEcharts from 'echarts-for-react';
import echarts from 'echarts/lib/echarts';
import 'echarts/lib/chart/pie'
import 'echarts/lib/component/tooltip'
import 'echarts/lib/component/title'
import 'echarts/lib/component/legend'
import 'echarts/lib/component/markPoint'
import echartTheme from '../../../home/echartTheme';

@connect(
    state=>({
        industryList: state.industryList
    }),
    {
        changeEnterprise,
    }
)
class StatisticBox extends Component{

    state={};
    params = {
        pageNo:1,
        industryList:'',
        areaList:''
    }

    componentDidMount() {
        this.requestStatistics()
        
    }
    componentWillMount() {
        echarts.registerTheme('UPC', echartTheme);
    }
    requestStatistics=()=>{
        axios.PostAjax({
            url:'/supervision/enterprise/getCountPC',
            data: {
                params:{
                    ...this.params,
                    areaList:[this.params.areaList],
                    industryList:[this.params.industryList],
                    indexNum:1
                }
            }
        }).then((res)=>{
            if(res.status == "success"){
                this.setState({
                    statistics:res.data
                })
            }
        })
    }
    
render() {
    let statistics =this.state.statistics || {}

    const option1 = {
        tooltip : {
            trigger: 'item',
            formatter: "{a} <br/>{b} : {c} ({d}%)"
        },
        color:['RGB(144, 237, 125)', 'RGB(124, 181, 236)','RGB(247, 163, 93)','RGB(128, 133, 233)'],
        series : [
            {
                name:'详情',
                type:'pie',
                radius : '60%',//设置饼图大小
                data:[
                    {value:statistics?statistics.enterprise:'', name:'公司类'},
                    {value:statistics?statistics.individual:'', name:'个体类'},
                    {value:statistics?statistics.cooperation:'', name:'合作社'},
                    {value:statistics?statistics.others:'', name:'其他类'},
                ],
            }
        ]
    }
    const option2 = {
        tooltip: {
            trigger: 'item',
            formatter: "{a} <br/>{b} : {c} ({d}%)"
        },
        series: [
            {
                name: '详情',
                type: 'pie',
                radius: '60%',
                data:[
                    {value:statistics?statistics.foodBu:'', name:'食品经营'},
                    {value:statistics?statistics.foodPro:'', name:'食品生产'},
                    {value:statistics?statistics.drugsBu:'', name:'药品经营'},
                    {value:statistics?statistics.cosmeticsUse:'', name:'化妆品生产'},
                    {value:statistics?statistics.medicalPro:'', name:'医疗器械生产'},
                    {value:statistics?statistics.medicalBu:'', name:'医疗器械经营'},
                    {value:statistics?statistics.smallCater:'', name:'小餐饮服务'},
                    {value:statistics?statistics.smallWorkshop:'', name:'小作坊'},
                    {value:statistics?statistics.industrialProducts:'', name:'工业产品生产'},
                    {value:statistics?statistics.drugsPro:'', name:'药品生产'},
                ],
            }
        ]
    }
    
    return (
        <div>
            <Row>
            <Col span={8} style={{marginLeft:20}}>
                <div className='statisticsBigBox1'>
                <div style={{margin:6,fontSize:'large',fontWeight:"bold"}}>企业主体总计数量</div>
                <div style={{height:1,width:'100%',background: '#E6E9EC'}}></div>
                <div style={{fontSize:34,color:"RGB(38, 167, 220)"}}>
                    <img src={require("../img/市场主体图标.png")} style={{height:50,margin:15}} alt=""/>
                    {this.props.total||''}
                </div>
                <div style={{float:"right",margin:5}}>单位：家</div>
            </div>
            </Col>

            <Col span={8} style={{marginLeft:-51}}>
                <Row>
                    <div className='statisticsLittleBox1'>
                    <Row>
                        <Col span={5}><img src={require("../img/公司类.png")} style={{height:40,marginTop:14,marginLeft:11}} alt=""/></Col>
                        <Col span={1}offset={1}><div style={{height:69,width:1,background: '#E6E9EC'}}></div></Col>
                        <Col span={6}><div style={{marginTop:20,fontSize:'large',fontWeight:"bold"}}>公司类</div> </Col>
                        <Col span={6}offset={1}><div style={{fontSize:24,color:"RGB(38, 167, 220)",marginTop:12}}>{statistics?statistics.enterprise:''}</div></Col>
                    </Row>
                        <div style={{float:"right",marginTop:-20}}>单位：家</div>
                        </div>
                </Row>
                <Row style={{marginTop:10}}>
                    <div className='statisticsLittleBox1'>
                    <Row>
                        <Col span={5}><img src={require("../img/个体类.png")} style={{height:40,marginTop:14,marginLeft:11}} alt=""/></Col>
                        <Col span={1}offset={1}><div style={{height:69,width:1,background: '#E6E9EC'}}></div></Col>
                        <Col span={6}><div style={{marginTop:20,fontSize:'large',fontWeight:"bold"}}>个体类</div> </Col>
                        <Col span={6}offset={1}><div style={{fontSize:24,color:"RGB(38, 167, 220)",marginTop:12}}>{statistics?statistics.individual:''}</div></Col>
                    </Row>
                        <div style={{float:"right",marginTop:-20}}>单位：家</div>
                    </div>
                </Row>
            </Col>

            <Col span={8} style={{marginLeft:12}}>
                <Row>
                    <div className='statisticsLittleBox1'>
                    <Row>
                        <Col span={5}><img src={require("../img/合作社.png")} style={{height:40,marginTop:14,marginLeft:11}} alt=""/></Col>
                        <Col span={1}offset={1}><div style={{height:69,width:1,background: '#E6E9EC'}}></div></Col>
                        <Col span={6}><div style={{marginTop:20,fontSize:'large',fontWeight:"bold"}}>合作社</div> </Col>
                        <Col span={6}offset={1}><div style={{fontSize:24,color:"RGB(38, 167, 220)",marginTop:12}}>{statistics?statistics.cooperation:''}</div></Col>
                    </Row>
                        <div style={{float:"right",marginTop:-20}}>单位：家</div>
                        </div>
                </Row>
                <Row style={{marginTop:10}}>
                    <div className='statisticsLittleBox1'>
                    <Row>
                        <Col span={5}><img src={require("../img/其他类.png")} style={{height:40,marginTop:14,marginLeft:11}} alt=""/></Col>
                        <Col span={1}offset={1}><div style={{height:69,width:1,background: '#E6E9EC'}}></div></Col>
                        <Col span={6}><div style={{marginTop:20,fontSize:'large',fontWeight:"bold"}}>其他类</div> </Col>
                        <Col span={6}offset={1}><div style={{fontSize:24,color:"RGB(38, 167, 220)",marginTop:12}}>{statistics?statistics.others:''}</div></Col>
                    </Row>
                        <div style={{float:"right",marginTop:-20}}>单位：家</div>
                    </div>
                </Row>
            </Col>
            </Row>

            <div style={{marginTop:10,width:'100%',height:260}}>
                <div style={{width:'48%',height:'100%' ,borderRadius:10,border: '1px solid #E6E9EC',float:'left'}}>
                    <div style={{width:'100%',height:35,background:'RGB(242, 242, 242)'}}>
                        <div style={{lineHeight:'35px',marginLeft:15,fontSize:15,color:"RGB(38, 167, 220)"}}>主体类型统计</div>
                    </div>
                    <ReactEcharts style={{height:260,marginTop:-17}} option={option1}/>
                </div>
                <div style={{width:'48%',height:'100%' ,borderRadius:10,border: '1px solid #E6E9EC',float:'left',marginLeft:36}}>
                    <div style={{width:'100%',height:35,background:'RGB(242, 242, 242)'}}>
                        <div style={{lineHeight:'35px',marginLeft:15,fontSize:15,color:"RGB(38, 167, 220)"}}>许可类型统计</div>
                    </div>
                    <ReactEcharts 
                        style={{height:260,marginTop:-17}} 
                        option={option2} 
                        // lazyUpdate={true} 
                        // theme="UPC"
                        />
                </div>
            </div>

            <div style={{marginTop:10,width:'100%',height:307,borderRadius:10,border: '1px solid #E6E9EC'}}>
                <div style={{width:'100%',height:35,background:'RGB(242, 242, 242)'}}>
                    <div style={{lineHeight:'35px',marginLeft:15,fontSize:15,color:"RGB(38, 167, 220)"}}>许可类型数量统计</div>
                </div>
                
                    <div className="permissionStatisticsBox">
                        <div className="permissionStatisticsTitle">食品经营</div>
                        <div className="permissionStatisticsNumber">{statistics.foodBu?statistics.foodBu:0}</div>
                        <div className="permissionStatisticsUnit">家</div>
                    </div>

                    <div className="permissionStatisticsBox">
                        <div className="permissionStatisticsTitle">小餐饮服务</div>
                        <div className="permissionStatisticsNumber">{statistics.smallCater?statistics.smallCater:0}</div>
                        <div className="permissionStatisticsUnit">家</div>
                    </div> 

                    <div className="permissionStatisticsBox">
                        <div className="permissionStatisticsTitle">小作坊</div>
                        <div className="permissionStatisticsNumber">{statistics.smallWorkshop?statistics.smallWorkshop:0}</div>
                        <div className="permissionStatisticsUnit">家</div>
                    </div> 

                    <div className="permissionStatisticsBox">
                        <div className="permissionStatisticsTitle">食品生产</div>
                        <div className="permissionStatisticsNumber">{statistics.foodPro?statistics.foodPro:0}</div>
                        <div className="permissionStatisticsUnit">家</div>
                    </div> 

                    <div className="permissionStatisticsBox">
                        <div className="permissionStatisticsTitle">药品经营</div>
                        <div className="permissionStatisticsNumber">{statistics.drugsBu?statistics.drugsBu:0}</div>
                        <div className="permissionStatisticsUnit">家</div>
                    </div> 

                    <div className="permissionStatisticsBox">
                        <div className="permissionStatisticsTitle">药品生产</div>
                        <div className="permissionStatisticsNumber">{statistics.drugsPro?statistics.drugsPro:0}</div>
                        <div className="permissionStatisticsUnit">家</div>
                    </div> 

                    <div className="permissionStatisticsBox">
                        <div className="permissionStatisticsTitle">化妆品生产</div>
                        <div className="permissionStatisticsNumber">{statistics.cosmeticsUse?statistics.cosmeticsUse:0}</div>
                        <div className="permissionStatisticsUnit">家</div>
                    </div> 

                    <div className="permissionStatisticsBox">
                        <div className="permissionStatisticsTitle">医疗器械生产</div>
                        <div className="permissionStatisticsNumber">{statistics.medicalPro?statistics.medicalPro:0}</div>
                        <div className="permissionStatisticsUnit">家</div>
                    </div> 

                    <div className="permissionStatisticsBox">
                        <div className="permissionStatisticsTitle">医疗器械经营</div>
                        <div className="permissionStatisticsNumber">{statistics.medicalBu?statistics.medicalBu:0}</div>
                        <div className="permissionStatisticsUnit">家</div>
                    </div> 

                    <div className="permissionStatisticsBox">
                        <div className="permissionStatisticsTitle">工业产品生产</div>
                        <div className="permissionStatisticsNumber">{statistics.industrialProducts?statistics.industrialProducts:0}</div>
                        <div className="permissionStatisticsUnit">家</div>
                    </div>  
               

            </div>
        </div>
    )
}
}
export default StatisticBox;