import React,{Component} from 'react';
import { Card,Button,Modal,Collapse,message } from 'antd';
import  BaseForm  from '../../../components/BaseForm';
import ETable from '../../../components/ETable';
import Utils from "../../../utils";
import axios from "../../../axios";
import AddForm from './AddForm';
import './style.less';
import moment from "moment";
import {commonUrl} from "../../../axios/commonSrc";
import connect from "react-redux/es/connect/connect";
const Panel = Collapse.Panel;

@connect(
    state=>({
        areaList:state.areaList,
        acl:state.acls['/Business/restaurantscheck']
    })
)
class restaurantscheck extends Component{
    state = {
        selectedRowKeys: [], // Check here to configure the default column
      };
    params = {
        pageNo:1
    }

    //调用封装好的axios.requestList()获取角色数据
    componentDidMount(){
        this.requestList();
        this.requestAllArea();
    }
    requestList = ()=>{
        let _this = this;
        axios.ajax({
            url:'/inspect/dailyFood/getPage',
            data:{
                params:{...this.params,industry:2}
            }
        }).then((res)=>{
            if(res.status == "success"){
                let list  = res.data.data.map((item,i)=>{
                    item.key = i;
                    return item;
                })
                this.setState({
                    list:list,
                    pagination:Utils.pagination(res,(current)=>{
                        _this.params.pageNo = current;
                        _this.requestList(); //刷新列表数据
              })
                })
            }
        })
    }

    requestAllArea=()=>{
        axios.noLoadingAjax({
            url:'/sys/area/getAll',
            data:{
                params:{}
            }
        }).then((res)=>{
            if(res.status == "success"){
                this.setState({
                    areaAllList: res.data
                })
            }
        })
    }

    // 查询表单
    handleFilterSubmit = (filterParams) => {
        this.params = filterParams;
        this.requestList();
    };

    handleSubmit = ()=>{
        let data = this.state.inspectData;
        if(data.checkResult=='不符合'||data.checkResult=='基本符合'){
            message.warning("请添加责令整改文书")
        }
        data.status = 1;
        let type =this.state.type;
        axios.PostAjax({
            url:type=='create'?'/inspect/dailyFood/insert':'/inspect/dailyFood/update',
            data:{
                params:data
            }
        }).then((res)=>{
            if(res){
                this.setState({
                    isVisible:false,
                    inspectData:{}
                })
                this.requestList();
            }
        })
    }

    handleSubmitEnd = ()=>{
        let type =this.state.type;
        let data = this.state.inspectData;
        data.status = 2;
        data.checkCount = data.checkCount+1;
        axios.PostAjax({
            url:type=='create'?'/inspect/dailyFood/insert':'/inspect/dailyFood/update',
            data:{
                params:data
            }
        }).then((res)=>{
            if(res){
                this.setState({
                    isVisible:false,
                    inspectData:{}
                })
                this.requestList();
            }
        })
    }

    handleDelete = ()=>{
        let item = this.state.selectedItem;
        let _this = this;
            if(!item){
                Modal.info({
                    title: '信息',
                    content: '请选择一个用户'
                })
                return;
            }
            Modal.confirm({
                content:'确定要删除此用户吗？',
                onOk:()=>{
                    axios.ajax({
                        url:'/post.json',
                        data:{
                            params:{
                                id:item.id
                            }
                        }
                    }).then((res)=>{
                        if(res.status == "success"){
                            _this.setState({
                                isVisible:false
                            })
                            _this.requestList();
                        }
                    })
                }
            })
        }

    onSelectChange = (selectedRowKeys) => {
        Modal.info('selectedRowKeys changed: ', selectedRowKeys);
        this.setState({ selectedRowKeys });
      }

