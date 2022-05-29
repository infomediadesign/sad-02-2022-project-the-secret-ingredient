import React, { useState } from "react";
import ReactDOM from "react-dom";
import {
  DragDropContext,
  Draggable,
  DraggingStyle,
  Droppable,
  DropResult,
  NotDraggingStyle
} from "react-beautiful-dnd";

export interface Issue {
    id: string;
    content: string;
  }
  
 // fake data generator
export function getIssues(count: number): Issue[]{
    return (Array.from({ length: count }, (v, k) => k).map(k => ({
      id: `issue-${k}`,
      content: `issue ${k}`
})))};