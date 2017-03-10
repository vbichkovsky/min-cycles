import expect from 'expect.js';
import {a2v, addEdges} from './util';
import {extract_cycles as ec} from '../src/cycles';

suite('nested cycles');

test('two cycles sharing a vertex', () => {
    let vertices = [[0,4], [4,0], [4,4], [2,3], [3,2]].map(a2v),
        [a,b,c,d,e] = vertices;
    addEdges([[a,b], [b,c], [c,a], [d,e], [e,c], [c,d]]);
    expect(ec(vertices)).to.eql([[a,c,b], [d,c,e]]);
});

test('two cycles connected with a filament', () => {
    let vertices = [[0,4], [4,0], [4,4], [2,3], [3,2], [3,3]].map(a2v),
        [a,b,c,d,e,f] = vertices;
    addEdges([[a,b], [b,c], [c,a], [d,e], [e,f], [f,d], [f,c]]);
    expect(ec(vertices)).to.eql([[a,c,b],[d,f,e]]);
});

test('nested in each corner of a rectangle', () => {
    let vertices = [[0,0],[5,0],[5,5],[0,5],
                    [1,2],[2,1],
                    [3,1],[4,2],
                    [4,3],[3,4],
                    [2,4],[1,3]].map(a2v),
        [m1,m2,m3,m4,c1,c2,c3,c4,c5,c6,c7,c8] = vertices;
    addEdges([ [m1,m2], [m2,m3], [m3,m4], [m4,m1],
               [m1,c1],[c1,c2],[c2,m1],
               [m2,c3],[c3,c4],[c4,m2],
               [m3,c5],[c5,c6],[c6,m3],
               [m4,c7],[c7,c8],[c8,m4] ]);
    expect(ec(vertices).length).to.eql(5);
});
