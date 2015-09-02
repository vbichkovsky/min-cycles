let expect = require('expect.js');

import {extract_primitives as ep} from '../cycles';

let [a,b,c] = [[1,0], [2,0], [3,0]];
let [e1, e2] = [[a,b], [b,c]];

test('empty graph', () => {
    let extracted = ep([], []);
    expect(extracted.isolated).to.eql([]);
    expect(extracted.cycles).to.eql([]);
    expect(extracted.filaments).to.eql([]);
});

suite('isolated vertices');

test('two isolated vertices', () => {
    let extracted = ep([a,b], []);
    expect(extracted.isolated).to.eql([a,b]);
});

test('two connected vertices', () => {
    let extracted = ep([a,b], [e1]);
    expect(extracted.isolated).to.eql([]);
});

suite('filaments');

test('one-segment filament', () => {
    let extracted = ep([a,b], [e1]);
    expect(extracted.filaments).to.eql([[a,b]]);
});

test('two-segment filament', () => {
    let extracted = ep([a,b,c], [e1, e2]);
    expect(extracted.filaments).to.eql([[a,b,c]]);
});

test('a fork from two filaments');
test('filament starting at a branch vertex');

