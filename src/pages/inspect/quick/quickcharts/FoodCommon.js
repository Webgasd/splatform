import React,{Component} from 'react';
import {Table,Col,Row,Modal } from 'antd';
import ETable from '../../../../components/ETable';
import axios from "../../../../axios";
import Utils from "../../../../utils";
import echarts from 'echarts/lib/echarts';
class violationRate extends Component {
    constructor(props) {
        super(props);
        this.state = {
            tempTeamData: []
        }
    }

    requestList = ()=>{    
        axios.ajax({
            url:'/quickCheckStatistics/getListAll',
            data:{
                params:this.params
            }
        }).then((res)=>{
            if(res.status == "success"){
                let list3  = res.data.list3.map((item,i)=>{
                    item.key = i;
                    return item;
                })
                this.setState({
                    list:list3,
                })
            }
        })
    }
    componentDidMount(){
        this.requestList();
        this.createCharts();
        this.createCharts1();
    }
    componentWillReceiveProps(nextProps, nextContext) {
        this.createCharts();
        this.createCharts1();
    }
    createCharts() {
        const myBar = echarts.init(document.getElementById('officeTable'));
        const teamitem = this.props.type3;
        const teamyes=this.props.yes3;
        const teamno=this.props.no3;
        const teamtotal=this.props.total3;
        // 绘制图表
        myBar.setOption({
            title : {
                text: '食品类别快检数据统计',
                x:'center',
                
            },
            grid:{
               x:80
            },
            color: ['#90ED7D', '#444349', '#7CB5EC'],
            backgroundColor: 'rgba(46, 126, 139, 0.00)',
            tooltip: {
                trigger: 'axis'
            },
            legend: {
                data:['不合格','合格','总批次'],
                textStyle: {
                    color: '#6593B7'
                },
                y:'bottom'
            },
            xAxis: [ {
                type: 'value',
                boundaryGap:true,            
                axisLine: {
                    lineStyle: {
                        color: '#6593B7'
                    }
                },
                axisLabel: {
                    color:'#6593B7',
                    interval:0,  //类目全显
                },
            }],
            yAxis: [{
                type: 'category',
                data: teamitem,
                axisLine: {
                    lineStyle: {
                        color: '#6593B7'
                    }
                },
            }],
            series: [
                {
                    name: '不合格',
                    type:'bar',
                    stack: 'three',
                    data:teamno,
                    barWidth : 8,
                },
                {   name: '合格',
                    type:'bar',
                    stack: 'three',
                    data: teamyes,
                    barWidth : 8,
                //     itemStyle: {
                //         normal:{  
                //         color: function (params){
                //             var colorList = ['#FADD4B','#5AC7E6','#EB5228','#FADD4B','#59C25C','#3063F6','#5AC7E6','#EB5228','#FADD4B','#59C25C','#3063F6','#5AC7E6','#EB5228'];
                //             return colorList[params.dataIndex];
                //         }
                //     },
                // }
            },
            {
                name: '总批次',
                type:'bar',
                stack: 'three',
                data: teamtotal,
                barWidth : 8,
            //     itemStyle: {
            //         normal:{  
            //         color: function (params){
            //             var colorList = ['#5AC7E6','#EB5228','#FADD4B','#59C25C','#3063F6','#5AC7E6','#EB5228','#FADD4B','#59C25C','#3063F6','#5AC7E6','#EB5228','#FADD4B',];
            //             return colorList[params.dataIndex];
            //         }
            //     },
            // }
        }
            ]
        });
    }
    createCharts1() {
        const myBar = echarts.init(document.getElementById('officeTable1'));
        const tempTeamData = this.state.tempTeamData
        // 绘制图表
        myBar.setOption({
            tooltip : {
                trigger: 'item',
                formatter: "{a} <br/>{b} : {d}%"
            },
            series : [
                {
                    name:'排名前十不合格样品',
                    type: 'pie',
                    radius : '50%',
                    data: tempTeamData,
                    label: {
                            normal: {
                                formatter: '{b}',
                            }
                    }
                }
            ]
        });
    }
    start = () => {
        this.setState({
            selectedRowKeys1: [],
            selectedRowKeys: [],
        })
    }
    onSelectChange = (selectedRowKeys,selectedRowKeys1) => {
        Modal.info('selectedRowKeys changed: ', selectedRowKeys,selectedRowKeys1,);
        this.setState({ selectedRowKeys,selectedRowKeys1, });
    }
    handleOperator = (item)=>{
        //  console.log(item)
             axios.ajax({
                url:'/quickCheckStatistics/getListByTypeTopTen',
                   data: {
                      params: {
                           type: item.type,
                              }
                          }
                      }).then((res)=>{
                          if(res.status == 'success'){
                            let list1  = res.data.map((item,i)=>{
                                item.key = i;
                                return item;
                            })
                            let tempTeamData = list1.map((item)=>{
                                return {
                                    value: item.no,
                                    name: item.checkName
                                };
                            }) 
                            this.setState({
                                list1:list1,
                                tempTeamData: tempTeamData        
                            })
                            this.createCharts1()
                          }
                      })
                  }
       
    render() {
        const columns = [         
            {
                title: '食品类别',
                dataIndex: 'type'
            },{
                title: '快检总批次',
                dataIndex: 'total',
            },{
                title: '合格（批次）',
                dataIndex: 'yes'
            },
            {
                title: '不合格（批次）',
                dataIndex: 'no',
            }, {
                title: '问题发现率',
                dataIndex: 'percent',
            },
            {
                title: '操作按钮',
                dataIndex:'operation',
                render:(text, record)=>{
                    return <Row>
                            <Col ><div className='textButton' onClick={() => { this.handleOperator(record)}}>详情</div></Col>
                        </Row>
                }}

        ];
        const columns1 = [       
          {
                title: '样品名称',
                dataIndex: 'checkName',
            },
            {
                title: '不合格（批次）',
                dataIndex: 'no',
            },
        ];
        return (
            <div>
        <div style={{float:'left',marginTop:30,width:400}}>
        <div id='officeTable' style={{height: '650px', width: '400px'}}></div>   
                        </div> 
                         <div style={{float:'left',marginTop:30,width:500,marginLeft:20}}>
                         各所食品类别快检统计分析表
                        <ETable
                            updateSelectedItem={Utils.updateSelectedItem.bind(this)}
                            selectedRowKeys={this.state.selectedRowKeys}
                            selectedIds={this.state.selectedIds}
                            selectedItem={this.state.selectedItem}
                            dataSource={this.state.list}
                            pagination={false}
                            columns={columns}
                            row_selection = 'checkbox'
                        />
                    </div>
                    <div style={{float:'left',marginTop:30,width:300,marginLeft:20,marginRight:20}}>
                       <div style={{marginTop:30,width:300,height:300,marginLeft:20,marginRight:20}}> 排名前十不合格样品
                       <div id='officeTable1' style={{width:300,height:300}}></div>  
                       </div>
                       <div style={{marginTop:30,width:300,marginLeft:20,marginRight:20}}>
                       排名前十不合格样品
                       <Table
                            dataSource={this.state.list1}
                            columns={columns1}
                            pagination={false}
                        />
                    </div>      
                    </div>       
        
              
            </div>
        )
    }
}

export default violationRate