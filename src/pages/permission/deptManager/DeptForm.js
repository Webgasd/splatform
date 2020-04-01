import React,{Component} from 'react';
import {Form, Input, Select, TreeSelect} from 'antd';
import axios from "../../../axios";

const FormItem = Form.Item;
const TreeNode = TreeSelect.TreeNode;
const Option = Select.Option;

class DeptForm extends Component{
    state={roleTree:[]}
    componentDidMount() {
        this.requestRoleTree();
    }

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
    requestRoleTree = ()=>{
        axios.ajax({
            url:'/sys/role/list',
            data:{
                params:{}
            }
        }).then((res)=>{
            if(res.status == "success"){
                let roleTree  = res.data;
                this.setState({
                    roleTree
                })
            }
        })
    }
    render(){
        const { getFieldDecorator } = this.props.form;
        const deptInfo = this.props.deptInfo || {};
        const deptList = this.props.deptList || {};
        const formItemLayout = {
            labelCol: {span: 5},
            wrapperCol: {span: 16}
        };
        return (
            <Form layout="horizontal">
                <FormItem label="上级部门" {...formItemLayout}>
                    {
                        getFieldDecorator('parentId',{
                            initialValue:deptInfo.parentId
                        })(
                            <TreeSelect>
                                <TreeNode value={0} title={'顶级'}>
                                    {this.renderTreeNodes(deptList)}
                                </TreeNode>
                            </TreeSelect>
                        )
                    }
                </FormItem>
                <FormItem label="部门名称" {...formItemLayout}>
                    {
                        getFieldDecorator('name',{
                            initialValue:deptInfo.name
                        })(
                            <Input type="text" placeholder="请输入模块名称"/>
                        )
                    }
                </FormItem>
                <FormItem label="顺序" {...formItemLayout}>
                    {
                        getFieldDecorator('seq',{
                            initialValue:deptInfo.seq
                        })(
                            <Input type="text" placeholder="请输入顺序"/>
                        )
                    }
                </FormItem>
                <FormItem label="默认角色" {...formItemLayout}>
                    {
                        getFieldDecorator('defaultRole',{
                            initialValue:deptInfo.defaultRole
                        })(
                            <Select>
                               {this.state.roleTree.map((item)=> <Option value={item.id}>{item.name}</Option>)}
                            </Select>
                        )
                    }
                </FormItem>
                <FormItem label="部门类型" {...formItemLayout}>
                    {
                        getFieldDecorator('type',{
                            initialValue:deptInfo.type
                        })(
                            <Select>
                                <Option value={0}>办公室</Option>
                                <Option value={1}>局部门</Option>
                                <Option value={2}>所部门</Option>
                            </Select>
                        )
                    }
                </FormItem>
                {/*<FormItem label="所在区域" {...formItemLayout}>*/}
                {/*{*/}
                    {/*getFieldDecorator('areaId',{*/}
                        {/*initialValue:deptInfo.areaId*/}
                    {/*})(*/}
                        {/*<Input type="text" placeholder="请选择区域"/>*/}
                    {/*)*/}
                {/*}*/}
            {/*</FormItem>*/}
                {/*<FormItem label="管辖领导" {...formItemLayout}>*/}
                    {/*{*/}
                        {/*getFieldDecorator('leaderId',{*/}
                            {/*initialValue:deptInfo.leaderId*/}
                        {/*})(*/}
                            {/*<Input type="text" placeholder="请选择管辖领导"/>*/}
                        {/*)*/}
                    {/*}*/}
                {/*</FormItem>*/}
                <FormItem label="备注" {...formItemLayout}>
                    {
                        getFieldDecorator('remark',{
                            initialValue:deptInfo.remark
                        })(
                            <Input.TextArea type="text" autosize={ {minRows:4, maxRows: 6}} placeholder="请输入备注"/>
                        )
                    }
                </FormItem>
                <FormItem style={{display:'none'}}>
                    {
                        getFieldDecorator('id',{
                            initialValue:deptInfo.id
                        })(
                            <Input type="hidden"/>
                        )
                    }
                </FormItem>
            </Form>
        );
    }
}
export default Form.create({})(DeptForm);