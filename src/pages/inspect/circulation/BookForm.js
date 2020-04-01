import React,{Component} from 'react';
import {Button, Modal, Table} from "antd";
import {commonUrl} from "../../../axios/commonSrc";
import CheckBookForm from "./CheckBookForm";
import BookConfigForm from '../restaurantscheck/bookConfig';
import axios from "../../../axios";
import moment from "moment";
const ButtonGroup = Button.Group;

class BookForm extends Component {
    state={}
    //调用封装好的axios.requestList()获取角色数据
    componentDidMount(){
        if(this.props.type=='edit'||this.props.type=='detail'){
            this.requestList();
            this.requestAllDept();
        }
    }
    requestList = ()=>{
        axios.ajax({
            url:'/inspect/dailyBook/getByCheckId',
            data:{
                params:{checkId:this.props.inspectData.id}
            }
        }).then((res)=>{
            if(res.status == "success"){
                let list  = res.data.map((item,i)=>{
                    item.key = i;
                    return item;
                })
                this.setState({
                    list:list
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

    getSubmitUrl=(data)=>{
        switch (data) {
            case '/checkTranscript':
                return '/inspect/record'
            case '/orderRectification':
                return '/inspect/retification'
            case '/detailList':
                return '/inspect/financial'
            case '/compulsoryMeasure':
                return '/inspect/force'
            case '/assistSeizure':
                return '/inspect/assist'
            case '/receivingService':
                return '/inspect/evidence'
            default:
                return ''
        }
    }
    handleSubmit = ()=>{
        let data= this.state.bookData;
        data.parentId = this.state.bookId;
        let type =this.state.type;
        axios.PostAjax({
            url:type=='create'?this.getSubmitUrl(this.state.bookType)+'/insert':this.getSubmitUrl(this.state.bookType)+'/update',
            data:{
                params:{
                    ...data
                }
            }
        }).then((res)=>{
            if(res){
                this.setState({
                    isEditVisible:false,
                    bookType:'',
                    bookData:{}
                })
            }
            this.requestList()
        })
    }

    handleOperator=(option,item)=>{
        let _this=this;
       if(option=='create'){
           this.setState({
               isVisible:true,
               type:option
           })
       }else if(option=='export'){
           if(item.remark=='未办理'){
               alert("未办理该文书")
               return
           }
           window.open(commonUrl+_this.getSubmitUrl(item.bookUrl)+'/download?checkId='+item.id)
       }else if(option=="edit" || option=='detail'){
           axios.ajax({
               url:_this.getSubmitUrl(item.bookUrl)+'/getByParentId',
               data:{
                   params:{
                       id:item.id
                   }
               }}).then((res)=>{
                   let bookData = res.data||{};
                   let inspectData=this.props.inspectData;
               if(res.status=="success"){
                   if(res.data==null){
                       if(item.bookUrl=='/checkTranscript'){
                           axios.ajax({
                               url: '/supervision/enterprise/getById',
                               data:{
                                   params:{
                                       id:inspectData.checkObjectId
                                   }
                           }}).then((res)=>{
                               if(res.status=='success'){
                                   bookData.party= res.data.enterpriseName;
                                   bookData.mainQualification= res.data.enterpriseName;
                                   bookData.registrationNumber= res.data.idNumber;
                                   bookData.address= res.data.registeredAddress;
                                   bookData.header= res.data.legalPerson;
                                   bookData.idNumber= res.data.ipIdNumber;
                                   bookData.phoneNumber= res.data.cantactWay;
                                   bookData.ortherContact= res.data.ipMobilePhone;
                                   bookData.contactAddress= res.data.businessAddress;
                                   bookData.supervisorId=inspectData.supervisorId;
                                   bookData.examiner=inspectData.supervisor;
                                   bookData.enforcementNumber=inspectData.supervisorNumber;
                                   bookData.lawEnforcement  =((_this.state.deptAllList||[]).find((item)=>item.id==inspectData.checkOrgan)||{}).name;
                                   bookData.checkAddress = inspectData.checkAddress;
                                   bookData.checkTimeFrom=inspectData.checkDate;
                                   bookData.checkTimeTo=inspectData.checkDate;
                                   bookData.applyAvoid=2;
                                   _this.setState({
                                       bookType:item.bookUrl,
                                       bookData,
                                       isEditVisible:true,
                                       bookId:item.id,
                                       type:option
                                   })
                               }
                           })

                       }else if(item.bookUrl=='/orderRectification'||item.bookUrl=='/detailList'||item.bookUrl=='/assistSeizure'){
                           bookData.concernedPerson=inspectData.checkObject;
                           bookData.businessAddress=inspectData.checkAddress;
                           bookData.supervisorId=inspectData.supervisorId;
                           if(item.bookUrl=='/orderRectification'){
                               bookData.fileNumber='济历市监责改〔'+moment().format('YYYY')+'〕 号'
                           }
                           if(item.bookUrl=='/assistSeizure'){
                               bookData.assistNumber='济历市监协扣〔'+moment().format('YYYY')+'〕 号'
                           }
                           _this.setState({
                               bookType:item.bookUrl,
                               bookData,
                               isEditVisible:true,
                               bookId:item.id,
                               type:option
                           })
                       }else if(item.bookUrl=='/compulsoryMeasure'){
                           axios.ajax({
                               url: '/supervision/enterprise/getById',
                               data:{
                                   params:{
                                       id:inspectData.checkObjectId
                                   }
                               }}).then((res)=>{
                               if(res.status=='success'){
                                   bookData.concernedPerson= res.data.enterpriseName;
                                   bookData.mainQualification= res.data.enterpriseName;
                                   bookData.registrationNumber= res.data.idNumber;
                                   bookData.address= res.data.registeredAddress;
                                   bookData.header= res.data.legalPerson;
                                   bookData.idNumber= res.data.ipIdNumber;
                                   bookData.phoneNumber= res.data.cantactWay;
                                   bookData.ortherContact= res.data.ipMobilePhone;
                                   bookData.forceNumber='济历市监强制措施〔'+moment().format('YYYY')+'〕 号'
                                   _this.setState({
                                       bookType:item.bookUrl,
                                       bookData,
                                       isEditVisible:true,
                                       bookId:item.id,
                                       type:option
                                   })

                               }
                           })
                       }else if(item.bookUrl=='/receivingService'){
                           bookData.arrivePerson=inspectData.checkObject;
                           _this.setState({
                               bookType:item.bookUrl,
                               bookData,
                               isEditVisible:true,
                               bookId:item.id,
                               type:option
                           })
                       }
                   }else{
                       _this.setState({
                           bookType:item.bookUrl,
                           bookData,
                           isEditVisible:true,
                           bookId:item.id,
                           type:option
                       })
                   }
                 }
               })
       }else if(option=="delete"){
           Modal.confirm({
               content:'确定要删除此文书吗？',
               onOk:()=>{
                   axios.ajax({
                       url: '/inspect/dailyBook/delete',
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

    operateButton=(record,index)=>{
            return <ButtonGroup>
                <Button type="primary" size='small'  onClick={() => {this.handleOperator('detail',record)}}>查看</Button>
                {this.props.type=='edit'? <Button type="primary" size='small'  onClick={() => {this.handleOperator('edit',record)}}>办理</Button>:null}
                {this.props.type=='edit'?<Button type="primary" size='small'  onClick={() => {this.handleOperator('delete',record)}}>删除</Button>:null}
                <Button type="primary" size='small'  onClick={() => {this.handleOperator('export',record)}}>导出</Button>
                </ButtonGroup>
    }
    render() {
        const type = this.props.type;
        const columns = [
            {
                title: '文书编号',
                dataIndex: 'id',
            },
            {
                title: '文书名称',
                dataIndex: 'bookName',
            },{
                title: '完成状态',
                dataIndex: 'remark',
            },
            {
                title: '是否发布',
                dataIndex: 'isPublic',
            },
            {
                title: '操作',
                dataIndex:'operation',
                render:(text, record,index)=>{
                    return this.operateButton(record,index)
                }
            }
        ];
        return(<div style={{marginTop:10}}>
            {type=='edit'?<Button  type="primary" onClick={()=> {this.handleOperator('create',null)}} style={{marginBottom:5}}>添加文书</Button>:null}
                <Table
                    dataSource={this.state.list}
                    bordered
                    pagination={false}
                    columns={columns}
                />
            <Modal
                width='700px'
                title="文书列表"
                visible={this.state.isVisible}
                footer={null}
                onCancel={()=>{
                    this.setState({
                        isVisible:false
                    })
                }}
            >
                <CheckBookForm dispatchBook={(data)=>{
                    axios.ajax({
                        url:'/inspect/dailyBook/insert',
                        data:{
                            params:{
                                isPublic:0,
                                remark:'未办理',
                                bookConfId:data.id,
                                dailyFoodId:this.props.inspectData.id,
                            }
                        }
                    }).then((res)=>{
                        if(res.status=='success'){
                            this.requestList();
                            this.setState({
                                isVisible:false
                            })
                        }
                    })

                }} />
            </Modal>
            <Modal
                width='800px'
                title="文书编辑"
                visible={this.state.isEditVisible}
                okText='生成文书'
                footer={this.state.type=='detail'?null:React.ReactNode}
                cancelText='取消'
                onOk={this.handleSubmit}
                onCancel={()=>{
                    this.setState({
                        isEditVisible:false,
                        bookType:'',
                        bookData:{}
                    })
                }}>
                <BookConfigForm type={this.state.type} inspectData={this.props.inspectData} bookType={this.state.bookType||''} bookData={this.state.bookData||{}} dispatchBookData={(data)=>{this.setState({bookData:data})}}/>
            </Modal>
        </div>);
    }
}
export default BookForm;