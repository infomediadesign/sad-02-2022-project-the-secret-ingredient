import React, { useState } from 'react';
import logo from './logo.svg';
import CSS from 'csstype';
import './App.css';

interface  issueListData {
  indexK : Number,
  name : String,
  number : Number,
}

let arrayOfIssueLists : issueListData[] = new Array();

function App() {
  const [age, setAge] = useState(18);
  const [name, setName] = useState('class');
  const [element, setElement] = useState(<h1>Hello, {name}</h1>);
  const [count, setCount] = useState(0);

  const [listsOfIssues, setlistsOfIssues] = useState(new Array); 

  return (
    <div>
      <h1>Top of page</h1>
      {element}
      <p>Click count is: {count}</p>
      <button onClick={() => setCount(count + 1)}>Click</button>
      <button onClick={() => {
          setlistsOfIssues((oldArr) => [
            ...oldArr,
            {
              indexK : oldArr.length,
              name : "",
              number : count
            }
        ]);
        arrayOfIssueLists = listsOfIssues;
        }}>Add in list</button>
        <button onClick={() => {
          arrayOfIssueLists = listsOfIssues;
          setlistsOfIssues(arrayOfIssueLists.map((listI, key) => key == 0
            ?{...listI, number: count}
            :{...listI}
          ));
        }}>Change top number</button>
        <div>
          <ul>{listsOfIssues.map((index : issueListData, key) => CreateIssueList(listsOfIssues[key]))}</ul>
        </div>
    </div>
  )
}

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

export default App;
