import React,{Component} from 'react';
import {Input, Checkbox, Button, Icon, Upload, message,Table,Modal} from 'antd';
import connect from "react-redux/es/connect/connect";
import {changeEnterprise} from "../../../redux/action";
import {commonUrl} from "../../../axios/commonSrc";
import Utils from './../../../utils';
const confirm = Modal.confirm;
const { TextArea } = Input;
const ButtonGroup = Button.Group;

@connect(
    state=>({
        input:state.enterprise
    }),
    {
        changeEnterprise,
    }
)
 class Spread extends Component{
    state = {}
    changeInput=(value,option)=>{
        let input = {...this.props.input,[option]:value}
        this.props.changeEnterprise(input);
    }
    onCheckChange=(value)=>{
        this.changeInput(value.join(','),'classification')
    }
    handleFile = (info) => {
        const fileList = info.fileList;
        if (info.file.status === 'done') {
            message.success(`${info.file.name} 上传成功`);
        } else if (info.file.status === 'error') {
            message.error(`${info.file.name} 上传失败.`);
        }
        this.changeInput(fileList,"propagandaEnclosure");
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
            <div  className='commonEnterpriseBox'>
                <div className='commonEnterpriseBoxHead'>企业宣传信息</div>
                <table>
                    <tbody>
                    <tr>
                        <td >规范简称 （店招名称）</td>
                        <td colSpan="2" ><Input  value={formData.abbreviation} onChange={(e)=>this.changeInput(e.target.value,"abbreviation")} placeholder={"请输入规范简称 （店招名称）"} disabled={checkStatus}/></td>
                     
                    </tr>
                    <tr>
                        <td>简介</td>
                        <td ><TextArea  value={formData.introduction} onChange={(e)=>this.changeInput(e.target.value,"introduction")} rows={5} placeholder={"请输入简介"} disabled={checkStatus}/></td>
                    </tr>
                    <tr>
                        <td>企业文化</td>
                        <td ><TextArea  value={formData.culture} onChange={(e)=>this.changeInput(e.target.value,"culture")} rows={5} placeholder={"请输入企业文化"} disabled={checkStatus}/></td>
                    </tr>
                    <tr>
                        <td>菜系分类</td>
                        <td  style={{textAlign:'left'}}><Checkbox.Group style={{width:'100%'}} value={formData.classification?formData.classification.split(','):[]} onChange={this.onCheckChange} disabled={checkStatus}>
                            <Checkbox style={{marginLeft:8}} value={'鲁菜'}>鲁菜</Checkbox>
                            <Checkbox value={'川湘菜'}>川湘菜</Checkbox>
                            <Checkbox value={'西北菜'}>西北菜</Checkbox>
                            <Checkbox value={'徽菜'}>徽菜</Checkbox>
                            <Checkbox value={'江浙菜'}>江浙菜</Checkbox>
                            <Checkbox value={'东北菜'}>东北菜</Checkbox>
                            <Checkbox value={'闽菜'}>闽菜</Checkbox>
                            <Checkbox value={'云南菜'}>云南菜</Checkbox>
                            <Checkbox value={'粤菜'}>粤菜</Checkbox>
                            <Checkbox value={'新疆菜'}>新疆菜</Checkbox>
                            <Checkbox value={'轻食西餐'}>轻食西餐</Checkbox>
                            <Checkbox value={'海鲜'}>海鲜</Checkbox>
                            <Checkbox value={'火锅烤鱼'}>火锅烤鱼</Checkbox>
                            <Checkbox value={'简餐便当'}>简餐便当</Checkbox>
                            <Checkbox value={'小吃炸串'}>小吃炸串</Checkbox>
                            <Checkbox value={'日韩料理'}>日韩料理</Checkbox>
                            <Checkbox value={'香锅冒菜'}>香锅冒菜</Checkbox>
                            <Checkbox value={'面食粥点'}>面食粥点</Checkbox>
                            <Checkbox value={'汉堡披萨'}>汉堡披萨</Checkbox>
                            <Checkbox value={'饮料饮品'}>饮料饮品</Checkbox>
                            <Checkbox value={'融合菜'}>融合菜</Checkbox>
                            <Checkbox value={'其他'}>其他</Checkbox>
                        </Checkbox.Group></td>
                    </tr>
                    <tr><td>宣传附件</td>
                        <td>
                        <Upload
                            disabled={checkStatus}
                            action={commonUrl+'/upload/uploadPicture'}
                            onChange={this.handleFile}
                            showUploadList={false}
                            fileList={formData.propagandaEnclosure}>
                            <Button>
                                <Icon type="upload" /> 选择上传文件
                            </Button>
                        </Upload>
                    </td></tr>
                    </tbody>
                </table>
                <Table
                    columns={columns}
                    bordered
                    dataSource={formData.propagandaEnclosure}
                    pagination={false}
                />
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

export default Spread;