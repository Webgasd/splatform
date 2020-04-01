import React,{Component} from 'react';
import {Col, DatePicker, Input, Row, Select, Table} from "antd";
import './style.less'
import axios from "../../../../axios";
import echarts from "echarts/lib/echarts";

class Office extends Component{
    state={
        selectedRowKeys: [], // Check here to configure the default column
    }
    params = {
        pageNo:1
    }
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
        const myBar = echarts.init(document.getElementById('linkTable'));
        const {stepitem} = this.props;
        const {steptotal}=this.props;
        const {stepyes}=this.props;
        const {stepno}=this.props;
        console.log(stepitem)
        // 绘制图表
        myBar.setOption({
            title: {
                text: '各环节抽检情况'
            },
            tooltip: {
                trigger: 'axis'
            },
            legend: {
                data:['合格','不合格','抽检总批次']
            },
            grid: {
                left: '3%',
                right: '4%',
                bottom: '3%',
                containLabel: true
            },
            xAxis: {
                type: 'category',
                boundaryGap: true,
                data:stepitem
            },
            yAxis: {
                type: 'value',
            },
            series: [
                {
                    name:'合格',
                    type:'bar',
                    barWidth:'25',
                    data:stepyes
                },
                {
                    name:'不合格',
                    type:'bar',
                    barWidth:'25',
                    data:stepno
                },
                {
                    name:'抽检总批次',
                    type:'bar',
                    barWidth:'25',
                    data:steptotal
                }
            ]
        });
    }

    handleOperator = (type,item)=>{
        if(type =='detail'){
            axios.ajax({
                url: '/spotCheckStatistics/getListTeamStepResultByStep',
                data: {
                    params: {
                        step:item.step
                    }
                }
            }).then((res)=>{
                if(res.status == 'success'){
                    let stepteam  = res.data.map((item,i)=>{
                        item.key = i;
                        return item;})
                    this.setState({
                        stepteam:stepteam
                    })
                }
            })
        }
    }

    render(){
        const step=this.props.step;
        const columns = [
            {
                title:"抽检环节",
                dataIndex:"step"
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
                title:"所属所队",
                dataIndex:"team"
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
            }
        ];
        return (
            <div>
                <Row>
                    <Col span={14}>
                        <div id='linkTable' style={{height: '285px', width: '700px',marginTop:25}}></div>
                        <div style={{marginLeft:40,marginTop:40,width:600}}>
                            <div className="titlefont" style={{fontSize:16,width:600,height:35,backgroundColor:'#FAFAFA',color:"#252525",border:'1px solid #ddd',verticalAlign:'middle'}}>全局各环节统计分析表</div>
                            <Table
                                dataSource={step}
                                columns={columns}
                                bordered={true}
                                pagination={false}
                            />
                        </div>
                    </Col>
                    <Col span={10}>
                        <div style={{marginTop:70,width:500}}>
                            <div className="titlefont" style={{fontSize:16,width:500,height:35,backgroundColor:'#FAFAFA',color:"#252525",border:'1px solid #ddd',verticalAlign:'middle'}}>各所抽检统计分析表</div>
                            <Table
                                dataSource={this.state.stepteam}
                                columns={columns1}
                                bordered={true}
                                pagination={false}
                            />
                        </div>
                    </Col>
                </Row>


            </div>
        );
    }
}
export default Office;