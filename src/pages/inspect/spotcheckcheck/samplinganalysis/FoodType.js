import React,{Component} from 'react';
import {Row, Col, Table} from 'antd'
import ReactEcharts from 'echarts-for-react';
import axios from "../../../../axios";
import echarts from "echarts/lib/echarts";

class FoodType extends Component {
    constructor(props) {
        super(props);
        this.state = {
        }
    }

    componentDidMount() {
        this.createCharts()
    }

    componentWillReceiveProps(nextProps, nextContext) {
        this.createCharts()
    }

    createCharts() {
        const myBar = echarts.init(document.getElementById('foodTable'));
        const myBar1 = echarts.init(document.getElementById('foodTable1'));
        const {fooditem} = this.props;
        const {foodtotal}=this.props;
        const {foodyes}=this.props;
        const {foodno}=this.props;
        const typetopData = this.state.typetopData;
        const typetopname=this.state.typetopname
        console.log(typetopData)
        // 绘制图表
        myBar.setOption({
            title:{
                text:'食品类别抽检数据统计',
                textStyle: {
                    fontSize: '18',
                }
            },
            color:['#EA407A','#4BAAF8','#7156F6'],
            tooltip : {
                trigger: 'axis',
                axisPointer : {            // 坐标轴指示器，坐标轴触发有效
                    type : 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
                }
            },
            legend: {
                show:false,
                data: ['合格', '不合格','抽检总批次'],
                textStyle:{
                    fontSize: 8,
                },
            },
            grid: {
                left: '3%',
                right: '4%',
                bottom: '3%',
                containLabel: true
            },
            xAxis:  {
                type: 'value',
                axisLabel: {
                    formatter: '{value}',
                    show: true,
                    textStyle: {
                        fontSize:8
                    }
                }
            },
            yAxis: {
                type: 'category',
                data: fooditem,
                axisLabel: {
                    show: true,
                    textStyle: {
                        fontSize:8
                    }
                }
            },
            series: [
                {
                    name: '不合格',
                    type: 'bar',
                    stack: '总量',
                    label: {
                        normal: {
                            show: true,
                            position: 'insideRight'
                        }
                    },
                    data: foodno
                },
                {
                    name: '合格',
                    type: 'bar',
                    stack: '总量',
                    label: {
                        normal: {
                            show: true,
                            position: 'insideRight'
                        }
                    },
                    data: foodyes
                },
                {
                    name: '抽检总批次',
                    type: 'bar',
                    stack: '总量',
                    label: {
                        normal: {
                            show: true,
                            position: 'insideRight'
                        }
                    },
                    data: foodtotal
                }
            ]
        });
        myBar1.setOption({
            tooltip : {
                trigger: 'item',
                formatter: "{a} <br/>{b} : {d}%"
            },
            color:['#7af23e','#F29961','#E15D68','#A682E6','#5DE18F','#bac21a','#057400','#8F544C','#1D82FE','#cb6381','#78878C'],
            legend: {
                orient: 'vertical',
                itemGap:3,
                left: 'left',
                data: typetopname,
                textStyle:{
                    fontSize: 8,
                    // color: 'aliceblue',
                },
            },
            series : [
                {
                    name: '抽检检查不合格样品',
                    type: 'pie',
                    radius : ['20%', '70%'],
                    data:typetopData,
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
        });
    }

    handleOperator = (type,item)=>{
        if(type =='detail'){
            axios.ajax({
                url: '/spotCheckStatistics/getListTypeNameResultByTypeTopTen',
                data: {
                    params: {
                        type:item.type
                    }
                }
            }).then((res)=>{
                if(res.status == 'success'){
                    let typetop  = res.data.map((item,i)=>{
                        item.key = i;
                        return item;})
                    let typetopData  = typetop.map((item,i)=>{
                        item.key = i;
                        return {
                            value:item.no,
                            name:item.name
                        }
                    })
                    let typetopname  = typetop.map((item,i)=>{
                        item.key = i;
                        return item.name;})
                    this.setState({
                        typetop:typetop,
                        typetopData:typetopData,
                        typetopname:typetopname
                    })
                }this.createCharts()
            })
        }console.log(this.state.typetop)
    }
    render() {
        const food=this.props.food;
        const columns = [
            {
                title:"食品类别",
                dataIndex:"type"
            },{
                title:"抽检总批次",
                dataIndex:"total"
            },{
                title:"合格批次",
                dataIndex:"yes"
            },{
                title:"不合格批次",
                dataIndex:"no"
            },{
                title:"问题发现率",
                dataIndex:"percent"
            },{
                title:"操作",
                dataIndex:"operation",
                render:(text,item)=>{
                    return <div className="textButton" onClick={()=>{this.handleOperator('detail',item)}}>详情</div>
                }
            }
        ];
        const columns1 = [
            {
                title:"样品名称",
                dataIndex:"name"
            },{
                title:"不合格批次",
                dataIndex:"no"
            }
        ];
        return (
            <div>
                <Row>
                    <Col span={8}>
                        <div id='foodTable' style={{height: '440px', width: '440px',marginTop:8}}></div>
                    </Col>
                    <Col span={9}>
                        <div style={{marginTop:70,width:475}}>
                            <div className="titlefont" style={{fontSize:16,width:475,height:35,backgroundColor:'#FAFAFA',color:"#252525",border:'1px solid #ddd',verticalAlign:'middle'}}>各所食品类别统计分析表</div>
                            <Table
                                dataSource={food}
                                columns={columns}
                                bordered={true}
                                pagination={false}
                            />
                        </div>
                    </Col>
                    <Col span={7}>
                        <div>
                            <div id='foodTable1' style={{height: '190px', width: '315px',marginLeft:35,marginTop:5}}></div>
                        </div>
                        <div style={{marginTop:40,marginLeft:40,width:300}}>
                            <div className="titlefont" style={{fontSize:16,width:300,height:35,backgroundColor:'#FAFAFA',color:"#252525",border:'1px solid #ddd',verticalAlign:'middle'}}>排名前十不合格样品</div>
                            <Table
                                dataSource={this.state.typetop}
                                columns={columns1}
                                bordered={true}
                                pagination={false}
                            />
                        </div>
                    </Col>
                </Row>
            </div>
        )
    }
}

export default FoodType