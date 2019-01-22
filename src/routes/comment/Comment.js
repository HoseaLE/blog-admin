import React,{Component} from 'react';
import { connect } from 'dva';
import { query, post } from "../../utils/request";
import { Table, Input, message, Modal } from 'antd';
import styles from './Comment.less';
import conf from "../../config";

const confirm = Modal.confirm;
const Search = Input.Search;
class Comment extends Component{
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
            loading:false
        }

    }
    getComment = async () => {
        try {
            const { search_keyword, pagination } = this.state;
            const { current, pageSize } = pagination;
            const parm = { page:current, size:pageSize };
            if(search_keyword){
                Object.assign(parm,{search_keyword})
            }
            this.setState({
                loading:true,
            })
            const resp = await query(conf.api.getcomment,parm);
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
        pagination.pageSize = 10
        this.setState({
            search_keyword:value,
            pagination
        },()=>{
            this.getComment()
        })
    }

    pageChange = (pagination) => {
        this.setState({
            pagination
        },()=>{
            this.getComment()
        })
    }

    cancle = async (_id) => {
        confirm({
            content: '确定删除吗？',
            onOk: async () => {
                try {
                    await post(conf.api.deletecomment,{ _id });
                    message.success("删除成功");
                    const { pagination } = this.state;
                    pagination.current = 1;
                    pagination.pageSize = 10;
                    this.pageChange(pagination);
                } catch (error) {
                    console.log(error)
                }
                
            }
          });
    }

    componentDidMount(){
        this.getComment();
    }
    
    render() {
        const state = this.state;
        const columns = [{
            title: '文章名',
            dataIndex: 'title',
          }, {
            title: '用户',
            dataIndex: 'username',
          },{
            title: '内容',
            dataIndex: 'content',
          }, 
          {
            title: '评论时间',
            dataIndex: 'createTime',
          }, 
          {
            title: '操作',
            dataIndex: '_id',
            render: (text) => (
              <span>
                <a href="javascript:;" onClick={this.cancle.bind(this,text)}>删除</a>
              </span>
            ),
          }];
   
        return(
            <div>
                <div className={styles.search}>
                    <Search
                        placeholder="搜索文章名、用户名、留言内容"
                        onSearch={this.search}
                        style={{ width: 300 }}
                        />
                </div>
                <Table 
                    size="middle" 
                    pagination={state.pagination} 
                    onChange={this.pageChange} 
                    columns={columns}
                    rowKey="_id"
                    loading={state.loading}
                    dataSource={state.list} 
                />
            </div>
        );
    }
}

export default connect()(Comment);

  
  