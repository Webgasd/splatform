import React,{Component} from 'react';
import {Card, Button, Modal, message, Icon, Upload, Tag} from 'antd';
import  BaseForm  from '../../../components/BaseForm';
import ETable from '../../../components/ETable';
import Utils from "../../../utils";
import axios from "../../../axios";
import AddForm from './Add'
import connect from "react-redux/es/connect/connect";
import {changeEmployee, clearEmployee} from "../../../redux/action";
import {commonUrl} from "../../../axios/commonSrc";
import moment from "moment";
import DetailForm from "./Output";

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
class employee extends Component{
    state={
        selectedRowKeys: [], // Check here to configure the default column
        headStatus:false,
        workTypeList:[],
        comAmount:'3000',
        perAmount:'300'
    }
    params = {
        pageNo:1,
        areaList:'',
    }


    
    //调用封装好的axios.requestList()获取角色数据
    componentDidMount(){
        this.requestStatistics();
        this.requestList();
        this.requestWorkType()
    }

    requestStatistics=()=>{
        let _this = this;
        axios.ajax({
            url:'/supervision/ca/getStatistics',
            data: {
                params:{}
            }
        }).then((res)=>{
            if(res.status == "success"){
                this.setState({
                    companyNumber:res.data.companyNumber,
                    trainNumber:res.data.trainNumber
                })
            }
        })
    }
    requestList = ()=>{
        let _this = this;
        axios.PostAjax({
            url:'/supervision/ca/getPage',

            //url:'/employee.json',
            data:{
                params:{...this.params,areaList:[this.params.areaList]}
            }
        }).then((res)=>{

            if(res.status == "success"){
                let list  = res.data.data.map((item,i)=>{
                    item.key = i;
                    return item;
                })
                this.setState({
                    list:list,
                    total:res.data.total,
                    pagination:Utils.pagination(res,(current)=>{
                        _this.params.pageNo = current;//	当前页数
                        _this.requestList(); //刷新列表数据
              })
                })
            }
        })
    }
    requestWorkType = ()=>{
        axios.noLoadingAjax({
            url:'/sys/workType/getList',
            data:{
                params:{}
            }
        }).then((res)=>{

            if(res.status == "success"){
                this.setState({
                    workTypeList:res.data,
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
        let type =this.state.type;
        axios.PostAjax({
            url:type=='create'?'/supervision/ca/insert':'/supervision/ca/update',
            data:{
                params:{
                    ...this.props.input
                }
            }
        }).then((res)=>{
            if(res){
                this.setState({
                    isVisible:false //关闭弹框
                })
                this.props.clearEmployee();
                this.requestList();
            }
        })
    }

    handleSubmitOutput = ()=>{
            let type = this.state.type;
            let data = this.detailForm.props.form.getFieldsValue();
            data.start = Utils.formatDate(data.start);
            data.end = Utils.formatDate(data.end);
            window.open(commonUrl + '/supervision/morningCheck/output?start=' + data.start + '&end=' + data.end)
        // axios.ajax({
        //     url:'/supervision/morningCheck/output',
        //     data:{
        //         params:{
        //             ...data
        //         }
        //     }
        // }).then((res)=>{
        //     if(res){
        //         this.setState({
        //             isVisible:false //关闭弹框
        //         })
        //         this.requestList();
        //     }
        // })
    }

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
                       // url:'/post.json',
                        url:'/supervisor/delete',
                        
                        data:{
                            params:{
                                id:item.id
                            }
                        }
                    }).then((res)=>{

                        if(res.status == 'success'){

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
              this.setState({
                  title:'创建员工',
                  isVisible:true,
                  type
              })
          }else if(type =='output'){
              this.setState({
                  title:'导出时间区间选择',
                  isVisible:true,
                  type
              })
          }else if(type=="edit" || type=='detail'){
              this.setState({
                  title:type=='edit'?'编辑用户':'查看详情',
                  isVisible:true,
                  type
              })
              this.props.changeEmployee({...item,photo:JSON.parse(item.photo||JSON.stringify([]))});
          }else if(type=="delete"){
              Modal.confirm({
                  content:'确定要删除此用户吗？',
                  onOk:()=>{
                      axios.ajax({
                          url: '/supervision/ca/delete',
                          data: {
                              params: {
                                  caId: item.id
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

    showModal = (type)=>{
        if (type=="output"){
            return(
                <Modal
                    title={this.state.title}
                    visible={this.state.isVisible}
                    onOk={this.handleSubmitOutput}
                    okText="确定"
                    cancelText="取消"
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
                    }}>
                    <DetailForm userInfo={this.state.userInfo} type={this.state.type} wrappedComponentRef={(inst) => this.detailForm = inst }/>
                </Modal>
            )
        }
        else {
            return(
                <Modal
                    title={this.state.title}
                    visible={this.state.isVisible}
                    onOk={this.handleSubmit}
                    okText="确定"
                    cancelText="取消"
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
            )
        }
    }



    
    render() {
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
            }, {
                title: '文化程度',
                dataIndex: 'education'
            }, {
                title: '体检',
                dataIndex: 'health',
               
            }, {
                title: '健康证号',
                dataIndex: 'healthNumber',
            }, {
                title: '健康证有效期限',
                dataIndex: 'time',
                render(text, record,index){
                    let startTime = Utils.formatDateNoTime(record.startTime);
                    let endTime = Utils.formatDateNoTime(record.endTime);
                    return startTime+'-'+endTime;
                }  
            },
            {
                title: '操作',
                dataIndex:'operation',
                render:(text, record)=>{
                   
                    return <div className='textButtonBox'>
                            <div className='textButton' onClick={() => { this.handleOperator('detail',record)}}>查看</div>
                            {this.props.acl.indexOf('/modify')>-1?<div className='textButton' onClick={()=> {this.handleOperator('edit',record)}}>编辑</div>:null}
                            {this.props.acl.indexOf('/delete')>-1?<div className='textButton' onClick={() => { this.handleOperator('delete',record)}}>删除</div>:null}
                            {/*<Col span={5}><div className='textButton' onClick={() => { this.daily(record.key) }}>日志</div></Col>*/}
                        </div>
                }
            }
        ];
        const formList = [
            {
                type: 'INPUT',
                label: '所在企业',
                field: 'companyName'
            }, {
                type: 'AREA_TREE',
                label: '所属地区',
                placeholder: '请选择地区',
                field: 'areaList',
                width: 150,
                list: Utils.getDataSource(this.props.areaList||[])
            },
            {
                type: 'INPUT',
                label: '人员姓名',
                field:'name'
            },
            {
                type: 'SELECT',
                label: '文化程度',
                field: 'education',
                placeholder: '请选择文化程度',
                width: 150,
                list: [{id: '大学', name: '大学'}, {id: '高中', name: '高中'}, {id: '初小', name: '初小'}]
            },
            {
                type: 'SELECT',
                label: '人员性别',
                field: 'sexy',
                placeholder: '请选择性别',
                width: 150,
                list: [{id: 0, name: '男'}, {id: 1, name: '女'}]
            }, {
                type: 'SELECT',
                label: '工作种类',
                placeholder: '请选择工作种类',
                field: 'workType',
                width: 150,
                list: this.state.workTypeList
            }, {
                type: 'SELECT',
                label: '体检情况',
                field: 'health',
                placeholder: '请选择体检情况',
                width: 150,
                list: [{id: '合格', name: '合格'}, {id: '不合格', name: '不合格'}]
            },
            {
                type: 'INPUT',
                label: '健康证号',
                field:'healthNumber'
            }, {
                type: 'TIME',
                label: '健康证到期时间',
                field:'Time'
            },

        ]
        const SearchForm =<div style={{display:'table-cell',verticalAlign:'middle',paddingLeft:30}}><BaseForm formList={formList} filterSubmit={this.handleFilterSubmit}/></div>
        const Information = <div className='topContent'>
            {this.state.companyNumber?<div className='topBox'>
                <div style={{fontSize:16,color:"#000000",fontWeight:1000}}>
                    <Icon type="profile" style={{ fontSize: '25px', color: '#FF9900' ,marginLeft:5,margin:10}} />
                    企业数量
                </div>
                <div style={{margin:10,marginLeft:5}}>数量: {this.state.companyNumber} 家</div>
            </div>:<div></div>
            }
            <div className='topBox'>
                <div style={{fontSize:16,color:"#000000",fontWeight:1000}}>
                    <Icon type="profile" style={{ fontSize: '25px', color: '#FF9900' ,marginLeft:5,margin:10}} />
                    人员数量
                </div>
                <div style={{margin:10,marginLeft:5}}>数量: {this.state.total} 人</div>
            </div>

            <div className='topBox'>
                <div style={{fontSize:16,color:"#000000",fontWeight:1000}}>
                    <Icon type="profile" style={{ fontSize: '25px', color: '#FF9900' ,marginLeft:5,margin:10}} />
                    已培训人员
                </div>
                <div style={{margin:10,marginLeft:5}}>数量: {this.state.trainNumber} 人</div>
            </div>
            <div className='statisticsTipsBox' style={{height:"100px"}}>
                <div style={{color:"#99CC33",marginTop:10,marginLeft:7,fontSize:16,borderBottom:'1px solid #E6E9EC'}}>状态提示:</div>
                    <div style={{height:16,margin:10}}>
                        <div style={{width:30,height:15,background:'RGB(255, 118, 95)',borderRadius:5,float:"left"}}></div>
                        <div style={{float:"left",marginLeft:15}}>许可证超期报警</div>
                    </div>
                <div style={{height:16,margin:10}}>
                    <div style={{width:30,height:15,background:'RGB(253, 221, 110)',borderRadius:5,float:"left"}}></div>
                    <div style={{float:"left",marginLeft:15}}>许可证超期预警（30天内）</div>
                </div>
        </div>

        </div>
        return (
            <div  ref="employee">
                {this.props.userType==1?null:<div style={{height:120,display:'table',width:'100%'}}>
                    {this.state.headStatus?Information:SearchForm}
                </div>}
                <Card>
                    {this.props.userType==1?null:<div className='button-box-left'>
                        <Button type="primary" onClick={()=>this.setState({headStatus:this.state.headStatus?false:true})}>{this.state.headStatus?'查询':'统计'}</Button>
                    </div>}
                    <div className='button-box'>
                        {this.props.acl.indexOf('/output')>-1?  <Button type="primary" onClick={()=>this.handleOperator('output',null)}>晨检记录导出</Button>:null}
                        {this.props.acl.indexOf('/add')>-1?  <Button type="primary" onClick={()=>this.handleOperator('create',null)}>添加</Button>:null}
                        {this.props.acl.indexOf('/import')>-1?
                        <Upload action={commonUrl+"/supervision/ca/importExcel"}
                                showUploadList={false}
                                onChange={(info)=>{
                                    if (info.file.status === 'done') {
                                        if(info.file.response.status=='success'){
                                            message.success(`${info.file.name} file uploaded successfully`  );
                                        }else {
                                            message.error(`${info.file.name} file upload failed.`);
                                        }
                                        this.requestList();
                                    } else if (info.file.status === 'error') {
                                        message.error(`${info.file.name} file upload failed.`);
                                    }
                                }}>
                            <Button type="primary" >导入</Button>
                        </Upload>:null}
                            {/*<Button type="primary" >导出</Button>*/}
                            {/*<Button type="primary" onClick={this.handleDelete}>删除</Button>*/}
                    </div>
                    <div style={{marginTop:30}}>
                    {/*使用封装好的ETable组件实现角色列表的展示*/}
                        <ETable
                            updateSelectedItem={Utils.updateSelectedItem.bind(this)}
                            selectedRowKeys={this.state.selectedRowKeys}
                            selectedIds={this.state.selectedIds}
                            selectedItem={this.state.selectedItem}
                            dataSource={this.state.list}
                            pagination={this.state.pagination}
                            rowClassName={this.setRowClassName}
                            columns={columns}
                            row_selection = 'checkbox'
                        />
                    </div>
                </Card>
                {this.showModal(this.state.type)}



            </div>
        );
    }
}
export default employee;

