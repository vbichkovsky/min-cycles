import expect from 'expect.js';
import {a2v, addEdges} from './util';
import {extract_cycles as ec} from '../src/cycles';

`    a---c---d
     |\  |  /
     | \ | /
     e---b      `;

let [a,b,c,d,e] = [[1,0], [2,1], [2,0], [3,0], [1,1]].map(a2v),
    [e1, e2, e3, e4, e5, e6, e7] = [[a,b], [b,c], [c,a], [c,d], [b,d], [a,e], [b,e]];

suite('simple cycles');

test('a triangle', () => {
    addEdges([e1,e2,e3]);
    expect( ec([a,b,c]) ).to.eql( [[a,b,c]] );
});

test('a rectangle', () => {
    addEdges([e2,e3,e6,e7]);
    expect( ec([a,e,b,c]) ).to.eql( [[e,b,c,a]] );
});

test('a shared edge', () => {
    addEdges([e1,e2,e3,e4,e5]);
    expect( ec([a,b,c,d]) ).to.eql( [[a,b,c],[b,d,c]] );
});
