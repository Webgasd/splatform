import React,{Component} from 'react';
import { Card,Button, Form, Input, Select,Radio, Badge,Modal, DatePicker ,Collapse, message } from 'antd';
import  BaseForm  from '../../../components/BaseForm';
import ETable from '../../../components/ETable';
import Utils from "../../../utils";
import axios from "../../../axios";

const Panel = Collapse.Panel;
const FormItem = Form.Item;
const Option = Select.Option;
const ButtonGroup = Button.Group;
const RadioGroup=Radio.Group;
// 表单封装，通过构建表单对象，在BaseForm中进行统一渲染
const formList = [
    {
        type: 'INPUT',
        label: '单位名称',
        field: 'name'
    },{
        type: 'INPUT',
        label: '评定年度',
        field: 'year'
    },
    {
        type: 'INPUT',
        label: '企业名称',
        field: 'ename'
    },{
        type: 'TIME',
        label: '检查日期',
        field: 'date'
    },
    {
        type: 'INPUT',
        label: '检查人员',
        field: 'person'
    },
      {
        type: 'SELECT',
        label: '评级结果',
        field: 'result',
        initialValue: '0',
        width: 150,
        list: [{id: '0', name: 'A'}, {id: '1', name: 'B'}, {id: '2', name: 'C'}]
    },
    {
        type: 'SELECT',
        label: '评级状态',
        field: 'state',
        initialValue: '0',
        width: 150,
        list: [{id: '0', name: '未结束'}, {id: '1', name: '已结束'}]
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
            url:'/dynamic.json',
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
  
    handleAdd = ()=>{
        this.setState({
            isAddVisible:true
        })
    }
  
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
                  title:'编辑',
                  isVisible:true,
                  userInfo:item,     
              })
          }
      
    handleDaily=()=>{

          }
     getState = (state)=>{
            return {
                '1':'已结束',
                '2':'未结束'
            }[state]         
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
                title: '检查日期',
                dataIndex: 'date',             
            },
            {
                title: '检查人员',
                dataIndex: 'person',             
            },
            {
                title: '评级结果',
                dataIndex: 'result',             
            },
            {
                title: '状态',
                dataIndex: 'state',          
            },
            {
                title: '操作',
                dataIndex:'operation',
                render:(text, record)=>{                
                    return <ButtonGroup>  
                    <Button type="primary"  onClick={()=> {this.handleOperator(record)}}>查看</Button>  
                    <Button type="primary"  onClick={()=> {this.handleDaily(record)}}>日志</Button>      
                    </ButtonGroup>                      
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
                 <Button type="primary" onClick={this.handleAdd}>添加</Button>             
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
                    visible={this.state.isAddVisible}
                    
                    width={800}
                    onCancel={()=>{
                     // this.userForm.props.form.resetFields();
                        this.setState({
                            isAddVisible:false,
                            userInfo:''
                        })
                    }}
                ><Card/> </Modal>
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
  
      getState = (sex)=>{
        return {
            '1':'男',
            '2':'女'
        }[sex]         
    }
    
      handleAdd = ()=>{
          this.setState({
              isVisible:true
          })
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
          
          return (       
                  <Form layout="horizontal">
                  <FormItem label="姓名" {...formItemLayout}>
                      {
                          userInfo && type=='detail'?userInfo.name:
                          getFieldDecorator('name',{
                              initialValue:userInfo.name
                          })(
                              <Input type="text" placeholder="请输入名称"/>
                          )
                      }
                  </FormItem>               
                  </Form>           
          );
      }
  }

  UserForm = Form.create({})(UserForm);