    handleOperator = (type,item)=>{
      if(type =='create'){
          axios.ajax({
              url:'/inspect/dailyFood/getEmptyList',
              data:{
                  params:{
                      industryId:2,
                  }
              }
          }).then((res)=>{
              if(res.status =='success'){
                  let data = {};
                  data.list=res.data.list.map((item,i)=>{
                      item.key = i+1;
                      return item;
                  });
                  data.checkDate=moment().format('YYYY-MM-DD');
                  data.checkStartHour=moment().format('HH');
                  data.checkStartMinute=moment().format('mm');
                  data.checkEndHour=moment().format('HH');
                  data.checkEndMinute=moment().format('mm');
                  data.industry=2;
                  data.supervisor=(res.data.gaInfo||{}).name;
                  data.supervisorNumber=(res.data.gaInfo||{}).enforce;
                  data.checkTotal=(res.data.list||[]).length;
                  data.checkType=1
                  this.setState({
                      title:'添加信息',
                      isVisible:true,
                      inspectData:data,
                      type
                  })
              }
          })
         }else if(type=="edit" || type =='detail'){
          axios.ajax({
              url:'/inspect/dailyFood/getList',
              data:{
                  params:{
                      industryId:2,
                      checkId:item.id
                  }
              }
          }).then((res)=>{
               item.list=res.data.clauseList.map((record,i)=>{
                   record.key = i+1;
                   return record;
               });
              item.checkTotal=(res.data.clauseList||[]).length
              this.setState({
                  title:type=='edit'?'编辑':'查看详情',
                  isVisible:true,
                  inspectData:{...item,document:JSON.parse(item.document||JSON.stringify([]))},
                  type
              })
             })
          }else if(type=="delete"){
          Modal.confirm({
              content:'确定要删除此检查信息吗？',
              onOk:()=>{
                  axios.ajax({
                      url: '/inspect/dailyFood/delete',
                      data: {
                          params: {
                              id: item.id
                          }
                      }
                  }).then((res)=>{
                      if(res.status == 'success'){
                          this.setState({
                              isVisible:false
                          })
                          this.requestList();
                      }
                  })
              }
          })
      }}
          handleDaily=(key)=>{}

