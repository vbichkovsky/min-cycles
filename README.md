# MIN-CYCLES

Extracts primitives - minimal cycles, filaments and isolated
vertices - from a planar undirected graph.

Based on pseudocode from [http://www.geometrictools.com/Documentation/MinimalCycleBasis.pdf](this document).

Differences with the document: a left-handed coordinate system is
used, the positive Y axis direction is top-to-bottom.

## USAGE

    import {extract_primitives as ep} from 'min-cycles';

    vertices = [[1,2],[3,4],[5,6]];
    edges = [ [[1,2],[5,6]] ];
    
    let result = ep(vertices, edges);
    let {cycles, filaments, isolated} = result;

    # cycles => [];
    # filaments => [ [[1,2], [5,6]] ];
    # isolated => [3,4];

