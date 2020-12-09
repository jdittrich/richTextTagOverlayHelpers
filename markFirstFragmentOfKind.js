import _ from '../../node_modules/lodash-es/lodash.js';

//     { start: 1, end: 3, ids: ['a'] },
//     { start: 3, end: 5, ids: ['a', 'b'] },
//     { start: 5, end: 8, ids: ['b'] }
// ]
// to
// [
//     { start: 1, end: 3, ids: ['a'],startIDs:['a'] },
//     { start: 3, end: 5, ids: ['a', 'b'],startIDs:['b']},
//     { start: 5, end: 8, ids: ['b'] }
// ]
// and
//  { start: 1, end: 5, ids: ['a', 'b']}
// to
//  { start: 1, end: 5, ids: ['a', 'b'], startIDs:['a','b']}
export default function markFirstFragmentOfKind (annotationTextFragments) {
  let fragmentsWithMarkedStarts = [];

  // since the loop will always compare with the previous segment
  // the first starting definition needs to be created manually.
  let startingAtFirst = Object.assign([], annotationTextFragments[0].ids); // copy starting-at-array

  fragmentsWithMarkedStarts[0] = Object.assign(annotationTextFragments[0], {startingIDs: startingAtFirst});

  for (let i = 1; i < annotationTextFragments.length; i++) { // i=1 because we look one back
    let currentFragment = annotationTextFragments[i];
    let previousFragment = annotationTextFragments[i - 1];
    let startingIDs = _.without(currentFragment.ids, ...previousFragment.ids); // add only ids that are NOT in the previous section.

    fragmentsWithMarkedStarts[i] = Object.assign(annotationTextFragments[i], {'startingIDs': startingIDs});
  }

  return fragmentsWithMarkedStarts;
}
