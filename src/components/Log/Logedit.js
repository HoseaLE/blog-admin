import React,{Component} from 'react';
import { connect } from 'dva';
import E from "wangeditor";
import { Select, Input, Button, Form, message } from "antd";
import { query, post } from "../../utils/request";
import conf from "../../config";
const FormItem = Form.Item;
const Option = Select.Option;
const { TextArea } = Input;
let editor;
class LogEdit extends Component{
    constructor(props) {
        super(props)
        
        this.state={
            log_type:[],
            id:"",
            init_desc:"",
            init_title:"",
            init_content:"",
            init_keyword:[],
            init_cid:"",
            
        }
    }

    getType = async () => {
        const resp = await query(conf.api.logType);
        this.setState({
            log_type: resp.result
        })
    }

    initVlue = () => {
        if(this.props.eidtData){
            const { id, desc, title, content, keyword, cid } = this.props.eidtData
            editor.txt.html(content);
            this.setState({
                id,
                init_desc:desc,
                init_title:title,
                init_content:content,
                init_keyword:keyword,
                init_cid:cid
            })
        }
    }

    handleSubmit = (e) => {
        e.preventDefault();
        this.props.form.validateFields( async (err, values) => {
            if (!err) {
                const content = editor.txt.html();
                values.content = content;
                try {
                    const { id } = this.state
                    if(id){
                        await post(conf.api.updatelog, { ...values, id } );
                        message.success("修改成功")

                    }else{
                        await post(conf.api.addlog, {...values} );
                        message.success("添加成功")
                    }
                } catch (error) {
                    console.log(error)
                }
            }
        });
    }

    componentWillMount() {
        this.getType();
    }

    componentDidMount () {
        editor = new E(this.refs.editor);
        editor.customConfig.uploadImgShowBase64 = true
        editor.create();
        this.initVlue();
    }

    render() {
        const { getFieldDecorator } = this.props.form;
        const state = this.state;
        return (
            <div style={{paddingLeft:"20px"}}>
                <Form layout='vertical' hideRequiredMark onSubmit={this.handleSubmit}>
                    <FormItem
                        label='文章类型：'
                        labelCol={{span:2}}
                        wrapperCol={{span:20}}
                    >
                        {getFieldDecorator('cid', {
                            rules: [{ required: true, message: '请选择文章类型' }],
                            initialValue:state.init_cid
                            
                        })(
                            <Select style={{ width: 300 }} optionFilterProp="children">
                                {state.log_type.map(val => {
                                    return <Option key={val._id}>{val.title}</Option>
                                })}
                            </Select>
                        )}
                    </FormItem>
                    <FormItem
                        label='文章标题：'
                        labelCol={{span:2}}
                        wrapperCol={{span:20}}
                    >
                        {getFieldDecorator('title', {
                            rules: [{ required: true, message: '请输入文章标题' }],
                            initialValue:state.init_title
                        })(
                            <Input style={{ width: '300px' }}  />
                        )}
                    </FormItem>
                    <FormItem
                        label='关键字：'
                        labelCol={{span:2}}
                        wrapperCol={{span:20}}
                    >
                        {getFieldDecorator('keyword', {
                            rules: [{ required: true, message: '请输入一个或多个关键字' }],
                            initialValue:state.init_keyword

                        })(
                            <Select
                                mode="tags"
                                style={{ width: '300px' }}
                                tokenSeparators={[',']}
                            >
                            </Select>
                        )}
                    </FormItem>
                    <FormItem
                        label='文章描述：'
                        labelCol={{span:2}}
                        wrapperCol={{span:20}}
                    >
                        {getFieldDecorator('desc', {
                            rules: [{ required: true, message: '请输入文章描述' }],
                            initialValue:state.init_desc

                        })(
                            <TextArea  style={{ width: '300px' }} autosize={{ minRows: 2, maxRows: 6 }} />
                        )}
                    </FormItem>
                    <FormItem
                        label='文章内容：'
                        labelCol={{span:2}}
                        wrapperCol={{span:20}}
                    >
                        <div ref="editor" style={{marginTop:"10px"}} ></div>
                    </FormItem>
                    <Button htmlType="submit" >提交</Button>

                </Form>
              
            </div>
        );

    }
}
const WrLogEdit = Form.create()(LogEdit);

export default connect()(WrLogEdit);
