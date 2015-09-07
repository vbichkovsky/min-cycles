let expect = require('expect.js');

import {extract_primitives as ep} from '../cycles';

`    a---c---d
     |\  |  /
     | \ | /
     e---b    `;

let a,b,c,d,e, e1,e2,e3,e4,e5,e6,e7;

beforeEach( () => {
    [a,b,c,d,e] = [[1,0], [2,1], [2,0], [3,0], [1,1]];
    [e1, e2, e3, e4, e5, e6, e7] = [[a,b], [b,c], [c,a], [c,d], [b,d], [a,e], [b,e]];
});

suite('just cycles');

test('a triangle', () => {
    let extracted = ep([a,b,c], [e1,e2,e3]);
    expect(extracted.isolated).to.eql([]);
    expect(extracted.filaments).to.eql([]);
    expect(extracted.cycles).to.eql([[a,b,c]]);
});

test('a rectangle', () => {
    let extracted = ep([a,e,b,c], [e2,e3,e6,e7]);
    expect(extracted.isolated).to.eql([]);
    expect(extracted.filaments).to.eql([]);
    expect(extracted.cycles).to.eql([[e,b,c,a]]);
});

test('a shared edge', () => {
    let extracted = ep([a,b,c,d], [e1,e2,e3,e4,e5]);
    expect(extracted.isolated).to.eql([]);
    expect(extracted.filaments).to.eql([]);
    expect(extracted.cycles).to.eql([[a,b,c],[b,d,c]]);
});
