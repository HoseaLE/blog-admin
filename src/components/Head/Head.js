import React from 'react';
import { connect } from 'dva';
import { Icon } from "antd";
import { Link } from 'dva/router';

import styles from './Head.less';
function Head() {
    function toIndex(){
        window.location.href = "/";
    }
    return (
      <div className={styles.top}>
        <a href="javascript:;" onClick={toIndex}>去博客</a>
        <div className={styles.topRight}>
          <Icon type="user" />
          <Icon type="setting" />
        </div>
      </div>
    );
  }
  
  
  export default connect()(Head);

  
