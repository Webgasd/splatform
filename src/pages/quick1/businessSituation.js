import React,{Component} from 'react';
import CommonTableTitle from "./commonTableTitle";
import echarts from "echarts/lib/echarts";
import {Row,Col} from 'antd'
import './style.less';
import LeftBar from "./img/leftBar.png";
import RightBar from "./img/rightBar.png";
import Indicators from './indicators'
class PlaceSituation extends Component {
    constructor(props) {
        super(props);
        this.state = {
            tempTeamData2: []
        }
    }
    componentDidMount(){      
    }
    componentWillReceiveProps(nextProps, nextContext) {
        this.createCharts2(nextProps.tempTeamData6);
    }
   
    createCharts2(tempTeamData6) {   
        //console.log(tempTeamData6)   
        const myBar = echarts.init(document.getElementById('office2'));
        const teamitem  =tempTeamData6.map((item)=>{
            return item.market6;
        })  
        const teamyes  =tempTeamData6.map((item)=>{
            return item.yes6;
        })  
        const teamno  =tempTeamData6.map((item)=>{
            return item.no6;
        })  
        const teamtotal  =tempTeamData6.map((item)=>{
            return item.total6;
        })  
        myBar.setOption({
            grid: {
                y: 30
            },
//         title : {
//             text: '快检检测机构检测指标情况',
//             x:'center',
//             y:10,
//              textStyle: {
//                 fontSize: 16,
//                 color:'#D6FEFE',
//                 fontWeight:'normal'
//                },

//         },
        color: ['#90C589', '#E25B33', '#86C2CF'],
        backgroundColor: 'rgba(46, 126, 139, 0.00)',
        tooltip: {
            trigger: 'axis'
        },
        legend: {
            data:['合格','不合格','快检总批次'],
            textStyle: {
                color: '#6593B7'
            },
            itemWidth:5,
            itemHeight:5,
            top:'bottom',
        },
        xAxis: [ {
            type: 'category',
            boundaryGap:true,
            data:teamitem,
            axisLine: {
                lineStyle: {
                    color: '#6593B7'
                }
            },
            axisLabel: {
                color:'#6593B7',
               interval:0,  //类目全显
                fontSize:10,
                //rotate:40
            },
        }],
        yAxis: [{
            type: 'value',
            axisLine: {
                lineStyle: {
                    color: '#6593B7'
                }
            },
        }],
        series: [
            {
                name:'合格',
                type:'bar',
                data:teamyes,
            },
            {
                name:'不合格',
                type:'bar',
                data:teamno,
            },
            {
                name:'快检总批次',
                type:'line',
                data:teamtotal
            }
        ]
    });
}
    render() {
       
        
        return (
            <div >
                {/* <div style={{color:'#8ECED6',marginLeft:135,marginTop:-15}}>
                    <img src={LeftBar} alt={''}/>快检检测机构检测指标情况<img src={RightBar} alt={''}/>
                </div> */}
            {/* <CommonTableTitle title={'快检检测机构检测指标情况'} /> */}
            <div className="commonTableTitle3" style={{color:'#8ECED6', textAlign: 'center',marginLeft:'auto',marginRight:'auto',width:'100%'}}>
                    <img src={LeftBar}  alt={''}/>快检检测机构检测指标情况<img src={RightBar}  alt={''}/>
                </div> 
                <div id='office2' style={{height: '240px', width: '550px',margin:'auto'}}></div>         
                        <Indicators
                        office={this.props.office}
                         percent1={this.props.percent1}
                         yes1={this.props.yes1}
                          no1={this.props.no1}
                          total1={this.props.total1}
                        />
            </div>
        )
    }
}

export default PlaceSituation