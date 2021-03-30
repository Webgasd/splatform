import React, { Component } from 'react'
import { Button, Card, Row, Col, Table, Input, Select,Modal,DatePicker,Upload,message,Icon} from 'antd'
import {commonUrl} from "../../../axios/commonSrc";
import './style.less'
const { TextArea } = Input;
const {Option} = Select;
const ButtonGroup = Button.Group;
function getBase64(img, callback) {
    const reader = new FileReader();
    reader.addEventListener('load', () => callback(reader.result));
    reader.readAsDataURL(img);
}


class AddForm extends Component {
    state = {
        previewVisible: false,
        previewImage: '',
        previewTitle: '',
        fileList: [],
        imageUrl:'',
        loading: false,
      };

    changeInput = (data, option) => {
        let value = this.props.informData
        value[option] = data
        this.props.dispatchInformData(value)
    }
    //上传文件
    handleFile = (info) => {
        const fileList = info.fileList;
        if (info.file.status === 'done') {
            message.success(`${info.file.name} 上传成功`);
        } else if (info.file.status === 'error') {
            message.error(`${info.file.name} 上传失败.`);
        }
        const data = JSON.stringify(fileList)
        this.changeInput(data, 'appendix');
    
        }
        //查看图片
        handlePreview = file => {
            console.log(file)
            this.setState({
                previewImage: (file.response || {}).data,
                previewVisible: true,
            });
        };
        //下载文件
        downLoad = (file) => {
           const download = commonUrl + '/upload/picture/' + (file.response || {}).data
           window.open(download)
        }
        //头像改变
        handleChange = info => {
            const fileList = info.fileList;
            if (info.file.status === 'done') {
                message.success(`${info.file.name} 上传成功`);
            } else if (info.file.status === 'error') {
                message.error(`${info.file.name} 上传失败.`);
            }
            const data = JSON.stringify(fileList)
            this.changeInput(data, 'photo');
        };
    render() {
        const imageUrl = this.state.imageUrl||'';
        const photo = [];
        const uploadButton = (
            <div>
                <Icon type={this.state.loading ? 'loading' : 'plus'} />
                <div className="ant-upload-text">选择上传头像</div>
            </div>
        );
        let sourceData = this.props.informData
        let sexType = this.props.sexType
        let status = this.props.status=='detail'? true:false
        //转换返回的文件字段格式  转了需要使用
        let appendix = JSON.parse(sourceData.appendix||JSON.stringify([]))
        //上传文件显示
        const { previewVisible, previewImage,modifyVisible } = this.state;
        const columns = [
            {
                title: '资料名称',
                dataIndex: 'name',
                key: 'name'
            },
            {
                title: '上传日期',
                dataIndex: 'lastModifiedDate',
                key: 'lastModifiedDate'
            },
            {
                title: '文件大小',
                dataIndex: 'size',
                key: 'size'
            },
            {
                title: '操作',
                dataIndex: 'operation',
                render: (text, record,index) => {
                    // let displayButton = this.props.status == 'detail' ? 'none' : ''
                    return <ButtonGroup>
                        <Button type="primary" size="small" onClick={() => { this.handlePreview(record)}} style={{display:record.type=="image/jpeg"?'':'none'}}>查看</Button>
                        <Button type="primary" size="small" onClick={() => { this.downLoad(record) }}>下载</Button>
                        {/* <Button type="primary" size="small" onClick={() => { this.handleFileDelete(index) }} style={{display:displayButton}}>删除</Button> */}
                     </ButtonGroup>
                }
            }
        ]
        return (
            <div>
                    <div className="contente">
                        <div className="left">
                                <Upload
                                disabled={status}
                                name="file"
                                listType="picture-card"
                                className="avatar-uploader"
                                showUploadList={false}
                                accept='image/png,image/jpeg'
                                action={commonUrl+"/upload/uploadPicture"}
                                onChange={this.handleChange}
                                fileList={photo}  
                            >
                                {imageUrl ? <img src={imageUrl} style={{height:'130px'}} alt="avatar" />:(photo.length>=1&&!this.state.loading?<img src={commonUrl+"/upload/picture/" +(photo[0].response||'').data} style={{height:'130px'}} alt="avatar" />:uploadButton)}
                            </Upload>
                        </div>
                        <div className="rigth">
                            <Row style={{marginTop:10}}>
                                <Col span={3} style={{textAlign:'right',fontSize:15}}>姓名：</Col>
                                <Col span={4}><Input placeholder='请输入内容' value={sourceData.name} onChange={(e)=>this.changeInput(e.target.value,'name')} disabled={status} /></Col>
                                <Col span={3} style={{textAlign:'right',fontSize:15}}>性别：</Col>
                                <Col span={4}>
                                <Select value={sourceData.sexy}  style={{ width: 120 }} onChange={(value) => this.changeInput(value, 'sexy')} disabled={status}>
                                {sexType.map((item) => {
                                    return <Option key={item.id} value={item.id}>{item.className}</Option>
                                })}
                                </Select>
                    </Col>
                            <Col span={3} style={{textAlign:'right',fontSize:15}}>职务：</Col>
                                <Col span={4}><Input placeholder='请输入内容' value={sourceData.job} onChange={(e)=>this.changeInput(e.target.value,'job')} disabled={status} /></Col>
                           </Row>
                            <Row style={{marginTop:10}}>
                                <Col span={3} style={{textAlign:'right',fontSize:15}}>联系电话：</Col>
                                <Col span={4}><Input placeholder='请输入内容' value={sourceData.mobilePhone} onChange={(e)=>this.changeInput(e.target.value,'mobilePhone')} disabled={status} /></Col>
                                <Col span={3} style={{textAlign:'right',fontSize:15}}>备用电话：</Col>
                                <Col span={4}><Input placeholder='请输入内容' value={sourceData.officePhone} onChange={(e)=>this.changeInput(e.target.value,'officePhone')} disabled={status} /></Col>
                                <Col span={3} style={{textAlign:'right',fontSize:15}}>身份证号：</Col>
                                <Col span={4}><Input placeholder='请输入内容' value={sourceData.idNumber} onChange={(e)=>this.changeInput(e.target.value,'idNumber')} disabled={status} /></Col>
                            </Row>
                        </div>
                    </div>
                    <Row style={{marginTop:10}}>
                                <Col span={3} style={{textAlign:'right',fontSize:15}}>乡镇：</Col>
                                <Col span={8}><Select value={sourceData.sexy}  style={{ width: 250 }} onChange={(value) => this.changeInput(value, 'sexy')} disabled={status}>
                                {[].map((item) => {
                                    return <Option key={item.id} value={item.id}>{item.className}</Option>
                                })}
                                </Select></Col>
                                <Col span={3} style={{textAlign:'right',fontSize:15}}>所属网格：</Col>
                                <Col span={8}><Select value={sourceData.grid}  style={{ width: 250 }} onChange={(value) => this.changeInput(value, 'grid')} disabled={status}>
                                {[].map((item) => {
                                    return <Option key={item.id} value={item.id}>{item.className}</Option>
                                })}
                                </Select></Col>
                            </Row>
                    <Row style={{marginTop:10}}>
                    <Col span={3} style={{textAlign:'right',fontSize:15}}>管辖范围：</Col>
                    <Col span={19}><TextArea rows={6} placeholder='请输入范围' value={sourceData.remark}  onChange={(e) => this.changeInput(e.target.value, 'remark')} disabled={status}/></Col>
                 </Row>
                 <Card style={{ width: 934,marginLeft:10 }}>
                    <div>上传提示：上传的资质证照文件大小需≤5M；上传资料格式支持：jpg、png、pdf、world格式</div>
                    <Upload
                        name='file'
                        showUploadList={false}
                        disabled={this.props.status=='detail'?true:false}
                        action={commonUrl+'/upload/uploadReport'}
                        onChange={this.handleFile}
                        fileList={appendix}      
                        >             
                        <Button>
                            <Icon type="upload" /> 选择上传文件
                        </Button>
                    </Upload>  
                    <Table
                        columns={columns}
                        dataSource={appendix}
                        pagination={false}
                    />
                    <Modal visible={previewVisible} footer={null} onCancel={this.handleCancel}>
                    <img alt="example" style={{ width: '100%' }} src={commonUrl+'/upload/picture/'+previewImage} />
                    </Modal>
                    <Modal visible={modifyVisible} onOk={this.handleFileNameSubmit} okText='确定' cancelText='取消' onCancel={this.handleFileNameCancel}>
                        <Input  disabled={this.props.status=='detail'?true:false} onChange={(e)=>this.changeFileName(e.target.value)} value={this.state.handleFileName}/>
                    </Modal> 
                </Card>
            </div>
        )
    }
}

export default AddForm
