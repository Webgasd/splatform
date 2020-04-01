import React,{Component} from 'react';
import {Form, Button, Select, Row, Col, Input, Card} from 'antd';
import ETable from '../../../components/ETable';
import Utils from "../../../utils";
import axios from "../../../axios";
import "./style.less"
import AddMain from './AddMain'

const Option = Select.Option;
const { TextArea } = Input;
const ButtonGroup = Button.Group;

class AddForm extends Component{
    state={
        msgIndex:0
    }

    changeMsgIndex(index){
        this.setState({
            msgIndex:index
        })
    }

    // handleInputChange(event) {
    //     const target = event.target;
    //     const value = target.type === 'checkbox' ? target.checked : target.value;
    //     const name = target.name;
    //
    //     this.setState({
    //         [name]: value
    //     });
    // }

    render(){
        const { getFieldDecorator } = this.props.form;
        const formItemLayout = {
            labelCol: {span:8},
            wrapperCol: {span: 16}
        };
        return (
            <Form layout="inline">
                <div className='msgIndexBox'>
                    <div className={this.state.msgIndex === 0?'msgIndex showIndex':'msgIndex'} onClick={this.changeMsgIndex.bind(this,0)}>基本信息</div>
                    <div className={this.state.msgIndex === 1?'msgIndex showIndex':'msgIndex'} onClick={this.changeMsgIndex.bind(this,1)}>文书处理</div>
                </div>
                <div className='msgContent'>
                    <div className='commonEnterpriseBox' style={{display:this.state.msgIndex === 0?'block':'none'}}>
                        <AddMain/>
                    </div>
                    {/*<div className='commonEnterpriseBox' style={{display:this.state.msgIndex === 0?'block':'none'}}>*/}
                        {/*<div className='commonEnterpriseBoxHead'>检查要点项处理</div>*/}
                        {/*<KeyMsg/>*/}
                    {/*</div>*/}
                    {/*<div className='commonEnterpriseBox' style={{display:this.state.msgIndex === 0?'block':'none'}}>*/}
                        {/*<div className='commonEnterpriseBoxHead'>检查结果信息</div>*/}
                        {/*<ResultMsg/>*/}
                    {/*</div>*/}
                    {/*<div className='commonEnterpriseBox' style={{display:this.state.msgIndex === 0?'block':'none'}}>*/}
                        {/*<div className='commonEnterpriseBoxHead'>附件信息</div>*/}
                        {/*<ExtraMsg/>*/}
                    {/*</div>*/}

                    {/*<div className='commonEnterpriseBox' style={{display:this.state.msgIndex === 1?'block':'none'}}>*/}
                        {/*<div className='commonEnterpriseBoxHead'>文书处理</div>*/}
                        {/*<TextMsg />*/}
                    {/*</div>*/}
                </div>
            </Form>
        );
    }
}
export default Form.create({})(AddForm);



