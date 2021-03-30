import React, { Component } from 'react'
import { Row, Col, Input,Select,Modal,Transfer,Table,DatePicker,Button} from 'antd'
import axios from "../../../axios";
import difference from 'lodash/difference';
import moment from "moment";
const { TextArea } = Input;
const { Option } = Select;
const { RangePicker } = DatePicker;

class AddForm extends Component {
    state = {
        class: '',
        mockData: this.props.mockData,
        targetKeys:[],
        isModalVisible: false,
        isSelectVisible: false,
        regionString:''
    }
    params = {
        pageNo: 1
    }
    changeInput = (data, option) => {
        let value = this.props.sourceData
        value[option] = data
        this.props.dispatchInformData(value)
    }
    componentDidMount() {
    }
    
    //选择区域
    //穿梭框改变选择
    onChange = nextTargetKeys => {
        this.setState({ targetKeys: nextTargetKeys });
    };
    
    handleRegion = () => {
        const valueSelect = this.state.targetKeys||[]
        const list = valueSelect.map((item,index)=>{
            const region = this.state.mockData.find(
                data => parseInt(item) === data.id
            )
            return region.name
        })
        this.changeInput(this.state.targetKeys,'areaList')
        this.changeInput(list.toString(),'area')
        this.setState({
            isModalVisible:false,
            regionString:list.toString()
        })
    }

    handlTime = (date, dateString)=>{
        console.log("data",date,"dateString",dateString);
        let taskLimitStart = dateString[0]
        let taskLimitEnd = dateString[1]
        this.changeInput(taskLimitStart, "taskLimitStart")
        this.changeInput(taskLimitEnd, "taskLimitEnd")
    }
    
    render() {
        let status = this.props.status=='detail'? true:false
        let {taskType,sourceData,releaseStatus} = this.props
        console.log(sourceData.taskLimitStart)
        const dateFormat = 'YYYY-MM-DD'||undefined;
        //穿梭框
        const TableTransfer = ({ leftColumns, rightColumns, ...restProps }) => (
            <Transfer {...restProps} showSelectAll={false} >
                {({
                    direction,
                    filteredItems,
                    onItemSelectAll,
                    onItemSelect,
                    selectedKeys: listSelectedKeys,
                    disabled: listDisabled,
                }) => {
                    const columns = direction === 'left' ? leftColumns : rightColumns;
                    const pagination = direction === 'left' ? this.state.pagination : true;
                    const rowSelection = {
                        getCheckboxProps: item => ({ disabled: listDisabled || item.disabled }),
                        onSelectAll(selected, selectedRows) {
                            const treeSelectedKeys = selectedRows
                                .filter(item => !item.disabled)
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
                            rowSelection={rowSelection}
                            columns={columns}
                            dataSource={filteredItems}
                            size="small"
                            pagination
                            style={{ pointerEvents: listDisabled ? 'none' : null }}
                            onRow={({ key, disabled: itemDisabled }) => ({
                                onClick: () => {
                                    if (itemDisabled || listDisabled) return;
                                    onItemSelect(key, !listSelectedKeys.includes(key));
                                },
                            })}
                        />
                    );
                }}
            </Transfer>
        );

        const leftTableColumns = [
            {
                dataIndex: 'name',
                title: '乡镇（街道）',
            }
        ];
        const rightTableColumns = [
            {
                dataIndex: 'name',
                title: '乡镇（街道）',
            },
        ];
        return (
            <div>
                <Row style={{marginTop:10}}>
                    <Col span={3} style={{textAlign:'right',fontSize:15}}>发布人：</Col>
                    <Col span={4}><Input placeholder='请输入内容' value={sourceData.author} onChange={(e)=>this.changeInput(e.target.value,'author')} disabled={status} /></Col>
                    <Col span={3} style={{textAlign:'right',fontSize:15}}>发布日期：</Col>
                    <Col span={4}><DatePicker  value={sourceData.issueDate==undefined?null:moment(sourceData.issueDate, dateFormat)} format={dateFormat} onChange={(dataString)=>this.changeInput(dataString,'issueDate')} disabled={status}/></Col>
                    <Col span={3} style={{textAlign:'right',fontSize:15}}>发布状态：</Col>
                    <Col span={4}>
                            <Select value={sourceData.taskStatus}  style={{ width: 120 }} onChange={(value) => this.changeInput(value, 'taskStatus')} disabled={status}>
                                {releaseStatus.map((item) => {
                                    return <Option key={item.taskStatus} value={item.taskStatus}>{item.className}</Option>
                                })}
                             </Select>
                    </Col>
                </Row>
                <Row style={{marginTop:10}}>
                    <Col span={3} style={{textAlign:'right',fontSize:15}}>任务标题：</Col>
                    <Col span={15}><Input placeholder='请输入内容' value={sourceData.taskTitle} onChange={(e)=>this.changeInput(e.target.value,'taskTitle')} disabled={status} /></Col>
                </Row>
                <Row style={{marginTop:10}}>
                    <Col span={3} style={{textAlign:'right',fontSize:15}}>任务期限：</Col>
                    <Col span={10}>
                        <RangePicker 
                         format={dateFormat} 
                         disabled={status}
                         onChange={this.handlTime}
                         value={sourceData.taskLimitStart===undefined||sourceData.taskLimitEnd===undefined||sourceData.taskLimitStart==''||sourceData.taskLimitEnd==''
                            ?null:[moment(sourceData.taskLimitStart, dateFormat), moment(sourceData.taskLimitEnd, dateFormat)]}
                         />
                    </Col>
                    <Col span={3} style={{textAlign:'right',fontSize:15}}>任务类型：</Col>
                    <Col span={7}>
                            <Select value={sourceData.taskType}  style={{ width: 120 }} onChange={(value) => this.changeInput(value, 'taskType')} disabled={status}>
                                {taskType.map((item) => {
                                    return <Option key={item.id} value={item.id}>{item.className}</Option>
                                })}
                             </Select>
                    </Col>
                </Row>
                <Row style={{marginTop:10}}>
                    <Col span={3} style={{textAlign:'right',fontSize:15}}>开展区域：</Col>
                    <Col span={15}><Input placeholder='请输入内容' value={sourceData.area} onChange={(e)=>this.changeInput(sourceData.areaLis,'areaList')} disabled={status} /></Col>
                    <Col span={3}><Button onClick={()=>this.setState({isModalVisible:true})} disabled={status}>点击选择</Button></Col>
                </Row>
                <Row style={{marginTop:10}}>
                    <Col span={3} style={{textAlign:'right',fontSize:15}}>内容：</Col>
                    <Col span={18}><TextArea rows={8} placeholder='请输入内容' value={sourceData.taskContent}  onChange={(e) => this.changeInput(e.target.value, 'taskContent')} disabled={status}/></Col>
                 </Row>
                 <Modal
                    width='800px'
                    title='区域列表'
                    visible={this.state.isModalVisible}
                    onOk={() => {this.handleRegion()}}
                    onCancel={() => { this.setState({ isModalVisible: false }) }}
                >
                    <TableTransfer
                        dataSource={this.state.mockData}
                        targetKeys={this.state.targetKeys}
                        disabled={false}
                        showSearch={true}
                        onChange={this.onChange}
                        filterOption={(inputValue, item) =>
                            item.name.indexOf(inputValue) !== -1
                        }
                        leftColumns={leftTableColumns}
                        rightColumns={rightTableColumns}
                    />
                </Modal>
            </div>
        )
    }
}

export default AddForm
