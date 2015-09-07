export function extract_primitives(vertices, edges) {
    vertices.sort( (a,b) => a[0] != b[0] ? a[0] - b[0] : b[1] - a[1] );

    let result = {isolated: [], cycles: [], filaments: []};

    while (vertices.length > 0) {
        let v = vertices[0],
            adjacent = adjacent_to(v, edges);
        if (adjacent.length == 0) {
            console.log('isolated vertex ' + JSON.stringify(v));
            result.isolated.push(v);
            remove_vertex(v, vertices);
        } else if (adjacent.length == 1) {
            console.log('filament starting at ' + JSON.stringify(v));
            extract_filament(v, undefined, vertices, edges, result);
        } else {
            console.log('primitive starting at ' + JSON.stringify(v));
            extract_primitive(v, vertices, edges, result);
        }
    };

    return result;
};

function extract_filament(v0, v1, vertices, edges, result) {
    if (is_cycle_edge(v0, v1, edges)) {
        let adjacent = adjacent_to(v0, edges);
        if (adjacent.length >= 3) {
            remove_edge(v0, v1, edges);
            v0 = v1;
            let adjacent = adjacent_to(v0, edges);
            if (adjacent.length == 1) v1 = adjacent[0];
        }
        adjacent = adjacent_to(v0, edges);
        while (adjacent.length == 1) {
            v1 = adjacent[0];
            if (is_cycle_edge(v0, v1, edges)) {
                remove_vertex(v0, vertices);
                remove_edge(v0, v1, edges);
                v0 = v1;
                adjacent = adjacent_to(v0, edges);
            } else {
                break;
            }
        }
        if (adjacent.length == 0) remove_vertex(v0, vertices);
    } else {
        let filament = [],
            adjacent = adjacent_to(v0, edges);
        if (adjacent.length >= 3) {
            filament.push(v0);
            remove_edge(v0, v1, edges);
            v0 = v1;
            let adjacent = adjacent_to(v0, edges);
            if (adjacent.length == 1) v1 = adjacent[0];
        }
        adjacent = adjacent_to(v0, edges);
        while (adjacent.length == 1) {
            filament.push(v0);
            v1 = adjacent[0];
            remove_vertex(v0, vertices);
            remove_edge(v0, v1, edges);
            v0 = v1;
            adjacent = adjacent_to(v0, edges);
        }
        filament.push(v0);
        if (adjacent.length == 0) remove_vertex(v0, vertices);
        result.filaments.push(filament);
        console.log('filament extracted: ' + JSON.stringify(filament));
    }
}

export function extract_primitive(v, vertices, edges, result) {
    let visited = [], sequence = [], adjacent = adjacent_to(v, edges);
    sequence.push(v);
    let v1 = cw_most(undefined, v, adjacent),
        v_prev = v,
        v_curr = v1,
        v_next;
    while (v_curr && v_curr != v && v_curr && visited.indexOf(v_curr) == -1) {
        sequence.push(v_curr);
        visited.push(v_curr);
        adjacent = adjacent_to(v_curr, edges);
        v_next = ccw_most(v_prev, v_curr, adjacent);
        console.log('ccw_most: ' + JSON.stringify([v_prev, v_curr, v_next]));
        v_prev = v_curr;
        v_curr = v_next;
    }
    
    if (!v_curr) {
        extract_filament(v_prev, adjacent[0], vertices, edges, result);
    } else if (v_curr == v) {
        console.log('cycle found: ' + JSON.stringify(sequence));
        result.cycles.push(sequence);
        mark_cycle_edges(sequence, edges);
        remove_edge(v, v1, edges);
        adjacent = adjacent_to(v, edges);
        if (adjacent.length == 1) {
            extract_filament(v, adjacent[0], vertices, edges, result);
        }
        adjacent = adjacent_to(v1, edges);
        if (adjacent.length == 1) {
            extract_filament(v1, adjacent[0], vertices, edges, result);
        }
    } else {
        adjacent = adjacent_to(v, edges);
        while (adjacent.length == 2) {
            if (adjacent[0] != v1) {
                v1 = v;
                v = adjacent[0];
            } else {
                v1 = v;
                v = adjacent[1];
            }
            adjacent = adjacent_to(v, edges);
        }
        extract_filament(v, v1, vertices, edges, result);
    }
};

function mark_cycle_edges(sequence, edges) {
    sequence.forEach((v, i, s) => {
        find_edge(v, s[i + 1] || s[0], edges).is_cycle_edge = true;
    });
};

function is_cycle_edge(a, b, edges) {
    if (!b) return false;
    return find_edge(a,b,edges).is_cycle_edge;
};

function find_edge(a, b, edges) {
    return edges.find(e => veql(a, e[0]) && veql(b, e[1]) || veql(a, e[1]) && veql(b, e[0]));
};

function remove_edge(a, b, edges) {
    console.log('removing edge ' + JSON.stringify([a,b]));
    let idx = edges.findIndex(e => veql(a, e[0]) && veql(b, e[1]) || veql(a, e[1]) && veql(b, e[0]));
    if (idx != -1) edges.splice(idx, 1);
}

function remove_vertex(v, vertices) {
    console.log('removing vertex ' + JSON.stringify(v));
    let idx = vertices.findIndex(vi => veql(v, vi));
    if (idx != -1) vertices.splice(idx, 1);
}

function adjacent_to(v, edges) {
    let adjacent = [];
    for (let edge of edges) {
        if (veql(v, edge[0])) {
            adjacent.push(edge[1]);
        } else if (veql(v, edge[1])) {
            adjacent.push(edge[0]);
        }
    };
    return adjacent;
};

export function cw_most(v_prev, v_curr, adjacent) {
    return best_by_kind(v_prev, v_curr, adjacent, 'cw');
};

export function ccw_most(v_prev, v_curr, adjacent) {
    return best_by_kind(v_prev, v_curr, adjacent, 'ccw');
};

function best_by_kind(v_prev, v_curr, adjacent, kind) {
    let d_curr;
    if (v_prev) {
        d_curr = vsub(v_curr, v_prev);
        let idx = adjacent.findIndex(vi => veql(v_prev, vi));
        if (idx != -1) adjacent.splice(idx, 1);
        // can be done with remove_vertex(v_prev, adjacent);
    } else {
        d_curr = [0,-1];
    }

    return adjacent.reduce( (v_so_far, v) => better_by_kind(v, v_so_far, v_curr, d_curr, kind), 
                            adjacent[0]);
};

function better_by_kind(v, v_so_far, v_curr, d_curr, kind) {
    let d = vsub(v, v_curr),
        d_so_far = vsub(v_so_far, v_curr),
        is_convex = dot_perp(d_so_far, d_curr) >= 0,
        curr2v = dot_perp(d_curr, d),
        vsf2v = dot_perp(d_so_far, d),
        v_is_better;
    if (kind == 'cw') {
        v_is_better = (is_convex && (curr2v > 0 || vsf2v > 0)) || (!is_convex && curr2v > 0 && vsf2v > 0);
    } else {
        v_is_better = (!is_convex && (curr2v < 0 || vsf2v < 0)) || (is_convex && curr2v < 0 && vsf2v < 0);
    }
    return v_is_better ? v : v_so_far;
};

var vsub = (a, b) => [a[0] - b[0], a[1] - b[1]];

var dot_perp = (a, b) => a[0] * b[1] - b[0] * a[1];

var veql = (a, b) => a[0] == b[0] && a[1] == b[1];
