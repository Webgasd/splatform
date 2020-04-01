import React,{Component} from 'react';
import {Table} from 'antd';
import axios from "../../../../axios";
import './style.less';
import echarts from 'echarts/lib/echarts';

class FoodBusiness extends Component{
    state={}
    componentDidMount(){
        this.requestList();
        this.createCharts();
    }
    componentWillReceiveProps(nextProps, nextContext) {
        this.createCharts()
    }
    createCharts() {
        const myBar = echarts.init(document.getElementById('officeTable'));
        const teamitem = this.props.team5;
        const teamyes=this.props.buy5;
        // 绘制图表
        myBar.setOption({
            color: ['#8DC6E7'],
        backgroundColor: 'rgba(46, 126, 139, 0.00)',
        tooltip: {
            trigger: 'axis'
        },
        title : {
            text: '历下区各所快检数据统计图',
            x:'center',
            y:10,
             textStyle: {
                fontSize: 16,
               },
        },        
        xAxis: [ {
            type: 'category',
            boundaryGap:true,
            data: teamitem,
            axisLine: {
                lineStyle: {
                    color: '#6593B7'
                }
            },
            axisLabel: {
                color:'#6593B7',
                fontSize:12,
            },
        }],
        yAxis: [{
            type: 'value',
            axisLine: {
                lineStyle: {
                    color: '#6593B7'
                }
            },
        }],
        series: [
            {
                name:'买样费',
                barWidth : 20,
                type:'bar',
                data:teamyes,
            }]
        });
    }
    requestList = ()=>{    
        axios.ajax({
            url:'/quickCheckStatistics/getListAll',
            data:{
                params:this.params
            }
        }).then((res)=>{
            if(res.status == "success"){
                let list5  = res.data.list5.map((item,i)=>{
                    item.key = i;
                    return item;
                })
                this.setState({
                    list:list5,
                })
                let total  = res.data.list4.map((item)=>{
                    return item.total;
                })
                this.setState({
                    total,
                })
            }
        })
    }
  
    render() {
        const columns = [       
            {
                 title: '事项',
                 dataIndex: 'team',
             },
             {
                 title: '买样费(元)',
                 dataIndex: 'buy',
             },
         ];
        return (
            <div >
               <div id='officeTable' style={{height: '300px'}}></div>   
                     
                {/* <table>
                    <tbody>
                    <tr>
                        <th style={{width:60}}>事项</th>
  
                    </tr>
                    <tr>
                        <td>买样费(元)</td>
                    </tr>          
                    </tbody>
                </table> */}
                <Table
                style={{width:1200,marginLeft:40}}
                            dataSource={this.state.list}
                            columns={columns}
                            pagination={false}
                        />
                        <div style={{marginLeft:40}}>
               <table>
                    <tbody>
                    <tr >
                        <td style={{width:840,textAlign:"center"}}>合计</td> 
                        <td style={{width:360,textAlign:"center"}}>{this.state.total}</td>
                    </tr>          
                    </tbody>
                </table> 
                </div>
                    
        </div>
        )
    }
}
export default FoodBusiness;
