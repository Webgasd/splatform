import React,{Component} from 'react';
import CommonPage from './../../../components/CommonPage';

const quireList = [
    {
        type: 'INPUT',
        label: '文书名称',
        field: 'bookName',
    },
    {
        type: 'SELECT',
        label: '类型',
        field: 'bookType',
        width: 150,
        list: [{id: 1, name: '餐饮行业'}]
    }
];
const baseColumns = [
    {
        title: '顺序',
        dataIndex: 'seq'
    },
    {
        title: '文书名称',
        dataIndex: 'bookName'
    }, {
        title: '文书模板路径',
        dataIndex: 'bookUrl'
    }
];

const formList = [
    {
        type: 'SELECT',
        label: '类型',
        field: 'bookType',
        width: '100%',
        list: [{id: 1, name: '餐饮行业'}]
    },
    {
        type: 'INPUT',
        label: '顺序',
        field: 'seq'
    },{
        type: 'INPUT',
        label: '文书名称',
        field: 'bookName'
    },
    {
        type: 'INPUT',
        label: '文书模板路径',
        field: 'bookUrl'
    }
];

export default class bigclass extends Component{
    render() {
        return (
            <CommonPage
                quireList={quireList}
                baseColumns={baseColumns}
                formList={formList}
                baseUrl='/inspect/bookConf'
            />
        );
    }
}

