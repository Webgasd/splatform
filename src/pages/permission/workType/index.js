import React,{Component} from 'react';
import CommonPage from '../../../components/CommonPage';
import axios from "../../../axios";

const quireList = [
    {
        type: 'INPUT',
        label: '行业类别',
        field: 'industryCategory',
    },
    {
        type: 'INPUT',
        label: '工作种类',
        field: 'workType',
    },
];
const baseColumns = [
    {
        title: 'id',
        dataIndex: 'key',

    }, {
        title: '行业类型',
        dataIndex: 'industryName'
    },{
        title: '工作种类',
        dataIndex: 'name',

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


export default class Industry extends Component{
    state={industryList:[]}
    componentDidMount() {
        this.requestList();
    }
    requestList=()=>{
        axios.ajax({
            url:'/sys/industry/getList',
            data:{
                params:{}
            }
        }).then((res)=>{
            if(res.status == "success"){
                this.setState({
                    industryList:res.data
                })
            }
        })
    }

    render() {
        const formList = [
            {
                type: 'SELECT',
                label: '行业类别',
                field: 'industryId',
                width: '100%',
                list: this.state.industryList
            }, {
                type: 'INPUT',
                label: '工作种类',
                field: 'name'
            }
        ];
        return (
            <CommonPage
                quireList={quireList}
                baseColumns={baseColumns}
                formList={formList}
                baseUrl='/sys/workType'
            />
        );
    }
}