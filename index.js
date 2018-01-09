var cytoscape = require('cytoscape');
var _ = require('underscore');
var cyqtip = require('cytoscape-qtip');
var weaver = require('weaverjs');
var cose_bilkent = require('cytoscape-cose-bilkent');
var dagre = require('cytoscape-dagre');
var spread = require('cytoscape-spread');
var panzoom = require('cytoscape-panzoom');
var euler = require('cytoscape-euler');
var klay = require('cytoscape-klay');
var cyforcelayout = require('cytoscape-ngraph.forcelayout');
var cola = require('cytoscape-cola')

function downloadURI(uri, name) {
  var link = document.createElement("a");
  link.download = name;
  link.href = uri;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
$(() => {
    var cy;
    var originalPoster;
    cytoscape.use(cola);
    cytoscape.use(cose_bilkent)
    cytoscape.use(dagre);
    cytoscape.use(klay);
    cytoscape.use(euler);

    spread(cytoscape, weaver);
    cyforcelayout(cytoscape);
    cyqtip(cytoscape);
    panzoom(cytoscape);

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

        var nodesCy = _.map(nodes, node => ({ data: node }));
        var edgesCy = _.map(edges, edge => ({ data: edge }));

        // Create cytoscape instance
        cy = cytoscape({
            container: $('#cy'),
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
        var defaults = {
            zoomFactor: 0.05,
            zoomDelay: 45,
            minZoom: 0.1,
            maxZoom: 10,
            fitPadding: 50,
            panSpeed: 10,
            panDistance: 10,
            panDragAreaSize: 75,
            panMinPercentSpeed: 0.25,
            panInactiveArea: 8,
            panIndicatorMinOpacity: 0.5,
            zoomOnly: false,
            fitSelector: undefined,
            animateOnFit: () => false,
            fitAnimationDuration: 1000,
            sliderHandleIcon: 'fa fa-minus',
            zoomInIcon: 'fa fa-plus',
            zoomOutIcon: 'fa fa-minus',
            resetIcon: 'fa fa-expand',
        };

        cy.panzoom(defaults);

        // Color by distance from original poster using BFS
        if ($('#color_by_bfs').prop('checked')) {
            var maxDepth = 1;
            cy.elements().bfs(`#${originalPoster}`, (function (i, depth) {
                if (depth > maxDepth) { maxDepth = depth; }
            }), false);

            // Use breadth first search to color nodes
            cy.elements().bfs({
                roots: `#${originalPoster}`, 
                visit: function (v, e, y, i, depth) {
                    v.style('background-color', `hsl(${depth * 150 / maxDepth},80%,55%)`);
                },
                directed: false
            });
        }
    }

    // Resubmit form
    $('#myform').submit(() => {
        submitForm();
        return false;
    });

    $('#save_button').on('click', function() {
        downloadURI(cy.png({scale: 3}));
    });

    $('#animate_graph').on('click', () => {
        var animateSpeed = $('#animate_speed').val();
        var encoder = new Whammy.Video(1000 / animateSpeed);
        var collection = cy.elements('node');
        collection.forEach((elt) => {
            elt.style('visibility', 'hidden');
        });

        var arr = [];
        cy.elements().bfs(`#${originalPoster}`, function () {
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
                downloadURI(url);

            }
        }
        addNode(arr, 0);
    });


    submitForm();
});