// class KeyMsg extends Component{
//     state={}
//     params = {
//         page:1
//     }
//     componentDidMount(){
//         this.requestList();
//     }
//     requestList = ()=>{
//         let _this = this;
//         axios.ajax({
//             url:'/extramsg.json',
//             data:{
//                 params:{}
//             }
//         }).then((res)=>{
//             if(res.status == 'success'){
//                 let list  = res.result.item_list.map((item,i)=>{
//                     item.key = i;
//                     return item;
//                 })
//                 this.setState({
//                     list:list,
//                     pagination:Utils.pagination(res,(current)=>{
//                         _this.params.page = current;
//                         _this.requestList();
//                     })
//                 })
//             }
//         })
//     }
//
//     // 查询表单
//     handleFilterSubmit = (filterParams) => {
//         this.params = filterParams;
//         this.requestList();
//     };
//
//
//
//     render() {
//         const columns = [
//             {
//                 title: '项目',
//                 dataIndex: 'largeClassName'
//             }, {
//                 title: '编号',
//                 dataIndex: 'seq'
//             },
//             {
//                 title: '核查内容',
//                 dataIndex: 'clauseName'
//             },
//             {
//                 title: '重要性',
//                 dataIndex: 'important'
//             },
//             {
//                 title: '结果判定',
//                 dataIndex: 'operation',
//                 render: (text, item) => {
//                     return <Row>
//                         <Col span={12}>
//                             <Button type="primary" size="small" onClick={() => { this.handleOperator('detail',item)}}>查看</Button>
//                         </Col>
//                         <Col span={12}>
//                             <Button type="primary" size="small" onClick={() => {
//                                 this.handleDaily(item.key)
//                             }}>日志</Button>
//                         </Col>
//                     </Row>
//                 }
//             },
//             {
//                 title: '重要性',
//                 dataIndex: 'important'
//             },
//             {
//                 title: '操作',
//                 dataIndex: 'operator'
//             }
//         ];
//
//         return (
//             <div>
//                 <Card style={{marginTop:10}}>
//                     <div className='button-box'>
//                         <Button type="primary"  size="small" onClick={this.handleAdd}>全选符合</Button>
//                         <Button type="primary"  size="small" onClick={this.handleAdd}>全选不符合</Button>
//                         <Button type="primary"  size="small" onClick={this.handleAdd}>全选合理缺项</Button>
//                         <Button type="primary"  size="small" onClick={this.handleAdd}>全选未处理</Button>
//                     </div>
//                     <div style={{marginTop:30}}>
//                     <ETable
//                         updateSelectedItem={Utils.updateSelectedItem.bind(this)}
//                         selectedRowKeys={this.state.selectedRowKeys}
//                         selectedIds={this.state.selectedIds}
//                         selectedItem={this.state.selectedItem}
//                         dataSource={this.state.list}
//                         pagination={this.state.pagination}
//                         columns={columns}
//                         row_selection='checkbox'
//                     />
//                     </div>
//                 </Card>
//             </div>
//         );
//     }
// }
//
// class ResultMsg extends Component{
//     render() {
//         //const handleInputChange = this.props.handleInputChange.bind(this)
//         return (
//             <div>
//                 <table>
//                     <tbody>
//                     <tr>
//                         <td >检查结果</td>
//                         <Select value={0}>
//                             <Option value={0}>请选择检查结果</Option>
//                             <Option value={1}>aaa</Option>
//                             <Option value={2}>bbb</Option>
//                         </Select>
//                         <td>结果处理</td>
//                         <td colSpan={5}><Input placeholder={"请输入检查地址"}/></td>
//                     </tr>
//                     <tr>
//                         <td>发现问题</td>
//                         <td colSpan={6}><TextArea rows={5} placeholder={"请输入发现问题"}/></td>
//                     </tr>
//                     <tr>
//                         <td>处置措施</td>
//                         <td colSpan={6}><TextArea rows={5} placeholder={"请输入处置措施"}/></td>
//                     </tr>
//                     </tbody>
//                 </table>
//             </div>
//         )
//     }
// }
//
// class ExtraMsg extends Component{
//     state={}
//     params = {
//         page:1
//     }
//     componentDidMount(){
//         this.requestList();
//     }
//     requestList = ()=>{
//         let _this = this;
//         axios.ajax({
//             url:'/extramsg.json',
//             data:{
//                 params:{}
//             }
//         }).then((res)=>{
//             if(res.status == 'success'){
//                 let list  = res.result.item_list.map((item,i)=>{
//                     item.key = i;
//                     return item;
//                 })
//                 this.setState({
//                     list:list,
//                     pagination:Utils.pagination(res,(current)=>{
//                         _this.params.page = current;
//                         _this.requestList();
//                     })
//                 })
//             }
//         })
//     }
//
//     // 查询表单
//     handleFilterSubmit = (filterParams) => {
//         this.params = filterParams;
//         this.requestList();
//     };
//
//
//
//     render() {
//         const columns = [
//             {
//                 title: '食品食品添加剂类别',
//                 dataIndex: 'additive'
//             }, {
//                 title: '类别编号',
//                 dataIndex: 'number'
//             },
//             {
//                 title: '类别名称',
//                 dataIndex: 'type'
//             }
//
//         ];
//
//         return (
//
//             <div>
//                 <Card style={{marginTop:10}}>
//                     <div className='button-box'>
//                         <Button type="primary"  size="small" onClick={this.handleAdd}>上传文件</Button>
//                     </div>
//                     <div style={{marginTop:30}}>
//                     <ETable
//                         updateSelectedItem={Utils.updateSelectedItem.bind(this)}
//                         selectedRowKeys={this.state.selectedRowKeys}
//                         selectedIds={this.state.selectedIds}
//                         selectedItem={this.state.selectedItem}
//                         dataSource={this.state.list}
//                         pagination={this.state.pagination}
//                         columns={columns}
//                         row_selection='checkbox'
//                     />
//                     </div>
//                     <div className='bbbbutton-box'>
//                         <Button type="primary"  size="small" onClick={this.handleAdd}>结束检查</Button>
//                         <Button type="primary"  size="small" onClick={this.handleAdd}>确认</Button>
//                         <Button type="primary"  size="small" onClick={this.handleAdd}>取消</Button>
//                         <Button type="primary"  size="small" onClick={this.handleAdd}>添加文书</Button>
//                     </div>
//                 </Card>
//             </div>
//         );
//     }
// }
//
// class TextMsg extends Component{
//     state={}
//     params = {
//         page:1
//     }
//     componentDidMount(){
//         this.requestList();
//     }
//     requestList = ()=>{
//         let _this = this;
//         axios.ajax({
//             url:'/rewardmsg.json',
//             data:{
//                 params:{}
//             }
//         }).then((res)=>{
//             if(res.status == 'success'){
//                 let list  = res.result.item_list.map((item,i)=>{
//                     item.key = i;
//                     return item;
//                 })
//                 this.setState({
//                     list:list,
//                     pagination:Utils.pagination(res,(current)=>{
//                         _this.params.page = current;
//                         _this.requestList();
//                     })
//                 })
//             }
//         })
//     }
//
//     render() {
//         const columns = [
//             {
//                 title: '检查日期',
//                 dataIndex: 'project'
//             }, {
//                 title: '文书名称',
//                 dataIndex: 'content'
//             },
//             {
//                 title: '是否公示',
//                 dataIndex: 'person'
//             },
//             {
//                 title: '操作',
//                 dataIndex:'operation',
//                 render:(text, item)=>{
//                     return <ButtonGroup >
//                     </ButtonGroup>
//                 }}
//         ];
//
//         return (
//             <div>
//
//                 <Card className="ccccard" style={{marginTop:10}}>
//
//                     {/*使用封装好的ETable组件实现角色列表的展示*/}
//                     <ETable
//                         updateSelectedItem={Utils.updateSelectedItem.bind(this)}
//                         selectedRowKeys={this.state.selectedRowKeys}
//                         selectedIds={this.state.selectedIds}
//                         selectedItem={this.state.selectedItem}
//                         dataSource={this.state.list}
//                         pagination={this.state.pagination}
//
//                         columns={columns}
//                         row_selection = 'checkbox'
//                     />
//                     <div className='bbbbutton-box'>
//                         <Button type="primary"  size="small" onClick={this.handleAdd}>结束检查</Button>
//                         <Button type="primary"  size="small" onClick={this.handleAdd}>确认</Button>
//                         <Button type="primary"  size="small" onClick={this.handleAdd}>取消</Button>
//                         <Button type="primary"  size="small" onClick={this.handleAdd}>添加文书</Button>
//                     </div>
//                 </Card>
//             </div>
//
//         );
//     }
// }