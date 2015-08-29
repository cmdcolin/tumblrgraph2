// custom union of based on enumerating a 'hash' node IDs
exports.union_nodes=function(a,b) {
    var u={};
    a.nodes.forEach(function(e) {
        u[e.data.id]=e;
    });
    b.nodes.forEach(function(f) {
        u[f.data.id]=f;
    });
    var c=[];
    for(i in u) {
        if(u.hasOwnProperty(i)) {
            c.push(u[i]);
        }
    }
    return c;
}

// custom union of based on enumerating a 'hash' edge IDs
exports.union_edges=function(a,b) {
    var u={};
    a.edges.forEach(function(e) {
        u[e.data.source+'->'+e.data.target]=e;
    });
    b.edges.forEach(function(f) {
        u[f.data.source+'->'+f.data.target]=f;
    });
    var c=[];
    for(i in u) {
        if(u.hasOwnProperty(i)) {
            c.push(u[i]);
        }
    }
    return c;
}




// custom difference of based on enumerating a 'hash' edge IDs
exports.difference_edges=function(a,b) {
    var u={};
    a.edges.forEach(function(e) {
        u[e.data.source+'->'+e.data.target]=e;
    });
    b.edges.forEach(function(f) {
        if(u[f.data.source+'->'+f.data.target]){
            u[f.data.source+'->'+f.data.target]=null;
        }
        else {
            u[f.data.source+'->'+f.data.target]=f;
        }
    });
    var c=[];
    for(i in u) {
        if(u.hasOwnProperty(i)) {
            if(u[i]) c.push(u[i]);
        }
    }
    return c;
}

// custom difference of based on enumerating a 'hash' edge IDs
exports.difference_nodes=function(a,b) {
    var u={};
    a.nodes.forEach(function(e) {
        u[e.data.id]=e;
    });
    b.nodes.forEach(function(f) {
        if(u[f.data.id]){
            u[f.data.id]=null;
        }
        else {
            u[f.data.id]=f;
        }
    });
    var c=[];
    for(i in u) {
        if(u.hasOwnProperty(i)) {
            if(u[i]) c.push(u[i]);
        }
    }
    return c;
}

