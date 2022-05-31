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

const horizontalList: CSS.Properties = {
    float: 'left',
    padding: '0.8rem',
    border: 'dotted',
    margin: '0.2rem',
};

const issueStyle: CSS.Properties = {
    padding: '0.2rem',
    border: 'dotted',
    margin: '0.1rem',
};

function fetchIssues(): Issue[] {
    const testA = data;

    return testA;
}

function fetchIssueLists(): IssueListTemp[] {
    const testA = {
        name: 'string',
        content: fetchIssues(),
    };

    return [testA];
}

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
            console.log('FUCK THIS LIST');
            return { items: data2 };
        }
        default:
            throw new Error();
    }
});

let issueIdIncrement = 6;

function App() {
    const [test, setTest] = useState(data);
    const [state, dispatch] = useReducer(dragReducer, initialState);

    const onDragEnd = useCallback((result: any) => {
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
    }, []);

    return (
        <div>
            <button onClick={() => dispatch({ type: 'ADDITEM' })}>-</button>
            <button>Add Issue List</button>
            <DragDropContext onDragEnd={onDragEnd}>
                <Droppable droppableId="items" type="PERSON">
                    {(provided, snapshot) => {
                        return (
                            <div style={horizontalList} ref={provided.innerRef} {...provided.droppableProps}>
                                {state.items?.map((issue: Issue, index: number) => arrangeIssueInList(issue, index))}
                                {provided.placeholder}
                                <button
                                    onClick={() => {
                                        issueIdIncrement++;
                                        data.map(() => [
                                            ...test,
                                            {
                                                id: issueIdIncrement.toString(),
                                                content: 'This list is buggy',
                                            },
                                        ]);
                                    }}
                                >
                                    Add Issue
                                </button>
                            </div>
                        );
                    }}
                </Droppable>
                <Droppable droppableId="items2" type="PERSON">
                    {(provided, snapshot) => {
                        return (
                            <div style={horizontalList} ref={provided.innerRef} {...provided.droppableProps}>
                                {state.items2?.map((issue: Issue, index: number) => arrangeIssueInList(issue, index))}
                                {provided.placeholder}
                                <button
                                    onClick={() => {
                                        issueIdIncrement++;
                                        setTest(() => [
                                            ...test,
                                            {
                                                id: issueIdIncrement.toString(),
                                                content: 'This list is buggy',
                                            },
                                        ]);
                                    }}
                                >
                                    Add Issue
                                </button>
                            </div>
                        );
                    }}
                </Droppable>
                <Droppable droppableId="items3" type="PERSON">
                    {(provided, snapshot) => {
                        return (
                            <div style={horizontalList} ref={provided.innerRef} {...provided.droppableProps}>
                                {state.items3?.map((issue: Issue, index: number) => arrangeIssueInList(issue, index))}
                                {provided.placeholder}
                                <button
                                    onClick={() => {
                                        issueIdIncrement++;
                                        setTest(() => [
                                            ...test,
                                            {
                                                id: issueIdIncrement.toString(),
                                                content: 'This list is buggy',
                                            },
                                        ]);
                                    }}
                                >
                                    Add Issue
                                </button>
                            </div>
                        );
                    }}
                </Droppable>
            </DragDropContext>
        </div>
    );

    function arrangeDragDropForIssueList(provided: any, state: any, mapItem: any) {
        return (
            <div style={horizontalList} ref={provided.innerRef} {...provided.droppableProps}>
                {mapItem?.map((person: any, index: any) => arrangeIssueInList(person, index))}
                {provided.placeholder}
                <button onClick={() => {}}>Add Issue</button>
            </div>
        );
    }
}

function arrangeIssueInList(issue: Issue, index: number) {
    return (
        <Draggable key={issue.id} draggableId={issue.id} index={index}>
            {(provided, snapshot) => arrangeIssue(provided, issue)}
        </Draggable>
    );
}

function arrangeIssue(provided: DraggableProvided, issue: Issue) {
    return (
        <div ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps}>
            <div style={issueStyle}>
                <span>{issue.content}</span>
            </div>
        </div>
    );
}

export const data: Issue[] = [
    {
        id: '1',
        content: 'This list is buggy',
    },
    {
        id: '2',
        content: 'I hate lists like this...',
    },
    {
        id: '3',
        content: 'Why would react do this to me',
    },
    {
        id: '4',
        content: 'HAMBURGER PLEAAAAAAAAAAAAAAAASE',
    },
];

export const data2: Issue[] = [
    {
        id: '5',
        content: 'This list is buggy',
    },
];
const initialState = { items: data };
export default App;

ReactDOM.render(<App />, document.getElementById('root'));
