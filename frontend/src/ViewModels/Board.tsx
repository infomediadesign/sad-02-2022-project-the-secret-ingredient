import React, { useState } from 'react';
import ReactDOM from 'react-dom';
import {
    DragDropContext,
    Draggable,
    DraggingStyle,
    Droppable,
    DropResult,
    NotDraggingStyle,
} from 'react-beautiful-dnd';
import produce from 'immer';

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

export let issueListsNames: string[] = ['items0', 'items1', 'items2'];
