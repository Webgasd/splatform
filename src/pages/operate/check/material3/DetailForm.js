import React,{Component} from 'react';
import {Card,Table,Row,Col,Icon,Input,DatePicker,Select,Radio,Form,Button,Modal,message,Upload} from "antd";

import connect from "react-redux/es/connect/connect";

import {changeMaterial,clearMaterial} from "../../../../redux/action";
import {commonUrl} from "../../../../axios/commonSrc";
import Utils from '../../../../utils';
import moment from 'moment';
import SupervisorForm from "./supervisorForm";
import SupForm from "./SupForm";
import axios from "../../../../axios";
const Option=Select.Option;
const confirm = Modal.confirm;
const ButtonGroup = Button.Group;
@connect(
    state=>({
        input:state.material
    }),
    {
        changeMaterial,
        clearMaterial
    }
)
class DetailForm extends Component {
     state={}
     changeDoubleInput = (value, option, value1, option1, value2, option2 ,value3, option3,value4, option4) => {
        let input = { ...this.props.input, [option]: value, [option1]: value1 ,[option2]: value2, [option3]: value3 ,[option4]: value4 }
        this.props.changeMaterial(input);
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
        // let additive= this.props.input||{};
        // additive[option]=value;
        let input = {...this.props.input,[option]:value}
        this.props.changeMaterial(input);
    }

