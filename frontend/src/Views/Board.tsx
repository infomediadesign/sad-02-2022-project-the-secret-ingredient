import React, { useCallback, useState, useReducer, useEffect } from 'react';
import ReactDOM from 'react-dom';
import CSS from 'csstype';
import {
    Issue,
    editIssue,
    bordMainSetup,
    currentCardId,
    addIssue,
    addActivity,
    img,
    dragReducer,
    issueListsNames,
    initialState,
    removeFromIssueListNames,
    addToIssueListNames,
    moveIssueInernalList,
    moveIssueExternalList,
    issueListsMIds,
} from '../ViewModels/Board';
import { getGeneric, userID } from '../ViewModels/Get';
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
import { convertCompilerOptionsFromJson } from 'typescript';
import { useNavigate } from 'react-router-dom';
import { jwtSet } from '../util';
import { ImageTwoTone, NoEncryption } from '@material-ui/icons';
import { url } from 'inspector';
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

var loadingCount = 1;
export let issueIdIncrement = 6;
export var settingUPDone = false;
export function SetSettingUPDone(newV: boolean) {
    settingUPDone = newV;
}
let newText: string;
let queTextUpdate = false;

function App() {
    const navigate = useNavigate();
    const [loading, setloading] = useState(() => {
        settingUPDone = false;
        bordMainSetup(0);
        return true;
    });
    const [state, dispatch] = useReducer(dragReducer, initialState);
    const [isModalOpen, setModalState] = React.useState(false);
    const [issueObj, setIssueObj] = React.useState({ id: '', content: '', list: 0, num: 0 });
    const [loadingString, setLoadingString] = React.useState('Loading');

    useEffect(() => {
        if (!jwtSet()) {
            navigate('/');
        }
    }, []);

    const toggleModal = () => setModalState(!isModalOpen);

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
        var originalList = '';
        var destinationList = '';
        var destinationListNum = 0;

        issueListsNames.map((item: string, index) => {
            if (item == result.destination.droppableId) {
                destinationList = issueListsMIds[index];
                destinationListNum = index;
            }
            if (item == result.source.droppableId) {
                originalList = issueListsMIds[index];
            }
        });
        if (result.destination.droppableId == result.source.droppableId) {
            moveIssueInernalList(result.source.index, result.destination.index, originalList);
        } else {
            moveIssueExternalList(
                result.source.index,
                result.destination.index,
                destinationList,
                originalList,
                destinationListNum
            );
        }
    }

    const setText = (event: any) => {
        queTextUpdate = true;
        newText = event.target.value;
    };

    if (loading) {
        return preArrangeAll();
    }

    function preArrangeAll() {
        var LocalloadingString = 'Loading';
        for (var i = 0; i < loadingCount; i++) {
            LocalloadingString = LocalloadingString + '.';
        }

        if (settingUPDone) {
            setloading(false);
            dispatch({ type: 'UPDATE' });
        } else {
            loadingCount++;
            if (loadingCount == 4) {
                loadingCount = 0;
            }

            setTimeout(() => {
                setLoadingString(LocalloadingString);
            }, 1000);
        }

        return (
            <div>
                <p style={{ color: 'white' }}>{loadingString}</p>
                <button
                    className="btn-primary"
                    id="logout"
                    onClick={async (e) => {
                        e.preventDefault();
                        localStorage.removeItem('jwt');
                        navigate('/');
                    }}
                >
                    Cancel
                </button>
            </div>
        );
    }

    return (
        <div>
            <div
                style={{
                    width: '100%',
                    height: '50px',
                    backgroundColor: '#414440',
                    display: 'flex',
                    justifyContent: 'right',
                    alignItems: 'center',
                }}
            >
                <button
                    className="btn-primary"
                    id="logout"
                    onClick={async (e) => {
                        e.preventDefault();
                        localStorage.removeItem('jwt');
                        navigate('/');
                    }}
                >
                    Logout
                </button>
            </div>
            <div className="divScroll">
                <Modal
                    title={'Issue: ' + issueObj.id}
                    isOpen={isModalOpen}
                    onClose={() => {
                        setModalState(!isModalOpen);
                        if (queTextUpdate) {
                            editIssue(state[issueListsNames[issueObj.num]][issueObj.list].id, newText);
                            queTextUpdate = false;
                            dispatch({
                                type: 'UPDATESTATETEXT',
                                eventV: newText,
                                numV: issueObj.num,
                                listV: issueObj.list,
                            });
                        }
                    }}
                >
                    <input id="inputModal" onChange={setText} placeholder={issueObj.content}></input>
                </Modal>
                <div
                    style={{
                        backgroundImage: `url("${img.full}")`,
                        height: 1261 + 'px',
                        backgroundSize: 'cover',
                        backgroundRepeat: 'no-repeat',
                        boxShadow: 'none',
                    }}
                >
                    <button
                        id="AddIssueList"
                        className="btn-primary"
                        onClick={() => {
                            addToIssueListNames('items' + issueListsNames.length);
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
            </div>
        </div>
    );

    function arrangeDataInDragDropList(state: any, item: string, index: number) {
        return (
            <Droppable key={index} droppableId={'items' + index.toString()} type="PERSON">
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
                    id="addIssue"
                    className="btn-secondary"
                    onClick={async () => {
                        issueIdIncrement++;
                        /*await dispatch({
                            type: 'UPDATE',
                        });*/
                        await addIssue(
                            issueIdIncrement.toString(),
                            index,
                            'oh well',
                            state[issueListsNames[index]].length
                        );
                        //await addActivity(issueIdIncrement.toString(), index, "oh well", state[issueListsNames[index]].length-1);
                        await dispatch({
                            type: 'ADDITEM',
                            pass: 'items',
                            myIndex: index,
                            myData: state.items,
                            addThis: {
                                id: currentCardId,
                                content: 'oh well',
                            },
                        });
                    }}
                >
                    Add Issue
                </button>
                <button
                    id="deleteList"
                    className="btn-secondary"
                    onClick={async () => {
                        await removeFromIssueListNames(index);
                        await dispatch({ type: 'DELETEISSUELIST', deleteMe: index });
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
                        id="deleteCard"
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
                    <button
                        id="editCard"
                        className="btn-primary"
                        onClick={async () => {
                            setIssueObj({ id: issue.id, content: issue.content, list: index, num: IIndex });
                            toggleModal();
                        }}
                    >
                        Edit
                    </button>
                </div>
            </div>
        );
    }
}

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

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

let test: Issue[][] = new Array();

export default App;
