import React,{Component} from 'react';
import {Card,Col,Row,Table,Input,DatePicker,Select,Form,message,Upload,Button,Icon,Modal} from "antd";
import TextArea from 'antd/lib/input/TextArea';
import {commonUrl} from "../../../../axios/commonSrc";
import moment from 'moment';
import connect from "react-redux/es/connect/connect";
import {changeCquick,clearCquick} from "../../../../redux/action";
import SupervisorForm from "./supervisorForm";
import Utils from './../../../../utils';
const confirm = Modal.confirm;
const ButtonGroup = Button.Group;
const FormItem = Form.Item;
@connect(
    state=>({
        input:state.cquick
    }),{
        clearCquick,
        changeCquick
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
        this.props.changeCquick(input);
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
                   
                    <Form>                
              <FormItem label="检测机构全称"  {...formItemLayout}>
                      {
                          getFieldDecorator('enterpriseName',{
                            initialValue:userInfo.enterpriseName,
                            rules: [
                                {
                                  required: true,
                                  message: 'Please input!',
                                }]
                              
                          })(
                            <Input disabled={type=='detail'?true:false} />
                               
                          )
                      }
                  </FormItem>      
                  <FormItem label="简称"  {...formItemLayout}>
                      {
                        
                          getFieldDecorator('enterpriseNickname',{
                            initialValue:userInfo.enterpriseNickname
                              
                          })(
                            <Input disabled={type=='detail'?true:false}/>
                               
                          )
                      }
                  </FormItem>              
                  <FormItem label="社会信用代码证" {...formItemLayout}>
                      { 
                          getFieldDecorator('number',{
                              initialValue:userInfo.number,
                              rules: [
                                {
                                  required: true,
                                  message: 'Please input!',
                                }]
                          })(
                   <Input  disabled={type=='detail'?true:false}/>
                  
                          )}
                  </FormItem> 
                  <FormItem label="注册地址"  {...formItemLayout}>
                      {
                        
                          getFieldDecorator('address',{
                            initialValue:userInfo.address
                              
                          })(
                            <Input disabled={type=='detail'?true:false}/>
                               
                          )
                      }
                  </FormItem>         
                  <FormItem label="负责人" {...formItemLayout}>
                      { 
                          getFieldDecorator('enterpriseCharger',{
                              initialValue:userInfo.enterpriseCharger,
                              rules: [
                                {
                                  required: true,
                                  message: 'Please input!',
                                }]
                          })(
                   <Input  disabled={type=='detail'?true:false} />
                  
                          )}
                  </FormItem> 
                  <FormItem label="联系方式" {...formItemLayout}>
                      { 
                          getFieldDecorator('phone',{
                              initialValue:userInfo.phone,
                              rules: [
                                {
                                  required: true,
                                  message: 'Please input!',
                                }]
                          })(
                   <Input  disabled={type=='detail'?true:false}/>
                  
                          )}
                  </FormItem> 
                  <FormItem label={type=='create'?"区域":""} {...formItemLayout} >
                      { getFieldDecorator('area',{
                              initialValue:formData.area,
                          })(
                      <Input 
                       type={type=='create'?'':"hidden"} 
                      onClick={()=>this.setState({isVisible:true,personType:'area'})} 
                      placeholder={"请选择"} />)
                      }
                  </FormItem> 
                  <FormItem  {...formItemLayout} label="备注">
                      {
                          
                          getFieldDecorator('remark',{
                              initialValue:userInfo.remark
                          })(
                              
                              <TextArea style={{height:"100px"}}  disabled={type=='detail'?true:false}/>
                          )
                      }
                  </FormItem>  
       
                  <FormItem >
                      {
                        
                          getFieldDecorator('id',{
                              initialValue:userInfo.id
                          })(
                              <Input type="hidden" />
                          )
                      }
                  </FormItem>            

               
                  </Form>   
                    
                </Card>
                <Card title='附件信息' style={{marginRight:15,marginLeft:15,marginTop:15}}>
                 
                          
                            <Upload
                            name='file'
                            disabled={type=='detail'?true:false}
                            action={commonUrl+'/upload/uploadPicture'}
                            onChange={this.handleFile}
                            fileList={formData.document}
                            showUploadList={false}
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
                    width='700px'
                    title="请选择"
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