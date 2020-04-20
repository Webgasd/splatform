import React,{Component} from 'react';
import {Input, Row, Button, Icon, Upload, message,Table,Modal} from 'antd';
import connect from "react-redux/es/connect/connect";
import {changeEnterprise} from "../../../redux/action";
import {commonUrl} from "../../../axios/commonSrc";
import Utils from '../../../utils';
const confirm = Modal.confirm;
const { TextArea } = Input;
const ButtonGroup = Button.Group;

function getBase64(img, callback) {
    const reader = new FileReader();
    reader.addEventListener('load', () => callback(reader.result));
    reader.readAsDataURL(img);
}

@connect(
    state=>({
        input:state.enterprise
    }),
    {
        changeEnterprise,
    }
)
 class PaperWork extends Component{
    state = {}
    changeInput=(value,option)=>{
        let input = {...this.props.input,[option]:value}
        this.props.changeEnterprise(input);
    }
    // 下面函数似乎没用到
    onCheckChange=(value)=>{
        this.changeInput(value.join(','),'classification')
    }
    // 原来的上传处理函数
    handleFile = (info) => {
        const fileList = info.fileList;
        if (info.file.status === 'done') {
            message.success(`${info.file.name} 上传成功`);
        } else if (info.file.status === 'error') {
            message.error(`${info.file.name} 上传失败.`);
        }
        this.changeInput(fileList,"propagandaEnclosure");
    };
    // 新加的上传处理
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
                    this.setState({imageUrl});
                }
            );
        }
        let input = {...this.props.input}
        input.photo=[file];
        this.props.changeEnterprise(input);
    };

    handleCancel = () => this.setState({ previewVisible: false });

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
    changeFileName = (data) =>{
        this.setState({
            handleFileName:data
        })
    }
    handleFileNameCancel = () => this.setState({ modifyVisible: false });
    handleFileNameSubmit =()=>{
        let fileList = this.props.input.propagandaEnclosure;
        fileList[this.state.handleFileIndex].name = this.state.handleFileName;
        this.changeInput(fileList,'propagandaEnclosure');
        this.setState({ modifyVisible: false });
    }
    handleFileDelete = (index) => {
        confirm({
            title: '确定删除?',
            okText: '是',
            okType: 'danger',
            cancelText: '否',
            onOk:()=>{
                let fileList = this.props.input.propagandaEnclosure;
                fileList.splice(index,1);
                this.changeInput(fileList,'propagandaEnclosure')
            }
        })
    };
    render() {
        const formData=this.props.input||{};
        const checkStatus = this.props.type=='detail'?true:false;
        const { previewVisible, previewImage,modifyVisible } = this.state;
        //    下面为贴过来的，有问题
        const imageUrl = this.state.imageUrl||'';
        const photo = this.props.input.photo||[];
        const uploadButton = (
            <div>
                <Icon type={this.state.loading ? 'loading' : 'plus'} />
                <div className="ant-upload-text">上传门头照片</div>
            </div>
        );

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
                        <Button type="primary" size="small" onClick={()=> {this.handleFileName(index,record)}}>修改名称</Button>
                        <Button type="primary" size="small" onClick={() => { this.handleFileDelete(index) }}>删除</Button>
                    </ButtonGroup>


                }
            }
        ]
        return (
            <div>
                <div className='commonEnterpriseBox' style={{marginTop:20}}>
                    <div className='permission-title-text'>企业基本简介</div>
                    <table>
                        <tbody>
                        <tr>
                            <td style={{width:'13%'}}>
                                <Upload
                                    disabled={checkStatus}
                                    name="file"
                                    listType="picture-card"
                                    className="avatar-uploader"
                                    showUploadList={false}
                                    accept='image/png,image/jpeg'
                                    action={commonUrl+"/upload/uploadPicture"}
                                    fileList={photo}
                                    onChange={this.handleChange}
                                >
                                    {imageUrl?<img src={imageUrl}  alt="avatar" />:
                                        (
                                            photo.length>=1&&!this.state.loading?
                                            <img src={commonUrl+"/upload/picture/"+photo[0].response.data}  alt="avatar"/>
                                            :uploadButton
                                        )
                                    }
                                </Upload>
                            </td>
                            <td ><TextArea rows={4} value={formData.introduction} onChange={(e)=>this.changeInput(e.target.value,"introduction")} placeholder={"请输入简介"} disabled={checkStatus}/></td>
                        </tr>
                        </tbody>
                    </table>   
                </div>
                <div className='commonEnterpriseBox' style={{marginTop:20}}>
                    <div className='permission-title-text'>证照/公示区</div>
                        <Row>
                             <Table
                                columns={columns}
                                bordered
                                dataSource={formData.propagandaEnclosure}
                                pagination={false}/>
                        </Row>
                       
                        <Row style={{marginTop:10}}>
                            <div style={{marginLeft:'85%'}}>
                                <Upload
                                disabled={checkStatus}
                                action={commonUrl+'/upload/uploadPicture'}
                                onChange={this.handleFile}
                                showUploadList={false}
                                fileList={formData.propagandaEnclosure}>
                                    <Button >
                                        <Icon type="upload" /> 选择上传文件
                                    </Button>
                                </Upload>
                            </div>
                            
                        </Row>
                        
                            
                </div>
                <div className='commonEnterpriseBox' style={{marginTop:20}}>
                    <div className='permission-title-text'>其他附件信息</div>
                        <Row>
                             <Table
                                columns={columns}
                                bordered
                                dataSource={formData.propagandaEnclosure}
                                pagination={false}/>
                        </Row>
                       
                        <Row style={{marginTop:10}}>
                            <div style={{marginLeft:'85%'}}>
                                <Upload
                                disabled={checkStatus}
                                action={commonUrl+'/upload/uploadPicture'}
                                onChange={this.handleFile}
                                showUploadList={false}
                                fileList={formData.propagandaEnclosure}>
                                    <Button >
                                        <Icon type="upload" /> 选择上传文件
                                    </Button>
                                </Upload>
                            </div>
                        </Row>
                </div>
                    
                   
                <Modal visible={previewVisible} footer={null} onCancel={this.handleCancel}>
                    <img alt="example" style={{ width: '100%' }} src={commonUrl+'/upload/picture/'+previewImage} />
                </Modal>
                <Modal visible={modifyVisible} onOk={this.handleFileNameSubmit} okText='确定' cancelText='取消' onCancel={this.handleFileNameCancel}>
                    <Input onChange={(e)=>this.changeFileName(e.target.value)} value={this.state.handleFileName}/>
                </Modal>

            </div>
            
        )
    }
}

export default PaperWork;