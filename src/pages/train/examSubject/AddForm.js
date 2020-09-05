import React,{Component} from 'react';
import {Transfer, Table, Form, Row,Col, Input, Select,Button,DatePicker} from 'antd';
import difference from 'lodash/difference';
import axios from "../../../axios";
import Utils from "../../../utils";
import './style.less';
import NumberInput from "../../../components/NumericInput";
import moment from 'moment';


const FormItem = Form.Item;
const Option = Select.Option;


// 2020.7.24 改为随机出题，之前代码做注释处理--wjb

// const leftTableColumns = [
//     {
//         title: '题目',
//         dataIndex: 'title',
//         width:300,
//         render(title) {
//             if(title.length>10){
//                 return title.substring(0,10)+"...";
//             }else{
//                 return title;
//             }
//         }
//     },{
//         title: '类型',
//         dataIndex: 'type',
//         render(type){
//             if (type == 1) {
//                 return "判断题"
//             } if (type == 2) {
//                 return "单选题"
//             }if (type == 3) {
//                 return "多选题"
//             }
//         }
//     }
// ];
// const rightTableColumns = [
//     {
//         title: '题目',
//         dataIndex: 'title',
//         width:300,
//         render(title) {
//             if(title.length>10){
//                 return title.substring(0,10)+"...";
//             }else{
//                 return title;
//             }
//         }
//     },
// ];


