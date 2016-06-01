var when = require('when');
var $ = require('jquery');
var cytoscape = require('cytoscape');
var _ = require('underscore');
var cycola = require('cytoscape-cola');
var cycose = require('cytoscape-cose-bilkent');
var cyarbor = require('cytoscape-arbor');
var cydagre = require('cytoscape-dagre');
var cyspringy = require('cytoscape-springy');
var cyspread = require('cytoscape-spread');

window.$ = $;
window.jQuery = $;

// Layouts that have npm, others included via source
var dagre = require('dagre');
var springy = require('springy');

$(function() {
    var timer;
    var cy;
    var original_poster;
    cycola( cytoscape, cola ); // Register extension
    cydagre( cytoscape, dagre ); // Register extension
    cyspringy( cytoscape, springy ); // Register extension
    cyarbor( cytoscape, arbor ); // Register extension
    cyspread( cytoscape ); // Register extension
    cycose( cytoscape ); // Register extension


    function submitForm() {
        // Input nodes/edges for reblogs and OP
        var nodes = {};
        var edges = {};

        // User form
        var notes = $('#notes').val();
        var layout = $('#layout option:selected').text();

        // Process textarea from form
        notes.split('\n').forEach(function(line) {
            var matches = line.match(/(\S+) reblogged this from (\S+)/);

            // Get reblogs
            if(matches) {
                if(!nodes[matches[1]]) {
                    nodes[matches[1]] = {id: matches[1], name: matches[1], score: 1};
                } else {
                    nodes[matches[1]].score += 5;
                }
                if(!nodes[matches[2]]) {
                    nodes[matches[2]] = {id: matches[2], name: matches[2], score: 1};
                } else {
                    nodes[matches[2]].score += 5;
                }
                if(!edges[matches[1] + ',' + matches[2]]) {
                    edges[matches[1] + ',' + matches[2]] = {source: matches[1],target: matches[2]};
                }
            }

            // Get original poster
            matches = line.match(/(\S+) posted this/);
            if(matches) {
                original_poster = matches[1];
            }
        });

        var nodes_cy = _.map(nodes, function(node) { return {data: node}; });
        var edges_cy = _.map(edges,function(edge) { return {data: edge}; });


        // Create cytoscape instance
        cy = cytoscape({
            container: document.getElementById('cy'),
            style: cytoscape.stylesheet()
            .selector('node')
              .style({
                  content: 'data(name)',
                  'text-valign': 'center',
                  'text-outline-width': 2,
                  'text-outline-color': '#000',
                  color: '#fff',
              })
              .selector('edge')
                .css({
                    'target-arrow-shape': 'triangle',
                    'curve-style': 'haystack',
                }),
            elements: {
                nodes: nodes_cy,
                edges: edges_cy,
            },
            // This is an alternative that uses a bitmap during interaction
            textureOnViewport: true,

            // Interpolate on high density displays instead of increasing resolution
            pixelRatio: 1,

            // A motion blur effect that increases perceived performance for little or no cost
            motionBlur: true,
            layout:  {
                name: layout,
                padding: 10,
                randomize: true,
                animate: true,
                repulsion: 1,
            },
        });


        // Color by distance from original poster using BFS
        if($('#color_by_bfs').prop('checked')) {
            var max_depth = 1;
            cy.elements().bfs('#' + original_poster, function(i, depth) {
                if(depth > max_depth) { max_depth = depth; }
            }, false);

            // Use breadth first search to color nodes
            cy.elements().bfs('#' + original_poster, function(i, depth) {
                this.style('background-color', 'hsl(' + depth * 150 / max_depth + ',80%,55%)');
            }, false);
        }
    }


    // Resubmit form
    $('#myform').submit(function(e) {
        submitForm();
        return false;
    });


    $('#save_button').on('click', function(e) {
        $('#output').append($('<a/>').attr({href: cy.png({scale: 3})}).append('Download picture'));
    });

    $('#animate_graph').on('click', function(e) {
        var animate_speed = $('#animate_speed').val();
        var encoder = new Whammy.Video(1000 / animate_speed);
        var collection = cy.elements('node');
        collection.forEach(function(elt) {
            elt.style('visibility','hidden');
        });

        var arr = [];
        var bfs = cy.elements().bfs('#' + original_poster, function(i, depth) {
            arr.push(this);
        }, false);

        function addNode(g,i) {
            if(i < g.length) {
                setTimeout(function() {
                    g[i].style('visibility','visible');
                    encoder.add($('[data-id=layer2-node]')[0]);
                    addNode(g,i + 1);
                }, animate_speed);
            } else {
                var output = encoder.compile();
                var url = window.URL.createObjectURL(output);
                $('#output').empty();
                $('#output').append($('<a/>').attr({href: url,download: 'video.webm'}).append('Download video'));
            }
        }
        addNode(arr,0);
    });


    submitForm();
});



