import React,{Component} from 'react';
import {Col,Row,Modal,Table } from 'antd';
import ETable from '../../../../components/ETable';
import axios from "../../../../axios";
import Utils from "../../../../utils";
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
        const teamitem = this.props.team2;
        const teamyes=this.props.yes2;
        const teamno=this.props.no2;
        const teamtotal=this.props.total2;
        // 绘制图表
        myBar.setOption({
            color: ['#90C589', '#E25B33', '#86C2CF'],
        backgroundColor: 'rgba(46, 126, 139, 0.00)',
        tooltip: {
            trigger: 'axis'
        },
        title : {
            text: '历下区各所快检数据统计',
            x:'center',
            y:10,
             textStyle: {
                fontSize: 16,
               },
        },
        legend: {
            data:['合格','不合格','快检总批次'],
            textStyle: {
                color: '#6593B7'
            },
            itemWidth:5,
            itemHeight:5,
            top:'bottom',
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
                interval:0,  //类目全显
                fontSize:12,
               // rotate:40
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
                name:'合格',
                type:'bar',
                data:teamyes,
                barWidth : 20,
            },
            {
                name:'不合格',
                type:'bar',
                data:teamno,
                barWidth : 20,
            },
            {
                name:'快检总批次',
                type:'line',
                data:teamtotal
            }
        ]
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
                let list  = res.data.list2.map((item,i)=>{
                    item.key = i;
                    return item;
                })                
                this.setState({
                    list:list,
                })
                let total  = res.data.list1.map((item)=>{
                    return item.total;
                })  
                let yes  = res.data.list1.map((item)=>{
                    return item.yes;
                })  
                let no  = res.data.list1.map((item)=>{
                    return item.no;
                })  
                let percent  = res.data.list1.map((item)=>{
                    return item.percent;
                })                  
                this.setState({
                    total,
                    no,
                    yes,
                    percent,
                })              
            }//console.log( res.data.list1)
        })
       
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
              url:'/quickCheckStatistics/getListByTeamTopTen',
                 data: {
                    params: {
                         team: item.team,
                            }
                        }
                    }).then((res)=>{
                        if(res.status == 'success'){
                            let list1  = res.data.map((item,i)=>{
                                item.key = i;
                                return item;
                            })        
                            this.setState({
                                list1:list1,              
                            })
                        }
                    })
                }
         
    render() {
        const columns = [
           
            {
                title: '所属所队',
                dataIndex: 'team'
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
                   // console.log(record)
                    return <Row>
                            <Col ><div className='textButton'  onClick={() => { this.handleOperator(record)}}>不合格样品</div></Col>
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
    //     const teamitem = this.props;
    //   console.log(teamitem)
        return (
            
            <div className='indicators'style={{height:"1000px"}}>
            <div className='box' style={{marginLeft:'30px',}}>
                <div className='boxName' style={{color:'#479AD0'}}>全局快检总批次</div>
                <div  className='boxNumber'style={{backgroundColor:'#479AD0'}}>{this.state.total}</div>
            </div>
            <div className='box' style={{width:'100px',}}>
                <div className='boxNumber'style={{width:'100px',color:'#09649A',marginTop:'80px',fontSize:80,backgroundColor:'transparent'}}>=</div>
            </div>
            <div className='box' >
                <div className='boxName' style={{color:'#BF6B69'}}>合格批次</div>
                <div className='boxNumber' style={{backgroundColor:'#BF6B69'}}>{this.state.yes}</div>
            </div>
            <div className='box' style={{width:'100px',}}>
                <div className='boxNumber'style={{width:'100px',color:'#09649A',marginTop:'80px',fontSize:80,backgroundColor:'transparent'}}>+</div>
            </div>
            <div className='box'>
                <div className='boxName'  style={{color:'#479AD0'}}>不合格批次</div>
                <div className='boxNumber'style={{backgroundColor:'#479AD0'}}>{this.state.no}</div>
            </div>
            <div className='box' style={{marginLeft:'50px',}}>
                <div className='boxName' style={{color:'#BF6B69',}}>问题发现率</div>
                <div className='boxNumber'style={{backgroundColor:'#BF6B69'}}>{this.state.percent}</div>
            </div>
            <div style={{clear:'both'}}></div>
            {/* <ReactEcharts
                        option={this.option}
                        style={{height: '300px'}} />  */}
                        <div id='officeTable' style={{height: '300px'}}></div>
                        <div className='boxN'>
                         <div style={{float:'left',marginTop:30,width:800,marginLeft:20}}>
                         <div className="titlefont" style={{textAlign: 'center',fontSize:16,width:800,height:35,backgroundColor:'#FAFAFA',color:"#252525",lineHeight:2,verticalAlign:'middle'}}>各所-快检-统计分析表</div>  
                             
                        <ETable
                            updateSelectedItem={Utils.updateSelectedItem.bind(this)}
                            selectedRowKeys={this.state.selectedRowKeys}
                            selectedIds={this.state.selectedIds}
                            selectedItem={this.state.selectedItem}
                            dataSource={this.state.list}
                            columns={columns}
                            pagination={false}
                        />
                    </div>
                    <div style={{float:'left',marginTop:30,width:450,marginLeft:20,marginRight:20,marginBottom:20}}>
                    <div className="titlefont" style={{textAlign: 'center',fontSize:16,width:450,height:35,backgroundColor:'#FAFAFA',color:"#252525",lineHeight:2,verticalAlign:'middle'}}>不合格排名前十样品</div>
                        
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
export default FoodBusiness;
