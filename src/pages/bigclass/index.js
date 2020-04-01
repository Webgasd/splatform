import React,{Component} from 'react';
import { Card,Button, Form, Input, Select,Radio, Badge,Modal, DatePicker ,Collapse, message } from 'antd';

import ETable from '../../components/ETable';
import Utils from "../../utils";
import axios from "../../axios";

const ButtonGroup = Button.Group;
const FormItem=Form.Item;



export default class bigclass extends Component{
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
            url:'/bigclass.json',
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
    //点击【创建角色】按钮弹出弹框：给onClick事件绑定this.handleRole()，
    //设置this.state.isRoleVisible为true
    handleAdd = ()=>{
        this.setState({
            isAddVisible:true
        })
    }

    // 角色提交   
    //点击【OK】提交创建角色：给onOk事件绑定 handleAddSubmit()。
    //①通过this.roleForm.props.form.getFieldsValue()获取表单的值，赋给params；
    //②接口访问成功后，关闭弹框，刷新列表数据。
    handleAddSubmit = ()=>{
       
                this.setState({
                    isAddVisible:false //关闭弹框
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

     delay = (index)=>{

     }   

    onSelectChange = (selectedRowKeys) => {
        Modal.info('selectedRowKeys changed: ', selectedRowKeys);
        this.setState({ selectedRowKeys });
      }

    handleOperator = (type,item)=>{     
        //  let item = this.state.selectedItem;
          if(type =='create'){
              this.setState({
                  title:'创建员工',
                  isVisible:true,
                  type
              })
          }else if(type=="edit" || type=='detail'){
            
              this.setState({
                  title:type=='edit'?'编辑用户':'查看详情',
                  isVisible:true,
                  userInfo:item,          
                  type
              })
              console.log(item);
          }
      }

    
    render() {
        const columns = [
            {
                title: '排序',
                dataIndex: 'sort',
                
            }, {
                title: '食品、食品添加剂类型',
                dataIndex: 'foodtype'
            },{
                title: '备注',
                dataIndex: 'remarks',
               
            },
            {
                title: '操作',
                dataIndex:'operation',
                render:(text, record)=>{
                   
                    return <ButtonGroup>
                    <Button type="primary"  onClick={() => { this.handleOperator('detail',record)}}>查询</Button>
                    <Button type="primary"  onClick={()=> {this.handleOperator('edit',record)}}>修改</Button>
                    <Button type="primary"  onClick={() => { this.handleDelete1(record.key) }}>删除</Button>                   
                    </ButtonGroup>
                                            
                }
            }
        ];
       
        return (
            <div>
              
                <Card style={{marginTop:10}}>
                    <div className='button-box'>
                            <Button type="primary" onClick={this.handleAdd}>添加</Button>                           
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
                    width='500px'
                    title="添加企业信息"
                    visible={this.state.isAddVisible}
                    onOk={this.handleAddSubmit}
                    onCancel={()=>{
                        //this.addForm.props.form.resetFields();//表单重置
                        this.setState({
                            isAddVisible:false
                        })
                    }}
                >
             
                    <Add wrappedComponentRef={(inst) => this.addForm = inst }/>
                </Modal>
            
                <Modal
                    title={this.state.title}
                    visible={this.state.isVisible}
                    onOk={this.handleSubmit}
                    width={800}
                    onCancel={()=>{
                        this.userForm.props.form.resetFields();
                        this.setState({
                            isVisible:false,
                            userInfo:''
                        })
                    }}
                >                  
                </Modal>
            </div>
        );
    }
}

class Add extends Component{
    render() {
        const formItemLayout = {
            labelCol: {span: 10},
            wrapperCol: {span: 14}
        };
    

    return (
      
            <Card >
                <Form layout="horizontal">
                <FormItem label="排序" {...formItemLayout}>
                    {
                            <Input type="text" />
                    }
                </FormItem>
                <FormItem label="食品、食品添加剂类别名称" {...formItemLayout}>
                    {
                            <Input type="text" />
                    }
                </FormItem>
                <FormItem label="备注" {...formItemLayout}>
                    {
                            <Input type="text" />
                    }
                </FormItem>

                </Form>              
            </Card>
       )
    }

}



