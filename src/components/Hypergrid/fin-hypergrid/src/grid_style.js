const base_grid_properties = {
    useBitBlit: true,
    cellSelection: true,
    columnSelection: false,

    columnClip: false, // paint grid in horizontal axis
    treeHeaderBackgroundSelectionColor: "rgba(0, 0, 0, 0)", // same as default hypergrid backgroundSelectionColor
    columnsReorderable: true,
    enableContinuousRepaint: false,
    feedbackCount: 1000000,
    fixedColumnCount: 0,
    fixedRowCount: 0,
    fixedLinesHWidth: 1,
    fixedLinesVWidth: 1,
    gridLinesH: false,
    gridLinesV: true, // except: due to groupedHeaderPlugin's `clipRuleLines: true` option, only header row displays these lines
    gridLinesUserDataArea: false, // restricts vertical rule line rendering to header row only

    cellPadding: 3,
    iconPadding: 5,
    defaultRowHeight: 28, // 18 + 5 + 5 + 6

    halign: "left",
    headerTextWrapping: false,

    hoverColumnHighlight: {
        enabled: true,
//        backgroundColor: "#555"
    },
    hoverRowHighlight: {
        enabled: true,
//        backgroundColor: "#555"
    },
    hoverCellHighlight: {
        enabled: true,
//        backgroundColor: "#333"
    },

    noDataMessage: "",
    minimumColumnWidth: 50,

    multipleSelections: true,

    renderFalsy: false,
    rowResize: true,
    scrollbarHoverOff: "visible",
    rowHeaderCheckboxes: false,
    rowHeaderNumbers: false,
    
    selectionRegionOutlineWidth: 1,
    selectionRegionOverlayColor: "rgba(0, 118, 211, 0.02)",
    selectionRegionOutlineColor: "rgb(0, 118, 211)",
    
    showFilterRow: true,
    showHeaderRow: true,
    showTreeColumn: false,
    showRowNumbers: false,
    showCheckboxes: false,
    singleRowSelectionMode: false,
    //    navKeyMap: {},
    sortColumns: [],
    sortOnDoubleClick: false,
    vScrollbarClassPrefix: "",
    voffset: 0,

    columnAutosizing: true,
    repaintIntervalRate: 0,
    repaintImmediately: true ,
    useBitBlit: true
};

const light_theme_overrides = {
    renderer:             'GridCell',
    columnHeaderRenderer: 'HAxisCell',

    font:                    'normal 300 XXpx Roboto',
    fontSize:                14,
    backgroundColor:   "#fff",
    color:             "#333",

    gridLinesColumnHeader: false,    
    gridLinesRowHeader:    false,
    gridLinesUserDataArea: true,

    gridLinesH: true,
    gridLinesV: true,
    gridLinesVWidth: 1,
    gridLinesHWidth: 1,

    gridLinesColumnHeaderH: true,
    gridLinesColumnHeaderV: true,
    gridLinesRowHeaderH: true,
    gridLinesRowHeaderV: true,

    gridLinesVColor: '#e4e4e4',
    gridLinesHColor: '#e4e4e4',//#e4e4e4

    treeHeaderBackgroundColor: "rgba(0,0,0,0)",
    backgroundColor: 'rgba(0,0,0,0)',    
    fixedLinesHWidth: 1,
    fixedLinesVWidth: 1,
    fixedLinesHEdge: undefined,
    fixedLinesVEdge: undefined,
    fixedLinesHColor: 'rgb(164,164,164)',
    fixedLinesVColor: 'rgb(164,164,164)',
    chartWidth: 50,
    
    boxSizing: 'content-box',
    
    defaultDim : { p:{sh: true, background: '#fbfbfb', color: '#333', font: 'normal 400 XXpx Roboto', fontSize: 13, textAlign: "left"} },
    defaultFact: { p:{background: '#eee', color: '#333', font: 'normal 400 XXpx Roboto', fontSize: 13, textAlign: "center"} },
    dims:  [],
    facts: [],
};

    function default_grid_properties() {
      const properties = Object.assign({}, base_grid_properties, light_theme_overrides);
      return properties;
    }
    const grid_properties = default_grid_properties();

module.exports.grid_properties = grid_properties ;
