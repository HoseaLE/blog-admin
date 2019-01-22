import React,{Component} from 'react';
import { connect } from 'dva';
import Logedit from "../../components/Log/Logedit";

class LogAdd extends Component{
    constructor(props) {
        super(props)
        this.state={

        }
    }


    componentWillMount() {
       
    }

    componentDidMount () {
      
    }

    render() {
    
        return (
            <div>
                <Logedit />
            </div>
        );

    }
}

export default connect()(LogAdd);
