import React,{Component} from 'react';
import {Card, Input, Button, Radio, DatePicker, Icon, Upload, message, Modal, Row, Col, Select, Table} from "antd";
import {connect} from 'react-redux'
import {changeShipment} from "../../../../redux/action";
import moment from "moment";
import {commonUrl} from "../../../../axios/commonSrc";
import PersonForm from "../purchase/PersonForm";
import Measurement from "../purchase/Measurement";
import Utils from "../../../../utils";

const Option=Select.Option;
const ButtonGroup = Button.Group;
@connect(
    state=>({
        input:state.shipment
    }),
    {
        changeShipment,
    }
)
class DetailForm extends Component{
    state={
    }
    changeInput=(value,option)=>{
        let input = {...this.props.input,[option]:value}
        this.props.changeShipment(input);
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
        // 不能选今天和今天之前的日期
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
                        <td style={{background:'#F2F2F2',width:'15%'}}>产品名称<span style={{color:'#FF3300'}}>*</span></td>
                        <td style={{width:'30%'}}><Input value={formData.name} disabled={type=='detail'?true:false} onChange={(e)=>this.changeInput(e.target.value,'name')}/></td>
                        <td style={{background:'#F2F2F2',width:'15%'}}>产品类型</td>
                        <td>
                            <Select value={formData.type} style={{width:"100%"}} onChange={(value)=>this.changeInput(value,"type")}>
                                <Option value="散装食品" disabled={type=='detail'?true:false}>散装食品</Option>
                                <Option value="预包装食品" disabled={type=='detail'?true:false}>预包装食品</Option>
                            </Select>
                        </td>
                    </tr>
                    <tr>
                        <td style={{background:'#F2F2F2',width:'15%'}}>品牌</td>
                        <td style={{width:'30%'}}><Input value={formData.brand} disabled={type=='detail'?true:false} onChange={(e)=>this.changeInput(e.target.value,'brand')}/></td>
                        <td style={{background:'#F2F2F2',width:'15%'}}>生产商</td>
                        <td style={{width:'30%'}}><Input value={formData.manufacturer} disabled={type=='detail'?true:false} onChange={(e)=>this.changeInput(e.target.value,'manufacturer')}/></td>
                    </tr>
                    <tr>
                        <td style={{background:'#F2F2F2',width:'15%'}}>生产日期<span style={{color:'#FF3300'}}>*</span></td>
                        <td>
                            <DatePicker style={{width:'100%'}}
                                        disabled={type=='detail'?true:false}
                                        value={formData.time===''?moment():moment(formData.time)}
                                        onChange={(date)=>this.changeInput(date,'time')}
                                        showTime={true} format="YYYY-MM-DD" disabledDate={this.disabledDate}/>
                        </td>
                        <td style={{background:'#F2F2F2',width:'15%'}}>规格/净含量</td>
                        <td style={{width:'30%'}}><Input value={formData.weight} disabled={type=='detail'?true:false} onChange={(e)=>this.changeInput(e.target.value,'weight')}/></td>
                    </tr>
                    <tr>
                        <td style={{background:'#F2F2F2',width:'15%'}}>供应商<span style={{color:'#FF3300'}}>*</span></td>
                        <td style={{width:'30%'}}><Input value={formData.supplier} disabled={type=='detail'?true:false} onChange={(e)=>this.changeInput(e.target.value,'supplier')}/></td>
                        <td style={{background:'#F2F2F2',width:'15%'}}>有效期<span style={{color:'#FF3300'}}>*</span></td>
                        <td style={{width:'30%'}}><Input value={formData.day} disabled={type=='detail'?true:false} onChange={(e)=>this.changeInput(e.target.value,'day')}/></td>
                    </tr>
                    <tr>
                        <td style={{background:'#F2F2F2',width:'15%'}}>验收人</td>
                        <td style={{width:'30%'}}><Input value={formData.person} disabled={type=='detail'?true:false} onChange={(e)=>this.changeInput(e.target.value,'person')}/></td>
                        <td style={{background:'#F2F2F2',width:'15%'}}>出货日期<span style={{color:'#FF3300'}}>*</span></td>
                        <td>
                            <DatePicker style={{width:'100%'}}
                                        disabled={type=='detail'?true:false}
                                        value={formData.date===''?moment():moment(formData.date)}
                                        onChange={(date)=>this.changeInput(date,'date')}
                                        showTime={true} format="YYYY-MM-DD" disabledDate={this.disabledDate}/>
                        </td>
                    </tr>
                    <tr>
                        <td style={{background:'#F2F2F2',width:'15%'}}>出货数量<span style={{color:'#FF3300'}}>*</span></td>
                        <td>
                            <Row>
                                <Col span={16}><Input value={formData.num} disabled={type=='detail'?true:false} onChange={(e)=>this.changeInput(e.target.value,'num')}/></Col>
                                <Col span={6}><Input value={formData.goodsType} style={{marginLeft:7,width:70}} onClick={()=>this.setState({ismeVisible:true,measurement:'goodsType'})} placeholder={"单位"} disabled={type=='detail'?true:false}/></Col>
                            </Row>
                        </td>
                    </tr>
                    <tr>
                        <td colSpan={5} style={{background:'#F2F2F2'}}><div style={{float: 'left',marginLeft:40}}>上传购货票据、食品合格证明文件</div></td>
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
                {/*<Modal*/}
                    {/*width='700px'*/}
                    {/*title="企业从业人员信息列表"*/}
                    {/*visible={this.state.isVisible}*/}
                    {/*footer={null}*/}
                    {/*onCancel={()=>{*/}
                        {/*this.setState({*/}
                            {/*isVisible:false*/}
                        {/*})*/}
                    {/*}}*/}
                {/*>*/}
                    {/*<PersonForm dispatchSupervisor={(data)=>{*/}
                        {/*this.setState({isVisible:false})*/}
                        {/*this.changeInput(data,this.state.personType);}} />*/}
                {/*</Modal>*/}
                <Modal footer={null}
                       maskClosable={false}
                       width='700px'
                       title="单位信息列表"
                       visible={this.state.ismeVisible}
                       okText={"确定"}
                       cancelText={"取消"}
                       destroyOnClose
                       onCancel={()=>{
                           this.setState({
                               ismeVisible:false
                           })
                       }}
                >
                    <Measurement dispatchSupervisor={(data)=>{
                        this.setState({ismeVisible:false})
                        this.changeInput(data,this.state.measurement);}} />
                </Modal>
            </div>
        );
    }
}
export default DetailForm;