class AddForm extends Component {
    state={ questions:[]}
    params = {
        pageNo:1
    }
    componentDidMount(){
        // this.requestList();
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
    handleSearch=()=>{
        axios.ajax({
            url:'/exam/subject/getNum',
            data:{
                params:{
                    industry:this.props.form.getFieldValue("industry"),
                    workType:this.props.form.getFieldValue("workType")
                }
                
            }
        }).then((res)=>{
            if(res.status == "success"){
                this.setState({
                    questions:res.data
                })
            }
        })
    }
    
    changeInfo=(value,option)=>{
        let data = this.props.subjectInfo;
        data[option] = value;
        this.props.dispatchInfo(data);
    }

    // onChange = targetKeys => {
    //     this.props.dispatchKeys(targetKeys);
    // };
    clearWork=()=>{
        this.props.form.resetFields("workType")
    }
    render() {
        // const { targetKeys } = this.props;
        const { getFieldDecorator } = this.props.form;
        const subjectInfo = this.props.subjectInfo || {};
        const formItemLayout = {
            labelCol: {span: 5},
            wrapperCol: {span: 16}
        };
        // const formItemLongLayout = {
        //     labelCol: {span: 8},
        //     wrapperCol: {span: 13}
        // };
        const {questions} = this.state;
        const checkStatus = this.props.type=='detail'?true:false;
        const checkStatusOne = this.props.type==='create'?false:true;
        return (
            <div>
                <div className="testBox">
                    <div className="head">试题类型配置及选择</div>
                    <Form style={{margin:"20px 0px 0px 20px"}}>
                        <Row gutter={24}>
                            <Col span={8}>
                                <FormItem label="行业类别" {...formItemLayout}>
                                    {
                                        getFieldDecorator('industry',{
                                            initialValue:subjectInfo.industry
                                        })(
                                            <Select disabled={checkStatusOne} onChange={this.clearWork}>
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
                                            <Select disabled={checkStatusOne?true:(this.props.form.getFieldValue("industry")?false:true)}>
                                                {(this.state.workTypeList||[]).filter((item)=>item.industryId==this.props.form.getFieldValue("industry")).map((item)=><Option value={item.id}>{item.name}</Option>)}
                                            </Select>
                                        )
                                    }
                                </FormItem>
                            </Col>
                            <Col span={8}>
                                <Button type="primary" style={{left:'35%',width:100}} onClick={()=>this.handleSearch()} disabled={checkStatus}>查询</Button>
                            </Col>
                        </Row>
                    </Form>
                    </div>
                    <div className="testBigbox">
                        <div className="head">可用【题型】及【题数】如下</div>
                        <table>
                            <th>可用题库（总计数量）</th>
                            <th>可用判断题（数量）</th>
                            <th>可用单选题（数量）</th>
                            <th>可用多选题（数量）</th>
                            <tr>
                                <td>{questions.allTopicNum || 0}</td>
                                <td>{questions.allJudgeNum || 0}</td>
                                <td>{questions.allSingleOptionNum || 0}</td>
                                <td>{questions.allMultipleOptionNum || 0}</td>
                            </tr>
                        </table>
                        <div className="line">考试考题数量配置【根据数量随机抽取考试考题】</div>
                        <table className="table1">
                            <tr>
                                <td >考试名称</td>
                                <td colSpan={5}><Input value={subjectInfo.name} onChange={(e)=>this.changeInfo(e.target.value,'name')} placeholder="考试名称" disabled={checkStatus}/></td>  
                            </tr>
                            <tr>
                                <td>判断题考题数量<span style={{color:'#FF3300'}}>*</span></td>
                                <td><NumberInput value={subjectInfo.judgementNumber }  onChange={(value)=>this.changeInfo(value,'judgementNumber')} placeholder="依据上方填写数字" disabled={checkStatus}/></td>
                                <td>单选题考题数量<span style={{color:'#FF3300'}}>*</span></td>
                                <td><NumberInput value={subjectInfo.singleNumber}  onChange={(value)=>this.changeInfo(value,'singleNumber')} placeholder="依据上方填写数字" disabled={checkStatus}/></td>
                                <td>多选题考题数量<span style={{color:'#FF3300'}}>*</span></td>
                                <td><NumberInput value={subjectInfo.multipleNumber}  onChange={(value)=>this.changeInfo(value,'multipleNumber')} placeholder="依据上方填写数字" disabled={checkStatus}/></td>
                            </tr>
                            <tr>
                                <td >累计考试题数</td>
                                <td colSpan={5}><Input 
                                    value={`已选${parseInt(subjectInfo.judgementNumber||0)+parseInt(subjectInfo.singleNumber||0)+parseInt(subjectInfo.multipleNumber||0)}题`} 
                                    placeholder="自动计算" disabled/></td>  
                            </tr>
                            <tr>
                                <td>判断题每题分值<span style={{color:'#FF3300'}}>*</span></td>
                                <td><NumberInput value={subjectInfo.judgementScore} onChange={(value)=>this.changeInfo(value,'judgementScore')} placeholder="依据上方填写数字" disabled={checkStatus}/></td>
                                <td>单选题每题分值<span style={{color:'#FF3300'}}>*</span></td>
                                <td><NumberInput value={subjectInfo.singleScore} onChange={(value)=>this.changeInfo(value,'singleScore')} placeholder="依据上方填写数字" disabled={checkStatus}/></td>
                                <td>多选题每题分值<span style={{color:'#FF3300'}}>*</span></td>
                                <td><NumberInput value={subjectInfo.multipleScore} onChange={(value)=>this.changeInfo(value,'multipleScore')} placeholder="依据上方填写数字" disabled={checkStatus}/></td>
                            </tr>
                            <tr>
                                <td >累计考试分值</td>
                                <td colSpan={5}>
                                    <Input value={
                                        `共计${parseInt(subjectInfo.judgementNumber||0)*parseInt(subjectInfo.judgementScore||0)
                                        +parseInt(subjectInfo.singleNumber||0)*parseInt(subjectInfo.singleScore||0)
                                        +parseInt(subjectInfo.multipleNumber||0)*parseInt(subjectInfo.multipleScore||0)}分`
                                        } 
                                        placeholder="自动计算" disabled/>
                                </td>
                            </tr>
                            <tr>
                                <td>及格分值<span style={{color:'#FF3300'}}>*</span></td>
                                <td><NumberInput value={subjectInfo.qualifiedScore} onChange={(value)=>this.changeInfo(value,'qualifiedScore')} placeholder="请输入及格分" disabled={checkStatus}/></td>
                                <td>考试时间(分钟)<span style={{color:'#FF3300'}}>*</span></td>
                                <td colSpan={3}><NumberInput value={subjectInfo.examTime} onChange={(value)=>this.changeInfo(value,'examTime')} placeholder="请输入分钟数" disabled={checkStatus}/></td>
                            </tr>
                            <tr>
                                <td>开始日期</td>
                                <td><DatePicker value={subjectInfo.startTime?moment(subjectInfo.startTime):null}  onChange={(date)=>this.changeInfo(date,'startTime')} showTime={true} placeholder="请输入开始时间" format="YYYY-MM-DD HH:mm:ss" disabled={checkStatus}/></td>
                                <td>结束日期</td>
                                <td><DatePicker value={subjectInfo.endTime?moment(subjectInfo.endTime):null}  onChange={(date)=>this.changeInfo(date,'endTime')} showTime={true} placeholder="请输入结束时间" format="YYYY-MM-DD HH:mm:ss" disabled={checkStatus}/></td>
                            </tr>
                        </table>
                    </div>
            </div>
            
        )
    }
}
export default Form.create({})(AddForm);
{/* <Col span={8}>
                        <FormItem label="及格分数" {...formItemLayout}>
                            {
                                getFieldDecorator('qualifiedScore',{
                                    initialValue:subjectInfo.qualifiedScore
                                })(
                                    <Input type="text" placeholder="及格分数" disabled={checkStatus}/>
                                )
                            }
                        </FormItem>
                    </Col> */}


                    {/* <Row>
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
                </Row> */}


            {/* 穿梭框 */}
                {/* <Transfer
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
                </Transfer> */}