    render() {
        let _this =this;
        const modalFooter = <div>
            {this.state.type=='create'?null:<Button type="primary" style={{marginLeft:5}} onClick={()=> window.open(commonUrl+'/inspect/dailyFood/pointDownload?checkId='+this.state.inspectData.id+'&industryId='+2)}>导出检查要点表</Button>}
            {this.state.type=='create'?null:<Button type="primary" style={{marginLeft:5}} onClick={()=> window.open(commonUrl+'/inspect/dailyFood/recordDownload?checkId='+this.state.inspectData.id+'&industryId='+2)}>导出检查记录表</Button>}
            {this.state.type=='detail'?null:<Button type="primary" style={{marginLeft:5}} onClick={this.handleSubmitEnd}>结束本次检查</Button>}
            {this.state.type=='detail'?null:<Button type="primary" style={{marginLeft:5}} onClick={this.handleSubmit}>暂存</Button>}
        </div>


        const columns = [
            {
                title: '年度',
                dataIndex: 'operatorTime',
                render:(record)=>{
                    return record===''?moment():moment(record).format("YYYY-MM-DD")
                }
                
            }, {
                title: '检查类型',
                dataIndex: 'checkType',
                render(checkType){
                    if(checkType==1){
                        return "日常检查"
                    }
                }
            },{
                title: '所属区域',
                dataIndex: 'region',
                render(region){
                    let data=(_this.state.areaAllList||[]).find((item)=>item.id==region)||{};
                    return data.name;
                }
            },
            {
                title: '被检单位（对象）',
                dataIndex: 'checkObject',             
            },
            {
                title: '检查日期',
                dataIndex: 'checkDate',             
            },
            {
                title: '检查人员',
                dataIndex: 'supervisor',             
            },
            {
                title: '检查结果',
                dataIndex: 'checkResult',             
            },
            {
                title: '结果处理',
                dataIndex: 'resultProcess',             
            },
            {
                title: '巡查频次',
                dataIndex: 'checkFrequence',             
            },
            {
                title: '本年度第_次检查',
                dataIndex: 'checkCount',             
            },
            {
                title: '是否整改复查',
                render(text, record){
                    let checkResult = record.checkResult;
                    return checkResult =='符合' ?'否':'是';
                }            
            },
            {
                title: '完成情况',
                dataIndex: 'status',
                render(status){
                    return status ==2 ? '已完成':'未完成';
                }        
            },
            {
                title: '操作',
                dataIndex:'operation',
                render:(text, record)=>{                
                    return <div className='textButtonBox'>
                        <div className='textButton' onClick={()=> {this.handleOperator('detail',record)}}>查看</div>
                        {record.status==1?<div className='textButton'  onClick={()=> {this.handleOperator('edit',record)}}>办理</div>:null}
                        {this.props.acl.indexOf('/delete')>-1? <div className='textButton'  onClick={()=> {this.handleOperator('delete',record)}}>删除</div>:null}
                        <div className='textButton'  onClick={()=> {this.handleDaily(record.key)}}>日志</div>
                    </div>
                }
            }
        ];


        // 表单封装，通过构建表单对象，在BaseForm中进行统一渲染
        const formList = [
            {
                type: 'SELECT',
                label: '年度',
                field: 'checkDate',
                placeholder: '请选择年度',
                width: 150,
                list: [{id: '2022', name: '2022'},{id: '2021', name: '2021'},{id: '2020', name: '2020'},{id: '2019', name: '2019'}, {id: '2018', name: '2018'}, {id: '2017', name: '2017'}]
            },  {
                type: 'SELECT',
                label: '检查类型',
                field: 'checkType',
                placeholder: '请选择检查类型',
                width: 150,
                list: [{id: 1, name: '日常检查'}, {id:2, name: '双随机'}, {id: 3, name: '专项检查'}]
            },
            {
                type: 'AREA_TREE',
                label: '所在区域',
                field: 'region',
                placeholder: '请选择所在区域',
                width: 150,
                list: Utils.getDataSource(this.props.areaList||[])
            },
            {
                type: 'INPUT',
                label: '被检单位(对象)',
                field: 'checkObject',
            },
            {
                type: 'INPUT',
                label: '检查人员',
                field: 'supervisor',
            },
            {
                type: 'SELECT',
                label: '完成情况',
                field: 'status',
                placeholder: '请选择完成情况',
                width: 150,
                list: [{id: 1, name: '正在检查'}, {id: 2, name: '已完成'}]
            },
            {
                type: 'INPUT',
                label: '巡查频次',
                field: 'checkFrequence',
            },
            {
                type: 'SELECT',
                label: '检查结果',
                field: 'checkResult',
                placeholder: '请选择检查结果',
                width: 150,
                list: [{id: '符合', name: '符合'}, {id: '基本符合', name: '基本符合'}, {id: '不符合', name: '不符合'}]
            },
            {
                type: 'INPUT',
                label: '结果处理',
                field: 'resultProcess',
            },
            {
                type: 'INPUT',
                label: '检查次数',
                field: 'checkCount',
            },
        ]
       
        return (
            <div ref='restaurantscheck'>
              <Card>
                <Collapse >
                 <Panel header="查询" key="1" >
                 <BaseForm formList={formList} filterSubmit={this.handleFilterSubmit}/>
                </Panel>
                </Collapse> 
                </Card>

                <Card style={{marginTop:10}}>
                <div className='button-box'>
                 <Button type="primary" onClick={()=>this.handleOperator('create',null)}>添加</Button>
                </div>
                    <div style={{marginTop:30}}>
                        <ETable
                            updateSelectedItem={Utils.updateSelectedItem.bind(this)}
                            selectedRowKeys={this.state.selectedRowKeys}
                            selectedIds={this.state.selectedIds}
                            selectedItem={this.state.selectedItem}
                            dataSource={this.state.list}
                            pagination={this.state.pagination}                          
                            columns={columns}
                            row_selection = 'checkbox'
                        />
                    </div>
                </Card>
                <Modal
                    title={this.state.title}
                    visible={this.state.isVisible}
                    destroyOnClose={true}
                    maskClosable={false}
                    getContainer={()=>this.refs.restaurantscheck}
                    width={900}
                    footer={modalFooter}
                    onCancel={()=>{
                        this.setState({
                            isVisible:false,
                            inspectData:{}
                        })
                    }}
                >
                <AddForm inspectData={this.state.inspectData||{}} dispatchInspectData={(data)=>this.setState({inspectData:data})} type={this.state.type}/>
                </Modal>
            </div>
        );
    }
}

export default restaurantscheck;