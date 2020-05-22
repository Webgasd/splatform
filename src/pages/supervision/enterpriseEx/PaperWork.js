import React,{Component} from 'react';
import {Input, Row, Button, Icon, Upload, message,Modal,Select} from 'antd';
import connect from "react-redux/es/connect/connect";
import {changeEnterprise} from "../../../redux/action";
import {commonUrl} from "../../../axios/commonSrc";
import Utils from '../../../utils';
import SelectBox from './childrenForm/SelectBox';
import SelectAnnex from './childrenForm/SelectAnnex';
const confirm = Modal.confirm;
const { TextArea } = Input;
const ButtonGroup = Button.Group;
const Option = Select.Option

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
    state = {licenseType:''}
    changeInput=(value,option)=>{
        let input = {...this.props.input,[option]:value}
        this.props.changeEnterprise(input);
    }
    // 原来的上传处理函数
    handleFile = (info,option) => {console.log(info)
        const fileList = info.fileList;
        if (info.file.status === 'done') {
            message.success(`${info.file.name} 上传成功`);
        } else if (info.file.status === 'error') {
            message.error(`${info.file.name} 上传失败.`);
        }
        this.changeInput(fileList,option);
    };
    handleCancel = () => this.setState({ previewVisible: false });

    handlePreview = file => {
        this.setState({
            previewImage: (file.response||{}).data,
            previewVisible: true,
        });
    };
    handleFileName = (index,file,option)=> {
        this.setState({
            handleFileName: file.name,
            handleFileIndex:index,
            handleFileOption:option,
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
        let fileList = this.props.input[this.state.handleFileOption];
        fileList[this.state.handleFileIndex].name = this.state.handleFileName;
        this.changeInput(fileList,this.state.handleFileOption);
        this.setState({ modifyVisible: false });
    }
    handleFileDelete = (index,option) => {
        confirm({
            title: '确定删除?',
            okText: '是',
            okType: 'danger',
            cancelText: '否',
            onOk:()=>{
                let fileList = this.props.input[option];
                fileList.splice(index,1);
                this.changeInput(fileList,option)
            }
        })
    };
    handleSelectBox=()=>{
        this.setState({
            boxVisible:true
        })
    }
    handleSelectAnnexBox=()=>{
        this.setState({
            annexBoxVisible:true
        })
    }
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
        input.propagandaEnclosure=[file];
        this.props.changeEnterprise(input);
    };
    
    render() {
        const formData=this.props.input||{};
        const checkStatus = this.props.type=='detail'?true:false;
        const { previewVisible, previewImage,modifyVisible } = this.state;
        //    下方处理门头照片
        const imageUrl = this.state.imageUrl||'';
        const propagandaEnclosure = this.props.input.propagandaEnclosure||[];
        const uploadButton = (
            <div>
                <Icon type={this.state.loading ? 'loading' : 'plus'} />
                <div className="ant-upload-text">上传门头照片</div>
            </div>
        );
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
                                    fileList={propagandaEnclosure}
                                    onChange={this.handleChange}
                                >
                                    {imageUrl?<img style={{height:'10%'}} src={imageUrl}  alt="avatar" />:
                                        (
                                            propagandaEnclosure.length>=1&&!this.state.loading?
                                            <img style={{height:'10%'}} src={commonUrl+"/upload/picture/"+propagandaEnclosure[0].response.data}  alt="avatar"/>
                                            :uploadButton
                                        )
                                    }
                                </Upload>
                            </td>
                            <td ><TextArea rows={4} value={formData.introduction} onChange={(e)=>this.changeInput(e.target.value,"introduction")} placeholder={"请输入企业基本介绍"} disabled={checkStatus}/></td>
                        </tr>
                        </tbody>
                    </table>   
                </div>
                {/* 以下为许可证照片 */}
                <div className='commonEnterpriseBox' style={{marginTop:20}}>
                    <div className='permission-title-text'>证照/公示区</div>
                    <Row>
                    <table>
                        <tbody>
                        <tr>
                            <th>证件类型</th>
                            <th>文件名称</th>
                            <th>上传日期</th>
                            <th>操作</th>
                        </tr>
                        {(formData.businessLicensePhoto?formData.businessLicensePhoto:[]).map((item,index)=>(
                        <tr>
                            <td>营业执照</td>
                            <td>{item.name}</td>
                            <td>{Utils.formatDateNoTime(item.lastModifiedDate)}</td>
                            <td><ButtonGroup>
                                <Button type="primary" size="small" onClick={() => { this.handlePreview(item)}}>查看</Button>
                                <Button type="primary" size="small" onClick={()=> {this.handleFileName(index,item,"businessLicensePhoto")}} disabled={checkStatus}>修改名称</Button>
                                <Button type="primary" size="small" onClick={() => { this.handleFileDelete(index,"businessLicensePhoto")}} disabled={checkStatus}>删除</Button>
                                </ButtonGroup>
                            </td>
                        </tr>))}
                        {(formData.foodBusinessPhotos?formData.foodBusinessPhotos:[]).map((item,index)=>(
                        <tr>
                            <td>食品经营许可证</td>
                            <td>{item.name}</td>
                            <td>{Utils.formatDateNoTime(item.lastModifiedDate)}</td>
                            <td><ButtonGroup>
                                <Button type="primary" size="small" onClick={() => { this.handlePreview(item)}}>查看</Button>
                                <Button type="primary" size="small" onClick={()=> {this.handleFileName(index,item,"foodBusinessPhotos")}} disabled={checkStatus}>修改名称</Button>
                                <Button type="primary" size="small" onClick={() => { this.handleFileDelete(index,"foodBusinessPhotos")}} disabled={checkStatus}>删除</Button>
                                </ButtonGroup>
                            </td>
                        </tr>))}
                        {(formData.smallCaterPhotos?formData.smallCaterPhotos:[]).map((item,index)=>(
                        <tr>
                            <td>小餐饮服务许可证</td>
                            <td>{item.name}</td>
                            <td>{Utils.formatDateNoTime(item.lastModifiedDate)}</td>
                            <td><ButtonGroup>
                                <Button type="primary" size="small" onClick={() => { this.handlePreview(item)}}>查看</Button>
                                <Button type="primary" size="small" onClick={()=> {this.handleFileName(index,item,"smallCaterPhotos")}} disabled={checkStatus}>修改名称</Button>
                                <Button type="primary" size="small" onClick={() => { this.handleFileDelete(index,"smallCaterPhotos")}} disabled={checkStatus}>删除</Button>
                                </ButtonGroup>
                            </td>
                        </tr>))}
                        {(formData.smallWorkshopPhotos?formData.smallWorkshopPhotos:[]).map((item,index)=>(
                        <tr>
                            <td>小作坊许可证</td>
                            <td>{item.name}</td>
                            <td>{Utils.formatDateNoTime(item.lastModifiedDate)}</td>
                            <td><ButtonGroup>
                                <Button type="primary" size="small" onClick={() => { this.handlePreview(item)}}>查看</Button>
                                <Button type="primary" size="small" onClick={()=> {this.handleFileName(index,item,"smallWorkshopPhotos")}} disabled={checkStatus}>修改名称</Button>
                                <Button type="primary" size="small" onClick={() => { this.handleFileDelete(index,"smallWorkshopPhotos")}} disabled={checkStatus}>删除</Button>
                                </ButtonGroup>
                            </td>
                        </tr>))}
                        {(formData.foodProducePhotos?formData.foodProducePhotos:[]).map((item,index)=>(
                        <tr>
                            <td>食品生产许可证</td>
                            <td>{item.name}</td>
                            <td>{Utils.formatDateNoTime(item.lastModifiedDate)}</td>
                            <td><ButtonGroup>
                                <Button type="primary" size="small" onClick={() => { this.handlePreview(item)}}>查看</Button>
                                <Button type="primary" size="small" onClick={()=> {this.handleFileName(index,item,"foodProducePhotos")}} disabled={checkStatus}>修改名称</Button>
                                <Button type="primary" size="small" onClick={() => { this.handleFileDelete(index,"foodProducePhotos")}} disabled={checkStatus}>删除</Button>
                                </ButtonGroup>
                            </td>
                        </tr>))}
                        {(formData.drugsBusinessPhotos?formData.drugsBusinessPhotos:[]).map((item,index)=>(
                        <tr>
                            <td>药品经营许可证</td>
                            <td>{item.name}</td>
                            <td>{Utils.formatDateNoTime(item.lastModifiedDate)}</td>
                            <td><ButtonGroup>
                                <Button type="primary" size="small" onClick={() => { this.handlePreview(item)}}>查看</Button>
                                <Button type="primary" size="small" onClick={()=> {this.handleFileName(index,item,"drugsBusinessPhotos")}} disabled={checkStatus}>修改名称</Button>
                                <Button type="primary" size="small" onClick={() => { this.handleFileDelete(index,"drugsBusinessPhotos")}} disabled={checkStatus}>删除</Button>
                                </ButtonGroup>
                            </td>
                        </tr>))}
                        {(formData.drugsProducePhotos?formData.drugsProducePhotos:[]).map((item,index)=>(
                        <tr>
                            <td>药品生产许可证</td>
                            <td>{item.name}</td>
                            <td>{Utils.formatDateNoTime(item.lastModifiedDate)}</td>
                            <td><ButtonGroup>
                                <Button type="primary" size="small" onClick={() => { this.handlePreview(item)}}>查看</Button>
                                <Button type="primary" size="small" onClick={()=> {this.handleFileName(index,item,"drugsProducePhotos")}} disabled={checkStatus}>修改名称</Button>
                                <Button type="primary" size="small" onClick={() => { this.handleFileDelete(index,"drugsProducePhotos")}} disabled={checkStatus}>删除</Button>
                                </ButtonGroup>
                            </td>
                        </tr>))}
                        {(formData.cosmeticsUsePhotos?formData.cosmeticsUsePhotos:[]).map((item,index)=>(
                        <tr>
                            <td>化妆品生产许可证</td>
                            <td>{item.name}</td>
                            <td>{Utils.formatDateNoTime(item.lastModifiedDate)}</td>
                            <td><ButtonGroup>
                                <Button type="primary" size="small" onClick={() => { this.handlePreview(item)}}>查看</Button>
                                <Button type="primary" size="small" onClick={()=> {this.handleFileName(index,item,"cosmeticsUsePhotos")}} disabled={checkStatus}>修改名称</Button>
                                <Button type="primary" size="small" onClick={() => { this.handleFileDelete(index,"cosmeticsUsePhotos")}} disabled={checkStatus}>删除</Button>
                                </ButtonGroup>
                            </td>
                        </tr>))}
                        {(formData.medicalProducePhotos?formData.medicalProducePhotos:[]).map((item,index)=>(
                        <tr>
                            <td>医疗器械生产许可证</td>
                            <td>{item.name}</td>
                            <td>{Utils.formatDateNoTime(item.lastModifiedDate)}</td>
                            <td><ButtonGroup>
                                <Button type="primary" size="small" onClick={() => { this.handlePreview(item)}}>查看</Button>
                                <Button type="primary" size="small" onClick={()=> {this.handleFileName(index,item,"medicalProducePhotos")}} disabled={checkStatus}>修改名称</Button>
                                <Button type="primary" size="small" onClick={() => { this.handleFileDelete(index,"medicalProducePhotos")}} disabled={checkStatus}>删除</Button>
                                </ButtonGroup>
                            </td>
                        </tr>))}
                        {(formData.medicalBusinessPhotos?formData.medicalBusinessPhotos:[]).map((item,index)=>(
                        <tr>
                            <td>医疗器械经营许可证</td>
                            <td>{item.name}</td>
                            <td>{Utils.formatDateNoTime(item.lastModifiedDate)}</td>
                            <td><ButtonGroup>
                                <Button type="primary" size="small" onClick={() => { this.handlePreview(item)}}>查看</Button>
                                <Button type="primary" size="small" onClick={()=> {this.handleFileName(index,item,"medicalBusinessPhotos")}} disabled={checkStatus}>修改名称</Button>
                                <Button type="primary" size="small" onClick={() => { this.handleFileDelete(index,"medicalBusinessPhotos")}} disabled={checkStatus}>删除</Button>
                                </ButtonGroup>
                            </td>
                        </tr>))}
                        {(formData.industrialProductsPhotos?formData.industrialProductsPhotos:[]).map((item,index)=>(
                        <tr>
                            <td>工业产品生产许可证</td>
                            <td>{item.name}</td>
                            <td>{Utils.formatDateNoTime(item.lastModifiedDate)}</td>
                            <td><ButtonGroup>
                                <Button type="primary" size="small" onClick={() => { this.handlePreview(item)}}>查看</Button>
                                <Button type="primary" size="small" onClick={()=> {this.handleFileName(index,item,"industrialProductsPhotos")}} disabled={checkStatus}>修改名称</Button>
                                <Button type="primary" size="small" onClick={() => { this.handleFileDelete(index,"industrialProductsPhotos")}} disabled={checkStatus}>删除</Button>
                                </ButtonGroup>
                            </td>
                        </tr>))}
                        </tbody>
                    </table>
                    </Row>
                    <Row>
                        <div style={{width:180,float:"right",marginTop:10}}>
                        <Button onClick={()=>{this.handleSelectBox()}} style={{width:'100%'}} disabled={checkStatus}> <Icon type="upload" />点击上传许可证照片</Button>
                        </div>
                    </Row>
                </div>

                {/* 以下为附件照片 */}
                <div className='commonEnterpriseBox' style={{marginTop:20}}>
                    <div className='permission-title-text'>其他附件信息</div>
                    <Row>
                    <table>
                        <tbody>
                        <tr>
                            <th>附件类型</th>
                            <th>文件名称</th>
                            <th>上传日期</th>
                            <th>操作</th>
                        </tr>
                        {(formData.publicityPhotos?formData.publicityPhotos:[]).map((item,index)=>(
                        <tr>
                            <td>宣传类照片</td>
                            <td>{item.name}</td>
                            <td>{Utils.formatDateNoTime(item.lastModifiedDate)}</td>
                            <td><ButtonGroup>
                                <Button type="primary" size="small" onClick={() => { this.handlePreview(item)}}>查看</Button>
                                <Button type="primary" size="small" onClick={()=> {this.handleFileName(index,item,"publicityPhotos")}} disabled={checkStatus}>修改名称</Button>
                                <Button type="primary" size="small" onClick={() => { this.handleFileDelete(index,"publicityPhotos")}} disabled={checkStatus}>删除</Button>
                                </ButtonGroup>
                            </td>
                        </tr>))}
                        {(formData.certificatePhotos?formData.certificatePhotos:[]).map((item,index)=>(
                        <tr>
                            <td>证照类照片</td>
                            <td>{item.name}</td>
                            <td>{Utils.formatDateNoTime(item.lastModifiedDate)}</td>
                            <td><ButtonGroup>
                                <Button type="primary" size="small" onClick={() => { this.handlePreview(item)}}>查看</Button>
                                <Button type="primary" size="small" onClick={()=> {this.handleFileName(index,item,"certificatePhotos")}} disabled={checkStatus}>修改名称</Button>
                                <Button type="primary" size="small" onClick={() => { this.handleFileDelete(index,"certificatePhotos")}} disabled={checkStatus}>删除</Button>
                                </ButtonGroup>
                            </td>
                        </tr>))}
                        {(formData.otherPhotos?formData.otherPhotos:[]).map((item,index)=>(
                        <tr>
                            <td>其他类照片</td>
                            <td>{item.name}</td>
                            <td>{Utils.formatDateNoTime(item.lastModifiedDate)}</td>
                            <td><ButtonGroup>
                                <Button type="primary" size="small" onClick={() => { this.handlePreview(item)}}>查看</Button>
                                <Button type="primary" size="small" onClick={()=> {this.handleFileName(index,item,"otherPhotos")}} disabled={checkStatus}>修改名称</Button>
                                <Button type="primary" size="small" onClick={() => { this.handleFileDelete(index,"otherPhotos")}} disabled={checkStatus}>删除</Button>
                                </ButtonGroup>
                            </td>
                        </tr>))}
                        </tbody>
                    </table>
                    </Row>
                    <Row>
                        <div style={{width:180,float:"right",marginTop:10}}>
                        <Button onClick={()=>{this.handleSelectAnnexBox()}} style={{width:'100%'}} disabled={checkStatus}> <Icon type="upload" />点击上传照片</Button>
                        </div>
                    </Row>
                </div>
                    
                   
                <Modal visible={previewVisible} footer={null} onCancel={this.handleCancel}>
                    <img alt="example" style={{ width: '100%' }} src={commonUrl+'/upload/picture/'+previewImage} />
                </Modal>
                <Modal visible={modifyVisible} onOk={this.handleFileNameSubmit} okText='确定' cancelText='取消' onCancel={this.handleFileNameCancel}>
                    <Input onChange={(e)=>this.changeFileName(e.target.value)} value={this.state.handleFileName}/>
                </Modal>
                <Modal
                    visible={this.state.boxVisible}
                    destroyOnClose
                    title="选择上传许可证类型"
                    footer={null}
                    maskClosable={false}
                    width={640}
                    onCancel={()=>{
                        this.setState({
                            boxVisible:false,
                        })
                    }}
            >
                    <SelectBox/>
                </Modal>
                <Modal
                    visible={this.state.annexBoxVisible}
                    destroyOnClose
                    title="选择上传附件类型"
                    footer={null}
                    maskClosable={false}
                    width={640}
                    onCancel={()=>{
                        this.setState({
                            annexBoxVisible:false,
                        })
                    }}
            >
                    <SelectAnnex/>
                </Modal>

            </div>
            
        )
    }
}

export default PaperWork;

                        // eslint-disable-next-line no-lone-blocks
                        {/* <Select style={{width:'100%'}} value = "点击上传许可证" disabled={checkStatus}>
                            <Option value={1}>
                                <Upload
                                    action={commonUrl+'/upload/uploadPicture'}        
                                    onChange={(info)=>this.handleFile(info,"foodBusinessEnclosure")}
                                    showUploadList={false}
                                    fileList={formData.foodBusinessEnclosure}>
                                    <Button><Icon type="upload" />食品经营许可证</Button>
                                </Upload>
                            </Option>
                        </Select> */}