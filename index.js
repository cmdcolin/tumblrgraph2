var cytoscape=require('cytoscape');
var domready=require('domready');
var _=require('underscore');
domready(function(){
  var timer;
  var cy;
  var original_poster;
  function submitForm() {
    // input nodes/edges for reblogs and OP
    var nodes={};
    var edges={};

    // user form
    var notes=$("#notes").val();
    var layout=$("#layout option:selected").text();
    var layout_time=$("#layout_time").val();

    // clear the timer for stopping animation
    clearTimeout(timer);
   

    // process textarea from form
    notes.split("\n").forEach(function(line) {
      var matches;
     
      // get reblogs
      if(matches=line.match(/(\S+) reblogged this from (\S+)/)) {
        if(!nodes[matches[1]]) nodes[matches[1]]={id: matches[1], name: matches[1], score:1};
        else nodes[matches[1]].score+=5;
        if(!nodes[matches[2]]) nodes[matches[2]]={id: matches[2], name: matches[2], score:1};
        else nodes[matches[2]].score+=5;
        if(!edges[matches[1]+','+matches[2]]) edges[matches[1]+','+matches[2]]={source:matches[1],target:matches[2]};
      }

      // get original poster
      if(matches=line.match(/(\S+) posted this/)) {
        original_poster=matches[1];
      }
    });

    var nodes_cy=_.map(nodes, function(node) { return {"data":node}; });
    var edges_cy=_.map(edges,function(edge) { return {"data":edge}; });


    // set boring stylesheet
    var stylesheet_cy=cytoscape.stylesheet()
      .selector('node')
        .style({
          'content': 'data(name)',
          'text-valign': 'center',
          'text-outline-width': 2,
          'text-outline-color': '#000',
          'color': '#fff'
        })
      .selector('edge')
        .css({
          'target-arrow-shape': 'triangle'
        });
   
    // create cytoscape instance
    cy=cytoscape({
      container: document.getElementById('cy'),
      style: stylesheet_cy,
      elements: {
        "nodes": nodes_cy,
        "edges": edges_cy
      }
    });

    //manually crate and stop layout after timeout
    var layout_cy=cy.makeLayout({
      name: layout,
      padding: 10,
      randomize: true,
      animate: true,
      infinite: true,
      repulsion: 1
    });

    layout_cy.run();


    // update status
    var count = 0;
    $("#status").text("Optimizing layout ...");
    $("#status").css("background-color","hsl(20,80%,70%)");
    timer=setTimeout(function() {
      layout_cy.stop();
      $("#status").css("background-color","hsl(120,80%,70%)");
      $("#status").text("Done with layout");
    }, layout_time);



    // color by distance from original poster using BFS
    if($("#color_by_bfs").prop('checked')) {
      var max_depth=1;
      var bfs = cy.elements().bfs('#'+original_poster, function(i, depth){
        if(depth>max_depth) { max_depth=depth; }
      }, false);

      //use breadth first search to color nodes
      var bfs = cy.elements().bfs('#'+original_poster, function(i, depth){
        this.style('background-color', 'hsl('+depth*150/max_depth+',80%,55%)');
      }, false);
    }
  }


  // resubmit form
  $("#myform").submit(function(e){
    submitForm();
    return false;
  });


  $("#save_button").on('click', function(e) {
    window.open(cy.png({scale:3}));
  });

  $("#animate_graph").on('click', function(e) {
    var animate_speed=$("#animate_speed").val();
    var encoder = new Whammy.Video(15); 
    var collection = cy.elements("node");
    collection.forEach(function(elt) {
      elt.style('visibility','hidden');
    });

    var arr=[];
    var bfs = cy.elements().bfs('#'+original_poster, function(i, depth){
      arr.push(this);
    }, false);

    function addNode(g,i) {
      if(i<g.length) {
        setTimeout(function() {
          g[i].style('visibility','visible');
          encoder.add($("[data-id=layer2-node]")[0]);
          addNode(g,i+1);
        }, animate_speed);
      }
      else {
        var output=encoder.compile();
        var url = window.URL.createObjectURL(output);
        window.open(url);
      }
    }
    addNode(arr,0);
  });


  submitForm();
});



