import React,{Component} from 'react';
import {Card,Table,Input,DatePicker,Select,Form,Button,Icon,Modal,Upload,message} from "antd";
import {commonUrl} from "../../../../axios/commonSrc";
import connect from "react-redux/es/connect/connect";
import {changeGovquick} from "../../../../redux/action";
import moment from 'moment';
import TextArea from 'antd/lib/input/TextArea';
import SupervisorForm from "./supervisorForm";
import Utils from './../../../../utils';
const confirm = Modal.confirm;
const ButtonGroup = Button.Group;
const Option=Select.Option;
@connect(
    state=>({
        input:state.govquick
    }),
    {
        changeGovquick,
    }
)
class DetailForm extends Component {
    state={
        selectedRowKeys: [], 
       
    }
    params = {
        pageNo:1
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
        let fileList = this.props.input.document;
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
                let fileList = this.props.input.document;
                fileList.splice(index,1);
                this.changeInput(fileList,'document')
            }
        })
    };
    changeInput=(value,option)=>{
        let input = {...this.props.input,[option]:value}
        this.props.changeGovquick(input);
    }

    render() {
        const type=this.props.type;
        const formData=this.props.input||{};  
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
                        <Button type="primary" size="small" onClick={() => { this.handleFileDelete(index) }} disabled={type=='detail'?true:false}>删除</Button>
                    </ButtonGroup>


                }
            }
        ]           
        return (
            <div>
                <Card  style={{marginLeft:15,marginRight:15}}>
                    <div className='commonEnterpriseBox'>
                        <table>
                            <tbody>
                                <tr>
                    <th style={{width:70}}>日期</th>
                        <td ><DatePicker style={{width:'100%'}}
                         value={formData.date=moment(formData.date)}
                         onChange={(date)=>this.changeInput(date,'date')}
                         format="YYYY-MM-DD"
                         disabled={type=='detail'?true:false}/>
                         </td>                       
                        <th style={{width:60}}>样品名称<span style={{color:'#FF3300'}}>*</span></th>
                        <td ><Input  value={formData.checkName} onChange={(e)=>this.changeInput(e.target.value,"checkName")} disabled={type=='detail'?true:false}/></td>
                        <th style={{width:80}}>被抽检单位<span style={{color:'#FF3300'}}>*</span></th>
                        <td colSpan={2} style={{width:150}}>
                            <Input value={formData.checkCompany} onChange={(e)=>this.changeInput(e.target.value,"checkCompany")} disabled={type=='detail'?true:false}/>
                        </td>
                        </tr>
                        <tr>
                        <th>地址</th>
                        <td colSpan={4}>
                            <Input value={formData.address} onChange={(e)=>this.changeInput(e.target.value,"address")} disabled={type=='detail'?true:false}/>
                        </td>
                        <th style={{width:70}}>主体业态</th>
                        <td >
                            <Input value={formData.mainOperationType} onChange={(e)=>this.changeInput(e.target.value,"mainOperationType")} disabled={type=='detail'?true:false}/>
                        </td>
                        </tr>
                        <tr>
                        <th>负责人</th>
                        <td>
                            <Input value={formData.charger} onChange={(e)=>this.changeInput(e.target.value,"charger")} disabled={type=='detail'?true:false}/>
                        </td>
                        <th>电话</th>
                        <td >
                            <Input value={formData.phone} onChange={(e)=>this.changeInput(e.target.value,"phone")} disabled={type=='detail'?true:false}/>
                        </td>
                        <th>检查项目<span style={{color:'#FF3300'}}>*</span></th>
                        <td colSpan={2}>
                            <Input value={formData.checkItems} onChange={(e)=>this.changeInput(e.target.value,"checkItems")} disabled={type=='detail'?true:false}/>
                        </td>
                        </tr>
                        <tr>
                        <th>检查结果 <span style={{color:'#FF3300'}}>*</span></th>
                        <td>
                            <Select value={formData.checkResult} style={{width:"100%"}} onChange={(value)=>this.changeInput(value,"checkResult")}>
                                <Option value="合格" disabled={type=='detail'?true:false}>合格</Option>
                                <Option value="不合格" disabled={type=='detail'?true:false}>不合格</Option>
                            </Select>
                        </td>
                        <th>买样费<span style={{color:'#FF3300'}}>*</span></th>
                        <td >
                            <Input placeholder={"请填写数字"} value={formData.buyMoney} onChange={(e)=>this.changeInput(e.target.value,"buyMoney")} disabled={type=='detail'?true:false}/>
                        </td>
                        <th>检查批次<span style={{color:'#FF3300'}}>*</span></th>
                        <td colSpan={2}>
                            <Input placeholder={"请填写数字"} value={formData.checkBatch} onChange={(e)=>this.changeInput(e.target.value,"checkBatch")} disabled={type=='detail'?true:false}/>
                        </td>
                        </tr>
                        <tr>
                        <th>所属所队</th>
                        <td colSpan={6}>
                            <Input value={formData.team} onChange={(e)=>this.changeInput(e.target.value,"team")} disabled/>
                        </td> 
                        </tr>
                        <tr>
                        <th>快检机构<span style={{color:'#FF3300'}}>*</span></th>
                        <td colSpan={6}>
                        <Input  value={formData.market}
                        disabled={type=='detail'?true:false}
                           onClick={()=>this.setState({isVisible:true,personType:'market'})} 
                          placeholder={"请选择"} suffix={<Icon type="search" />}/>
                        </td> 
                        </tr>
                        <tr>
                        <th>检查人员<span style={{color:'#FF3300'}}>*</span></th>
                        <td colSpan={4}>
                            <Input value={formData.checkPerson} onChange={(e)=>this.changeInput(e.target.value,"checkPerson")} disabled={type=='detail'?true:false}/>
                        </td> 
                        <th>快检产品<span style={{color:'#FF3300'}}>*</span></th>
                        <td>
                        <Input  value={formData.checkProduct}
                        disabled={type=='detail'?true:false}
                           onClick={()=>this.setState({isVisible:true,personType:'checkProduct'})} 
                          placeholder={"请选择"} suffix={<Icon type="search" />}/>
                        </td> 
                        </tr>
                        <tr>
                        <th>备注</th>
                        <td colSpan={6}>
                            <TextArea  style={{height:100}} value={formData.remark} onChange={(e)=>this.changeInput(e.target.value,"remark")} disabled={type=='detail'?true:false}/>
                        </td> 
                        </tr>
                        </tbody>
                        </table>
                    </div>
                </Card> 
                <Card title='附件信息' style={{marginRight:15,marginLeft:15,marginTop:15}}>                       
                 <Upload
                 name='file'
                 showUploadList={false}
                 disabled={type=='detail'?true:false}
                 action={commonUrl+'/upload/uploadReport'}
                 onChange={this.handleFile}
                 fileList={formData.document}      
                 >             
                 <Button>
                     <Icon type="upload" /> 选择上传文件
                 </Button>
             </Upload>  
             <Table
                    columns={columns}
                    dataSource={formData.document}
                    pagination={false}
                />
                <Modal visible={previewVisible} footer={null} onCancel={this.handleCancel}>
                    <img alt="example" style={{ width: '100%' }} src={commonUrl+'/upload/picture/'+previewImage} />
                </Modal>
                <Modal visible={modifyVisible} onOk={this.handleFileNameSubmit} okText='确定' cancelText='取消' onCancel={this.handleFileNameCancel}>
                    <Input  disabled={type=='detail'?true:false} onChange={(e)=>this.changeFileName(e.target.value)} value={this.state.handleFileName}/>
                </Modal>                 
            </Card>        
            <Modal
                    width='500px'
                    destroyOnClose
                    title="选择信息列表"
                    visible={this.state.isVisible}
                    footer={null}
                    onCancel={()=>{
                        this.setState({
                            isVisible:false
                        })
                    }}
                >
                    
                    <SupervisorForm dispatchSupervisor={(data)=>{
                        this.setState({isVisible:false})
                        this.changeInput(data,this.state.personType);}} 
                        personType={this.state.personType}/>
                        
                </Modal>      
            </div>


        );
    }

}
export default DetailForm = Form.create({})(DetailForm);