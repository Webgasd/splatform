import React,{Component} from 'react';
import echarts from "echarts/lib/echarts";

class foodType extends Component {
    constructor(props) {
        super(props);
        this.state = {
        }
    }
    componentDidMount() {
        this.createCharts(this.props.foodData)
    }

    componentWillReceiveProps(nextProps, nextContext) {
        this.createCharts(nextProps.foodData)
    }

    createCharts(foodData) {
        const myBar = echarts.init(document.getElementById('table8'));
        // 绘制图表
        myBar.setOption({
            title : {
                text:'食品类别抽检批次',
                x:'center',
                 textStyle: {//主标题文本样式{"fontSize": 18,"fontWeight": "bolder","color": "#333"}
                fontSize: 16,
                color:'#FFFFFF',
                fontWeight:'normal'
               },
            },
            tooltip : {
                trigger: 'item',
                formatter: "{a} <br/>{b} : {c} ({d}%)"
            },
            toolbox: {},
            calculable : true,
            series : [
                {
                    name:'数量',
                    type:'pie',
                    radius : [15, 65],
                    center : ['50%', '60%'],
                    roseType : 'area',
                    data:foodData
                }
            ]
        });
    }

    render() {
        return (
            <div>
              
                <div className='tdDiv'>
                    <div className='leftTop'></div>
                    <div className='rightTop'></div>
                    <div className='leftBottom'></div>
                    <div className='rightBottom'></div>
                    <div id='table8' style={{height: '260px', width: '315px',marginTop:0,marginLeft:-4}}></div>
                </div>
            </div>
        )
    }
}

export default foodType