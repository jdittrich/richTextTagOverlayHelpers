import _ from '../../node_modules/lodash-es/lodash.js';

function convertBoundarylistToRangelist (boundaryList) {
  // Creates intermediate representation of sections as a sorted list of section _boundaries_.
  // GETS: {index:1, boundaryType:"start", id:"321"}, {index:5, boundaryType:"end", id:"321"},…
  // RETURNS: a list build like: {start:1, end:5, id:"321"}, {start…
  // NOTES:
  // * This means every boundary is part of one range
  // * thanks for underscore
  let rangeList = _
    .chain(boundaryList)
    .map('id')
    .uniq()
    .map(function (id, index, list) {
      let matchingBoundaries = _.filter(boundaryList, {'id': id});

      return {
        start: _.find(matchingBoundaries, {'boundaryType': 'start'}).boundaryIndex,
        end: _.find(matchingBoundaries, { 'boundaryType': 'end' }).boundaryIndex,
        id: matchingBoundaries[0].id
      };
    })
    .value();

  return rangeList;
};

function convertRangelistToBoundarylist (rangeList) {
  // Creates intermediate representation of sections as a sorted list of section _boundaries_.
  // GETS: a list build like: {start:1, end:5, id:"321"}, {start…
  // RETURNS: {index:1, boundaryType:"start", id:"321"}, {index:5, boundaryType:"end", id:"321"},…
  // NOTES: This means every entry is split into two items

  let indexedList = _
    .chain(rangeList)
    .map(function (annotationRange, index, list) {
      return [
        {
          'boundaryIndex': annotationRange.start,
          'id': annotationRange.id,
          'boundaryType': 'start'
        },
        {
          'boundaryIndex': annotationRange.end,
          'id': annotationRange.id,
          'boundaryType': 'end'
        }
      ];
    })
    .flatten()
    .sortBy('boundaryIndex')
    .value();

  return indexedList;
};

export {convertBoundarylistToRangelist, convertRangelistToBoundarylist};
