export function extract_cycles(vertices, edges) {
    vertices.forEach(v => v.adj = []);
    edges.forEach(e => {
        e[0].adj.push(e[1]);
        e[1].adj.push(e[0]);
    });

    let cycles = [];
    while (vertices.length > 0) {
        let v = leftBottomVertex(vertices),
            walk = reduceWalk(closedWalkFrom(v));
        if (walk.length > 2) cycles.push(walk);
        removeEdge(walk[0], walk[1]);
        vertices = removeFilamentAt(walk[0], vertices);
        vertices = removeFilamentAt(walk[1], vertices);
    };
    return cycles;
};

function leftBottomVertex(vertices) {
    return vertices.reduce( (m,v) => {
        let dx = v.x - m.x;
        if (dx < 0) return v;
        if (dx > 0) return m;
        return v.y - m.y < 0 ? m : v;
    } );
}

function closedWalkFrom(v) {
    let walk = [], curr = v, prev;
    do {
        walk.push(curr);
        [curr, prev] = getNext(curr, prev);
    } while (curr !== v);
    return walk;
}

function reduceWalk(w) {
    for (let i=1; i < w.length; i++) {
        let idup = w.lastIndexOf(w[i]);
        if (idup > i) w.splice(i+1, idup - i);
    }
    return w;
}

function withoutVertex(v, vertices) {
    return vertices.filter(vi => vi !== v);
}

function removeEdge(v1, v2) {
    v1.adj = withoutVertex(v2, v1.adj);
    v2.adj = withoutVertex(v1, v2.adj);
}

function removeFilamentAt(v, vertices) {
    let current = v, next;
    while (current && current.adj.length < 2) {
        vertices = withoutVertex(current, vertices);        
        next = current.adj[0];
        if (next) removeEdge(current, next);
        current = next;
    }
    return vertices;
}

function getNext(v, prev) {
    let next = (v.adj.length == 1) ? v.adj[0] : best_by_kind(prev, v, prev ? 'ccw' : 'cw');
    return [next, v];
}

function best_by_kind(v_prev, v_curr, kind) {
    let d_curr, adj = v_curr.adj;
    if (v_prev) {
        d_curr = vsub(v_curr, v_prev);
        adj = withoutVertex(v_prev, adj);
    } else {
        d_curr = {x: 0, y: -1};
    }
    
    return adj.reduce((v_so_far, v) => better_by_kind(v, v_so_far, v_curr, d_curr, kind));
};

function better_by_kind(v, v_so_far, v_curr, d_curr, kind) {
    let d = vsub(v, v_curr),
        d_so_far = vsub(v_so_far, v_curr),
        is_convex = dot_perp(d_so_far, d_curr) > 0,
        curr2v = dot_perp(d_curr, d),
        vsf2v = dot_perp(d_so_far, d),
        v_is_better;
    if (kind == 'cw') {
        v_is_better = (is_convex && (curr2v >= 0 || vsf2v >= 0)) || (!is_convex && curr2v >= 0 && vsf2v >= 0);
    } else {
        v_is_better = (!is_convex && (curr2v < 0 || vsf2v < 0)) || (is_convex && curr2v < 0 && vsf2v < 0);
    }
    return v_is_better ? v : v_so_far;
};

function vsub(a, b) {
    return {x: a.x - b.x, y: a.y - b.y};
}

function dot_perp(a, b) {
    return a.x * b.y - b.x * a.y;
}
