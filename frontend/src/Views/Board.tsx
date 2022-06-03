import React, { useCallback, useState, useReducer } from 'react';
import ReactDOM from 'react-dom';
import CSS from 'csstype';
import { Issue, IssueListTemp, getIssues } from '../ViewModels/Board';
import produce from 'immer';
import {
    DragDropContext,
    Draggable,
    DraggableProvided,
    DraggingStyle,
    Droppable,
    DropResult,
    NotDraggingStyle,
} from 'react-beautiful-dnd';
import { getSystemErrorName } from 'util';
import '../styles/Board.scss';

// const horizontalList: CSS.Properties = {
//     float: 'left',
//     padding: '0.8rem',
//     border: 'dotted',
//     margin: '0.2rem',
// };
// const issueStyle: CSS.Properties = {
//     padding: '0.2rem',
//     border: 'dotted',
//     margin: '0.1rem',
// };
const dragReducer = produce((state: any, action: any) => {
    switch (action.type) {
        case 'MOVE': {
            state[action.from] = state[action.from] || [];
            state[action.to] = state[action.to] || [];
            const [removed] = state[action.from].splice(action.fromIndex, 1);
            state[action.to].splice(action.toIndex, 0, removed);
            return;
        }
        case 'ADDITEM': {
            state[issueListsNames[action.myIndex]].push(action.addThis);

            return state;
        }
        case 'UPDATE': {
            return state;
        }
        case 'DELETEISSUE': {
            console.log('REEEEEEEEEEEE');
            let newA: Issue[] = new Array();

            state[issueListsNames[action.myIndex]].map((item: Issue, index: number) => {
                if (item.id != action.deleteMe) {
                    console.log(item.id);
                    newA[index] = item;
                }
            });

            state[issueListsNames[action.myIndex]] = newA;

            return state;
        }
        case 'DELETEISSUELIST': {
            let i = 0;

            issueListsNames.map((item, index) => {
                if (index === action.deleteMe) {
                    console.log('not adding ' + index);
                    state['items' + i.toString()] = null;
                    return item;
                } else {
                    console.log('items' + i);
                    console.log(issueListsNames.length);
                    state['items' + i.toString()] = state[item];
                    i++;
                    return item;
                }
            });

            issueListsNames.pop();

            return state;
        }
        case 'UPDATELISTS': {
            let i = 0;

            issueListsNames.map((item, index) => {
                if (i == issueListsNames.length - 1) {
                    state[item] = new Array();
                } else {
                    state[item] = state[item];
                    i++;
                }
            });

            return state;
        }
        default:
            throw new Error();
    }
});

let issueIdIncrement = 6;
let issueListsNames: string[] = ['items0', 'items1', 'items2'];

function App() {
    const [issueStrings, setIssueStrings] = useState(issueListsNames);
    const [state, dispatch] = useReducer(dragReducer, initialState);

    function useCallback(result: any) {
        if (result.reason === 'DROP') {
            if (!result.destination) {
                return;
            }
            dispatch({
                type: 'MOVE',
                from: result.source.droppableId,
                to: result.destination.droppableId,
                fromIndex: result.source.index,
                toIndex: result.destination.index,
            });
        }
    }

    return (
        <div>
            <button
                className="btn-primary"
                onClick={() => {
                    issueListsNames.push('items' + issueListsNames.length);
                    dispatch({ type: 'UPDATELISTS', me: state });
                }}
            >
                Add Issue List
            </button>
            <DragDropContext
                onDragEnd={(e) => {
                    useCallback(e);
                }}
            >
                {issueListsNames.map((item, index) => {
                    return arrangeDataInDragDropList(state, item, index);
                })}
            </DragDropContext>
        </div>
    );

    function arrangeDataInDragDropList(state: any, item: string, index: number) {
        return (
            <Droppable droppableId={'items' + index.toString()} type="PERSON">
                {(provided, snapshot) => {
                    return arrangeDragDropForIssueList(provided, state, state[item], index);
                }}
            </Droppable>
        );
    }

    function arrangeDragDropForIssueList(provided: any, state: any, mapItem: Issue[], index: any): JSX.Element {
        return (
            <div className="horizontalList" ref={provided.innerRef} {...provided.droppableProps}>
                {mapItem?.map((issue: Issue, IIndex: number) => arrangeIssueInList(issue, IIndex, index))}
                {provided.placeholder}
                <button
                    className="btn-secondary"
                    onClick={() => {
                        issueIdIncrement++;
                        dispatch({
                            type: 'UPDATE',
                        });
                        dispatch({
                            type: 'ADDITEM',
                            pass: 'items',
                            myIndex: index,
                            myData: state.items,
                            addThis: {
                                id: issueIdIncrement.toString(),
                                content: 'timeless, through and through',
                            },
                        });
                    }}
                >
                    Add Issue
                </button>
                <button
                    className="btn-secondary"
                    onClick={() => {
                        dispatch({ type: 'DELETEISSUELIST', deleteMe: index });
                    }}
                >
                    Delete List
                </button>
            </div>
        );
    }

    function arrangeIssueInList(issue: Issue, index: number, IIndex: number) {
        return (
            <Draggable key={issue.id} draggableId={issue.id} index={index}>
                {(provided, snapshot) => arrangeIssue(provided, issue, index, IIndex)}
            </Draggable>
        );
    }

    function arrangeIssue(provided: DraggableProvided, issue: Issue, index: number, IIndex: number) {
        return (
            <div ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps}>
                <div className="issueList">
                    <span>{issue.content + ' '}</span>
                    <button
                        className="btn-primary"
                        onClick={() => {
                            dispatch({
                                type: 'DELETEISSUE',
                                deleteMe: issue.id,
                                myIndex: IIndex,
                            });
                        }}
                    >
                        Delete
                    </button>
                </div>
            </div>
        );
    }
}

export const data: Issue[] = [
    {
        id: '1',
        content: "I'm a hussar",
    },
    {
        id: '2',
        content: "I'm a Hun",
    },
    {
        id: '3',
        content: "I'm a wretched Englishman",
    },
    {
        id: '4',
        content: "I'm a horse soldier",
    },
];

const initialState = { items0: data, items1: new Array(), items2: new Array() };
let test: Issue[][] = new Array();

export default App;

ReactDOM.render(<App />, document.getElementById('root'));
