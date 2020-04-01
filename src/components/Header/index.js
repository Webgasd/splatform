import React,{Component} from 'react';
import {Tabs, Icon, Drawer, Menu, Carousel, Popover, Modal, message} from "antd";
import { connect } from 'react-redux';
import { addTabs,changeTabs,addDataAcl } from './../../redux/action';
import Content from './../Content';
import PasswordForm from './PasswordForm';
import './style.less';
import { unitName,unitNameEn } from "../../axios/commonSrc";
import axios from "../../axios";
import picLogo from './u100.png';
import Utils from '../../utils';

const TabPane = Tabs.TabPane;
const SubMenu = Menu.SubMenu;

class Header extends Component{
    state={
        currentKey:'/government',
        visible: false
    }

    componentWillMount(){

        this.requestList();

        //const menuTreeNode = this.renderMenu(MenuConfig);

        //   let currentKey = window.location.hash.replace(/#|\?.*$/g,'')
    }

    requestList = ()=>{
        axios.ajax({
           url:'/sys/user/getTest',
           // url:'getTest.json',
            data:{
                params:{}
            }
        }).then((res)=>{
            let aclData = Utils.getMenuList(res.data.acls);
            console.log(aclData)
            this.setState({
                menuTreeNode:this.renderMenu(aclData.aclTree),
                userName:res.data.userName
            })
            this.props.dispatch(addDataAcl(res.data.industryList,res.data.areaList,res.data.userName,res.data.userType,aclData.acls,res.data.userInfo||{}))
        })
    }

    onChange = (activeKey) => {
        const { dispatch } = this.props;
        dispatch(changeTabs(activeKey));
    }

    onEdit = (targetKey, action) => {
        this[action](targetKey);
    }

    remove = (targetKey) => {
        const { dispatch } = this.props;
        let activeKey = this.props.activeKey;
        let lastIndex;
        this.props.panes.forEach((pane, i) => {
            if (pane.key === targetKey) {
                lastIndex = i - 1;
            }
        });
        const panes = this.props.panes.filter(pane => pane.key !== targetKey);
        if (panes.length && activeKey === targetKey) {
            if (lastIndex >= 0) {
                activeKey = panes[lastIndex].key;
            } else {
                activeKey = panes[0].key;
            }
        }
        dispatch(addTabs(panes,activeKey));
    }

    showDrawer = () => {
        this.setState({
            visible: true,
        });
    };
    onClose = () => {
        this.setState({
            visible: false,
        });
    };

    // 菜单渲染
    renderMenu =(data)=>{
        return data.map((item)=>{
            if(item.childrenList){
                return (
                    <SubMenu title={item.title} key={item.key} acl={item.acl}>
                        { this.renderMenu(item.childrenList)}
                    </SubMenu>
                )
            }else{
                return <Menu.Item title={item.title} key={item.key} acl={item.acl}>
                    {item.title}
                </Menu.Item>
            }
        })
    }
    handleClick=(item)=>{
        const {dispatch}=this.props;
        const panes = this.props.panes;
        const activeKey = item.key;
        if(!panes.find(p=>p.key==activeKey)){
            panes.push({ title: item.item.props.title, content: 'New Tab Pane', key: activeKey});
        }
        dispatch(addTabs(panes,activeKey));
    }

    handlePasswordSubmit = ()=>{
        let reg = /^(?=.*\d)(?=.*[a-zA-Z])(?=.*[~.!+@#$%^&*])[\da-zA-Z~.!+@#$%^&*]{8,}$/;
        let data = this.passwordForm.props.form.getFieldsValue();
        if(data.newPassword1!=data.newPassword2){
            alert("请输入一致的密码")
        }
        if(reg.test(data.newPassword1)&&data.newPassword1==data.newPassword2){
            axios.ajax({
                url:'/sys/user/changeUserPsd',
                data:{
                    params:{
                        oldPassword:data.password,
                        newPassword:data.newPassword1
                    }
                }
            }).then((res)=>{
                if(res.status =='success'){
                    this.passwordForm.props.form.resetFields();
                    this.setState({
                        psdVisible:false,
                    })
                    message.success('修改成功');
                }
            })
        }
    }
    render() {
        return (
            <div className="header">
                <div className="header-top">
                        <div style={{width:20,float:'left'}}>
                            <Icon type="menu" style={{ fontSize: '20px', color: '#FFFFFF'}} theme="outlined" onClick={this.showDrawer}/>
                            <Drawer
                                title="导航栏"
                                placement="left"
                                closable={false}
                                onClose={this.onClose}
                                visible={this.state.visible}

                            >
                                <Menu
                                    selectedKeys={[this.props.activeKey]}
                                    onClick={this.handleClick}
                                    theme="dark"
                                    mode="inline"
                                >
                                    { this.state.menuTreeNode }
                                </Menu>
                            </Drawer>
                        </div>
                    <div style={{marginLeft:50,float:'left',width:700,marginTop:5,height:40}}>
                        <Carousel autoplay>
                            <div><img style={{float:'left',height:40}} src={picLogo}/> <div className="bannerText">{unitName}市场监督管理局智慧监管平台</div></div>
                            <div><img style={{float:'left',height:40}} src={picLogo}/> <div className="bannerText">{unitNameEn}Market Supervision and Administration Bureau</div></div>
                        </Carousel>
                    </div>
                    <div>
                        <Popover content={<div style={{cursor:'pointer'}} onClick={()=>this.setState({psdVisible:true})}>修改密码</div>} placement="bottomRight">
                        <span style={{color:"#FFFFFF",cursor:'pointer'}}><Icon style={{marginRight:5}} type='user' />欢迎，{this.state.userName} <Icon type='caret-down' /></span>
                        </Popover>
                        <a href={"#login"} onClick={()=>{ axios.ajax({
                            url:'/sys/user/logoutTest',
                        })}}>退出</a>
                    </div>
                </div>
                <div className="breadcrumb">
                    <Tabs
                        size='small'
                        hideAdd
                        onChange={this.onChange}
                        activeKey={this.props.activeKey}
                        type="editable-card"
                        onEdit={this.onEdit}
                    >
                        {
                            this.props.panes.map((pane)=>{
                                return <TabPane
                                    tab={pane.title}
                                    key={pane.key}
                                    closable={pane.closable}
                                ><Content name={pane.key}/></TabPane>
                            })
                        }
                    </Tabs>
                </div>
                <Modal
                    visible={this.state.psdVisible}
                    onOk={this.handlePasswordSubmit}
                    width={360}
                    title={"修改密码"}
                    onCancel={()=>{
                        this.passwordForm.props.form.resetFields();
                        this.setState({
                            psdVisible:false
                        })
                    }}>
                      <PasswordForm wrappedComponentRef={(inst) => this.passwordForm = inst }/>
                </Modal>
            </div>
        );
    }
}
const mapStateToProps = (state)=>({
    menuName:state.menuName,
    panes:state.panes,
    activeKey:state.activeKey
})

export default connect(mapStateToProps)(Header);