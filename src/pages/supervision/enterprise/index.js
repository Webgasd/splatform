import React,{Component} from 'react';
import {Card, Button, Modal, Icon, Upload, message} from 'antd';
import  BaseForm  from '../../../components/BaseForm';
import ETable from '../../../components/ETable';
import Utils from "../../../utils";
import axios from "../../../axios";
import QRCode  from 'qrcode.react';
import Add from './Add';
import moment from "moment";
import MapPosition from './MapPosition';
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
 class enterpriseInformation extends Component{
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
    }

    requestStatistics=()=>{
        axios.noLoadingAjax({
            url:'/supervision/enterprise/getStatistics',
            data: {
                params:{}
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
        }).then((res)=>{
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
                            this.params.pageNo = current;//	当前页数
                            this.requestList(); //刷新列表数据
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

    //压缩函数
    compress = (base64String, w, quality)=>{
        let getMimeType = function (urlData) {
            let arr = urlData.split(',');
            let mime = arr[0].match(/:(.*?);/)[1];
            // return mime.replace("image/", "");
            return mime;
        };
        let newImage = new Image();
        let imgWidth, imgHeight;
 
        let promise = new Promise(resolve => newImage.onload = resolve);
        newImage.src = base64String;
        return promise.then(() => {
            imgWidth = newImage.width;
            imgHeight = newImage.height;
            let canvas = document.createElement("canvas");
            let ctx = canvas.getContext("2d");
            if (Math.max(imgWidth, imgHeight) > w) {
                if (imgWidth > imgHeight) {
                    canvas.width = w;
                    canvas.height = w * imgHeight / imgWidth;
                } else {
                    canvas.height = w;
                    canvas.width = w * imgWidth / imgHeight;
                }
            } else {
                canvas.width = imgWidth;
                canvas.height = imgHeight;
            }
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.drawImage(newImage, 0, 0, canvas.width, canvas.height);
            let base64 = canvas.toDataURL(getMimeType(base64String), quality);
            console.log(base64);
            return base64;
        });
    }

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
    setRowClassName = (record) => {
   if(moment(record.endTime).isBetween(moment(),moment().add(1,'month')) ){
        return 'warningRowStyl';
    }else if(moment(record.endTime).isBefore())
   {  return 'clickRowStyl';}else {
       return '';
   }
    }

    handlePosition = (index) =>{

    }
    handleState = (index) =>{

    }
    handleQr = (item) =>{
       this.setState({
           isQrcodeVisible:true,
           qrUrl:baseUrl+'/#/enterpriseInfoNew?id='+item.id
       })
    }
    handleDaily = (index) =>{

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
        }else if(type=="stop"){
            Modal.confirm({
                text:'信息',
                content:item.isStop==0?'是否确定停用':'是否确定启用',
                onOk:()=>{
                    axios.ajax({
                        url: '/supervision/enterprise/changeStop',
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
        }else if(type=="map"){
            this.setState({
                title:type=='地图定位',
                isMapVisible:true,
                AreaId:item.grid,
                enterpriseId:item.id,
                type
            })
        }
    }
    updateAndTransform=()=>{
        axios.ajax({
            url:'/grid/points/transform'
        }).then((res)=>
        {if(res.status=='success') {
            if(res.data.update==true)message.success("更新成功")
            else if(res.data.update==false)message.success("已经是最新状态")
        }})
    }
    

    render() {
        let _this =this;
        const columns = [
            {
                title: '企业名称',
                dataIndex: 'enterpriseName'
            }, {
                title: '企业规模',
                dataIndex: 'enterpriseScale'
            },{
                title: '社会信用代码',
                dataIndex: 'idNumber'
            }, {
                title: '所在区域',
                dataIndex: 'area',
                render(area){
                    let data=(_this.state.areaAllList||[]).find((item)=>item.id==area)||{};
                    return data.name;
                }
            }, {
                title: '所属网格',
                dataIndex: 'grid',
                render(grid){
                    let data = (_this.state.areaAllList||[]).find((item)=>item.id==grid)||{};
                    return data.name;
                }
            }, {
                title: '责任监管机构',
                dataIndex: 'regulators',
                render(regulators){
                    let data = (_this.state.deptAllList||[]).find((item)=>item.id==regulators)||{};
                    return data.name;
                }
            }, {
                title: '责任监管人员',
                dataIndex: 'supervisor',
            },{
                title: '停用状态',
                dataIndex: 'isStop',
                render(isStop){
                    if (isStop == 0) {
                        return "启用"
                    } else {
                        return "停用"
                    }
                }
            },
            {
                title: '操作',
                dataIndex:'operation',
                render:(text, record)=>{
                    return <div className='textButtonBox'>
                        <div className='textButton' onClick={() => { this.handleOperator('detail',record)}}>查看</div>
                        {this.props.acl.indexOf('/modify')>-1? <div className='textButton' onClick={()=> {this.handleOperator('edit',record)}}>修改</div>:null}
                        {this.props.acl.indexOf('/delete')>-1? <div className='textButton'  onClick={()=> {this.handleOperator('delete',record)}}>删除</div>:null}
                        <div className='textButton' onClick={()=> {this.handleOperator('map',record)}}>地图定位</div>
                        {this.props.acl.indexOf('/modify')>-1? <div className={record.isStop==0?'textButton':'stopTextButton'} onClick={() => { this.handleOperator('stop',record)}}>{record.isStop==0?'停用':'启用'}</div>:null}
                         <div className='textButton'  onClick={() => { this.handleQr(record) }}>二维码</div>
                        {/*<Col span={3}><div className='textButton'  onClick={() => { this.handleDaily = (record) }}>日志</div></Col>*/}
                    </div>

                }
            }
        ]
        const formList = [
            {
                type: 'INPUT',
                label: '企业名称',
                field: 'enterpriseName'
            }, {
                type: 'INPUT',
                label: '社会信用代码',
                field: 'creditCode'
            },{
                type: 'INPUT',
                label: '许可证号',
                field: 'licenseNumber'
            },{
                type: 'AREA_TREE',
                label: '所属区域',
                field: 'areaList',
                placeholder: '请选择所属区域',
                width: 150,
                list: Utils.getDataSource(this.props.areaList||[])
            },{
                type: 'SELECT',
                label: '企业规模',
                field: 'enterpriseScale',
                placeholder: '请选择企业规模',
                width: 150,
                list: [{id: '超大', name: '超大'}, {id: '大型', name: '大型'}, {id: '中型', name: '中型'}, {id: '小型', name: '小型'}]
            },{
                type: 'SELECT',
                label: '停用状态',
                field: 'isStop',
                placeholder: '请选择停用状态',
                width: 150,
                list: [{id: 0, name: '启用'}, {id: 1, name: '停用'}]
            },{
                type: 'SELECT',
                label: '许可状态',
                field: 'permissionStatus',
                placeholder: '请选择许可状态',
                width: 150,
                list: [{id: '正常', name: '正常'},{id: '延续', name: '延续'},{id: '变更', name: '变更'},{id: '注销', name: '注销'},{id: '撤销', name: '撤销'}]
            } ,{
                type: 'TREE',
                label: '责任监管机构',
                field: 'dept',
                placeholder: '请选择责任监管机构',
                width: 150,
                list: Utils.getDataSource(this.state.deptTree||[])
            },{
                type: 'INPUT',
                label: '责任监管人员',
                field: 'supervisor'
            },{
                type: 'SELECT',
                label: '许可类型',
                field: 'industryList',
                placeholder: '请选择许可类型',
                width: 150,
                list:(_this.props.industryList||[]).map((item)=>{return{id:item.remark,name:item.name}})
            },{
                type: 'TIME',
                label: '许可有效期限',
                field: 'Time'
            }
        ]
        const SearchForm =<div style={{display:'table-cell',verticalAlign:'middle',paddingLeft:30}}>
                        <BaseForm formList={formList} filterSubmit={this.handleFilterSubmit}/></div>
        const Information = <div className='topContent'>
            <div span={3} className='topBox'>
                <div style={{fontSize:16,color:"#000000",fontWeight:1000}}>
                    <Icon type="profile" style={{ fontSize: '25px', color: '#FF9900' ,marginLeft:5,margin:10}} />
                   总数
                </div>
                <div style={{margin:10,marginLeft:5}}>数量: {this.state.total||''} 家</div>
            </div>
            {(this.props.industryList||[]).map((item)=>
            {return (this.state.statistics||{})[item.id]?<div className='topBox'>
                <div style={{fontSize:16,color:"#000000",fontWeight:1000}}>
                    <Icon type="profile" style={{ fontSize: '25px', color: '#FF9900' ,marginLeft:5,margin:10}} />
                    {item.name}
                </div>
                <div style={{margin:10,marginLeft:5}}>数量: {(this.state.statistics||{})[item.id]} 家</div>
            </div>:<div></div>}
               )}
            </div>
        return (
            <div ref="enterprise">
                {this.props.userType==1?null:<div style={{height:120,display:'table',width:'100%'}}>
                    {this.state.headStatus?Information:SearchForm}
                </div>}

                <Card style={{marginTop:10,marginRight:30,marginLeft:30}}>
                    {this.props.userType==1?null:<div className='button-box-left'>
                        <Button type="primary" onClick={()=>this.setState({headStatus:this.state.headStatus?false:true})}>{this.state.headStatus?'查询':'统计'}</Button>
                    </div>}
                    <div className='button-box'>
                        {this.props.acl.indexOf('/add')>-1?<Button type="primary" onClick={()=>this.handleOperator('create',null)}>添加</Button>:null}
                        {this.props.acl.indexOf('/modify')>-1?<Button type="primary" onClick={()=>this.updateAndTransform()}>更新定位</Button>:null}
                        {this.props.acl.indexOf('/import')>-1?  <Upload action={commonUrl+"/supervision/enterprise/importExcel"}
                                showUploadList={false}
                                onChange={(info)=>{
                                    if (info.file.status === 'done') {
                                        if(info.file.response.status=='success'){
                                            alert(info.file.response.status);
                                        }else {
                                            alert(info.file.response.data.errMsg);
                                        }
                                        this.requestList();
                                    } else if (info.file.status === 'error') {
                                        if(info.file.response.status=='success'){
                                            alert(info.file.response.status);
                                        }else {
                                            alert(info.file.response.data.errMsg);
                                        }
                                    }
                                }}>
                            <Button type="primary" >导入</Button>
                        </Upload>:null}
                        {/*<Button type="primary" onClick={this.handleDelete}>删除</Button>*/}
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
                    okText="确定"
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
                    title={this.state.title}
                    visible={this.state.isMapVisible}
                    destroyOnClose
                    width={800}
                    onCancel={()=>{
                        this.setState({
                            isMapVisible:false,
                        })
                    }}
                >
                    <MapPosition AreaId={this.state.AreaId} enterpriseId={this.state.enterpriseId}/>
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
export default enterpriseInformation;

