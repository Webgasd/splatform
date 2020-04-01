import React,{Component} from 'react';
import ReactEcharts from 'echarts-for-react';
import CommonTableTitle from "./commonTableTitle";
import echarts from "echarts/lib/echarts";
import LeftBar from "./img/leftBar.png";
import RightBar from "./img/rightBar.png";

class AgencyCost extends Component {
    constructor(props) {
        super(props);
        this.state = {
            tempTeamData5: []
        }
    }
    componentDidMount(){      
    }
    componentWillReceiveProps(nextProps, nextContext) {
        this.createCharts3(nextProps.tempTeamData5);
    }
   
    createCharts3(tempTeamData5) {   
    //    console.log(tempTeamData5)   
        const myBar = echarts.init(document.getElementById('office5'));
        const teamitem  =tempTeamData5.map((item)=>{
            return item.team5;
        })  
        const teambuy  =tempTeamData5.map((item)=>{
            return item.buy5;
        })  
        myBar.setOption({
//         title : {
//             text: '各执法所快检检测费用使用情况',
//             x:'center',
//              textStyle: {//主标题文本样式{"fontSize": 18,"fontWeight": "bolder","color": "#333"}
//                 fontSize: 16,
//                 color:'#FFFFFF',
//                 fontWeight:'normal'
//                },
//         },
        grid:{
           x:100,
           y:10
        },
        color: ['#90C589', '#E25B33', '#86C2CF'],
        backgroundColor: 'rgba(46, 126, 139, 0.00)',
        tooltip: {
            trigger: 'axis'
        },
        legend: {
            data:['合格','不合格','总批次'],
            textStyle: {
                color: '#6593B7'
            }
        },
        xAxis: [ {
            type: 'value',
            boundaryGap:true,        
            axisLine: {
                lineStyle: {
                    color: '#6593B7'
                }
            },
            axisLabel: {
                color:'#6593B7',
                interval:0,  //类目全显
                fontSize:10,
                rotate:40
            },
        }],
        yAxis: [{
            type: 'category',
            data: teamitem,
            axisLine: {
                lineStyle: {
                    color: '#6593B7'
                }
            },
            axisLabel: {
                color:'#6593B7',
                interval:0,  //类目全显
                fontSize:10,
                rotate:40
            },
        }],
        series: [
            {
                type:'bar',
                data: teambuy,
                barWidth : 8,
                itemStyle: {
                    normal:{  
                    color: function (params){
                        var colorList = ['#5AC7E6','#EB5228','#FADD4B','#59C25C','#3063F6','#5AC7E6','#EB5228','#FADD4B','#59C25C','#3063F6','#5AC7E6','#EB5228','#FADD4B',];
                        return colorList[params.dataIndex];
                    }
                },

            }
        }
        ]
    });
}

    render() {
        return (
            <div>
            {/* <CommonTableTitle title={'各执法所快检检测费用使用情况'} /> */}
               <div className="commonTableTitle2" style={{color:'#8ECED6', textAlign: 'center',marginLeft:'auto',marginRight:'auto',width:'100%'}}>
                    <img src={LeftBar} style={{width:80}} alt={''}/>各执法所快检检测费用使用情况<img src={RightBar} style={{width:80}} alt={''}/>
                </div> 
                    <div id='office5'  style={{height: '340px', width: '350px'}}/>        
                
            </div>
        )
    }
}

export default AgencyCost