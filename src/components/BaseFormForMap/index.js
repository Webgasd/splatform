import React,{ Component } from 'react'
import { Input, Select, Form, Button, Checkbox, DatePicker,TreeSelect,Row,Col} from 'antd'
import moment from "moment";
import { SearchOutlined } from '@ant-design/icons';
const FormItem = Form.Item;
const Option = Select.Option;
const CheckboxGroup = Checkbox.Group;
const { TreeNode } = TreeSelect;


class FilterForm extends Component{

    handleFilterSubmit = ()=>{
     
        let fieldsValue = this.props.form.getFieldsValue();
     //   console.log(fieldsValue)
        this.props.filterSubmit(fieldsValue);
    }
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

    renderAreaTreeNodes = (data) => {
        return data.map((item) => {
            if (item.childrenList) {
                return (
                    <TreeNode title={item.name} value={item.id} key={item.id}>
                        {this.renderAreaTreeNodes(item.childrenList)}
                    </TreeNode>
                );
            } else {
                return (
                    <div/>

                );
            }
        });
    };
    // initFormList = ()=>{
    //     const { getFieldDecorator } = this.props.form;
    //     const formList = this.props.formList;
    //     const formItemList = [];
    //     const formItemLayout =  null
    //      {
    //           labelCol: {span: 12},
    //          wrapperCol: {span: 24}
           
    //      };
    //     if (formList && formList.length>0){
    //         formList.forEach((item,index)=>{
               
    //             let field = item.field;
    //             let initialValue = item.initialValue || '';
    //             let width = item.width;
        
    //              if(item.type == 'AREA_TREE'){
    //                 const AREA_TREE = <FormItem style={{marginBottom:0}}  key={field} {...formItemLayout}>
    //                     {
    //                         getFieldDecorator(field,{
    //                             initialValue: initialValue
    //                         })(
    //                             <TreeSelect
    //                                 style={{ width: width }}
    //                             >
    //                                 {this.renderAreaTreeNodes(item.list)}
    //                             </TreeSelect>
    //                         )
    //                     }
    //                 </FormItem>;
    //                 formItemList.push(AREA_TREE)
    //             }
    //         })
    //     }
    //     return formItemList;
    // }
    render(){
        const { getFieldDecorator } = this.props.form;
        const formList = this.props.formList;
        let field = formList[0].field;
        let initialValue = formList[0].initialValue || '';
        let width = formList[0].width;
        const AREA_TREE = <FormItem style={{marginBottom:0}}  key={field}>
                        {
                            getFieldDecorator(field,{
                                initialValue: initialValue
                            })(
                                <TreeSelect
                                    style={{ width: width }}
                                >
                                    {this.renderAreaTreeNodes(formList[0].list)}
                                </TreeSelect>
                            )
                        }
                    </FormItem>;
    
        return (
            <Form layout="inline">
                { AREA_TREE }
                <FormItem layout={null} >
                    <Button type="primary" shape="circle" icon="search" onClick={this.handleFilterSubmit}/>
                </FormItem>
            </Form>
        );
    }
}
export default Form.create({})(FilterForm);