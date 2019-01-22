import React,{Component} from 'react';
import { connect } from 'dva';
import { Row, Col  } from 'antd';
import echarts from 'echarts';
import styles from './SiteStats.less';
class SiteStats extends Component{
    constructor(props) {
        super(props)
    }
    
    createChart = (obj,option) => {
        const echart = echarts.init(this.refs[obj]);
        echart.setOption(option);
    }

    componentDidMount() {
       
        const log = {
            title: {
                text: 'ECharts 入门示例'
            },
            tooltip: {},
            legend: {
                data:['销量']
            },
            xAxis: {
                data: ["衬衫","羊毛衫","雪纺衫","裤子","高跟鞋","袜子"]
            },
            yAxis: {},
            series: [{
                name: '销量',
                type: 'bar',
                data: [5, 20, 36, 10, 10, 20]
            }]
        };
        const flow = {
            xAxis: {
                type: 'category',
                data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
            },
            yAxis: {
                type: 'value'
            },
            series: [{
                data: [820, 932, 901, 934, 1290, 1330, 1320],
                type: 'line',
                smooth: true
            }]
        };
        this.createChart("flow",flow);
        this.createChart("log",log);
    }
    render() {
        
        return(
            <div style={{height:"100%"}}>
                <Row>
                    <Col span={24}>
                        <span>访问统计</span>
                        <div ref="flow" style={{height:"300px"}} ></div>
                    </Col>
                </Row>
                <Row>
                    <Col span={24}>
                        <span>文章统计</span>
                        <div ref="log" style={{height:"300px"}} ></div>
                    </Col>
                </Row>
                {/* 文章统计（文章总量、文章分类、各留言数、留言总数、访问占比）  用户统计（用户总量）  访问统计（访问总量、每天访问量） */}
            </div>
        );
    }
}

export default connect()(SiteStats);

  
  