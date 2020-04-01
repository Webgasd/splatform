import React,{Component} from 'react';
import {Card, Input, Button, Icon, Select, Upload, DatePicker, message, Table, Modal} from "antd";
import {commonUrl} from "../../../../axios/commonSrc";
import {connect} from 'react-redux'
import {changeParty} from "../../../../redux/action";
import moment from "moment";
import Utils from "../../../../utils";

const Option=Select.Option;
const ButtonGroup = Button.Group;
@connect(
    state=>({
        input:state.party
    }),
    {
        changeParty,
    }
)
class DetailForm extends Component{
    state={
        selectedRowKeys: [], // Check here to configure the default column
    }
    changeInput=(value,option)=>{
        let input = {...this.props.input,[option]:value}
        this.props.changeParty(input);
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

    changeList=(value,option,index)=>{
        let list = this.props.input.list||[];
        list[index][option]=value;
        let input = {...this.props.input,list}
        this.props.changeParty(input);
    }
    plusList=()=>{
        let list = this.props.input.list||[];
        list.push({});
        let input = {...this.props.input,list}
        this.props.changeParty(input);
    }
    cutList=()=>{
        let list = this.props.input.list||[];
        list.pop();
        let input = {...this.props.input,list}
        this.props.changeParty(input);
    }
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
    render(){
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
                            <tr>
                                <td style={{background:'#F2F2F2',width:'10%'}}>备案号：</td>
                                <td style={{width:'29%'}}><Input placeholder={"请输入备案号"} value={formData.record} disabled={type=='detail'?true:false} onChange={(e)=>this.changeInput(e.target.value,'record')}/></td>
                                <td style={{background:'#F2F2F2',width:'11%'}}>申报人：</td>
                                <td style={{width:'50%'}}><Input placeholder={"请输入申报人"} value={formData.person} disabled={type=='detail'?true:false} onChange={(e)=>this.changeInput(e.target.value,'person')}/></td>
                            </tr>
                            </tbody>
                        </table>
                    </div>
                    <div className='commonEnterpriseBox'>
                        <table style={{marginTop:10}}>
                            <tr>
                                <th>序号</th>
                                <th>聚餐时间</th>
                                <th>餐次</th>
                                <th>桌数</th>
                                <th>登记日期</th>
                                <th>登记人</th>
                                <th>联系电话</th>
                                <th>留样状态</th>
                            </tr>
                            {list.map((item,index)=>(
                                <tr>
                                    <td><Input value={index==0?item.seq=1:item.seq=index+1} onChange={(e)=>this.changeList(e.target.value,"seq",index)} disabled={type=='detail'?true:false}/></td>
                                    <td>
                                        <DatePicker style={{minWidth:115}}
                                    disabled={type=='detail'?true:false}
                                    value={item.time1=moment(item.time1)}
                                    onChange={(date)=>this.changeList(date,"time1",index)}
                                    showTime={true} format="YYYY-MM-DD" disabledDate={this.disabledDate}/>
                                    </td>
                                    <td style={{width:"100px"}}>
                                        <Select value={item.meal} style={{width:"100%"}} onChange={(value)=>this.changeList(value,"meal",index)}>
                                            <Option value="早餐" disabled={type=='detail'?true:false}>早餐</Option>
                                            <Option value="午餐" disabled={type=='detail'?true:false}>午餐</Option>
                                            <Option value="晚餐" disabled={type=='detail'?true:false}>晚餐</Option>
                                        </Select>
                                    </td>
                                    <td><Input value={item.num} onChange={(e)=>this.changeList(e.target.value,"num",index)} disabled={type=='detail'?true:false}/></td>
                                    <td>
                                        <DatePicker style={{minWidth:115}}
                                                    disabled={type=='detail'?true:false}
                                                    value={item.date=moment(item.date)}
                                                    onChange={(date)=>this.changeList(date,"date",index)}
                                                    showTime={true} format="YYYY-MM-DD" disabledDate={this.disabledDate}/>
                                    </td>
                                    <td><Input value={item.person1} onChange={(e)=>this.changeList(e.target.value,"person1",index)} disabled={type=='detail'?true:false}/></td>
                                    <td><Input value={item.phone} onChange={(e)=>this.changeList(e.target.value,"phone",index)} disabled={type=='detail'?true:false}/></td>
                                    <td  style={{width:"80px"}}>
                                        <Select value={item.state} style={{width:"100%"}} onChange={(value)=>this.changeList(value,"state",index)}>
                                            <Option value="是" disabled={type=='detail'?true:false}>是</Option>
                                            <Option value="否" disabled={type=='detail'?true:false}>否</Option>
                                        </Select>
                                    </td>
                                </tr>
                            ))}

                        </table>
                    </div>
                    <div style={{marginTop:10}}>
                        <Button type="primary" onClick={this.plusList} icon='plus' disabled={type=='detail'?true:false}/>
                        <Button type="primary" style={{marginLeft:5}} onClick={this.cutList} icon='minus' disabled={type=='detail'?true:false}/>
                    </div>
                    <div className='commonEnterpriseBox' style={{marginTop:10}}>
                    <table>
                        <tbody>
                        <tr>
                            <td style={{background:'#F2F2F2',width:'80px',height:'120px'}}>说明：</td>
                            <td style={{background:'#f2f2f2',width:'600px',height:'120px'}}>
                                <div style={{float:'left'}}>1.本表由餐饮单位食品安全员如实填写。</div>
                                <div style={{float:'left'}}>2.凡承办超过100人的一次性集体聚餐的须到辖区食品药品监督管理部门进行备案登记。</div>
                                <div style={{float:'left'}}>3.餐饮单位应于每月25日前报送下月集体聚餐预定情况，遇临时预定的须于聚餐三天前进行备案。</div>
                                <div style={{float:'left'}}>4.辖区食品药品监管部门应认真审核把关并加强聚餐单位的监管。</div>
                            </td>
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
                    </div>
                </Card>
            </div>
        );
    }
}
export default DetailForm;