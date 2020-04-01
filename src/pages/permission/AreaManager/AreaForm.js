import React,{Component} from 'react';
import {Form,Select,Input,TreeSelect} from 'antd';

const FormItem = Form.Item;
const Option = Select.Option;
const TreeNode = TreeSelect.TreeNode;

class AreaForm extends Component{
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
        const areaInfo = this.props.areaInfo || {};
        const areaList = this.props.areaList || {};
        const formItemLayout = {
            labelCol: {span: 5},
            wrapperCol: {span: 16}
        };
        return (
            <Form layout="horizontal">
                <FormItem label="上级地区" {...formItemLayout}>
                    {
                        getFieldDecorator('parentId',{
                            initialValue:areaInfo.parentId
                        })(
                            <TreeSelect>
                                <TreeNode value={0} title={'root'}>
                                    {this.renderTreeNodes(areaList)}
                                </TreeNode>
                            </TreeSelect>
                        )
                    }
                </FormItem>
                <FormItem label="地区名称" {...formItemLayout}>
                    {
                        getFieldDecorator('name',{
                            initialValue:areaInfo.name
                        })(
                            <Input type="text" placeholder="请输入地区名称"/>
                        )
                    }
                </FormItem>
                <FormItem label="编号" {...formItemLayout}>
                    {
                        getFieldDecorator('regionNumber',{
                            initialValue:areaInfo.regionNumber
                        })(
                            <Input type="text" placeholder="请输入编号"/>
                        )
                    }
                </FormItem>
                <FormItem label="行政编号" {...formItemLayout}>
                    {
                        getFieldDecorator('executiveNumber',{
                            initialValue:areaInfo.executiveNumber
                        })(
                            <Input type="text" placeholder="请输入行政编号"/>
                        )
                    }
                </FormItem>
                <FormItem label="顺序" {...formItemLayout}>
                    {
                        getFieldDecorator('seq',{
                            initialValue:areaInfo.seq
                        })(
                            <Input type="text" placeholder="请输入顺序"/>
                        )
                    }
                </FormItem>
                <FormItem label="状态" {...formItemLayout}>
                    {
                        getFieldDecorator('status',{
                            initialValue:areaInfo.status
                        })(
                            <Input type="text" placeholder="请状态"/>
                        )
                    }
                </FormItem>
                <FormItem label="备注" {...formItemLayout}>
                    {
                        getFieldDecorator('remark',{
                            initialValue:areaInfo.remark
                        })(
                            <Input.TextArea type="text" autosize={ {minRows:4, maxRows: 6}} placeholder="请输入备注"/>
                        )
                    }
                </FormItem>
                <FormItem style={{display:'none'}}>
                    {
                        getFieldDecorator('id',{
                            initialValue:areaInfo.id
                        })(
                            <Input type="hidden"/>
                        )
                    }
                </FormItem>
            </Form>
        );
    }
}
export default Form.create({})(AreaForm);