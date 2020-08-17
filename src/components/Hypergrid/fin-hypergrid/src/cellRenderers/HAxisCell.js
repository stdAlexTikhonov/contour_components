'use strict';

var CellRenderer = require('./CellRenderer');

var HAxisCell = CellRenderer.extend('HAxisCell', {

  paintHeaderFacts: function(gc, config) {
    const z   = config.fixedColumnCount ;
    const col = config.dataCell.x - z ;
    
    var rect = config.bounds;
    var value = 'Fact';
    var dim_config = (config.facts[0] || config.defaultFact).p;

    var bgColor = dim_config.background;
    var fgColor = dim_config.color;
    var font = dim_config.font.replace('XXpx', dim_config.fontSize + 'px');

    value = value || '\n';

    gc.fillStyle = bgColor;
    gc.fillRect(rect.x, rect.y, rect.width, rect.height);

    var nextPx = 1;
    var textOffset = rect.x + config.cellPadding + nextPx;

    gc.fillStyle = fgColor;
    gc.textBaseline = "alphabetic";
    gc.font = font;

    var textWidth = rect.x + rect.width - (textOffset + config.cellPadding);
    var metrics = { string: value, m: gc.measureText(value) }; //gc.getTextWidthTruncated(value, textWidth, true);
    gc.mlFillText(metrics.string ? metrics.string : value, textOffset, rect.y, textWidth, rect.height, 'center', dim_config.textAlign);
    config.minWidth = textOffset - rect.x + metrics.m.width + config.cellPadding + config.cellPadding + 1;
 },
    
  paintHeaderGroups: function(gc, config) {
    const z  = config.fixedColumnCount ;

    var row  = config.dataCell.y ;
    if (config.dataCell.x < z || row == 0) { // место для заголовков измерений на горизонтальной оси
        config.minWidth = 0 ;
        return;
    }

    const model          = config.grid.behavior.subgrids.lookup.header ;
    const visibleColumns = config.grid.renderer.visibleColumns ;
    const axis           = config.grid.behavior.dataModel._axisH ;
    const grid           = config.grid ;

    if (row == model.getRowCount() - 1) {
      this.paintHeaderFacts(gc, config) ;
      return;
    }

    var firstVisColIndex = visibleColumns[z].columnIndex - z,
        col = config.dataCell.x - z,
        nextVisCol = visibleColumns.find(function(visCol) { return visCol.columnIndex === config.gridCell.x + 1; });

    config.minWidth   = 0 ;
    config.selectRect = {} ;

    var level = row - 1 ; // expander
    var value = axis._axis[col] ;
    var total = level + 1 > value.i.length || value.l == -1 ;

    if (value.l != -1 && total && axis.isCollapsed(value.i.length - 1, value.i[value.i.length - 1]))
        return;

    if (!total && nextVisCol && axis._axis[col + 1].l == value.l && axis._axis[col + 1].i[level] == value.i[level])
        return ;
    
    if (total && (level != axis._maxlevel || is_collapsed))
        return ;
    
    var x = config.bounds.x;
    var y = config.bounds.y;
    var width  = config.bounds.width;
    var height = config.bounds.height;
 
    if (total) {
        var up = axis._maxlevel - value.l - 1;
        for (var i = 0; i < up; ++i) {
            var h = grid.getRowHeight(row - i - 1, model) + grid.properties.gridLinesHWidth ;
            y      -= h;
            height += h;
        }
        row   -= up ;
    } else {
        --col ;
        while (col >= firstVisColIndex && axis._axis[col].i[level] == value.i[level]) {
            var w = grid.getColumnWidth(col + z) + grid.properties.gridLinesVWidth;
            x     -= w ;
            width += w ;
            --col ;
        }
        ++col ;
        value = axis._axis[col] ;
        if (axis.isCollapsed(level, value.i[level])) {
            for (var i = level + 1; i <= axis.currentWidth(); ++i) {
                height += grid.getRowHeight(row + i, model) + grid.properties.gridLinesHWidth ;
            }
        }
    }

    var is_collapsed = axis.isCollapsed(level, value.i[level]) ;
    var leaf         = level == axis.width() - 1 ;
    var row_height   = grid.getRowHeight(row, model) ;
    
    var nextPx = 1 ;
   
    var dim_config = (config.dims[axis.dim_number(level)] || config.defaultDim).p ;

    var text = total ? 'Total' : axis.permutation.dimension_value({l: level, i: value.i[level]}) ;
    if (text.length == 0)
        text = '\n' ;

    var bgColor = dim_config.background;
    var fgColor = dim_config.color;
    var font    = dim_config.font.replace('XXpx', dim_config.fontSize + 'px') ;

    gc.save();
    gc.fillStyle = bgColor;
    gc.fillRect(x, y, width, height);
    
    if (config.gridLinesColumnHeaderH && config.dataCell.y != model.rows - 1) {
        var zw = (col == model.cols - 1  || config.gridLinesColumnHeaderV == false) ? 0 : (config.gridLinesVWidth) ;
        gc.fillStyle = config.gridLinesHColor;
        gc.fillRect(x, y + height, width + zw, config.gridLinesHWidth);
    }
    if (config.gridLinesColumnHeaderV && col != model.cols - 1 ) {
        gc.fillStyle = config.gridLinesVColor;
        gc.fillRect(x + width, y, config.gridLinesVWidth, height);
    }
    
    x += config.cellPadding ;
    
    var xOffset = x + nextPx ; // 1 - следующий пикскль
    var yOffset = y + height / 2;
       
    // **********************************************************  expand/collaps symbol
    gc.fillStyle    = fgColor;

    const k = (Math.min(row_height - config.cellPadding - config.cellPadding, dim_config.fontSize)) / 20 ;
    var metrics = { m: { width: k * 20 }} ;

    if (!leaf && !total && axis.isAllowCollapse) {
      const pos = xOffset ;

      const m   = document.createElementNS("http://www.w3.org/2000/svg", "svg").createSVGMatrix()
      const p   = new Path2D()
      const svg = new Path2D(is_collapsed ? config.CollapseIcon : config.ExpandIcon );
      const t   = m.translate(pos, y + (row_height - 20 * k) / 2).scale(k) ;
      p.addPath(svg, t) ;
      gc.fill(p);

      config.selectRect['expand'] = { x1: pos, x2: pos + metrics.m.width } ;
      config.selectRect.value = value ;
    }
    var textOffset = xOffset + metrics.m.width + metrics.m.width / 3 ;
    // **********************************************************  expand/collaps symbol

    gc.fillStyle    = fgColor;
    gc.textBaseline = "alphabetic";
    gc.font         = font;

    var textWidth   = config.bounds.x + width - (textOffset + config.cellPadding) ;
    var metrics     = { string: text, m: gc.measureText(text) } ;//gc.getTextWidthTruncated(value, textWidth, true);

    gc.mlFillText(metrics.string ? metrics.string : value, textOffset, y, textWidth, row_height, 'centerFirst', dim_config.textAlign);

    config.minWidth = textOffset - config.bounds.x + metrics.m.width + config.cellPadding + config.cellPadding + 1 ;
    
    gc.restore();
  },

  paint: function(gc, config) {
    this.paintHeaderGroups(gc, config) ;
  }
});

module.exports = HAxisCell;
