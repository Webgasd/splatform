import React,{Component} from "react";
import {Card, Form, Input, Radio, DatePicker, Button, Icon, Upload, message, Select, Modal, Table} from "antd";
import moment from 'moment';
import {commonUrl} from "../../../../axios/commonSrc";
import {connect} from "react-redux";
import {changeSupplier} from "../../../../redux/action";
import Utils from "../../../../utils";

const Option=Select.Option;
const ButtonGroup = Button.Group;
@connect(
    state=>({
        input:state.supplier
    }),
    {
        changeSupplier,
    }
)
class DetailForm extends Component{
    state={
    }
    changeInput=(value,option)=>{
        let input = {...this.props.input,[option]:value}
        this.props.changeSupplier(input);
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
    disabledDate = (current) => {
        // 不能选今天之后的日期
        return current > moment();
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
    beforeUpload=()=> {
        if(this.props.input.document.length>4){
          return false;
        }
        else{
        //  this.setState({fileName:file.name});
          return true;
        }
    }
    render() {
       
        const type=this.props.type;
        const formData=this.props.input||{};
        console.log(formData.document)
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
        return (
                    <div className='commonEnterpriseBox'>
                        <table>
                            <tbody>
                            <tr>
                                <td style={{background:'#F2F2F2',width:'15%'}}>供应商名称<span style={{color:'#FF3300'}}>*</span></td>
                                <td style={{width:'30%'}}><Input placeholder={"请输入供应商名称"} value={formData.name} disabled={type=='detail'?true:false} onChange={(e)=>this.changeInput(e.target.value,'name')}/></td>
                                <td style={{background:'#F2F2F2',width:'15%'}}>供应商类型<span style={{color:'#FF3300'}}>*</span></td>
                                <td style={{width:'30%'}}>
                                    <Select value={formData.stype} style={{width:"100%"}} onChange={(value)=>this.changeInput(value,"stype")}>
                                        <Option value="流通企业" disabled={type=='detail'?true:false}>流通企业</Option>
                                        <Option value="生产企业" disabled={type=='detail'?true:false}>生产企业</Option>
                                    </Select>
                                </td>
                            </tr>
                            <tr>
                                <td style={{background:'#F2F2F2',width:'15%'}}>地址<span style={{color:'#FF3300'}}>*</span></td>
                                <td style={{width:'30%'}}><Input value={formData.address} disabled={type=='detail'?true:false} onChange={(e)=>this.changeInput(e.target.value,'address')}/></td>
                                <td style={{background:'#F2F2F2',width:'15%'}}>食品经营许可证号<span style={{color:'#FF3300'}}>*</span></td>
                                <td style={{width:'30%'}}><Input value={formData.number} disabled={type=='detail'?true:false} onChange={(e)=>this.changeInput(e.target.value,'number')}/></td>
                            </tr>
                            <tr>
                                <td style={{background:'#F2F2F2',width:'15%'}}>负责人<span style={{color:'#FF3300'}}>*</span></td>
                                <td style={{width:'30%'}}><Input value={formData.principal} disabled={type=='detail'?true:false} onChange={(e)=>this.changeInput(e.target.value,'principal')}/></td>
                                <td style={{background:'#F2F2F2',width:'15%'}}>社会信用代码证号<span style={{color:'#FF3300'}}>*</span></td>
                                <td style={{width:'30%'}}><Input value={formData.license} disabled={type=='detail'?true:false} onChange={(e)=>this.changeInput(e.target.value,'license')}/></td>
                            </tr>
                            <tr>
                                <td style={{background:'#F2F2F2',width:'15%'}}>主体类型</td>
                                <td style={{width:'30%'}}><Input value={formData.type} disabled={type=='detail'?true:false} onChange={(e)=>this.changeInput(e.target.value,'type')}/></td>
                                <td style={{background:'#F2F2F2',width:'15%'}}>许可范围<span style={{color:'#FF3300'}}>*</span></td>
                                <td style={{width:'30%'}}><Input value={formData.supplierSize} disabled={type=='detail'?true:false} onChange={(e)=>this.changeInput(e.target.value,'supplierSize')}/></td>
                            </tr>
                            <tr>
                                <td style={{background:'#F2F2F2',width:'15%'}}>发证机关</td>
                                <td style={{width:'30%'}}><Input value={formData.organ} disabled={type=='detail'?true:false} onChange={(e)=>this.changeInput(e.target.value,'organ')}/></td>
                                <td style={{background:'#F2F2F2',width:'15%'}}>联系人<span style={{color:'#FF3300'}}>*</span></td>
                                <td style={{width:'30%'}}><Input value={formData.person} disabled={type=='detail'?true:false} onChange={(e)=>this.changeInput(e.target.value,'person')}/></td>
                            </tr>
                            <tr>
                                <td style={{background:'#F2F2F2',width:'15%'}}>联系电话<span style={{color:'#FF3300'}}>*</span></td>
                                <td style={{width:'30%'}}><Input value={formData.phone} disabled={type=='detail'?true:false} onChange={(e)=>this.changeInput(e.target.value,'phone')}/></td>
                                <td style={{background:'#F2F2F2',width:'15%'}}>开始日期<span style={{color:'#FF3300'}}>*</span></td>
                                <td>
                                    <DatePicker style={{width:'100%'}}
                                                disabled={type=='detail'?true:false}
                                                value={formData.start===''?moment():moment(formData.start)}
                                                onChange={(date)=>this.changeInput(date,'start')}
                                                showTime={true} format="YYYY-MM-DD" disabledDate={this.disabledDate}/>
                                </td>
                            </tr>

                            <tr>
                                <td style={{background:'#F2F2F2',width:'15%'}}>截止日期<span style={{color:'#FF3300'}}>*</span></td>
                                <td>
                                    <DatePicker style={{width:'100%'}}
                                                disabled={type=='detail'?true:false}
                                                value={formData.end===''?moment():moment(formData.end)}
                                                onChange={(date)=>this.changeInput(date,'end')}
                                                showTime={true} format="YYYY-MM-DD" disabledDate={this.disabledDate}/>
                                </td>
                            </tr>
                            <tr>
                                <td>附件信息</td>
                                <td colSpan={5}><Upload
                                    disabled={type=='detail'?true:false}
                                    name='file'
                                    action={commonUrl+'/upload/uploadPicture'}
                                    onChange={this.handleFile}
                                   // beforeUpload={this.beforeUpload}
                                    fileList={formData.document}>
                                    <Button>
                                        <Icon type="upload" />选择上传文件
                                    </Button>
                                    {/* {length(formData.document) >= 4 ? null : 
                                     <Button>
                                     <Icon type="upload" />选择上传文件
                                 </Button>
                                    } */}
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
            </div>
        )
    }
}
export default DetailForm;
