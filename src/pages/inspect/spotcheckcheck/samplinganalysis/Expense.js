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
        const myBar = echarts.init(document.getElementById('moneyTable'));
        const myBar1 = echarts.init(document.getElementById('moneyTable1'));
        const {buyMoney} = this.props;
        const {sampleMoney}=this.props;
        const {checkMoney}=this.props;
        const typetopData=this.state.typetopData
        console.log(typetopData)
        // 绘制图表
        myBar.setOption({
            title:{
                text:'全局抽检所耗费用',
                textStyle: {
                    fontSize: '18',
                }
            },
            tooltip: {
                trigger: 'item',
                formatter: "{a} <br/>{b}: {c} ({d}%)"
            },
            legend: {
                orient: 'vertical',
                x: 'right',
                data:['买样费','采样费','检测费']
            },
            series: [
                {
                    name:'全局抽检所耗费用',
                    type:'pie',
                    radius: ['50%', '70%'],
                    avoidLabelOverlap: false,
                    label: {
                        normal: {
                            show: false,
                            position: 'center'
                        },
                        emphasis: {
                            show: true,
                            textStyle: {
                                fontSize: '30',
                                fontWeight: 'bold'
                            }
                        }
                    },
                    labelLine: {
                        normal: {
                            show: false
                        }
                    },
                    data:[
                        {value:buyMoney, name:'买样费'},
                        {value:sampleMoney, name:'采样费'},
                        {value:checkMoney, name:'检测费'}
                    ]
                }
            ]
        });
        myBar1.setOption({
            title:{
                text:'抽检所耗费用排名前十',
                textStyle: {
                    fontSize: '18',
                }
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
                    data:typetopData,
                }
            ]
        });
    }

    handleOperator = (type,item)=> {
        if (type == 'detail') {
            axios.ajax({
                url: '/spotCheckStatistics/getListByOrg',
                data: {
                    params: {
                        org: item.org
                    }
                }
            }).then((res) => {
                if (res.status == 'success') {
                    let typetop = res.data.map((item, i) => {
                        item.key = i;
                        return item;
                    })
                    this.setState({
                        expensetype: typetop
                    })
                }
            })
        } else if (type == 'view') {
            axios.ajax({
                url: '/spotCheckStatistics/getListByTypeTopTen',
                data: {
                    params: {
                        type: item.type,
                        org: item.org
                    }
                }
            }).then((res) => {
                if (res.status == 'success') {
                    let typetop = res.data.map((item, i) => {
                        item.key = i;
                        return item;
                    })
                    let typetopData  = typetop.map((item,i)=>{
                        item.key = i;
                        return {
                            value:item.total,
                            name:item.name
                        }
                    })
                    this.setState({
                        typetop: typetop,
                        typetopData:typetopData
                    })
                }this.createCharts()
            })
        }console.log(this.state.typetopData)
    }
    render() {
        const expense=this.props.expense;
        const columns = [
            {
                title:"检测机构",
                dataIndex:"org"
            },{
                title:"买样费(元)",
                dataIndex:"buy"
            },{
                title:"采样费(元)",
                dataIndex:"sample"
            },{
                title:"检测费用(元)",
                dataIndex:"checkMoney"
            },{
                title:"合计(元)",
                dataIndex:"total"
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
                title:"食品类别",
                dataIndex:"type"
            },{
                title:"买样费(元)",
                dataIndex:"buy"
            },{
                title:"采样费(元)",
                dataIndex:"sample"
            },{
                title:"检测费用(元)",
                dataIndex:"checkMoney"
            },{
                title:"合计(元)",
                dataIndex:"total"
            },{
                title:"操作",
                dataIndex:"operation",
                render:(text,item)=>{
                    return <div className="textButton" onClick={()=>{this.handleOperator('view',item)}}>详情</div>
                }
            }
        ];
        const columns2 = [
            {
                title:"样品名称",
                dataIndex:"name"
            },{
                title:"买样费(元)",
                dataIndex:"buy"
            },{
                title:"采样费(元)",
                dataIndex:"sample"
            },{
                title:"检测费用(元)",
                dataIndex:"checkMoney"
            },{
                title:"合计(元)",
                dataIndex:"total"
            }
        ];
        return (
            <div>
                <Row>
                    <Col span={9}>
                        <div id='moneyTable' style={{height: '320px', width: '280px',marginTop:8,marginLeft:50}}></div>
                        <div style={{marginTop:20,width:450}}>
                            <div className="titlefont" style={{fontSize:16,width:450,height:35,backgroundColor:'#FAFAFA',color:"#252525",border:'1px solid #ddd',verticalAlign:'middle'}}>各抽检机构抽检所耗费用统计分析表</div>
                            <Table
                                dataSource={expense}
                                columns={columns}
                                bordered={true}
                                pagination={false}
                            />
                        </div>
                    </Col>
                    <Col span={8}>
                        <div style={{marginTop:50,marginLeft:-17,width:420}}>
                            <div className="titlefont" style={{fontSize:16,width:420,height:35,backgroundColor:'#FAFAFA',color:"#252525",border:'1px solid #ddd',verticalAlign:'middle'}}>食品类别抽检所耗费用统计分析表</div>
                            <Table
                                dataSource={this.state.expensetype}
                                columns={columns1}
                                bordered={true}
                                pagination={false}
                            />
                        </div>
                    </Col>
                    <Col span={7}>
                        <div>
                            <div id='moneyTable1' style={{height: '250px', width: '315px',marginLeft:5,marginTop:20}} ></div>
                        </div>
                        <div style={{marginTop:35,width:350}}>
                            <div className="titlefont" style={{fontSize:16,width:350,height:35,backgroundColor:'#FAFAFA',color:"#252525",border:'1px solid #ddd',verticalAlign:'middle'}}>抽检所耗费用排名前十样品</div>
                            <Table
                                dataSource={this.state.typetop}
                                columns={columns2}
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