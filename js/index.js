var cytoscape=require('cytoscape');
var data=require('./data');
var tools=require('./accessories');
var domready=require('domready');


var seinfeld3={
    nodes: tools.union_nodes(data.seinfeld,data.seinfeld2),
    edges: tools.union_edges(data.seinfeld,data.seinfeld2)
};

var missing_nodes=tools.difference_nodes(data.seinfeld,data.seinfeld2);
var missing_edges=tools.difference_edges(data.seinfeld,data.seinfeld2);

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


cytoscape({
  container: document.getElementById('cy'),
  style: cytoscape_style,
  elements: seinfeld3,
  //elements: data.seinfeld_orig,
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


cytoscape({
  container: document.getElementById('cy2'),
  style: cytoscape_style,
  elements: seinfeld3,
  //elements: data.seinfeld_orig,<-- uncomment to use more basic graph
  layout: {
    name: 'springy',
    padding: 10,
    randomize: false
  },
  
  ready: function() {
    var cy=this;
    cy.panningEnabled(false);
    cy.zoomingEnabled(false);
    //iteratively remvoe elements
    var i=0;
    var recall=function() {
        if(i<missing_nodes.length) {
            cy.remove('#'+missing_nodes[i].data.id);
            setTimeout(recall,200);
            i++;
        }
    }
    setTimeout(recall,2000);
  }
});

}); // on dom ready

