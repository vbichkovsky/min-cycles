let expect = require('expect.js'),
    a2v = ([x,y]) => ({x,y});    

import {extract_cycles as ec} from '../src/cycles';

`    a---c---d
     |\  |  /
     | \ | /
     e---b    `;

let a,b,c,d,e, e1,e2,e3,e4,e5,e6,e7;

beforeEach( () => {
    [a,b,c,d,e] = [[1,0], [2,1], [2,0], [3,0], [1,1]].map(a2v),
    [e1, e2, e3, e4, e5, e6, e7] = [[a,b], [b,c], [c,a], [c,d], [b,d], [a,e], [b,e]];
});

suite('just cycles');

test('a triangle', () => {
    let extracted = ec([a,b,c], [e1,e2,e3]);
    expect(extracted).to.eql([[a,b,c]]);
});

test('a rectangle', () => {
    let extracted = ec([a,e,b,c], [e2,e3,e6,e7]);
    expect(extracted).to.eql([[e,b,c,a]]);
});

test('a shared edge', () => {
    let extracted = ec([a,b,c,d], [e1,e2,e3,e4,e5]);
    expect(extracted).to.eql([[a,b,c],[b,d,c]]);
});
