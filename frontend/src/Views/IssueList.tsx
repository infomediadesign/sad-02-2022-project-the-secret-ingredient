import {issueListData} from './Board';
import React, { useState } from 'react';
import CSS from 'csstype';

const horizontalList: CSS.Properties = {
  float: 'left',
  padding: '0.8rem',
  border: 'dotted',
  margin: '0.2rem',
}

export function CreateIssueList(me: issueListData){

  return (
    <div style={horizontalList}>
      <p>List of issues</p>
      <p>{me.number.toString()}</p>
      <button onClick={() =>
        {me.number = 2}
      }>Delete</button>
    </div>
  )
}

export default CreateIssueList;