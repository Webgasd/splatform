import React,{Component} from 'react';
import {Form,Select,Input,TreeSelect,Upload,Icon,message} from 'antd';

const FormItem = Form.Item;
const Option = Select.Option;
const TreeNode = TreeSelect.TreeNode;

class ModuleForm extends Component{
    state = {
        previewVisible: false,
        previewImage: ''
    };
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
    handlePictureChange = picture => {
        const fileList = picture.fileList;
        if (picture.file.status === 'done') {
            message.success(`${picture.file.name} 上传成功.`);
            const file = fileList.pop();
            file.thumbUrl= "http://localhost:8080/upload/picture/" +file.response.data;
            fileList.push(file);
            this.props.patchPictureList(fileList)
        }  else   if (picture.file.status === 'error') {
            fileList.pop();
            message.error(`${picture.file.name} 上传失败.`);
        }
        this.props.patchPictureList(fileList)
    };

    render(){
        const { getFieldDecorator } = this.props.form;
        const moduleInfo = this.props.moduleInfo || {};
        const moduleList = this.props.moduleList || {};
        const pictureList = this.props.pictureList || [];
        const uploadButton = (
            <div>
                <Icon type="plus" />
                <div className="ant-upload-text">选择图片</div>
            </div>
        );
        const formItemLayout = {
            labelCol: {span: 5},
            wrapperCol: {span: 16}
        };
        return (
            <Form layout="horizontal">
                <FormItem label="上级模块" {...formItemLayout}>
                    {
                        getFieldDecorator('parentId',{
                            initialValue:moduleInfo.parentId
                        })(
                            <TreeSelect>
                                <TreeNode value={0} title={'首页'}>
                                {this.renderTreeNodes(moduleList)}
                               </TreeNode>
                            </TreeSelect>
                        )
                    }
                </FormItem>
                <FormItem label="模块名称" {...formItemLayout}>
                    {
                        getFieldDecorator('name',{
                            initialValue:moduleInfo.name
                        })(
                            <Input type="text" placeholder="请输入模块名称"/>
                        )
                    }
                </FormItem>
                <FormItem label="顺序" {...formItemLayout}>
                    {
                        getFieldDecorator('seq',{
                            initialValue:moduleInfo.seq
                        })(
                            <Input type="text" placeholder="请输入顺序"/>
                        )
                    }
                </FormItem>
                <FormItem label="状态" {...formItemLayout}>
                    {
                        getFieldDecorator('status',{
                            initialValue:moduleInfo.status
                        })(
                            <Select>
                                <Option value={1}>开启</Option>
                                <Option value={0}>关闭</Option>
                            </Select>
                        )}
                </FormItem>
                <FormItem label="备注" {...formItemLayout}>
                    {
                        getFieldDecorator('remark',{
                            initialValue:moduleInfo.remark
                        })(
                            <Input.TextArea type="text" autosize={ {minRows:4, maxRows: 6}} placeholder="请输入备注"/>
                        )
                    }
                </FormItem>
                <FormItem>
                    {
                        getFieldDecorator('id',{
                            initialValue:moduleInfo.id
                        })(
                            <Input type="hidden"/>
                        )
                    }
                </FormItem>
                <div style={{height:100}}>
                <Upload
                    action='http://localhost:8080/upload/uploadPicture'
                    name='file'
                    listType="picture-card"
                    fileList={ pictureList }
                    accept='image/png,image/jpeg'
                    onChange={ this.handlePictureChange }
                >
                    {pictureList.length >= 1 ? null : uploadButton}
                </Upload>
                </div>
            </Form>
        );
    }
}
export default Form.create({})(ModuleForm);