import React,{Component} from 'react';
import {Card,Table,Input,DatePicker,Select,Form,message,Upload,Button,Icon,Modal} from "antd";
import TextArea from 'antd/lib/input/TextArea';
import SupervisorForm from "./supervisorForm";
import {commonUrl} from "../../../../axios/commonSrc";
import moment from 'moment';
import connect from "react-redux/es/connect/connect";
import Utils from './../../../../utils';
import {changeLedger,clearLedger} from "../../../../redux/action";
const Option=Select.Option;
const confirm = Modal.confirm;
const ButtonGroup = Button.Group;
const FormItem = Form.Item;
@connect(
    state=>({
        input:state.ledger
    }),{
        clearLedger,
        changeLedger
    }
)
 class DetailForm extends Component {
     state={}
    disabledDate = (current) => {
        return current > moment();
    };
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
        this.props.changeLedger(input);
    }
    render() {
        const userInfo = this.props.userInfo || {};
        const formData=this.props.input||{};
        const type=this.props.type;
        const { getFieldDecorator } = this.props.form;
        const formItemLayout = {
            labelCol: {span: 7},
            wrapperCol: {span: 14}
        };
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
            <div >
                <Card  style={{marginLeft:15,marginRight:15}}>
                   
                    <Form layout="inline">    
                     <div style={{marginLeft:15}}>
                     <FormItem  label="企业名称" >
                      {
                          userInfo && type=='detail'?userInfo.enterprise:
                          getFieldDecorator('enterprise',{
                              initialValue:userInfo.enterprise
                          })(
                              
                            <Input type="text" style={{width:"100px"}}/>
                          )
                      }
                  </FormItem>   
                  <FormItem  label="类型" >
                      {
                          userInfo && type=='detail'?userInfo.kind:
                          getFieldDecorator('kind',{
                              initialValue:userInfo.kind
                          })(
                              
                            <Select style={{width:"100px"}} >
                                <Option value="电梯">电梯</Option>
                                <Option value="锅炉">锅炉</Option>
                                <Option value="压力容器">压力容器</Option>
                                <Option value="压力管道">压力管道</Option>
                                <Option value="起重机械">起重机械</Option>
                                <Option value="客运索道">客运索道</Option>
                                <Option value="大型游乐设施">大型游乐设施</Option>
                                <Option value="场（厂）内专用机动车辆">场（厂）内专用机动车辆</Option>
                        </Select>   
                          )
                      }
                  </FormItem>    
                         
                  <FormItem label="录入日期" >
                      {
                          userInfo && type=='detail'?moment(userInfo.purchasedate).format("YYYY-MM-DD"):
                          getFieldDecorator('purchasedate',{
                            initialValue:userInfo.purchasedate===''?moment():moment(userInfo.purchasedate)
                              
                          })(
                              <DatePicker  showTime format="YYYY-MM-DD" disabledDate={this.disabledDate}/>
                               
                          )
                      }
                  </FormItem>                          
                  <FormItem label="操作人" >
                      {
                      <td ><Input value={formData.acceptor} disabled={type=='detail'?true:false} onClick={()=>this.setState({isVisible:true,personType:'acceptor'})} placeholder={"请选择企业人员"} suffix={<Icon type="search" />}/></td>
                      }
                  </FormItem>  
                  </div>
                  <tr>
                  <div style={{marginLeft:15,marginTop:15}}>
                  <FormItem  label="说明">
                      {
                          userInfo && type=='detail'?userInfo.extra:
                          getFieldDecorator('extra',{
                              initialValue:userInfo.extra
                          })(
                              
                              <TextArea style={{width:"500px",height:"70px"}}/>
                          )
                      }
                  </FormItem>  
                  </div>       
                  <FormItem {...formItemLayout}>
                      {
                        
                          getFieldDecorator('id',{
                              initialValue:userInfo.id
                          })(
                              <Input type="hidden" />
                          )
                      }
                  </FormItem>            
                 </tr>
                  </Form>   
                    
                </Card>
                <Card title='附件信息' style={{marginRight:15,marginLeft:15,marginTop:15}}>
                 
                            <div className='commonEnterpriseBox'>
                           
                            <Upload
                            name='file'
                            disabled={type=='detail'?true:false}
                            showUploadList={false}
                            action={commonUrl+'/upload/uploadPicture'}
                            onChange={this.handleFile}
                            fileList={formData.document}>
                            
                            <Button>
                                <Icon type="upload" /> 选择上传文件
                            </Button>
                        </Upload>
                       
                       </div>
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
                    width='700px'
                    title="监管人员信息列表"
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
                        this.changeInput(data,this.state.personType);}} />
                        
                </Modal>
            </div>


        );
    }

}
export default DetailForm = Form.create({})(DetailForm);