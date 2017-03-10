let expect = require('expect.js'),
    a2v = ([x,y]) => ({x,y});    

import {extract_cycles as ec} from '../src/cycles';

let a,b,c,d,f,e1,e2,e3,e4;

`            f
           /
       a--b--c
           \
             d       `;

beforeEach( () => {
    [a,b,c,d,f] = [[1,0], [2,0], [3,0], [3,1], [3,-1]].map(a2v);
    [e1, e2, e3, e4] = [[a,b], [b,c], [b,d], [b,f]];
});

test('empty graph', () => {
    let extracted = ec([], []);
    expect(extracted).to.eql([]);
});

suite('filaments');

test('one-segment filament', () => {
    let extracted = ec([a,b], [e1]);
    expect(extracted).to.eql([]);
});

test('two-segment filament', () => {
    let extracted = ec([a,b,c], [e1, e2]);
    expect(extracted).to.eql([]);
});

test('a branch vertex', () => {
    let extracted = ec([b,c,d], [e2, e3]);
    expect(extracted).to.eql([]);
});

test('a branch vertex with 3 adjacent', () => {
    let extracted = ec([b,c,d,f], [e2, e3, e4]);
    expect(extracted).to.eql([]);
});
