import React, { memo } from 'react';
import {Button,IconButton} from '@material-ui/core';
import CheckBoxIcon from '@material-ui/icons/CheckBox';
import CheckBoxOutlineBlankIcon from '@material-ui/icons/CheckBoxOutlineBlank';

import { Handle } from 'react-flow-renderer';

export default memo(({ data, isConnectable }) => {
  return (
    <div style={{background:'transparent',padding:'1rem',fontSize:'14px'}}>
      <Handle
        type="target"
        position="left"
        style={{ background: '#fff' }}
        onConnect={(params) => console.log('handle onConnect', params)}
        isConnectable={isConnectable}
      />
      <div>
        <strong>{data.label}</strong>
        {data.started && (
          <IconButton onClick={()=>{
            console.log('hi')
          }} color="primary" aria-label="upload picture" component="span">
            <CheckBoxOutlineBlankIcon />
          </IconButton>
        )}
      </div>
      <Handle
        type="source"
        position="right"
        style={{ background: '#fff' }}
        isConnectable={isConnectable}
      />
    </div>
  );
});