import React,{Component} from 'react';
import {Card, Button, Modal, Icon, Upload, message,Row,Col} from 'antd';
import  BaseForm  from '../../../components/BaseFormNew';
import ETable from '../../../components/ETable';
import Utils from "../../../utils";
import axios from "../../../axios";
import QRCode  from 'qrcode.react';
import Add from './Add';
import moment from "moment";
import '../../../style/common.less';
import {connect} from "react-redux";
import {changeEnterprise, clearEnterprise} from '../../../redux/action'
import {commonUrl} from "../../../axios/commonSrc";
import {baseUrl} from "../../../axios/commonSrc";


@connect(
    state=>({
        input:state.enterprise,
        industryList:state.industryList,
        areaList:state.areaList,
        userType:state.userType,
        acl:state.acls['/enterpriseInformation']
    }),{
        clearEnterprise,
        changeEnterprise
    }
)
 class AbnormalEnterprise extends Component{
    state = {
        selectedRowKeys: [], // Check here to configure the default column
        headStatus:false,
    };
    params = {
        pageNo:1,
        industryList:'',
        areaList:''
    }



    //调用封装好的axios.requestList()获取角色数据
    componentDidMount(){
        this.requestList();
        this.requestStatistics();
        this.requestDeptGrid();
        this.requestAllDept();
        this.requestAllArea()
        this.requestAbnormalList();
    }

    requestStatistics=()=>{
        axios.noLoadingAjax({
            url:'/supervision/enterprise/getStatistics',
            data: {
                params:{}
            }
        }).then((res)=>{console.log(res)
            if(res.status == "success"){
                this.setState({
                    statistics:res.data
                })
            }
        })
    }
    requestAbnormalList=()=>{
        axios.noLoadingAjax({
            url:'/abnormal/getList',
            data: {
                params:{}
            }
        }).then((res)=>{
            if(res.status == "success"){
                this.setState({
                    abnormalList:res.data
                })
            }
        })
    }

    requestList = ()=>{
        let _this = this;
        axios.PostAjax({
            url:'/supervision/enterprise/getPageState',
            data:{
                params:{...this.params,areaList:[this.params.areaList],industryList:[this.params.industryList]}

            }
        }).then((res)=>{console.log(res)
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
    requestDeptGrid=()=>{
        axios.noLoadingAjax({
            url:'/supervision/enterprise/getDeptAndGrid',
            data:{
                params:{}
            }
        }).then((res)=>{console.log(res)
            if(res.status == "success"){
                this.setState({
                    deptTree: res.data.deptTree
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
        }).then((res)=>{console.log(res)
            if(res.status == "success"){
                this.setState({
                    deptAllList: res.data
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
        }).then((res)=>{console.log(res)
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
        let type =this.state.type;
        axios.PostAjax({
            url:type=='create'?'/supervision/enterprise/insert':'/supervision/enterprise/update',
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
                this.props.clearEnterprise();
                this.requestList();
            }
        })
    }
 
    setRowClassName = (record) => {
   if(moment(record.endTime).isBetween(moment(),moment().add(1,'month')) ){
        return 'warningRowStyl';
    }else if(moment(record.endTime).isBefore())
   {  return 'clickRowStyl';}else {
       return '';
   }
    }

   

    handleQr = (item) =>{
       this.setState({
           isQrcodeVisible:true,
           qrUrl:baseUrl+'/#/enterpriseInfoNew?id='+item.id
       })
    }
    onSelectChange = (selectedRowKeys) => {
        Modal.info('selectedRowKeys changed: ', selectedRowKeys);
        this.setState({ selectedRowKeys });
    }

    handleOperator = (type,item)=>{
        //  let item = this.state.selectedItem;
        if(type =='create'){
            this.setState({
                title:'创建企业信息',
                isVisible:true,
                type
            })
        }else if(type=="edit" || type=='detail'){
            axios.ajax({
                url:'/supervision/enterprise/getById',
                data:{
                    params:{
                       id:item.id
                    }
                }
            }).then((res)=>{console.log(res)
                if(res.status =='success'){
                    this.setState({
                        title:type=='edit'?'编辑':'查看详情',
                        isVisible:true,
                        type
                    })
                    let data = res.data;
                    this.props.changeEnterprise({...data,propagandaEnclosure:JSON.parse(data.propagandaEnclosure||JSON.stringify([]))});
                }
            })
        }else if(type=="delete"){
            Modal.confirm({
                content:'确定要删除此用户吗？',
                onOk:()=>{
                    axios.ajax({
                        url: '/supervision/enterprise/delete',
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
    handleChangeNormal=(record)=>{
        axios.ajax({
            url:'/abnormal/changeNormal',
            data:{
                params:{
                   enterpriseId:record.id
                }
            }
        }).then((res)=>{
            if(res.status =='success'){
                message.success(`${record.enterpriseName} 已恢复正常`);
                this.requestList();
            }
        })
    }

    
    

render() {
    let _this =this;
    const columns = [
        {
            title: '主体分类',
            dataIndex: 'operationMode'
        },
        {
            title: '市场主体名称',
            dataIndex: 'enterpriseName',
            render(text,record){return <div style={{float:"left"}}>{"  ".replace(/ /g, "\u00a0")}{text}</div>}
        }, {
            title: '统一信用代码',
            dataIndex: 'idNumber',
            render(text,record){return <div style={{float:"left"}}>{"  ".replace(/ /g, "\u00a0")}{text}</div>}
        },{
            title: '法定代表人',
            dataIndex: 'legalPerson'
        }, {
            title: '所在区域',
            dataIndex: 'area',
            render(area){
                let data=(_this.state.areaAllList||[]).find((item)=>item.id==area)||{};
                return data.name;
            }
        },  {
            title: '日常监管机构',
            dataIndex: 'regulators',
            render(regulators){
                let data = (_this.state.deptAllList||[]).find((item)=>item.id==regulators)||{};
                return data.name;
            }
        },{
            title: '异常情形',
            dataIndex: 'abnormalId',
            render(abnormalId){
                let data=(_this.state.abnormalList||[]).find((item)=>item.id==abnormalId)||{};
                return data.content;
            }
        },
        {
            title: '控制台',
            dataIndex:'operation',
            render:(text, record)=>{
                return <div className='textButtonBox'>
                    <div className='textButton' onClick={() => { this.handleOperator('detail',record)}}>查看</div>

                    {this.props.acl.indexOf('/modify')>-1? <div className='textButton' onClick={()=> {this.handleOperator('edit',record)}}>修改</div>:null}

                    {this.props.acl.indexOf('/delete')>-1? <div className='textButton'  onClick={()=> {this.handleOperator('delete',record)}}>删除</div>:null}

                    <div className='textButton'  onClick={() => { this.handleChangeNormal(record) }}>恢复正常</div>

                    <div className='textButton'  onClick={() => { this.handleQr(record) }}>二维码</div>

                </div>

            }
        }
    ]
    const formList = [
        {
            type: 'INPUT',
            label: '市场主体名称',
            field: 'enterpriseName'
        }, {
            type: 'INPUT',
            label: '统一信用代码',
            field: 'idNumber'
        },{
            type: 'INPUT',
            label: '许可证号',
            field: 'licenseNumber'//此处可能有问题
        },{
            type: 'SELECT',
            label: '许可类型',
            field: 'industryList',
            placeholder: '请选择许可类型',
            
            list:(_this.props.industryList||[]).map((item)=>{return{id:item.remark,name:item.name}})
        },
        {
            type: 'AREA_TREE',
            label: '所属区域',
            field: 'areaList',
            placeholder: '请选择所属区域',
           
            list: Utils.getDataSource(this.props.areaList||[])
        },{
            type: 'TREE',
            label: '监管机构',
            field: 'dept',
            placeholder: '请选择责任监管机构',
            
            list: Utils.getDataSource(this.state.deptTree||[])
        },{
            type: 'INPUT',
            label: '监管责任人',
            field: 'supervisor'
        },{
            type: 'SELECT',
            label: '主体分类',
            field: 'operationMode',
            placeholder: '请选择主体分类',
          
            list: [{id: '个体经营户', name: '个体经营户'}, {id: '国有企业', name: '国有企业'}, {id: '有限责任公司', name: '有限责任公司'},
                     {id: '合伙经营', name: '合伙经营'},{id: '事业单位', name: '事业单位'},{id: '其他', name: '其他'}]
        },{
            type: 'INPUT',
            label: '住所/经营场所',
            field: 'registeredAddress'
        },
        {
            type: 'SELECT',
            label: '异常情形',
            field: 'abnormalId',
            placeholder: '请选择异常情形',
            list: (_this.state.abnormalList||[]).map((item)=>{return{id:item.id,name:item.content}})
        },
    ]

    //查询表单style={{display:'table-cell',verticalAlign:'middle'}}
    const SearchForm =<div >
                    <BaseForm formList={formList} filterSubmit={this.handleFilterSubmit}/></div>

    //统计信息
    const Information = <div className='topContent'>
        <div span={3} className='topBox'>
            <div style={{fontSize:16,color:"#000000",fontWeight:1000}}>
                <Icon type="profile" style={{ fontSize: '25px', color: '#FF9900' ,marginLeft:5,margin:10}} />
                总数
            </div>
            <div style={{margin:10,marginLeft:5}}>数量: {this.state.total||''} 家</div>
        </div>
            {/* 以下为旧版的根据 行业类别 统计信息 */}
        {/* {(this.props.industryList||[]).map((item)=>
        {return (this.state.statistics||{})[item.id]?<div className='topBox'>
            <div style={{fontSize:16,color:"#000000",fontWeight:1000}}>
                <Icon type="profile" style={{ fontSize: '25px', color: '#FF9900' ,marginLeft:5,margin:10}} />
                {item.name}
            </div>
            <div style={{margin:10,marginLeft:5}}>数量: {(this.state.statistics||{})[item.id]} 家</div>
        </div>:<div></div>}
            )} */}
        </div>

    return (
        <div ref="enterprise">
            <Card style={{marginTop:10,marginLeft:30,marginRight:30}}>
                <Row>
                    <Col span={3}>
                        {this.props.userType==1?null:
                        <div style={{marginLeft:'3em'}}>
                            <Row style={{marginBottom:5}}> 
                                <span style={{marginLeft:'15%',fontSize:'x-large',color:'RGB(63, 127, 189)',fontWeight:"bold"}}>操作台</span>
                            </Row>
                            <Row>
                                <Button icon="search" size='large' style={{marginBottom:5}} onClick={()=>this.setState({headStatus:false})}>数据查询</Button>     
                            </Row>
                            <Row> 
                                <Button icon="desktop" size='large' style={{marginTop:5}} onClick={()=>this.setState({headStatus:true})}>数据统计</Button>
                            </Row>
                        </div>}
                    </Col>
                    <Col span={1}>
                    <div style={{width:1,height:160,background: 'rgba(0, 0, 0, 0.15)'}}></div>
                    </Col>
                    <Col span={20}  style={{marginLeft:'-7em'}}>
                        {this.props.userType==1?null:
                        <div>
                        {this.state.headStatus?Information:SearchForm}
                        </div>}
                    </Col>
                </Row>
            </Card>

            <Card style={{marginTop:10,marginRight:30,marginLeft:30}}>
                <div className='button-box-left'>
                    <Button style={{color:'red'}}>批量删除</Button>
                </div>
                <div className='button-box'>
                    {this.props.acl.indexOf('/add')>-1?<Button type="primary" onClick={()=>this.handleOperator('create',null)}>新增</Button>:null}
                </div>

                <div style={{marginTop:30}} className="enterpriseTableContent">
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
            <Modal
                title={this.state.title}
                visible={this.state.isVisible}
                destroyOnClose
                onOk={this.handleSubmit}
                okText="保存"
                cancelText="取消"
                maskClosable={false}
                getContainer={()=>this.refs.enterprise}
                footer={this.state.type=='detail'?null:React.ReactNode}
                width={1000}
                onCancel={()=>{
                    this.props.clearEnterprise();
                    this.setState({
                        isVisible:false,
                    })
                }}
            >
                <Add deptTree={Utils.getDataSource(this.state.deptTree||[])} gridTree={Utils.getDataSource(this.state.gridTree||[])} type={this.state.type}/>
            </Modal>
            <Modal
                footer={null}
                title={"二维码"}
                visible={this.state.isQrcodeVisible}
                destroyOnClose
                width={250}
                onCancel={()=>{
                    this.setState({
                        isQrcodeVisible:false,
                    })
                }}
            >
                <QRCode
                    value={this.state.qrUrl}  //value参数为生成二维码的链接
                    size={200} //二维码的宽高尺寸
                    fgColor="#000000"  //二维码的颜色
                />
            </Modal>
            
        </div>
    );
}
}
export default AbnormalEnterprise;

