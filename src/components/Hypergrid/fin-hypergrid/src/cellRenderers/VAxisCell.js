    function paintPlain(gc, config) {

    var firstVisRowIndex = config.visibleRows[config.headerRowsCount].rowIndex,
        axis  = config._axisV,
        col = config.dataCell.x,
        row = config.dataCell.y,
        nextVisRow = row + 1 < axis._axis.length - 1 && config.visibleRows.find(function(visRow) { return visRow.rowIndex === config.gridCell.y + 1; });

    config.minWidth = 0 ;
    config.selectRect = {} ;

    var level = col ; // expander
    var value = axis._axis[row] ;
    var total = level + 1 > value.i.length || value.l == -1 ;

    if (value.l != -1 && total && axis.isCollapsed(value.i.length - 1, value.i[value.i.length - 1]))
        return;

 //   if (!total && nextVisRow && axis._axis[row + 1].l == value.l && axis._axis[row + 1].i[level] == value.i[level])
 //       return ; //надо нарисовть что-бы попали метки на selectRect, потом перересуется другой клеткой
    
    if (total && (level != axis._maxlevel || is_collapsed))
        return ;
    
    var x = config.bounds.x;
    var y = config.bounds.y;
    var width  = config.bounds.width;
    var height = config.bounds.height;
 
    if (total) {
        var up = axis._maxlevel - value.l - 1;
        for (var i = 0; i < up; ++i) {
            var w = config.model.grid.getColumnWidth(col - i - 1) + config.model.grid.properties.gridLinesVWidth ;
            x      -= w;
            width  += w;
        }
        col   -= up ;
    } else {
        --row ;
        while (row >= firstVisRowIndex && axis._axis[row].i[level] == value.i[level]) {
            var h = config.model.grid.getRowHeight(row, config.model) + config.model.grid.properties.gridLinesHWidth;
            y      -= h ;
            height += h ;
            --row ;
        }
        ++row ;
        value = axis._axis[row] ;
        if (axis.isCollapsed(level, value.i[level])) {
            for (var i = col + 1; i <= axis.currentWidth(); ++i) {
                width += config.model.grid.getColumnWidth(i) + config.model.grid.properties.gridLinesVWidth ;
            }
        }
    }

    var is_collapsed = axis.isCollapsed(level, value.i[level]) ;
    var leaf         = level == axis.width() - 1 ;
    var row_height   = config.model.grid.getRowHeight(row, config.model) ;
    
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
    if (config.gridLinesRowHeaderH && config.dataCell.y != config.model.rows - 1) {
        var zw = (config.dataCell.x == config.model._axisH.currentWidth() + 2  || config.gridLinesRowHeaderV == false) ? 0 : (config.gridLinesVWidth) ;
        gc.fillStyle = config.gridLinesHColor;
        gc.fillRect(x, y + height, width + zw, config.gridLinesHWidth);
    }    
    if (config.gridLinesRowHeaderV && config.dataCell.x != config.model._axisH.currentWidth() + 2) {
        gc.fillStyle = config.gridLinesVColor;
        gc.fillRect(x + width, y, config.gridLinesHWidth, height);
    }
   
    x += config.cellPadding ;
    
    var xOffset = x + nextPx ; // 1 - следующий пикскль
    var yOffset = y + height / 2;
       
    // **********************************************************  expand/collaps symbol
    var symbol_value = String.fromCodePoint(is_collapsed ? 0xf0142 : 0xf0140) ;
//    var symbol_value = String.fromCodePoint(is_collapsed ? 0xf0419 : 0xf0377) ;
//    var symbol_value = String.fromCodePoint(is_collapsed ? 0xf0704 : 0xf06f2) ;

    gc.fillStyle    = fgColor;
    gc.textBaseline = 'alphabetic';
    gc.font         = 'normal normal XXpx Material Design Icons'.replace('XXpx', dim_config.fontSize + 7 + 'px') ;

    var metrics     = { string: symbol_value, m: gc.measureText(symbol_value) } ;

    if (!leaf && !total && axis.isAllowCollapse) {
      const pos = xOffset ;
      gc.mlFillText(symbol_value, pos, y, metrics.m.width, row_height, 'centerFirst', 'left', metrics.m.actualBoundingBoxAscent);
      config.selectRect['expand'] = { x1: pos, x2: pos + metrics.m.width } ;
      config.selectRect.value = { l: level, i: value.i[level] } ;//value ;
    }
    // **********************************************************  expand/collaps symbol

    var textOffset = xOffset + metrics.m.width ;

    gc.fillStyle    = fgColor;
    gc.textBaseline = "alphabetic";
    gc.font         = font;

    var textWidth   = config.bounds.x + width - (textOffset + config.cellPadding) ;
    var metrics     = { string: text, m: gc.measureText(text) } ;//gc.getTextWidthTruncated(value, textWidth, true);

    const bb = gc.mlFillText(metrics.string ? metrics.string : value, textOffset, y, textWidth, row_height, 'centerFirst', dim_config.textAlign);

    config.minWidth = textOffset - config.bounds.x + metrics.m.width + config.cellPadding + config.cellPadding + 1 ;
    config.minWidth = Math.max(config.minWidth, config.minimumColumnWidthAxis || 0) ;
        
    gc.restore();
}

