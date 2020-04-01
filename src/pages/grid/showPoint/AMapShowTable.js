import {Table, Button, Modal} from 'antd';
import React from 'react'
// import AlterForm from './AlterForm'
import AddLocation from './Location'
import {commonUrl} from "../../../axios/commonSrc";
import axios from "../../../axios";

let address='';
let id=''
class pointTable extends React.Component {
    state = {
        selectedRowKeys: [], // Check here to configure the default column
        loading: false,
        data:[],
        visible:false,
        values:[],
        visible1:false,
        address:''
    };
    alter=(record)=>{
        this.setState({
            visible:true,
            values:record
        })
    }
    location=(addressValue,idValue)=>{
        this.setState({
            visible1:true,
            address
        })
        address=addressValue
        id=idValue
        console.log(address)
    };
    handleOk = e => {
        this.setState({
            visible: false,
        });
    };
    handleCancel = e => {
        this.setState({
            visible: false,
        });

    };
    handleOk1 = e => {
        this.setState({
            visible1: false,
        });
    };
    handleCancel1 = e => {
        this.setState({
            visible1: false,
        });
    };
    componentDidMount() {
        this.getdata();
    }
    getdata(){
        // const url=commonUrl+"/grid/points/getAll";
        // fetch(url, {
        //     method : 'POST',
        //     mode:"cors",
        // }).then(res =>res.json())
        //     .then(data=>{
        //         console.log(data)
        //         this.setState({
        //             data:data.data
        //         })
        //     })
        axios.ajax({
            url:"/grid/points/getAll",
            data: {
                params:{}
            }
        }).then((res)=>{
            if(res.status == "success"){
                this.setState({
                    data:res.data
            })
            }
        })
    }
    start = () => {
        this.setState({ loading: true });
        setTimeout(() => {
            this.setState({
                selectedRowKeys: [],
                loading: false,
            });
        }, 1000);
    };

    onSelectChange = selectedRowKeys => {
        console.log('selectedRowKeys changed: ', selectedRowKeys);
        this.setState({ selectedRowKeys });
    };

    render() {
        const { loading, selectedRowKeys } = this.state;
        const rowSelection = {
            selectedRowKeys,
            onChange: this.onSelectChange,
        };
        const hasSelected = selectedRowKeys.length > 0;
        const columns = [
            {
                title: '区域id',
                dataIndex: 'areaid',
                key:'areaid'
            }, {
                title: '名字',
                dataIndex: 'pointname',
                key:'pointname'
            }, {
                title: '信息',
                dataIndex: 'infomation',
                key:'infomation'
            }, {
                title: '负责人',
                dataIndex: 'charger',
                key:'charger'
            }, {
                title: '电话',
                dataIndex: 'phone',
                key:'phone'
            }, {
                title: '地址',
                dataIndex: 'address',
                key:'address'
            },  {
                title: '点',
                dataIndex: 'point',
                key:'point'
            }, {
                title: '操作',
                dataIndex: 'Action',
                key:'',
                render:(text,record)=>(
                    <div>
                        <Button type={'primary'} onClick={()=>this.alter(record)}>修改</Button>
                        <Button type={'primary'} style={{marginLeft:'3%'}} onClick={()=>this.location(record.address,record.id)}>定位</Button>
                        {/*<Button type={'primary'} onClick={""}>删除</Button>*/}
                    </div>
                )
            },
        ];
        const modal=(<Modal
            title="输入网格地区信息"
            visible={this.state.visible}
            onOk={this.handleOk}
            onCancel={this.handleCancel}
            footer={false}
            destroyOnClose={true}
        >
            {/*<AlterForm values={this.state.values}/>*/}
        </Modal>);
        const modal1=(<Modal
            title="输入网格地区信息"
            visible={this.state.visible1}
            onOk={this.handleOk1}
            onCancel={this.handleCancel1}
            footer={false}
            width={"50%"}
            destroyOnClose={true}
        >
            <AddLocation address={address} id={id}/>
        </Modal>);
        return (
            <div>
                {/*<div style={{ marginBottom: 16 }}>*/}
                    {/*<Button type="primary" onClick={this.start} disabled={!hasSelected} loading={loading}>*/}
                        {/*Reload*/}
                    {/*</Button>*/}
                    {/*<span style={{ marginLeft: 8 }}>*/}
                         {/*{hasSelected ? `Selected ${selectedRowKeys.length} items` : ''}*/}
                     {/*</span>*/}
                {/*</div>*/}
                <Table
                    // rowSelection={rowSelection}
                       columns={columns} dataSource={this.state.data} rowKey={record => record.id}/>
                {modal}
                {modal1}
            </div>
        );
    }
}

export default pointTable