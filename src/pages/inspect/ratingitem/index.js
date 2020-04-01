import React,{Component} from 'react';
import { Card,Button, Form, Input, Select,Modal, DatePicker ,Collapse, message } from 'antd';
import ETable from '../../../components/ETable';
import  BaseForm  from '../../../components/BaseForm';
import Utils from "../../../utils";
import axios from "../../../axios";
const Panel = Collapse.Panel;
const FormItem = Form.Item;
const Option = Select.Option;
const ButtonGroup = Button.Group;
const formList = [
    {
        type: 'INPUT',
        label: '大类名称',
        field: 'name',
    }, 
    {
        type: 'INPUT',
        label: '类别名称',
        field: 'fieldname',
    }, 
    {
        type: 'INPUT',
        label: '分类名称',
        field: 'classname',
    }, 
    {
        type: 'SELECT',
        label: '行业类别',
        field: 'kind',
        initialValue: '0',
        width: 150,
        list: [{id: '0', name: '食品经营企业'}, {id: '1', name: '餐饮服务单位'},{id: '2', name: '食品流通企业'}]
    }
]

export default class ratingitem extends Component{
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
            url:'/ratingitem.json',
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
     delay = (index)=>{

     }   
    onSelectChange = (selectedRowKeys) => {
        Modal.info('selectedRowKeys changed: ', selectedRowKeys);
        this.setState({ selectedRowKeys });
      }

    handleOperator = (type,item)=>{
       
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
              //console.log(item);
          }
      }

    
    render() {
        const columns = [
            {
                title: '行业类别',
                dataIndex: 'kind',
                
            }, {
                title: '所属大类',
                dataIndex: 'name'
            },
            {
                title: '所属分类',
                dataIndex: 'classname'
            },
            {
                title: '类别名称',
                dataIndex: 'fieldname'
            },{
                title: '类型',
                dataIndex: 'type',
               
            },
            {
                title: '分值',
                dataIndex: 'grade',
               
            }, 
            {
                title: '操作',
                dataIndex:'operation',
                render:(text, record)=>{
                   
                    return <ButtonGroup>
                    <Button type="primary"  onClick={()=> {this.handleOperator('edit',record)}}>修改</Button>
                    <Button type="primary"  onClick={() => { this.handleDelete1(record.key) }}>删除</Button>                 
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
                        this.addForm.props.form.resetFields();//表单重置
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
                   <UserForm userInfo={this.state.userInfo} type={this.state.type} wrappedComponentRef={(inst) => this.userForm = inst }/> 
                </Modal>
            </div>
        );
    }
}

class Add extends Component{
    render() {
        const formItemLayout = {
            labelCol: {span: 5},
            wrapperCol: {span: 16}
        };
        const { getFieldDecorator } = this.props.form;

    return (
      
            <Card >
                <Form layout="horizontal">
                <FormItem label="所属分类" {...formItemLayout}>
                    {  getFieldDecorator('name',{
                            initialValue:""
                        })(
                            <Input type="text" />
                        )
                    }
                </FormItem>
                <FormItem label="检查项" {...formItemLayout}>
                    { getFieldDecorator('check',{//用于和表单进行双向绑定
                            initialValue:''
                        })(
                            <Input type="text" />
                        )
                    }
                </FormItem>
                <FormItem label="检查类型" {...formItemLayout}>
                    {  getFieldDecorator('checktype',{
                            initialValue:1
                        })(
                           <Select>
                           <Option value={1}>一般项</Option>
                           <Option value={2}>特殊项</Option>
                           <Option value={3}>合理缺项</Option>
                          </Select>
                        )
                    }
                </FormItem>
                <FormItem label="分值" {...formItemLayout}>
                {  getFieldDecorator('grade',{
                            initialValue:""
                        })(
                            <Input type="text" />
                        )
                    }
                </FormItem>
                <FormItem label="顺序" {...formItemLayout}>
                {  getFieldDecorator('order',{
                            initialValue:""
                        })(
                            <Input type="text" />
                        )
                    }
                </FormItem>
                <FormItem label="评分标准" {...formItemLayout}>
                {  getFieldDecorator('scoringstandard',{
                            initialValue:""
                        })(
                            <Input type="text" />
                        )
                    }
                </FormItem>
                <FormItem label="评分指南" {...formItemLayout}>
                {  getFieldDecorator('scoringguide',{
                            initialValue:""
                        })(
                            <Input type="text" />
                        )
                    }
                </FormItem>
                </Form>              
            </Card>
       )
    }

}
Add= Form.create({})(Add);

class UserForm extends React.Component{

    state={ loading: true,isVisible:false}
    onChange = (checked) => {
      this.setState({ loading: !checked });
    }
  
  
      getState = (type)=>{
          return {
              '1':'一般项',
              '2':'特殊项',
              '3':'合理缺项'
          }[type]         
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
                  <FormItem label="所属分类" {...formItemLayout}>
                      {

                          getFieldDecorator('name',{
                              initialValue:userInfo.name
                          })(
                            <Input type="text" />
                          )
                      }
                  </FormItem>
                  <FormItem label="检查项" {...formItemLayout}>
                      {
                          getFieldDecorator('fieldname',{
                              initialValue:userInfo.fieldname
                          })(
                              <Input type="text" placeholder=""/>
                          )
                      }
                  </FormItem>
                  <FormItem label="检查项类型" {...formItemLayout}>
                      {
                        
                          getFieldDecorator('type',{
                              initialValue:this.getState(userInfo.type)
                          })(
                            <Select>
                            <Option value={1}>一般项</Option>
                            <Option value={2}>特殊项</Option>
                            <Option value={3}>合理缺项</Option>
                           </Select>
                          )
                      }
                  </FormItem>
                  <FormItem label="分值" {...formItemLayout}>
                      {
                         
                          getFieldDecorator('grade',{
                              initialValue:userInfo.grade
                          })(
                            <Input type="text" />
                          )
                      }
                  </FormItem>
                  <FormItem label="顺序" {...formItemLayout}>
                      {
                      
                          getFieldDecorator('order',{
                              initialValue:userInfo.order
                          })(
                            <Input type="text" />
                          )
                      }
                  </FormItem>
                  <FormItem label="评分标准" {...formItemLayout}>
                      {
                    
                          getFieldDecorator('scoringstandard',{
                              initialValue:userInfo.scoringstandard
                          })(
                            <Input type="text" />
                          )
                      }
                  </FormItem>
                  <FormItem label="评分指南" {...formItemLayout}>
                      {
                          getFieldDecorator('scoringguide',{
                              initialValue:userInfo.scoringguide
                          })(
                            <Input type="text" />
                          )
                      }
                  </FormItem>
                  </Form>            
          );
      }
  }

  UserForm = Form.create({})(UserForm);