import React,{Component} from 'react';
import {Button, Card, DatePicker, Form, Icon, Input, message, Modal, Select, Table, Upload} from "antd";
import {connect} from 'react-redux'
import {changeSimple} from "../../../../redux/action";
import {commonUrl} from "../../../../axios/commonSrc";
import moment from "moment";
import ListForm from "./ListForm";
import Utils from "../../../../utils";

const Option=Select.Option;
const ButtonGroup = Button.Group;
@connect(
    state=>({
        input:state.simple
    }),
    {
        changeSimple,
    }
)
class DetailForm extends Component{
    state={
        selectedRowKeys: [],
        msgIndex:0
    }
    changeMsgIndex(index){
        this.setState({
            msgIndex:index
        })
    }
    changeInput=(value,option)=>{
        let input = {...this.props.input,[option]:value}
        this.props.changeSimple(input);
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

render(){
    const type=this.props.type;
    const formData = this.props.input || {};
    const list1 = this.props.input.list1 || [];
    const list2 = this.props.input.list2 || [];
    const list3 = this.props.input.list3 || [];
    const list4 = this.props.input.list4 || [];
    const list5 = this.props.input.list5 || [];
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
        <div>
            <Card>
                <div className='commonEnterpriseBox'>
                    <table>
                        <tbody>
                        {/*<tr>*/}
                            {/*<td style={{background:'#F2F2F2'}}>企业名称<span style={{color:'#FF3300'}}>*</span></td>*/}
                            {/*<td><Input value={formData.enterpriseName} disabled={type=='detail'?true:false}/></td>*/}
                            {/*<td style={{background:'#F2F2F2'}}>所属区域<span style={{color:'#FF3300'}}>*</span></td>*/}
                            {/*<td ><Input value={formData.areaName} disabled={type=='detail'?true:false}/></td>*/}
                        {/*</tr>*/}
                        <tr>
                            <td style={{background:'#F2F2F2',width:55}}>就餐类型<span style={{color:'#FF3300'}}>*</span></td>
                            <td style={{width:105}}><Input value={formData.type} disabled={type=='detail'?true:false} onChange={(e)=>this.changeInput(e.target.value,'type')}/></td>
                            <td style={{background:'#F2F2F2',width:55}}>就餐日期<span style={{color:'#FF3300'}}>*</span></td>
                            <td style={{width:105}}>
                                <DatePicker style={{width:'100%'}}
                                            disabled={type=='detail'?true:false}
                                            value={formData.date===''?moment():moment(formData.date)}
                                            onChange={(date)=>this.changeInput(date,'date')}
                                            showTime={true} format="YYYY-MM-DD" disabledDate={this.disabledDate}/></td>
                            <td style={{background:'#F2F2F2',width:40}}>餐次<span style={{color:'#FF3300'}}>*</span></td>
                            <td style={{width:80}}>
                                <Select value={formData.meal} style={{width:"100%"}} onChange={(value)=>this.changeInput(value,"meal")}>
                                    <Option value="早餐" disabled={type=='detail'?true:false}>早餐</Option>
                                    <Option value="午餐" disabled={type=='detail'?true:false}>午餐</Option>
                                    <Option value="晚餐" disabled={type=='detail'?true:false}>晚餐</Option>
                                </Select>
                            </td>
                        </tr>
                        <tr>
                            <td style={{background:'#F2F2F2',width:55}}>事项<span style={{color:'#FF3300'}}>*</span></td>
                            <td style={{width:105}}><Input value={formData.matter} disabled={type=='detail'?true:false} onChange={(e)=>this.changeInput(e.target.value,'matter')}/></td>
                            <td style={{background:'#F2F2F2',width:55}}>就餐人数<span style={{color:'#FF3300'}}>*</span></td>
                            <td style={{width:105}}><Input value={formData.number} disabled={type=='detail'?true:false} onChange={(e)=>this.changeInput(e.target.value,'number')}/></td>
                        </tr>
                        </tbody>
                    </table>
                    <Form layout="inline">
                        <div className='msgIndexBox'>
                            <div className={this.state.msgIndex === 0?'msgIndex showIndex':'msgIndex'} onClick={this.changeMsgIndex.bind(this,0)}>主菜</div>
                            <div className={this.state.msgIndex === 1?'msgIndex showIndex':'msgIndex'} onClick={this.changeMsgIndex.bind(this,1)}>凉菜</div>
                            <div className={this.state.msgIndex === 2?'msgIndex showIndex':'msgIndex'} onClick={this.changeMsgIndex.bind(this,2)}>主食</div>
                            <div className={this.state.msgIndex === 3?'msgIndex showIndex':'msgIndex'} onClick={this.changeMsgIndex.bind(this,3)}>汤</div>
                            <div className={this.state.msgIndex === 4?'msgIndex showIndex':'msgIndex'} onClick={this.changeMsgIndex.bind(this,4)}>水果</div>
                        </div>
                        <div className='msgChange'>
                            <div className='commonEnterpriseBox' style={{display:this.state.msgIndex === 0?'block':'none'}}>
                                <ListForm listType={list4} type={type}/>
                            </div>
                            <div className='commonEnterpriseBox' style={{display:this.state.msgIndex === 1?'block':'none'}}>
                                <ListForm listType={list1} type={type}/>
                            </div>
                            <div className='commonEnterpriseBox' style={{display:this.state.msgIndex === 2?'block':'none'}}>
                                <ListForm listType={list3} type={type}/>
                            </div>
                            <div className='commonEnterpriseBox' style={{display:this.state.msgIndex === 3?'block':'none'}}>
                                <ListForm listType={list5} type={type}/>
                            </div>
                            <div className='commonEnterpriseBox' style={{display:this.state.msgIndex === 4?'block':'none'}}>
                                <ListForm listType={list2} type={type}/>
                            </div>
                        </div>
                    </Form>
                    <table>
                        <body>
                        <tr>
                            <td style={{width:112}}>附件信息</td>
                            <td style={{width:605}}><Upload
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
                        </body>
                    </table>
                    <Table
                        style={{marginTop:10}}
                        columns={columns}
                        dataSource={formData.document}
                        pagination={false}
                    />
                </div>
            </Card>
            <Modal visible={previewVisible} footer={null} onCancel={this.handleCancel}>
                <img alt="example" style={{ width: '100%' }} src={commonUrl+'/upload/picture/'+previewImage} />
            </Modal>
            <Modal visible={modifyVisible} onOk={this.handleFileNameSubmit} okText='确定' cancelText='取消' onCancel={this.handleFileNameCancel}>
                <Input onChange={(e)=>this.changeFileName(e.target.value)} value={this.state.handleFileName}/>
            </Modal>
        </div>
    );
}
}
export default DetailForm;