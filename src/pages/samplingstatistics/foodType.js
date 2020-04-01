import React,{Component} from 'react';
import CommonTableTitle from "./commonTableTitle";
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
        const myBar = echarts.init(document.getElementById('foodTable'));
        // 绘制图表
        myBar.setOption({
            title : {
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
                    center : ['50%', '50%'],
                    roseType : 'area',
                    data:foodData
                }
            ]
        });
    }

    render() {
        return (
            <div>
                <CommonTableTitle title={'食品类别抽检检测指标'}/>
                
                    <div id='foodTable' style={{height: '195px', width: '315px',marginTop:0,marginLeft:-4}}></div>
               
            </div>
        )
    }
}

export default foodType