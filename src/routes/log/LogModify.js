import React,{Component} from 'react';
import { connect } from 'dva';
import Logedit from "../../components/Log/Logedit";

class LogModify extends Component{
    constructor(props) {
        super(props)
        this.state={
            desc:"", 
            title:"", 
            content:"", 
            keyword:[], 
            cid:""
        }
        
    }
   
    componentWillMount() {
        if(this.props.location.state){
            const { desc, title, content, keyword, cid, _id } = this.props.location.state;
            this.setState({desc, title, content, keyword, cid, id:_id })
        }
    }

    render() {
    
        return (
            <div>
                <Logedit eidtData={this.state} />
            </div>
        );

    }
}

export default connect()(LogModify);
