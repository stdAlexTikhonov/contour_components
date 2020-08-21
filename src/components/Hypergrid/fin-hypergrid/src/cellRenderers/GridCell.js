var CellRenderer = require('./CellRenderer');
var VAxisCell    = require('./VAxisCell');
var pSBC         = require('./pSBC');

var GridCell = CellRenderer.extend('GridCell', {
    paint: function(gc, config) {
        if (config.gridCell.x < config.fixedColumnCount) {
            VAxisCell(gc, config);;
            return;
        }

        var bounds = config.bounds,
            x = bounds.x,
            y = bounds.y,
            w = bounds.width,
            h = bounds.height;

        gc.fillStyle = config.backgroundColor;
        gc.fillRect(x, y, w, h);

        const vnull = !config.val || !config.val.num;

        const smallBarHeight  = 3;
        const smallBarPadding = 1;
        const p = config.cellPadding;
        const lH = config.gridLinesHWidth;
        const lV = config.gridLinesVWidth;
        let contentLeft  = 0;
        let contentRight = 0;

        if (config.val.chart != null && !vnull) {
            contentLeft = config.grid.properties.chartWidth + 8;
            var g = {
                left: x + p - config.grid.renderer.visibleColumns.gap.right,
                top:  y + p - config.grid.renderer.visibleRows.gap.bottom,
                height: h - p - p
            };
            if (config.val.chart.left != g.left || config.val.chart.top != g.top || config.val.chart.height != g.height) {
                Object.assign(config.val.chart, g);
                config.grid.chartOptionSet = false;
            }
        }

/*
        {   // Up/Down icon
            gc.font = 'normal normal XXpx Material Design Icons'.replace('XXpx', config.fontSize + 5 + 'px');
            //        gc.fillStyle = config.color;
            gc.fillStyle = '#F00';//'#4285f4';
            var symbol = String.fromCodePoint([0xF0045, 0xF072E, 0xF072F, 0xF0730, 0xF0047, 0xF0048, 0xF0049, 0xF09BF, 0xF06C0, 0xF0CDB, 0xF0CDC, 0xF004A, 0xF004B, 0xF0046, 0xF0DA1][(config.gridCell.y * 4 + config.gridCell.x) % 15]);
            var metrics = {
                string: symbol,
                m: gc.measureText(symbol)
            };
            gc.mlFillText(metrics.string, x + p + contentLeft, y + p - smallBarHeight, w - p - p - contentLeft, h - p - p, 'center', 'right');

            contentRight = metrics.m.width + p ;
        }
   */     
        if (!vnull && config.val.databar != null) {
            gc.fillStyle = '#ffc107';
            const z = 100 * config.val.databar;
            const minW = 3;
            gc.fillRect(x + p + contentLeft, y + p, (w - p - p - contentLeft - contentRight - minW) * z / 100 + minW, h + 1 - p - p - smallBarHeight - smallBarPadding);
        }

        if (!vnull && config.val.databar2 != null) {
            gc.fillStyle = pSBC(-0.2, config.backgroundColor);
            gc.fillRect(x + p + contentLeft, y + h + 1 - p - smallBarHeight, w - p - p - contentLeft - contentRight, smallBarHeight);

            gc.fillStyle = '#4ce8a6';
            const z = 100 * config.val.databar2;
            const minW = 3;
            gc.fillRect(x + p + contentLeft, y + h + 1 - p - smallBarHeight, (w - p - p - contentLeft - contentRight - minW) * z / 100 + minW, smallBarHeight);
        }
                
        gc.font = config.font.replace('XXpx', config.fontSize + 'px');
        gc.fillStyle = config.color;

        var textWidth = w - contentLeft - contentRight - p - p;
        var metrics = {
            string: config.value,
            m: gc.measureText(config.value)
        };

        gc.mlFillText(metrics.string, x + p + contentLeft, y + p - smallBarHeight, textWidth, h - p - p, 'center', config.halign);

        config.minWidth = p + contentLeft + metrics.m.width + contentRight + p + 1;
    }
});

module.exports = GridCell;
