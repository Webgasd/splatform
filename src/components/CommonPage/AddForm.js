import {Component} from "react";
import { DatePicker, Form, Input, Select, Checkbox, TimePicker} from "antd";
import React from "react";
import moment from 'moment';
const FormItem = Form.Item;
const Option = Select.Option;
const TextArea = Input.TextArea;
const formItemLayout = {
    labelCol: {span: 6},
    wrapperCol: {span: 14}
};

class AddForm extends Component{
    getOptionList(data){
        if(!data){
            return [];
        }
        let options = []
        data.map((item)=>{
            options.push(<Option value={item.id} key={item.id}>{item.name}</Option>)
        })
        return options;
    }
    // getCheckBoxList(data){
    //     if(!data){
    //         return [];
    //     }
    //     let checks = []
    //     data.map((item)=>{
    //         checks.push(<Checkbox value={item.name} key={item.id}>{item.name}</Checkbox>)
    //     })
    //     return checks;
    // }
    initFormList = ()=>{
        const { getFieldDecorator } = this.props.form;
        const formList = this.props.formList;
        const formItemList = [];
        const addInfo = this.props.addInfo||{};
        if (formList && formList.length>0){
            formList.forEach((item,index)=>{
                let label = item.label;
                let field = item.field;
                let placeholder = item.placeholder;
                let width = item.width;

               if(item.type == 'INPUT'){
                    const INPUT = <FormItem label={label} key={field} {...formItemLayout}>
                        {
                            getFieldDecorator(field,{
                                initialValue: addInfo[field]
                            })(
                                <Input type="text" placeholder={placeholder} />
                            )
                        }
                    </FormItem>;
                    formItemList.push(INPUT)
                }else if(item.type == 'TextArea'){
                    const INPUT = <FormItem label={label} key={field} {...formItemLayout}>
                        {
                            getFieldDecorator(field,{
                                initialValue: addInfo[field]
                            })(
                                <TextArea rows={item.rows} placeholder={placeholder} />
                            )
                        }
                    </FormItem>;
                    formItemList.push(INPUT)
                }else if (item.type == 'SELECT') {
                    const SELECT = <FormItem label={label} key={field} {...formItemLayout}>
                        {
                            getFieldDecorator(field, {
                                initialValue: addInfo[field]
                            })(
                                <Select
                                    style={{ width: width }}
                                    placeholder={placeholder}
                                >
                                    {this.getOptionList(item.list)}
                                </Select>
                            )
                        }
                    </FormItem>;
                    formItemList.push(SELECT)
                }else if (item.type == 'DATE'){
                    const DATE = <FormItem label={label} key={field} {...formItemLayout}>
                        {
                            getFieldDecorator(field,{
                                initialValue:addInfo[field]===''?moment():moment(addInfo[field])
                            })(
                                <DatePicker showTime={true} placeholder={placeholder} format="YYYY-MM-DD HH:mm:ss"/>
                            )
                        }
                    </FormItem>;
                    formItemList.push(DATE)
                }
               // else if(item.type == 'CHECKBOX'){
               //     const CHECKBOX = <FormItem label={label} key={field} {...formItemLayout}>
               //         {
               //             getFieldDecorator(field,{
               //                 //valuePropName:'checked',
               //                 initialValue: addInfo[field]
               //             })(
               //                 <Checkbox.Group>
               //                     {this.getCheckBoxList(item.list)}
               //                 </Checkbox.Group>
               //             )
               //         }
               //     </FormItem>;
               //     formItemList.push(CHECKBOX)
               // }else if (item.type == 'TIME'){
               //     const TIME = <FormItem label={label} key={field} {...formItemLayout}>
               //         {
               //             getFieldDecorator(field,{
               //                 initialValue:addInfo[new Date(field)]===''?moment():moment(addInfo[field])
               //             })(
               //                 <TimePicker showTime={true} placeholder={placeholder} format="HH:mm:ss"/>
               //             )
               //         }
               //     </FormItem>;
               //     formItemList.push(TIME)
               // }
            })
        }
        return formItemList;
    }

    render() {
        const { getFieldDecorator } = this.props.form;
        const addInfo=this.props.addInfo||{};
        return (
            <Form layout="horizontal">
                { this.initFormList() }
                <FormItem style={{display:'none'}}>
                    {
                        getFieldDecorator('id',{
                            initialValue:addInfo.id
                        })(
                            <Input type="hidden"/>
                        )
                    }
                </FormItem>
            </Form>
        )
    }
}
export default Form.create({})(AddForm);