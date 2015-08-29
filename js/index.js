var cytoscape=require('cytoscape');
var data=require('./data');
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

}); // on dom ready

