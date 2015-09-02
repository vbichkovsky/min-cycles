export function extract_primitives(vertices, edges) {
    vertices.sort( (a,b) => a[0] != b[0] ? a[0] - b[0] : b[1] - a[1] );

    let result = {isolated: [], cycles: [], filaments: []};

    while (vertices.length > 0) {
        let v = vertices[0],
            adjacent = adjacent_to(v, edges);
        if (adjacent.length == 0) {
            result.isolated.push(v);
            remove_vertex(v, vertices);
        } else if (adjacent.length == 1) {
            extract_filament(v, undefined, vertices, edges, result);
        } else {
            extract_primitive(v, vertices, edges, result);
        }
    };

    return result;
};

function extract_primitive(v, vertices, edges, result) {
};

function extract_filament(v0, v1, vertices, edges, result) {
    if (is_cycle_edge(v0, v1)) {
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
            if (is_cycle_edge(v0, v1)) {
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
    }
}

function is_cycle_edge(a, b) {
    return false;
};

function remove_edge(a, b, edges) {
    let idx = edges.findIndex(e => veql(a, e[0]) && veql(b, e[1]) || veql(a, e[1]) && veql(b, e[0]));
    if (idx != -1) edges.splice(idx, 1);
}

function remove_vertex(v, vertices) {
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
    let d_curr = vsub(v_curr, v_prev);

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
