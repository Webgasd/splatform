import React,{Component} from 'react';
import CommonPage from './../../../../../components/CommonPage';

const quireList = [
    {
        type: 'INPUT',
        label: '食品类别',
        field: 'type'
    }
];
const baseColumns = [
    {
        title:"序号",
        dataIndex:"id"
    },{
        title:"食品类别",
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
        label: '食品类别',
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
                baseUrl='/spotCheckFoodType'
            />
        );
    }
}