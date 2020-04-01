import React,{Component} from 'react';
import ReactEcharts from 'echarts-for-react';
import CommonTableTitle from './commonTableTitle'

class processing extends Component {
    constructor(props) {
        super(props);
        this.state = {
        }
    }

    option = {
        tooltip : {
            trigger: 'item',
            formatter: "{a} <br/>{b} : {d}%"
        },
        color:['#407FFF','#F29961','#E15D68','#A682E6','#5DE18F'],
        legend: {
            orient: 'vertical',
            left: 'left',
            data: ['现场告知','处罚','停业整顿','电话告知','责令改正'],
            textStyle:{
                fontSize: 10,//字体大小
                color: ['#ffffff','#111111']//字体颜色
            },
            itemWidth:16,
            itemHeight:10
        },
        series : [
            {
                name: '复验不合格处理情况',
                type: 'pie',
                radius : ['20%', '80%'],
                data:[
                    {value:15, name:'现场告知'},
                    {value:15, name:'处罚'},
                    {value:10, name:'停业整顿'},
                    {value:40, name:'电话告知'},
                    {value:20, name:'责令改正'}
                ],
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
                        position: 'inner',
                        formatter: '{d}%',
                        fontSize: 12
                    }
                }
            }
        ]
    };

    render() {
        return (
            <div className='processing'>
                <CommonTableTitle title={'复验不合格处理情况'}/>
                <div className='tdDiv'>
                    <div className='leftTop'></div>
                    <div className='rightTop'></div>
                    <div className='leftBottom'></div>
                    <div className='rightBottom'></div>
                    <ReactEcharts
                        option={this.option}
                        style={{height: '140px', width: '386px'}} />
                </div>
            </div>
        )
    }
}

export default processing