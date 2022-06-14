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
import { parseJwt } from '../util';
import { settingUPDone, SetSettingUPDone } from '../Views/Board';

import axios from 'axios';

const page = Math.floor(Math.random() * 100) + 1;
const query = 'landscape';
const BASE_URL = `https://api.unsplash.com/search/photos?page=${page}&query=${query}&client_id=${process.env.REACT_APP_CLIENT_KEY}`;

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
            state[issueListsNames[action.myIndex]].push(action.addThis);
            return state;
        }
        case 'UPDATE': {
            state = initialState;
            return state;
        }
        case 'DELETEISSUE': {
            deleteCardFromIssueList(
                action.deleteMe,
                issueListsMIds[action.myIndex],
                state[issueListsNames[action.myIndex]].length
            );
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
        case 'UPDATESTATETEXT': {
            console.log(action.numV);
            console.log(action.listV);
            state[issueListsNames[action.numV]][action.listV].content = action.eventV;
            return state;
        }
        default:
            throw new Error();
    }
});

var currentBoardId: string;

export async function bordMainSetup(boardNum: number) {
    const jwt = localStorage.getItem('jwt');
    const parsedJwt = parseJwt(jwt!);
    const userId = parsedJwt.iss._id;
    const Bkimages = axios.get(BASE_URL);

    if (userId == undefined || userId == null) {
        console.log('fuck...');
    }
    console.log(userId);

    var boardResponse = await getGeneric(`${process.env.REACT_APP_BASE_API_URI}/boards/` + userId, 'GET');
    var boardID: string;
    var img: any;

    if (boardResponse.board.length == 0) {
        boardResponse = await postGeneric(
            `${process.env.REACT_APP_BASE_API_URI}/board/`,
            {
                name: 'testBoard',
                image: {
                    color: (await Bkimages).data.results[0].color,
                    thumb: (await Bkimages).data.results[0].urls.thumb,
                    full: (await Bkimages).data.results[0].urls.full,
                },
                uId: userId,
            },
            'POST'
        );
        boardID = boardResponse.board[boardNum]._id;
        img = boardResponse.board.image;
        // console.log(img.color);
    } else {
        boardID = boardResponse.board[boardNum]._id;
        img = boardResponse.board.image;
    }

    currentBoardId = boardID;

    const listResponse = await getGeneric(`${process.env.REACT_APP_BASE_API_URI}/lists/` + boardID, 'GET');
    issueListsNames = listResponse.lists.map((item: any, index: number) => 'items' + index);
    issueListsMIds = listResponse.lists.map((item: any, index: number) => item._id);

    if (issueListsMIds.length === 0) {
        return;
    }

    /*
    initialState.items0 = [{
        id: '1',
        content: "I'm a hussar",
    }]*/
    var intermidiateState: Record<string, any> = {};

    for (var i = 0; i < issueListsNames.length; i++) {
        let listsCards = await getGeneric(
            `${process.env.REACT_APP_BASE_API_URI}/list/` + issueListsMIds[i] + `/cards`,
            'GET'
        );

        var listArray = new Array();
        for (var j = 0; j < listsCards.cards.length; j++) {
            let listsActiv = await getGeneric(
                `${process.env.REACT_APP_BASE_API_URI}/card/` + listsCards.cards[j]._id + `/activitys`,
                'GET'
            );
            let pos = listsCards.cards[j].order;
            if (listsActiv.activities[0] == undefined || listsActiv.activities[0] == null) {
                listArray[pos] = { id: listsCards.cards[j]._id, content: 'Error no text' };
            } else {
                listArray[pos] = { id: listsCards.cards[j]._id, content: listsActiv.activities[0].text };
            }
        }
        console.log(listsCards);
        console.log(i);
        intermidiateState[issueListsNames[i]] = listArray;
        if (i == issueListsNames.length) {
            console.log('done!');
        }
    }

    initialState = intermidiateState;
    await SetSettingUPDone(true);

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
export let issueListsNames: string[] = ['items0', 'items1'];
export let issueListsMIds: string[] = [];

export async function addToIssueListNames(newValue: string) {
    issueListsNames.push(newValue);
    waitingForDb = true;
    const response = await postGeneric(
        `${process.env.REACT_APP_BASE_API_URI}/list/`,
        { name: newValue, bId: currentBoardId, order: issueListsNames.length - 1 },
        'POST'
    );
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
    const response = await postGeneric(
        `${process.env.REACT_APP_BASE_API_URI}/card/`,
        { name: name, lId: issueListsMIds[index], bId: currentBoardId, order: order },
        'POST'
    );
    currentCardId = response.card._id;
    console.log(response);
    console.log(content);
    console.log(currentCardId);
    console.log(currentBoardId);
    const responseNew = await postGeneric(
        `${process.env.REACT_APP_BASE_API_URI}/Activity/`,
        { text: content, cId: currentCardId, bId: currentBoardId },
        'POST'
    );
    return response.card._id;
}

export async function deleteCardFromIssueList(Cid: number, issueListID: string, lastIndex: number) {
    const response = await getGeneric(`${process.env.REACT_APP_BASE_API_URI}/card/` + Cid, 'GET');

    await moveIssues(issueListID, lastIndex, -1, response.card.order, false);
    await getGeneric(`${process.env.REACT_APP_BASE_API_URI}/card/` + Cid, 'DELETE');
}

export async function addActivity(name: string, index: number, content: string, order: number) {}

export async function editIssue(listIndex: string, newText: string) {
    const response = await getGeneric(`${process.env.REACT_APP_BASE_API_URI}/card/` + listIndex + `/activitys`, 'GET');
    await getGeneric(`${process.env.REACT_APP_BASE_API_URI}/Activity/` + response.activities[0]._id, 'DELETE');
    const responseNew = await postGeneric(
        `${process.env.REACT_APP_BASE_API_URI}/Activity/`,
        { text: newText, cId: listIndex, bId: currentBoardId },
        'POST'
    );
}

export async function moveIssueInernalList(oldPos: number, newPos: number, listId: string) {
    var moveDirect = 1;
    if (oldPos < newPos) {
        moveDirect = -1;
    }
    moveIssues(listId, newPos, moveDirect, oldPos, true);
}

export async function moveIssueExternalList(
    oldPos: number,
    newPos: number,
    newList: string,
    oldList: string,
    newListIndex: number
) {
    var response = await getGeneric(`${process.env.REACT_APP_BASE_API_URI}/list/` + newList + `/cards`, 'GET');
    moveIssues(newList, newPos, 1, response.cards.length, false);

    response = await getGeneric(`${process.env.REACT_APP_BASE_API_URI}/list/` + oldList + `/cards`, 'GET');
    response.cards.map(async (item: any) => {
        if (item.order == oldPos) {
            const active = await getGeneric(
                `${process.env.REACT_APP_BASE_API_URI}/Card/` + item._id + `/activitys`,
                'GET'
            );
            addIssue(item.name, newListIndex, active.activities[0].text, newPos);
        }
    });
    moveIssues(oldList, response.cards.length, -1, oldPos, false);
}

async function moveIssues(issueListId: string, moveAt: number, moveDirect: number, me: number, adding: boolean) {
    const response = await getGeneric(`${process.env.REACT_APP_BASE_API_URI}/list/` + issueListId + `/cards`, 'GET');
    response.cards.map(async (item: any) => {
        if (item.order == me) {
            if (adding) {
                await postGeneric(
                    `${process.env.REACT_APP_BASE_API_URI}/Card/` + item._id,
                    { name: item.name, order: moveAt },
                    'PUT'
                );
            } else {
                return;
            }
        }
        if (item.order * moveDirect >= moveAt * moveDirect && me * moveDirect > item.order * moveDirect) {
            await postGeneric(
                `${process.env.REACT_APP_BASE_API_URI}/Card/` + item._id,
                { name: item.name, order: item.order + moveDirect },
                'PUT'
            );
        }
    });
}
