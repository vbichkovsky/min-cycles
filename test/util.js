export function a2v([x,y]) {
    return {x, y, adj: []};
}

export function addEdges(edges) {
    edges.forEach(([a,b]) => {
        a.adj.push(b);
        b.adj.push(a);
    });
}
