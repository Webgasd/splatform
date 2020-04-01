import React,{Component} from 'react';
import {Form, TreeSelect} from 'antd';
const FormItem = Form.Item;
const { TreeNode } = TreeSelect;

export default class Deploy extends Component{
    renderTreeNodes = (data) => {
        return data.map((item) => {
            if (item.childrenList) {
                return (
                    <TreeNode title={item.name} value={item.id} key={item.id}>
                        {this.renderTreeNodes(item.childrenList)}
                    </TreeNode>
                );
            } else {
                return (
                    <TreeNode title={item.name} value={item.id} key={item.id} isLeaf/>
                );
            }
        });
    };
    render(){

        const formItemLayout = {
            labelCol: {span: 5},
            wrapperCol: {span: 16}
        };

        return (
            <div>
                <Form layout="horizontal" className="deploy">
                    <FormItem label="部门名称" {...formItemLayout} >
                        <TreeSelect placeholder={"请选择部门"} value={this.props.checkDept||''} onChange={(value)=>this.props.dispatchDept(value)}>
                            {this.renderTreeNodes(this.props.deptTree)}
                        </TreeSelect>
                    </FormItem>

                </Form>
            </div>
        )
    }
}
