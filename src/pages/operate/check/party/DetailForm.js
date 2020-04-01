import React,{Component} from 'react';
import {Card, Input, Button, Icon, Select, Upload, DatePicker, Table, Modal} from "antd";
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
                                <td style={{width:'29%'}}><Input value={formData.record} disabled/></td>
                                <td style={{background:'#F2F2F2',width:'11%'}}>申报人：</td>
                                <td style={{width:'50%'}}><Input value={formData.person} disabled/></td>
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
                                    <td><Input value={item.seq} disabled/></td>
                                    <td>
                                        <DatePicker style={{minWidth:115}}
                                                    disabled
                                                    value={item.time1===''?moment():moment(item.time1)}
                                                    showTime={true} format="YYYY-MM-DD"/>
                                    </td>
                                    <td><Input value={item.meal} disabled/></td>
                                    <td><Input value={item.num} disabled/></td>
                                    <td>
                                        <DatePicker style={{minWidth:115}}
                                                    disabled
                                                    value={item.date===''?moment():moment(item.date)}
                                                    showTime={true} format="YYYY-MM-DD" disabledDate={this.disabledDate}/>
                                    </td>
                                    <td><Input value={item.person1} disabled/></td>
                                    <td><Input value={item.phone} disabled/></td>
                                    <td>
                                        <Select value={item.state} style={{width:"100%"}}>
                                            <Option value="是" disabled>是</Option>
                                            <Option value="否" disabled>否</Option>
                                        </Select>
                                    </td>
                                </tr>
                            ))}

                        </table>
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