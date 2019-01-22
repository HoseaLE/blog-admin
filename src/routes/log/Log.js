import React,{Component} from 'react';
import { connect } from 'dva';
import { Table, Modal, Divider, Select, Input, message  } from 'antd';
import { query, post } from "../../utils/request";
import conf from "../../config";

import styles from './Log.less';

const confirm = Modal.confirm;
const Option = Select.Option;
const Search = Input.Search;


class Log extends Component{
    constructor(props) {
        super(props)
        this.state = {
            page:1,
            count:0,
            list:[],
            type_list:[],
            type:"",
            search_keyword:"",
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
        }
    }

    getlist = async () => {
        const { pagination, search_keyword, type } = this.state;
        const { current, pageSize } = pagination;
        const parm1 = { page:current, size:pageSize };
        const parm2 = {} 
        if(search_keyword){
            Object.assign(parm2,{search_keyword})
        }
        if(type){
            Object.assign(parm1,{id:type})
        }
        try {
            this.setState({
                loading:true
            })
            const resp = await query(conf.api.loglist,{ ...parm1, query:JSON.stringify(parm2) });
            const list = resp.result;
            pagination.total = resp.count;
            this.setState({
                count:resp.count,
                list,
                pagination,
                loading:false
            })
        } catch (error) {
            console.log(error)
        }
        
    }

    getLogType = async () => {
        try {
            const resp = await query(conf.api.logType);
            this.setState({
                type_list:resp.result
            })
        } catch (error) {
            console.log(error)
        }
    }

    typeChange = (value) => {
        const { pagination } = this.state;
        pagination.current = 1;
        pagination.pageSize = 10
        this.setState({
            type:value == "none" ? "" : value,
            pagination
        },()=>{
            this.getlist()
        })
    }
    search = (value) => {
        const { pagination } = this.state;
        pagination.current = 1;
        pagination.pageSize = 10
        this.setState({
            search_keyword:value,
            pagination
        },()=>{
            this.getlist()
        })
    }

    pageChange = (pagination) => {
        this.setState({
            pagination
        },()=>{
            this.getlist()
        })
    }
    cancle = (id) => {
        confirm({
            content: '确定删除吗？',
            onOk: async () => {
                try {
                    await post(conf.api.deletelog,{id})
                    message.success("删除成功");
                    const { pagination } = this.state;
                    pagination.current = 1;
                    pagination.pageSize = 10
                    this.pageChange(pagination);
                } catch (error) {
                    console.log(error)
                }
                
            }
          });
    }

    toEdit = (recode) => {
        this.props.history.push({pathname:"/admin/logedit",state:recode})
    }

    componentDidMount(){
        this.getlist();
        this.getLogType();
    }

    render() {
        const state = this.state;
        const columns = [{
            title: '分类',
            dataIndex: 'c_title',
          }, 
          {
            title: '文章名',
            dataIndex: 'title',
          },
          {
            title: '关键字',
            dataIndex: 'keyword',
            render:(text)=> text.join("，")
            
          },
          {
            title: '阅读',
            dataIndex: 'read',
          }, 
          {
            title: '评论',
            dataIndex: 'comment',
          }, 
            {
            title: '创建时间',
            dataIndex: 'createTime',
          }, 
          {
            title: '更新时间',
            dataIndex: 'updateTime',
          },
          {
            title: '操作',
            dataIndex: '_id',
            render: (text,recode) => (
            <span>
                <a href="javascript:;" onClick={this.cancle.bind(this,text)}>删除</a>
                <Divider type="vertical" />
                <a href="javascript:;" onClick={this.toEdit.bind(this,recode)}>修改</a>
            </span>
            ),
          }];
         
        return(
            <div>
                <div className={styles.top}>
                    <div>
                        <span>文章类型: </span>
                        <Select className={styles.search} placeholder="选择文章类型" onChange={this.typeChange}>
                            <Option key="none">All</Option>
                            {state.type_list.map(val => {
                                return <Option key={val._id}>{val.title}</Option>
                            })}
                        </Select>
                    </div>
                    <Search
                        className={styles.search}
                        placeholder="搜索文章名、关键字"
                        onSearch={this.search}
                        />
                </div>
                <Table size="middle" rowKey="_id" loading={state.loading} pagination={state.pagination} onChange={this.pageChange} columns={columns} dataSource={state.list} />
            </div>
        );
    }
}

export default connect()(Log);

  
  