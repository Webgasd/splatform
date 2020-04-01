import React,{Component} from 'react';
import CommonTableTitle from "./commonTableTitle";
import LeftBar from "./img/leftBar.png";
import RightBar from "./img/rightBar.png";
import echarts from 'echarts/lib/echarts';
class SpotCost extends Component {
    constructor(props) {
        super(props);
        this.state = {
            tempTeamData2: []
        }
    }
    componentDidMount(){      
    }
    componentWillReceiveProps(nextProps, nextContext) {
        this.createCharts4(nextProps.tempTeamData7);
    }
   
    createCharts4(tempTeamData7) {         
        const myBar = echarts.init(document.getElementById('office7')); 
        let sum = 0;
        tempTeamData7.forEach(item => {
            sum += item.value * 1 // *1保证sum值为数值
        })
        myBar.setOption({
//             title : {
//                 text: '快检检查不合格样品前十',
//                 x:'center',
//                  textStyle: {//主标题文本样式{"fontSize": 18,"fontWeight": "bolder","color": "#333"}
//                 fontSize: 16,
//                 color:'#FFFFFF',
//                 fontWeight:'normal'
//                },
//             },
            tooltip : {
                trigger: 'item',
                formatter: "{b} : {d}%"
            },
            top: 0,
            color:['#407FFF','#F29961','#E15D68','#A682E6','#5DE18F'],
            graphic: [{ 
                type: 'text', 
                left: 'center',
                top: '40%',
                style: {
                    text: '总数',
                    textAlign: 'center',
                    fill: '#F1C44F', //文字的颜色
                    width: 30,
                    height: 30,
                    fontSize: 14,
                    fontFamily: "Microsoft YaHei"
                }
            },
            { //环形图中间添加文字
                type: 'text', //通过不同top值可以设置上下显示
                left: 'center',
                top: '50%',
                style: {
                    text: sum,
                    textAlign: 'center',
                    fill: '#606FB4', //文字的颜色
                    width: 30,
                    height: 30,
                    fontSize: 12,
                    fontFamily: "Microsoft YaHei"
                }
            }],
            legend: {
                orient: 'vertical',
                x:'85%', 
                y:'10px',
                itemWidth: 5,    
                itemHeight: 4,  
                itemGap:4,
                textStyle:{
                    fontSize:8,
                    color:'#FFFFFF', 
                },                          
            },
            series : [
                {                 
                    name: '不合格',
                    type: 'pie',
                    radius : ['25%', '50%'],
                    center: ['50%', '45%'],
                    data:tempTeamData7,
                    itemStyle: {
                        emphasis: {
                            shadowBlur: 10,
                            shadowOffsetX: 0,
                            shadowColor: 'rgba(0, 0, 0, 0.5)'
                        }
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
        
        return (
            <div className='spotCost'>
                 {/* <CommonTableTitle title={'快检检查不合格样品前十'} /> */}
                 <div className="commonTableTitle3" style={{color:'#8ECED6', textAlign: 'center',marginLeft:'auto',marginRight:'auto',width:'100%'}}>
                    <img src={LeftBar}  alt={''}/>快检检查不合格样品前十<img src={RightBar}  alt={''}/>
                </div> 
                        <div id='office7'  style={{height: '180px'}}/>                        
                
            </div>
       
        )
    }
}

export default SpotCost