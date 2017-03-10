# MIN-CYCLES

Extracts minimal cycles from a planar undirected graph.

Based on [this document](http://www.geometrictools.com/Documentation/MinimalCycleBasis.pdf), 
(version from 02/04/2016).

Differences with the document: a left-handed coordinate system is
used, the positive Y axis direction is top-to-bottom.

Also, the algorithm is simplified a bit.

Input graph is defined by an array of vertices with following attributes:

x, y - coordinates
adj - an array of references to adjacent vertices

NB! Vertices are compared with '===', therefore _adj_ should contain
*references* to vertices and not their clones.

## USAGE

    import {extract_cycles} from 'min-cycles';

    vertices = [{x: 0, y: 0, adj: []}, {x: 5, y: 5, adj: []}, {x: 5, y: 0, adj: []}];
    
    // edges just define adjacent vertices for each vertex
    [ [0,1], [1,2], [2,0] ].forEach( (i1,i2) => {
        let v1 = vertices[i1], v2 = vertices[i2];
        v1.adj.push(v2);
        v2.adj.push(v1);
    });
    
    let result = extract_cycles(vertices);

    # cycles => [];
    # filaments => [ [[1,2], [5,6]] ];
    # result => [{x: 0, y: 0, ...}, {x: 5, y: 5, ...}, {x: 5, y: 0, ...}]

## BUILD
npm run-script prepublish

## TEST
npm run-script test
