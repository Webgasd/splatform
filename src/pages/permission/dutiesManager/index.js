import React,{Component} from 'react';
import CommonPage from '../../../components/CommonPage';

const quireList = [
    {
        type: 'INPUT',
        label: '名称',
        field: 'name',
    }
];
const baseColumns = [
    {
        title: '名称',
        dataIndex: 'name'
    },{
        title: '顺序',
        dataIndex: 'seq'
    },
];

const formList = [
    {
        type: 'INPUT',
        label: '名称',
        field: 'name',
    }, {
        type: 'INPUT',
        label: '顺序',
        field: 'seq'
    },{
        type: 'TextArea',
        label: '备注',
        field: 'remark',
        rows:3
    }
];

export default class Industry extends Component{
    render() {
        return (
            <CommonPage
                quireList={quireList}
                baseColumns={baseColumns}
                formList={formList}
                baseUrl='/sys/duties'
            />
        );
    }
}