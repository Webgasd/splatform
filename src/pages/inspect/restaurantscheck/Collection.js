import React,{ Component } from 'react';
import {Button, Icon, Input, message, Modal, Table, Upload} from "antd";
import {commonUrl} from "../../../axios/commonSrc";
import Utils from "../../../utils";
const ButtonGroup = Button.Group;
const confirm = Modal.confirm;

class Collection extends Component{
    state={}
    changeInput=(value,option)=>{
        let data = this.props.inspectData;
        data[option] = value
        this.props.dispatchInspectData(data);
    }
    handleFile = (info) => {
        const fileList = info.fileList;
        if (info.file.status === 'done') {
            message.success(`${info.file.name} 上传成功`);
        } else if (info.file.status === 'error') {
            message.error(`${info.file.name} 上传失败.`);
        }
        this.changeInput(fileList,"document");
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
        let fileList = this.props.inspectData.document;
        fileList[this.state.handleFileIndex].name = this.state.handleFileName;
        this.changeInput(fileList,'document');
        this.setState({ modifyVisible: false });
    }
    handleFileDelete = (index) => {
        confirm({
            title: '确定删除?',
            okText: '是',
            okType: 'danger',
            cancelText: '否',
            onOk:()=>{
                let fileList = this.props.inspectData.document;
                fileList.splice(index,1);
                this.changeInput(fileList,'document')
            }
        })
    };
    render() {
        const type = this.props.type;
        const formData = this.props.inspectData;
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
                        <Button type="primary" size="small" onClick={()=> {this.handleFileName(index,record)}}>修改名称</Button>
                        <Button type="primary" size="small" onClick={() => { this.handleFileDelete(index) }}>删除</Button>
                    </ButtonGroup>


                }
            }
        ]
        return (<div>
            {type=='detail'?null:
                <Upload
                    action={commonUrl+'/upload/uploadPicture'}
                    onChange={this.handleFile}
                    showUploadList={false}
                    accept='image/png,image/jpeg'
                    fileList={formData.document}>
                    <Button type="primary">
                        <Icon type="upload" /> 选择上传文件
                    </Button>
                </Upload>
            }
            <Table
                columns={columns}
                bordered
                dataSource={formData.document}
                pagination={false}
            />
            <Modal visible={previewVisible} footer={null} onCancel={this.handleCancel}>
                <img alt="example" style={{ width: '100%' }} src={commonUrl+'/upload/picture/'+previewImage} />
            </Modal>
            <Modal visible={modifyVisible} onOk={this.handleFileNameSubmit} okText='确定' cancelText='取消' onCancel={this.handleFileNameCancel}>
                <Input onChange={(e)=>this.changeFileName(e.target.value)} value={this.state.handleFileName}/>
            </Modal>
        </div>);
    }
}

export default Collection;