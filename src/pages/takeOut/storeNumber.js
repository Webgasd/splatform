import React,{Component} from 'react';
import ReactEcharts from 'echarts-for-react';
import CommonTableTitle from './commonTableTitle'

class storeNumber extends Component {
    constructor(props) {
        super(props);
        this.state = {
        }
    }

    option = {
        color: ['#FE83D3', '#3B93FF', '#28BBAB'],
        backgroundColor: 'rgba(46, 126, 139, 0.00)',
        tooltip: {
            trigger: 'axis'
        },
        legend: {
            data:['饿了么','美团'],
            right: '30px',
            textStyle: {
                color: '#6593B7'
            }
        },
        xAxis:  {
            type: 'category',
            boundaryGap: false,
            data: ['1月','2月','3月','4月','5月','6月','7月','8月','9月','10月','11月','12月'],
            axisLine: {
                lineStyle: {
                    color: '#6593B7'
                }
            },
            axisLabel: {
                color:'#6593B7'
            }
        },
        yAxis: {
            name:'数量',
            type: 'value',
            axisLine: {
                lineStyle: {
                    color: '#6593B7'
                }
            },
            axisLabel: {
                formatter: '{value}',
                color:'#6593B7'
            }
        },
        series: [
            {
                name:'饿了么',
                type:'line',
                data:[1200, 1200, 1200, 1200, 1200, 900, 900,900,1500,1000,900,900,900,1000],
            },
            {
                name:'美团',
                type:'line',
                data:[1100, 1100, 1100, 1100, 1100, 800, 800,800,1400,900,800,800,800,900],
            }
        ]
    };

    render() {
        return (
            <div>
                <CommonTableTitle title={'采集店铺数'}/>
                <div className='tdDiv'>
                    <div className='leftTop'></div>
                    <div className='rightTop'></div>
                    <div className='leftBottom'></div>
                    <div className='rightBottom'></div>
                    <ReactEcharts
                        option={this.option}
                        style={{height: '230px', width: '386px'}} />
                </div>
            </div>
        )
    }
}

export default storeNumber