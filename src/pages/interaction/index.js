import React,{Component} from 'react';
import { Card,Button,Modal,Collapse } from 'antd';
import ETable from '../../components/ETable';
import  BaseForm  from '../../components/BaseForm';
import AddForm from './AddForm';
import Utils from "../../utils";
import axios from "../../axios";
import BraftEditor from "braft-editor";
import Detail from './DetailForm';
import './style.less';
const Panel = Collapse.Panel;
const ButtonGroup = Button.Group;
const confirm = Modal.confirm;
const formList = [
    {
        type: 'INPUT',
        label: '标题',
        field: 'title',
    },{
        type: 'INPUT',
        label: '作者',
        field: 'author',
    }
]

export default class Notice extends Component{
    state = {
        selectedRowKeys: [], // Check here to configure the default column
        compress:0
    };
    params = {
        pageNo:1
    }

    componentDidMount(){
        this.requestList();
    }
    requestList = ()=>{
        let _this = this;
        axios.ajax({
            url:'/sys/news/getPage',
            data:{
                params:{..._this.params}
            }
        }).then((res)=>{
            if(res.status == "success"){
                let list  = res.data.data.map((item,i)=>{
                    item.key = i;
                    return item;
                })
                this.setState({
                    list:list,
                    pagination:Utils.pagination(res,(current)=>{
                        _this.params.pageNo = current;//	当前页数
                        _this.requestList(); //刷新列表数据
                    })
                })
            }
        })
    }

    // 查询表单
    handleFilterSubmit = (filterParams) => {
        this.params = filterParams;
        this.requestList();
    };

    handleAdd = ()=>{
        this.setState({
            isVisible:true
        })
    }
    //压缩函数
    compress = (base64String, w, quality) => {
        let getMimeType = (urlData) => {
            let arr = urlData.split(',');
            let mime = arr[0].match(/:(.*?);/)[1];
            return mime;
        };
        let newImage = new Image();
        let imgWidth, imgHeight;
 
        // let promise = new Promise(resolve => newImage.onload = resolve);
        newImage.src = base64String;
        return (() => {
            imgWidth = newImage.width;
            imgHeight = newImage.height;
            let canvas = document.createElement("canvas");
            let ctx = canvas.getContext("2d");
            if (Math.max(imgWidth, imgHeight) > w) {
                if (imgWidth > imgHeight) {
                    canvas.width = w;
                    canvas.height = w * imgHeight / imgWidth;
                } else {
                    canvas.height = w;
                    canvas.width = w * imgWidth / imgHeight;
                }
            }else{
                canvas.width = imgWidth;
                canvas.height = imgHeight;
            }
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.drawImage(newImage, 0, 0, canvas.width, canvas.height);
            let base64 = canvas.toDataURL(getMimeType(base64String), quality);
            return base64;
        })
    }

    handleSubmit = ()=>{
        let type = this.state.type;
        let data=this.state.newsData;
        data.content=data.content.toHTML();
        if(this.state.compress==1){
            console.log("压缩前：",data.content)
            let patt = /<img[^>]+src=['"]([^'"]+)['"]+/g;
            let result = [],temp;
            while ((temp = patt.exec(data.content)) != null) {
                result.push({'url':temp[1]});
            }
            // console.log(result)
            result.map((item)=>{
               let val = this.compress(item.url,400,0.5)
               data.content = data.content.replace('<img','<img style=\"width:400px\"')
               data.content =  data.content.replace(item.url,val)
               console.log('data.content',data.content)
            })
        }
        data.enclosure=this.state.picture;
        data.checkPerson = data.pid;
        console.log('data',data)
      //  delete data.id
        axios.PostAjax({
            url:type=='create'?'/sys/news/insert':'/sys/news/update',
            data:{
                params:{
                    ...data,
                }
            }
        }).then((res)=>{
            if(res){
                this.setState({
                    isVisible:false,
                    newsData:{},
                    picture:[],
                    imageUrl:'',
                    compress:0
                })
                this.requestList();
            }
        })
    }

    start = () => {

        // ajax request after empty completing
        this.setState({
            selectedRowKeys: [],
        })
    }

    handleDelete = ()=>{
        let item = this.state.selectedItem;
        let _this = this;
        if(!item){
            Modal.info({
                title: '信息',
                content: '请选择一个用户'
            })
            return;
        }
        Modal.confirm({
            content:'确定要删除此用户吗？',
            onOk:()=>{
                axios.ajax({
                    url:'/post.json',
                    data:{
                        params:{
                            id:item.id
                        }
                    }
                }).then((res)=>{
                    if(res.status == "success"){
                        _this.setState({
                            isVisible:false
                        })
                        _this.requestList();
                    }
                })
            }
        })
    }
    onSelectChange = (selectedRowKeys) => {
        Modal.info('selectedRowKeys changed: ', selectedRowKeys);
        this.setState({ selectedRowKeys });
    }

