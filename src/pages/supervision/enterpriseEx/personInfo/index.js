import React,{Component} from 'react';
import {Select,Input,Table,Modal} from 'antd';
import connect from "react-redux/es/connect/connect";
import {changeEnterprise} from "../../../../redux/action";
import AddForm from './Add'

const Option = Select.Option;
const { TextArea } = Input;
@connect(
    state=>({
        input:state.enterprise
    }),
    {
        changeEnterprise,
    }
)
class PersonInfo extends Component{
    changeInput=(value,option)=>{
        let input = {...this.props.input,[option]:value}
        this.props.changeEnterprise(input);
    }
    render() {
        const formData=this.props.input||{};
        const columns1 = [
            {
                title: '姓名',
                dataIndex: ''
            }, {
                title: '性别',
                dataIndex: ''
            },{
                title: '健康证号',
                dataIndex: ''
            }, 
            {
                title: '健康证有效期限',
                dataIndex: ''
            }, 
            {
                title: '操作',
                dataIndex:'operation',
                render:(text, record)=>{
                    return <div className='textButton' onClick={() => { this.handleOperator('detail',record)}}>查看详情</div>
                }
            }
        ]
        const columns2 = [
            {
                title: '姓名',
                dataIndex: ''
            }, {
                title: '作业种类',
                dataIndex: ''
            },{
                title: '证书编号',
                dataIndex: ''
            }, 
            {
                title: '有效期限',
                dataIndex: ''
            }, 
            {
                title: '操作',
                dataIndex:'operation',
                render:(text, record)=>{
                    return <div className='textButton' onClick={() => { this.handleOperator('detail',record)}}>查看详情</div>
                }
            }
        ]
        
    return (
        <div>
            <div className='commonEnterpriseBox' style={{marginTop:20}}>
                <div className='permission-title-text'>企业人员信息</div>
                <Table columns={columns1}  />
            </div>
            <div className='commonEnterpriseBox' style={{marginTop:20}}>
                <div className='permission-title-text'>企业人员信息</div>
                <Table columns={columns2}  />
            </div>
            {/* <Modal
                    title={this.state.title}
                    visible={this.state.isVisible}
                    onOk={this.handleSubmit}
                    okText="确定"
                    cancelText="取消"
                    maskClosable={false}
                    getContainer={()=>this.refs.employee}
                    footer={this.state.type=='detail'?null:React.ReactNode}
                    destroyOnClose
                    width={1000}
                    onCancel={()=>{
                        this.props.clearEmployee();
                        this.setState({
                            isVisible:false,
                            userInfo:''
                        })
                    }}
                >
                    <AddForm type={this.state.type} workTypeList={this.state.workTypeList||[]} industryList={this.props.industryList||[]}/>
                </Modal> */}
    </div>
        
    )
    }
}
export default PersonInfo;

