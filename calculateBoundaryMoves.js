/*
GETS:
* An array of ranges: {
                start: 2,
                end: 6,
                id: "boundary_1"
              },
              {
                start: 4,
                end: 7,
                id: "boundary_2"
              },
* A list of changes of the types "delete","add", "retain". All have a length. Note: delete is →/delete-forward , like a keyboards del-key.
  [ //this is the "normal change"
    {
      'type': 'retain',
      'length': 2 //first n characters unchanged.
    },
    {
      'type': add,
      'length': 1 //added string with length 5 at position n (see before).
    }
  ],
  [
    {
      'type':'retain',…

RETURNS: An array of ranges with updated range boundaries.

WORKS BY:
* Boundary index. See if it needs to be changed.
* Go through changes. If the change happens before it, it needs to consider it.

NOTES:
         A| B| C| D| E| F| G| H| I| J| K| L| M| N| O| P| Q| R|
       0  1  2  3  4  5  6  7  8  9  10 11 12 13 14 15 16 17 18 - Boundaries/Range-Index
         1  2  3  4  5  6  7  8  9 10 11 12 13 14 15 16 17 18   - Chars

             <--b1------->                                      - Annotations
                   <--b2---->  <-----b3---------->              |
                                                                |
                                                                | Operations:
              +                                                 | add 1 to all boundaries greater position 2
                                                                -
                             +  +  +  +  +                      | add 5 to all after position 6
                                                                -
                                                   +            | add 1 to all after position 14
                                                    → →         | substract 2 to all after position 15 (14+1 added)
*/

import _ from '../../node_modules/lodash-es/lodash.js';
import {convertRangelistToBoundarylist, convertBoundarylistToRangelist} from './boundaryRangeHelpers.js';

export default function calculateBoundaryMoves (rangeList, textChanges) {
  //todo: include check function that returns undefined if input was insufficient

  let boundaryList = convertRangelistToBoundarylist(rangeList);

  let updatedBoundaries = _.map(boundaryList, function (boundary, index, list) {
    let trackBoundaryIndex = boundary.boundaryIndex;
    // console.log('currentBoundary:', trackBoundaryIndex, boundary);

    _.each(textChanges, function (textChange, index, list) {
      // console.log('__currentChange:', textChange);
      let retain = 0;
      let retainObject = _.find(textChange, { 'type': 'retain' });
      if (retainObject && retainObject.length) {
        retain = retainObject.length;
      }

      if (retain < trackBoundaryIndex) { // if retain comes after the unchagend characters
        let added = 0;
        let addedObject = _.find(textChange, {'type': 'insert'});
        if (addedObject && addedObject.length) {
          added = addedObject.length;
        }

        let deleted = 0;
        let deletedObject = _.find(textChange, {'type': 'delete'});
        if (deletedObject && deletedObject.length) {
          deleted = deletedObject.length;
        }

        let move = added - deleted;

        // console.log('__ OLD boundaryIndex:', trackBoundaryIndex);
        // console.log('__move:', move, ' = ', 'added-deleted ', added, '-', deleted);
        
        // adjustBoundary
        trackBoundaryIndex = trackBoundaryIndex + move;
        // console.log('__ NEW boundaryIndex:', trackBoundaryIndex);
      }
    });

    let newBoundary = _.clone(boundary);

    newBoundary.boundaryIndex = trackBoundaryIndex;

    // console.log('____: newIndex:', trackBoundaryIndex);

    return newBoundary;
  });

  return convertBoundarylistToRangelist(updatedBoundaries);
}