    handleOperator = (type,item)=>{
        if(type =='create'){
            this.setState({
                title:'创建通知',
                isVisible:true,
                type
            })
        }else if(type=="edit"){
            axios.ajax({
                url:'/sys/news/getById',
                data:{
                    params:{
                        id:item.id
                    }
                }
            }).then((res)=>{
                if(res.status =='success'){
                    let newsData = res.data;
                    newsData.checkPerson=newsData.name;
                    newsData.content = BraftEditor.createEditorState(newsData.content)
                    this.setState({
                        title:type=='edit'?'编辑信息':'查看详情',
                        isVisible:true,
                        newsData,
                        picture:JSON.parse(newsData.enclosure||JSON.stringify([])),
                        type
                    })
                }
            })
        }else if(type=="weixin"){
            console.log(this.state.selectedIds);
            axios.ajax({
                url:'/sys/news/weixin',
                data:{
                    params:{
                        ids:this.state.selectedIds.join(",")
                    }
                }
            }).then((res)=>{
                if(res.status =='success'){
                    Modal.success({
                        title: '提交完成',
                        content: '已提交消息到公众号!'
                    })
                }
            })
        }
        else if(type=='detail'){
            axios.ajax({
                url:'/sys/news/getById',
                data:{
                    params:{
                        id:item.id
                    }
                }
            }).then((res)=>{
                if(res.status =='success'){
                    let newsData = res.data;
                    this.setState({
                        title:type=='edit'?'编辑信息':'查看详情',
                        isDetailVisible:true,
                        newsData,
                    })
                }
            })
        }else if(type=="check"){
            console.log('1')
            confirm({
                title: '确定发布?',
                okText: '是',
                okType: 'danger',
                cancelText: '否',
                onOk:()=>{
                    axios.ajax({
                        url:'/sys/news/check',
                        data:{
                            params:{
                                id:item.id
                            }
                        }
                    }).then((res)=>{
                        if(res.status =='success'){
                            this.requestList();
                        }
                    })
                }
            })
        }else if(type=="delete"){
            console.log('1')
            confirm({
                title: '确定删除?',
                okText: '是',
                okType: 'danger',
                cancelText: '否',
                onOk:()=>{
                    axios.ajax({
                        url:'/sys/news/delete',
                        data:{
                            params:{
                                id:item.id
                            }
                        }
                    }).then((res)=>{
                        if(res.status =='success'){
                            this.requestList();
                        }
                    })
                }
            })
        }
    }


    render() {
        const columns = [
            {
                title: '标题',
                dataIndex: 'title',

            }, {
                title: '作者',
                dataIndex: 'author',
            },{
                title: '时间',
                dataIndex: 'pudate',
                render:Utils.formatDate

            }, {
                title: '发布状态',
                dataIndex: 'status',
                render(status){
                    return {1:"未审核",0: '已审核'}[status]
                }

            },{
                title: '操作',
                dataIndex:'operation',
                render:(text, record)=>{
                    const {status} = record

                    return <ButtonGroup>
                        <Button type="primary"  onClick={() => { this.handleOperator('detail',record)}}>查看</Button>
                        <Button type="primary"  onClick={()=> {this.handleOperator('edit',record)}}>修改</Button>
                        <Button type="primary"  disabled={status==0} onClick={()=> {this.handleOperator('check',record)}}>审核</Button>
                        <Button type="primary"  onClick={() => { this.handleOperator('delete',record) }}>删除</Button>
                    </ButtonGroup>
                }
            }
        ];

        return (
            <div>

                <Card>
                    <Collapse >
                        <Panel header="查询" key="1" >
                            <BaseForm formList={formList} filterSubmit={this.handleFilterSubmit}/>
                        </Panel>
                    </Collapse>
                </Card>
                <Card style={{marginTop:10}}>
                    <div className='button-box'>
                        <Button type="primary" onClick={()=> this.handleOperator('weixin',null)}>发送微信公众号</Button>
                        <Button type="primary" onClick={()=> this.handleOperator('create',null)}>添加</Button>
                        <Button type="primary" onClick={()=>this.handleDelete}>删除</Button>
                    </div>
                    <div style={{marginTop:30}}>
                        <ETable
                            updateSelectedItem={Utils.updateSelectedItem.bind(this)}
                            selectedRowKeys={this.state.selectedRowKeys}
                            selectedIds={this.state.selectedIds}
                            selectedItem={this.state.selectedItem}
                            dataSource={this.state.list}
                            pagination={this.state.pagination}
                            columns={columns}
                            row_selection = 'checkbox'
                        />
                    </div>
                </Card>
                <Modal
                    width='1000px'
                    title="政企互动"
                    visible={this.state.isVisible}
                    onOk={this.handleSubmit}
                    destroyOnClose={true}
                    onCancel={()=>{
                        this.setState({
                            isVisible:false,
                            newsData:{},
                            picture:[],
                            imageUrl:''
                        })
                    }}
                >
                    <AddForm 
                    type={this.state.type}
                    compress={this.state.compress||0}
                    newsData={this.state.newsData||{}}
                    dispatchNewsData={(value)=>this.setState({newsData:value})}
                    imageUrl={this.state.imageUrl||''}
                    picture={this.state.picture||[]}
                    dispatchPicture={(data)=>this.setState({picture:data})}
                    dispatchCompress={(data)=>this.setState({compress:data})}
                    disPatchImageUrl={(data)=>this.setState({imageUrl:data})}/>
                </Modal>

                <Modal
                    width='1000px'
                    title="政企互动"
                    visible={this.state.isDetailVisible}
                    footer={null}
                    destroyOnClose={true}
                    onCancel={()=>{
                        this.setState({
                            isDetailVisible:false,
                            newsData:{},
                        })
                    }}
                >
                    <Detail newsData={this.state.newsData||{}}/>
                </Modal>

            </div>
        );
    }
}
