import React,{Component} from 'react';
import {Form,Select,Input,TreeSelect} from 'antd';

const FormItem = Form.Item;
const Option = Select.Option;
const TreeNode = TreeSelect.TreeNode;

class AclsForm extends Component{
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
    render(){
        const { getFieldDecorator } = this.props.form;
        const aclsInfo = this.props.aclsInfo || {};
        const moduleList = this.props.moduleList || {};
        const formItemLayout = {
            labelCol: {span: 5},
            wrapperCol: {span: 16}
        };
        return (
            <Form layout="horizontal">
                <FormItem label="所属权限模块" {...formItemLayout}>
                    {
                        getFieldDecorator('aclModuleId',{
                            initialValue:aclsInfo.aclModuleId
                        })(
                            <TreeSelect>
                                <TreeNode value={0} title={'首页'}>
                                    {this.renderTreeNodes(moduleList)}
                                </TreeNode>
                            </TreeSelect>
                        )
                    }
                </FormItem>
                <FormItem label="权限名称" {...formItemLayout}>
                    {
                        getFieldDecorator('name',{
                            initialValue:aclsInfo.name
                        })(
                            <Input type="text" placeholder="请输入权限名称"/>
                        )
                    }
                </FormItem>
                <FormItem label="类型" {...formItemLayout}>
                    {
                        getFieldDecorator('type',{
                            initialValue:aclsInfo.type
                        })(
                            <Select>
                                <Option value={1}>菜单</Option>
                                <Option value={2}>按钮</Option>
                            </Select>
                        )}
                </FormItem>
                <FormItem label="URL" {...formItemLayout}>
                    {
                        getFieldDecorator('url',{
                            initialValue:aclsInfo.url
                        })(
                            <Input type="text" placeholder="请输入URL"/>
                        )
                    }
                </FormItem>
                <FormItem label="状态" {...formItemLayout}>
                    {
                        getFieldDecorator('status',{
                            initialValue:aclsInfo.status
                        })(
                            <Select>
                                <Option value={1}>开启</Option>
                                <Option value={2}>关闭</Option>
                            </Select>
                        )}
                </FormItem>
                <FormItem label="顺序" {...formItemLayout}>
                    {
                        getFieldDecorator('seq',{
                            initialValue:aclsInfo.seq
                        })(
                            <Input type="text" placeholder="请输入顺序"/>
                        )
                    }
                </FormItem>
                <FormItem label="备注" {...formItemLayout}>
                    {
                        getFieldDecorator('remark',{
                            initialValue:aclsInfo.remark
                        })(
                            <Input.TextArea type="text" autosize={ {minRows:4, maxRows: 6}} placeholder="请输入备注"/>
                        )
                    }
                </FormItem>
                <FormItem>
                    {
                        getFieldDecorator('id',{
                            initialValue:aclsInfo.id
                        })(
                            <Input type="hidden"/>
                        )
                    }
                </FormItem>
            </Form>
        );
    }
}
export default Form.create({})(AclsForm);