import React from "react";
import {Form, Icon, Input, Modal, Select} from "antd";
import LargeConfForm from './LargeConfForm';
const Option = Select.Option;
const FormItem = Form.Item;

class AddForm extends React.Component{

    state={}
    getState = (type)=>{
        return {
            '1':'小作坊',
            '2':'小餐饮',
            '3':'食品摊贩'
        }[type]
    }
    render(){
        const { getFieldDecorator } = this.props.form;
        const formItemLayout = {
            labelCol: {span: 5},
            wrapperCol: {span: 16}
        };
        const addInfo = this.props.addInfo || {};
        return (


            <Form layout="horizontal">
                <FormItem label="检查项目名称" {...formItemLayout}>
                    {
                        getFieldDecorator('largeClassName',{
                            initialValue:addInfo.largeClassName
                        })(
                            <Input type="text" onClick={()=>this.setState({isVisible:true})} placeholder="" suffix={<Icon type="search" />}/>
                        )
                    }
                </FormItem>
                <FormItem label="序号" {...formItemLayout}>
                    {
                        getFieldDecorator('seq',{
                            initialValue:addInfo.seq
                        })(
                            <Input type="text" placeholder=""/>
                        )
                    }
                </FormItem>
                <FormItem label="检查条款" {...formItemLayout}>
                    {
                        getFieldDecorator('clauseName',{
                            initialValue:addInfo.clauseName
                        })(
                            <Input.TextArea rows={4} type="text" placeholder=""/>
                        )
                    }
                </FormItem>
                <FormItem label="分值" {...formItemLayout}>
                    {
                        getFieldDecorator('score',{
                            initialValue:addInfo.score
                        })(
                            <Input type="text" placeholder=""/>
                        )
                    }
                </FormItem>
                <FormItem label="重要性" {...formItemLayout}>
                    {

                        getFieldDecorator('importance',{
                            initialValue:addInfo.importance
                        })(
                            <Select>
                                <Option value={1}>一般项</Option>
                                <Option value={2}>关键项</Option>
                                <Option value={3}>合理缺项</Option>
                                <Option value={4}>特殊项</Option>
                            </Select>
                        )
                    }
                </FormItem>

                <FormItem label="法律依据" {...formItemLayout}>
                    {

                        getFieldDecorator('legalBasis',{
                            initialValue:addInfo.legalBasis
                        })(
                            <Input type="text" placeholder=""/>
                        )
                    }
                </FormItem>
                <FormItem label="“检查项为“否”、检查结果“说明”内容”" {...formItemLayout}>
                    {

                        getFieldDecorator('remark',{
                            initialValue:addInfo.remark
                        })(
                            <Input.TextArea rows={4} type="text" />
                        )
                    }
                </FormItem>

                <FormItem style={{display:'none'}}>
                    {
                        getFieldDecorator('id',{
                            initialValue:addInfo.id
                        })(
                            <Input type="hidden"/>
                        )
                    }
                </FormItem>

                <FormItem style={{display:'none'}}>
                    {
                        getFieldDecorator('largeClass',{
                            initialValue:addInfo.largeClass
                        })(
                            <Input type="hidden"/>
                        )
                    }
                </FormItem>

                <Modal
                    width='500px'
                    title="检查项列表"
                    visible={this.state.isVisible}
                    destroyOnClose
                    footer={null}
                    onCancel={()=>{
                        this.setState({
                            isVisible:false
                        })
                    }}
                >
                    <LargeConfForm dispatchLargeConf={(item)=> {this.setState({isVisible:false});
                        this.props.form.setFieldsValue({
                            largeClass:item.id,largeClassName:item.name
                        })
                    }} />
                </Modal>
            </Form>
        );
    }
}

export default AddForm = Form.create({})(AddForm);