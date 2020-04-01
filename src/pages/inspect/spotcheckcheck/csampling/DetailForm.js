import React,{Component} from 'react';
import {Card, Input, Button, Row, Col, DatePicker, Icon, Upload, message, Select, Modal} from "antd";
import {connect} from 'react-redux'
import {changeInput} from "../../../../redux/action";
import moment from "moment";
import {commonUrl} from "../../../../axios/commonSrc";
import TypeForm from "./TypeForm";

const {TextArea}=Input;
const Option=Select.Option;
@connect(
    state=>({
        input:state.input
    }),
    {
        changeInput,
    }
)
class DetailForm extends Component{
    state={}
    changeInput=(value,option)=>{
        let input = {...this.props.input,[option]:value}
        this.props.changeInput(input);
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
    render() {
        const type=this.props.type;
        const formData=this.props.input||{};
        return(
            <div className='commonEnterpriseBox'>
                <table>
                    <tbody>
                    <tr>
                        <td style={{background:'#F2F2F2'}}>报告编号<span style={{color:'#FF3300'}}>*</span></td>
                        <td><Input value={formData.name} placeholder={"请输入报告编号"} disabled={type=='detail'?true:false} onChange={(e)=>this.changeInput(e.target.value,'name')}/></td>
                        <td style={{background:'#F2F2F2'}}>报告日期<span style={{color:'#FF3300'}}>*</span></td>
                        <td>
                            <DatePicker style={{width:'100%'}}
                                        disabled={type=='detail'?true:false}
                                        value={formData.date===''?moment():moment(formData.date)}
                                        onChange={(date)=>this.changeInput(date,'date')}
                                        showTime={true} format="YYYY-MM-DD" disabledDate={this.disabledDate}/>
                        </td>
                        <td style={{background:'#F2F2F2'}}>抽检日期<span style={{color:'#FF3300'}}>*</span></td>
                        <td>
                            <DatePicker style={{width:'100%'}}
                                        disabled={type=='detail'?true:false}
                                        value={formData.date===''?moment():moment(formData.date)}
                                        onChange={(date)=>this.changeInput(date,'date')}
                                        showTime={true} format="YYYY-MM-DD" disabledDate={this.disabledDate}/>
                        </td>
                        <td style={{background:'#F2F2F2'}}>抽检类型<span style={{color:'#FF3300'}}>*</span></td>
                        <td><Input value={formData.testtype} onClick={()=>this.setState({isVisible:true,searchType:'checktype'})} placeholder={"请选择抽检类型"} disabled={type=='detail'?true:false} suffix={<Icon type="search" />} onChange={(e)=>this.changeInput(e.target.value,'checktype')}/></td>
                    </tr>
                    <tr>
                        <td style={{background:'#F2F2F2'}}>被抽检单位<span style={{color:'#FF3300'}}>*</span></td>
                        <td colSpan={3}><Input value={formData.brand} placeholder={"请输入被抽检单位"} disabled onChange={(e)=>this.changeInput(e.target.value,'brand')}/></td>
                        <td style={{background:'#F2F2F2'}}>地址<span style={{color:'#FF3300'}}>*</span></td>
                        <td colSpan={3}><Input value={formData.manufacturer} placeholder={"请输入地址"} disabled={type=='detail'?true:false} onChange={(e)=>this.changeInput(e.target.value,'manufacturer')}/></td>
                    </tr>
                    <tr>
                        <td style={{background:'#F2F2F2'}}>联系人<span style={{color:'#FF3300'}}>*</span></td>
                        <td><Input value={formData.name} placeholder={"请输入联系人"} disabled={type=='detail'?true:false} onChange={(e)=>this.changeInput(e.target.value,'name')}/></td>
                        <td style={{background:'#F2F2F2'}}>联系电话<span style={{color:'#FF3300'}}>*</span></td>
                        <td><Input value={formData.name} placeholder={"请输入联系电话"} disabled={type=='detail'?true:false} onChange={(e)=>this.changeInput(e.target.value,'name')}/></td>
                        <td style={{background:'#F2F2F2'}}>检测机构<span style={{color:'#FF3300'}}>*</span></td>
                        <td><Input value={formData.type} onClick={()=>this.setState({isVisible:true,searchType:'type'})} placeholder={"请选择检测机构"} disabled={type=='detail'?true:false} suffix={<Icon type="search" />} onChange={(e)=>this.changeInput(e.target.value,'type')}/></td>
                        <td style={{background:'#F2F2F2'}}>抽检环节<span style={{color:'#FF3300'}}>*</span></td>
                        <td>
                            <Select value={formData.type} style={{width:"100%"}} placeholder={"请选择抽检环节"} onChange={(value)=>this.changeInput(value,"type")}>
                                <Option value="生产" disabled={type=='detail'?true:false}>生产</Option>
                                <Option value="流通" disabled={type=='detail'?true:false}>流通</Option>
                                <Option value="餐饮" disabled={type=='detail'?true:false}>餐饮</Option>
                            </Select>
                        </td>
                    </tr>
                    <tr>
                        <td style={{background:'#F2F2F2'}}>抽样基数<span style={{color:'#FF3300'}}>*</span></td>
                        <td><Input value={formData.supplier} placeholder={"请输入抽样基数"} disabled={type=='detail'?true:false} onChange={(e)=>this.changeInput(e.target.value,'supplier')}/></td>
                        <td style={{background:'#F2F2F2'}}>被抽检单位类型<span style={{color:'#FF3300'}}>*</span></td>
                        <td colSpan={3}>
                            <Select value={formData.type} placeholder={"请选择被抽检单位类型"} style={{width:"100%"}} onChange={(value)=>this.changeInput(value,"type")}>
                                <Option value="食品生产" disabled={type=='detail'?true:false}>食品生产</Option>
                                <Option value="食品流通" disabled={type=='detail'?true:false}>食品流通</Option>
                                <Option value="餐饮服务" disabled={type=='detail'?true:false}>餐饮服务</Option>
                            </Select>
                        </td>
                        <td style={{background:'#F2F2F2'}}>买样费</td>
                        <td><Input value={formData.day} placeholder={"请输入买样费"} disabled={type=='detail'?true:false} onChange={(e)=>this.changeInput(e.target.value,'day')}/></td>
                    </tr>
                    <tr>
                        <td style={{background:'#F2F2F2'}}>样品名称<span style={{color:'#FF3300'}}>*</span></td>
                        <td><Input value={formData.supplier} placeholder={"请输入样品名称"} disabled={type=='detail'?true:false} onChange={(e)=>this.changeInput(e.target.value,'supplier')}/></td>
                        <td style={{background:'#F2F2F2'}}>封样人员<span style={{color:'#FF3300'}}>*</span></td>
                        <td colSpan={3}><Input value={formData.day} placeholder={"请输入封样人员"} disabled={type=='detail'?true:false} onChange={(e)=>this.changeInput(e.target.value,'day')}/></td>
                        <td style={{background:'#F2F2F2'}}><span style={{color:'#FF3300'}}>检测结果 *</span></td>
                        <td>
                            <Select value={formData.type} placeholder={"请选择检测结果"} style={{width:"100%"}} onChange={(value)=>this.changeInput(value,"type")}>
                                <Option value="合格" disabled={type=='detail'?true:false}>合格</Option>
                                <Option value="不合格" disabled={type=='detail'?true:false}>不合格</Option>
                                <Option value="其他" disabled={type=='detail'?true:false}>其他</Option>
                            </Select>
                        </td>
                    </tr>
                    <tr>
                        <td style={{background:'#F2F2F2'}}><span style={{color:'#FF3300'}}>不合格项目 *</span></td>
                        <td colSpan={8}><Input value={formData.supplier} placeholder={"请输入不合格项目"} disabled={type=='detail'?true:false} onChange={(e)=>this.changeInput(e.target.value,'supplier')}/></td>
                    </tr>
                    <tr>
                        <td style={{background:'#F2F2F2'}}>规格<span style={{color:'#FF3300'}}>*</span></td>
                        <td><Input value={formData.supplier} placeholder={"请输入规格"} disabled={type=='detail'?true:false} onChange={(e)=>this.changeInput(e.target.value,'supplier')}/></td>
                        <td style={{background:'#F2F2F2'}}>批次<span style={{color:'#FF3300'}}>*</span></td>
                        <td><Input value={formData.supplier} placeholder={"请输入批次"} disabled={type=='detail'?true:false} onChange={(e)=>this.changeInput(e.target.value,'supplier')}/></td>
                        <td style={{background:'#F2F2F2'}}>检测费<span style={{color:'#FF3300'}}>*</span></td>
                        <td><Input value={formData.supplier} placeholder={"请输入检测费"} disabled={type=='detail'?true:false} onChange={(e)=>this.changeInput(e.target.value,'supplier')}/></td>
                        <td style={{background:'#F2F2F2'}}>采样费<span style={{color:'#FF3300'}}>*</span></td>
                        <td><Input value={formData.supplier} placeholder={"请输入采样费"} disabled={type=='detail'?true:false} onChange={(e)=>this.changeInput(e.target.value,'supplier')}/></td>
                    </tr>
                    <tr>
                        <td style={{background:'#F2F2F2'}}>所属所队<span style={{color:'#FF3300'}}>*</span></td>
                        <td colSpan={3}><Input value={formData.supplier} onClick={()=>this.setState({isVisible:true,searchType:'type'})} placeholder={"请选择所属所队"} disabled={type=='detail'?true:false} suffix={<Icon type="home" />} onChange={(e)=>this.changeInput(e.target.value,'type')}/></td>
                        <td style={{background:'#F2F2F2'}}>执法人员<span style={{color:'#FF3300'}}>*</span></td>
                        <td colSpan={3}><Input value={formData.supplier} placeholder={"请输入执法人员"} disabled={type=='detail'?true:false} onChange={(e)=>this.changeInput(e.target.value,'supplier')}/></td>
                    </tr>
                    <tr>
                        <td style={{background:'#F2F2F2'}}>商标<span style={{color:'#FF3300'}}>*</span></td>
                        <td colSpan={3}><Input value={formData.supplier} placeholder={"请输入商标"} disabled={type=='detail'?true:false} onChange={(e)=>this.changeInput(e.target.value,'supplier')}/></td>
                        <td style={{background:'#F2F2F2'}}>日期类型<span style={{color:'#FF3300'}}>*</span></td>
                        <td><Input value={formData.type} onClick={()=>this.setState({isVisible:true,searchType:'datetype'})} placeholder={"请选择日期类型"} disabled={type=='detail'?true:false} suffix={<Icon type="search" />} onChange={(e)=>this.changeInput(e.target.value,'datetype')}/></td>
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
                        <td><Input value={formData.supplier} placeholder={"请输入样品批号"} disabled={type=='detail'?true:false} onChange={(e)=>this.changeInput(e.target.value,'supplier')}/></td>
                        <td style={{background:'#F2F2F2'}}>保质期<span style={{color:'#FF3300'}}>*</span></td>
                        <td><Input value={formData.supplier} placeholder={"请输入保质期"} disabled={type=='detail'?true:false} onChange={(e)=>this.changeInput(e.target.value,'supplier')}/></td>
                        <td style={{background:'#F2F2F2'}}>执行标准<span style={{color:'#FF3300'}}>*</span></td>
                        <td><Input value={formData.supplier} placeholder={"请输入执行标准"} disabled={type=='detail'?true:false} onChange={(e)=>this.changeInput(e.target.value,'supplier')}/></td>
                        <td style={{background:'#F2F2F2'}}>生产许可证编号</td>
                        <td><Input value={formData.supplier} placeholder={"请输入生产许可证编号"} disabled={type=='detail'?true:false} onChange={(e)=>this.changeInput(e.target.value,'supplier')}/></td>
                    </tr>
                    <tr>
                        <td style={{background:'#F2F2F2'}}>生产者名称<span style={{color:'#FF3300'}}>*</span></td>
                        <td colSpan={3}><Input value={formData.supplier} placeholder={"请输入生产者名称"} disabled={type=='detail'?true:false} onChange={(e)=>this.changeInput(e.target.value,'supplier')}/></td>
                        <td style={{background:'#F2F2F2'}}>生产者地址<span style={{color:'#FF3300'}}>*</span></td>
                        <td colSpan={3}><Input value={formData.supplier} placeholder={"请输入生产者地址"} disabled={type=='detail'?true:false} onChange={(e)=>this.changeInput(e.target.value,'supplier')}/></td>
                    </tr>
                    <tr>
                        <td style={{background:'#F2F2F2'}}>生产联系人<span style={{color:'#FF3300'}}>*</span></td>
                        <td><Input value={formData.supplier} placeholder={"请输入生产联系人"} disabled={type=='detail'?true:false} onChange={(e)=>this.changeInput(e.target.value,'supplier')}/></td>
                        <td style={{background:'#F2F2F2'}}>生产者联系电话<span style={{color:'#FF3300'}}>*</span></td>
                        <td><Input value={formData.day} placeholder={"请输入生产者联系电话"} disabled={type=='detail'?true:false} onChange={(e)=>this.changeInput(e.target.value,'day')}/></td>
                        <td style={{background:'#F2F2F2'}}>抽样单编号<span style={{color:'#FF3300'}}>*</span></td>
                        <td><Input value={formData.day} placeholder={"请输入抽样单编号"} disabled={type=='detail'?true:false} onChange={(e)=>this.changeInput(e.target.value,'day')}/></td>
                        <td style={{background:'#F2F2F2'}}>食品类别<span style={{color:'#FF3300'}}>*</span></td>
                        <td><Input value={formData.type} onClick={()=>this.setState({isVisible:true,searchType:'foodtype'})} placeholder={"请选择食品类别"} disabled={type=='detail'?true:false} suffix={<Icon type="search" />} onChange={(e)=>this.changeInput(e.target.value,'foodtype')}/></td>
                    </tr>
                    <tr>
                        <td style={{background:'#F2F2F2'}}>处置措施</td>
                        <td colSpan={8}>
                            <Row>
                                <Col span={3}>
                                    <Input value={formData.type} onClick={()=>this.setState({isVisible:true,searchType:'disposaltype'})} placeholder={"请选择处置措施"} disabled={type=='detail'?true:false} suffix={<Icon type="search" />} onChange={(e)=>this.changeInput(e.target.value,'disposaltype')}/>
                                </Col>
                                <Col span={21}>
                                    <Input value={formData.content} onChange={(e)=>this.changeInput(e.target.value,'content')}/>
                                </Col>
                            </Row>
                        </td>
                    </tr>
                    <tr>
                        <td style={{background:'#F2F2F2'}}>备注</td>
                        <td colSpan={8}><TextArea rows={5} value={formData.remark} placeholder={"请输入备注"} disabled={type=='detail'?true:false} onChange={(e)=>this.changeInput(e.target.value,"remark")}/></td>
                    </tr>
                    </tbody>
                </table>
                <Card title='附件信息' style={{marginRight:15,marginLeft:15,marginTop:30}}>
                    <Upload
                        disabled={type=='detail'?true:false}
                        name='file'
                        action={commonUrl+'/upload/uploadReport'}
                        onChange={this.handleFile}
                        fileList={formData.document}>
                        <Button>
                            <Icon type="upload" /> Click to Upload
                        </Button>
                    </Upload>
                </Card>
                <Modal footer={null}
                       width='700px'
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
                        this.changeInput(data,this.state.searchType);}} />
                </Modal>
            </div>
        );
    }
}
export default DetailForm;