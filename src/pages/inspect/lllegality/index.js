import React,{Component} from 'react';
import CommonPage from './../../../components/CommonPage';

const quireList = [
    {
        type: 'INPUT',
        label: '名称',
        field: 'name',
    }
];
const baseColumns = [
    {
        title: '序号',
        dataIndex: 'id'
    },  {
        title: '名称',
        dataIndex: 'name',
    }
];
const formList = [
    {
        type: 'INPUT',
        label: '名称',
        field: 'name'
    }
];

export default class Lllegality extends Component{
    render() {
        return (
            <CommonPage
                quireList={quireList}
                baseColumns={baseColumns}
                formList={formList}
                baseUrl='/inspect/lllegality'
            />
        );
    }
}