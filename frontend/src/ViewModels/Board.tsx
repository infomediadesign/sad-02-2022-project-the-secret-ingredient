import React, { useState } from 'react';
import ReactDOM from 'react-dom';
import {getGeneric, userID} from '../ViewModels/Get'
import {postGeneric} from "../ViewModels/Post"
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
            addIssue(action.addThis.id, action.myIndex, action.addThis.content, state[issueListsNames[action.myIndex]].length-1);
            addActivity(action.addThis.id, action.myIndex, action.addThis.content, state[issueListsNames[action.myIndex]].length-1);

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
                    newIssueListsMIds[i] = issueListsMIds[index]
                    state['items' + i.toString()] = null;
                    return item;
                } else {
                    console.log('items' + i);
                    console.log(issueListsNames.length);
                    state['items' + i.toString()] = state[item];
                    newIssueListsMIds[i] = issueListsMIds[index]
                    i++;
                    return item;
                }
            });

            issueListsNames.pop();
            newIssueListsMIds.pop();

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

var currentBoardId : string;

export async function bordMainSetup(boardNum: number){
    const boardResponse = await getGeneric('http://localhost:1234/boards/' + userID, 'GET');
    const boardID = boardResponse.board[boardNum]._id;
    currentBoardId = boardID;

    const listResponse = await getGeneric('http://localhost:1234/lists/' + boardID, 'GET')
    issueListsNames = listResponse.lists.map((item : any, index : number) => {return ("items" + index)});
    issueListsMIds = listResponse.lists.map((item : any, index : number) => {return (item._id)});
    
    initialState.items0 = [{
        id: '1',
        content: "I'm a hussar",
    }]

      
    let listsCards = await getGeneric('http://localhost:1234/list/' + issueListsMIds[0] + '/cards', 'GET');

    initialState.items0 = await listsCards.cards.map((cardItem : any) => {
        return {id: cardItem._id, content: "Wowee"}
    });

    //initialState = await intialStateVaribleSetup();


    //THIS IS SOME MAJOR SHIT....
    function intialStateVaribleSetup(){
        const initialStateResponse = listResponse.lists.map(async(item: string, index : number) => {
            let listsCards = await getGeneric('http://localhost:1234/list/' + issueListsMIds[index] + '/cards', 'GET');
            console.log("thats the true issue");
            let listsCardsArray = new Array(listsCards.cards.length);
            listsCards.cards.map(async(cardItem : any) => {
                listsCardsArray[cardItem.order] = {id: cardItem.name, content: "Wowee"}
            });
            console.log("here");
            console.log(listsCardsArray);
            initialStateResponse[item] = listsCardsArray;
        })
        return initialStateResponse;
    }

    console.log("AndSooWrong");
    console.log(initialState);
    
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

export var initialState = {items0: data};

let waitingForDb = false;
export let issueListsNames: string[] = ['items0', 'items1', 'items2'];
export let issueListsMIds: string[] = [];

export async function addToIssueListNames(newValue: string){
    issueListsNames.push(newValue);
    waitingForDb = true;
    const response = await postGeneric("http://localhost:1234/list", {"name" : newValue, "bId" : currentBoardId, "order" : issueListsNames.length-1});
    issueListsMIds.push(response.list._id);
    waitingForDb = false;
}

export async function removeFromIssueListNames(indexValue: number){
    waitingForDb = true;
    const response = await getGeneric("http://localhost:1234/list/" + issueListsMIds[indexValue], 'DELETE');
    waitingForDb = false;
}

var currentCardId : string;

async function addIssue(name: string, index: number, content: string, order: number){
    if(waitingForDb){
        alert("calme bitte!");
    }
    console.log("first...");
    const response = await postGeneric("http://localhost:1234/card", {"name" : name, "lId" : issueListsMIds[index], "bId" : currentBoardId, "order" : order});
    console.log(response.message);
    currentCardId = response.card._id;
    console.log(currentCardId);
    const responseNew = await postGeneric("http://localhost:1234/Activity", {"text" : content, "cId" : currentCardId, "bId" : currentBoardId}); 
    console.log(responseNew.message);
}

export async function deleteCardFromIssueList(Cid: number){
    const response = await getGeneric("http://localhost:1234/card/" + Cid, 'DELETE');
}

async function addActivity(name: string, index: number, content: string, order: number){
}


