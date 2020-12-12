import React, { Component } from 'react';
import { Table, message } from 'antd';
import axios from '../../../axios'
import Utils from "../../../utils";
import { unitName } from '../../../axios/commonSrc'

class CameraForm extends Component {
    state = {
        cameraList: [],
    }
    params = {
        pageNo: 1,
        pageSize: 10,
        region: unitName
    }
    componentDidMount() {
        this.requestList()
    }


    requestList = () => {
        console.log("执行摄像头列表request")
        let _this = this;
        axios.ajax({
            url: '/HIKResource/getPageCamerasByRegions',
            data: {
                params: {
                    ...this.params,
                    regionIndexCode: this.props.userInfo.indexCode
                }
            }
        }).then((res) => {
            if (!res.data) {
                message.error('无数据')
            }
            if (res.data.code == "0") {
                let cameraList = res.data.data.list.map((item, i) => {
                    item.key = i;
                    return item;
                })
                this.setState({
                    cameraList,
                    total: res.data.data.total,
                    pagination: Utils.pagination(res.data, (current) => {
                        _this.params.pageNo = current;//	当前页数
                        _this.requestList(); //刷新列表数据
                    })
                })
            }
            else if (res.data.code == "0x02401008") {
                alert("权限未开放,请联系管理员")
            }
        })

    }



    render() {
        const columns = [
            {
                title: '区域索引代码',
                dataIndex: 'regionIndexCode',
            },
            {
                title: '相机索引代码',
                dataIndex: 'cameraIndexCode',
            },
            {
                title: '监控点名称',
                dataIndex: 'cameraName',
            },
        ];


        return (
            <div>
                <Table
                    dataSource={this.state.cameraList}
                    columns={columns}
                    pagination={this.state.pagination}
                />
            </div>
        );
    }
}
export default CameraForm