import React,{Component} from 'react';
import { Card,Button,Modal,Collapse,Row,Col } from 'antd';
import ETable from '../../../components/ETable';
import  BaseForm  from '../../../components/BaseForm';
import AddForm from "./AddForm";
import Utils from "../../../utils";
import axios from "../../../axios";
const Panel = Collapse.Panel;
const formList = [
    {
        type: 'SELECT',
        label: '行业类别',
        field: 'kind',
        initialValue: '0',
        width: 150,
        list: [{id: '0', name: '食品经营企业'}, {id: '1', name: '餐饮服务单位'},{id: '2', name: '食品流通企业'}]
    },
    {
        type: 'SELECT',
        label: '检查项类型',
        field: 'checkItem',
        initialValue: '0',
        width: 150,
        list: [{id: '0', name: '小作坊'}, {id: '1', name: '小餐饮'},{id: '2', name: '食品摊贩'}]
    },
    {
        type: 'INPUT',
        label: '检查项目',
        field: 'largeClassName',
    },
    {
        type: 'INPUT',
        label: '检查内容',
        field: 'clauseName',
    }

]

export default class configmanagersmall extends Component{
    state = {
        selectedRowKeys: [], // Check here to configure the default column

      };
    params = {
        pageNo:1
    }



    //调用封装好的axios.requestList()获取角色数据
    componentDidMount(){
        this.requestList();
    }
    requestList = ()=>{
        let _this = this;
        axios.ajax({
            url:'/inspect/clauseConf/getPage',
            data:{
                params:this.params
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
                        _this.params.pageNo = current;//	当前页数
                        _this.requestList(); //刷新列表数据
              })
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
        let data = this.addForm.props.form.getFieldsValue();//获取表单的值
        let type =this.state.type;
        axios.ajax({
            url:type=='create'?'/inspect/clauseConf/insert':'/inspect/clauseConf/update',
            data:{
                params:{
                    ...data
                }
            }
        }).then((res)=>{
            if(res){
                this.setState({
                    addInfo:'',
                    isVisible:false //关闭弹框
                })
                this.addForm.props.form.resetFields();
                this.requestList();
            }
        })
    }

    start = () => {

        // ajax request after empty completing
          this.setState({
            selectedRowKeys: [],
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
              this.setState({
                  title:'创建配置',
                  isVisible:true,
                  type
              })
          }else if(type=="edit"){

              this.setState({
                  title:'编辑配置',
                  isVisible:true,
                  addInfo:item,
                  type
              })
          }else if(type=="delete"){
              Modal.confirm({
                  content:'确定要删除此用户吗？',
                  onOk:()=>{
                      axios.ajax({
                          url: '/inspect/clauseConf/delete',
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
          }
      }


    render() {
        const columns = [
           {
                title: '检查项类型',
                dataIndex: 'checkItem',
            }, {
                title: '行业类别',
                dataIndex: 'industryName',

            },
            {
                title: '序号',
                dataIndex: 'seq'
            },
            {
                title: '检查项目名称',
                dataIndex: 'largeClassName'
            },{
                title: '检查内容',
                dataIndex: 'clauseName',

            },
            {
                title: '重要性',
                dataIndex: 'importance',
                render(importance){
                    return {1:'一般项',2:'关键项',3:'合理缺项',4:'特殊项'}[importance]
                }

            },
            {
                title: '操作',
                dataIndex:'operation',
                render:(text, record)=>{

                    return <Row>
                        <Col span={12}><a  onClick={()=> {this.handleOperator('edit',record)}}>修改</a></Col>
                        <Col span={12}><a  onClick={() => {  this.handleOperator('delete',record)}}>删除</a></Col>
                    </Row>


                }
            }
        ];

        return (
            <div>

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
                            <Button type="primary" onClick={this.handleDelete}>删除</Button>
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
                    width='600px'
                    title={this.state.title}
                    visible={this.state.isVisible}
                    onOk={this.handleSubmit}
                    onCancel={()=>{
                        this.addForm.props.form.resetFields();
                        this.setState({
                            isVisible:false,
                            addInfo:''
                        })
                    }}
                >
                   <AddForm addInfo={this.state.addInfo||{}} type={this.state.type} wrappedComponentRef={(inst) => this.addForm = inst }/>
                </Modal>
            </div>
        );
    }
}
