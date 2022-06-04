import React, { useCallback, useState, useReducer } from 'react';
import ReactDOM from 'react-dom';
import CSS from 'csstype';
import { Issue, IssueListTemp, getIssues, dragReducer, issueListsNames } from '../ViewModels/Board';
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
import { Modal } from '../components/Modal';
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

export let issueIdIncrement = 6;

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
        const [isModalOpen, setModalState] = React.useState(false);

        const toggleModal = () => setModalState(!isModalOpen);
        return (
            <div ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps}>
                <div className="issueList" onClick={toggleModal}>
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
                    <Modal title={'This is my modal'} isOpen={isModalOpen} onClose={toggleModal}>
                        I'm a wretched Englishman. I'm a horse soldier. I'm a Hun.
                    </Modal>
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
function setOpen(arg0: boolean) {
    throw new Error('Function not implemented.');
}
