var cytoscape=require('cytoscape');
var domready=require('domready');

domready(function(){
  var timer;
  function submitForm() {
    var nodes={};
    var edges={};
    var notes=$("#notes").val();
    var layout=$("#layout option:selected").text();
    var layout_time=$("#layout_time").val();
    var poster;
    clearTimeout(timer);
    
    notes.split("\n").forEach(function(line) {
      var matches;
      
      if(matches=line.match(/(\S+) reblogged this from (\S+)/)) {
        if(!nodes[matches[1]]) nodes[matches[1]]={id: matches[1], name: matches[1], score:1};
        else nodes[matches[1]].score+=5;
        if(!nodes[matches[2]]) nodes[matches[2]]={id: matches[2], name: matches[2], score:1};
        else nodes[matches[2]].score+=5;
        if(!edges[matches[1]+','+matches[2]]) edges[matches[1]+','+matches[2]]={source:matches[1],target:matches[2]};
      }

      if(matches=line.match(/(\S+) posted this/)) {
        poster=matches[1];
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

    var stylesheet_cy=cytoscape.stylesheet()
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
    
    var cy=cytoscape({
      container: document.getElementById('cy'),
      style: stylesheet_cy,
      elements: {
        "nodes": nodes_cy,
        "edges": edges_cy
      },
      ready: function(){
        var cy=this;
      }
    });
    var layout_cy=cy.makeLayout({
      name: layout,
      padding: 10,
      randomize: true,
      animate: true,
      infinite: true,
      repulsion: 1
    });

    layout_cy.run();

    $("#status").text("Optimizing layout");
    timer=setTimeout(function() {
      layout_cy.stop();
      $("#status").text("Done with layout");
    }, layout_time);


    console.log($("#color_by_bfs").val())

    if($("#color_by_bfs").val()=="on") {
      var max_depth=1;
      var bfs = cy.elements().bfs('#'+poster, function(i, depth){
        if(depth>max_depth) { max_depth=depth; }
      }, false);

      //use breadth first search to color nodes
      var bfs = cy.elements().bfs('#'+poster, function(i, depth){
        this.style('background-color', 'hsl('+depth*150/max_depth+',80%,55%)');
      }, false);
    }
  }
  document.querySelector("#myform").addEventListener("submit", function(e){
    e.preventDefault();
    submitForm();
  });
  submitForm();

});

