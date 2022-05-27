import React from "react";
import issueList from "./IssueList";

export default function App() {
  return (
      <div>
          <button onClick={test} >
                Add List
          </button>
      </div>
  );
}



export function test(e: any){
  e.preventDefault();
  console.log('You clicked submit');
}

