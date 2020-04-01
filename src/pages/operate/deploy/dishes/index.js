import React,{Component} from 'react';
import CommonPage from './../../../../components/CommonPage';

const quireList = [
    {
        type: 'INPUT',
        label: '菜品类别',
        field: 'type'
    }
];
const baseColumns = [
    {
        title:"菜品类别",
        dataIndex:"type"
    }
];
const formList = [
    {
        type: 'INPUT',
        label: '菜品类别',
        field: 'type'
    }
];

export default class Dishes extends Component{
    render() {
        return (
            <CommonPage
                quireList={quireList}
                baseColumns={baseColumns}
                formList={formList}
                baseUrl='/formatoriginfood'
            />
        );
    }
}