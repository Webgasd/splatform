import React,{Component} from 'react';
import { Card,Button, Form, Tabs,Input, Select,Radio, Badge,Modal, DatePicker ,Collapse, message } from 'antd';
import  BaseForm  from '../../../components/BaseForm';
import ETable from '../../../components/ETable';
import Utils from "../../../utils";
import axios from "../../../axios";

const Panel = Collapse.Panel;
const FormItem = Form.Item;
const Option = Select.Option;
const ButtonGroup = Button.Group;
const RadioGroup=Radio.Group;
const TabPane = Tabs.TabPane;
// 表单封装，通过构建表单对象，在BaseForm中进行统一渲染
const formList = [
     {
        type: 'TIME',
        label: '评定日期',
        field: 'date',
    }
]


export default class videop extends Component{
    state = {
        selectedRowKeys: [], // Check here to configure the default column
      
      };
    params = {
        page:1
    }


    
    //调用封装好的axios.requestList()获取角色数据
    componentDidMount(){
        this.requestList();
    }
    requestList = ()=>{
        let _this = this;
        axios.ajax({
            url:'/query.json',
            data:{
                params:{}
            }
        }).then((res)=>{
            if(res.status == "success"){
                let list  = res.result.item_list.map((item,i)=>{
                    item.key = i;
                    return item;
                })
                this.setState({
                    list:list,
                    pagination:Utils.pagination(res,(current)=>{
                        _this.params.page = current;//	当前页数
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
  
  
  
    handleAddSubmit = ()=>{
        let data = this.addForm.props.form.getFieldsValue();//获取表单的值
        axios.ajax({
            url:'/post.json',
            data:{
                params:{
                    ...data
                }
            }
        }).then((res)=>{
            if(res){
                this.setState({
                    isAddVisible:false //关闭弹框
                })
                this.requestList();
            }
        })
    }

    handleSubmit = ()=>{
        let data = this.userForm.props.form.getFieldsValue();//获取表单的值
        axios.ajax({
            url:'/post.json',
            data:{
                params:{
                    ...data
                }
            }
        }).then((res)=>{
            if(res){
                this.setState({
                    isVisible:false //关闭弹框
                })
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
                            _this.setState({
                                isVisible:false
                            })
                            _this.requestList();
                        }
                    })
                }
            })
        }
     handleDelete1 = (index)=>{
      Modal.confirm({
       title:'确认',              
       content:'您确认要删除此条数据吗？',
       onOk:()=>{
        message.success('删除成功');
       this.requestList(); }
            })     
        }
     
    onSelectChange = (selectedRowKeys) => {
        Modal.info('selectedRowKeys changed: ', selectedRowKeys);
        this.setState({ selectedRowKeys });
      }

    handleOperator = (item)=>{

              this.setState({
                  title:'查看'+item.name+'的量化分级详细信息',
                  isVisible:true,
                  userInfo:item,     
              })
          }
      

    
    render() {
        const columns = [
            {
                title: '监管所名称',
                dataIndex: 'name',
                
            }, {
                title: '已完成评定',
                dataIndex: 'ed'
            },{
                title: '未完成评定',
                dataIndex: 'ing',             
            },
            {
                title: '操作',
                dataIndex:'operation',
                render:(text, record)=>{                
                    return   <Button type="primary"  onClick={()=> {this.handleOperator(record)}}>查看详情</Button>  
                                      
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
                    
                    width={800}
                    onCancel={()=>{
                      this.userForm.props.form.resetFields();
                        this.setState({
                            isVisible:false,
                            userInfo:''
                        })
                    }}
                >
                <UserForm userInfo={this.state.userInfo} type={this.state.type} wrappedComponentRef={(inst) => this.userForm = inst }/>
                </Modal>
            </div>
        );
    }
}

class UserForm extends React.Component{

    state={ loading: true,isVisible:false}
    onChange = (checked) => {
      this.setState({ loading: !checked });
    }
    state={
        selectedRowKeys: [], 
       };
    
    
       componentDidMount(){
        this.requestList();
      
       }
    
     
    requestList = ()=>{
        let _this = this;
        axios.ajax({
            url:'/querying.json',
            data:{
                params:{}
            }
        }).then((res)=>{
            if(res.status == "success"){
                let list  = res.result.item_list.map((item,i)=>{
                    item.key = i;
                    return item;
                })
                this.setState({
                    list:list,
                    pagination:Utils.pagination(res,(current)=>{
                        _this.params.page = current;//	当前页数
                        _this.requestList1(); //刷新列表数据
              })
                })
            }
        })
    }
    
        start = () => {
          this.setState({
            selectedRowKeys: [],
          })
      }
       onSelectChange = (selectedRowKeys) => {   
        this.setState({ selectedRowKeys });
        }

      render(){
          
          const { loading } = this.state;
          const { getFieldDecorator } = this.props.form;
          const formItemLayout = {
              labelCol: {span: 5},
              wrapperCol: {span: 16}
          };
          const userInfo = this.props.userInfo || {};
          const type = this.props.type;
          function callback(key) {
           
          }
          
          const columns = [
            {
                title: '单位名称',
                dataIndex: 'name',
                
            }, {
                title: '企业名称',
                dataIndex: 'ename',              
            },
            {
                title: '法人/负责人',
                dataIndex: 'person',              
            },
            {
                title: '联系电话',
                dataIndex: 'phone',              
            },
            {
                title: '监管人员',
                dataIndex: 'checkperson',              
            }
        ];
      
    
          return (       
            <Tabs defaultActiveKey="1" onChange={callback}  >
            <TabPane tab="完成评级企业信息" key="1">
            <Extra userInfo={this.state.userInfo} type={this.state.type} wrappedComponentRef={(inst) => this.userForm = inst }/>
                  </TabPane>
                <TabPane tab="未完成评级企业信息" key="2" >
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
                </TabPane>    
                </Tabs>         
          );
      }
  }

  UserForm = Form.create({})(UserForm);
  class Extra extends Component{
    state={
     selectedRowKeys: [], 
    };
 
 
    componentDidMount(){
     this.requestList();
    }
 
    requestList = ()=>{
     let _this = this;
     axios.ajax({
         url:'/extra.json',
         data:{
             params:{}
         }
     }).then((res)=>{
         if(res.status == "success"){
             let list  = res.result.item_list.map((item,i)=>{
                 item.key = i;
                 return item;
             })
             this.setState({
                 list:list,
                 pagination:Utils.pagination(res,(current)=>{
                     _this.params.page = current;//	当前页数
                     _this.requestList(); //刷新列表数据
           })
             })
         }
     })
 }
 
 
     start = () => {
       this.setState({
         selectedRowKeys: [],
       })
   }
    onSelectChange = (selectedRowKeys) => {   
     this.setState({ selectedRowKeys });
     }
 
     render() {
        const columns = [
            {
                title: '单位名称',
                dataIndex: 'name',
                
            }, {
                title: '评定年度',
                dataIndex: 'year'
            },{
                title: '企业名称',
                dataIndex: 'ename',              
            },
            {
                title: '法人/负责人',
                dataIndex: 'person',              
            },
            {
                title: '联系电话',
                dataIndex: 'phone',              
            },
            {
                title: '检查人员',
                dataIndex: 'checkperson',              
            },
            {
                title: '评定日期',
                dataIndex: 'date',              
            },
            {
                title: '评级结果',
                dataIndex: 'result',              
            },
            {
                title: '检查频次',
                dataIndex: 'checkf',              
            }
        ];
     
 
     return (
         <div>       
             <Card style={{marginTop:10}}>
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
             </Card>
         </div>
 
        )
     }
 }

Extra = Form.create({})(Extra);