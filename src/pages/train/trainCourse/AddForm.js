import React,{Component} from 'react';
import {Input, Select, Upload, Icon, message, Table, Card, Modal,Button} from 'antd';
import MaterialForm from './MaterialForm';
import {commonUrl } from "../../../axios/commonSrc";
import axios from "../../../axios";
import Tutorial from "./VideoView";
import PdfView from "./PdfView";
const Option = Select.Option;

function getBase64(img, callback) {
    const reader = new FileReader();
    reader.addEventListener('load', () => callback(reader.result));
    reader.readAsDataURL(img);
}


export default class AddForm extends Component{

    state = {
        topicType:1,
        loading: false
    }
    componentDidMount() {
        this.requestInfo();
    }
    requestInfo=()=>{
        axios.noLoadingAjax({
            url:'/exam/subject/getIndustryAndWorkType'
        }).then((res)=>{
            if(res.status == 'success'){
                this.setState({
                    industryList:res.data.allIndustry,
                    workTypeList:res.data.allWorkType
                })
            }
        })
    }

    handleChange = info => {
        const fileList = info.fileList;
        const file = fileList.pop();
        if (info.file.status === 'uploading') {
            this.setState({ loading: true });
        }
        if (info.file.status === 'done') {
            // Get this url from response in real world.
            getBase64(info.file.originFileObj, imageUrl =>{
                this.setState({
                    loading: false,
                });
                this.props.disPatchImageUrl(imageUrl);
                }
            );
        }
        let value = {...this.props.trainCourseInfo};
        value.picture = [file];
        this.props.dispatchTrainCourse(value);
    };
    handleOperator = (value)=>{
      this.setState({
          operateType:value,
          isVisible:true,

      })
    }
    handleDetail = (value)=>{
        if(value.contentType==2){
            this.setState({
                materialInfo:value,
                isPdfView:true,
            })
        }else if(value.contentType==1){
            this.setState({
                materialInfo:value,
                isVideoTutorial:true,
            })
        }
    }
    handleName=(event)=>{
        let value = {...this.props.trainCourseInfo};
        value.name = event.target.value;
        this.props.dispatchTrainCourse(value);
    }
    handleCourseType=(event)=>{
        let value = {...this.props.trainCourseInfo};
        value.courseType = event;
        this.props.dispatchTrainCourse(value);
    }
    handleIndustry=(event)=>{
        let value = {...this.props.trainCourseInfo};
        value.industry = event;
        this.props.dispatchTrainCourse(value);
    }
    handleWorktype=(event)=>{
        let value = {...this.props.trainCourseInfo};
        value.worktype = event;
        this.props.dispatchTrainCourse(value);
    }
    handleRemark=(event)=>{
        let value = {...this.props.trainCourseInfo};
        value.remark = event.target.value;
        this.props.dispatchTrainCourse(value);
    }
    unique1=(arr1,arr2)=>{
        var _arr = new Array();
        for(var i=0;i<arr1.length;i++){
            _arr.push(arr1[i]);
        }
        for(var i=0;i<arr2.length;i++){
            var flag = true;
            for(var j=0;j<arr1.length;j++){
                if(arr2[i].id==arr1[j].id){
                    flag=false;
                    break;
                }
            }
            if(flag){
                _arr.push(arr2[i]);
            }
        }
        return _arr;
    }
    handleSubmit=()=>{
        this.props.dispatchMaterialList(this.unique1(this.props.materialList,this.state.selectedList||[]));
        this.setState({
            isVisible:false,
            selectedList:[]
        })
    }
    handleDelete=(id)=>{
        let {materialList}=this.props;
        materialList=materialList.filter(item=>item.id!==id);
        this.props.dispatchMaterialList(materialList);
    }
    render(){
        const uploadButton = (
            <div>
                <Icon type={this.state.loading ? 'loading' : 'plus'} />
                <div className="ant-upload-text">选择上传封面</div>
            </div>
        );
        const imageUrl = this.state.imageUrl;
        const {trainCourseInfo} = this.props;
        const picture = this.props.trainCourseInfo.picture||[];
        const checkStatus = this.props.type=='detail'?true:false;
        const columns = [
            {
                title: '培训教材名称',
                dataIndex: 'name'
            },{
                title: '行业类别',
                dataIndex: 'industryName',

            },{
                title: '工作种类',
                dataIndex: 'workTypeName',
            },{
                title: '课程分值',
                dataIndex: 'score',
            },
            {
                title: '操作',
                dataIndex:'operation',
                render:(text, record)=>{
                    return <div>
                        <a onClick={() => { this.handleDetail(record)}}>查看</a>
                        <a style={{marginLeft:5}} onClick={()=> {this.handleOperator(record.contentType)}} disabled={checkStatus}>修改</a>
                        <a style={{marginLeft:5}} onClick={() => { this.handleDelete(record.id) }} disabled={checkStatus}>删除</a>
                    </div>
                }
            }
        ];
        return (
            <div>
                <div className='commonEnterpriseBox'>
                    <table>
                        <tbody>
                        <tr>
                            <td style={{width:'80px'}}>课程名称：</td>
                            <td colSpan={5}><Input value={trainCourseInfo.name||''} onChange={this.handleName} disabled={checkStatus}/></td>
                            <td rowSpan={3}>
                                <Upload
                                    disabled={checkStatus}
                                    name="file"
                                    listType="picture-card"
                                    className="avatar-uploader"
                                    showUploadList={false}
                                    accept='image/png,image/jpeg'
                                    action={commonUrl+"/upload/uploadPicture"}
                                    fileList={picture}
                                    onChange={this.handleChange}
                                >
                                    {imageUrl ? <img src={imageUrl} style={{height:'130px'}} alt="avatar" />:(picture.length>=1&&!this.state.loading?<img src={commonUrl+"/upload/picture/" +picture[0].response.data} style={{height:'130px'}} alt="avatar" />:uploadButton)}
                                </Upload>
                            </td>
                        </tr>
                        <tr>
                            <td style={{width:'80px'}}>课程类型：</td>
                            <td style={{width:135}}>
                                <Select  value={trainCourseInfo.courseType||''} onChange={this.handleCourseType} style={{ width: 130 }} disabled={checkStatus}>
                                <Option value={1} key={1}>选修课程</Option>
                                <Option value={2} key={2}>必修课程</Option>
                            </Select></td>
                            <td style={{width:'80px'}}>行业类型：</td>
                            <td style={{width:135}}>
                                <Select  value={trainCourseInfo.industry||''} onChange={this.handleIndustry} style={{ width: 130 }} disabled={checkStatus}>
                                    {(this.state.industryList||[]).map((item)=><Option value={item.id}>{item.name}</Option>)}
                            </Select></td>
                            <td style={{width:'80px'}}>工作种类：</td>
                            <td style={{width:225}}>
                                <Select  value={trainCourseInfo.worktype||''} onChange={this.handleWorktype} style={{ width: 220 }} disabled={checkStatus?true:(trainCourseInfo.industry?false:true)}>
                                    {(this.state.workTypeList||[]).filter((item)=>item.industryId==trainCourseInfo.industry).map((item)=><Option value={item.id}>{item.name}</Option>)}
                            </Select></td>
                        </tr>
                        <tr>
                            <td>课程备注:</td>
                            <td colSpan={5}>
                                <Input.TextArea value={trainCourseInfo.remark||''} onChange={this.handleRemark} disabled={checkStatus}/>
                            </td>
                        </tr>
                        </tbody>
                    </table>
                </div>
                <Card size='small' title='文本类教材' extra={<a onClick={()=>this.handleOperator(2)} disabled={checkStatus}>添加文本教材</a>}>
                    <Table
                        dataSource={this.props.materialList.filter(item=>item.contentType===2)}
                        columns={columns}
                        pagination={false}
                        size="small"
                    >

                    </Table>
                </Card>
                <Card size='small' title='视频类教材' style={{marginTop:10}}extra={<a onClick={()=>this.handleOperator(1)} disabled={checkStatus}>添加视频教材</a>}>
                    <Table
                        dataSource={this.props.materialList.filter(item=>item.contentType===1)}
                        columns={columns}
                        pagination={false}
                        size="small">
                    </Table>
                </Card>
                <Modal
                    width='1100px'
                    title="培训课程信息"
                    okText="确定"
                    cancelText="取消"
                    destroyOnClose
                    visible={this.state.isVisible}
                    onOk={this.handleSubmit}
                    onCancel={()=>{
                        //this.addForm.props.form.resetFields();//表单重置
                        this.setState({
                            isVisible:false,
                            selectedList:[]
                        })
                    }}
                >
                    <MaterialForm selectedList={this.state.selectedList||[]} dispatchSelected={(data)=>this.setState({selectedList:data})} operateType={this.state.operateType}/>
                </Modal>
                <Modal footer={null}
                       width='800px'
                       title="视频"
                       visible={this.state.isVideoTutorial}
                       destroyOnClose
                       onCancel={()=>{
                           this.setState({
                               isVideoTutorial:false,
                               materialInfo:{}
                           })
                       }}
                >
                    <Tutorial materialInfo={this.state.materialInfo||{}}/>
                </Modal>
                <Modal footer={null}
                       width='800px'
                       title="文本"
                       visible={this.state.isPdfView}
                       destroyOnClose
                       onCancel={()=>{
                           this.setState({
                               isPdfView:false,
                               materialInfo:{}
                           })
                       }}
                >
                    <PdfView materialInfo={this.state.materialInfo||{}}/>
                </Modal>
            </div>

        );
    }
}
