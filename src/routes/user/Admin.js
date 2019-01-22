import React,{Component} from 'react';
import { connect } from 'dva';
import { Table, Input, Modal, Select, message } from 'antd';
import styles from './User.less';
import conf from "../../config";
import { query, post } from "../../utils/request";

const Search = Input.Search;
const Option = Select.Option;
class Admin extends Component{
    constructor(props) {
        super(props)
        this.state = {
            search_keyword:"",
            list:[],
            pagination:{
                size:"small",
                total:0,
                current:1,
                pageSize:10,
                showTotal:(total) => `共 ${total} 项`,
                showSizeChanger:true,
                showQuickJumper:true,
            },
            loading:false,
            visible:false,
            status:"",
            _id:"",
        }

    }

    getUser = async () => {
        try {
            const { search_keyword, pagination } = this.state;
            const { current, pageSize } = pagination;
            const parm = { page:current, size:pageSize };
            if(search_keyword || search_keyword == "0" ){
                Object.assign(parm,{search_keyword})
            }
            this.setState({
                loading:true,
            })
            const resp = await query(conf.api.getuser,parm);
            pagination.total = resp.count;
            this.setState({
                list:resp.result,
                pagination,
                loading:false
            })
        } catch (error) {
            this.setState({
                loading:false,
            })
            console.log(error)
        }
    }

    search = (value) => {
        const { pagination } = this.state;
        pagination.current = 1;
        pagination.pageSize = 10;
        if(value === "超级用户"){
            value = 1;
        }
        if(value === "普通用户"){
            value = 0;
        }
        this.setState({
            search_keyword:value,
            pagination
        },()=>{
            this.getUser()
        })
    }

    pageChange = (pagination) => {
        this.setState({
            pagination
        },()=>{
            this.getUser()
        })
    }

    toChangeUser = (_id) => {
        this.setState({
            _id,
            visible:true
        })
    }

    close = () => {
        this.setState({
            visible:false
        })
    }

    selectAuth = (status) => {
        this.setState({
            status
        })
    }
    // 修改权限
    handleOk = async () => {
        try {
            const { _id, status } = this.state;
            if(status !== ""){
                await post(conf.api.updateuser,{ _id, status });
                message.success("修改成功");
                this.setState({
                    visible:false
                })
                this.getUser();
            }else{
                message.warning("请选择权限")
            }
        } catch (error) {
            console.log(error)
        }
    }

    componentDidMount(){
        this.getUser()
    }

    render() {
        const state = this.state;
        const columns = [
            {
                title: '用户名',
                dataIndex: 'name',
            },
            {
                title: '邮箱',
                dataIndex: 'email',
            },
            {
                title: '用户权限',
                dataIndex: 'status',
                render: (text) => {
                    let user;
                    switch(text){
                        case 0:
                            user = "普通用户"
                            break;
                        case 1:
                            user = "超级用户"
                            break;
                        default:
                            user = "其他"
                            break;
                    }
                    return user;
                }
            },
            {
                title: '注册时间',
                dataIndex: 'createTime',
            }, 
            {
                title: '操作',
                dataIndex: '_id',
                render: (text, record) => (
                    <span>
                        <a href="javascript:;" onClick={this.toChangeUser.bind(this,text)} >修改权限</a>
                    </span>
                ),
            }
        ];

        return(
            <div>
                <div className={styles.search}>
                    <Search
                        placeholder="搜索用户名、权限"
                        onSearch={this.search}
                        style={{ width: 200 }}
                    />
                </div>
                <Table
                    pagination={state.pagination}
                    onChange={this.pageChange}
                    size="middle"
                    rowKey="_id"
                    loading={state.loading}
                    columns={columns} 
                    dataSource={state.list} 
                />
                <Modal
                    title="修改权限"
                    visible={state.visible}
                    onOk={this.handleOk}
                    width={400}
                    onCancel={this.close}
                >   
                    <span>权限：</span>
                    <Select
                        style={{ width: 200 }}
                        placeholder="选择权限"
                        onChange={this.selectAuth}
                    >
                        <Option key="0">普通用户</Option>
                        <Option key="1">超级用户</Option>
                    </Select>,
                </Modal>
            </div>
        );
    }
}

export default connect()(Admin);

  
  