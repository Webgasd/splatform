import React,{Component} from 'react';
import CommonPage from './../../../../../components/CommonPage';

const quireList = [
    {
        type: 'INPUT',
        label: '处置措施',
        field: 'type'
    }
];
const baseColumns = [
    {
        title:"序号",
        dataIndex:"id"
    },{
        title:"处置措施",
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
        label: '处置措施',
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
                baseUrl='/spotCheckDisposalType'
            />
        );
    }
}