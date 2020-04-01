import React,{Component} from 'react';
import CommonPage from './../../../components/CommonPage';

const quireList = [
    {
        type: 'SELECT',
        label: '行业类别',
        field: 'industry',
        width: 150,
        list: [{id: 1, name: '餐饮行业'}, {id: 2, name: '小餐饮'}, {id: 3, name: '大酒店'}]
    },{
        type: 'INPUT',
        label: '食品、食品添加剂类别',
        field: 'parentName',
    },{
        type: 'INPUT',
        label: '类别名称',
        field: 'name',
    }
];
const baseColumns = [
    {
        title: '行业分类',
        dataIndex: 'industry'
    },{
        title: '序号',
        dataIndex: 'seq'
    }, {
        title: '食品、食品添加剂类别',
        dataIndex: 'parentName',
    }, {
        title: '类别编号',
        dataIndex: 'code',
    },{
        title: '类别名称',
        dataIndex: 'name',
    }
];

const formList = [
    {
        type: 'SELECT',
        label: '行业类别分类',
        field: 'industry',
        width: '100%',
        list: [{id: 1, name: '餐饮行业'}, {id: 2, name: '小餐饮'}, {id: 3, name: '大酒店'}]
    }, {
        type: 'INPUT',
        label: '序号',
        field: 'seq'
    },{
        type: 'INPUT',
        label: '食品，食品添加剂类别',
        field: 'parentName'
    },{
        type: 'INPUT',
        label: '类别编号',
        field: 'code'
    },
    {
        type: 'TextArea',
        label: '类别名称',
        field: 'name',
        rows:3
    },  {
        type: 'TextArea',
        label: '品种明细',
        field: 'breedDetail',
        rows:3
    },  {
        type: 'TextArea',
        label: '备注',
        field: 'remark',
        rows:3
    }
];

export default class bigclass extends Component{
    render() {
        return (
            <CommonPage
                quireList={quireList}
                baseColumns={baseColumns}
                formList={formList}
                baseUrl='/supervision/produce'
            />
        );
    }
}