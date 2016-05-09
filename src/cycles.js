export function extract_primitives(vertices, edges) {
    vertices.sort( (a,b) => a[0] != b[0] ? a[0] - b[0] : b[1] - a[1] );
    vertices.forEach(v => v.adj = []);

    for (let edge of edges) {
        edge[0].adj.push(edge[1]);
        edge[1].adj.push(edge[0]);
    }

    let result = {isolated: [], cycles: [], filaments: []};
    let cycle_edges = [];

    while (vertices.length > 0) {
        let v = vertices[0];
        if (v.adj.length == 0) {
            result.isolated.push(v);
            remove_vertex(v, vertices);
        } else if (v.adj.length == 1) {
            extract_filament(v, undefined, vertices, result, cycle_edges, edges);
        } else {
            extract_primitive(v, vertices, result, cycle_edges, edges);
        }
    };

    return result;
};

function remove_filament(v0, v1, vertices, cycle_edges, edges) {
    if (v0.adj.length >= 3) {
        remove_edge(v0, v1, edges);
        v0 = v1;
        if (v0.adj.length == 1) v1 = v0.adj[0];
    }
    while (v0.adj.length == 1) {
        v1 = v0.adj[0];
        if (is_cycle_edge(v0, v1, cycle_edges)) {
            remove_vertex(v0, vertices);
            remove_edge(v0, v1, edges);
            v0 = v1;
        } else {
            break;
        }
    }
    if (v0.adj.length == 0) remove_vertex(v0, vertices);
};

function extract_filament(v0, v1, vertices, result, cycle_edges, edges) {
    if (is_cycle_edge(v0, v1, cycle_edges)) {
        remove_filament(v0, v1, vertices, cycle_edges, edges);
    } else {
        let filament = [];
        if (v0.adj.length >= 3) {
            filament.push(v0);
            remove_edge(v0, v1, edges);
            v0 = v1;
            if (v0.adj.length == 1) v1 = v0.adj[0];
        }
        while (v0.adj.length == 1) {
            filament.push(v0);
            v1 = v0.adj[0];
            remove_vertex(v0, vertices);
            remove_edge(v0, v1, edges);
            v0 = v1;
        }
        filament.push(v0);
        if (v0.adj.length == 0) remove_vertex(v0, vertices);
        result.filaments.push(filament);
    }
}

function extract_primitive(v, vertices, result, cycle_edges, edges) {
    let visited = [], sequence = [];
    sequence.push(v);
    let v1 = best_by_kind(undefined, v, 'cw'),
        v_prev = v,
        v_curr = v1,
        v_next,
        visited_idx = -1;
    while (v_curr && v_curr != v && visited_idx == -1) {
        sequence.push(v_curr);
        visited.push(v_curr);
        v_next = best_by_kind(v_prev, v_curr, 'ccw');
        v_prev = v_curr;
        v_curr = v_next;
        visited_idx = visited.indexOf(v_curr);
    }
    
    if (!v_curr) {
        extract_filament(v_prev, v_prev.adj[0], vertices, result, cycle_edges, edges);
    } else if (v_curr == v) {
        result.cycles.push(sequence);
        mark_cycle_edges(sequence, cycle_edges, edges);
        remove_edge(v, v1, edges);
        if (v.adj.length == 1) {
            remove_filament(v, v.adj[0], vertices, cycle_edges, edges);
        }
        if (v1.adj.length == 1) {
            remove_filament(v1, v1.adj[0], vertices, cycle_edges, edges);
        }
    } else {
        extract_primitive(visited[visited_idx + 1], vertices, result, cycle_edges, edges);
    }
};

function mark_cycle_edges(sequence, cycle_edges, edges) {
    sequence.forEach((v, i, s) => {
        cycle_edges.push([v, s[i + 1] || s[0]]);
    });
};

function is_cycle_edge(a, b, cycle_edges) {
    if (!b) return false;
    return cycle_edges.some(e => veql(a, e[0]) && veql(b, e[1]) || veql(a, e[1]) && veql(b, e[0]));
};

function remove_edge(a, b, edges) {
    remove_vertex(a, b.adj);
    remove_vertex(b, a.adj);
}

function remove_vertex(v, vertices) {
    let idx = vertices.findIndex(vi => veql(v, vi));
    if (idx != -1) {
        vertices.splice(idx, 1);
    }
}

function best_by_kind(v_prev, v_curr, kind) {
    let d_curr, adj = v_curr.adj.slice();
    if (v_prev) {
        d_curr = vsub(v_curr, v_prev);
        remove_vertex(v_prev, adj);
    } else {
        d_curr = [0,-1];
    }

    return adj.reduce( (v_so_far, v) => better_by_kind(v, v_so_far, v_curr, d_curr, kind), adj[0]);
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

var vsub = (a, b) => [a[0] - b[0], a[1] - b[1]];
var dot_perp = (a, b) => a[0] * b[1] - b[0] * a[1];
var veql = (a, b) => a[0] == b[0] && a[1] == b[1];

let edge_tag = (v0, v1, edges) => edges.find(e => (e[0] == v0 && e[1] == v1) || (e[0] == v1 && e[1] == v0)).tag;

let fmt = (seq, edges) => seq.reduce((res, p, i) => {
    if (i == 0) return res;
    let prev = seq[i-1];
    return res + edge_tag(prev, p, edges) + ' ';
}, '');
