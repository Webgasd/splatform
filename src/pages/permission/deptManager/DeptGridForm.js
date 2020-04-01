import React,{Component} from 'react';
import { Tree } from 'antd';

const TreeNode = Tree.TreeNode;
const DirectoryTree = Tree.DirectoryTree;

class DeptGridForm extends Component{
    onCheck = (checkedKeys) => {
        this.props.patchCheckKey(checkedKeys);
    };
    renderTreeNodes = (data) => {
        return data.map((item) => {
            if (item.childrenList) {
                return (
                    <TreeNode title={item.name} key={item.id}>
                        {this.renderTreeNodes(item.childrenList)}
                    </TreeNode>
                );
            } else {
                return (
                      <TreeNode title={item.name} key={item.id} isLeaf/>

                );
            }
        });
    };
    render(){
        const treeData = this.props.treeData;
        return (
            <DirectoryTree
                checkable
                defaultExpandAll
                onCheck={this.onCheck}
                checkedKeys={this.props.checkKey}
            >
                <TreeNode title={'网格名称'} key={0}>
                    {this.renderTreeNodes(treeData)}
                </TreeNode>
            </DirectoryTree>
        );
    }
}
export default DeptGridForm;