import React,{Component} from 'react';
import echarts from 'echarts'
import 'echarts-liquidfill'

class PlaceSituation extends Component {
    constructor(props) {
        super(props);
        this.state = {
        
        }
    }
    componentDidMount() {
       // this.createCharts(nextProps.enterpriseData)
    }

    componentWillReceiveProps(nextProps, nextContext) {
        this.createCharts(nextProps.checkData)
    }

    createCharts(checkData) {
        const myBar =  echarts.init(this.refs.circle2);
        // const enterpriseNumber  =enterpriseData.map((item)=>{
        //     return item.enterpriseNumber;
        // })  
        // const checkEnterprise  =enterpriseData.map((item)=>{
        //     return item.checkEnterprise;
        // })  
        
        var value = checkData;
        // console.log(checkData)
        // checkData==='NaN'?console.log('1'):console.log('2');
        //value = 0 :value = checkData;
      
        var data = [value, value, value, value, value, ];
        // 绘制图表
        myBar.setOption({
          //  backgroundColor: "#000",
        //  backgroundColor: '#fff',

          graphic: [{
              type: 'group',
              left: 'center',
             // bottom: 10,
            //   children: [{
            //       type: 'text',
            //       z: 100,
            //       left: '10',
            //       top: 'middle',
            //       style: {
            //           fill: '#000',
            //           //text: '磁盘剩余空间：',
            //           font: '16px Microsoft YaHei'
            //       }
            //   }, {
            //       type: 'text',
            //       z: 100,
            //       left: '120',
            //       top: 'middle',
            //       style: {
            //           fill: '#000',
            //        //   text: '128G',
            //           font: '24px Microsoft YaHei'
            //       }
            //   }]
          }],
          series: [{
              type: 'liquidFill',
              radius: '70%',
              center: ['50%', '50%'],
              data: data,
              backgroundStyle: {
                  borderWidth: 0,
                  borderColor: '#1daaeb',
                  color: '#fff'
              },
              label: {
                  normal: {
                      formatter: (value * 100).toFixed(2) + '%',
                      textStyle: {
                          fontSize: 20
                      }
                  }
              }
          }]
      })
    }
    render() {
      
        return (
            <div>

               
   <div ref='circle2' style={{height: 200,width:'70%',marginTop:0,marginLeft:'auto'}}></div>
                       
               
                       
                
            </div>
        )
    }
}

export default PlaceSituation