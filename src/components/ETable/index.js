import React from 'react'
import {Table} from 'antd'
import  "./style.less"

export default class ETable extends React.Component {

    state = {}
    //处理行点击事件
    onRowClick = (record, index) => {
        let row_selection = this.props.row_selection;
        if(row_selection == 'checkbox'){//eslint-disable-line
            let selectedRowKeys = this.props.selectedRowKeys;
            let selectedIds = this.props.selectedIds;
            if (selectedIds) {
                const i = selectedIds.indexOf(record.id);
                if (i == -1) {
                    selectedIds.push(record.id)
                    selectedRowKeys.push(index);
                }else{
                    selectedIds.splice(i,1);
                    selectedRowKeys.splice(i,1);
                    //删除指条目
                }
            } else {
                selectedIds = [record.id];
                selectedRowKeys = [index]
            }
            this.props.updateSelectedItem(selectedRowKeys,record || {},selectedIds);
        }else{
            let selectKey = [index];
            const selectedRowKeys = this.props.selectedRowKeys;
            if (selectedRowKeys && selectedRowKeys[0] == index){
                return;
            }
            let selectedIds = [record.id];
            this.props.updateSelectedItem(selectKey,record || {},selectedIds);
        }
    };

    // 选择框变更
    onSelectChange = (selectedRowKeys, selectedRows) => {
        const selectedIds = [];
            selectedRows.map((item)=>{
                selectedIds.push(item.id);
            });
          this.props.updateSelectedItem(selectedRowKeys,selectedRows[0] || {},selectedIds);
           //console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows);
    };

    onSelectAll = (selected, selectedRows) => {
        let selectedIds = [];
        let selectKey = [];
        selectedRows.forEach((item,i)=> {
            selectedIds.push(item.id);
            selectKey.push(i);
        });
        this.props.updateSelectedItem(selectKey,selectedRows[0] || {},selectedIds);
    }

    getOptions = () => {
        const { selectedRowKeys } = this.props;
        const rowSelection = {
            type: 'radio',
            selectedRowKeys,
            onChange: this.onSelectChange,
            onSelectAll:this.onSelectAll
        };
        let row_selection = this.props.row_selection;
        if(row_selection == 'checkbox'){
             //设置类型未复选框
             rowSelection.type = 'checkbox';
         }
        return <Table
            className="card-wrap page-table"
            bordered
            rowClassName={this.props.rowClassName}
            dataSource={this.props.dataSource}
            columns={this.props.columns}
            pagination={this.props.pagination}
            rowSelection={rowSelection}
            onRow={(record,index) => ({
                onClick: ()=>{
                    if(!row_selection){
                        return;
                    }
                    this.onRowClick(record,index)
                }
            })}
        />
    };
    render = () => {
        return (
            <div>
                {this.getOptions()}
            </div>
        )
    }
}