var VAxisCell = async function paint(gc, config) {
    if (!config._axisV.isTree) {
        paintPlain(gc, config) ;
        return ;
    }
    
    config.selectRect = {} ;

    var x = config.bounds.x;
    var y = config.bounds.y;
    var width  = config.bounds.width;
    var height = config.bounds.height;
    
    var g = config._axisV._axis[config.dataCell.y];
    var is_collapsed = config._axisV.isCollapsed(g.l, g.i);
    
    var dim_num   = config._axisV.dim_number(Math.max(0, g.l)) ;
    var val_ndx   = config._axisV.permutation.weight(g) ;

    var dim_config = (config.dims[dim_num] || config.defaultDim).p ;

    var value     = g.l == -1 ? "Total" : (config._axisV.permutation.dimension_value(g) || '');
    var leaf      = g.isLeaf ;
    var depth     = g.l + 1 ;

    var bgColor = dim_config.background;
    var fgColor = dim_config.color;
    var font    = dim_config.font.replace('XXpx', dim_config.fontSize + 'px') ;

    gc.save();
    gc.fillStyle = bgColor;
    gc.fillRect(x, y, width, height);

    var lineNodeSpace = 12;
    var nodeRadius = 3;

    var nextPx = 1 ;
    var xOffset = x + config.cellPadding + nextPx + depth * lineNodeSpace ; // 1 - следующий пикскль
    var yOffset = y + height / 2;

    // **********************************************************  expand/collaps symbol
    gc.fillStyle    = fgColor;

    const z = (Math.min(height - config.cellPadding - config.cellPadding, dim_config.fontSize)) / 20 ;
    var metrics = { m: { width: z * 20 }} ;

    if (!leaf && config._axisV.isAllowCollapse) {
      const pos = xOffset ;

      const m   = document.createElementNS("http://www.w3.org/2000/svg", "svg").createSVGMatrix()
      const p   = new Path2D()
      const svg = new Path2D(is_collapsed ? config.CollapseIcon : config.ExpandIcon );
      const t   = m.translate(pos, y + (height - 20 * z) / 2).scale(z) ;
      p.addPath(svg, t) ;
      gc.fill(p);

      config.selectRect['expand'] = { x1: pos, x2: pos + metrics.m.width } ;
      config.selectRect.value = g ;
    }

    var textOffset = xOffset + metrics.m.width + metrics.m.width / 3 ;
    // **********************************************************  expand/collaps symbol
    const model = config.grid.behavior.dataModel ;
    const image = model.images?.[dim_num]?.[val_ndx] ;
    if (image) {
        if (image !== true) {
            const iconX = textOffset ;
            gc.drawImage(image, iconX, y + config.cellPadding) ;
        }
    } else {
       model.getImage(dim_num, val_ndx) ;
    }
    textOffset += 28 + config.cellPadding ;
    // **********************************************************  expand/collaps symbol

    gc.fillStyle    = fgColor;
    gc.textBaseline = "alphabetic";
    gc.font         = font;
    gc.cache.font   = font ;

    var textWidth   = config.bounds.x + width - (textOffset + config.cellPadding) ;
    var metrics     = { string: value, m: gc.measureText(value) } ;//gc.getTextWidthTruncated(value, textWidth, true);

    gc.mlFillText(metrics.string ? metrics.string : value, textOffset, y, textWidth, height, 'center', dim_config.textAlign);

    config.minWidth = textOffset - config.bounds.x + metrics.m.width + config.cellPadding + config.cellPadding + 1 ;
    config.minWidth = Math.max(config.minWidth, config.minimumColumnWidthAxis || 0) ;

    if (config.gridLinesRowHeaderH && config.dataCell.y != config.model.rows - 1) {
        var zw = (config.dataCell.x == config.model._axisH.currentWidth() + 2  || config.gridLinesRowHeaderV == false) ? 0 : (config.gridLinesVWidth) ;
        gc.fillStyle = config.gridLinesHColor;
        gc.fillRect(x, y + height, width + zw, config.gridLinesHWidth);
    }    
    gc.restore();
    }


module.exports = VAxisCell;
