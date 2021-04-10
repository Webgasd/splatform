import React, { Component } from 'react'
import { Button, Card, Row, Col, Table, Input, Select,Modal,DatePicker,Upload,message,Icon} from 'antd'
import {commonUrl} from "../../../axios/commonSrc";
import './style.less'
import axios from "../../../axios";
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
        loading: false,
        previewImage: '',
        previewTitle: '',
        fileList: [],
        imageUrl:'',
        loading: false,
        gridAndStreet:[],
        gridList:[]
      };

    changeInput = (data, option) => {
        let value = this.props.informData
        value[option] = data
        this.props.dispatchInformData(value)
    }
   
    //改变选择框
    changeList = (value,option) =>{
        this.changeInput(value,option)
        const sourceData = this.props.informData
        if(option == 'street'){
            if(sourceData.street){
                this.changeInput('','grid')
            }
            const grid = this.props.gridAndStreet.filter((item)=>{
                return item.id == sourceData.street?true:false
            })
            this.setState({
                gridList:grid[0].childrenList
            })
        }
    }
    handleCancel = () => this.setState({ previewVisible: false });
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
           const download = commonUrl + '/upload/report/' + (file.response || {}).data
           window.open(download)
        }
        //头像改变
        handleChange = info => {
            const fileList = info.fileList
            if (info.file.status === 'uploading') {
              this.setState({ loading: true });
              return;
            }
            if (info.file.status === 'done') {
              // Get this url from response in real world.
              getBase64(info.file.originFileObj, imageUrl =>
                this.setState({
                  imageUrl,
                  loading: false,
                }),
              );
            }
            this.changeInput(JSON.stringify(fileList),"photo");
          };
    render() {
        //职务只能为网格员
        let jobs = [{id:7,name:'网格员'}]
        let sourceData = this.props.informData
        let sexType = this.props.sexType
        let status = this.props.status=='detail'? true:false
        //用于查看信息时匹配网格员
        let list = this.props.gridList
        //头像显示
        const { loading, imageUrl } = this.state;
        let picture = JSON.parse(sourceData.photo||JSON.stringify([]))
        const uploadButton = (
        <div>
            <Icon type={this.state.loading ? 'loading' : 'plus'} />
            <div style={{ marginTop: 8 }}>Upload</div>
        </div>
        );
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
                            name="file"
                            listType="picture-card"
                            className="avatar-uploader"
                            showUploadList={false}
                            action={commonUrl+'/upload/uploadReport'}
                            onChange={this.handleChange}
                        >
                            {/* {imageUrl ? <img src={imageUrl} alt="avatar" style={{ height:'130' }} /> : uploadButton} */}
                            {imageUrl ? <img src={imageUrl} style={{height:'130px',width:'130px'}} alt="avatar" />:(picture.length>=1&&!this.state.loading?<img src={commonUrl+"/upload/report/" +picture[0].response.data} style={{height:'130px'}} alt="avatar" />:uploadButton)}
                        </Upload>
                        </div>
                        <div className="rigth">
                            <Row style={{marginTop:10}}>
                                <Col span={3} style={{textAlign:'right',fontSize:15}}>姓名：</Col>
                                <Col span={4}><Input placeholder='请输入内容' value={sourceData.name} onChange={(e)=>this.changeInput(e.target.value,'name')} disabled={status} /></Col>
                                <Col span={3} style={{textAlign:'right',fontSize:15}}>性别：</Col>
                                <Col span={4}>
                                <Select value={sourceData.sexy}  style={{ width: 120 }} onChange={(value) => this.changeInput(value, 'sexy')} disabled={status} getPopupContainer={triggerNode => triggerNode.parentNode}>
                                {sexType.map((item) => {
                                    return <Option key={item.id} value={item.id}>{item.className}</Option>
                                })}
                                </Select>
                    </Col>
                            <Col span={3} style={{textAlign:'right',fontSize:15}}>职务：</Col>
                                <Col span={4}>
                                    <Select value={sourceData.job}  style={{ width: 160 }} onChange={(value) => this.changeInput(value, 'job')} disabled={status} getPopupContainer={triggerNode => triggerNode.parentNode}>
                                {jobs.map((item) => {
                                    return <Option key={item.id} value={item.id}>{item.name}</Option>
                                })}
                                </Select></Col>
                           </Row>
                            <Row style={{marginTop:10}}>
                                <Col span={3} style={{textAlign:'right',fontSize:15}}>联系电话：</Col>
                                <Col span={4}><Input placeholder='请输入内容' value={sourceData.mobilePhone} onChange={(e)=>this.changeInput(e.target.value,'mobilePhone')} disabled={status} /></Col>
                                <Col span={3} style={{textAlign:'right',fontSize:15}}>工作电话：</Col>
                                <Col span={4}><Input placeholder='请输入内容' value={sourceData.workPhone} onChange={(e)=>this.changeInput(e.target.value,'workPhone')} disabled={status} /></Col>
                                <Col span={3} style={{textAlign:'right',fontSize:15}}>身份证号：</Col>
                                <Col span={6}><Input placeholder='请输入内容' value={sourceData.idNumber} onChange={(e)=>this.changeInput(e.target.value,'idNumber')} disabled={status} /></Col>
                            </Row>
                        </div>
                    </div>
                    <Row style={{marginTop:10}}>
                                <Col span={3} style={{textAlign:'right',fontSize:15}}>乡镇(街道)：</Col>
                                <Col span={8}><Select value={sourceData.street}  style={{ width: 250 }} onChange={(value) => this.changeList(value, 'street')} disabled={status} getPopupContainer={triggerNode => triggerNode.parentNode}>
                                {this.props.gridAndStreet.map((item) => {
                                    return <Option key={item.id} value={item.id}>{item.name}</Option>
                                })}
                                </Select></Col>
                                <Col span={3} style={{textAlign:'right',fontSize:15}}>所属网格：</Col>
                                <Col span={8}><Select value={sourceData.grid}  style={{ width: 250 }} onChange={(value) => this.changeList(value, 'grid')} disabled={status} getPopupContainer={triggerNode => triggerNode.parentNode}>
                                {(status?list:this.state.gridList).map((item) => {
                                    return <Option key={item.id} value={item.id}>{item.name}</Option>
                                })}
                                </Select></Col>
                            </Row>
                    
                 <Card style={{ width: 934,marginLeft:10,marginTop:10}}>
                    <div>上传提示：上传的资质证照文件大小需≤5M；上传资料格式支持：jpg、png、pdf、world格式</div>
                    <Upload
                        name='file'
                        showUploadList={false}
                        disabled={this.props.status=='detail'?true:false}
                        action={commonUrl+'/upload/uploadReport'}
                        onChange={this.handleFile}
                        fileList={appendix}      
                        >             
                        <Button style={{marginTop:10,marginLeft:700}}>
                            <Icon type="upload" /> 选择上传文件
                        </Button>
                    </Upload>  
                    <Table
                        style={{marginTop:10}}
                        columns={columns}
                        dataSource={appendix}
                        pagination={false}
                    />
                    <Modal visible={previewVisible} footer={null} onCancel={this.handleCancel}>
                    <img alt="example" style={{ width: '100%' }} src={commonUrl+'/upload/report/'+previewImage} />
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
