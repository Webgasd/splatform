import React,{Component} from 'react';
import {Transfer, Table, Form, Row,Col, Input, Select} from 'antd';
import difference from 'lodash/difference';
import axios from "../../../axios";
import Utils from "../../../utils";
const FormItem = Form.Item;
const Option = Select.Option;
const leftTableColumns = [
    {
        title: '题目',
        dataIndex: 'title',
        width:300,
        render(title) {
            if(title.length>10){
                return title.substring(0,10)+"...";
            }else{
                return title;
            }
        }
    },{
        title: '类型',
        dataIndex: 'type',
        render(type){
            if (type == 1) {
                return "判断题"
            } if (type == 2) {
                return "单选题"
            }if (type == 3) {
                return "多选题"
            }
        }
    }
];
const rightTableColumns = [
    {
        title: '题目',
        dataIndex: 'title',
        width:300,
        render(title) {
            if(title.length>10){
                return title.substring(0,10)+"...";
            }else{
                return title;
            }
        }
    },
];


class AddForm extends Component {
    state={}
    params = {
        pageNo:1
    }
    componentDidMount(){
        this.requestList();
        this.requestInfo();
    }
    requestList = ()=>{
        let _this = this;
        axios.ajax({
            url:'/exam/topic/getList',
            data:{
                params:this.params
            }
        }).then((res)=>{
            if(res.status == "success"){
                let list  = res.data.map((item)=>{
                    item.key = item.id;
                    return item;
                })
                this.setState({
                    list:list,
                })
            }
        })
    }

    requestInfo=()=>{
        axios.noLoadingAjax({
            url:'/exam/subject/getIndustryAndWorkType'
        }).then((res)=>{
            if(res.status == 'success'){
                this.setState({
                    industryList:res.data.allIndustry,
                    workTypeList:res.data.allWorkType
                })
            }
        })
    }

    onChange = targetKeys => {
        this.props.dispatchKeys(targetKeys);
    };

    render() {
        const { targetKeys } = this.props;
        const { getFieldDecorator } = this.props.form;
        const subjectInfo = this.props.subjectInfo || {};
        const formItemLayout = {
            labelCol: {span: 5},
            wrapperCol: {span: 16}
        };
        const formItemLongLayout = {
            labelCol: {span: 8},
            wrapperCol: {span: 13}
        };
        const checkStatus = this.props.type=='detail'?true:false;
        return (
            <Form>
                <Row gutter={24}>
                    <Col span={8}>
                        <FormItem label="行业类别" {...formItemLayout}>
                            {
                                getFieldDecorator('industry',{
                                    initialValue:subjectInfo.industry
                                })(
                                    <Select disabled={checkStatus}>
                                        {(this.state.industryList||[]).map((item)=><Option value={item.id}>{item.name}</Option>)}
                                    </Select>
                                )
                            }
                        </FormItem>
                    </Col>
                    <Col span={8}>
                        <FormItem label="工作种类" {...formItemLayout}>
                            {
                                getFieldDecorator('workType',{
                                    initialValue:subjectInfo.workType
                                })(
                                    <Select disabled={checkStatus?true:(this.props.form.getFieldValue("industry")?false:true)}>
                                        {(this.state.workTypeList||[]).filter((item)=>item.industryId==this.props.form.getFieldValue("industry")).map((item)=><Option value={item.id}>{item.name}</Option>)}
                                    </Select>
                                )
                            }
                        </FormItem>
                    </Col>
                    <Col span={8}>
                        <FormItem label="及格分数" {...formItemLayout}>
                            {
                                getFieldDecorator('qualifiedScore',{
                                    initialValue:subjectInfo.qualifiedScore
                                })(
                                    <Input type="text" placeholder="及格分数" disabled={checkStatus}/>
                                )
                            }
                        </FormItem>
                    </Col>
                </Row>
                <Row>
                    <Col span={8}>
                        <FormItem label="总分" {...formItemLayout}>
                            {
                                getFieldDecorator('totalScore',{
                                    initialValue:subjectInfo.totalScore
                                })(
                                    <Input type="text" placeholder="请输入总分" disabled={checkStatus}/>
                                )}
                        </FormItem>
                    </Col>
                    <Col span={8}>
                        <FormItem label="考试时间(分钟)" {...formItemLongLayout}>
                            {
                                getFieldDecorator('examTime',{
                                    initialValue:subjectInfo.examTime
                                })(
                                    <Input type="text" placeholder="请输入要考试时间" disabled={checkStatus}/>
                                )
                            }
                        </FormItem>
                    </Col>
                    <Col span={8}>
                        <FormItem {...formItemLayout}>
                            {
                                getFieldDecorator('id',{
                                    initialValue:subjectInfo.id
                                })(
                                    <Input type="hidden"/>
                                )
                            }
                        </FormItem>
                    </Col>
                </Row>

                <Transfer
                    disabled={checkStatus}
                    dataSource={this.state.list||[]}
                    targetKeys={targetKeys}
                    titles={['待选题目', '已选题目']}
                    onChange={this.onChange}
                    filterOption={(inputValue, item) =>
                        item.title.indexOf(inputValue) !== -1
                    }
                    showSelectAll={false}>
                    {({
                          direction,
                          filteredItems,
                          onItemSelectAll,
                          onItemSelect,
                          selectedKeys: listSelectedKeys,
                      }) => {
                        const columns = direction == 'left' ? leftTableColumns : rightTableColumns;

                        const rowSelection = {
                            onSelectAll(selected, selectedRows) {
                                const treeSelectedKeys = selectedRows
                                    .map(({ key }) => key);
                                const diffKeys = selected
                                    ? difference(treeSelectedKeys, listSelectedKeys)
                                    : difference(listSelectedKeys, treeSelectedKeys);
                                onItemSelectAll(diffKeys, selected);
                            },
                            onSelect({ key }, selected) {
                                onItemSelect(key, selected);
                            },
                            selectedRowKeys: listSelectedKeys,
                        };

                        return (
                            <Table
                                rowSelection={checkStatus?null:rowSelection}
                                columns={columns}
                                dataSource={filteredItems}
                                size="small"
                                onRow={({ key }) => ({
                                    onClick: () => {
                                        onItemSelect(key, !listSelectedKeys.includes(key));
                                    },
                                })}
                            />
                        );
                    }}
                </Transfer>
            </Form>
        )
    }
}
export default Form.create({})(AddForm);