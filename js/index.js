var cytoscape=require('cytoscape');
var domready=require('domready');

domready(function(){
  function submitForm() {
    var nodes={};
    var edges={};
    var notes=document.querySelector("#notes").value;
    var layout=document.querySelector("#layout").value;
    
    notes.split("\n").forEach(function(line) {
      var matches;
      if(matches=line.match(/(\S+) reblogged this from (\S+)/)) {
        if(!nodes[matches[1]]) nodes[matches[1]]={id: matches[1], name: matches[1], score:1};
        else nodes[matches[1]].score+=5;
        if(!nodes[matches[2]]) nodes[matches[2]]={id: matches[2], name: matches[2], score:1};
        else nodes[matches[2]].score+=5;
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

    cytoscape({
      container: document.getElementById('cy'),
      style: 
        cytoscape.stylesheet()
          .selector('node')
            .style({
              'content': 'data(name)',
              'text-valign': 'center',
              'background-color': function(elt) { return 'hsl('+elt.data('score')+',80%,55%)'; },
              'text-outline-width': 2,
              'text-outline-color': '#000',
              'color': '#fff'
            })
          .selector('edge')
            .css({
              'target-arrow-shape': 'triangle'
            })
          ,
      elements: {
        "nodes": nodes_cy,
        "edges": edges_cy
      },
      layout: {
         name: layout,
         padding: 10,
         randomize: true,
         maxSimulationTime: 10000,
         animate: true
      },
      ready: function(){
        var cy=this;
      }
    });
  }
  document.querySelector("#myform").addEventListener("submit", function(e){
    e.preventDefault();
    submitForm();
  });
  submitForm();

});

