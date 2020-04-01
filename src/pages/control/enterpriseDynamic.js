import React, { Component } from 'react';
import echarts from 'echarts/lib/echarts';
import Build from './img/build.png'
import Water from './img/water.png'

class detection extends Component {
    constructor(props) {
        super(props);
        this.state = {
        }
    }

    // option = {
    //     tooltip : {
    //         trigger: 'axis',
    //         axisPointer : {            // 坐标轴指示器，坐标轴触发有效
    //             type : 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
    //         }
    //     },
    //     xAxis: {
    //         type: 'category',
    //         data: ['原料索证', '消毒记录', '添加剂备案', '食品留样', '图片台账', '废弃物记录'],
    //         axisLine: {
    //             show: true,
    //             lineStyle: {
    //                 color: '#4EC1EF',
    //             },
    //             axisLabel: {
    //                 interval:0,
    //                 textStyle: {
    //                     color: '#4EC1EF',
    //                     fontWeight: 'normal',
    //                     fontSize: '12',
    //                 },
    //             },
    //         },
    //     },
    //     yAxis: {
    //         type: 'value',
    //         axisLine: {
    //             show: true,
    //             lineStyle: {
    //                 color: '#4EC1EF',
    //             }
    //         },
    //         splitLine: {
    //             show: true,
    //             lineStyle: {
    //                 color: '#363e83 ',
    //             }
    //         },
    //     },
    //     series: [{
    //         data: [70, 70, 30, 60, 70, 40],
    //         type: 'bar',
    //         itemStyle: {
    //             normal: {
    //                 color: function(params) {
    //                     let colorList = [
    //                         '#FB3838',
    //                         '#FF891A',
    //                         '#FACF20',
    //                         '#34A7FE',
    //                         '#A516E2',
    //                         '#1CE990'
    //                     ]
    //                     return colorList[params.dataIndex];
    //                 },
    //                 borderWidth: 0,
    //                 shadowBlur: {
    //                     shadowColor: 'rgba(255,255,255,0.31)',
    //                     shadowBlur: 10,
    //                     shadowOffsetX: 0,
    //                     shadowOffsetY: 2,
    //                 },
    //             }
    //         },
    //         barWidth: '10%',
    //     }]
    // };
    componentDidMount() {
        this.createCharts(this.props.enterData)
    }

    componentWillReceiveProps(nextProps, nextContext) {
        this.createCharts(nextProps.enterData)
    }

    createCharts(enterData) {
        const myBar = echarts.init(document.getElementById('dashboard'));
        const disinfection  = enterData.map((item)=>{
            return item.disinfection;
        })  
        const origin  = enterData.map((item)=>{
            return item.origin;
        })  
        const waste  = enterData.map((item)=>{
            return item.waste;
        })  
        myBar.setOption({
        tooltip: {
            formatter: "{b}"
        },
        color: ['lightgreen', 'orange', 'skyblue', '#ff4500'],
        series: [
            {
                name: '消毒记录',
                center: ['15%', '50%'],
                // startAngle: -140,
                //  endAngle : 140, 
                radius: '40%',
                type: 'gauge',
                detail: {
                    formatter: '{value}',
                    textStyle: {       // 其余属性默认使用全局文本样式，详见TEXTSTYLE
                        color: 'auto',
                        fontSize: 14
                    }
                }, //仪表盘显示数据
                axisLine: { //仪表盘轴线样式
                    lineStyle: {
                        width: 8,
                       // color: [['20%', 'lightgreen'],['40%', 'orange'],['80%', 'skyblue'],['100%', '#ff4500']], 
                    },
                },
                axisLabel: {           // 坐标轴文本标签，详见axis.axisLabel
                    show: false,
                    // formatter: function(v){
                    //     switch (v+''){
                    //         case '10': return '弱';
                    //         case '30': return '低';
                    //         case '60': return '中';
                    //         case '90': return '高';
                    //         default: return '';
                    //     }
                    // },
                },
                splitLine: { //分割线样式
                    length: 10
                },
                title: {
                    show: true,
                    offsetCenter: [0, '95%'],       // x, y，单位px
                    textStyle: {       // 其余属性默认使用全局文本样式，详见TEXTSTYLE
                        color: '#fff',
                        fontSize: 14
                    }
                },
                data: [{ value: disinfection, name: '消毒记录' }],
            },
            {
                name: '原料索证',
                radius: '60%',
                type: 'gauge',
                detail: {
                    formatter: '{value}',
                    textStyle: {       // 其余属性默认使用全局文本样式，详见TEXTSTYLE
                        color: 'auto',
                        fontSize: 14
                    }
                }, //仪表盘显示数据
                axisLine: { //仪表盘轴线样式
                    lineStyle: {
                        width: 10
                    }
                },
                axisLabel: {           // 坐标轴文本标签，详见axis.axisLabel
                    show: false,
                },
                splitLine: { //分割线样式
                    length: 10
                },
                title: {
                    show: true,
                    offsetCenter: [0, '85%'],       // x, y，单位px
                    textStyle: {       // 其余属性默认使用全局文本样式，详见TEXTSTYLE
                        color: '#fff',
                        fontSize: 14
                    }
                },
                data: [{ value: origin, name: '原料索证' }],
            }, {
                name: '废弃物处理',
                center: ['85%', '50%'],
                type: 'gauge',
                radius: '40%',
                detail: {
                    formatter: '{value}',
                    textStyle: {       // 其余属性默认使用全局文本样式，详见TEXTSTYLE
                        color: 'auto',
                        fontSize: 14
                    }
                }, //仪表盘显示数据
                axisLine: { //仪表盘轴线样式
                    lineStyle: {
                        width: 8
                    }
                },
                axisLabel: {
                    show: false,
                },
                splitLine: { //分割线样式
                    length: 10
                },
                title: {
                    show: true,
                    offsetCenter: [0, '95%'],       // x, y，单位px
                    textStyle: {       // 其余属性默认使用全局文本样式，详见TEXTSTYLE
                        color: '#fff',
                        fontSize: 14
                    }
                },
                data: [{ value: waste, name: '废弃物处理' }],
            },
        ]
    });
  }
    render() {
      //  console.log(this.props.enterData)
        return (
            <div className='enterpriseDynamic'>
                <div className='boxHeader'>企业动态</div>
                <div className='box'>
                    <div className='insideBox'>
                        <div className='boxIcon'><img src={Build} alt={''} /></div>
                        <div className='boxText'>
                            <strong>{this.props.restaurant}</strong>
                            <br />
                            入网餐饮单位
                        </div>
                    </div>
                    <div className='insideBox'>
                        <div className='boxIcon'><img src={Water} alt={''} /></div>
                        <div className='boxText'>
                            <strong>{this.props.supplier}</strong>
                            <br />
                            供应商配送单位
                        </div>
                    </div>
                    <div style={{ clear: 'both' }}></div>
                </div>
                <div className='boxHeader'>当日规范经营报送数量：</div>
                <div className='box' style={{ height: '170px' }}>
             <div id='dashboard' style={{ height: '230px', width: '100%', position: 'relative', top: '-30px' }}></div>
                </div>
            </div>
        )
    }
}

export default detection