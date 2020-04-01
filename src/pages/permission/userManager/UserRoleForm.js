import React,{Component} from 'react';
import { Tree } from 'antd';

const TreeNode = Tree.TreeNode;
const DirectoryTree = Tree.DirectoryTree;

class UserRoleForm extends Component{
    onCheck = (checkedKeys) => {
        this.props.patchCheckKey(checkedKeys);
    };
    renderTreeNodes = (data) => {
        return data.map((item) => {
                return (
                    <TreeNode title={item.name} key={item.id} isLeaf/>
                );
        });
    };
    render(){
        const roleTree = this.props.roleTree;
        return (
            <DirectoryTree
                checkable
                defaultExpandAll
                onCheck={this.onCheck}
                checkedKeys={this.props.checkKey}
            >
                <TreeNode title={'角色名称'} key={0}>
                {this.renderTreeNodes(roleTree)}
                </TreeNode>
            </DirectoryTree>
        );
    }
}
export default UserRoleForm;