    render() {
      
        const type=this.props.type;
        const item=this.props.input||{};
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
            <div>
      
                   
                    {/* <Col span={6}>
                 <th>企业名称：</th>
                <td><Input placeholder="自动生成" value={formData.enterprise} onChange={(e)=>this.changeInput(e.target.value,"enterprise")}disabled/></td>
                </Col>
                <Col span={6}>
                <th>地区：</th>
                <td><Input placeholder="自动生成" value={formData.area} onChange={(e)=>this.changeInput(e.target.value,"area")}disabled/></td>
                </Col> */}
 
           
                <Card  style={{marginRight:15,marginLeft:15,marginTop:15}}>  
       
              <div className="commonEnterpriseBox" style={{border:0,margin: 0}}>
                  
            <table >
            <tbody>
            <tr>

            <th style={{width:100}}>原料类型</th>  
           
                <td style={{width:250}}><Select value={item.originType} style={{width:"100%"}} onChange={(value)=>this.changeInput(value,"originType")} disabled={type=='detail'?true:false}>
                             <Option value="散装产品">散装产品</Option>
                            <Option value="预包装产品">预包装产品</Option>
                            </Select>
                           </td>
                           <th >备案日期</th>
                <td ><DatePicker value={item.goodsInDate=moment(item.recordTime)} onChange={(date)=>this.changeInput(date,"recordTime")}disabled={type=='detail'?true:false} format="YYYY-MM-DD"/></td>
                </tr>
                <tr>
                <th style={{width:100}}>原料名称</th>
                <td >
                <td><Input  style={{width:250}}value={item.originName} onClick={()=>this.setState({
                    isBVisible:true, personType:'originName',pType:'producer',sType:'netContent',bType:'brand',cType:'originTypeEx'})} 
                    suffix={<Icon type="search" />}disabled={type=='detail'?true:false}/></td>
                </td>
                <th style={{width:100}}>原料类别</th>
                <td><Input placeholder="自动生成" value={item.originTypeEx }disabled={type=='detail'?true:false}/></td>
                </tr>
                <tr>
                <th style={{width:100}}>生产商</th>
                <td><Input value={item.producer}  disabled={type=='detail'?true:false}/></td>
                <th>品牌</th>
                <td><Input value={item.brand} onChange={(e)=>this.changeInput(e.target.value,"brand")}disabled={type=='detail'?true:false}/></td>
            </tr>
            <tr>
            <th>净含量/规格</th>
                <td><Input value={item.netContent} onChange={(e)=>this.changeInput(e.target.value,"netContent")}disabled={type=='detail'?true:false}/></td>
                <th>生产日期</th>
                <td><DatePicker style={{width:'100%'}} value={item.produceTime=moment(item.produceTime)} onChange={(date)=>this.changeInput(date,"produceTime")}disabled={type=='detail'?true:false} format="YYYY-MM-DD"/></td>
                </tr>
            <tr>
                <th>保质期</th>
                <td >
                   
                    <Input style={{width:'80%'}}value={item.keepTime} onChange={(e)=>this.changeInput(e.target.value,"keepTime")}disabled={type=='detail'?true:false}/>
                    
                     <Input style={{width:'20%'}}value={"天"}/>
                </td>
              
                <th>有效期限</th>
                <td><DatePicker value={item.deadTime=moment(item.produceTime).add(item.keepTime,'days')} onChange={(date)=>this.changeInput(date,"deadTime")}disabled={type=='detail'?true:false} format="YYYY-MM-DD"/></td>
                
            </tr>
            <tr>
                <th>进货数量</th>
                <td><Input style={{width:'50%'}} value={item.goodsIn} placeholder='请填写数字' onChange={(e)=>this.changeInput(e.target.value,"goodsIn")}disabled={type=='detail'?true:false}/>
               <Input style={{width:'50%'}}  value={item.goodsType} onClick={()=>this.setState({isVisible:true,personType:'goodsType'})}disabled={type=='detail'?true:false} suffix={<Icon type="search" />} /></td>
               <th>供应商</th>
            <td><Input value={item.supplier} onClick={type=='detail'?(e)=>this.setState({isSupVisible:true,personType:'supplier',sup:e.target.value}):()=>this.setState({isVisible:true,personType:'supplier'})} suffix={<Icon type="search" />} /></td>
            </tr>
            <tr>  
                <th>出货数量</th>
                <td><Input  value={item.goodsOut} placeholder='数字小于进货数'  onChange={(e)=>this.changeInput(e.target.value,"goodsOut")} disabled={type=='detail'?true:false}/></td>
                <th>库存数量</th>
                <td><Input value={item.goods=item.goodsIn==undefined?0:(item.goodsOut==undefined?0:item.goodsIn-item.goodsOut)}  onChange={(e)=>this.changeInput(e.target.value,"goods")} disabled={type=='detail'?true:false}/></td>
            </tr>
            <tr>
           
                <th>索证索票</th>
                    <td><Select value={item.state}style={{width:"100%"}} onChange={(value)=>this.changeInput(value,"state")} disabled={type=='detail'?true:false}>
                             <Option value="是">是</Option>
                            <Option value="否">否</Option>
                            </Select>
                           </td>
                <th>验收人</th>
                <td><Input value={item.person}  onChange={(e)=>this.changeInput(e.target.value,"person")} disabled={type=='detail'?true:false}/></td>
            </tr>

            </tbody>
        </table>
        </div>

                         </Card>
                 <Card title='附件信息' style={{marginRight:15,marginLeft:15,marginTop:15}}>
                 
                 <div className='commonEnterpriseBox'>
                
                 <Upload
                 name='file'
                 showUploadList={false}
                 disabled={type=='detail'?true:false}
                 action={commonUrl+'/upload/uploadPicture'}
                 onChange={this.handleFile}
                 fileList={item.document}>
                 
                 <Button>
                     <Icon type="upload" />选择上传文件
                 </Button>
             </Upload>
            
            </div>
            <Table
                    columns={columns}
                    dataSource={item.document}
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
                    maskClosable={false}
                    title="选择"
                    okText={"确定"}
                    cancelText={"取消"}
                    visible={this.state.isVisible}
                    destroyOnClose
                    footer={null}
                    onCancel={()=>{

                       // this.props.clearInput();

                        this.setState({
                            isVisible:false
                        })
                    }}
                >
                    
                    <SupervisorForm 
                    dispatchSupervisor={(data)=>{
                        this.setState({isVisible:false})
                        this.changeInput(data,this.state.personType);
                      
                    }} 
                        
                        personType={this.state.personType}
                      
                        />
                        
                </Modal>
                <Modal
                    width='700px'
                    maskClosable={false}
                    title="选择"
                    okText={"确定"}
                    cancelText={"取消"}
                    visible={this.state.isBVisible}
                    destroyOnClose
                    footer={null}
                    onCancel={()=>{

                       // this.props.clearInput();

                        this.setState({
                            isBVisible:false
                        })
                    }}
                >
                    
                    <SupervisorForm 
                    dispatchSupervisor={(data1,data2,data3,data4,data5)=>{
                        this.setState({isBVisible:false})
                        this.changeDoubleInput(data1,this.state.personType,
                            data2,this.state.pType,
                            data3,this.state.sType,
                            data4,this.state.bType,
                            data5,this.state.cType
                            );
                    }} 
                        
                        personType={this.state.personType}
                      
                        />
                        
                </Modal>
                <Modal
                    width='600px'
                    maskClosable={false}
                    title="供应商信息"
                    visible={this.state.isSupVisible}
                    onOk={this.handleSubmit}
                    okText={"确定"}
                    cancelText={"取消"}
                   destroyOnClose
                    footer={null}
                    onCancel={()=>{
                       // this.props.clearInput();
                        this.setState({
                            isSupVisible:false
                        })
                    }}
                >
                   <SupForm  sup={this.state.sup} 
                        />
                </Modal>
            </div>


        );
    }

}
export default DetailForm ;