import React,{Component} from 'react';
import {Card, Input, Button, DatePicker, Icon, Upload, message, Select, Modal, Row, Col, Table} from "antd";
import {connect} from 'react-redux'
import {changeSampling} from "../../../../redux/action";
import moment from "moment";
import {commonUrl} from "../../../../axios/commonSrc";
import TypeForm from "./TypeForm";
import Utils from "../../../../utils";

const {TextArea}=Input;
const Option=Select.Option;
const ButtonGroup = Button.Group;
@connect(
    state=>({
        input:state.sampling
    }),
    {
        changeSampling,
    }
)
class DetailForm extends Component{
    state={}
    changeInput=(value,option)=>{
        let input = {...this.props.input,[option]:value}
        this.props.changeSampling(input);
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
                        <td style={{background:'#F2F2F2'}}>报告编号<span style={{color:'#FF3300'}}>*</span></td>
                        <td><Input value={formData.reportNo} placeholder={"请输入报告编号"} disabled={type=='detail'?true:false} onChange={(e)=>this.changeInput(e.target.value,'reportNo')}/></td>
                        <td style={{background:'#F2F2F2'}}>报告日期<span style={{color:'#FF3300'}}>*</span></td>
                        <td>
                            <DatePicker style={{width:'100%'}}
                                        disabled={type=='detail'?true:false}
                                        value={formData.reportDate===''?moment():moment(formData.reportDate)}
                                        onChange={(date)=>this.changeInput(date,'reportDate')}
                                        showTime={true} format="YYYY-MM-DD" disabledDate={this.disabledDate}/>
                        </td>
                        <td style={{background:'#F2F2F2'}}>抽检日期<span style={{color:'#FF3300'}}>*</span></td>
                        <td>
                            <DatePicker style={{width:'100%'}}
                                        disabled={type=='detail'?true:false}
                                        value={formData.checkDate===''?moment():moment(formData.checkDate)}
                                        onChange={(date)=>this.changeInput(date,'checkDate')}
                                        showTime={true} format="YYYY-MM-DD" disabledDate={this.disabledDate}/>
                        </td>
                        <td style={{background:'#F2F2F2'}}>抽检类型<span style={{color:'#FF3300'}}>*</span></td>
                        <td><Input value={formData.checkType} onClick={()=>this.setState({isVisible:true,searchType:'checkType'})} placeholder={"请选择抽检类型"} disabled={type=='detail'?true:false} suffix={<Icon type="search" />} onChange={(e)=>this.changeInput(e.target.value,'checkType')}/></td>
                    </tr>
                    <tr>
                        <td style={{background:'#F2F2F2'}}>被抽检单位<span style={{color:'#FF3300'}}>*</span></td>
                        <td colSpan={3}><Input value={formData.checkCompany} placeholder={"请输入被抽检单位"} disabled={type=='detail'?true:false} onChange={(e)=>this.changeInput(e.target.value,'checkCompany')}/></td>
                        <td style={{background:'#F2F2F2'}}>地址<span style={{color:'#FF3300'}}>*</span></td>
                        <td colSpan={3}><Input value={formData.address} placeholder={"请输入地址"} disabled={type=='detail'?true:false} onChange={(e)=>this.changeInput(e.target.value,'address')}/></td>
                    </tr>
                    <tr>
                        <td style={{background:'#F2F2F2'}}>联系人<span style={{color:'#FF3300'}}>*</span></td>
                        <td><Input value={formData.contact} placeholder={"请输入联系人"} disabled={type=='detail'?true:false} onChange={(e)=>this.changeInput(e.target.value,'contact')}/></td>
                        <td style={{background:'#F2F2F2'}}>联系电话<span style={{color:'#FF3300'}}>*</span></td>
                        <td><Input value={formData.phone} placeholder={"请输入联系电话"} disabled={type=='detail'?true:false} onChange={(e)=>this.changeInput(e.target.value,'phone')}/></td>
                        <td style={{background:'#F2F2F2'}}>检测机构<span style={{color:'#FF3300'}}>*</span></td>
                        <td><Input value={formData.checkOrginization} onClick={()=>this.setState({isVisible:true,searchType:'checkOrginization'})} placeholder={"请选择检测机构"} disabled={type=='detail'?true:false} suffix={<Icon type="search" />} onChange={(e)=>this.changeInput(e.target.value,'checkOrginization')}/></td>
                        <td style={{background:'#F2F2F2'}}>抽检环节<span style={{color:'#FF3300'}}>*</span></td>
                        <td><Input value={formData.checkStep} onClick={()=>this.setState({isVisible:true,searchType:'checkStep'})} placeholder={"请选择抽检环节"} disabled={type=='detail'?true:false} suffix={<Icon type="search" />} onChange={(e)=>this.changeInput(e.target.value,'checkStep')}/></td>
                    </tr>
                    <tr>
                        <td style={{background:'#F2F2F2'}}>抽样基数<span style={{color:'#FF3300'}}>*</span></td>
                        <td><Input value={formData.checkBasement} placeholder={"请输入抽样基数"} disabled={type=='detail'?true:false} onChange={(e)=>this.changeInput(e.target.value,'checkBasement')}/></td>
                        <td style={{background:'#F2F2F2'}}>被抽检单位类型<span style={{color:'#FF3300'}}>*</span></td>
                        <td colSpan={3}>
                            <Select value={formData.checkCompanyType} placeholder={"请选择被抽检单位类型"} style={{width:"100%"}} onChange={(value)=>this.changeInput(value,"checkCompanyType")}>
                                <Option value="食品生产" disabled={type=='detail'?true:false}>食品生产</Option>
                                <Option value="食品流通" disabled={type=='detail'?true:false}>食品流通</Option>
                                <Option value="餐饮服务" disabled={type=='detail'?true:false}>餐饮服务</Option>
                            </Select>
                        </td>
                        <td style={{background:'#F2F2F2'}}>买样费</td>
                        <td>
                            <Row>
                                <Col span={20}><Input value={formData.buyMoney} placeholder={"例：2.5"} disabled={type=='detail'?true:false} onChange={(e)=>this.changeInput(e.target.value,'buyMoney')}/></Col>
                                <Col span={4}><div style={{marginTop:7}}>元</div></Col>
                            </Row>
                        </td>
                    </tr>
                    <tr>
                        <td style={{background:'#F2F2F2'}}>样品名称<span style={{color:'#FF3300'}}>*</span></td>
                        <td><Input value={formData.sampleName} placeholder={"请输入样品名称"} disabled={type=='detail'?true:false} onChange={(e)=>this.changeInput(e.target.value,'sampleName')}/></td>
                        <td style={{background:'#F2F2F2'}}>封样人员<span style={{color:'#FF3300'}}>*</span></td>
                        <td colSpan={3}><Input value={formData.samplePerson} placeholder={"请输入封样人员"} disabled={type=='detail'?true:false} onChange={(e)=>this.changeInput(e.target.value,'samplePerson')}/></td>
                        <td style={{background:'#F2F2F2'}}><span style={{color:'#FF3300'}}>检测结果 *</span></td>
                        <td>
                            <Select value={formData.checkResult} placeholder={"请选择检测结果"} style={{width:"100%"}} onChange={(value)=>this.changeInput(value,"checkResult")}>
                                <Option value="合格" disabled={type=='detail'?true:false}>合格</Option>
                                <Option value="不合格" disabled={type=='detail'?true:false}>不合格</Option>
                                <Option value="其他" disabled={type=='detail'?true:false}>其他</Option>
                            </Select>
                        </td>
                    </tr>
                    <tr>
                        <td style={{background:'#F2F2F2'}}><span style={{color:'#FF3300'}}>不合格项目 *</span></td>
                        <td colSpan={8}><Input value={formData.resultItem} placeholder={"请输入不合格项目"} disabled={type=='detail'?true:false} onChange={(e)=>this.changeInput(e.target.value,'resultItem')}/></td>
                    </tr>
                    <tr>
                        <td style={{background:'#F2F2F2'}}>规格<span style={{color:'#FF3300'}}>*</span></td>
                        <td><Input value={formData.specifications} placeholder={"请输入规格"} disabled={type=='detail'?true:false} onChange={(e)=>this.changeInput(e.target.value,'specifications')}/></td>
                        <td style={{background:'#F2F2F2'}}>批次<span style={{color:'#FF3300'}}>*</span></td>
                        <td><Input value={formData.batch} placeholder={"请输入批次"} disabled={type=='detail'?true:false} onChange={(e)=>this.changeInput(e.target.value,'batch')}/></td>
                        <td style={{background:'#F2F2F2'}}>检测费<span style={{color:'#FF3300'}}>*</span></td>
                        <td>
                            <Row>
                                <Col span={20}><Input value={formData.checkMoney} placeholder={"例：2.5"} disabled={type=='detail'?true:false} onChange={(e)=>this.changeInput(e.target.value,'checkMoney')}/></Col>
                                <Col span={4}><div style={{marginTop:7}}>元</div></Col>
                            </Row>
                        </td>
                        <td style={{background:'#F2F2F2'}}>采样费<span style={{color:'#FF3300'}}>*</span></td>
                        <td>
                            <Row>
                                <Col span={20}><Input value={formData.sampleMoney} placeholder={"例：2.5"} disabled={type=='detail'?true:false} onChange={(e)=>this.changeInput(e.target.value,'sampleMoney')}/></Col>
                                <Col span={4}><div style={{marginTop:7}}>元</div></Col>
                            </Row>
                        </td>
                    </tr>
                    <tr>
                        <td style={{background:'#F2F2F2'}}>所属所队<span style={{color:'#FF3300'}}>*</span></td>
                        <td colSpan={3}><Input value={formData.team} disabled={true}/></td>
                        <td style={{background:'#F2F2F2'}}>执法人员<span style={{color:'#FF3300'}}>*</span></td>
                        <td colSpan={3}><Input value={formData.supervisor} placeholder={"请输入执法人员"} disabled={type=='detail'?true:false} onChange={(e)=>this.changeInput(e.target.value,'supervisor')}/></td>
                    </tr>
                    <tr>
                        <td style={{background:'#F2F2F2'}}>商标<span style={{color:'#FF3300'}}>*</span></td>
                        <td colSpan={3}><Input value={formData.siginal} placeholder={"请输入商标"} disabled={type=='detail'?true:false} onChange={(e)=>this.changeInput(e.target.value,'siginal')}/></td>
                        <td style={{background:'#F2F2F2'}}>日期类型<span style={{color:'#FF3300'}}>*</span></td>
                        <td><Input value={formData.dateType} onClick={()=>this.setState({isVisible:true,searchType:'dateType'})} placeholder={"请选择日期类型"} disabled={type=='detail'?true:false} suffix={<Icon type="search" />} onChange={(e)=>this.changeInput(e.target.value,'dateType')}/></td>
                        <td style={{background:'#F2F2F2'}}>日期类型时间<span style={{color:'#FF3300'}}>*</span></td>
                        <td>
                            <DatePicker style={{width:'100%'}}
                                        disabled={type=='detail'?true:false}
                                        value={formData.date===''?moment():moment(formData.date)}
                                        onChange={(date)=>this.changeInput(date,'date')}
                                        showTime={true} format="YYYY-MM-DD" disabledDate={this.disabledDate}/>
                        </td>
                    </tr>
                    <tr>
                        <td style={{background:'#F2F2F2'}}>样品批号<span style={{color:'#FF3300'}}>*</span></td>
                        <td><Input value={formData.sampleNo} placeholder={"请输入样品批号"} disabled={type=='detail'?true:false} onChange={(e)=>this.changeInput(e.target.value,'sampleNo')}/></td>
                        <td style={{background:'#F2F2F2'}}>保质期<span style={{color:'#FF3300'}}>*</span></td>
                        <td><Input value={formData.day} placeholder={"请输入保质期"} disabled={type=='detail'?true:false} onChange={(e)=>this.changeInput(e.target.value,'day')}/></td>
                        <td style={{background:'#F2F2F2'}}>执行标准<span style={{color:'#FF3300'}}>*</span></td>
                        <td><Input value={formData.standard} placeholder={"请输入执行标准"} disabled={type=='detail'?true:false} onChange={(e)=>this.changeInput(e.target.value,'standard')}/></td>
                        <td style={{background:'#F2F2F2'}}>生产许可证编号</td>
                        <td><Input value={formData.promissionNo} placeholder={"请输入生产许可证编号"} disabled={type=='detail'?true:false} onChange={(e)=>this.changeInput(e.target.value,'promissionNo')}/></td>
                    </tr>
                    <tr>
                        <td style={{background:'#F2F2F2'}}>生产者名称<span style={{color:'#FF3300'}}>*</span></td>
                        <td colSpan={3}><Input value={formData.produceName} placeholder={"请输入生产者名称"} disabled={type=='detail'?true:false} onChange={(e)=>this.changeInput(e.target.value,'produceName')}/></td>
                        <td style={{background:'#F2F2F2'}}>生产者地址<span style={{color:'#FF3300'}}>*</span></td>
                        <td colSpan={3}><Input value={formData.produceAddress} placeholder={"请输入生产者地址"} disabled={type=='detail'?true:false} onChange={(e)=>this.changeInput(e.target.value,'produceAddress')}/></td>
                    </tr>
                    <tr>
                        <td style={{background:'#F2F2F2'}}>生产联系人<span style={{color:'#FF3300'}}>*</span></td>
                        <td><Input value={formData.produceContact} placeholder={"请输入生产联系人"} disabled={type=='detail'?true:false} onChange={(e)=>this.changeInput(e.target.value,'produceContact')}/></td>
                        <td style={{background:'#F2F2F2'}}>生产者联系电话<span style={{color:'#FF3300'}}>*</span></td>
                        <td><Input value={formData.producePhone} placeholder={"请输入生产者联系电话"} disabled={type=='detail'?true:false} onChange={(e)=>this.changeInput(e.target.value,'producePhone')}/></td>
                        <td style={{background:'#F2F2F2'}}>抽样单编号<span style={{color:'#FF3300'}}>*</span></td>
                        <td><Input value={formData.spotCheckNo} placeholder={"请输入抽样单编号"} disabled={type=='detail'?true:false} onChange={(e)=>this.changeInput(e.target.value,'spotCheckNo')}/></td>
                        <td style={{background:'#F2F2F2'}}>食品类别<span style={{color:'#FF3300'}}>*</span></td>
                        <td><Input value={formData.foodType} onClick={()=>this.setState({isVisible:true,searchType:'foodType'})} placeholder={"请选择食品类别"} disabled={type=='detail'?true:false} suffix={<Icon type="search" />} onChange={(e)=>this.changeInput(e.target.value,'foodType')}/></td>
                    </tr>
                    <tr>
                        <td style={{background:'#F2F2F2'}}>处置措施</td>
                        <td colSpan={8}><Input value={formData.disposalType} onClick={()=>this.setState({isVisible:true,searchType:'disposalType'})} placeholder={"请选择处置措施"} disabled={type=='detail'?true:false} suffix={<Icon type="search" />} onChange={(e)=>this.changeInput(e.target.value,'disposalType')}/></td>
                    </tr>
                    <tr>
                        <td style={{background:'#F2F2F2'}}>备注</td>
                        <td colSpan={8}><TextArea rows={5} value={formData.remarke} placeholder={"请输入备注"} disabled={type=='detail'?true:false} onChange={(e)=>this.changeInput(e.target.value,"remarke")}/></td>
                    </tr>
                    <tr>
                        <td>附件信息</td>
                        <td colSpan={7}><Upload
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
                       title="选择"
                       visible={this.state.isVisible}
                       destroyOnClose
                       onCancel={()=>{
                           this.setState({
                               isVisible:false
                           })
                       }}
                >
                    <TypeForm dispatchSupervisor={(data)=>{
                        this.setState({isVisible:false})
                        this.changeInput(data,this.state.searchType);}}
                              searchType={this.state.searchType}
                    />
                </Modal>
            </div>
        );
    }
}
export default DetailForm;