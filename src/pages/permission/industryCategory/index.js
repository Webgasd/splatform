import React,{Component} from 'react';
import CommonPage from '../../../components/CommonPage';

const quireList = [
    {
        type: 'INPUT',
        label: '行业类别名称',
        field: 'name',
    },{
        type: 'INPUT',
        label: '编号',
        field: 'number',
    }
];
const baseColumns = [
    {
        title: '行业类型名称',
        dataIndex: 'name'
    },{
        title: '行业类型编码',
        dataIndex: 'number'
    }, {
        title: '许可名称',
        dataIndex: 'premissName',
    },{
        title: '开启状态',
        dataIndex: 'status',
        render(status){
            if(status===0){
                return '开启';
            }else{
                return '关闭';
            }
        }
    }
];

const formList = [
    {
        type: 'INPUT',
        label: '行业类别名称',
        field: 'name',
    }, {
        type: 'INPUT',
        label: '行业类别编码',
        field: 'number'
    },{
        type: 'INPUT',
        label: '许可名称',
        field: 'premissName'
    },{
        type: 'INPUT',
        label: '索引',
        field: 'remark'
    },{
        type: 'SELECT',
        label: '状态',
        field: 'status',
        width: '100%',
        list: [{id: 0, name: '开启'}, {id: 1, name: '关闭'}]
    }
];

export default class Industry extends Component{
    render() {
        return (
            <CommonPage
                quireList={quireList}
                baseColumns={baseColumns}
                formList={formList}
                baseUrl='/sys/industry'
            />
        );
    }
}