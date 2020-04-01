import React,{Component} from 'react';
import {Form, Select, Input, TreeSelect, Modal} from 'antd';
import EnPersonForm from "../../../components/CommonForm/enPersonForm";
import EnterpriseForm from "../../../components/CommonForm/EnterpriseForm";
import GaPersonForm from "../../../components/CommonForm/gaPersonForm";

const FormItem = Form.Item;
const Option = Select.Option;
const TreeNode = TreeSelect.TreeNode;

class UserForm extends Component{
    state={}
    renderTreeNodes = (data) => {
        return data.map((item) => {
            if (item.childrenList) {
                return (
                    <TreeNode value={item.id} title={item.name} key={item.id}>
                        {this.renderTreeNodes(item.childrenList)}
                    </TreeNode>
                );
            } else {
                return (
                    <TreeNode value={item.id} title={item.name} key={item.id}/>
                );
            }
        });
    };
    showModal=()=>{
        let type =this.props.form.getFieldValue('userType');
        if(type==1){
            this.setState({isEnVisible:true})
        } else if(type==2){
            this.setState({isGaPersonVisible:true})
        }else if(type==3){
            this.setState({isEnPersonVisible:true})
        }

    }

    render(){
        const { getFieldDecorator } = this.props.form;
        const userInfo = this.props.userInfo || {};
        const formItemLayout = {
            labelCol: {span: 6},
            wrapperCol: {span: 13}
        };
        return (

            <Form layout="horizontal">
                <FormItem label="用户名" {...formItemLayout}>
                    {
                        getFieldDecorator('username',{
                            initialValue:userInfo.username
                        })(
                            <Input type="text" placeholder="请输入用户名"/>
                        )
                    }
                </FormItem>
                <FormItem label="账号" {...formItemLayout}>
                    {
                        getFieldDecorator('loginName',{
                            initialValue:userInfo.loginName
                        })(
                            <Input type="text" placeholder="请输入账号"/>
                        )
                    }
                </FormItem>
                {/*<FormItem label="选择区域" {...formItemLayout}>*/}
                    {/*{*/}
                        {/*getFieldDecorator('userArea',{*/}
                            {/*initialValue:userInfo.userArea*/}
                        {/*})(*/}
                            {/*<Select>*/}
                                {/*<Option value={1}>A街道</Option>*/}
                                {/*<Option value={0}>B街道</Option>*/}
                            {/*</Select>*/}
                        {/*)*/}
                    {/*}*/}
                {/*</FormItem>*/}
                <FormItem label="用户类型" {...formItemLayout}>
                    {
                        getFieldDecorator('userType',{
                            initialValue:userInfo.userType
                        })(
                            <Select>
                                <Option value={0}>管理员</Option>
                                <Option value={1}>企业用户</Option>
                                <Option value={2}>政府人员</Option>
                                <Option value={3}>企业人员用户</Option>
                                <Option value={4}>快检机构用户</Option>
                                <Option value={5}>抽检机构用户</Option>
                            </Select>
                        )
                    }
                </FormItem>
                <FormItem label="选择绑定信息"  style={this.props.form.getFieldValue('userType')===0?{display:'none'}:{display:'block'}} {...formItemLayout}>
                {
                    getFieldDecorator('infoName',{
                        initialValue:userInfo.infoName,
                    })(
                        <Input onClick={this.showModal} placeholder="选择绑定信息"/>
                    )
                }
            </FormItem>
                <FormItem style={{display:'none'}}>
                    {
                        getFieldDecorator('infoId',{
                            initialValue:userInfo.infoId,
                        })(
                            <Input type="hidden"/>
                        )
                    }
                </FormItem>
                <FormItem label="状态" {...formItemLayout}>
                    {
                        getFieldDecorator('status',{
                            initialValue:userInfo.status
                        })(
                            <Select>
                                <Option value={0}>开启</Option>
                                <Option value={1}>关闭</Option>
                            </Select>
                        )}
                </FormItem>
                <FormItem label="备注" {...formItemLayout}>
                    {
                        getFieldDecorator('remark',{
                            initialValue:userInfo.remark
                        })(
                            <Input.TextArea type="text" autosize={ {minRows:4, maxRows: 6}} placeholder="请输入备注"/>
                        )
                    }
                </FormItem>
                <FormItem style={{display:'none'}}>
                    {
                        getFieldDecorator('id',{
                            initialValue:userInfo.id
                        })(
                            <Input type="hidden"/>
                        )
                    }
                </FormItem>
                <Modal
                    width='700px'
                    title="企业人员列表"
                    visible={this.state.isEnPersonVisible}
                    footer={null}
                    onCancel={()=>{
                        this.setState({
                            isEnPersonVisible:false
                        })
                    }}
                >
                    <EnPersonForm dispatchPerson={(item)=> {this.setState({isEnPersonVisible:false});
                        this.props.form.setFieldsValue({
                            infoId:item.id,infoName:item.name
                        })
                    }} />
                </Modal>
                <Modal
                    width='700px'
                    title="企业信息列表"
                    visible={this.state.isEnVisible}
                    footer={null}
                    onCancel={()=>{
                        this.setState({
                            isEnVisible:false
                        })
                    }}
                >
                    <EnterpriseForm dispatchEnterprise={(item)=> {this.setState({isEnVisible:false});
                        this.props.form.setFieldsValue({
                            infoId:item.id,infoName:item.enterpriseName
                        })
                    }} />
                </Modal>
                <Modal
                    width='700px'
                    title="政府人员列表"
                    visible={this.state.isGaPersonVisible}
                    footer={null}
                    onCancel={()=>{
                        this.setState({
                            isGaPersonVisible:false
                        })
                    }}
                >
                    <GaPersonForm dispatchPerson={(item)=> {this.setState({isGaPersonVisible:false});
                        this.props.form.setFieldsValue({
                            infoId:item.id,infoName:item.name
                        })
                    }} />
                </Modal>
            </Form>
        );
    }
}
export default Form.create({})(UserForm);