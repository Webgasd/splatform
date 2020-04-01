import React,{Component} from 'react';
import {Card,Input,DatePicker,Select,Form,message,Upload,Button,Icon,Table,Modal} from "antd";
import TextArea from 'antd/lib/input/TextArea';
import {commonUrl} from "../../../../axios/commonSrc";
import moment from 'moment';
import connect from "react-redux/es/connect/connect";
import {changeLedger,clearLedger} from "../../../../redux/action";
import Utils from './../../../../utils';
const Option=Select.Option;
const FormItem = Form.Item;
const confirm = Modal.confirm;
const ButtonGroup = Button.Group;
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
        let fileList = info.fileList;
        console.log(info)
        if (info.file.status === 'done') {
            message.success(`${info.file.name} 上传成功`);
            console.log('1')
        } else if (info.file.status === 'error') {
            message.error(`${info.file.name} 上传失败.`);
            console.log('2')
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
    // handlePreview = (info) => {
    //    // console.log(info);
    //     const fileList = info.fileList;
    //     if (info.file.status === 'done') {
    //         message.success(`${info.file.name} file uploaded successfully`);
    //     } else if (info.file.status === 'error') {
    //         message.error(`${info.file.name} 上传失败.`);
    //     }
    //     this.changeInput(fileList,"document");
    // };
    changeInput=(value,option)=>{
        let input = {...this.props.input,[option]:value}
        this.props.changeLedger(input);
    }
    render() {
        const userInfo = this.props.userInfo || {};
        let formData=this.props.input||{};
        const type=this.props.type;
        const { getFieldDecorator } = this.props.form;
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
                        <Button type="primary" size="small" onClick={()=> {this.handleFileName(index,record)}}disabled={type=='detail'?true:false}>修改名称</Button>
                        <Button type="primary" size="small" onClick={() => { this.handleFileDelete(index) }}disabled={type=='detail'?true:false}>删除</Button>
                    </ButtonGroup>


                }
            }
        ]
        return (
            <div >
                <Card  style={{marginLeft:15,marginRight:15}}>
                   
                    <Form layout="inline">    
             
               <tr>
              
                  <FormItem  label="类型" >
                      {
                          userInfo && type=='detail'?userInfo.kind:
                          getFieldDecorator('kind',{
                              initialValue:userInfo.kind,
                              rules: [
                                {
                                  required: true,
                                  message: '请选择类型',
                                }]
                          })(
                           
                            <Select style={{width:"120px"}} >
                            <Option value="原料采购">原料采购</Option>
                            <Option value="清洗消毒">清洗消毒</Option>
                            <Option value="废弃物台账">废弃物台账</Option>
                                <Option value="索证索票">索证索票</Option>

                                {/*<Option value="月度自查表">月度自查表</Option>*/}
                                {/*<Option value="自查自检">自查自检</Option>*/}
                                {/*<Option value="进货凭证">进货凭证</Option>*/}
                                {/*<Option value="消毒记录">消毒记录</Option>*/}
                                {/*<Option value="索证索票">索证索票</Option>*/}
                                {/*<Option value="原料采购">原料采购</Option>*/}
                        </Select>   
                          )
                      }
                  </FormItem>    
              
                  <FormItem label="进货日期"  >
                      {
                          userInfo && type=='detail'?moment(userInfo.purchasedate).format("YYYY-MM-DD"):
                          getFieldDecorator('purchasedate',{
                            initialValue:userInfo.purchasedate===''?moment():moment(userInfo.purchasedate)
                              
                          })(
                              <DatePicker style={{width:"150px"}}  format="YYYY-MM-DD" disabledDate={this.disabledDate}/>
                               
                          )
                      }
                  </FormItem>  
                
              
                  <FormItem label="操作人" >
                      { userInfo && type=='detail'?userInfo.acceptor:
                          getFieldDecorator('acceptor',{
                              initialValue:userInfo.acceptor,
                              rules: [
                                {
                                  required: true,
                                  message: '请输入操作人',
                                }]
                          })(
                            <Input  style={{width:"160px"}} type="text" />
                    )
                      }
                  </FormItem> 
                  </tr>          
                  <FormItem  style={{marginTop:15,marginLeft:8}} label="说明">
                      {
                          userInfo && type=='detail'?userInfo.extra:
                          getFieldDecorator('extra',{
                              initialValue:userInfo.extra
                          })(
                              
                              <TextArea style={{width:"600px",height:"100px"}}/>
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
                 
                            <div className='commonEnterpriseBox'>
                           
                            <Upload
                            name='file'
                            disabled={type=='detail'?true:false}
                            action={commonUrl+'/upload/uploadPicture'}
                            onChange={this.handleFile}
                            fileList={formData.document}
                            showUploadList={false}
                            // thumbUrl={commonUrl+'downlodFile'}
                            // onPreview={this.handlePreview}
                            >
                            
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
            </div>


        );
    }

}
export default DetailForm = Form.create({})(DetailForm);