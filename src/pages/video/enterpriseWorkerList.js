import React,{Component} from 'react';
import {Card, Button, Modal, message, Icon, Upload} from 'antd';
import  BaseForm  from '../../components/BaseForm';
import ETable from '../../components/ETable';
import Utils from "../../utils";
import axios from "../../axios";
import AddForm from '../supervision/employee/Add'
import connect from "react-redux/es/connect/connect";
import {changeEmployee, clearEmployee} from "../../redux/action";
import {commonUrl} from "../../axios/commonSrc";
import moment from "moment";

@connect(
    state=>({
        input:state.employee,
        industryList:state.industryList,
        areaList:state.areaList,
        userType:state.userType,
        acl:state.acls['/person/employee']
    }),{
        clearEmployee,
        changeEmployee
    }
)

class EmployeeList extends Component{
  state={
        selectedRowKeys: [], // Check here to configure the default column
        // comAmount:'3000',
        // perAmount:'300'
    }
    params = {
        pageNo:1,
    }
    
    //调用封装好的axios.requestList()获取角色数据
    componentDidMount(){
        this.requestList();
    }
        requestList = ()=>{console.log(this.props.workerListId)
        let _this = this;
        axios.ajax({
            url:'/supervision/ca/getCaPageByEnterprise',
            data:{
                params:{
                    ..._this.params,
                    id:_this.props.workerListId
                }
            }
        }).then((res)=>{console.log(res)
            if(res.status =='success'){
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
    // handleFilterSubmit = (filterParams) => {
    //     this.params = filterParams;
    //     this.requestList();
    // };

    

    setRowClassName = (record) => {
        if(moment(record.endTime).isBetween(moment(),moment().add(1,'month')) ){
            return 'warningRowStyl';
        }else if(moment(record.endTime).isBefore())
        {  return 'clickRowStyl';}else {
            return '';
        }
    }

    start = () => {
        
        // ajax request after empty completing
       
          this.setState({
            selectedRowKeys: [],
          })
      }
     
   
    onSelectChange = (selectedRowKeys) => {
        Modal.info('selectedRowKeys changed: ', selectedRowKeys);
        this.setState({ selectedRowKeys });
      }

    handleOperator = (type,item)=>{
              this.setState({
                  title:'查看详情',
                  isVisible:true,
              })
               this.props.changeEmployee({...item,photo:JSON.parse(item.photo||JSON.stringify([]))});
          }

          render(){
            const columns = [
                {
                    title: '所在企业',
                    dataIndex: 'companyName',
                    
                }, {
                    title: '姓名',
                    dataIndex: 'name'
                },{
                    title: '性别',
                    dataIndex: 'sexy',
                    render(sexy){
                        if(sexy==0){
                            return "男"
                        }else {
                            return "女"
                        }
                    }
                },  {
                    title: '健康证号',
                    dataIndex: 'healthNumber',
                }, 
                {
                    title: '操作',
                    dataIndex:'operation',
                    render:(text, record)=>{
                       
                        return <div className='textButtonBox'>
                                <div className='textButton' onClick={() => { this.handleOperator('detail',record)}}>查看</div>
                            </div>
                    }
                }
            ];
            // const formList = [
            //     {
            //         type: 'INPUT',
            //         label: '人员姓名',
            //         field:'name'
            //     },
            //     {
            //         type: 'INPUT',
            //         label: '健康证号',
            //         field:'healthNumber'
            //     },
            // ];
            // const SearchForm =<div style={{display:'table-cell',verticalAlign:'middle',paddingLeft:30}}><BaseForm formList={formList} filterSubmit={this.handleFilterSubmit}/></div>
            // const Information = <div className='topContent'></div>
    
            return (
                <div  ref="employee">
                    {/* <div style={{height:120,display:'table',width:'100%'}}>
                        {SearchForm}
                    </div> */}
                    <Card>
                        <div style={{marginTop:30}}>
                        {/*使用封装好的ETable组件实现角色列表的展示*/}
                            <ETable
                                // updateSelectedItem={Utils.updateSelectedItem.bind(this)}
                                selectedRowKeys={this.state.selectedRowKeys}
                                // selectedIds={this.state.selectedIds}
                                // selectedItem={this.state.selectedItem}
                                dataSource={this.state.list}
                                pagination={this.state.pagination}
                                rowClassName={this.setRowClassName}
                                columns={columns}
                                // row_selection = 'checkbox'
                            />
                        </div>
                    </Card>
                  
                    <Modal
                        title="查看详情"
                        visible={this.state.isVisible}
                        okText="确定"
                        cancelText="取消"
                        centered={true}
                        mask={false}
                        maskClosable={false}
                        getContainer={()=>this.refs.employee}
                        footer={this.state.type=='detail'?null:React.ReactNode}
                        destroyOnClose
                        width={1000}
                        onCancel={()=>{
                            this.props.clearEmployee();
                            this.setState({
                                isVisible:false,
                                userInfo:''
                            })
                        }}
                    >
                          <AddForm type={this.state.type} workTypeList={this.state.workTypeList||[]} industryList={this.props.industryList||[]}/>
                    </Modal>
                </div>
            );
        }
}
export default EmployeeList;

