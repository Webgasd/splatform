import React,{Component} from "react";
import {Button, Card, Form, Icon, Input, message, Upload, Modal, Table} from "antd";
import {commonUrl} from "../../../../axios/commonSrc";
import {connect} from "react-redux";
import {changeSamplingdeploy} from "../../../../redux/action";
import AreaForm from "./AreaForm"
import Utils from "../../../../utils";

const {TextArea}=Input;
const FormItem=Form.Item;
const ButtonGroup = Button.Group;
@connect(
    state=>({
        input:state.samplingdeploy
    }),
    {
        changeSamplingdeploy,
    }
)
class DetailForm extends Component{
    state={}
    changeInput=(value,option)=>{
        let input = {...this.props.input,[option]:value}
        this.props.changeSamplingdeploy(input);
    }
    handleFile = (info) => {
        const fileList = info.fileList;
        if (info.file.status === 'done') {
            message.success(`${info.file.name} file uploaded successfully`);
        } else if (info.file.status === 'error') {
            message.error(`${info.file.name} 上传失败.`);
        }
        this.changeInput(fileList,"document");
    };
    handlePreview = file => {

        this.setState({
            previewImage: (file.response||{}).data,
            previewVisible: true,
        });
    };
    handleFileName = (index,file)=> {
        this.setState({
            handleFileName: file.name,
            handleFileIndex:index,
            modifyVisible: true,
        });
    };
    handleFileDelete = (index) => {
        Modal.confirm({
            title: '确定删除?',
            okText: '是',
            okType: 'danger',
            cancelText: '否',
            onOk:()=>{
                let fileList = this.props.input.document;
                fileList.splice(index,1);
                this.changeInput(fileList,'document')
            }
        })
    };
    handleCancel = () => this.setState({ previewVisible: false });
    handleFileNameCancel = () => this.setState({ modifyVisible: false });
    handleFileNameSubmit =()=>{
        let fileList = this.props.input.document;
        fileList[this.state.handleFileIndex].name = this.state.handleFileName;
        this.changeInput(fileList,'document');
        this.setState({ modifyVisible: false });
    }
    changeFileName = (data) =>{
        this.setState({
            handleFileName:data
        })
    }
    render() {
        const type=this.props.type;
        const formData=this.props.input||{};
        console.log(formData.areaName)
        const { previewVisible, previewImage,modifyVisible } = this.state;
        const columns = [
            {
                title: '文件名',
                dataIndex: 'name'
            }, {
                title: '日期',
                dataIndex: 'lastModifiedDate',
                render:Utils.formatDateNoTime
            },{
                title: '操作',
                dataIndex:'operation',
                render:(text, record,index)=>{

                    return <ButtonGroup>
                        <Button type="primary" size="small" onClick={() => { this.handlePreview(record)}}>查看</Button>
                        <Button type="primary" size="small" onClick={()=> {this.handleFileName(index,record)}} disabled={type=='detail'?true:false}>修改名称</Button>
                        <Button type="primary" size="small" onClick={() => { this.handleFileDelete(index) }} disabled={type=='detail'?true:false}>删除</Button>
                    </ButtonGroup>


                }
            }
        ]
        return(
            <div className='commonEnterpriseBox'>
                <table>
                    <tbody>
                    <tr>
                        <td style={{background:'#F2F2F2',width:'15%'}}>检测机构全称<span style={{color:'#FF3300'}}>*</span></td>
                        <td style={{width:'30%'}}><Input value={formData.enterpriseName} disabled={type=='detail'?true:false} onChange={(e)=>this.changeInput(e.target.value,'enterpriseName')}/></td>
                        <td style={{background:'#F2F2F2',width:'15%'}}>简称<span style={{color:'#FF3300'}}>*</span></td>
                        <td style={{width:'30%'}}><Input value={formData.enterpriseNickname} disabled={type=='detail'?true:false} onChange={(e)=>this.changeInput(e.target.value,'enterpriseNickname')}/></td>
                    </tr>
                    <tr>
                        <td style={{background:'#F2F2F2',width:'15%'}}>社会信用代码<span style={{color:'#FF3300'}}>*</span></td>
                        <td style={{width:'30%'}}><Input value={formData.number} disabled={type=='detail'?true:false} onChange={(e)=>this.changeInput(e.target.value,'number')}/></td>
                        <td style={{background:'#F2F2F2',width:'15%'}}>地区<span style={{color:'#FF3300'}}>*</span></td>
                        <td style={{width:'30%'}}><Input value={formData.area} onClick={()=>this.setState({isVisible:true,personType:'area'})} placeholder={"请选择地区"} disabled={type=='detail'?true:false} suffix={<Icon type="search" />} onChange={(e)=>this.changeInput(e.target.value,'area')}/></td>
                    </tr>
                    <tr>
                        <td style={{background:'#F2F2F2',width:'15%'}}>地址<span style={{color:'#FF3300'}}>*</span></td>
                        <td style={{width:'30%'}}><Input value={formData.address} disabled={type=='detail'?true:false} onChange={(e)=>this.changeInput(e.target.value,'address')}/></td>
                        <td style={{background:'#F2F2F2',width:'15%'}}>负责人<span style={{color:'#FF3300'}}>*</span></td>
                        <td style={{width:'30%'}}><Input value={formData.enterpriseCharger} disabled={type=='detail'?true:false} onChange={(e)=>this.changeInput(e.target.value,'enterpriseCharger')}/></td>
                    </tr>
                    <tr>
                        <td style={{background:'#F2F2F2',width:'15%'}}>联系方式<span style={{color:'#FF3300'}}>*</span></td>
                        <td style={{width:'30%'}} colSpan={5}><Input value={formData.phone} disabled={type=='detail'?true:false} onChange={(e)=>this.changeInput(e.target.value,'phone')}/></td>
                    </tr>
                    <tr>
                        <td style={{background:'#F2F2F2',width:'15%'}}>备注</td>
                        <td style={{width:'30%'}} colSpan={5}><TextArea rows={3} value={formData.remark} disabled={type=='detail'?true:false} onChange={(e)=>this.changeInput(e.target.value,'remark')}/></td>
                    </tr>
                    <tr>
                        <td>附件信息</td>
                        <td colSpan={5}><Upload
                            disabled={type=='detail'?true:false}
                            name='file'
                            action={commonUrl+'/upload/uploadPicture'}
                            onChange={this.handleFile}
                            fileList={formData.document}>
                            <Button>
                                <Icon type="upload" />选择上传文件
                            </Button>
                        </Upload></td>
                    </tr>
                    </tbody>
                </table>
                <Table
                    style={{marginTop:10}}
                    columns={columns}
                    dataSource={formData.document}
                    pagination={false}
                />
                <Modal visible={previewVisible} footer={null} onCancel={this.handleCancel}>
                    <img alt="example" style={{ width: '100%' }} src={commonUrl+'/upload/picture/'+previewImage} />
                </Modal>
                <Modal visible={modifyVisible} onOk={this.handleFileNameSubmit} okText='确定' cancelText='取消' onCancel={this.handleFileNameCancel}>
                    <Input onChange={(e)=>this.changeFileName(e.target.value)} value={this.state.handleFileName}/>
                </Modal>
                <Modal footer={null}
                       width='700px'
                       maskClosable={false}
                       title="企业从业人员信息列表"
                       visible={this.state.isVisible}
                       destroyOnClose
                       onCancel={()=>{
                           this.setState({
                               isVisible:false
                           })
                       }}
                >
                    <AreaForm dispatchSupervisor={(data)=>{
                        this.setState({isVisible:false})
                        this.changeInput(data,this.state.personType);}} />
                </Modal>
            </div>
        );
    }
}
export default DetailForm;