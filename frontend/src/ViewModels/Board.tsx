import React, { useState } from 'react';
import ReactDOM from 'react-dom';
import { getGeneric, userID } from '../ViewModels/Get';
import { postGeneric } from '../ViewModels/Post';
import {
    DragDropContext,
    Draggable,
    DraggingStyle,
    Droppable,
    DropResult,
    NotDraggingStyle,
} from 'react-beautiful-dnd';
import produce from 'immer';
import { useNavigate } from 'react-router-dom';
import { idText } from 'typescript';

export interface BoardViewModel {
    _id: string;
    name: string;
    image: {
        color: string;
        thumbnail: string;
        full: string;
    };
}

export interface IssueListTemp {
    name: string;
    content: Issue[];
}

export interface Issue {
    id: string;
    content: string;
}

// fake data generator
export function getIssues(count: number): Issue[] {
    return Array.from({ length: count }, (v, k) => k).map((k) => ({
        id: `issue-${k}`,
        content: `issue ${k}`,
    }));
}

export const dragReducer = produce((state: any, action: any) => {
    switch (action.type) {
        case 'MOVE': {
            state[action.from] = state[action.from] || [];
            state[action.to] = state[action.to] || [];
            const [removed] = state[action.from].splice(action.fromIndex, 1);
            state[action.to].splice(action.toIndex, 0, removed);
            return;
        }
        case 'ADDITEM': {
            console.log('adding.....');

            console.log(currentCardId);
            state[issueListsNames[action.myIndex]].push(action.addThis);

            console.log('DONE!');
            return state;
        }
        case 'UPDATE': {
            return state;
        }
        case 'DELETEISSUE': {
            deleteCardFromIssueList(action.deleteMe);
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
            var newIssueListsMIds = new Array();

            issueListsNames.map((item, index) => {
                if (index === action.deleteMe) {
                    console.log('not adding ' + index);
                    newIssueListsMIds[i] = issueListsMIds[index];
                    state['items' + i.toString()] = null;
                    return item;
                } else {
                    console.log('items' + i);
                    console.log(issueListsNames.length);
                    state['items' + i.toString()] = state[item];
                    newIssueListsMIds[i] = issueListsMIds[index];
                    i++;
                    return item;
                }
            });

            issueListsNames.pop();
            newIssueListsMIds.pop();
            issueListsMIds = newIssueListsMIds;

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

var currentBoardId: string;

export async function bordMainSetup(boardNum: number) {
    var boardResponse = await getGeneric(`${process.env.REACT_APP_BASE_API_URI}/boards/` + userID, 'GET');
    var boardID: string;

    if (boardResponse.board.length == 0) {
        boardResponse = await postGeneric(`${process.env.REACT_APP_BASE_API_URI}/board`, {
            name: 'testBoard',
            image: { color: 'green', thumb: 'one.jpg', full: 'true' },
            uId: userID,
        });
        boardID = boardResponse.board._id;
    } else {
        boardID = boardResponse.board[boardNum]._id;
    }

    currentBoardId = boardID;

    const listResponse = await getGeneric(`${process.env.REACT_APP_BASE_API_URI}/lists/` + boardID, 'GET');
    issueListsNames = listResponse.lists.map((item: any, index: number) => {
        return 'items' + index;
    });
    issueListsMIds = listResponse.lists.map((item: any, index: number) => {
        return item._id;
    });

    if (issueListsMIds.length == 0) {
        return;
    }

    /*
    initialState.items0 = [{
        id: '1',
        content: "I'm a hussar",
    }]*/
    var intermidiateState: any = {};

    for (var i = 0; i < issueListsNames.length; i++) {
        let listsCards = await getGeneric(
            `${process.env.REACT_APP_BASE_API_URI}/list/` + issueListsMIds[i] + '/cards',
            'GET'
        );

        intermidiateState[issueListsNames[i]] = await listsCards.cards.map((cardItem: any) => {
            return { id: cardItem._id, content: 'Wowee' };
        });
    }

    initialState = intermidiateState;

    //THIS IS SOME MAJOR SHIT....
    function intialStateVaribleSetup() {
        const initialStateResponse = listResponse.lists.map(async (item: string, index: number) => {
            let listsCards = await getGeneric(
                `${process.env.REACT_APP_BASE_API_URI}/list/` + issueListsMIds[index] + '/cards',
                'GET'
            );
            console.log('thats the true issue');
            let listsCardsArray = new Array(listsCards.cards.length);
            listsCards.cards.map(async (cardItem: any) => {
                listsCardsArray[cardItem.order] = { id: cardItem.name, content: 'Wowee' };
            });
            console.log('here');
            console.log(listsCardsArray);
            initialStateResponse[item] = listsCardsArray;
        });
        return initialStateResponse;
    }

    return;
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

export var initialState: any = { items0: data };

let waitingForDb = false;
export let issueListsNames: string[] = ['items0', 'items1', 'items2'];
export let issueListsMIds: string[] = [];

export async function addToIssueListNames(newValue: string) {
    issueListsNames.push(newValue);
    waitingForDb = true;
    const response = await postGeneric(`${process.env.REACT_APP_BASE_API_URI}/list`, {
        name: newValue,
        bId: currentBoardId,
        order: issueListsNames.length - 1,
    });
    issueListsMIds.push(response.list._id);
    waitingForDb = false;
}

export async function removeFromIssueListNames(indexValue: number) {
    waitingForDb = true;
    const response = await getGeneric(
        `${process.env.REACT_APP_BASE_API_URI}/list/` + issueListsMIds[indexValue],
        'DELETE'
    );
    waitingForDb = false;
}

export var currentCardId: string;

export async function addIssue(name: string, index: number, content: string, order: number) {
    if (waitingForDb) {
        alert('calme bitte!');
    }
    console.log('first...');
    console.log(index);
    const response = await postGeneric(`${process.env.REACT_APP_BASE_API_URI}/card`, {
        name: name,
        lId: issueListsMIds[index],
        bId: currentBoardId,
        order: order,
    });
    console.log(response.message);
    currentCardId = response.card._id;
    console.log(currentCardId);
    const responseNew = await postGeneric(`${process.env.REACT_APP_BASE_API_URI}/activity`, {
        text: content,
        cId: currentCardId,
        bId: currentBoardId,
    });
    console.log(responseNew.message);
    console.log('i made a new issue');

    return response.card._id;
}

export async function deleteCardFromIssueList(Cid: number) {
    const response = await getGeneric(`${process.env.REACT_APP_BASE_API_URI}/card/` + Cid, 'DELETE');
}

export async function addActivity(name: string, index: number, content: string, order: number) {}
