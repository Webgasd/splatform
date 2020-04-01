import React,{Component} from 'react';
import { Tree } from 'antd';

const TreeNode = Tree.TreeNode;
const DirectoryTree = Tree.DirectoryTree;

class DeptAreaForm extends Component{
    onCheck = (checkedKeys,e) => {
        this.props.patchCheckKey(checkedKeys,e.halfCheckedKeys);
    };
    renderTreeNodes = (data) => {
        return data.map((item) => {
            if (item.childrenList) {
                return (
                    <TreeNode selectable={false} title={item.name} key={item.id}>
                        {this.renderTreeNodes(item.childrenList)}
                    </TreeNode>
                );
            } else {
                return (
                    <TreeNode selectable={false} title={item.name} key={item.id} isLeaf/>

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
                    {this.renderTreeNodes(treeData)}
            </DirectoryTree>
        );
    }
}
export default DeptAreaForm;