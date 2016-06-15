var $ = require('jquery');
var cytoscape = require('cytoscape');
var _ = require('underscore');
var cycola = require('cytoscape-cola');
var cycose = require('cytoscape-cose-bilkent');
var cyarbor = require('cytoscape-arbor');
var cydagre = require('cytoscape-dagre');
var cyspringy = require('cytoscape-springy');
var cyspread = require('cytoscape-spread');
var cyngraph = require('cytoscape-ngraph.forcelayout');

window.$ = $;
window.jQuery = $;

// Layouts that have npm, others included via source
var dagre = require('dagre');
var springy = require('springy');

$(() => {
    var cy;
    var originalPoster;
    cycola(cytoscape, cola); // Register extension
    cydagre(cytoscape, dagre); // Register extension
    cyspringy(cytoscape, springy); // Register extension
    cyarbor(cytoscape, arbor); // Register extension
    cyspread(cytoscape); // Register extension
    cycose(cytoscape); // Register extension
    cyngraph(cytoscape);

    function submitForm() {
        // Input nodes/edges for reblogs and OP
        var nodes = {};
        var edges = {};

        // User form
        var notes = $('#notes').val();
        var layout = $('#layout option:selected').text().trim();

        // Process textarea from form
        notes.split('\n').forEach((line) => {
            var matches = line.match(/(\S+) reblogged this from (\S+)/);

            // Get reblogs
            if (matches) {
                if (!nodes[matches[1]]) {
                    nodes[matches[1]] = { id: matches[1], name: matches[1], score: 1 };
                } else {
                    nodes[matches[1]].score += 5;
                }
                if (!nodes[matches[2]]) {
                    nodes[matches[2]] = { id: matches[2], name: matches[2], score: 1 };
                } else {
                    nodes[matches[2]].score += 5;
                }
                if (!edges[`${matches[1]},${matches[2]}`]) {
                    edges[`${matches[1]},${matches[2]}`] = { source: matches[1], target: matches[2] };
                }
            }

            // Get original poster
            matches = line.match(/(\S+) posted this/);
            if (matches) {
                originalPoster = matches[1];
            }
        });

        var nodesCy = _.map(nodes, (node) => ({ data: node }));
        var edgesCy = _.map(edges, (edge) => ({ data: edge }));

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
                nodes: nodesCy,
                edges: edgesCy,
            },
            // This is an alternative that uses a bitmap during interaction
            textureOnViewport: true,

            // Interpolate on high density displays instead of increasing resolution
            pixelRatio: 1,

            // A motion blur effect that increases perceived performance for little or no cost
            motionBlur: true,
            layout: {
                name: layout,
                padding: 10,
                randomize: true,
                animate: true,
                repulsion: 1,
            },
        });

        // Color by distance from original poster using BFS
        if ($('#color_by_bfs').prop('checked')) {
            var maxDepth = 1;
            cy.elements().bfs(`#${originalPoster}`, (i, depth) => {
                if (depth > maxDepth) { maxDepth = depth; }
            }, false);

            // Use breadth first search to color nodes
            cy.elements().bfs(`#${originalPoster}`, (i, depth) => {
                this.style('background-color', `hsl(${depth * 150 / maxDepth},80%,55%)`);
            }, false);
        }
    }

    // Resubmit form
    $('#myform').submit(() => {
        submitForm();
        return false;
    });

    $('#save_button').on('click', () => {
        $('#output').append($('<a/>').attr({ href: cy.png({ scale: 3 }) }).append('Download picture'));
    });

    $('#animate_graph').on('click', () => {
        var animateSpeed = $('#animateSpeed').val();
        var encoder = new Whammy.Video(1000 / animateSpeed);
        var collection = cy.elements('node');
        collection.forEach((elt) => {
            elt.style('visibility', 'hidden');
        });

        var arr = [];
        cy.elements().bfs(`#${originalPoster}`, () => {
            arr.push(this);
        }, false);

        function addNode(g, i) {
            if (i < g.length) {
                setTimeout(() => {
                    g[i].style('visibility', 'visible');
                    encoder.add($('[data-id=layer2-node]')[0]);
                    addNode(g, i + 1);
                }, animateSpeed);
            } else {
                var output = encoder.compile();
                var url = window.URL.createObjectURL(output);
                $('#output').empty();
                $('#output').append($('<a/>').attr({ href: url, download: 'video.webm' }).append('Download video'));
            }
        }
        addNode(arr, 0);
    });


    submitForm();
});

