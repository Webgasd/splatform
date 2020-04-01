import React,{Component} from 'react';
import CommonPage from './../../../../../components/CommonPage';

const quireList = [
    {
        type: 'INPUT',
        label: '日期类型',
        field: 'type'
    }
];
const baseColumns = [
    {
        title:"序号",
        dataIndex:"id"
    },{
        title:"日期类型",
        dataIndex:"type"
    }
];
const formList = [
    {
        title:"序号",
        dataIndex:"id"
    },
    {
        type: 'INPUT',
        label: '日期类型',
        field: 'type'
    }
];

export default class Category extends Component{
    render() {
        return (
            <CommonPage
                quireList={quireList}
                baseColumns={baseColumns}
                formList={formList}
                baseUrl='/spotCheckDateType'
            />
        );
    }
}