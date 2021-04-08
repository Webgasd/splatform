import React,{Component} from 'react';
import {connect} from 'react-redux'
import {changeGovernment, clearGovernment} from '../../../redux/action'
import { unitName } from "../../../axios/commonSrc";
import {Card, Button, Row, Col, Modal, Icon,Upload,message} from 'antd';
import  BaseForm  from '../../../components/BaseForm';
import ETable from '../../../components/ETable';
import Utils from "../../../utils";
import axios from "../../../axios";
import AddForm from './AddForm'
import Deploy from './Deploy'
import Journal from './Journal'
import {commonUrl} from "../../../axios/commonSrc";
const confirm = Modal.confirm


@connect(
    state=>({
        input:state.government,
        acl:state.acls['/person/goverment']
    }),{
        clearGovernment,
        changeGovernment
    }
)
class government extends Component{
    state={
        selectedRowKeys: [], // Check here to configure the default column
        dutiesList:[],
        comAmount:'3000',
        perAmount:'300'
    }
    params = {
        pageNo:1,
        department:'',
        gridId:null
    }
    componentDidMount(){
        this.requestDept();
        this.requestList();
        this.requestAllDept();
    }

    requestList = ()=>{
        let _this = this;
        axios.PostAjax({
            url:'/supervision/ga/getPage',
            //url:'/government.json',
            data:{
                params:{...this.params,department:[this.params.department]}
            }
        }).then((res)=>{
            if(res.status == 'success'){
                let list  = res.data.data.map((item,i)=>{
                    item.key = i;
                    return item;})
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

    requestDept = ()=>{
        axios.noLoadingAjax({
            url:'/supervision/ga/getDept',
            //url:'/government.json',
            data:{
                params:{}
            }
        }).then((res)=>{
            if(res.status == 'success'){
                this.setState({
                    deptTree:res.data.dept,
                    dutiesList:res.data.duties,
                    personNumber:res.data.personNumber,
                    deptNumber:res.data.deptNumber,
                    statistics:res.data.statistics,
                    myDept:res.data.myDept
                })
            }
        })
    }
    requestAllDept=()=>{
        axios.noLoadingAjax({
            url:'/sys/dept/getAll',
            data:{
                params:{}
            }
        }).then((res)=>{
            if(res.status == "success"){
                this.setState({
                    deptAllList: res.data
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
        let _this=this;
        //判断必填字段是否为空
        let data = _this.props.input
        if((data.unitName==undefined||'')||(data.department==undefined||'')||(data.name==undefined||'')||(data.type==undefined||'')||(data.workPhone==undefined||'')||(data.mobilePhone==undefined||'')){
            Modal.confirm({
                content:'必填字段不能为空，请检查！',
                onOk:()=>{
                    
                }
            })
        }else{
            axios.PostAjax({
                url:type=='create'?'/supervision/ga/insert':'/supervision/ga/update',
                data:{
                    params:{
                        ..._this.props.input
                    }
                }
            }).then((res)=>{
                if(res.status == 'success'){
                    this.setState({
                        isVisible:false
                    })
                     this.props.clearGovernment();
                    this.requestList();
                }
            })
        }
    }

    handleSubmitDept=()=>{
        axios.ajax({
            url:'/supervision/ga/changeDept',
            data:{
                params:{
                    id:this.state.gaInfo.id,
                    checkDept:this.state.checkDept
                }
            }}).then((res)=>{
            if(res.status == 'success'){
                this.setState({
                    isDeVisible:false,
                    gaInfo:{},
                    checkDept:''
                })
                this.requestList();
            }
        })
    }


    handleOperator = (type,item)=>{
        if(type =='create'){
            this.setState({
                title:'创建',
                isVisible:true,
                type
            })
             this.props.changeGovernment({unitName:unitName+'市场监督管理局'})
        }else if(type=="edit" || type=='detail'){
            this.setState({
                title:type=='edit'?'修改':'查看',
                isVisible:true,
                type
            })
            this.props.changeGovernment({...item,photo:JSON.parse(item.photo||JSON.stringify([]))});
        }else if(type=="delete"){
            Modal.confirm({
                content:'确定要删除此用户吗？',
                onOk:()=>{
                    axios.ajax({
                        url: '/supervision/ga/delete',
                        data: {
                            params: {
                                gaId: item.id
                            }
                        }
                    }).then((res)=>{
                        if(res.status == 'success'){
                            this.requestList();
                        }
                    })
                }
            })
        }else if(type=="deploy"){
            this.setState({
                title:type=='调配部门',
                isDeVisible:true,
                gaInfo:item,
                checkDept:item.department
            })
        }else if(type=="stop"){
            Modal.confirm({
                text:'信息',
                content:item.isStop==0?'是否确定停用':'是否确定启用',
                onOk:()=>{
                    axios.ajax({
                        url: '/supervision/ga/changeStop',
                        data: {
                            params: {
                                id: item.id
                            }
                        }
                    }).then((res)=>{
                        if(res.status == 'success'){
                            this.requestList();
                        }
                    })
                }
            })
        }else if(type=="allocate"){
            Modal.confirm({
                text:'信息',
                content:'此功能用于所人员的管辖网格划分！',
                onOk:()=>{

                }
            })
        }else if(type=="journal"){
            this.setState({
                title:type=='日志',
                isJoVisible:true,
                type
            })
        }
    }

    render() {
        let _this=this;
        const columns = [
            {
                title: '单位名称',
                dataIndex: 'unitName'
            }, {
                title: '部门',
                dataIndex: 'department',
                render(department){
                    let data = (_this.state.deptAllList||[]).find((item)=>item.id==department)||{};
                    return data.name;
                }
            },{
                title: '姓名',
                dataIndex: 'name'
            }, {
                title: '职务',
                dataIndex: 'job',
                render(job){
                    let data = _this.state.dutiesList.find((item)=>item.id===job)||{};
                    return data.name;
                }
            }, {
                title: '执法证号',
                dataIndex: 'enforce'
            }, {
                title: '移动电话',
                dataIndex: 'mobilePhone',
            }, {
                title: '人员类型',
                dataIndex: 'type',
                render(type){
                    return {
                        1:'部门',2:'负责人',3:'执法人员',4:'日常责任监管人',5:'协管员'
                    }[type]
                }
            },
            {
                title: '操作',
                dataIndex:'operation',
                render:(text, item)=>{
                    return <div className='textButtonBox'>
                        <div className='textButton' onClick={() => { this.handleOperator('detail',item)}}>查看</div>
                        {this.props.acl.indexOf('/modify')>-1?<div className='textButton' onClick={()=> {this.handleOperator('edit',item)}}>修改</div>:null}
                        {this.props.acl.indexOf('/delete')>-1?<div className='textButton' onClick={()=> {this.handleOperator('delete',item)}}>删除</div>:null}
                        {this.props.acl.indexOf('/modify')>-1?<div className='textButton' onClick={() => {this.handleOperator('deploy',item)}}>调配部门</div>:null}
                        {this.props.acl.indexOf('/modify')>-1?<div className={item.isStop==0?'textButton':'stopTextButton'} onClick={() => { this.handleOperator('stop',item)}}>{item.isStop==0?'停用':'启用'}</div>:null}
                        {this.props.acl.indexOf('/modify')>-1?<div className='textButton' onClick={() => { this.handleOperator('allocate',item)}}>分配网格</div>:null}
                        {/*<Col span={3}><div className='textButton' onClick={() => { this.handleOperator('journal',item)}}>日志</div></Col>*/}
                    </div>
                }}

        ];
        const formList = [
            {
                type: 'SELECT',
                label: '单位名称',
                field: 'unitName',
                placeholder: '请选择单位名称',
                width: 150,
                list: [{id: unitName+'市场监督管理局', name: unitName+'市场监督管理局'}]
            }, {
                type: 'TREE',
                label: '部门名称',
                field: 'department',
                placeholder: '请选择部门',
                width: 150,
                list: Utils.getDataSource(this.state.deptTree||[])
            },{
                type: 'INPUT',
                label: '姓名',
                field: 'name'
            },
            {
                type: 'SELECT',
                label: '职务',
                field: 'job',
                placeholder: '请选择职务',
                width: 150,
                list: this.state.dutiesList||[]
            },{
                type: 'INPUT',
                label: '移动电话',
                field: 'mobilePhone'
            }
        ]
        const SearchForm =<div style={{display:'table-cell',verticalAlign:'middle',paddingLeft:30}}><BaseForm formList={formList} filterSubmit={this.handleFilterSubmit}/></div>
        const Information = <div className='topContent'>
            {this.state.deptNumber?<div className='topBox'>
                <div style={{fontSize:16,color:"#000000",fontWeight:1000}}>
                    <Icon type="profile" style={{ fontSize: '10px', color: '#FF9900' ,marginLeft:5,margin:10}} />
                    部门数量
                </div>
                <div style={{margin:10,marginLeft:5}}>数量: {this.state.deptNumber||0} 家</div>
            </div>:null}

            {this.state.personNumber?<div className='topBox'>
                <div style={{fontSize:16,color:"#000000",fontWeight:1000}}>
                    <Icon type="profile" style={{ fontSize: '10px', color: '#FF9900' ,marginLeft:5,margin:10}} />
                    人员数量
                </div>
                <div style={{margin:10,marginLeft:5}}>数量: {this.state.personNumber||0} 人</div>
            </div>:null}
            {this.state.myDept?<div className='topBox'>
                <div style={{fontSize:16,color:"#000000",fontWeight:1000}}>
                    <Icon type="profile" style={{ fontSize: '10px', color: '#FF9900' ,marginLeft:5,margin:10}} />
                    人员数量
                </div>
                <div style={{margin:10,marginLeft:5}}>数量: {this.state.myDept.count||0} 人</div>
            </div>:null}
            {(this.state.statistics||[]).map((item)=> <div className='topBox'>
                <div style={{fontSize:16,color:"#000000",fontWeight:1000}}>
                    <Icon type="profile" style={{ fontSize: '10px', color: '#FF9900' ,marginLeft:5,margin:10}} />
                        {item.name}
                    </div>
                <div style={{margin:10,marginLeft:5}}>数量: {item.count} 人</div>
                </div>
            )}
        </div>
        return (
            <div ref="government">
                <div style={{height:120,display:'table',width:'100%'}}>
                    {this.state.headStatus?Information:SearchForm}
                </div>
                <Card style={{marginTop:10}}>
                    <div className='button-box-left'>
                        <Button type="primary" onClick={()=>this.setState({headStatus:this.state.headStatus?false:true})}>{this.state.headStatus?'查询':'统计'}</Button>
                    </div>
                    <div className='button-box'>
                        {this.props.acl.indexOf('/add')>-1?<Button type="primary" onClick={()=>this.handleOperator('create',null)}>添加</Button>:null}
                        {this.props.acl.indexOf('/import')>-1?
                        <Upload action={commonUrl+"/supervision/ga/importExcel"}
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
                        <Button type="primary" >导出</Button>
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
                            row_selection='checkbox'
                        />
                    </div>
                </Card>
                <Modal
                       width='1050px'
                       title="政府人员信息"
                       onOk={this.handleSubmit}
                       destroyOnClose
                       okText="确定"
                       cancelText="取消"
                       maskClosable={false}
                       getContainer={()=>this.refs.government}
                       footer={this.state.type=='detail'?null:React.ReactNode}
                       visible={this.state.isVisible}
                       onCancel={()=>{
                           this.setState({
                               isVisible:false,
                           })
                       }}
                >
                    <AddForm deptTree={Utils.getDataSource(this.state.deptTree||[])} dutiesList={this.state.dutiesList||[]} type={this.state.type}/>
                </Modal>
                <Modal
                    width='500px'
                    title="调配部门"
                    visible={this.state.isDeVisible}
                    onOk={this.handleSubmitDept}
                    onCancel={()=>{
                        this.setState({
                            isDeVisible:false,
                            gaInfo:{},
                            checkDept:''
                        })
                    }}
                >
                    <Deploy deptTree={Utils.getDataSource(this.state.deptTree||[])} checkDept={this.state.checkDept||''} dispatchDept={(value)=>this.setState({checkDept:value})}/>
                </Modal>
                <Modal footer={null}
                       width='500px'
                       title="日志"
                       visible={this.state.isJoVisible}
                    //onOk={this.handleSubmit}
                       onCancel={()=>{
                           this.setState({
                               isJoVisible:false,
                           })
                       }}
                >
                    <Journal/>
                </Modal>
            </div>
        );
    }
}

export default government;

