import React,{Component} from 'react';
import {Card,Row,Col,Icon,Input,DatePicker,Select,Button,Modal,message,Upload,Table} from "antd";
import './style.less'
import connect from "react-redux/es/connect/connect";
import {changeMaterial,clearMaterial} from "../../../../redux/action";
import {commonUrl} from "../../../../axios/commonSrc";
import Utils from './../../../../utils';
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
        this.props.changeMaterial(input);
    }
    changeList=(value,option,index)=>{
        let additive = this.props.input||{};
        let list = additive.list||[];
        list[index][option]=value;
        additive.list=list;
        let input = {...this.props.input,additive}
        this.props.changeMaterial(input);
    }
    plusList=()=>{
        let additive = this.props.input||{};
        let list = additive.list||[];
        list.push({});
        additive.list=list;
        let input = {...this.props.input,additive}
        this.props.changeMaterial(input);
    }
    cutList=()=>{
        let additive = this.props.input||{};
        let list = additive.list||[];
        list.pop();
        additive.list=list;
        let input = {...this.props.input,additive}
        this.props.changeMaterial(input);
    }
    
    render() {
      
        const type=this.props.type;
        const formData=this.props.input||{};
      
        const list = formData.list||[];
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
                    </ButtonGroup>


                }
            }
        ]
        return (
            <div>
                <div style={{marginLeft:40}}>
                    <Row>
                <Col span={6}>
                <th>登记时间：</th>               
                <td>
                <DatePicker style={{width:'100%'}}
                        disabled={type=='detail'?true:false}
                                        value={formData.giveTime===''?moment():moment(formData.recordTime)}
                                        onChange={(date)=>this.changeInput(date,'recordTime')}
                                          format="YYYY-MM-DD"/>
                </td>
                </Col>
                </Row>
                </div>
               <div style={{marginTop:10,marginLeft:20}}>
                    <Button type="primary" onClick={this.plusList} disabled={type=='detail'?true:false} icon='plus'/>
                    <Button type="primary" style={{marginLeft:10}} disabled={type=='detail'?true:false} onClick={this.cutList} icon='minus'/>
                </div>
                <Card  style={{marginRight:15,marginLeft:15,marginTop:15}}>  
                <div className="commonEnterpriseBox" style={{border:0, fontSize:12,margin:0}}>
                <table >
            <tbody>   
              <tr>
              <th style={{width:60,fontSize:15}}>序号</th>
              <th style={{fontSize:15}}>索证索票内容</th>
              </tr>
              </tbody>  
              </table>
              </div>  
        {list.map((item,index)=>(
       
              <div className="commonEnterpriseBox" style={{border:0,margin: 0}}>
                  
            <table >
            <tbody>
            <tr>
            <td rowSpan={4} style={{width:60}}>
           <td> <Input value={index==0?item.seq=1:item.seq=index+1} onChange={(e)=>this.changeList(e.target.value,"seq",index)} disabled={type=='detail'?true:false}/></td>
            </td>
            <th style={{width:60}}>原料类型</th>  
           
                <td><Select value={item.originType1} style={{width:"100%"}} onChange={(value)=>this.changeList(value,"originType1",index)} disabled={type=='detail'?true:false}>
                             <Option value="散装产品">散装产品</Option>
                            <Option value="预包装产品">预包装产品</Option>
                            </Select>
                           </td>
                <th style={{width:60}}>原料名称</th>
                <td >
                <td><Input value={item.originName} onClick={()=>this.setState({
                    isBVisible:true, personType:'originName',pType:'produceName',sType:'produceSpecifications',bType:'produceBrand',cType:'originType2',index})} 
                    suffix={<Icon type="search" />}disabled={type=='detail'?true:false}/></td>
                </td>
                <th style={{width:60}}>原料类别</th>
                <td><Input placeholder="自动生成" value={item.originType2 }disabled={type=='detail'?true:false}/></td>
                <th style={{width:60}}>生产商</th>
                <td><Input value={item.produceName}  disabled={type=='detail'?true:false}/></td>
                <th>品牌</th>
                <td><Input value={item.produceBrand} onChange={(e)=>this.changeList(e.target.value,"produceBrand",index)}disabled={type=='detail'?true:false}/></td>
            </tr>
            <tr>
                <th style={{height:55}}>进货日期</th>
                <td ><DatePicker value={item.goodsInDate=moment(item.goodsInDate)} onChange={(date)=>this.changeList(date,"goodsInDate",index)}disabled={type=='detail'?true:false} format="YYYY-MM-DD"/></td>
                <th>生产日期</th>
                <td><DatePicker value={item.produceDate=moment(item.produceDate)} onChange={(date)=>this.changeList(date,"produceDate",index)}disabled={type=='detail'?true:false} format="YYYY-MM-DD"/></td>
           
                <th>保质期</th>
                <td >
                   
                    <Input style={{width:80}}value={item.produceSaveTime} onChange={(e)=>this.changeList(e.target.value,"produceSaveTime",index)}disabled={type=='detail'?true:false}/>
                    
                     <Input style={{width:40}}value={"天"}/>
                </td>
              
                <th>有效期限</th>
                <td><DatePicker value={item.deadDate=moment(item.produceDate).add(item.produceSaveTime,'days')} onChange={(date)=>this.changeList(date,"deadDate",index)}disabled={type=='detail'?true:false} format="YYYY-MM-DD"/></td>
                <th>净含量/规格</th>
                <td><Input value={item.produceSpecifications} onChange={(e)=>this.changeList(e.target.value,"produceSpecifications",index)}disabled={type=='detail'?true:false}/></td>
            </tr>
            <tr>
                <th>进货数量</th>
                <td><Input  value={item.goodsIn} onChange={(e)=>this.changeList(e.target.value,"goodsIn",index)}disabled={type=='detail'?true:false}/></td>

                <th>进货计量单位</th>
               <td ><Input value={item.goodsInType} onClick={()=>this.setState({isVisible:true,personType:'goodsInType',index})}disabled={type=='detail'?true:false} suffix={<Icon type="search" />} /></td>
                <th>出货数量</th>
                <td><Input  value={item.goodsOut}  onChange={(e)=>this.changeList(e.target.value,"goodsOut",index)} disabled={type=='detail'?true:false}/></td>
                <th>库存数量</th>
                <td><Input value={item.goods=item.goodsIn==undefined?"自动计算":(item.goodsOut==undefined?"自动计算":item.goodsIn-item.goodsOut)}  onChange={(e)=>this.changeList(e.target.value,"goods",index)} disabled={type=='detail'?true:false}/></td>
            </tr>
            <tr>
            <th>供应商</th>
            <td colSpan={3}><Input value={item.supplier} onClick={type=='detail'?(e)=>this.setState({isSupVisible:true,personType:'person',sup:e.target.value,index}):()=>this.setState({isVisible:true,personType:'supplier',index})} suffix={<Icon type="search" />} /></td>
                <th>索证索票</th>
                    <td><Select value={item.recordGive}style={{width:"100%"}} onChange={(value)=>this.changeList(value,"recordGive",index)} disabled={type=='detail'?true:false}>
                             <Option value="是">是</Option>
                            <Option value="否">否</Option>
                            </Select>
                           </td>
                <th>验收人</th>
                <td><Input value={item.person} onClick={()=>this.setState({isVisible:true,personType:'person',index})} suffix={<Icon type="search" />}disabled={type=='detail'?true:false}/></td>
            </tr>
            </tbody>
        </table>
        </div>                
                    ))}
                         </Card>
                 <Card title='附件信息' style={{marginRight:15,marginLeft:15,marginTop:15}}>
                 
                 <div className='commonEnterpriseBox'>
                
                 <Upload
                 name='file'
                 showUploadList={false}
                 disabled={type=='detail'?true:false}
                 action={commonUrl+'/upload/uploadPicture'}
                 onChange={this.handleFile}
                 fileList={formData.document}>
                 
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
            </div>
     
            </Card>
                    <Modal
                    width='700px'

                    title="选择"

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
                        this.changeList(data,this.state.personType,this.state.index);
                      
                    }} 
                        
                        personType={this.state.personType}
                      
                        />
                        
                </Modal>
                <Modal
                    width='700px'

                    title="选择"

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
                        this.changeList(data1,this.state.personType,this.state.index);
                        this.changeList(data2,this.state.pType,this.state.index);
                        this.changeList(data3,this.state.sType,this.state.index);
                        this.changeList(data4,this.state.bType,this.state.index);                     
                        this.changeList(data5,this.state.cType,this.state.index);
                    }} 
                        
                        personType={this.state.personType}
                      
                        />
                        
                </Modal>
                <Modal
                    width='600px'
                    title="供应商信息"
                    visible={this.state.isSupVisible}
                    onOk={this.handleSubmit}
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