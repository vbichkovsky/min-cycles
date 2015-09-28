let expect = require('expect.js');

import {extract_primitives as ep} from '../src/cycles';

suite('nested cycles');

test('two cycles sharing a vertex', () => {
    let vertices = [[0,4], [4,0], [4,4], [2,3], [3,2]],
        [a,b,c,d,e] = vertices,
        edges = [[a,b], [b,c], [c,a], [d,e], [e,c], [c,d]];
    let extracted = ep(vertices, edges);
    expect(extracted.isolated).to.eql([]);
    expect(extracted.filaments).to.eql([]);
    expect(extracted.cycles).to.eql([[d,c,e],[a,c,b]]);
});

test('two cycles connected with a filament', () => {
    let vertices = [[0,4], [4,0], [4,4], [2,3], [3,2], [3,3]],
        [a,b,c,d,e,f] = vertices,
        edges = [[a,b], [b,c], [c,a], [d,e], [e,f], [f,d], [f,c]];
    let extracted = ep(vertices, edges);
    expect(extracted.isolated).to.eql([]);
    expect(extracted.filaments).to.eql([[f,c]]);
    expect(extracted.cycles).to.eql([[d,f,e],[a,c,b]]);
});

test('nested in each corner of a rectangle', () => {
    let vertices = [[0,0],[5,0],[5,5],[0,5],
                    [1,2],[2,1],
                    [3,1],[4,2],
                    [4,3],[3,4],
                    [2,4],[1,3]],
        [m1,m2,m3,m4,c1,c2,c3,c4,c5,c6,c7,c8] = vertices,
        edges = [[m1,m2], [m2,m3], [m3,m4], [m4,m1],
                 [m1,c1],[c1,c2],[c2,m1],
                 [m2,c3],[c3,c4],[c4,m2],
                 [m3,c5],[c5,c6],[c6,m3],
                 [m4,c7],[c7,c8],[c8,m4]];
    let extracted = ep(vertices, edges);
    expect(extracted.isolated).to.eql([]);
    expect(extracted.filaments).to.eql([]);
    expect(extracted.cycles.length).to.eql(5);
});
