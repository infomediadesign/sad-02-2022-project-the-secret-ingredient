import React, { useState } from 'react';
import CSS from 'csstype';
import './App.css';
import {CreateIssueList} from './IssueList'
import { DragDropContext, Droppable, Draggable, DraggableProvided, DraggableStateSnapshot} from 'react-beautiful-dnd';

export interface  issueListData {
  indexK : Number,
  name : String,
  number : Number,
}

const myTestList =[
  {
    id: "1",
    name: 'Me1'
  },
  {
    id: "2",
    name: 'Me2'
  },
  {
    id: "3",
    name: 'Me3'
  }
]

let arrayOfIssueLists : issueListData[] = new Array();

const horizontalList: CSS.Properties = {
  float: 'left',
  padding: '0.8rem',
  border: 'dotted',
  margin: '0.2rem',
}

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
          <ul>{listsOfIssues.map(issue => (
            <div style={horizontalList}>
              <p>{issue.number}</p>
              <button onClick={() => {
                  arrayOfIssueLists = listsOfIssues;
                  setlistsOfIssues(arrayOfIssueLists.map((listI, key) => key == issue.indexK
                    ?{}
                    :{...listI}
                  ));
                }}>Delete</button>
                <DragDropContext onDragEnd={() => {}}>
                  <Droppable droppableId='issuesId'>
                    {(provided) => (
                      <ul className='' {...provided.droppableProps} ref={provided.innerRef}>
                        {myTestList.map((item, index) => {return(
                          <Draggable key={item.id} draggableId={item.id} index={index}>
                            {(providedDraggable:DraggableProvided, snapshotDraggable:DraggableStateSnapshot) => (
                            <div><p>{item.id}</p><p>{item.name}</p></div>
                            )}
                          </Draggable>
                        )})}
                      </ul>
                    )}
                  </Droppable>
                </DragDropContext>
            </div>
          ))}</ul>
        </div>
    </div>
  )
}

export default App;
