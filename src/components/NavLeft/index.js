import React,{Component} from 'react'
import { Menu } from 'antd';
import MenuConfig from './menuConfig';
import { connect } from 'react-redux';
import {addTabs} from './../../redux/action'
import './style.less';
const SubMenu = Menu.SubMenu;

class NavLeft extends Component{
   state={
       currentKey:'/home'
   }

    componentWillMount(){
        const menuTreeNode = this.renderMenu(MenuConfig);
     //   let currentKey = window.location.hash.replace(/#|\?.*$/g,'')

        this.setState({
            menuTreeNode
        })
    }
    // 菜单渲染
    renderMenu =(data)=>{
        return data.map((item)=>{
            if(item.children){
                return (
                    <SubMenu title={item.title} key={item.key}>
                        { this.renderMenu(item.children)}
                    </SubMenu>
                )
            }
            return <Menu.Item title={item.title} key={item.key}>
                {item.title}
            </Menu.Item>
        })
    }
    handleClick=(item)=>{
        const {dispatch}=this.props;
        const panes = this.props.panes;
        const activeKey = item.key;
        if(!panes.find(p=>p.key==activeKey)){
            panes.push({ title: item.item.props.title, content: 'New Tab Pane', key: activeKey });
        }
        dispatch(addTabs(panes,activeKey));
    }
    render() {
        return (
            <div>
                    <div className="logo">
                        <h1>监管平台</h1>
                    </div>
                <Menu
                    selectedKeys={[this.props.activeKey]}
                    onClick={this.handleClick}
                    theme="dark"
                    mode="inline"
                >
                    { this.state.menuTreeNode }
                </Menu>
            </div>
        );
    }
}

const mapStateToProps=(state)=>({
    panes:state.panes,
    activeKey:state.activeKey
})


export default connect(mapStateToProps)(NavLeft);