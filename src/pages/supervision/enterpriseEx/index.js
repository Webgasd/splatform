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
import Abnormal from './childrenForm/Abnormal';
import StatisticBox from './childrenForm/StatisticBox';
import loadingPicture from './img/地图更新中.gif';
import ImportData from './childrenForm/ImportData';

@connect(
    state=>({
        input:state.enterprise,
        industryList:state.industryList,
        areaList:state.areaList,
        userType:state.userType,
        acl:state.acls['/enterpriseInformationEx']
    }),{
        clearEnterprise,
        changeEnterprise
    }
)
 class EnterpriseInformation extends Component{
    state = {
        abnormalData:{},
        selectedRowKeys: [], // Check here to configure the default column
        headStatus:false,
        updateNumbers:0,
        insertNumbers:0,
        errMsg:'',
        errList:[],
        importTitle:"",
        importResult:0,
        importRefresh:true
        
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

    requestList = ()=>{
        let _this = this;
        axios.PostAjax({
            url:'/supervision/enterprise/getPage',
            data:{
                params:{...this.params,areaList:[this.params.areaList],industryList:[this.params.industryList]}
            }
        }).then((res)=>{console.log(res)
            if(res.status == "success"){
                if(res.status == "success"){
                    if(res.data!==null){
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
                    }else{
                        res.data = {"total":0,"data":[],"pageNo": 1,"pageSize": 10}
                        this.setState({
                            list:res.data.data,
                            pagination:Utils.pagination(res,(current)=>{
                                this.params.pageNo = current;//	当前页数
                                this.requestList(); //刷新列表数据
                            })
                        })
                    }
                }
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
                    deptTree: res.data.deptTree||[]
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
    handleDelete = ()=>{
        let ids = this.state.selectedIds;
        let _this = this;
            if(!ids){
                Modal.info({
                    title: '信息',
                    content: '请选择用户'
                })
                return;
            }
            Modal.confirm({
                content:'确定要删除这些用户吗？',
                onOk:()=>{
                    axios.ajax({
                        url:'/supervision/enterprise/delete',
                        data:{
                            params:{...ids}
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

    setRowClassName = (record) => {
   if(moment(record.endTime).isBetween(moment(),moment().add(1,'month')) ){
        return 'warningRowStyl';
    }else if(moment(record.endTime).isBefore())
   {  return 'clickRowStyl';}else {
       return '';
   }
    }

    // 尚未用到
    // handlePosition = (index) =>{

    // }
    // handleState = (index) =>{

    // }
    // handleDaily = (index) =>{

    // }

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
                type,
                searchEmployee:'',
                
            })
            let input = {...this.props.input,permissionFamily:""}
            this.props.changeEnterprise(input);
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
    updateAndTransform=()=>{
        
        Modal.confirm({
            content:'更新定位需要较长时间，确定执行吗？',
            onOk:()=>{
                this.setState({
                    updateModalVisible:true
                })
                let _this = this
                axios.ajax({
                    url:'/grid/points/transform'
                    }).then((res)=>{
                        _this.setState({
                            updateModalVisible:false
                        })
                    if(res.status==='success') {
                        if(res.data.state==='success'){
                            Modal.success({
                                content:res.data.update
                            })
                        }
                        if(res.data.state==='failed') {
                            Modal.error({
                                title:'存在错误信息',
                                content: res.data.update,
                              });
                        }
                    }
                })
            }
        })
    }
    handleAbnormal=(item)=>{
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
                        isAbnormalVisible:true,
                        enterpriseData:res.data
                    })
                }
            })
    }
    handleSubmitAbnormal=()=>{

        if(!this.state.abnormalData.abnormalType)
        {
          Modal.error({title:"异常情形为必选"})
            return
        }
        axios.ajax({
            url:'abnormal/insertContent',
            data:{
                params:{
                   enterpriseId:this.state.enterpriseData.id,
                   abnormal:this.state.abnormalData.abnormalType,
                   abnormalContent:this.state.abnormalData.abnormalContent
                }
            }
        }).then((res)=>{
            if(res.status =='success'){
                this.setState({
                    isAbnormalVisible:false,
                    enterpriseData:'',
                    abnormalData:''
                })
                this.requestList();
            }
        })
    }
    openStatisticBox=()=>{
        this.setState({
            statisticBoxVisible:true
        })
    }
    handleImportModal=()=>{
        this.setState({
            importModalVisible:false
        })
        if(this.state.importRefresh){
            this.requestList();
        }
        
    }
    handleFile=(info)=>{console.log(info)
        if (info.file.status === 'done') {
            if(info.file.response.status=='success'){
               this.setState({
                   importTitle:" 企业导入成功报告",
                   importModalVisible:true,
                   updateNumbers:info.file.response.data.updateNumbers,
                   insertNumbers:info.file.response.data.insertNumbers,
                   importResult:1,
                   importRefresh:true
               })
            }else {
                this.setState({
                    importTitle:" 企业导入错误汇报",
                    importModalVisible:true,
                    errMsg:info.file.response.data.errMsg,
                    errList:info.file.response.data.errList,
                    importResult:2,
                    importRefresh:true
                })
            }
        } 
        else if (info.file.status === 'error') {
            if(info.file.response.status=='success'){
                this.setState({
                    importTitle:" 企业导入成功报告",
                    importModalVisible:true,
                    updateNumbers:info.file.response.data.updateNumbers,
                    insertNumbers:info.file.response.data.insertNumbers,
                    importResult:1,
                    importRefresh:false
                })
            }else {
                this.setState({
                    importTitle:" 企业导入错误汇报",
                    importModalVisible:true,
                    errMsg:info.file.response.data.errMsg,
                    errList:info.file.response.data.errList,
                    importResult:2,
                    importRefresh:false
                })
            }
        }

    }

render() {
    let _this =this;
    // console.log(this.state)
    const statistics = this.state.statistics ||{}
    const columns = [
        {
            title: '主体分类',
            dataIndex: 'operationMode',
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
        }, {
            title: '日常监管责任人',
            dataIndex: 'supervisor',
        },{
            title: '经营状态',
            dataIndex: 'businessState',
            render(businessState){
                if (businessState === 1) {
                    return "新增"
                } if (businessState === 2) {
                    return "正常"
                } else if(businessState === 3){
                    return "异常"
                }
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

                    <div className='textButton'  onClick={() => { this.handleAbnormal(record) }}>异常报送</div>

                    <div className='textButton'  onClick={() => { this.handleQr(record) }}>二维码</div>

                    {/* <div className='textButton' onClick={()=> {this.handleOperator('map',record)}}>地图定位</div> */}

                    {/* {this.props.acl.indexOf('/modify')>-1? 
                        <div className={record.isStop==0?'textButton':'stopTextButton'} onClick={() => {this.handleOperator('stop',record)}}>
                            {record.isStop==0?'停用':'启用'}
                        </div>
                        :null} */}

                    

                    {/*<Col span={3}><div className='textButton'  onClick={() => { this.handleDaily = (record) }}>日志</div></Col>*/}
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
            field: 'creditCode'
        },{
            type: 'INPUT',
            label: '许可证号',
            field: 'licenseNumber'
        },{
            type: 'SELECT',
            label: '许可类型',
            field: 'industryList',
            placeholder: '请选择许可类型',
            width: 150,
            list:(_this.props.industryList||[]).map((item)=>{return{id:item.remark,name:item.name}})
        },
        {
            type: 'AREA_TREE',
            label: '所属区域',
            field: 'areaList',
            placeholder: '请选择所属区域',
            width: 150,
            list: Utils.getDataSource(this.props.areaList||[])
        },{
            type: 'TREE',
            label: '监管机构',
            field: 'dept',
            placeholder: '请选择责任监管机构',
            width: 150,
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
            width: 150,
            list: [{id: '个体', name: '个体户'}, {id: '公司', name: '公司'},{id: '合作社', name: '合作社'},{id: '其他', name: '其他'}]
        },{
            type: 'SELECT',
            label: '经营状态',
            field: 'businessState',
            placeholder: '请选择经营状态',
            width: 150,
            list: [{id: 1, name: '新增'}, {id: 2, name: '正常'}]
        },{
            type: 'INPUT',
            label: '法定代表人',
            field: 'legalPerson'
             //尚未实现
        },
        {
            type: 'INPUT',
            label: '住所/经营场所',
            field: 'registeredAddress'
        }, 
        {
            type: 'INPUT',
            label: '经营范围',
            field: 'enterpriseScale'
         },
        //  {
        //     type: 'INPUT',
        //     label: '许可项目',//此处不对
        //     field: 'supervisor'
        // },
    ]

    const SearchForm =<div style={{marginRight:'2%'}} > <BaseForm formList={formList} filterSubmit={this.handleFilterSubmit}/></div>
                           
    //统计信息
    const Information = 
    <div style={{float:"left",width:'100%'}}>
        
        <div className='statisticsBigBox'>
            <div style={{margin:6,fontSize:16,fontWeight:"bold",borderBottom:'1px solid #E6E9EC'}}>企业主体总计数量</div>
            <div> 
                <img src={require("./img/市场主体图标.png")} style={{height:50,margin:15}} alt=""/>
                <span style={{fontSize:34,color:'#169BD5'}}>{this.state.total||''}</span> 
            </div>
            <div style={{float:"right"}}>单位：家</div>
        </div>
        
        <div style={{float:"left",marginLeft:'2%',width:'18%'}}>

            <div className='statisticsLittleBox'>
                <img className="forImg" src={require("./img/公司类.png")}  alt=""/>
                <div className="title">公司类</div> 
                <div className="number">{statistics?statistics.enterprise:''}</div>
                <div style={{float:"right",marginTop:"16%"}}>单位：家</div>
            </div>
            <div style={{marginTop:10}} className='statisticsLittleBox'>
                <img className="forImg"src={require("./img/个体类.png")} alt=""/>
                <div className="title">个体类</div> 
                <div className="number">{statistics?statistics.individual:''}</div>
                <div style={{float:"right",marginTop:"16%"}}>单位：家</div>
            </div>

        </div>

        <div style={{float:"left",marginLeft:'2%',width:'18%'}}>
           
            <div className='statisticsLittleBox'>
                <img className="forImg" src={require("./img/合作社.png")}  alt=""/>
                <div className="title">合作社</div>
                <div className="number">{statistics?statistics.cooperation:''}</div>
                <div style={{float:"right",marginTop:"16%"}}>单位：家</div>
            </div>
        
            <div style={{marginTop:10}} className='statisticsLittleBox'>
                <img className="forImg" src={require("./img/其他类.png")}  alt=""/>
                <div className="title">其他类</div>
                <div className="number">{statistics?statistics.others:''}</div>
                <div style={{float:"right",marginTop:"16%"}}>单位：家</div>
            </div>
            
        </div>

        <div className='statisticsJumpBox' onClick={()=>this.openStatisticBox()}>
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
                    <Button style={{color:'red'}} onClick={()=>this.handleDelete()} disabled={true} >批量删除</Button>
                </div>
                <div className='button-box'>
                    {this.props.acl.indexOf('/add')>-1?<Button type="primary" onClick={()=>this.handleOperator('create',null)}>新增</Button>:null}
                    {this.props.acl.indexOf('/modify')>-1?<Button style={{backgroundColor:'RGB(153, 204, 51)',color:'white'}} onClick={()=>this.updateAndTransform()}>全局定位更新</Button>:null}
                    {this.props.acl.indexOf('/import')>-1?
                        <Upload action={commonUrl+"/supervision/enterprise/importExcel"}
                            showUploadList={false}
                            onChange={(info)=>this.handleFile(info)}
                            >
                        <Button style={{backgroundColor:'RGB(255, 153, 0)',color:'white'}}>数据导入</Button>
                    </Upload>:null}
                        
                    {/* <Button style={{backgroundColor:'RGB(204, 153, 0)',color:'white'}}>数据导出</Button> */}
                    {/* <Button style={{backgroundColor:'RGB(102, 204, 255)',color:'white'}}>模板下载</Button> */}
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
                <Add deptTree={Utils.getDataSource(this.state.deptTree||[])} gridTree={Utils.getDataSource(this.state.gridTree||[])} type={this.state.type}
                 searchEmployee={this.state.searchEmployee}
                />
            </Modal>
            <Modal
                title={this.state.importTitle}
                visible={this.state.importModalVisible}
                maskClosable={false}
                closable={false}
                destroyOnClose
                footer={[<Button style={{background:'RGB(22,155,213)'}} onClick={()=>this.handleImportModal()}>确定</Button>]}
                width={500}
                centered={true}
            >
                <ImportData updateNumbers={this.state.updateNumbers} insertNumbers={this.state.insertNumbers}
                 errList={this.state.errList} errMsg={this.state.errMsg} importResult={this.state.importResult}
                 />
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
                title={"企业异常报送"}
                visible={this.state.isAbnormalVisible}
                destroyOnClose
                onOk={this.handleSubmitAbnormal}
                okText="确定"
                cancelText="取消"
                maskClosable={false}
                width={500}
                onCancel={()=>{
                    this.setState({
                        isAbnormalVisible:false,
                        enterpriseData:'',
                        abnormalData:''
                    })
                }}
            >
                <Abnormal enterpriseData={this.state.enterpriseData||{}}
                         abnormalData = {this.state.abnormalData||{}}
                        dispatchAbnormalData={(data)=>{this.setState({abnormalData:data})}}
                />
            </Modal>
            <Modal
                title={"数据统计"}
                visible={this.state.statisticBoxVisible}
                destroyOnClose
                footer={null}
                width={1000}
                onCancel={()=>{
                    this.setState({
                        statisticBoxVisible:false,
                    })
                }}
            >
                <StatisticBox
                 total = {this.state.total ||{}}
                 />
            </Modal>
            <Modal
                title={"定位中..."}
                visible={this.state.updateModalVisible}
                maskClosable={false}
                closable={false}
                destroyOnClose
                footer={null}
                width={309}
                centered={true}
            >
             <div style={{textAlign:"center"}}>
                <img src={loadingPicture} alt='' style={{height:200,marginRight:20}}/>
                <div style={{color:'RGB(153, 204, 51)'}}>定位时间较久，请耐心等待</div>
            </div>
            </Modal>
           
            
        </div>
    );
}
}
export default EnterpriseInformation;

