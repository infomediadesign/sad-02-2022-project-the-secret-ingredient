import React, {useCallback, useState, useReducer } from "react";
import ReactDOM from "react-dom";
import CSS from 'csstype';
import {Issue, IssueListTemp, getIssues} from '../ViewModels/Board'
import produce from "immer";
import {
  DragDropContext,
  Draggable,
  DraggingStyle,
  Droppable,
  DropResult,
  NotDraggingStyle
} from "react-beautiful-dnd";

const horizontalList: CSS.Properties = {
  float: 'left',
  padding: '0.8rem',
  border: 'dotted',
  margin: '0.2rem',
}

const issueStyle: CSS.Properties = {
  padding: '0.2rem',
  border: 'dotted',
  margin: '0.1rem',
}

const issueLists = fetchIssueLists;

function fetchIssues() : Issue[]{
  const testA = data;

  return (testA);
}

function fetchIssueLists() : IssueListTemp[]{
  const localTest = {
    id: "1111",
    content: ""
  }

  const testA = {
    name: "To Do",
    content: data
  };
  const testB = {
    name: "Doing",
    content: [localTest]
  };

  return ([testA, testB]);
}

const dragReducer = produce((draft, action) => {
  switch (action.type) {
    case "MOVE": {
      draft[action.from] = draft[action.from] || [];
      draft[action.to] = draft[action.to] || [];
      const [removed] = draft[action.from].splice(action.fromIndex, 1);
      draft[action.to].splice(action.toIndex, 0, removed);
    }
  }
});

function App (){
  const [state, dispatch] = useReducer(dragReducer, {
    items: fetchIssues(),
  });

  const onDragEnd = useCallback((result : any) => {
    if (result.reason === "DROP") {
      if (!result.destination) {
        return;
      }
      dispatch({
        type: "MOVE",
        from: result.source.droppableId,
        to: result.destination.droppableId,
        fromIndex: result.source.index,
        toIndex: result.destination.index,
      });
    }
  }, []);

  return (
    <div>
      <button>Add Issue List</button>
      <DragDropContext onDragEnd={onDragEnd}>
        <Droppable droppableId="items" type="PERSON">
          {(provided, snapshot) => 
            arrangeDragDropForIssueList(provided, state, state.items)
          }
        </Droppable>
        <Droppable droppableId="items2" type="PERSON">
          {(provided, snapshot) => 
            arrangeDragDropForIssueList(provided, state, state.items2)
          }
        </Droppable>
      </DragDropContext>
    </div>
  );

  function arrangeDragDropForIssueList(provided : any, state: any, mapItem : any){
    return (
      <div style={horizontalList}
        ref={provided.innerRef}
        {...provided.droppableProps}
        
      >
        {mapItem?.map((person : any, index : any) => 
        arrangeIssueInList(person, index)
        )}
        {provided.placeholder}
        <button onClick={
          () => {}
        }
        >Add Issue</button>
      </div>
    );
  }
};

function arrangeIssueInList(issue : any, index : any){
  return (
    <Draggable
      key={issue.id}
      draggableId={issue.id}
      index={index}
    >
      {(provided, snapshot) => 
        arrangeIssue(provided, issue)
      }
    </Draggable>
  );
}

function arrangeIssue(provided : any, issue : any){
  return (
    <div
      ref={provided.innerRef}
      {...provided.draggableProps}
      {...provided.dragHandleProps}
    >
      <div style={issueStyle}>
        <span>
          {issue.content}
        </span>
      </div>
    </div>
  );
}

export const data :Issue[] = [
  {
    id: "1",
    content: "This list is buggy"
  },
  {
    id: "2",
    content: "I hate lists like this..."
  },
  {
    id: "3",
    content: "Why would react do this to me"
  },
  {
    id: "4",
    content: "HAMBURGER PLEAAAAAAAAAAAAAAAASE"
  },
];



export default App;

ReactDOM.render(<App />, document.getElementById("root"));
