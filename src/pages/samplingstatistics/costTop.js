import React,{Component} from 'react';
import ReactEcharts from 'echarts-for-react';
import CommonTableTitle from "./commonTableTitle";
import echarts from "echarts/lib/echarts";

class foodType extends Component {
    constructor(props) {
        super(props);
        this.state = {
        }
    }
    componentDidMount() {
        this.createCharts(this.props.costData)
    }

    componentWillReceiveProps(nextProps, nextContext) {
        this.createCharts(nextProps.costData)
    }

    createCharts(costData) {
        const myBar = echarts.init(document.getElementById('costTable'));
        // 绘制图表
        myBar.setOption({
            title : {
            },
            tooltip : {
                trigger: 'item',
                formatter: "{a} <br/>{b} : {c} ({d}%)"
            },
            toolbox: {
                show : false,
                feature : {
                    mark : {show: true},
                    dataView : {show: true, readOnly: false},
                    magicType : {
                        show: true,
                        type: ['pie', 'funnel']
                    },
                    restore : {show: true},
                    saveAsImage : {show: true}
                }
            },
            calculable : true,
            series : [
                {
                    name:'数量',
                    type:'pie',
                    radius : [40, 65],
                    center : ['50%', '50%'],
                    roseType : 'area',
                    data:costData,
                }
            ]
        });
    }

    render() {
        return (
            <div>
                <CommonTableTitle title={'抽检样品所耗费用排名前十'}/>
                
                    <div id='costTable' style={{height: '195px', width: '315px',marginTop:0,marginLeft:-4}}></div>
                
            </div>
        )
    }
}

export default foodType