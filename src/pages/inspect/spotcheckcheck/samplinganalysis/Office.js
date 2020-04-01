import React,{Component} from 'react';
import {Col, Table, Input, Row, Select, Modal} from "antd";
import './style.less'
import axios from "../../../../axios";
import Utils from "../../../../utils";
import echarts from 'echarts/lib/echarts';

class Office extends Component{
    state={
        selectedRowKeys: [], // Check here to configure the default column
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
        const myBar = echarts.init(document.getElementById('officeTable'));
        const myBar1 = echarts.init(document.getElementById('officeTable1'));
        const {teamitem} = this.props;
        const {teamtotal}=this.props;
        const {teamyes}=this.props;
        const {teamno}=this.props;
        const {teamstepstep}=this.state;
        const {teamsteptotal}=this.state;
        const {teamstepyes}=this.state;
        const {teamstepno}=this.state;
        console.log(teamstepstep)
        // 绘制图表
        myBar.setOption({
            title: {
                text: '各所抽检数据统计'
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
            toolbox: {
                // feature: {
                //     saveAsImage: {}
                // }
            },
            xAxis: {
                type: 'category',
                boundaryGap: true,
                data:teamitem,
                axisLabel: {
                    show: true,
                    rotate:15,
                },
            },
            yAxis: {
                type: 'value'
            },
            series: [
                {
                    name:'合格',
                    type:'line',
                    data:teamyes
                },
                {
                    name:'不合格',
                    type:'line',
                    data:teamno
                },
                {
                    name:'抽检总批次',
                    type:'line',
                    data:teamtotal
                }
            ]
        });
        myBar1.setOption({
            title: {
                text: '各环节抽检情况',
                textStyle: {
                    fontSize: '14',
                }
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
            toolbox: {
                // feature: {
                //     saveAsImage: {}
                // }
            },
            xAxis: {
                type: 'category',
                boundaryGap: true,
                data:teamstepstep
            },
            yAxis: {},
            series: [
                {
                    name:'合格',
                    type:'bar',
                    barWidth:'25',
                    data:teamstepyes
                },
                {
                    name:'不合格',
                    type:'bar',
                    barWidth:'25',
                    data:teamstepno
                },
                {
                    name:'抽检总批次',
                    type:'bar',
                    barWidth:'25',
                    data:teamsteptotal
                }
            ]
        });
    }

    handleOperator = (type,item)=>{
        if(type =='detail'){
            axios.ajax({
                url: '/spotCheckStatistics/getListTeamStepResultByTeam',
                data: {
                    params: {
                        team:item.team
                    }
                }
            }).then((res)=>{
                if(res.status == 'success'){
                    let teamstep  = res.data.map((item,i)=>{
                        item.key = i;
                        return item;})
                    let teamstepstep  = teamstep.map((item,i)=>{
                        item.key = i;
                        return item.step;})
                    let teamsteptotal  = teamstep.map((item,i)=>{
                        item.key = i;
                        return item.total;})
                    let teamstepyes  = teamstep.map((item,i)=>{
                        item.key = i;
                        return item.yes;})
                    let teamstepno  = teamstep.map((item,i)=>{
                        item.key = i;
                        return item.no;})
                    this.setState({
                        teamstep:teamstep,
                        teamstepstep:teamstepstep,
                        teamsteptotal:teamsteptotal,
                        teamstepyes:teamstepyes,
                        teamstepno:teamstepno
                    })
                }this.createCharts()
                //console.log(this.state.teamstepstep)
            })
        }
    }

    render(){
        const list=this.props.office||[];
        const team=this.props.team;

        const columns = [
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
            },{
                title:"操作",
                dataIndex:"operation",
                render:(text,item)=>{
                    return <div className="textButton" onClick={()=>{this.handleOperator('detail',item)}}>环节</div>
                }
            }
        ];
        const columns1 = [
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
            }
        ];
        return (
            <div>
                {list.map((item,index)=>(
                <Row style={{height:100,marginTop:20,marginLeft:135,width:1050}}>
                    <tr>
                        <td><div className="divfont" style={{fontSize:22,marginLeft:20,width:200,color:"#149BD5",border:'1.5px solid #149BD5',verticalAlign:'middle'}}>全局抽检总批次</div></td>
                        <td><div className="divfont" style={{fontSize:22,marginLeft:80,width:200,color:"#CD6566",border:'1.5px solid #CD6566',verticalAlign:'middle'}}>合格(批次)</div></td>
                        <td><div className="divfont" style={{fontSize:22,marginLeft:80,width:200,color:"#149BD5",border:'1.5px solid #149BD5',verticalAlign:'middle'}}>不合格(批次)</div></td>
                        <td><div className="divfont" style={{fontSize:22,marginLeft:35,width:200,color:"#CD6566",border:'1.5px solid #CD6566',verticalAlign:'middle'}}>问题发现率</div></td>
                    </tr>
                    <Col span={4} style={{margin:5,marginLeft:20,marginRight:30,background:"#149BD5",height:45,width:200}}>
                        <div className="divfont" style={{fontSize:28,color:"white",marginTop:1,fontWeight:1000,width:200}}>{item.total}</div>
                    </Col>
                    <Col span={4} style={{width:45}}>
                        <div style={{fontSize:30,color:"#036598",fontWeight:1000,marginLeft:0,marginTop:1}}>=</div>
                    </Col>
                    <Col span={4} style={{margin:5,marginRight:30,background:"#CD6566",height:45,width:200}}>
                        <div className="divfont" style={{fontSize:28,color:"white",marginTop:1,fontWeight:1000,width:200}}>{item.yes}</div>
                    </Col>
                    <Col span={4} style={{width:45}}>
                        <div style={{fontSize:30,color:"#036598",fontWeight:1000,marginLeft:0,marginTop:1}}>+</div>
                    </Col>
                    <Col span={4} style={{margin:5,marginRight:30,background:"#149BD5",height:45,width:200}}>
                        <div className="divfont" style={{fontSize:28,color:"white",marginTop:1,fontWeight:1000,width:200}}>{item.no}</div>
                    </Col>
                    <Col span={4} style={{margin:5,marginRight:30,background:"#CD6566",height:45,width:200}}>
                        <div className="divfont" style={{fontSize:28,color:"white",marginTop:1,fontWeight:1000,width:200}}>{item.percent}</div>
                    </Col>
                </Row>
                    ))}
                <div id='officeTable' style={{height: '200px', width: '1100px',marginTop:20,marginLeft:100}}></div>
                <Row>
                    <Col span={13}>
                        <div style={{marginTop:45,width:600,marginLeft:50}}>
                            <div className="titlefont" style={{fontSize:16,width:600,height:35,backgroundColor:'#FAFAFA',color:"#252525",border:'1px solid #ddd',verticalAlign:'middle'}}>各所-抽检-统计分析表</div>
                            <Table
                                dataSource={team}
                                columns={columns}
                                bordered={true}
                                pagination={false}
                            />
                        </div>
                    </Col>
                    <Col span={10}>
                        <div id='officeTable1' style={{height:250, width:500,marginTop:45,marginLeft:25}}></div>
                        <div style={{marginTop:10,marginLeft:45,width:460}}>
                            <div className="titlefont" style={{fontSize:16,width:460,height:35,backgroundColor:'#FAFAFA',color:"#252525",border:'1px solid #ddd',verticalAlign:'middle'}}>各所各环节统计分析表</div>
                            <Table
                                dataSource={this.state.teamstep}
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