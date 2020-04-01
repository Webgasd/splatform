import React,{Component} from 'react';
import CommonPage from './../../../components/CommonPage';

const quireList = [
    {
        type: 'INPUT',
        label: '食品添加剂类别',
        field: 'name'
    }
];
const baseColumns = [
    {
        title: '排序',
        dataIndex: 'seq'
    }, {
        title: '食品、食品添加剂类别',
        dataIndex: 'name'
    },  {
        title: '备注',
        dataIndex: 'remark',
    }
];

const formList = [
    {
        type: 'INPUT',
        label: '排序',
        field: 'seq'
    },{
        type: 'INPUT',
        label: '类别名称',
        field: 'name'
    },
    {
        type: 'INPUT',
        label: '备注',
        field: 'remark'
    }
];

export default class bigclass extends Component{
    render() {
        return (
            <CommonPage
                quireList={quireList}
                baseColumns={baseColumns}
                formList={formList}
                baseUrl='/supervision/bigClass'
            />
        );
    }
}

