import React, { useState } from "react";
import ReactDOM from "react-dom";
import CSS from 'csstype';
import {Issue, getIssues} from '../ViewModels/Board'
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

const reorder = (
  list: Issue[],
  startIndex: number,
  endIndex: number
): Issue[] => {
  const result = Array.from(list);
  const [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed);

  return result;
};

const grid = 8;

const getItemStyle = (
  isDragging: boolean,
  draggableStyle: DraggingStyle | NotDraggingStyle | undefined
): React.CSSProperties => ({
  // some basic styles to make the items look a bit nicer
  userSelect: "none",
  padding: grid * 2,
  margin: `0 0 ${grid}px 0`,

  // change background colour if dragging
  background: isDragging ? "lightgreen" : "grey",

  // styles we need to apply on draggables
  ...draggableStyle
});

const getListStyle = (isDraggingOver: boolean): React.CSSProperties => ({
  background: isDraggingOver ? "lightblue" : "lightgrey",
  padding: grid,
  width: 250
});

function fetchIssueLists(){
  const testA = [
    {
      number : 1,
      content : getIssues(4)
    }
  ]

  return (testA);
}


function App (){
  const [issueCount, setIssueCount] = useState(5);
  const [listOfIssues, setlistOfIssues] = useState(fetchIssueLists());
  const [state, setState] = useState(getIssues(5));

  const onDragEnd = (result: DropResult): void => {
    if (!result.destination) {
      return;
    }

    const items: Issue[] = reorder(
      state,
      result.source.index,
      result.destination.index
    );

    setState(items);
  };

  return (
    <div>
      <div>
        <button
        onClick={() =>
          {
            setlistOfIssues((oldArr) => [
              ...oldArr,
              {
                number : 2,
                content : getIssues(0)
              }
          ])
          }}>Add list</button>
      </div>

      <DragDropContext onDragEnd={onDragEnd}>
        {listOfIssues.map((item) => (
          <div style={horizontalList}>
          <Droppable droppableId="droppable">
            {(provided, snapshot): JSX.Element => (
                <div
                  {...provided.droppableProps}
                  ref={provided.innerRef}
                  style={getListStyle(snapshot.isDraggingOver)}
                >
                  {listCreator(state)}
                  {provided.placeholder}
                  <button onClick={() => {
                    setState(item.content);
                    setState(
                      (oldArr) => [
                        ...oldArr,
                        {
                          id: `issue-`,
                          content: `new issue`
                        }
                    ]
                    );
                    item.content = state;
                    }}>Add new issue</button>
                </div>
              )
            }
          </Droppable>
          </div>
        ))}
    </DragDropContext>
    </div>
  );
};

function listCreator(state : Issue[]){
  return(<div>{
    state.map((item, index) => (
      <Draggable key={item.id} draggableId={item.id} index={index}>
        {(provided, snapshot): JSX.Element => (
          <div
            ref={provided.innerRef}
            {...provided.draggableProps}
            {...provided.dragHandleProps}
            style={getItemStyle(
              snapshot.isDragging,
              provided.draggableProps.style
            )}
          >
            {item.content}
          </div>
        )}
      </Draggable>
    ))
  }</div>)
}

export default App;

ReactDOM.render(<App />, document.getElementById("root"));
