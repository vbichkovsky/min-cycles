let expect = require('expect.js');

import {extract_primitives as ep} from '../cycles';

suite('the complex graph from the PDF');

let [i1, i2] = [[0,1], [15,4]],
    [f1,f2,f3,
     f4,f5,f6,
     f7,f8,f9] = [[2,5], [4,4], [6,6], 
                  [5,2], [8,1], [10,2],
                  [12,9],[16,7],[18,8]],
    [c1,c2,c3,c4,c5,c6,c7,c8,c9,c10,c11,c12,c13,c14,c15,c16,c17] = 
        [[1,2],[0,6],
         [7,8],[9,4],[10,7],
         [11,6],[15,2],[17,3],[19,2],[21,0],[20,5],
         [25,5],[25,9],[20,9],
         [22,8],[23,6],[24,8]],
    vertices = [i1,i2, 
                f1,f2,f3,f4,f5,f6,f7,f8,f9,
                c1,c2,c3,c4,c5,c6,c7,c8,c9,c10,c11,c12,c13,c14,c15,c16,c17],
    edges = [[f1,f2],[f2,f3],
             [f4,f5],[f5,f6],
             [f7,f8],[f8,f9],
             [c1,c2],[c2,f3],[c1,f4],[f3,f4],
             [c3,c4],[c4,c5],[c5,c3],
             [f6,c7],[c7,c8],[c8,c9],[c9,c10],[c10,c11],[c9,c11],[c6,c11],[f6,c6],[c6,c7],
             [c11,c12],[c12,c13],[c13,c14],[c14,c11],
             [c15,c16],[c16,c17],[c17,c15]];

test('all kinds of primitives', () => {
    let extracted = ep(vertices, edges);
    expect(extracted.isolated).to.eql([i1, i2]);
    expect(extracted.filaments).to.eql([[f1,f2,f3],[f4,f5,f6],[f7,f8,f9]]);
    expect(extracted.cycles).to.eql([
        [c2,f3,f4,c1],
        [c3,c5,c4],
        [f6,c6,c7],
        [c6,c11,c9,c8,c7],
        [c9,c11,c10],
        [c14,c13,c12,c11],
        [c15,c17,c16] ]);
});
