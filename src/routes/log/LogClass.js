import React,{Component} from 'react';
import { Table, Modal, Divider, Input, message, Form, Button  } from 'antd';
import { query, post } from "../../utils/request";
import conf from "../../config";
import styles from './Log.less';

const confirm = Modal.confirm;
const FormItem = Form.Item;

class LogClass extends Component{
    constructor(props) {
        super(props)
        this.state = {
            type_list:[],
            visible:false,
            loading:false,
            id:"",
            type:"",
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

    cancle = (id) => {
        confirm({
            content: '确定删除吗？',
            onOk: async () => {
                try {
                    await post(conf.api.deleteClass,{id})
                    message.success("删除成功");
                    this.getLogType();
                } catch (error) {
                    console.log(error)
                }
                
            }
          });
    }

    toEdit = (id) => {
        this.props.form.resetFields();
        this.setState({
            id,
            visible:true,
            type:"edit"
        })
    }
    toAdd = () => {
        this.props.form.resetFields();
        this.setState({
            visible:true,
            type:"add"
        })
    }

    handleCancel = () => {
        this.setState({
            visible:false
        })
    }

    handleOk = async () => {
        this.props.form.validateFields( async (err, values) => {
            if (!err) {
                const { title } = values;
                const { id, type } = this.state;
                try {
                    if(type == "add"){
                        await post(conf.api.addClass,{title})
                        message.success("添加成功");
                    }else if(type == "edit"){
                        await post(conf.api.updateClass,{id, title})
                        message.success("更新成功");
                    }
                    this.setState({
                        visible:false
                    })
                    this.getLogType();
                } catch (error) {
                    this.setState({
                        visible:false
                    })
                    console.log(error)
                }
            }
        });
            
    }

    componentDidMount(){
        this.getLogType();
    }

    render() {
        const state = this.state;
        const { getFieldDecorator } = this.props.form
        const columns = [{
            title: '类名',
            dataIndex: 'title',
          }, 
          {
            title: '操作',
            dataIndex: '_id',
            render: (text) => (
            <span>
                <a href="javascript:;" onClick={this.cancle.bind(this,text)}>删除</a>
                <Divider type="vertical" />
                <a href="javascript:;" onClick={this.toEdit.bind(this,text)}>修改</a>
            </span>
            ),
          }];
        
        return(

            <div>
                <Button type="primary" onClick={this.toAdd}>添加</Button>
                <Table size="middle" rowKey="_id" loading={state.loading} columns={columns} dataSource={state.type_list} />
                <Modal
                    title="输入类名"
                    visible={this.state.visible}
                    onOk={this.handleOk}
                    onCancel={this.handleCancel}
                >
                    <Form>
                        <FormItem
                        >
                        {getFieldDecorator('title', {
                            rules: [{ required: true, message: '请输入类名' }],
                        })(
                            <Input placeholder="请输入类名" />
                        )}
                        </FormItem>
                    </Form>
                </Modal>

            </div>
        );
    }
}
const WrappedLogClass = Form.create()(LogClass);
export default WrappedLogClass;

  
  