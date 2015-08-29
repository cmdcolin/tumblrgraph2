var cytoscape=require('cytoscape');
var tools=require('./accessories');
var domready=require('domready');

domready(function(){ // on dom ready

    var cytoscape_style= cytoscape.stylesheet()
    .selector('node')
      .css({
        'content': 'data(name)',
        'text-valign': 'center',
        'color': 'white',
        'text-outline-width': 2,
        'text-outline-color': '#888'
      })
    .selector('edge')
      .css({
        'target-arrow-shape': 'triangle'
      })
    .selector(':selected')
      .css({
        'background-color': 'black',
        'line-color': 'black',
        'target-arrow-color': 'black',
        'source-arrow-color': 'black'
      })
    .selector('.faded')
      .css({
        'opacity': 0.25,
        'text-opacity': 0
      });


    var nodes={};
    var edges={};
    document.querySelector("#myform").addEventListener("submit", function(e){
        e.preventDefault();    //stop form from submitting
        var lines=document.querySelector("#notes").value.split("\n");
        lines.forEach(function(line) {
            var matches;
            if(matches=line.match(/(\S+) reblogged this from (\S+)/)) {
                if(!nodes[matches[1]]) nodes[matches[1]]={id: matches[1]};
                if(!nodes[matches[2]]) nodes[matches[2]]={id: matches[2]};
                if(!edges[matches[1]+','+matches[2]]) edges[matches[1]+','+matches[2]]={source:matches[1],target:matches[2]};
            }
        });

        var nodes_cy=[];
        var edges_cy=[];
        Object.keys(nodes).forEach(function(node) {
            nodes_cy.push({data:nodes[node]});
        });
        Object.keys(edges).forEach(function(edge) {
            edges_cy.push({data:edges[edge]});
        });
        console.log(nodes_cy);
        console.log(edges_cy);

        cytoscape({
          container: document.getElementById('cy'),
          style: cytoscape_style,
          elements: {
              "nodes": nodes_cy,
              "edges": edges_cy
          },
          layout: {
            name: 'springy',
            padding: 10,
            randomize:false 
          },
          ready: function(){
            var cy=this;
            cy.panningEnabled(false);
            cy.zoomingEnabled(false);
          }
        });
    });

//
}); // on dom ready

