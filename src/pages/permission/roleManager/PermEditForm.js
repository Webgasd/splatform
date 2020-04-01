import React,{Component} from 'react';
import {Tree,Form,Select,Input} from 'antd';

const TreeNode = Tree.TreeNode;
const FormItem = Form.Item;
const Option = Select.Option;
const DirectoryTree = Tree.DirectoryTree;

class PermEditForm extends Component {
    state = {};
    // 设置选中的节点，通过父组件方法再传递回来
    onCheck = (checkedKeys) => {
        console.log(checkedKeys)
        this.props.patchMenuInfo(checkedKeys);
    };
    renderTreeNodes = (data) => {
        return data.map((item) => {
            if (item.childrenList) {
                return (
                    <TreeNode title={item.name} key={'root'+item.id}>
                        {this.renderTreeNodes(item.childrenList)}
                    </TreeNode>
                );
            } else {
                return (
                    <TreeNode title={item.name} key={'root'+item.id}>
                        {item.aclList.map((item)=>{
                            return (
                                <TreeNode title={item.name} key={item.id} isLeaf/>
                            );
                        })}
                    </TreeNode>
                );
            }
        });
    };

    render() {
        const { getFieldDecorator } = this.props.form;
        const formItemLayout = {
            labelCol: {span: 5},
            wrapperCol: {span: 18}
        };
        const detail_info = this.props.detailInfo;
        const roleTree = this.props.roleTree;
        return (
            <Form layout="horizontal">
                <FormItem label="角色名称：" {...formItemLayout}>
                    <Input disabled  placeholder={detail_info.name}/>
                </FormItem>
                <FormItem label="状态：" {...formItemLayout}>
                    {getFieldDecorator('status',{
                        initialValue: '1'
                    })(
                        <Select style={{ width: 80}}
                                placeholder="启用"
                        >
                            <Option value="1">启用</Option>
                            <Option value="0">停用</Option>
                        </Select>
                    )}
                </FormItem>
                <DirectoryTree
                    checkable
                    onCheck={this.onCheck}
                    checkedKeys={this.props.checkKey}
                >
                     {this.renderTreeNodes(roleTree)}
                </DirectoryTree>
            </Form>
        )
    }
}

export default Form.create({})(PermEditForm);