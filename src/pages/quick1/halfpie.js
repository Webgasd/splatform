import React,{Component} from 'react';
import echarts from 'echarts/lib/echarts';
import CommonTableTitle from "./commonTableTitle";
class tesBatches extends Component {
    constructor(props) {
        super(props);
        this.state = {
            tempTeamData8: []
        }
    }

    componentDidMount(){      
    }
    componentWillReceiveProps(nextProps, nextContext) {
        this.createCharts8(nextProps.tempTeamData8);
    }
    createCharts8(tempTeamData8) {
        const myBar = echarts.init(document.getElementById('office8'));
        let legendData = []
        let sum = 0;
        tempTeamData8.forEach(item => {
            sum += item.value * 1 // *1保证sum值为数值
            legendData.push({name:item.name,value: item.value })
        })
        legendData.push({name: '', value: sum, itemStyle: {normal: {color: 'rgba(0, 0, 0, 0)'}}})
    // console.log(legendData)
        myBar.setOption({
//             title : {
//                 text: '快检机构检测费用使用情况',
//                 x:'center',
//                  textStyle: {//主标题文本样式{"fontSize": 18,"fontWeight": "bolder","color": "#333"}
//                 fontSize: 16,
//                 color:'#FFFFFF',
//                 fontWeight:'normal'
//                },
//             },
            tooltip : {
                trigger: 'item',
               formatter: "{b}",
            },
            color:['#407FFF','#F29961','#E15D68','#A682E6','#5DE18F'],
            // legend: {
            //     orient: 'horizontal',
            //     itemGap:10,
            //     x:'center',
            //     y:'30px',
            //     icon:"circle",
            //     itemWidth: 4,  
            //     textStyle:{
            //         fontWeight: 'bold',
            //         fontSize:10,
            //         color:'#FFFFFF', 
            //     },                          
            // },
            "color": ["#0696ff","#7ed321","#ffc31a", '#407FFF','#F29961','#E15D68','#A682E6','#5DE18F','blue',"transparent"],
            "startAngle": 0,
            series : [
                {
                    name: '快检机构检测费用',
                    type: 'pie',
                    radius : ['50%', '80%'],
                    center:["50%","20%"],                  
                    startAngle:0,
                   // endAngle:180,
                    data: legendData,
                   // roseType : 'radius',
                    // {value:170, name:'',tooltip:{formatter:function(a){return ""}}}],
                    itemStyle: {
                        emphasis: {
                            shadowBlur: 10,
                            shadowOffsetX: 0,
                            shadowColor: 'rgba(0, 0, 0, 0.5)'
                        },
                        padding:[20,0,20,20]
                    },                   
                    label: {
                        normal: {
                            show: true,
                            formatter: '{c}',
                            fontSize: 12
                        }
                    }
                }
            ]
        });
    }
    
        render() {
          //  console.log(this.props.tempTeamData8)
            return (
                <div >
                  <CommonTableTitle title={'快检检查不合格样品前十'} />
                        <div id='office8' style={{height: '200px'}}></div>                     
                    
                </div>
            )
        }
    }
    
    export default tesBatches