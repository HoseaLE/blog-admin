import React,{Component} from 'react';
import { connect } from 'dva';
import { Icon, Menu } from "antd";
import { Link } from 'dva/router';
import styles from './Menu.less';
const SubMenu = Menu.SubMenu;

class SiderMenu extends Component{
    constructor(props) {
        super(props)
        this.state={
            collapsed:false
        }
    }

    toggleCollapsed = () => {
        this.setState({
          collapsed: !this.state.collapsed,
        });
    }
    render(){
        return (
        <div className={styles.menu}>
            <div onClick={this.toggleCollapsed} style={{textAlign:'center',height:"36px", lineHeight:"36px",cursor:"pointer"}}>
                <Icon type={this.state.collapsed ? 'menu-unfold' : 'menu-fold'} />
            </div>
            <Menu
                defaultSelectedKeys={['2']}
                mode="inline"
                theme="dark"
                inlineCollapsed={this.state.collapsed}
            >   
                {/* <Menu.Item key="1">
                    <Icon type="pie-chart" />
                    <span>网站统计</span>
                    <Link to="/admin/sitestats" />
                </Menu.Item> */}
                <Menu.Item key="2">
                    <Icon type="user" />
                    <span>用户管理</span>
                    <Link to="/admin/user" />
                </Menu.Item>
                <SubMenu key="sub1" title={<span><Icon type="snippets" /><span>文章管理</span></span>}>
                    <Menu.Item key="3">
                        <Icon type="ordered-list" />
                        <span>分类管理</span>
                        <Link to="/admin/logclass" />
                    </Menu.Item>
                    <Menu.Item key="4">
                        <Icon type="pie-chart" />
                        <span>文章管理</span>
                        <Link to="/admin/log" />
                    </Menu.Item>
                    <Menu.Item key="5">
                        <Icon type="highlight" />
                        <span>添加文章</span>
                        <Link to="/admin/logadd" />
                    </Menu.Item>
                </SubMenu>
                <Menu.Item key="6">
                    <Icon type="message" />
                    <span>留言管理</span>
                    <Link to="/admin/comment" />
                </Menu.Item>
            </Menu>
        </div>
        );
    }
  }
  
  
  export default connect()(SiderMenu);
