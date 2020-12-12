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
import ChangeNormal from './childrenForm/ChangeNormal';
import FormForAbnormal from './childrenForm/FormForAbnormal'


@connect(
    state=>({
        input:state.enterprise,
        industryList:state.industryList,
        areaList:state.areaList,
        userType:state.userType,
        acl:state.acls['/zombieEnterprise']
    }),{
        clearEnterprise,
        changeEnterprise
    }
)
class ZombieEnterprise extends Component{
    state = {
        selectedRowKeys: [], // Check here to configure the default column
        headStatus:false,
        abnormalData:{}
    };
    params = {
        pageNo:1,
        industryList:'',
        areaList:'',
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
        axios.PostAjax({
            url:'/supervision/enterprise/getCountPC',
            data: {
                params:{
                    ...this.params,
                    areaList:[this.params.areaList],
                    industryList:[this.params.industryList],
                    indexNum:0
                }
            }
        }).then((res)=>{
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
                params:{...this.params,judgeType:2,areaList:[this.params.areaList],industryList:[this.params.industryList]}

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
    requestDeptGrid=()=>{
        axios.noLoadingAjax({
            url:'/supervision/enterprise/getDeptAndGrid',
            data:{
                params:{}
            }
        }).then((res)=>{
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
        }).then((res)=>{
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
        if(type =='create'){
            this.setState({
                FormVisible:true,
            })
        }else if(type=="edit" || type=='detail'){
            axios.ajax({
                url:'/supervision/enterprise/getById',
                data:{
                    params:{
                        id:item.id
                    }
                }
            }).then((res)=>{
                if(res.status =='success'){
                    this.setState({
                        title:type=='edit'?'编辑':'查看详情',
                        isVisible:true,
                        type,
                        searchEmployee:item.id
                    })
                    let data = res.data;
                    this.props.changeEnterprise({...data,
                        propagandaEnclosure:JSON.parse(data.propagandaEnclosure||JSON.stringify([])),
                        businessLicensePhoto:JSON.parse(data.businessLicensePhoto||JSON.stringify([])),
                        foodBusinessPhotos:JSON.parse(data.foodBusinessPhotos||JSON.stringify([])),
                        smallCaterPhotos:JSON.parse(data.smallCaterPhotos||JSON.stringify([])),
                        smallWorkshopPhotos:JSON.parse(data.smallWorkshopPhotos||JSON.stringify([])),
                        foodProducePhotos:JSON.parse(data.foodProducePhotos||JSON.stringify([])),
                        drugsBusinessPhotos:JSON.parse(data.drugsBusinessPhotos||JSON.stringify([])),
                        drugsProducePhotos:JSON.parse(data.drugsProducePhotos||JSON.stringify([])),
                        cosmeticsUsePhotos:JSON.parse(data.cosmeticsUsePhotos||JSON.stringify([])),
                        medicalProducePhotos:JSON.parse(data.medicalProducePhotos||JSON.stringify([])),
                        medicalBusinessPhotos:JSON.parse(data.medicalBusinessPhotos||JSON.stringify([])),
                        industrialProductsPhotos:JSON.parse(data.industrialProductsPhotos||JSON.stringify([])),
                        publicityPhotos:JSON.parse(data.publicityPhotos||JSON.stringify([])),
                        certificatePhotos:JSON.parse(data.certificatePhotos||JSON.stringify([])),
                        otherPhotos:JSON.parse(data.otherPhotos||JSON.stringify([]))
                    });
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
    handleChangeNormal=(item)=>{
        axios.ajax({
            url:'/supervision/enterprise/getById',
            data:{
                params:{
                    id:item.id
                }
            }
        }).then((res)=>{
            if(res.status =='success'){
                this.setState({
                    normalVisible:true,
                    enterpriseData:res.data
                })
            }
        })
    }
    handleSubmitNormal=()=>{

        if(!this.state.abnormalData.businessState)
        {
            Modal.error({title:"经营状态为必选"})
            return
        }
        axios.ajax({
            url:'abnormal/changeNormal',
            data:{
                params:{
                    enterpriseId:this.state.enterpriseData.id,
                    businessState:this.state.abnormalData.businessState
                }
            }
        }).then((res)=>{
            if(res.status =='success'){
                this.setState({
                    normalVisible:false,
                    enterpriseData:'',
                    abnormalData:''
                })
                this.requestList();
            }
        })
    }




    render() {
        console.log(this.props)
        let _this =this;
        const statistics = this.state.statistics ||{}
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
                title: '异常备注',
                dataIndex: 'abnormalContent',

            },{
                title: '经营状态',
                dataIndex: 'businessState',
                render(businessState) {
                    return businessState==4?'已注销':'已倒闭';
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

                        <div className='textButton' style={{color:'#cc0000'}}  onClick={() => { this.handleChangeNormal(record) }}>异常处理</div>

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
                field: 'licenseNumber'
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
                list: [{id: '个体', name: '个体户'}, {id: '公司', name: '公司'},{id: '合作社', name: '合作社'},{id: '其他', name: '其他'}]
            },{
                type: 'INPUT',
                label: '法定代表人',
                field: 'legalPerson'
            },
            {
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
                //尚未实现
            },
            {
                type: 'SELECT',
                label: '经营状态',
                field: 'businessState',
                placeholder: '请选择经营状态',
                list: [{id:4,name:'已注销'},{id:5,name:'已倒闭'}]
            }
        ]

        //查询表单style={{display:'table-cell',verticalAlign:'middle'}}
        const SearchForm =<div style={{marginRight:'2%'}}><BaseForm formList={formList} filterSubmit={this.handleFilterSubmit}/></div>


        //统计信息
        const Information =

            <div style={{float:"left",width:'100%'}}>

                <div className='statisticsBigBox'>
                    <div style={{margin:6,fontSize:16,fontWeight:"bold",borderBottom:'1px solid #E6E9EC'}}>异常企业总计数量</div>
                    <div>
                        <img src={require("./img/市场主体图标.png")} style={{height:50,margin:15}} alt=""/>
                        <span style={{fontSize:34,color:'red'}}>{this.state.total||''}</span>
                    </div>
                    <div style={{float:"right"}}>单位：家</div>
                </div>

                <div style={{float:"left",marginLeft:'2%',width:'18%'}}>

                    <div className='statisticsLittleBox'>
                        <img className="forImg" src={require("./img/公司类.png")}  alt=""/>
                        <div className="title">公司类</div>
                        <div className="number" style={{color:'red'}}>{''}</div>
                        <div style={{float:"right",marginTop:"16%"}}>单位：家</div>
                    </div>
                    <div style={{marginTop:10}} className='statisticsLittleBox'>
                        <img className="forImg"src={require("./img/个体类.png")} alt=""/>
                        <div className="title">个体类</div>
                        <div className="number" style={{color:'red'}}>{''}</div>
                        <div style={{float:"right",marginTop:"16%"}}>单位：家</div>
                    </div>

                </div>

                <div style={{float:"left",marginLeft:'2%',width:'18%'}}>

                    <div className='statisticsLittleBox'>
                        <img className="forImg" src={require("./img/合作社.png")}  alt=""/>
                        <div className="title">合作社</div>
                        <div className="number" style={{color:'red'}}>{''}</div>
                        <div style={{float:"right",marginTop:"16%"}}>单位：家</div>
                    </div>

                    <div style={{marginTop:10}} className='statisticsLittleBox'>
                        <img className="forImg" src={require("./img/其他类.png")}  alt=""/>
                        <div className="title">其他类</div>
                        <div className="number" style={{color:'red'}}>{''}</div>
                        <div style={{float:"right",marginTop:"16%"}}>单位：家</div>
                    </div>

                </div>

                <div className='statisticsJumpBox' >
                    <div style={{height:52,marginTop:35,textAlign:'center'}}><img src={require("./img/市场主体图标.png")} style={{maxHeight:'100%',maxWidth:'100%'}} alt=""/></div>
                    <div style={{color:"RGB(38, 167, 220)",marginTop:20,textAlign:'center'}}>加载更多</div>
                </div>

                <div className='statisticsTipsBox'>
                    <div style={{color:"#99CC33",marginTop:10,marginLeft:7,fontSize:16,borderBottom:'1px solid #E6E9EC'}}>状态提示:</div>
                    <div style={{height:16,margin:20}}>
                        <div style={{width:30,height:15,background:'RGB(255, 118, 95)',borderRadius:5,float:"left"}}></div>
                        <div style={{float:"left",marginLeft:15}}>许可证超期报警</div>
                    </div>
                    <div style={{height:16,margin:20}}>
                        <div style={{width:30,height:15,background:'RGB(253, 221, 110)',borderRadius:5,float:"left"}}></div>
                        <div style={{float:"left",marginLeft:15}}>许可证超期预警（30天内）</div>
                    </div>
                </div>

            </div>



        return (
            <div ref="enterprise">
                { this.props.userType==1?null:
                    <Card style={{marginTop:10,marginLeft:30,marginRight:30}} bodyStyle={this.state.headStatus?{}:{paddingBottom:0}}>

                        <div style={{borderRight:'1px solid rgba(0, 0, 0, 0.15)',float:"left",width:'12%'}}>
                            <div style={{textAlign:"center",marginBottom:10,fontSize:'x-large',color:'RGB(63, 127, 189)',fontWeight:"bold"}}>操作台</div>

                            <div style={{textAlign:"center",marginBottom:5,height:45,cursor: "pointer"}} onClick={()=>this.setState({headStatus:false})}>
                                {this.state.headStatus == false?<img src={require("./img/数据查询【开】.png")} style={{maxHeight:'100%',maxWidth:'100%'}} alt=""/>:<img src={require("./img/数据查询【关】.png")} style={{maxHeight:'100%',maxWidth:'100%'}} alt=""/>}
                            </div>

                            <div style={{textAlign:"center",marginTop:5,height:45,cursor: "pointer"}} onClick={()=>this.setState({headStatus:true})}>
                                {this.state.headStatus?<img src={require("./img/数据统计【开】.png")} style={{maxHeight:'100%',maxWidth:'100%'}} alt=""/>:<img src={require("./img/数据统计【关】.png")} style={{maxHeight:'100%',maxWidth:'100%'}} alt=""/>}
                            </div>
                        </div>

                        <div style={{width:'88%',float:"left"}}>
                            {this.state.headStatus?Information:SearchForm}
                        </div>

                    </Card>}

                <Card style={{marginTop:10,marginRight:30,marginLeft:30}}>
                    <div className='button-box-left'>
                        <Button style={{color:'red'}}>批量删除</Button>
                    </div>
                    {/*<div className='button-box'>*/}
                    {/*    {this.props.acl.indexOf('/add')>-1?<Button type="primary" onClick={()=>this.handleOperator('create',null)}>新增</Button>:null}*/}
                    {/*</div>*/}

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
                    <Add deptTree={Utils.getDataSource(this.state.deptTree||[])} gridTree={Utils.getDataSource(this.state.gridTree||[])}
                         type={this.state.type} searchEmployee={this.state.searchEmployee}
                    />
                </Modal>
                <Modal
                    title="新增企业异常"
                    visible={this.state.FormVisible}
                    destroyOnClose
                    maskClosable={true}
                    footer={null}
                    width={1200}
                    onCancel={()=>{
                        this.setState({
                            FormVisible:false,
                        })
                        this.requestList()
                    }}
                >
                    <FormForAbnormal  />
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
                <Modal
                    title={"企业异常恢复"}
                    visible={this.state.normalVisible}
                    destroyOnClose
                    onOk={this.handleSubmitNormal}
                    okText="确定"
                    cancelText="取消"
                    maskClosable={false}
                    width={500}
                    onCancel={()=>{
                        this.setState({
                            normalVisible:false,
                            enterpriseData:'',
                            abnormalData:''
                        })
                    }}
                >
                    <ChangeNormal enterpriseData={this.state.enterpriseData||{}}
                                  type = {"zombieEnterprise"}
                                  abnormalData = {this.state.abnormalData||{}}
                                  dispatchAbnormalData={(data)=>{this.setState({abnormalData:data})}}
                    />
                </Modal>

            </div>
        );
    }
}
export default ZombieEnterprise;

