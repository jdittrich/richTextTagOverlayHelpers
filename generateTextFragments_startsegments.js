/*
This solves the following problems:
* Ranges (of Text) can be overlapping
* HTML does not allow overlapping tags like <annotation1>This is <annotation2>Some </annotation1>Text</annotation2>

Thus it convertes the overlapping areas split in a non-overlapping linear structure like
<Annotation 1>This is</Annotation1> <Annotation1, Annotation2>Some</Annotation1, Annotation2><Annotation2>Text</Annotation2>

See this illustration:
--------------------------------------------------------------------------------------

            TEXT:  This is a Text with sections  |
     ANNOTATIONS:  <-------S1----->              | This is passed to the function
                |        <----------S2-------->  |

      BOUNDARIES:  |     |        |           |  | This is created in
       Start/End|  <     <        >           >  | createSortedRangeBoundaryList()
      Belongs to|  1     2        1           2  |

 NON-OVERLAPPING:  <-1---❌--1,2---❌----2------>  | This is the output

---------------------------------------------------------------------------------------
A special case are sections starting at the same character index,
since the section needs to be marked to match two different original sections
but this can be only found out via looking ahead in an sorted array of boundaries.
---------------------------------------------------------------------------------------
            TEXT: This is a Text with sections
     ANNOTATIONS: <---S1--->
                  <---S2------>
      BOUNDARIES: |        |  |
      Start/End | «        >  >
      Belongs to| ½        1  2

 NON-OVERLAPPING: <--1,2---❌--2>

---------------------------------------------------------------------------------------
*/

import _ from '../../node_modules/lodash-es/lodash.js';
// long path = I can use ES6 in browser without babel, webpack…
// .js (instead of no .file) = mime type will be correct (when using simple server) //TODO: Should this be just "lodash" (I returned to bundling again) 

import {convertRangelistToBoundarylist} from './boundaryRangeHelpers.js';

export default function createSectionsList (annotationsArray) {
  /*
  GETS: a list with (potentially) overlapping sections defined by start/end:
    {start:1, end:5, id:"321"}, {start…
  RETURNS: a list with non-overlapping sections defined by their
    start/end and the list of ids that concern these sections
    (one id if non-overlapping, several ids if sections overlap)
    Each section also has an array indicating which actual sections start at that segment (it is thus the first-of-its-id)
  */

  let sortedRangeBoundaryList = convertRangelistToBoundarylist(annotationsArray);
  // gets a list like {index:1, boundaryType:"start", id:"321"}, {index:5, boundaryType:"end", id:"321"},…

  var currentIDs = {}; // keeps which annotations are currently active/overlapping
  var sections = []; // keeps the section boundaries

  // since we operate with [i-1] (previous) and [i+1] (next) this is a "old" for-loop
  for (let i = 0; i < sortedRangeBoundaryList.length - 1; i++) { // length-1 since we look ahead by 1 in the loop.
    let currentElement = sortedRangeBoundaryList[i];
    let nextElement = sortedRangeBoundaryList[i + 1];

    // keep track (save/delete) which IDs are active for the current section
    if (currentElement.boundaryType === 'start') {
      currentIDs[currentElement.id] = true;
    }
    // If the next boundary is actually not another boundary but the same
    // Problem 1: the distance from start to the next index is 0 (since the next index is the same)
    // Problem 2: there need to be 2 ids (because two areas start at the same position), but the second would overwrite the first.
    // thus, check the next number. If it is a start as well AND a has the same position, correct its ids and next boundary.
    // Do not push something new

    if (nextElement &&
    nextElement.boundaryIndex === currentElement.boundaryIndex &&
    nextElement.boundaryType === currentElement.boundaryType) {
      continue;
    }

    // Since end elements carry their ID, delete this id
    // remember, we look ahead in defining the sections, 
    // so the section for which it is deleted is from the "end" to the next boundary.
    if (currentElement.boundaryType === 'end') {
      delete currentIDs[currentElement.id]; // on "delete" : https://stackoverflow.com/questions/208105/how-do-i-remove-a-property-from-a-javascript-object
    }

    sections.push({
      start: currentElement.boundaryIndex,
      end: nextElement.boundaryIndex,
      ids: _.keys(currentIDs) // since keys are either true or deleted (http://underscorejs.org/#keys)
    });
  }; // end for

  return sections;
};
