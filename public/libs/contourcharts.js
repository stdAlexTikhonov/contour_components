var GLOBAL_MAP = {};

function contourD3Globe(div_name, opt, object) {
  var animated;
  if (object == null) {
    var object = {
      timer: null,
      click: false,
      selected: "",
      proj: null,
      w: 0,
      h: 0,
    };
    animated = true;
  } else animated = object.timer != null;

  clearInterval(object.timer);
  object.timer = null;

  var div_element = document.getElementById(div_name);
  var d3div = d3.select("#" + div_name);

  var height = div_element.offsetHeight;
  var width = div_element.offsetWidth;
  // если обновляется в невидимом окне (при изменение фильтров в другом табе)
  if (height === 0) height = object.h;
  if (width === 0) width = object.w;

  var proj = object.proj;
  if (proj == null || object.w != width || object.h != height) {
    proj = d3
      .geoOrthographic()
      .scale(Math.min(width, height) / 2.3)
      .translate([width / 2, height / 2])
      .clipAngle(90);
    object.proj = proj;
    object.w = width;
    object.h = height;
  }
  var path = d3.geoPath().projection(proj).pointRadius(1.5);
  var graticule = d3.geoGraticule();

  div_element.innerHTML = "";
  d3div.on("mousemove", mousemove).on("mouseup", mouseup).on("click", click);

  var tooltip = d3div
    .append("div")
    .attr("class", "tkc_tooltip")
    .attr(
      "style",
      "background: #eee; box-shadow: 0 0 5px #999999; color: #333; display: none; font-size: 12px; padding: 10px; position: absolute; text-align: left;"
    );
  tooltip
    .append("div")
    .attr("class", "tkc_label")
    .attr("style", "font: 18px sans-serif;");
  tooltip
    .append("div")
    .attr("class", "tkc_value")
    .attr("style", "font: 12px sans-serif;");

  var svg = d3div
    .append("svg")
    .attr("width", width)
    .attr("height", height)
    .on("mousedown", mousedown)
    .style("background", opt.ccBackground);
  /*
                svg.append("defs").append("path")
                    .datum({ type: "Sphere" })
                    .attr("id", "sphere")
                    .attr("style", "fill: #fff; stroke: #000; stroke-width: 3px;")
                    .attr("d", path);
                svg.append("use")
                    .attr("xlink:href", "#sphere");
        */
  var world = world_110m;
  var data = opt.data[0];

  var ndx = 0;
  var ndx_map = {};
  data.forEach(function (d) {
    ndx_map[d[0]] = ndx++;
  });

  data.sort(function (a, b) {
    return a[2] - b[2];
  });
  var map = {};
  var data_map = {};
  var name_map = {};

  var countries_map = {};
  world.objects.countries.geometries.forEach(function (d) {
    countries_map[d.id] = true;
  });

  ndx = 0;
  data.forEach(function (d) {
    if (countries_map[d[0]]) {
      map[d[0]] = ndx++;
      data_map[d[0]] = d[2];
      name_map[d[0]] = d[1];
    }
  });

  var colorScale = d3
    .scaleQuantize()
    .domain([0, ndx - 1])
    .range(opt.colors);
  var fontScale = d3
    .scaleQuantize()
    .domain([0, ndx - 1])
    .range([6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16]);

  //        var background_fill = svg.append("defs").append("radialGradient").attr("id", "background_fill").attr("cx", "75%").attr("cy", "25%");
  //        background_fill.append("stop").attr("offset", "5%").attr("stop-color", "#ddf");
  //        background_fill.append("stop").attr("offset", "100%").attr("stop-color", "#08519c"/*"#9ab"*/);

  var ocean_fill = svg
    .append("defs")
    .append("radialGradient")
    .attr("id", "ocean_fill")
    .attr("cx", "75%")
    .attr("cy", "25%");
  ocean_fill
    .append("stop")
    .attr("offset", "5%")
    .attr("stop-color", opt.ccPlotBackground1);
  ocean_fill
    .append("stop")
    .attr("offset", "100%")
    .attr("stop-color", opt.ccPlotBackground2);

  var globe_highlight = svg
    .append("defs")
    .append("radialGradient")
    .attr("id", "globe_highlight")
    .attr("cx", "75%")
    .attr("cy", "25%");
  globe_highlight
    .append("stop")
    .attr("offset", "5%")
    .attr("stop-color", "#ffd")
    .attr("stop-opacity", "0.6");
  globe_highlight
    .append("stop")
    .attr("offset", "100%")
    .attr("stop-color", "#ba9")
    .attr("stop-opacity", "0.2");

  var drop_shadow = svg
    .append("defs")
    .append("radialGradient")
    .attr("id", "drop_shadow")
    .attr("cx", "50%")
    .attr("cy", "50%");
  drop_shadow
    .append("stop")
    .attr("offset", "20%")
    .attr("stop-color", "#000")
    .attr("stop-opacity", ".5");
  drop_shadow
    .append("stop")
    .attr("offset", "100%")
    .attr("stop-color", "#000")
    .attr("stop-opacity", "0");

  //        svg.append("rect").attr("x", 0).attr("y", 0).attr("width", "100%").attr("height", "100%").style("fill", "url(#background_fill)").style('pointer-events', 'none');
  svg
    .append("ellipse")
    .attr("cx", width / 2 - proj.scale() * 0.3)
    .attr("cy", height / 2 + proj.scale() * 0.9)
    .attr("rx", proj.scale() * 0.9)
    .attr("ry", proj.scale() * 0.25)
    .attr("class", "ellipse")
    .style("fill", "url(#drop_shadow)")
    .style("pointer-events", "none");
  svg
    .append("circle")
    .attr("cx", width / 2)
    .attr("cy", height / 2)
    .attr("r", proj.scale())
    .attr("class", "circle")
    .style("fill", "url(#ocean_fill)")
    .style("pointer-events", "none");
  //        svg.append("path").datum(topojson.object(world, world.objects.land)).attr("class", "land").attr("d", path).attr('style', 'fill: rgb(117, 87, 57); stroke-opacity: 1;');
  svg
    .append("path")
    .datum(graticule)
    .attr("class", "graticule")
    .attr(
      "style",
      "fill: none; stroke: black; stroke-width: .5; opacity: .2;pointer-events: none;"
    )
    .attr("d", path);

  svg
    .append("g")
    .attr("class", "countries")
    .selectAll("path")
    .data(topojson.feature(world, world.objects.countries).features)
    .enter()
    .append("path")
    .attr(
      "style",
      " stroke: rgb(180, 180, 180); stroke-linejoin: round; stroke-width: .5; opacity: 1.;"
    )
    .attr("d", path)
    .style("fill", function (d) {
      return map[d.id] == null ? "rgb(200, 200, 200)" : colorScale(map[d.id]);
    })
    .on("mouseover", function (d) {
      tooltip
        .select(".tkc_label")
        .html((name_map[d.id] == null ? d.id : name_map[d.id]) + ":");
      tooltip
        .select(".tkc_value")
        .html(data_map[d.id] == null ? "" : d3.format(",.2r")(data_map[d.id]));
      tooltip.style("display", "block");
      var height2 = div_element.getElementsByClassName("tkc_tooltip")[0]
        .offsetHeight;
      tooltip
        .style("top", height - height2 - height / 50 + "px")
        .style("left", 10 + "px");
    })
    .on("mousemove", function () {})
    .on("click", function (d) {
      if (object.click == false) return;

      var id = ndx_map[d.id];
      if (id != null) {
        if (opt.portal) {
          // для BI-портала
          chartLinkedReport(opt.cells[0][id][0], opt.cells[0][id][1], div_name);
        } else {
          // для репортера
          var ref = [];
          ref.push("internal://n-#cell");
          ref.push(opt.cells[0][id]);
          document.location.href = ref.join(",");
        }
      }
      if (object.selected == d.id) {
        object.selected = "";
        d3.transition()
          .duration(1250)
          .on("start", function () {
            clearInterval(object.timer);
            object.timer = null;
            object.click = false;
          })
          .tween("rotate", function () {
            var s = d3.interpolate(proj.scale(), Math.min(width, height) / 2.3);
            return function (t) {
              proj.scale(s(t));
              refresh_zoom();
            };
          })
          .on("end", function () {});
      } else {
        object.selected = d.id;
        d3.transition()
          .duration(1250)
          .on("start", function () {
            clearInterval(object.timer);
            object.timer = null;
            object.click = false;
          })
          .tween("rotate", function () {
            var p = d3.geoCentroid(d);
            var temp = proj.rotate();
            proj.rotate([-p[0], -p[1]]);
            var b2 = path.bounds(d);
            proj.rotate(temp);
            var z = Math.min(
              width / (b2[1][0] - b2[0][0]) / 1.5,
              height / (b2[1][1] - b2[0][1]) / 1.5
            );

            var s0 = Math.min(width, height) / 2.3;
            var s1 = Math.min(proj.scale() * z, s0 * 2.5);

            var r = d3.interpolate(proj.rotate(), [-p[0], -p[1]]);
            var s = d3.interpolate(proj.scale(), s1);
            return function (t) {
              proj.rotate(r(t));
              proj.scale(s(t));
              refresh_zoom();
            };
          })
          .on("end", function () {});
      }
    })
    .on("mouseout", function () {
      //			    d3.select(this).style("fill", "#f00");
      tooltip.style("display", "none");
    });

  var centroids = [];
  var gm = topojson.feature(world, world.objects.countries).features;
  for (var i in gm) {
    if (map[gm[i].id] == null) continue;
    var c = d3.geoCentroid(gm[i]);
    var f = {
      type: "Feature",
      geometry: { type: "Point", coordinates: [c[0], c[1]] },
    };
    var p = { c: f, t: name_map[gm[i].id], n: gm[i].id };
    centroids.push(p);
  }

  svg
    .append("g")
    .attr("class", "points")
    .selectAll("path")
    .data(centroids)
    .enter()
    .append("path")
    .style("opacity", 0.6)
    .attr("class", "point")
    .attr("d", function (d) {
      return path(d.c);
    });

  var labels_g = svg
    .append("g")
    .attr("class", "labels")
    .attr(
      "style",
      "font: 10px sans-serif; fill: black; opacity: 0.9; text-shadow: -1px 0 white, 0 1px white, 1px 0 white, 0 -1px white;"
    )
    .selectAll("path")
    .data(centroids)
    .enter()
    .append("text")
    .attr("class", "label")
    .attr("style", function (d) {
      return "font-size:" + fontScale(map[d.n]) + "px;";
    })
    .text(function (d) {
      return d.t;
    });

  var zoom = d3.zoom().on("zoom", function () {
    proj.scale(
      proj.scale() * (d3.event.sourceEvent.deltaY > 0 ? 1 / 0.8 : 0.8)
    );
    refresh_zoom();
  });
  svg
    .call(zoom)
    .on("mousedown.zoom", null)
    .on("touchstart.zoom", null)
    .on("touchmove.zoom", null)
    .on("touchend.zoom", null);
  /*
        var labelPadding = 2;

        // the component used to render each label
        var textLabel = fc.layoutTextLabel()
          .padding(labelPadding)
          .value(function (d) {
              return d.t;
          });

        // a strategy that combines simulated annealing with removal
        // of overlapping labels
        var strategy = fc.layoutRemoveOverlaps();
        alert("3");

        // create the layout that positions the labels
        var labels = fc.layoutLabel(strategy)
            .size(function (d, i, g) {
                var centerPos = proj.invert([width / 2, height / 2]);
                var l = d3.geoDistance(d.c.geometry.coordinates, centerPos);
                d3.select(g[i]).select('text').style('font-size', function (d) { return fontScale(map[d.n]) })
                var textSize = d3.select(g[i])
                    .select('text')
                    .node()
                    .getBBox();
                return [textSize.width + labelPadding * 2, textSize.height + labelPadding * 2];
            })
            .position(function (d) {
                var centerPos = proj.invert([width / 2, height / 2]);
                var l = d3.geoDistance(d.c.geometry.coordinates, centerPos);
                if (l > 1.57)
                    return [width + 2, height + 2];

                var loc = proj(d.c.geometry.coordinates),
                  x = loc[0],
                  y = loc[1];
                var offset = 5;
                return [x + offset, y - 2];
            })
            .component(textLabel)
        ;
*/
  position_labels();

  if (animated) object.timer = setInterval(updateMap, 0);

  function refresh_zoom() {
    svg
      .selectAll(".ellipse")
      .attr("cx", width / 2 - proj.scale() * 0.3)
      .attr("cy", height / 2 + proj.scale() * 0.9)
      .attr("rx", proj.scale() * 0.9)
      .attr("ry", proj.scale() * 0.25);
    svg.selectAll(".circle").attr("r", proj.scale());
    var s = proj.scale() / (Math.min(width, height) / 2.3);
    if (s < 1)
      svg
        .selectAll(".labels")
        .selectAll(".label")
        .style("font-size", function (d) {
          return fontScale(map[d.n]) * s;
        });
    refresh();
  }

  function refresh() {
    svg.selectAll(".countries path").attr("d", path);
    svg.selectAll(".graticule").attr("d", path);
    svg.selectAll(".point").attr("d", function (d) {
      return path(d.c);
    });
    position_labels();
  }

  function position_labels() {
    /*
            if (object.animated) {
                labels_g.remove();
                labels_g = svg.append("g").attr("class", "labels").attr("style", "font: 10px sans-serif; fill: black; opacity: .8; text-shadow: -1px 0 white, 0 1px white, 1px 0 white, 0 -1px white;")
                return;
            } else

                if (centroids.length > 0)
                    labels_g.datum(centroids).call(labels);
            svg.selectAll(".label rect").style('fill', 'transparent');
            svg.selectAll(".label circle").style('opacity', 0.6);
            return;
*/

    var c = [];
    function intersect(a, b) {
      if (a.x1 > b.x2 || b.x1 > a.x2) return false;
      if (a.y1 > b.y2 || b.y1 > a.y2) return false;
      return true;
    }
    function intersects(a) {
      for (var i in c) {
        if (intersect(a, c[i])) return true;
      }
      c.push(a);
      return false;
    }
    var centerPos = proj.invert([width / 2, height / 2]);
    var lp = 2;
    svg.selectAll(".label").style("font-weight", "bold");
    svg
      .selectAll(".label")
      .style("display", function (d) {
        var d = d3.geoDistance(d.c.geometry.coordinates, centerPos);
        return d > 1.5 ? "none" : "inline";
      })
      .attr("transform", function (d) {
        if (d3.select(this).style("display") != "inline") return;
        var loc = proj(d.c.geometry.coordinates),
          x = loc[0] + 5,
          y = loc[1];
        var box = this.getBBox();
        var b = {
          x1: x - box.x - lp,
          x2: x - box.x + box.width + lp,
          y1: y - box.y - box.height - lp,
          y2: y - box.y + lp,
        };
        if (intersects(b)) d3.select(this).style("display", "none");
        return "translate(" + x + "," + y + ")";
      });
  }
  function updateMap() {
    if (m0 == null) {
      var o0 = proj.rotate();
      var o1 = [o0[0] + 5 / 6, o0[1] + 0 / 6];
      proj.rotate(o1);
      m0 = null;
      refresh();
    }
  }

  var m0, o0;
  function mousedown() {
    object.click = true;
    m0 = [d3.event.pageX, d3.event.pageY];
    o0 = proj.rotate();
    d3.event.preventDefault();
  }
  function click() {
    if (object.click == false) return;
    if (object.timer != null) {
      clearInterval(object.timer);
      object.timer = null;
    } else {
      object.timer = setInterval(updateMap, 0);
    }
    d3.event.preventDefault();
  }
  function mousemove() {
    if (m0) {
      object.click = false;
      clearInterval(object.timer);
      object.timer = null;
      var m1 = [d3.event.pageX, d3.event.pageY],
        o1 = [o0[0] + (m1[0] - m0[0]) / 6, o0[1] + (m0[1] - m1[1]) / 6];
      o1[1] = o1[1] > 30 ? 30 : o1[1] < -30 ? -30 : o1[1];
      proj.rotate(o1);
      refresh();
    }
  }
  function mouseup() {
    m0 = null;
  }

  return object;
}

function contourD3World(div_name, opt, object) {
  var data = opt.data[0];

  var ndx = 0;
  var ndx_map = {};
  data.forEach(function (d) {
    ndx_map[d[0]] = ndx++;
  });

  data.sort(function (a, b) {
    return a[2] - b[2];
  });

  var map = {};
  var data_map = {};
  var name_map = {};
  var countries_map = {};
  var map3 = {};
  var map_map = {};
  var ndx_sort = [];

  ndx = 0;
  world_110m.objects.countries.geometries.forEach(function (d) {
    countries_map[d.id] = ndx++;
  });
  ndx = 0;
  data.forEach(function (d) {
    if (countries_map[d[0]]) {
      ndx_sort.push(countries_map[d[0]]);
      map[d[0]] = ndx++;
      data_map[d[0]] = data_map[d[0]] == null ? d[2] : data_map[d[0]] + d[2];
      name_map[d[0]] = d[1];
    } else {
      if (countries_map[map_map[d[0]]]) {
        ndx_sort.push(countries_map[map_map[d[0]]]);
        map[map_map[d[0]]] = ndx++;
        data_map[map_map[d[0]]] =
          data_map[map_map[d[0]]] == null
            ? d[2]
            : data_map[map_map[d[0]]] + d[2];
        name_map[map_map[d[0]]] = d[1];
      } else map3[d[0]] = d[0];
    }
  });
  var colorScale = d3
    .scaleQuantize()
    .domain([0, ndx - 1])
    .range(opt.colors);
  var fontScale = d3
    .scaleQuantize()
    .domain([0, ndx - 1])
    .range([6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16]);

  var div_element = document.getElementById(div_name);
  var width = parseInt(div_element.style["width"], 10);
  var height = parseInt(div_element.style["height"], 10);

  div_element.innerHTML = "";

  var div_can = d3
    .select("#" + div_name)
    .append("div")
    .attr("id", "div_con")
    .style("position", "absolute")
    .style("width", "100%")
    .style("height", "100%")
    .style("top", 0)
    .style("left", 0);
  var div_svg = d3
    .select("#" + div_name)
    .append("div")
    .attr("id", "div_svg")
    .style("position", "absolute")
    .style("width", "100%")
    .style("height", "100%")
    .style("top", 0)
    .style("left", 0);

  div_can
    .append("canvas")
    .attr("id", "canvas")
    .attr("width", width)
    .attr("height", height);

  var svg = div_svg.append("svg").attr("width", "100%").attr("height", "100%");

  var zw = (width * 155) / 1000;
  var zh = (height * 120) / 500;
  var zz = (height * 100) / 500;
  var z = Math.min(zw, zh);
  var projection = d3
    .geoMercator()
    .scale(z)
    .translate([width / 2, zz + height / 2]);

  function mover(a, d) {
    svg.select("#s1").attr("cellId", ndx_map[d.id]);
    svg.select("#s2").attr("cellId", ndx_map[d.id]);

    svg.select("#s1").attr("d", d3.select(a).attr("d"));
    svg.select("#s2").attr("d", d3.select(a).attr("d"));
    tooltip
      .select(".tkc_label")
      .html(name_map[d.id] == null ? d.id : name_map[d.id] + ":");
    tooltip
      .select(".tkc_value")
      .html(data_map[d.id] == null ? "" : d3.format(",.2r")(data_map[d.id]));
    tooltip.style("display", "block");
    var height2 = div_element.getElementsByClassName("tkc_tooltip")[0]
      .offsetHeight;
    tooltip
      .style("top", height - height2 - height / 50 + "px")
      .style("left", 10 + "px");
  }

  var tooltip = div_svg
    .append("div")
    .attr("class", "tkc_tooltip")
    .attr(
      "style",
      "background: #eee; box-shadow: 0 0 5px #999999; color: #333; display: none; font-size: 12px; padding: 10px; position: absolute; text-align: left;"
    );
  tooltip
    .append("div")
    .attr("class", "tkc_label")
    .attr("style", "font: 18px sans-serif;");
  tooltip
    .append("div")
    .attr("class", "tkc_value")
    .attr("style", "font: 16px sans-serif; font-weight: bold");

  var path = d3.geoPath().projection(projection);

  // var graticule = d3.geoGraticule();
  // svg.append("path").datum(graticule).attr("class", "graticule").attr('style', 'fill: none; stroke: black; stroke-width: .5; opacity: .2;pointer-events: none;').attr("d", path);

  var svgElements = svg
    .append("g")
    .selectAll("path")
    .data(topojson.feature(world_110m, world_110m.objects.countries).features)
    .enter()
    .append("path")
    .attr("d", path)
    .style("stroke", "white")
    .style("stroke-width", "0.5")
    .style("fill", "transparent")
    .style("opacity", 1)
    .on("mouseover", function (d) {
      div_svg.transition();
      mover(this, d);
    })
    .on("mouseout", function (d) {});

  svg
    .append("g")
    .append("path")
    .attr("id", "s1")
    .style("stroke", "black")
    .style("stroke-width", 5)
    .style("fill", "transparent")
    .style("opacity", 1)
    .on("click", function () {
      var id = d3.select(this).attr("cellId");
      if (id == null) return;
      if (opt.portal) {
        // для BI-портала
        chartLinkedReport(opt.cells[0][id][0], opt.cells[0][id][1], div_name);
      } else {
        // для репортера
        var ref = [];
        ref.push("internal://n-#cell");
        ref.push(opt.cells[0][id]);
        document.location.href = ref.join(",");
      }
    });
  svg
    .append("g")
    .append("path")
    .attr("id", "s2")
    .style("stroke", "red")
    .style("stroke-width", 1)
    .style("fill", "transparent")
    .style("opacity", 1)
    .on("click", function () {
      var id = d3.select(this).attr("cellId");
      if (id == null) return;
      if (opt.portal) {
        // для BI-портала
        chartLinkedReport(opt.cells[0][id][0], opt.cells[0][id][1], div_name);
      } else {
        // для репортера
        var ref = [];
        ref.push("internal://n-#cell");
        ref.push(opt.cells[0][id]);
        document.location.href = ref.join(",");
      }
    });

  function toHSV(cr, cg, cb) {
    var r = cr / 255,
      g = cg / 255,
      b = cb / 255,
      min = Math.min(r, g, b),
      max = Math.max(r, g, b),
      d = max - min,
      h = NaN,
      s = d / max,
      v = max;
    if (d) {
      if (r === max) h = (g - b) / d + (g < b) * 6;
      else if (g === max) h = (b - r) / d + 2;
      else h = (r - g) / d + 4;
      h *= 60;
    }
    return { h: h, s: s, v: v };
  }

  function toRGB(hsv) {
    var h = isNaN(hsv.h) ? 0 : (hsv.h % 360) + (hsv.h < 0) * 360,
      s = isNaN(hsv.h) || isNaN(hsv.s) ? 0 : hsv.s,
      v = hsv.v,
      c = v * s,
      x = c * (1 - Math.abs(((h / 60) % 2) - 1)),
      m = v - c;
    return h < 60
      ? hsv2rgb(c, x, 0, m)
      : h < 120
      ? hsv2rgb(x, c, 0, m)
      : h < 180
      ? hsv2rgb(0, c, x, m)
      : h < 240
      ? hsv2rgb(0, x, c, m)
      : h < 300
      ? hsv2rgb(x, 0, c, m)
      : hsv2rgb(c, 0, x, m);
  }

  function hsv2rgb(r1, g1, b1, m) {
    return { r: (r1 + m) * 255, g: (g1 + m) * 255, b: (b1 + m) * 255 };
  }

  var image = new Image();
  image.onload = function () {
    var zw = (width * 155) / 1000;
    var zh = (height * 120) / 500;
    var zz = (height * 100) / 500;
    var z = Math.min(zw, zh);

    var izw0 = (1920 * 155) / 1000;
    var izh0 = (1080 * 120) / 500;
    var zz0 = (1080 * 100) / 500;
    var iz0 = Math.min(izw0, izh0);
    var iz = iz0 / z;

    var dx = (width - image.width / iz) / 2;
    var dy = -215 / iz + zz + (height - image.height / iz) / 2;
    var w = image.width / iz;
    var h = image.height / iz;

    var context = div_can.select("canvas").node().getContext("2d");
    var p1 = d3.geoPath().projection(projection).context(context);

    // Прозрачность
    context.globalAlpha = 0.7;
    context.drawImage(image, dx, dy, w, h);
    context.globalAlpha = 1.0;
    var c = context.getImageData(0, 0, width, height);

    context.fillStyle = "#000";
    context.fillRect(0, 0, width, height);
    var countries = topojson.feature(world_110m, world_110m.objects.countries)
      .features;
    countries.forEach(function (d) {
      context.fillStyle =
        map[d.id] == null ? "transparent" : colorScale(map[d.id]);
      context.beginPath();
      p1(d);
      context.fill();
    });

    var m = context.getImageData(0, 0, width, height);

    for (var y = 0; y < height; ++y)
      for (var x = 0; x < width; ++x) {
        var ndx = y * width * 4 + x * 4;
        if (c.data[ndx + 3] != 0) {
          var g = c.data[ndx + 1] / 255;
          var hsv = toHSV(m.data[ndx + 0], m.data[ndx + 1], m.data[ndx + 2]);
          var p = 1 - 0 - (g - 0);
          p = (100 * p) / (1 - 0);
          var z = (p * hsv.v) / 100;
          hsv.v -= z;
          var rgb = toRGB(hsv);
          c.data[ndx + 0] = rgb.r;
          c.data[ndx + 1] = rgb.g;
          c.data[ndx + 2] = rgb.b;
        }
      }

    context.putImageData(c, 0, 0);

    if (ndx_sort.length > 0) {
      var ndx = 0;
      (function transition() {
        div_svg
          .transition()
          .duration(1250)
          .on("start", function () {
            mover(
              svgElements._groups[0][ndx_sort[ndx]],
              world_110m.objects.countries.geometries[ndx_sort[ndx]]
            );
            ++ndx;
            if (ndx == ndx_sort.length) ndx = 0;
          })
          .on("end", transition);
      })();
    }
  };
  image.src = NE1_50M_SR_png;
}

function contourD3Russia(div_name, opt, object) {
  function linearGradient(list) {
    if (list == null) return null;
    if (list.length === 1) return list[0];
    var x2 = list[0] === 1 ? 0 : 1;
    var y2 = list[0] === 1 ? 1 : 0;
    var stops = [];
    var index = 1;
    while (index < list.length) {
      stops.push({ offset: list[index], color: list[index + 1] });
      index += 2;
    }
    var color = new echarts.graphic.LinearGradient(0, 0, x2, y2, stops);
    return color;
  }

  function DrawChartTime(div_name, opt, object, data, last) {
    var map_map = {};
    map_map["Архангельская область (без автономных округов)"] = [
      "Архангельская область",
    ];
    map_map["Кабардино-Балкарская Республика"] = [
      "Кабардино-Балкарская республика",
    ];
    map_map["Карачаево-Черкесская Республика"] = [
      "Карачаево-Черкесская республика",
    ];
    map_map["Республика Бурятия"] = ["Бурятская республика"];
    map_map["Республика Ингушетия"] = [
      "Чеченская республика + Ингушская республика",
    ];
    map_map["Республика Марий Эл"] = ["Республика Марий-Эл"];
    map_map["Республика Мордовия"] = ["Мордовская республика"];
    map_map["Республика Северная Осетия - Алания"] = [
      "Республика Северная Осетия",
    ];
    map_map["Тюменская область (без автономных округов)"] = [
      "Тюменская область",
    ];
    map_map["Удмуртская Республика"] = ["Удмуртская республика"];
    map_map["Ханты-Мансийский автономный округ-Югра"] = ["Ханты-Мансийский АО"];
    map_map["Чеченская Республика"] = [
      "Чеченская республика + Ингушская республика",
    ];
    map_map["Чувашская Республика"] = ["Чувашская республика"];
    map_map["Ямало-Ненецкий автономный округ"] = ["Ямало-Ненецкий АО"];
    map_map["г. Москва"] = ["Город Москва"];
    map_map["г. Санкт-Петербург"] = ["Город Санкт-Петербург"];
    map_map["Республика Тыва"] = ["Республика Тува"];
    //map_map["Республика Крым"]=[""] ;
    //map_map["Республика Башкортостан"]=[""] ;
    //map_map["г. Севастополь"]=[""] ;

    var ndx = 0;
    var ndx_map = {};
    data.forEach(function (d) {
      ndx_map[map_map[d[0]] == null ? d[0] : map_map[d[0]]] = ndx++;
    });

    data.sort(function (a, b) {
      return a[2] - b[2];
    });

    var map = {};
    var data_map = {};
    var name_map = {};
    var countries_map = {};
    var map3 = {};

    ndx = 0;
    var ndx_sort = [];
    rrr.objects["regions2010_wgs_union_1"].geometries.forEach(function (d) {
      countries_map[d.properties.region] = ndx++;
    });
    ndx = 0;
    data.forEach(function (d) {
      if (countries_map[d[0]]) {
        ndx_sort.push(countries_map[d[0]]);
        map[d[0]] = ndx++;
        data_map[d[0]] = data_map[d[0]] == null ? d[2] : data_map[d[0]] + d[2];
        name_map[d[0]] = d[1];
      } else {
        if (countries_map[map_map[d[0]]]) {
          ndx_sort.push(countries_map[map_map[d[0]]]);
          map[map_map[d[0]]] = ndx++;
          data_map[map_map[d[0]]] =
            data_map[map_map[d[0]]] == null
              ? d[2]
              : data_map[map_map[d[0]]] + d[2];
          name_map[map_map[d[0]]] = d[1];
        } else map3[d[0]] = d[0];
      }
    });
    var colorScale = d3
      .scaleQuantize()
      .domain([0, ndx - 1])
      .range(opt.colors);
    var fontScale = d3
      .scaleQuantize()
      .domain([0, ndx - 1])
      .range([6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16]);

    var div_element = document.getElementById(div_name);
    var width = parseInt(div_element.style["width"], 10);
    var height = parseInt(div_element.style["height"], 10);

    var div_can = d3
      .select("#" + div_name)
      .append("div")
      .attr("id", "div_con")
      .style("position", "absolute")
      .style("width", "100%")
      .style("height", "100%")
      .style("top", 0)
      .style("left", 0);
    var div_svg = d3
      .select("#" + div_name)
      .append("div")
      .attr("id", "div_svg")
      .style("position", "absolute")
      .style("width", "100%")
      .style("height", "100%")
      .style("top", 0)
      .style("left", 0);

    div_can
      .append("canvas")
      .attr("id", "canvas")
      .attr("width", width)
      .attr("height", height);

    var svg = div_svg
      .append("svg")
      .attr("width", "100%")
      .attr("height", "100%");

    var zw = (width * 750) / 1024;
    var zh = (height * 700) / 512;
    var z = Math.min(zw, zh);
    var projection = d3
      .geoConicEquidistant()
      .rotate([-105, 0])
      .center([-15, 65])
      .parallels([60, 60])
      .scale(z)
      .translate([width / 2, height / 2]);

    function mover(a, d) {
      svg.select("#s1").attr("cellId", ndx_map[d.properties.region]);
      svg.select("#s2").attr("cellId", ndx_map[d.properties.region]);

      svg.select("#s1").attr("d", d3.select(a).attr("d"));
      svg.select("#s2").attr("d", d3.select(a).attr("d"));
      tooltip
        .select(".tkc_label")
        .html(
          name_map[d.properties.region] == null
            ? d.properties.region
            : name_map[d.properties.region] + ":"
        );
      tooltip
        .select(".tkc_value")
        .html(
          data_map[d.properties.region] == null
            ? ""
            : d3.format(",.2r")(data_map[d.properties.region])
        );
      tooltip.style("display", "block");
      var height2 = div_element.getElementsByClassName("tkc_tooltip")[0]
        .offsetHeight;
      tooltip
        .style("top", height - height2 - height / 50 + "px")
        .style("left", 10 + "px");
    }

    var tooltip = div_svg
      .append("div")
      .attr("class", "tkc_tooltip")
      .attr(
        "style",
        "background: #eee; box-shadow: 0 0 5px #999999; color: #333; display: none; font-size: 12px; padding: 10px; position: absolute; text-align: left;"
      );
    tooltip
      .append("div")
      .attr("class", "tkc_label")
      .attr("style", "font: 16px Oswald;");
    tooltip
      .append("div")
      .attr("class", "tkc_value")
      .attr("style", "font: 22px Oswald; font-weight: bold");

    var path = d3.geoPath().projection(projection);
    var gm = topojson.feature(rrr, rrr.objects["regions2010_wgs_union_1"])
      .features;
    var svgElements = svg
      .append("g")
      .selectAll("path")
      .data(gm)
      .enter()
      .append("path")
      .attr("d", path)
      .style("stroke", "white")
      .style("stroke-width", "0.5")
      .style("fill", "transparent")
      .style("opacity", 1)
      .on("mouseover", function (d) {
        div_svg.transition();
        mover(this, d);
      })
      .on("mouseout", function (d) {});

    svg
      .append("g")
      .append("path")
      .attr("id", "s1")
      .style("stroke", "black")
      .style("stroke-width", 5)
      .style("fill", "transparent")
      .style("opacity", 1)
      .on("click", function () {
        var id = d3.select(this).attr("cellId");
        if (id == null) return;
        if (opt.portal) {
          // для BI-портала
          chartLinkedReport(opt.cells[0][id][0], opt.cells[0][id][1], div_name);
        } else {
          // для репортера
          var ref = [];
          ref.push("internal://n-#cell");
          ref.push(opt.cells[0][id]);
          document.location.href = ref.join(",");
        }
      });
    svg
      .append("g")
      .append("path")
      .attr("id", "s2")
      .style("stroke", "red")
      .style("stroke-width", 1)
      .style("fill", "transparent")
      .style("opacity", 1)
      .on("click", function () {
        var id = d3.select(this).attr("cellId");
        if (id == null) return;
        if (opt.portal) {
          // для BI-портала
          chartLinkedReport(opt.cells[0][id][0], opt.cells[0][id][1], div_name);
        } else {
          // для репортера
          var ref = [];
          ref.push("internal://n-#cell");
          ref.push(opt.cells[0][id]);
          document.location.href = ref.join(",");
        }
      });

    var centroids = [];
    for (var i in gm) {
      if (map[gm[i].properties.region] == null) continue;
      var c = d3.geoCentroid(gm[i]);
      var f = {
        type: "Feature",
        geometry: { type: "Point", coordinates: [c[0], c[1]] },
      };
      var p = {
        c: f,
        t: name_map[gm[i].properties.region],
        n: gm[i].properties.region,
        d: data_map[gm[i].properties.region],
        ndx: map[gm[i].properties.region],
      };
      centroids.push(p);
      //            if (centroids.length > 5) break ;
    }
    centroids.sort(function (a, b) {
      return -a.ndx + b.ndx;
    });

    var labels_g = svg
      .append("g")
      .attr("class", "labels")
      .attr(
        "style",
        "font: 10px Open Sans Condensed; fill: #081d58; opacity: 1; text-shadow: -1px 0 white, 0 1px white, 1px 0 white, 0 -1px white;"
      )
      .selectAll("path")
      .data(centroids)
      .enter()
      .append("g")
      .attr("class", "label_g");

    labels_g
      .append("text")
      .attr("class", "label")
      .attr("style", function (d) {
        return "font-weight: bold; display: inline; font-size:" + 20 + "px;";
      })
      .text(function (d) {
        return d.t;
      });

    labels_g
      .append("text")
      .attr("class", "label")
      .attr("style", function (d) {
        return "font-weight: bold; display: inline; font-size:" + 50 + "px;";
      })
      .attr("transform", "translate(0, -20)")
      .text(function (d) {
        return d3.format(",.2r")(d.d);
      });

    function position_labels() {
      var c = [];
      function intersect(a, b) {
        if (a.x1 > b.x2 || b.x1 > a.x2) return false;
        if (a.y1 > b.y2 || b.y1 > a.y2) return false;
        return true;
      }
      function intersects(a) {
        for (var i in c) {
          if (intersect(a, c[i])) return true;
        }
        c.push(a);
        return false;
      }
      var lp = 2;
      //            svg.selectAll(".label").style('font-weight', 'bold');
      svg.selectAll(".label_g").attr("transform", function (d) {
        var loc = projection(d.c.geometry.coordinates),
          x = loc[0] + 5,
          y = loc[1];
        var box = this.getBBox();
        var b = {
          x1: x - box.x - lp,
          x2: x - box.x + box.width + lp,
          y1: y - box.y - box.height - lp,
          y2: y - box.y + lp,
        };
        if (intersects(b)) d3.select(this).style("display", "none");
        return "translate(" + x + "," + y + ")";
      });
    }

    function toHSV(cr, cg, cb) {
      var r = cr / 255,
        g = cg / 255,
        b = cb / 255,
        min = Math.min(r, g, b),
        max = Math.max(r, g, b),
        d = max - min,
        h = NaN,
        s = d / max,
        v = max;
      if (d) {
        if (r === max) h = (g - b) / d + (g < b) * 6;
        else if (g === max) h = (b - r) / d + 2;
        else h = (r - g) / d + 4;
        h *= 60;
      }
      return { h: h, s: s, v: v };
    }

    function toRGB(hsv) {
      var h = isNaN(hsv.h) ? 0 : (hsv.h % 360) + (hsv.h < 0) * 360,
        s = isNaN(hsv.h) || isNaN(hsv.s) ? 0 : hsv.s,
        v = hsv.v,
        c = v * s,
        x = c * (1 - Math.abs(((h / 60) % 2) - 1)),
        m = v - c;
      return h < 60
        ? hsv2rgb(c, x, 0, m)
        : h < 120
        ? hsv2rgb(x, c, 0, m)
        : h < 180
        ? hsv2rgb(0, c, x, m)
        : h < 240
        ? hsv2rgb(0, x, c, m)
        : h < 300
        ? hsv2rgb(x, 0, c, m)
        : hsv2rgb(c, 0, x, m);
    }

    function hsv2rgb(r1, g1, b1, m) {
      return { r: (r1 + m) * 255, g: (g1 + m) * 255, b: (b1 + m) * 255 };
    }

    var image = new Image();
    image.onload = function () {
      var zw = (width * 750) / 1024;
      var zh = (height * 700) / 512;
      var z = Math.min(zw, zh);

      var izw0 = (1920 * 750) / 1024;
      var izh0 = (1080 * 700) / 512;
      var iz0 = Math.min(izw0, izh0);
      var iz = iz0 / z;

      var dx = (width - image.width / iz) / 2;
      var dy = (height - image.height / iz) / 2;
      var w = image.width / iz;
      var h = image.height / iz;

      var context = div_can.select("canvas").node().getContext("2d");
      var p1 = d3.geoPath().projection(projection).context(context);

      // Прозрачность
      context.globalAlpha = 0.7;
      context.drawImage(image, dx, dy, w, h);
      context.globalAlpha = 1.0;
      var c = context.getImageData(0, 0, width, height);

      context.fillStyle = "#000";
      context.fillRect(0, 0, width, height);
      var countries = topojson.feature(
        rrr,
        rrr.objects["regions2010_wgs_union_1"]
      ).features;
      countries.forEach(function (d) {
        context.fillStyle =
          map[d.properties.region] == null
            ? "transparent"
            : colorScale(map[d.properties.region]);
        context.beginPath();
        p1(d);
        context.fill();
      });

      var m = context.getImageData(0, 0, width, height);

      for (var y = 0; y < height; ++y)
        for (var x = 0; x < width; ++x) {
          var ndx = y * width * 4 + x * 4;
          if (c.data[ndx + 3] != 0) {
            var g = c.data[ndx + 1] / 255;
            var hsv = toHSV(m.data[ndx + 0], m.data[ndx + 1], m.data[ndx + 2]);
            var p = 1 - 0 - (g - 0);
            p = (100 * p) / (1 - 0);
            var z = (p * hsv.v) / 100;
            hsv.v -= z;
            var rgb = toRGB(hsv);
            c.data[ndx + 0] = rgb.r;
            c.data[ndx + 1] = rgb.g;
            c.data[ndx + 2] = rgb.b;
          }
        }

      context.putImageData(c, 0, 0);

      d3.select("#" + div_name).style("display", "inherit");
      if (last != null) d3.select("#" + last).style("display", "none");
      position_labels();

      if (false && ndx_sort.length > 0) {
        var ndx = 0;
        (function transition() {
          div_svg
            .transition()
            .duration(1250)
            .on("start", function () {
              mover(
                svgElements._groups[0][ndx_sort[ndx]],
                rrr.objects["regions2010_wgs_union_1"].geometries[ndx_sort[ndx]]
              );
              ++ndx;
              if (ndx == ndx_sort.length) ndx = 0;
            })
            .on("end", transition);
        })();
      }
    };
    image.src = russia_png;
  }

  if (opt.timeline == null) {
    var div_element = document.getElementById(div_name);
    div_element.innerHTML = "";
    d3.select("#" + div_name).style(
      "background",
      linearGradient(opt.background)
    );
    DrawChartTime(div_name, opt, object, opt.data[0], null);
  } else {
    var div_element = document.getElementById(div_name);
    var width = parseInt(div_element.style["width"], 10);
    var height = parseInt(div_element.style["height"], 10);

    div_element.innerHTML = "";
    d3.select("#" + div_name).style(
      "background",
      linearGradient(opt.background)
    );

    var div_tml = d3
      .select("#" + div_name)
      .append("div")
      .attr("id", "div_tml")
      .style("position", "absolute")
      .style("width", width - 10 - 10 + "px")
      .style("height", "1px")
      .style("left", "10px");
    var option = {
      title: {},
      legend: {},
      grid: { containLabel: true },
    };

    var timeline = {
      left: 0,
      right: 0,
      top: 0,
      width: "100%",
      axisType: "category",
      autoPlay: true,
      playInterval: 3000,
      data: opt.timeline,
    };
    option.timeline = timeline;
    var option_tl = {};
    option_tl.baseOption = option;
    option_tl.options = [];

    opt.timeline.forEach(function (line) {
      var opt_t = {
        title: {
          subtext: line,
          subtextStyle: {
            fontFamily: "Oswald",
            fontSize: 20,
            color: "#081d58",
          },
        },
        series: [],
      };
      option_tl.options.push(opt_t);
    });

    var chart = echarts.init(div_tml.node());
    chart.setOption(option_tl, true);

    var model = chart.getModel().getComponent("timeline", 0);
    var view = chart.getViewOfComponentModel(model);
    view.render(model, model.ecModel, chart);
    var rect = view.group.getBoundingRect();
    var h = rect.y + rect.height + 10;

    height -= h;
    div_tml.style("height", h + "px").style("top", height + "px");
    echarts.dispose(div_tml.node());
    chart = echarts.init(div_tml.node());
    chart.setOption(option_tl, true);

    var last;
    function draw(i) {
      var name = div_name + "-map-" + i;
      var n = document.getElementById(name);
      if (n == null) {
        n = d3
          .select("#" + div_name)
          .append("div")
          .attr("id", name)
          .style("position", "absolute")
          .style("width", width + "px")
          .style("height", height + "px")
          .style("top", "0px")
          .style("left", "0px")
          .style("display", "none");
        document.getElementById(name).innerHTML = "";
        DrawChartTime(name, opt, object, opt.data[i][0], last);
      } else {
        d3.select("#" + name).style("display", "inherit");
        if (last != null) d3.select("#" + last).style("display", "none");
      }
      last = name;
    }

    chart.on("timelineChanged", "timeline", function (i) {
      draw(i.currentIndex);
    });
    draw(0);
  }
}

function contourEChart(div_name, opt, object) {
  // div_name   - div name
  // object     - chart object, must be created if null
  // opt
  // function must return object
  var div_element = document.getElementById(div_name);
  var chart = echarts.init(document.getElementById(div_name));
  var width = parseInt(div_element.style["width"], 10);
  var height = parseInt(div_element.style["height"], 10);
  chart.resize(width, height);
  var chartHeight = chart.getHeight();
  var chartWidth = chart.getWidth();
  var baseAxisIndex = 0; // номер текущей "основной" оси "слева" - может относиться к нескольким сериям
  var addedAxisX = []; // массив дополнительных осей (для пустых гридов)
  var addedAxisY = [];
  var timelineIndex = 0;
  // отладка кнопка
  /*function buttonClicked() {
    var o = GLOBAL_MAP['chart']; var r = DrawChart('chart', d, o) ; GLOBAL_MAP['chart'] = r; 
}

var btn = document.createElement('input');
btn.id = 'b1';
btn.type = 'button';
btn.value = 'Кнопка';

document.body.appendChild(btn);
document.getElementById('b1').onclick = buttonClicked ;*/
  // отладка
  chart.on("click", function (param) {
    if (param.data && param.componentType === "series") {
      // var cell = opt.cells[param.seriesIndex] ;
      var data = opt.data[param.seriesIndex];
      var index = param.dataIndex;
      if (opt.multi !== undefined) {
        var row = Math.floor(param.seriesIndex / opt.cells[0].length);
        var col = param.seriesIndex - opt.cells[0].length * row;
        //cell = opt.cells[row][col] ;
        data = opt.data[row][col];
      } else if (opt.timeline !== undefined) {
        //cell = opt.cells[timelineIndex][param.seriesIndex] ;
        data = opt.data[timelineIndex][param.seriesIndex];
      }
      var cell = data[index]; // последний, потом заменить на предпоследний
      if (opt.portal) {
        // для BI-портала
        chartLinkedReport(
          cell[cell.length - 2][0],
          cell[cell.length - 2][1],
          div_name
        );
      } else {
        // для репортера
        var ref = ["internal://n-#cell", cell[cell.length - 2]];
        document.location.href = ref.join(",");
      }
    }
  });

  chart.on("click", "yAxis.category", function (param) {
    axisLabelClicked(opt, param);
  });

  chart.on("click", "xAxis.category", function (param) {
    axisLabelClicked(opt, param);
  });

  chart.on("click", "timeline", function (param) {
    timelineIndex = param.dataIndex;
  });

  function getSeries(gridIndex, ndx) {
    if (
      (opt.coordinateSystem === "tree" && opt.timeline === undefined) ||
      opt.coordinateSystem === "sankey"
    )
      return opt.series[ndx];
    return opt.series[gridIndex][ndx];
  }

  function firstSeries() {
    return getSeries(0, 0);
  }

  function firstType() {
    return firstSeries().type;
  }

  option = {
    backgroundColor: linearGradient(opt.background.color), // фон
    animation: opt.animation,
    legend: fillLegend(opt, opt.legend.show),
    tooltip: {
      show: true,
      showContent: opt.tooltips.isShow,
      trigger: "item",
      axisPointer: {
        type: "cross",
      },

      backgroundColor: opt.tooltips.background,
      borderWidth: opt.tooltips.borderWidth,
      borderColor: opt.tooltips.borderColor,
      padding: 5,
      shadowColor: "rgba(0,0,0,0.2)",
      shadowBlur: 3,
      shadowOffsetY: 5,
      textStyle: {
        color: opt.tooltips.color,
        fontStyle: opt.tooltips.style,
        fontWeight: opt.tooltips.weight,
        fontSize: opt.tooltips.size,
      },
    },

    xAxis: [],
    yAxis: [],
    angleAxis: [],
    radiusAxis: [],
    singleAxis: [],
    series: [],
  };

  calcGrid(chartWidth, chartHeight, opt, option, firstType());

  function axis(series, name, type, fact, orient, gridIndex, ndx, dataIndex) {
    // dataIndex - по умолчанию
    if (dataIndex === undefined) dataIndex = gridIndex;
    var chartType = firstType();
    var isLink = { flag: false };
    hor =
      chartType === "HorizontalBar" ||
      chartType === "PairedBar" ||
      chartType === "BubbleColumn";
    setting =
      orient === "x"
        ? hor
          ? opt.yAxis
          : opt.xAxis
        : hor
        ? opt.xAxis
        : opt.yAxis;
    // var fontHeight = strSize('A', setting.labels.size) ;

    if (series !== null && type === "value")
      zeroLine(series.markLine.data, setting, orient);

    var position =
      fact !== undefined
        ? fact.position
        : setting.position !== undefined
        ? setting.position
        : hor
        ? "left"
        : "bottom";

    var row = Math.floor(gridIndex / opt.colCount);
    var col = gridIndex - opt.colCount * row;

    var addedAxis = opt.multi !== undefined && gridIndex >= opt.multi.length; // дополнительная ось в пустом окне

    var hide =
      opt.hideAxis &&
      ((position === "left" && col > 0 && opt.colCount > 1) ||
        (position === "right" && col < opt.colCount - 1 && opt.colCount > 1) ||
        (position === "top" && row > 0 && opt.rowCount > 1) ||
        (position === "bottom" && row < opt.rowCount - 1 && opt.rowCount > 1));

    if (
      opt.multi !== undefined &&
      opt.hideAxis &&
      opt.multi.length < opt.colCount * opt.rowCount &&
      row === opt.rowCount - 2 &&
      gridIndex + opt.colCount >= opt.multi.length
    ) {
      var addAxis = axis(
        null,
        name,
        type,
        fact,
        orient,
        gridIndex + opt.colCount,
        ndx,
        gridIndex
      );
      if (orient === "x") addedAxisX.push(addAxis);
      else addedAxisY.push(addAxis);
    }

    var ax = {
      type: type,
      gridIndex: opt.timeline !== undefined ? 0 : gridIndex,
      nameLocation: "center",
      nameTextStyle: {
        color: setting.title.color,
        fontStyle: setting.title.style,
        fontWeight: setting.title.weight,
        fontSize: setting.title.size,
      },
      splitLine: {
        show: setting.grid.show && !addedAxis,
        lineStyle: {
          type: setting.grid.type,
          color: setting.grid.color,
          width: setting.grid.width,
        },
      },
      axisPointer: {
        show: setting.axisPointer !== undefined,
      },
      axisLabel: {
        formatter: function (value, index, timelineIndex, dim) {
          var chartType = firstType();
          var hor =
            chartType === "HorizontalBar" ||
            chartType === "PairedBar" ||
            chartType === "BubbleColumn";
          var asetting =
            dim === "x"
              ? hor
                ? opt.yAxis
                : opt.xAxis
              : hor
              ? opt.xAxis
              : opt.yAxis;
          return axisFormatter(
            opt,
            type,
            fact,
            value,
            index,
            dataIndex,
            timelineIndex,
            asetting
          );
        },
        show: setting.labels.show && !hide,

        textStyle: {
          color: setting.labels.color,
          fontStyle: setting.labels.style,
          fontWeight: setting.labels.weight,
          fontSize: setting.labels.size,
          fontFamily: "sans-serif",
        },
      },
      axisLine: {
        show: setting.line.show && !(addedAxis && hide),
        lineStyle: {
          type: hide ? setting.grid.type : setting.line.type,
          color: hide ? setting.grid.color : setting.line.color,
          width: hide ? setting.grid.width : setting.line.width,
        },
      },
      axisTick: {
        show: setting.ticks.show && !hide,
      },
      boundaryGap: type === "category",
    };
    if (setting.labels.showMinLabel !== undefined)
      ax.axisLabel.showMinLabel = setting.labels.showMinLabel;
    if (setting.labels.showMaxLabel !== undefined)
      ax.axisLabel.showMaxLabel = setting.labels.showMaxLabel;

    if (setting.axisPointer) {
      ax.axisPointer.label = {
        borderWidth: setting.axisPointer.borderWidth,
        borderColor: setting.axisPointer.borderColor,
        backgroundColor: setting.axisPointer.background,
        color: setting.axisPointer.color,
        fontStyle: setting.axisPointer.style,
        fontWeight: setting.axisPointer.weight,
        fontSize: setting.axisPointer.size,
        margin: setting.axisPointer.margin,
      };
    }
    ax.axisLabel.rotate = setting.labels.rotate;
    ax.axisLabel.rich = {
      value: {
        fontStyle: setting.labels.style,
        fontWeight: setting.labels.weight,
        fontSize: setting.labels.size,
        fontFamily: "sans-serif",
      },
    };
    if (opt.images !== undefined && !opt.pictorial) {
      for (var i = 0; i < opt.images.length; i++) {
        var imageName = "image" + i;
        ax.axisLabel.rich[imageName] = {
          width: opt.imageSizes[i][0],
          height: opt.imageSizes[i][1],
          trueHeight: opt.imageSizes[i][1],
          align: "center",
          backgroundColor: {
            image: opt.images[i],
          },
        };
      }
    }
    if (opt.links !== undefined) {
      for (var i = 0; i < opt.links.length; i++) {
        var urlName = "link" + i;
        ax.axisLabel.rich[urlName] = {
          link: opt.links[i],
        };
      }
    }

    if (addedAxis && type === "value" && fact !== undefined) {
      ax.min = 0;
      ax.max = fact.max;
    }
    if (
      type === "category" &&
      (addedAxis ||
      (opt.pictorial &&
        chartType == "Bar") /* || chartType === 'ImageBubble'*/ ||
        opt.links ||
        opt.isOnlyFact ||
        opt.separateColors ||
        /*временно */ opt.onlyTotal)
    )
      ax.data = axisData(opt, setting, isLink, dataIndex);

    if (opt.coordinateSystem === "cartesian2d") ax.position = position;
    if (fact !== undefined) {
      if (fact.log !== undefined && fact.log === true) ax.type = "log";
      if (fact.color !== undefined && !hide)
        ax.axisLine.lineStyle.color = fact.color;
      if (ax.axisPointer.label)
        ax.axisPointer.label.precision = /*fact.format.decimal*/ 2;
    }
    if (setting.title.show && !hide)
      ax.name =
        setting.title.text !== undefined
          ? setting.title.text
          : fact !== undefined
          ? fact.name
          : name;

    if (setting.width !== undefined) ax.width = setting.width;

    if (setting.title.background !== undefined)
      ax.nameTextStyle.backgroundColor = linearGradient(
        setting.title.background
      );
    if (setting.labels.background !== undefined)
      ax.axisLabel.textStyle.backgroundColor = linearGradient(
        setting.labels.background
      );

    if (type === "value") {
      if (setting.line.tickCount !== undefined)
        ax.splitNumber = setting.line.tickCount;
      if (setting.line.log === true) ax.type = "log";
    }
    if (
      (chartType === "BubbleBar" && orient === "y") ||
      (chartType === "BubbleColumn" && orient === "x")
    ) {
      ax.min = 0;
      ax.max = 1;
    }
    if (
      fact !== undefined &&
      opt.separateAxis === false &&
      opt.ColumnStack100 === undefined
    ) {
      ax.scale = true;
      // если min/max заданы вручную
      if (fact.limitMin !== undefined) ax.min = fact.limitMin;
      else if (opt.sameScale && opt.multi !== undefined && fact.min < 0)
        ax.min = fact.min;
      if (fact.limitMax !== undefined) ax.max = fact.limitMax;
      else if (opt.sameScale && opt.multi !== undefined)
        ax.max = opt.maxTotal !== undefined ? opt.maxTotal : fact.max;
      /*временно */ else if (opt.onlyTotal) {
        ax.max = 0;
        ax.scale = true;
      }
    } else if (
      fact &&
      opt.separateAxis &&
      opt.sameScale &&
      opt.multi !== undefined &&
      ((hor && orient === "x") || (!hor && orient === "y"))
    ) {
      ax.max = fact.seriesMax[ndx];
    }
    ax.hide = hide;
    if (isLink.flag) ax.triggerEvent = true;
    return ax;
  }

  function seriesLabelByType(name, type, gridIndex, ndx) {
    var labels =
      getSeries(gridIndex, ndx).labels !== undefined
        ? getSeries(gridIndex, ndx).labels
        : opt.labels;

    var label = {
      normal: {
        show: true,
        position: "top",
        color: "black",
        distance: labels.distance,
      },
      emphasis: {
        textStyle: {
          fontSize: 20,
        },
      },
    };
    if (labels.background !== undefined)
      label.normal.backgroundColor = linearGradient(labels.background);

    switch (type) {
      case "Line":
      case "Area":
      case "CurvedArea":
      case "Scatter":
        label.normal.position = labels.inside ? "inside" : "top";
        label.normal.distance = labels.distance;
        break;
      case "Bubble":
      case "BubbleColumn":
      case "BubbleBar":
        //   label.normal.position = 'inside' ;
        label.normal.distance = labels.distance;
        break;
      case "Bar":
        label.normal.position =
          opt.ColumnStack || opt.ColumnStack100
            ? "inside"
            : labels.inside
            ? "insideTop"
            : "top";
        label.normal.position =
          opt.ColumnStack || opt.ColumnStack100
            ? "inside"
            : labels.inside
            ? "insideTop"
            : "top";
        label.normal.rotate = labels.rotate;
        break;
      case "HorizontalBar":
        label.normal.position =
          opt.ColumnStack || opt.ColumnStack100
            ? "inside"
            : labels.inside
            ? "insideRight"
            : "right";
        break;
      case "PairedBar":
        label.normal.position = labels.inside
          ? ndx % 2 === 1
            ? "insideRight"
            : "insideLeft"
          : ndx % 2 === 1
          ? "right"
          : "left";
        break;
      case "Pie":
        label.normal.position = labels.inside ? "inside" : "outside";
        label.normal.rotate = 0;
        break;
      case "Pyramid":
        label.normal.position = labels.inside ? "inside" : "right";
        break;
      case "Sunburst":
        label.normal.position = labels.inside ? "inside" : "outside";
        label.normal.rotate = labels.rotate;
        break;
      case "Candle":
        break;
      case "Treemap":
        label.normal.position = "inside";
        break;
      case "TagCloud":
        break;
      case "Sankey":
        label.normal.position = "right";
        break;
    }
    if (labels.position !== undefined) label.normal.position = labels.position;

    if (label) {
      label.normal.formatter = function (v) {
        return labelFormatter(opt, firstType(), labels, v);
      };

      if (labels.borderColor !== undefined) {
        // рамка
        label.normal.borderColor = labels.borderColor;
        label.normal.borderWidth = labels.borderWidth;
        label.normal.borderRadius = labels.borderRadius;
        label.normal.padding = labels.borderPadding;
      }
      if (labels.shadowColor !== undefined) {
        // тень (от рамки)
        label.normal.shadowColor = labels.shadowColor;
        label.normal.shadowBlur = labels.shadowBlur;
        label.normal.shadowOffsetX = labels.shadowOffsetX;
        label.normal.shadowOffsetY = labels.shadowOffsetY;
      }
      label.normal.rich = fillLabelsRich(opt, type, labels);
    }

    return label;
  }

  function heatMapData(data, gridIndex) {
    var newData = [];
    opt.seriesNamesX = [];
    opt.seriesNamesY = [];
    for (var index = 0; index < data.length; index++) {
      var rowData = data[index];
      for (var i = 0; i < rowData.length; i++) {
        if (index === 0) opt.seriesNamesX.push(rowData[i][0]);
        newData.push([i, index, rowData[i][1]]);
      }
      opt.seriesNamesY.push(opt.series[gridIndex][index].name);
    }
    return newData;
  }

  function candleData(data, seria) {
    var newData = [];
    for (var i = 0; i < data.length; i++) {
      var max = data[i][0];
      var min = data[i][1];
      var open = data[i].length == 2 ? min : data[i][2];
      var close = data[i].length == 2 ? max : data[i][3];

      newData.push({
        value: [
          Math.min(min, max),
          Math.min(open, close),
          open,
          Math.max(open, close),
          Math.max(min, max),
        ],
        itemStyle: {
          normal: {
            color:
              open < close
                ? opt.candle.increaseColor
                : opt.candle.decreaseColor,
            borderWidth: seria.border.width,
            borderType: seria.border.type,
          },
        },
      });
    }
    return newData;
  }

  function bubbleData(data) {
    var newData = data;
    for (var i = 0; i < newData.length; i++) newData[i].push(0.5);
    return newData;
  }

  function pictureData(data, gridIndex, type) {
    var newData = [];
    var max =
      opt.facts.y.limitMax !== undefined
        ? opt.facts.y.limitMax
        : (opt.multi !== undefined || opt.timeline !== undefined) &&
          !opt.sameScale
        ? opt.imageColumn.maxList[gridIndex]
        : opt.facts.y.max;
    var min =
      opt.facts.y.limitMin !== undefined
        ? opt.facts.y.limitMin
        : (opt.multi !== undefined || opt.timeline !== undefined) &&
          !opt.sameScale
        ? opt.imageColumn.minList[gridIndex]
        : opt.facts.y.min;

    for (var i = 0; i < data.length; i++) {
      var onedata = {};
      onedata.value = type == "max" ? 1 : data[i][1];
      onedata.name = data[i][0];
      var formatter = data[i][data[i].length - 1];
      // var formatter = (opt.multi === undefined && opt.timeline === undefined) ? opt.seriesNameData.formatters[0][i] : opt.seriesNameData[gridIndex].formatters[0][i] ;
      onedata.symbol = opt.images[formatter[0][1]];
      if (opt.imageColumn.scale && type !== "max") {
        var size = Math.max(10, ((data[i][1] - min) * 100) / (max - min));
        onedata.symbolSize = [size + "%", "100%"];
      }
      newData.push(onedata);
    }
    return newData;
  }

  function bubblePictureData(data, gridIndex) {
    var newData = [];
    for (var i = 0; i < data.length; i++) {
      var formatter = data[i][data[i].length - 1];
      //  var formatter = (opt.multi === undefined && opt.timeline === undefined) ? opt.seriesNameData.formatters[0][i] : opt.seriesNameData[gridIndex].formatters[0][i] ;
      var onedata = {
        value: data[i][1],
        name: data[i][0],
        symbolSize: bubbleSize(data[i][2]),
        symbol: opt.images[formatter[0][1]],
      };
      newData.push(onedata);
    }
    return newData;
  }
  // временно, для росстата - удаление незаданных только в односерийном графике
  function getDefinedData(data) {
    var newData = [];
    for (var i = 0; i < data.length; i++) {
      if (data[i][1] !== null) newData.push(data[i]);
    }
    return newData;
  }

  function getData(data, seria, gridIndex) {
    var type = opt.series[gridIndex][0].type;
    switch (type) {
      case "Candle":
        return candleData(data, seria);
      case "BubbleBar":
      case "BubbleColumn":
        return bubbleData(data);
      case "Bar":
        return opt.pictorial ? pictureData(data, gridIndex, "all") : data;
      case "Bubble":
        return opt.pictorial ? bubblePictureData(data, gridIndex) : data;
      //   default:        return opt.sort ? sortData(opt, data, opt.colors) : (opt.removeUndefined !== undefined && opt.removeUndefined ? getDefinedData(data) : data) ;
      default:
        return opt.sort ? sortData(opt, data, opt.colors) : data;
    }
  }

  function getAreaData(data, type) {
    var newData = [];
    for (var i = 0; i < data.length; i++) {
      newData.push([
        data[i][0],
        type == "min"
          ? data[i][2]
          : type == "average"
          ? (data[i][1] + data[i][2]) / 2
          : data[i][1],
      ]);
    }
    return newData;
  }

  function bubbleSize(val) {
    if (val === undefined) val = 0;
    var zmin = opt.bubble.min; // размер наменьшего пузыря в процентах от экрана (из стилей)
    var zmax = opt.bubble.max; // размер наибольшего пузыря в процентах от экрана
    pmin =
      Math.min(chartWidth / opt.colCount, chartHeight / opt.rowCount) * zmin; // размер наменьшего пузыря в пикселях
    var pmax =
      Math.min(chartWidth / opt.colCount, chartHeight / opt.rowCount) * zmax; // размер наибольшего пузыря в пикселях
    size =
      (pmin +
        ((val - opt.facts.size.min) * (pmax - pmin)) /
          (opt.facts.size.max - opt.facts.size.min)) *
      opt.bubble.scale; // размер текущего пузыря в пикселях, учитывая scale
    return size;
  }

  function seriesByType(seria, name, type, ndx, itemStyle, gridIndex, isAxis) {
    var series = {};
    // insert отладка emphasis
    /* series.emphasis = {
        itemStyle: {
            color: 'red'
        }
    } ;*/
    // insert
    series.name = name;
    series.separateColors = opt.separateColors;
    series.itemStyle = itemStyle;
    var axisNeeded = false;
    var hor = false;
    series.markLine = { symbol: "none" };
    series.markArea = {};
    series.markLine.data = [];
    series.markArea.data = [];
    if (opt.legend.reverse && opt.legend.show && name !== "")
      option.legend.data.unshift(name);

    if (ndx === 0) bostonProps(opt, series.markArea.data);

    var isLabel =
      opt.isLabel !== undefined
        ? opt.isLabel
        : seria !== null
        ? seria.isLabel
        : false;

    if (opt.coordinateSystem === "polar") series.coordinateSystem = "polar";

    switch (type) {
      case "Spline":
      case "Line":
      case "StepLine":
        series.type = "line";
        series.encode = { itemName: 0, y: 1, x: 0, radius: 1, angle: 0 };
        series.smooth = type === "Spline"; // Кривая
        if (type === "StepLine")
          // Лесенка
          series.step = "end";
        // свойства узлов
        series.symbolSize = seria.anchor.show ? seria.anchor.size : 0; // размер узла
        series.symbol = seria.anchor.show ? seria.anchor.type : "none"; // тип узла

        if (seria.anchor.show) {
          series.itemStyle.normal.borderColor = seria.anchor.borderColor; // контур узла
          series.itemStyle.normal.borderWidth = seria.anchor.borderWidth; // ширина контура
          series.symbolColor =
            seria.anchor.color !== "transparent" ? seria.anchor.color : null; // цвет фона узла
        }

        series.lineStyle = {
          normal: {
            width: seria.line.width,
            type: seria.line.type,
          },
        };
        if (seria.line.shadow) {
          // тень линии
          series.lineStyle.normal.shadowColor = "rgba(0,0,0,0.2)";
          series.lineStyle.normal.shadowBlur = 3;
          series.lineStyle.normal.shadowOffsetY = 5;
        }
        axisNeeded = true;
        break;
      case "Bar":
      case "HorizontalBar":
      case "PairedBar":
      case "Marimekko":
        if (opt.pictorial) {
          // Столбец-картинка
          series.type = "pictorialBar";
          axisNeeded = isAxis;
          if (isAxis) series.symbolClip = opt.imageColumn.clip;
          if (opt.imageColumn.clip)
            series.symbolBoundingData =
              (opt.multi !== undefined || opt.timeline !== undefined) &&
              !opt.sameScale
                ? opt.imageColumn.maxList[gridIndex]
                : opt.facts.y.max;
          if (opt.imageColumn.repeate) {
            series.symbolOffset = [
              opt.imageColumn.offsetX,
              opt.imageColumn.offsetY,
            ];
            series.symbolMargin = opt.imageColumn.margin;
          }
          series.symbolRepeat = opt.imageColumn.repeate;
          series.columnWidth = function (d) {
            return null;
          };
          if (!isAxis) isLabel = false;
        } else {
          hor = type === "HorizontalBar" || type === "PairedBar";
          series.encode = {
            itemName: 0,
            y: hor ? 0 : 1,
            x: hor ? 1 : 0,
            radius: hor ? 0 : 1,
            angle: hor ? 1 : 0,
          };
          series.type = "bar";

          if (
            opt.ColumnStack === true ||
            type === "PairedBar" ||
            opt.ColumnStack100 === true
          )
            series.stack = "stack" + "_" + gridIndex;
          if (opt.ColumnStack100 === true) series.stack100 = "stack100";

          series.columnWidth = function (d) {
            if (type !== "Marimekko") return null;
            var v = d[2]; // текущее значение факта X
            if (v === undefined) return 0;

            var data =
              opt.timeline === undefined && opt.multi === undefined
                ? opt.data
                : opt.data[gridIndex];
            var total = 0;
            // переделать indexes !!!
            for (var j = 0; j < data.length; j++) {
              for (var i = 0; i < data[j].length; i++) {
                var value = data[j][i][2];
                if (value === undefined) continue;
                total += value;
              }
            }
            return (v * 100) / total + "%";
          };
          if (type === "Marimekko") series.mekko = true;

          if (opt.coordinateSystem === "polar") {
            if (ndx === 0) {
              if (hor) {
                option.radiusAxis.push(
                  axis(
                    series,
                    seria.categoryName,
                    "category",
                    undefined,
                    "x",
                    gridIndex,
                    ndx
                  )
                );
                option.angleAxis.push(
                  axis(series, name, "value", opt.facts.y, "y", gridIndex, ndx)
                );
                option.angleAxis[0].boundaryGap = ["0%", "25%"];
              } else {
                option.angleAxis.push(
                  axis(
                    series,
                    seria.categoryName,
                    "category",
                    undefined,
                    "x",
                    gridIndex,
                    ndx
                  )
                );
                option.radiusAxis.push(
                  axis(series, name, "value", opt.facts.y, "y", gridIndex, ndx)
                );
              }
            }
          } else axisNeeded = true;
          series.barWidth = opt.barWidth + "%";
          series.barGap = 0;
        }
        break;
      case "Area":
      case "CurvedArea":
        series.type = "line";
        series.encode = { itemName: 0, y: 1, x: 0, radius: 1, angle: 0 };
        // свойства линии
        series.lineStyle = {
          normal: {
            width: seria.line.width,
            type: seria.line.type,
          },
        };
        // свойства узлов
        series.symbolSize = seria.anchor.show ? seria.anchor.size : 0; // размер узла
        series.symbol = seria.anchor.show ? seria.anchor.type : "none"; // тип узла

        if (seria.anchor.show) {
          series.itemStyle.normal.borderColor = seria.anchor.borderColor; // контур узла
          series.itemStyle.normal.borderWidth = seria.anchor.borderWidth; // ширина контура
          series.symbolColor =
            seria.anchor.color !== "transparent" ? seria.anchor.color : null; // цвет фона узла
        }
        if (opt.AreaStack === true) series.stack = "stack" + "_" + gridIndex;
        else if (seria.AreaBand === true)
          series.stack = "band" + ndx + "_" + gridIndex;
        series.smooth = type === "CurvedArea";
        if (seria.AreaBand === undefined || isAxis == false)
          series.areaStyle = { opacity: 0.7 };
        axisNeeded = isAxis;
        break;
      case "Pie":
        series.type = "pie";
        series.encode = { itemName: [0], value: [1] };
        series.selectedMode = opt.pie.selectedMode;
        series.selectedOffset = opt.pie.selectedOffset;
        series.roseType = false; // 'radius', 'area', false
        series.radius = opt.pie.pieSizes;
        series.startAngle = opt.pie.pieStartAngle;
        //  series.avoidLabelOverlap = true ; // временно
        series.avoidLabelOverlap = false;
        break;
      case "Card":
        series.type = "kpi";
        series.encode = { itemName: [0], value: [1] };
        series.selectedMode = false;

        isLabel = false;
        if (opt.card.borderColor !== undefined) {
          series.itemStyle.normal.borderColor = opt.card.borderColor;
          series.itemStyle.normal.borderWidth = opt.card.borderWidth;
        }
        series.marginLeft = opt.card.marginLeft;
        series.marginRight = opt.card.marginRight;
        series.marginTop = opt.card.marginTop;
        series.marginBottom = opt.card.marginBottom;
        series.margin = opt.card.margin;
        // insert
        series.itemStyle.normal.color = linearGradient(opt.card.background);
        // insert
        //  shadowBlur ... ,
        // shadowColor ... ,
        //  shadowOffsetX: 0 ,
        //  shadowOffsetY: 0 ,
        //  opacity ...

        series.label = {
          normal: {
            show: true,
          }, //,
          // emphasis: {
          //     textStyle: {
          //         fontSize: 20
          //     }
          //  }
        };
        series.label.normal.formatter = function (v) {
          return labelFormatter(opt, "kpi", opt.labels, v);
        };
        series.label.normal.rich = kpiLabelsRich(opt, opt.labels);
        // if (opt.labels.factHeader !== undefined ) {
        //    series.label.normal.rich.factHeader = {} ;
        //    fillText(series.label.normal.rich.factHeader, opt.labels.factHeader) ;
        // }
        if (opt.labels.factValue !== undefined) {
          series.label.normal.rich.factValue = {};
          fillText(series.label.normal.rich.factValue, opt.labels.factValue);
        }
        for (var i = 0; i < opt.labels.indName.length; i++) {
          //  var name = opt.labels.indName + i ;
          series.label.normal.rich.indName = {};
          fillText(series.label.normal.rich.indName, opt.labels.indName[i]);
        }
        break;
      case "Scatter":
      case "Bubble":
      case "BubbleColumn":
      case "BubbleBar":
        series.type = "scatter";
        itemStyle.normal.opacity = 1;
        axisNeeded = true;
        hor = type === "BubbleColumn";
        //            series.singleAxisIndex = ndx ;
        //            series.coordinateSystem = 'singleAxis' ;
        var index = 0;
        if (opt.facts.x == null) {
          series.encode = { itemName: 0 };
          index = 1;
        } else {
          series.encode = {};
          series.encode.x = opt.facts.x.id + index;
        }
        if (opt.facts.y) series.encode.y = opt.facts.y.id + index;
        if (opt.facts.size) series.encode.size = opt.facts.size.id + index;
        if (type == "BubbleBar") series.encode.y = series.encode.size + 1;
        else if (type == "BubbleColumn")
          series.encode.x = series.encode.size + 1;

        if (opt.coordinateSystem == "polar") {
          series.encode.radius = 1;
          series.encode.angle = 0;
        }
        series.itemStyle.normal.opacity = 1;

        // свойства узлов

        if (type === "Scatter" && seria.anchor.show) {
          series.itemStyle.normal.borderColor = seria.anchor.borderColor; // контур узла
          series.itemStyle.normal.borderWidth = seria.anchor.borderWidth; // ширина контура
          series.symbolColor =
            seria.anchor.color !== "transparent" ? seria.anchor.color : null; // цвет фона узла
        }

        (series.symbolSize = function (d, p) {
          if (type === "Scatter") {
            return seria.anchor.show ? seria.anchor.size : 0; // размер узла
          } else if (opt.isOnlyFact) {
            var size = Math.min(
              chartWidth / opt.colCount,
              chartHeight / opt.rowCount
            );
            return (size * opt.bubble.max + size * opt.bubble.min) / 2;
          }
          var v = d[series.encode.size]; // текущее значение факта-размера
          if (v === undefined) return 0;

          if (type === "BubbleBar" || type === "BubbleColumn") {
            var zmin = opt.bubble.min; // размер наменьшего пузыря в процентах от экрана (из стилей)
            var count = 0;
            var h = opt.subtitle.show
              ? chartHeight - strSize("A", opt.subtitle.size)
              : chartHeight;
            var data =
              opt.timeline === undefined && opt.multi === undefined
                ? opt.data
                : opt.data[gridIndex];
            var min = opt.sameScale ? opt.facts.size.min : null;
            var max = opt.sameScale ? opt.facts.size.max : null;
            // переделать indexes !!!
            for (var i = 0; i < data[0].length; i++) {
              var value = data[0][i][series.encode.size];
              if (value === undefined) continue;
              if (!opt.sameScale) {
                min = min === null ? value : Math.min(min, value);
                max = max === null ? value : Math.max(max, value);
              }
              count += 1;
            }
            var w =
              type === "BubbleBar"
                ? Math.min(
                    chartWidth / opt.colCount / count,
                    (h * 0.8) / opt.rowCount
                  )
                : Math.min(h / opt.rowCount / count, chartWidth / opt.colCount);
            pmin = w * zmin; // размер наменьшего пузыря в пикселях
            size = pmin + ((v - min) * (w - pmin)) / (max - min);
            return size;
            /* var w = 100 / count ; // переделать на проценты
                     var pmin = w * zmin ; // размер наменьшего пузыря в процентах
                     size = pmin + (v - opt.facts.size.min) * (w - pmin) / (opt.facts.size.max - opt.facts.size.min) ;
                     return size + '%' ;  */
          }

          return bubbleSize(v);
        }),
          (series.symbol =
            type === "Scatter"
              ? seria.anchor.show
                ? seria.anchor.type
                : "none"
              : "circle"); // тип узла
        break;
      case "Pyramid":
        series.type = "funnel";
        series.top = 0;
        series.bottom = 0;
        series.minSize = "0%";
        series.maxSize = opt.pyramid.size + "%";
        series.encode = { itemName: [0], seriesName: [0], value: [1] };
        series.sort = opt.pyramid.sort; // пирамида или воронка
        series.gap = opt.pyramid.sliced ? 5 : 0; // отдельные слои
        break;
      case "Sunburst":
        series.type = "sunburst";
        series.radius = opt.pieSizes;
        series.labelRects = [];
        series.levels = [];
        var level0 = {
          itemStyle: {
            color: "gray",
          },
        };
        var levelMid = {
          label: {
            show: false,
          },
        };
        var levelLast = {
          label: {
            show: opt.isLabel,
            // minAngle : 2,
            // distance : 8,
            //  position: 'outside',
            //maximus                    textBorderColor : 'white',
            //maximus                    textBorderWidth : 2,
            //   color: '#687284',
            //   fontSize: 12,
          },
        };
        series.levels.push(level0);
        for (var i = 0; i < opt.levels - 1; i++) series.levels.push(levelMid);
        series.levels.push(levelLast);
        break;
      case "Treemap":
        series.type = "treemap";
        series.left = 0;
        series.top = 0;
        series.right = 0;
        series.bottom = 0;
        series.roam = false;
        series.zoomToNodeRatio = 1; // растягивать выбранный на весь экран
        series.leafDepth = seria.levelsCount; // количество уровней
        series.drillDownIcon = "➧";
        series.colorAlpha = [0.5, 0.3];
        series.visibleMin = 300; // минимальная площадь узла для отображения
        if (seria.levels !== undefined) {
          var levels = [];
          var level = {};
          level = {
            itemStyle: {
              normal: {
                borderColor: "#fff",
                borderWidth: 0,
                gapWidth: 1,
              },
            },
            upperLabel: {
              normal: {
                show: false,
              },
            },
          };
          levels.push(level);
          for (var i = 0; i < seria.levelsCount; i++) {
            var index = Math.min(i, seria.levels.length - 1);
            level = {
              itemStyle: {
                normal: {
                  borderColor: seria.levels[index].borderColor,
                  borderWidth: seria.levels[index].borderWidth,
                  gapWidth: 1,
                },
              },
              upperLabel: {
                normal: {
                  show: seria.levels[index].show,
                  height: 30,
                  color: seria.levels[index].color,
                  fontStyle: seria.levels[index].style,
                  fontWeight: seria.levels[index].weight,
                  fontSize: seria.levels[index].size,
                  position: seria.levels[index].position,
                },
                emphasis: {
                  show: seria.levels[index].show,
                  position: seria.levels[index].position,
                  fontSize: seria.levels[index].size + 2,
                },
              },
            };
            if (seria.levels[index].background !== undefined)
              level.upperLabel.normal.backgroundColor = linearGradient(
                seria.levels[index].background
              );
            levels.push(level);
          }
          series.levels = levels;
        }
        break;
      case "TagCloud":
        series.type = "wordCloud";
        series.sizeRange = opt.tagCloud.sizeFont;

        series.shape = opt.tagCloud.shape;
        series.rotationRange = opt.tagCloud.rotationRange;
        series.rotationStep = opt.tagCloud.rotationStep;
        series.width = opt.tagCloud.width;
        series.height = opt.tagCloud.height;
        series.autoSize = {
          enable: true,
          minSize: 14,
        };
        // var maskImage = new Image() ;
        // maskImage.src = opt.tagCloud.image ;
        // series.maskImage = maskImage ;

        series.textStyle = {
          normal: {
            //  fontFamily: opt.labels.labelFont,
            fontWeight: opt.labels.labelWeight,
            fontStyle: opt.labels.labelStyle,
            fontSize: opt.labels.size,
          },
          emphasis: {
            shadowBlur: 10,
            shadowColor: "#333",
            color: "red",
          },
        };
        isLabel = false;
        break;
      case "Gauge":
        series.type = "gauge";
        isLabel = false;
        var rowCount = opt.gauge.sizes[0];
        var colCount = opt.gauge.sizes[1];

        var row = Math.floor(ndx / colCount);
        var col = ndx - colCount * row;

        if (opt.gauge.gaugeSize === -1) {
          // масштабируемый размер
          var stepx = 100 / colCount;
          var stepy = 100 / rowCount;
          series.radius = 100 / Math.max(rowCount, colCount) + "%";

          series.center = [
            col * stepx + stepx / 2 + "%",
            row * stepy + stepy / 2 + "%",
          ];
          //series.center.push((col * stepx + stepx / 2) + '%') ;
          // series.center.push((row * stepy + stepy / 2) + '%') ;
        } else {
          // заданный размер
          series.radius = opt.gauge.gaugeSize / 2 - opt.gauge.margin;
          var deltax = (chartWidth - colCount * opt.gauge.gaugeSize) / 2;
          var deltay = (chartHeight - rowCount * opt.gauge.gaugeSize) / 2;
          series.center = [];
          series.center.push(
            deltax +
              opt.gauge.margin +
              col * opt.gauge.gaugeSize +
              series.radius
          );
          series.center.push(
            deltay +
              opt.gauge.margin +
              row * opt.gauge.gaugeSize +
              series.radius
          );
        }
        var mindex = ndx;
        if (opt.gauge.maxMin !== undefined)
          mindex = Math.min(ndx, opt.gauge.maxMin.length - 1);
        series.min =
          opt.gauge.maxMin !== undefined
            ? opt.gauge.maxMin[mindex][0]
            : opt.facts.y.min;
        series.max =
          opt.gauge.maxMin !== undefined
            ? opt.gauge.maxMin[mindex][1]
            : opt.facts.y.max;
        series.startAngle = opt.gauge.type === "half" ? 180 : 225; // полукруглый
        series.endAngle = opt.gauge.type === "half" ? 0 : -45;
        if (opt.gauge.type === "half")
          series.detail = { show: true, offsetCenter: [0, "20%"] };

        series.splitNumber = opt.gauge.splitNumber1; // большие отметки

        series.axisTick = {
          // промежуточные отметки
          splitNumber: opt.gauge.splitNumber2,
          length: 24,
          lineStyle: {
            color: "auto",
          },
        };

        // Цветовая шкала
        var colors = [];
        var gcolors =
          opt.gauge.colors.length === 1
            ? opt.gauge.colors[0]
            : opt.gauge.colors[ndx];

        for (var i = 0; i < gcolors.length; i++) {
          var ar = [];
          ar.push(gcolors[i][0]); // значение
          ar.push(simpleLinearGradient(gcolors[i][1], gcolors[i][2])); // градиент
          colors.push(ar);
        }
        var axisLine = {
          lineStyle: {
            width: 20,
            type: "solid",
            shadowColor: "rgba(0,0,0,0.5)",
            shadowBlur: 10,
            shadowOffsetY: 10,
            color: colors,
          },
        };
        series.axisLine = axisLine;
        // Стрелка
        series.itemStyle = {
          color: linearGradient(opt.gauge.arrow),
          borderColor: "#000",
          shadowColor: "rgba(0, 0, 0, 0.5)",
          shadowBlur: 10,
        };
        // Метки на оси
        series.axisLabel = {
          show: opt.axis.labels.show,
          fontStyle: opt.axis.labels.style,
          fontWeight: opt.axis.labels.weight,
          fontSize: opt.axis.labels.size,
          color: opt.axis.labels.color,
          formatter: function (value, index) {
            var format = opt.facts.y.format;
            return valueFormatter(value, format);
          },
        };
        series.detail = {
          formatter: function (value, index) {
            var format = opt.facts.y.format;
            return valueFormatter(value, format);
          },
        };
        if (opt.labels.fact !== undefined) {
          series.detail.show = true;
          series.detail.fontStyle = opt.labels.fact.style;
          series.detail.fontWeight = opt.labels.fact.weight;
          fontSize = opt.labels.fact.size;
          series.detail.color = opt.labels.fact.color;
        }
        break;
      case "HeatMap":
        series.type = "heatmap";
        var axisX = axis(
          null,
          name,
          "category",
          undefined,
          "x",
          opt.seriesNamesX,
          gridIndex,
          ndx
        );
        axisX.data = opt.seriesNamesX;
        option.xAxis.push(axisX);
        var axisY = axis(
          null,
          firstSeries().categoryNameY,
          "category",
          undefined,
          "y",
          opt.seriesNamesY,
          gridIndex,
          ndx
        );
        axisY.data = opt.seriesNamesY;
        option.yAxis.push(axisY);
        series.xAxisIndex = gridIndex;
        series.yAxisIndex = gridIndex;

        option.visualMap = fillLegend(opt, opt.legend.showVisualMap);

        option.visualMap.min = opt.facts.y.min;
        option.visualMap.max = opt.facts.y.max;
        option.visualMap.calculable = true;
        option.visualMap.realtime = false;
        option.visualMap.inRange = {
          color: opt.colors,
        };

        break;
      case "Sankey":
        series.type = "sankey";
        series.orient = opt.sankey.orient;
        series.nodeGap = opt.sankey.nodeGap;
        series.nodeWidth = opt.sankey.nodeWidth;
        series.left = opt.sankey.left + "%";
        series.right = opt.sankey.right + "%";
        series.top = opt.sankey.top + "%";
        series.bottom = opt.sankey.bottom + "%";
        series.label = { distance: 5 };
        series.label.formatter = function (v) {
          return sankeyLabel(v.name);
        };
        //   isLabel = true ;
        break;
      case "Candle":
        series.type = "boxplot";
        axisNeeded = true;
        isLabel = false;
        break;
    }
    if (opt.visualMap !== undefined) {
      option.visualMap = {};
      option.visualMap.orient = "horizontal";
      option.visualMap.left = "center";
      option.visualMap.type = "piecewise";
      option.visualMap.pieces = opt.visualMap;
    }
    // оси
    if (axisNeeded) {
      if (ndx === 0) {
        if (opt.coordinateSystem === "polar") {
          option.angleAxis.push(
            axis(series, name, "category", undefined, "x", gridIndex, ndx)
          );
          option.radiusAxis.push(
            axis(series, name, "value", opt.facts.y, "y", gridIndex, ndx)
          );
        } else {
          //  if (opt.facts.x === undefined /*&& opt.separateAxis === false*/)
          //   name = seria.categoryName ;
          if (hor) {
            option.xAxis.push(
              axis(series, name, "value", opt.facts.y, "x", gridIndex, ndx)
            );
            option.yAxis.push(
              axis(
                series,
                seria.categoryName,
                "category",
                undefined,
                "y",
                gridIndex,
                ndx
              )
            );
            baseAxisIndex = option.xAxis.length - 1;
          } else {
            if (series.type === "boxplot")
              option.xAxis.push(
                axis(
                  series,
                  seria.categoryName,
                  "category",
                  undefined,
                  "x",
                  gridIndex,
                  ndx
                )
              );
            // name?
            else
              option.xAxis.push(
                axis(
                  series,
                  seria.categoryName,
                  opt.facts.x === undefined ? "category" : "value",
                  opt.facts.x,
                  "x",
                  gridIndex,
                  ndx
                )
              );
            option.yAxis.push(
              axis(series, name, "value", opt.facts.y, "y", gridIndex, ndx)
            );
            baseAxisIndex = option.yAxis.length - 1;
          }
        }
      } else if (seria.factAxis !== undefined) {
        // отдельная ось по факту
        if (hor)
          option.xAxis.push(
            axis(series, name, "value", seria.factAxis, "x", gridIndex, ndx)
          );
        else
          option.yAxis.push(
            axis(series, name, "value", seria.factAxis, "y", gridIndex, ndx)
          );
      }
      if (hor) {
        if (opt.coordinateSystem === "cartesian2d") {
          series.yAxisIndex = option.yAxis.length - 1;
          series.xAxisIndex =
            seria.factAxis !== undefined
              ? option.xAxis.length - 1
              : baseAxisIndex;
        } else {
          // дописать для polar мульти измерения
          // series.yAxisIndex = option.yAxis.length - 1 ;
          //  series.xAxisIndex = seria.factAxis !== undefined  ? option.xAxis.length - 1  : baseAxisIndex ;
        }
      } else {
        if (opt.coordinateSystem === "cartesian2d") {
          series.xAxisIndex = option.xAxis.length - 1;
          series.yAxisIndex =
            seria.factAxis !== undefined
              ? option.yAxis.length - 1
              : baseAxisIndex;
        } else {
          // дописать для polar мульти измерения
        }
      }
    }
    if (
      opt.separateAxis === true &&
      option.yAxis.length > 0 &&
      option.yAxis[0].type === "value" &&
      ndx < opt.separateAxisCount
    ) {
      if (ndx !== 0) {
        option.yAxis.push(
          axis(series, name, "value", opt.facts.y, "y", gridIndex, ndx)
        );
        series.yAxisIndex = option.yAxis.length - 1;
      }
      if (opt.series.length > 1)
        option.yAxis[series.yAxisIndex].position = "left";

      if (!option.yAxis[series.yAxisIndex].hide) {
        if (seria.color !== undefined)
          option.yAxis[series.yAxisIndex].axisLine.lineStyle.color =
            seria.color;
        else if (option.colors !== undefined)
          option.yAxis[series.yAxisIndex].axisLine.lineStyle.color =
            option.colors[ndx % option.colors.length];
        if (name !== undefined && name.length > 0)
          option.yAxis[series.yAxisIndex].name = name;
      }
    }
    // target line и target zone
    // insert
    if (option.yAxis.length !== 0 || option.xAxis.length !== 0) {
      targetLine(
        series.markLine.data,
        opt.facts.y,
        opt.facts.x,
        seria.targets === undefined ? null : seria.targets
      );
      targetArea(
        series.markArea.data,
        opt.facts.y,
        opt.facts.x,
        seria.targets === undefined ? null : seria.targets
      );
    }
    // insert
    if (isLabel)
      // свойства меток
      series.label = seriesLabelByType(name, type, gridIndex, ndx);

    return series;
  } // end seriesByType

  if (opt.coordinateSystem === "polar") {
    option.polar = {};
  }
  if (opt.colors !== undefined) {
    option.color = seriesColors(opt, opt.colors);
  }

  option.graphic = [];
  if (opt.background.image !== undefined)
    // картинка-фон
    option.graphic.push(
      image(opt, chartWidth, chartHeight, opt.background.image, 0, 0)
    );
  //if (opt.watermarkImage !== undefined ) // водяной знак
  //   option.graphic.push(image(opt, chartWidth, chartHeight, opt.watermarkImage, 1, option.graphic.length)) ;

  if (opt.subtitle.text !== undefined) {
    option.title.subtext = opt.subtitle.text;
    option.title.subtextStyle = {
      color: opt.subtitle.color,
      fontSize: opt.subtitle.size,
      fontStyle: opt.subtitle.style,
      fontWeight: opt.subtitle.weight,
    };
  }
  if (opt.legend.show) {
    option.legend.type = opt.legend.type;
    // размер маркера легенды в зависимости от размера шрифта
    var ht = strSize("AA", opt.legend.size);
    option.legend.itemHeight = ht;
    option.legend.itemWidth = (ht * 25) / 14;

    if (opt.legend.reverse) option.legend.data = [];
  }

  var itemStyle = { normal: {} };
  var gridIndex = 0;
  var type = firstType();

  if (opt.coordinateSystem === "tree") {
    var series = seriesByType(
      firstSeries(),
      "",
      type,
      0,
      itemStyle,
      gridIndex,
      true
    );
    series.data = opt.data;
    option.series.push(series);
  } else if (opt.coordinateSystem === "sankey") {
    if (opt.colors === undefined)
      itemStyle.normal.color = seriesColor(
        firstSeries().color,
        firstSeries().gradientType,
        firstSeries().fillGradient,
        opt.coordinateSystem === "tree"
      );
    if (firstSeries().border !== undefined) {
      itemStyle.normal.borderColor = firstSeries().border.color;
      itemStyle.normal.borderWidth = firstSeries().border.width;
      itemStyle.normal.borderType = firstSeries().border.type;
    }
    var series = seriesByType(
      null,
      "sankey",
      type,
      0,
      itemStyle,
      gridIndex,
      true
    );
    series.data = opt.data;
    series.links = opt.links;

    option.series.push(series);
  } else if (type === "Gauge") {
    // отдельная серия на каждое значение
    var data = opt.data[0];
    opt.gauge.sizes = optimalRowsColsCount(
      chartWidth,
      chartHeight,
      data.length
    );
    for (var i = 0; i < data.length; i++) {
      var series = seriesByType(
        firstSeries(),
        firstSeries().name,
        type,
        i,
        itemStyle,
        gridIndex,
        true
      );
      series.data = [{ value: data[i][1], name: data[i][0] }];
      option.series.push(series);
    }
  } else if (
    type === "TagCloud" ||
    type === "Pyramid" ||
    type === "Pie" ||
    type === "Card" ||
    (opt.isOnlyFact && !opt.pictorial) /* || opt.separateColors*/
  ) {
    // всегда одна серия
    if (opt.colors === undefined)
      itemStyle.normal.color = seriesColor(
        firstSeries().color,
        firstSeries().gradientType,
        firstSeries().fillGradient,
        opt.coordinateSystem === "tree"
      );
    if (firstSeries().border !== undefined) {
      itemStyle.normal.borderColor = firstSeries().border.color;
      itemStyle.normal.borderWidth = firstSeries().border.width;
      itemStyle.normal.borderType = firstSeries().border.type;
    }
    var data = opt.data[0];
    var seriesName = opt.isOnlyFact ? "Facts" : firstSeries().name;
    var series = seriesByType(
      firstSeries(),
      seriesName,
      firstSeries().type,
      0,
      itemStyle,
      gridIndex,
      true
    );
    series.data = [];
    for (var i = 0; i < data.length; i++) {
      if (type === "TagCloud")
        series.data.push({
          value: data[i][1],
          name: data[i][0],
          textStyle: {
            normal: {
              color: opt.colors[i],
            },
          },
        });
      //  else if (type === 'BubbleBar' || type === 'BubbleColumn')
      //     series.data.push([ data[i][1], name: data[i][0]}) ;
      else if (
        type === "Pyramid" ||
        type === "Pie" ||
        type === "Card" ||
        opt.isOnlyFact
      )
        series.data.push({ value: data[i][1], name: data[i][0] });
      /*  else if (type === 'Bubble' || type === 'Marimekko')
            series.data.push({ value: [data[i][1], data[i][2]], name: data[i][0], 
                itemStyle: {
                    color: opt.colors[i]
                }}) ;
        else
            series.data.push({ value: data[i][1], name: data[i][0], 
                itemStyle: {
                        color: opt.colors[i]
                   }}) ;*/
    }
    option.series.push(series);
  } else {
    var gridCount = opt.multi === undefined ? 1 : opt.multi.length;

    for (var gridIndex = 0; gridIndex < gridCount; gridIndex++) {
      if (opt.timeline !== undefined) gridIndex = opt.maxSeriesIndex;
      var ndx = 0;
      var data =
        opt.timeline === undefined && opt.multi === undefined
          ? opt.data
          : opt.data[gridIndex];

      if (type === "HeatMap") {
        var data1 = heatMapData(data, gridIndex);
        var series = seriesByType(
          firstSeries(),
          firstSeries().categoryName,
          type,
          ndx,
          itemStyle,
          gridIndex,
          true
        );
        series.data = data1;
        option.series.push(series);
        continue;
      }
      opt.series[gridIndex].forEach(function (seria) {
        // цикл по сериям
        if (seria.type === "PairedBar" && ndx > 1) {
          ++ndx;
          return;
        } else if (opt.pictorial && ndx > 0) {
          ++ndx;
          return;
        }

        var itemStyle;

        if (type === "Candle")
          itemStyle = {
            borderColor: opt.series.length === 1 ? "black" : seria.color,
          };
        else {
          itemStyle = {
            normal: {
              color: opt.separateColors
                ? null
                : seria.type === "Area" || seria.type === "CurvedArea"
                ? seria.color
                : seriesColor(
                    seria.color,
                    seria.gradientType,
                    seria.fillGradient,
                    opt.coordinateSystem === "tree"
                  ),
            },
          };
          if (seria.type === "Area" || seria.type === "CurvedArea")
            itemStyle.normal.areaStyle = {
              color: opt.separateColors
                ? null
                : seriesColor(
                    seria.color,
                    seria.gradientType,
                    seria.fillGradient,
                    opt.coordinateSystem === "tree"
                  ),
            };

          if (seria.border !== undefined) {
            itemStyle.normal.borderColor = seria.border.color;
            itemStyle.normal.borderWidth = seria.border.width;
            itemStyle.normal.borderType = seria.border.type;
          }
        }

        var series = seriesByType(
          seria,
          seria.name,
          seria.type,
          ndx,
          itemStyle,
          gridIndex,
          true
        );

        if (seria.AreaBand === true)
          series.data = getAreaData(data[ndx], "min");
        else series.data = getData(data[ndx], seria, gridIndex);

        if (opt.pictorial && opt.imageColumn && opt.imageColumn.clip) {
          var series2 = seriesByType(
            seria,
            seria.name,
            seria.type,
            ndx,
            itemStyle,
            gridIndex,
            false
          );
          series2.data = pictureData(data[ndx], gridIndex, "max");
          series2.xAxisIndex = series.xAxisIndex;
          series2.yAxisIndex = series.yAxisIndex;
          series2.animationDuration = 0;
          series2.label = {};
          series2.label.show = false;
          var itemStyle2 = { normal: {} };
          itemStyle2.normal.color = opt.imageColumn.background;
          series2.itemStyle = itemStyle2;
          option.series.push(series2);
        }
        option.series.push(series);
        // линия регрессии
        if (opt.regLinesProps !== undefined) {
          var rseries = regressionSeries(opt);
          rseries.xAxisIndex = series.xAxisIndex;
          rseries.yAxisIndex = series.yAxisIndex;
          var rdata = regressionData(opt, series.data);
          rseries.data = rdata.points;
          rseries.markPoint.label.normal.formatter = rdata.expression;
          rseries.markPoint.data = [
            { coord: rdata.points[rdata.points.length - 1] },
          ];
          option.series.push(rseries);
        }
        //regressionLine(series.markLine.data, opt.timeline === underfine ? (opt.multi === underfine ? opt.regLines : opt.regLines[gridIndex]) : opt.regLines[0]) ;

        if (seria.AreaBand === true) {
          var series2 = seriesByType(
            seria,
            seria.name,
            seria.type,
            ndx,
            itemStyle,
            gridIndex,
            false
          );
          series2.data = getAreaData(data[ndx], "max");
          series2.xAxisIndex = series.xAxisIndex;
          series2.yAxisIndex = series.yAxisIndex;
          series2.stack = series.stack;
          option.series.push(series2);

          if (opt.averageLine !== undefined) {
            var series3 = {};
            series3.type = "line";
            series3.smooth = series.smooth === true;
            series3.symbol = "none";
            series3.lineStyle = {
              normal: {
                type: opt.averageLine.type,
                color: opt.averageLine.color,
                width: opt.averageLine.width,
              },
            };
            series3.data = getAreaData(data[ndx], "average");
            series3.xAxisIndex = series.xAxisIndex;
            series3.yAxisIndex = series.yAxisIndex;
            option.series.push(series3);
          }
        } else averageLine(opt, series.markLine.data);
        ++ndx;
      }); // цикл по сериям
    } // цикл по гридам
  }

  if (type === "PairedBar") {
    var fx = opt.facts.y.id + 1;
    if (opt.timeline === undefined && opt.multi === undefined) {
      opt.data[0].forEach(function (j) {
        j[fx] = -j[fx];
      });
    } else {
      opt.data.forEach(function (i) {
        i[0].forEach(function (j) {
          j[fx] = -j[fx];
        });
      });
    }
    option.xAxis[0].max = function (x) {
      return +Math.max(opt.facts.y.min, opt.facts.y.max);
    };
    option.xAxis[0].min = function (x) {
      return -Math.max(opt.facts.y.min, opt.facts.y.max);
    };
    option.xAxis[0].axisLabel.formatter = function (value, index) {
      return echarts.format.addCommas(Math.abs(value));
    };
    option.xAxis[0].axisPointer = { label: { show: false } };

    option.tooltip.trigger = "axis";
    option.tooltip.formatter = function (params) {
      var name = "";
      var values = "";
      for (var i in params) {
        var d = params[i];
        if (opt.tooltips.isName) name = d.name + "<br/>";
        values +=
          d.marker +
          d.seriesName +
          "：" +
          echarts.format.addCommas(Math.abs(d.data[fx])) +
          "<br/>";
      }
      return name + values;
    };
  }
  // подсказки для всех
  if (option.tooltip.formatter === undefined)
    option.tooltip.formatter = function (v) {
      return tooltipFormatter(opt, type, v);
    };

  if (opt.timeline === undefined) {
    for (var i = 0; i < addedAxisX.length; i++)
      option.xAxis.push(addedAxisX[i]);
    for (var i = 0; i < addedAxisY.length; i++)
      option.yAxis.push(addedAxisY[i]);

    // масштабирование данных
    var dataZoomList = [];
    hor = firstType() === "HorizontalBar" || firstType() === "PairedBar";

    for (var i = 0; i < opt.rowCount; i++) {
      dataZoom(opt, firstType(), "y", dataZoomList, i, -1, "slider");
      dataZoom(opt, firstType(), "y", dataZoomList, i, -1, "inside");
    }
    for (var i = 0; i < opt.colCount; i++) {
      dataZoom(opt, firstType(), "x", dataZoomList, -1, i, "slider");
      dataZoom(opt, firstType(), "x", dataZoomList, -1, i, "inside");
    }

    if (dataZoomList.length > 0) option.dataZoom = dataZoomList;
    // insert
    // console.log(option) ;
    // insert
    chart.setOption(option, true);
  } else {
    timeline = {
      axisType: "category",
      show: opt.timelineSettings.show,
      autoPlay: opt.timelineSettings.autoPlay,
      rewind: opt.timelineSettings.rewind,
      playInterval: opt.timelineSettings.playInterval,

      //data: opt.timeline,
      label: {
        color: opt.timelineSettings.label.color,
        fontStyle: opt.timelineSettings.label.style,
        fontWeight: opt.timelineSettings.label.weight,
        fontSize: opt.timelineSettings.label.size,
        backgroundColor: linearGradient(opt.timelineSettings.label.background),
      },
    };
    fillTimeLine(timeline, opt.timelineSettings.pos);
    var tdata = [];
    for (var i = 0; i < opt.timeline.length; i++) {
      tdata.push({
        value: opt.timeline[i],
        tooltip: {
          formatter: "{b}",
        },
      });
    }
    timeline.data = tdata;
    if (
      opt.timelineSettings.line !== undefined ||
      opt.timelineSettings.shadow !== undefined
    ) {
      timeline.lineStyle = {};
      if (opt.timelineSettings.line !== undefined) {
        timeline.lineStyle.show = opt.timelineSettings.line.show;
        timeline.lineStyle.color = opt.timelineSettings.line.color;
        timeline.lineStyle.width = opt.timelineSettings.line.width;
        timeline.lineStyle.type = opt.timelineSettings.line.type;
      }
      if (opt.timelineSettings.shadow !== undefined) {
        timeline.lineStyle.shadowColor =
          opt.timelineSettings.shadow.shadowColor;
        timeline.lineStyle.shadowBlur = opt.timelineSettings.shadow.shadowBlur;
        timeline.lineStyle.shadowOffsetX =
          opt.timelineSettings.shadow.shadowOffsetX;
        timeline.lineStyle.shadowOffsetY =
          opt.timelineSettings.shadow.shadowOffsetY;
      }
    }
    if (opt.timelineSettings.symbol !== undefined) {
      timeline.symbol =
        opt.timelineSettings.symbol.image !== undefined
          ? opt.timelineSettings.symbol.image
          : opt.timelineSettings.symbol.type;
      timeline.symbolSize = opt.timelineSettings.symbol.size;
      timeline.symbolRotate = opt.timelineSettings.symbol.rotate;
    }

    option.timeline = timeline;
    var optionTl = {};
    optionTl.baseOption = option;
    optionTl.options = [];

    if (opt.sameScale && opt.ColumnStack100 === undefined) {
      var h = type === "HorizontalBar" || type === "PairedBar";
      var xfact = h ? opt.facts.y : opt.facts.x;
      var max =
        type === "Candle"
          ? candleMax(opt)
          : opt.maxTotal !== undefined
          ? opt.maxTotal
          : opt.facts.y.max;

      option.xAxis.forEach(function (axis) {
        if (axis.type === "value") {
          if (xfact.min < 0) axis.min = xfact.min;
          axis.max = xfact.max;
        }
      });
      option.yAxis.forEach(function (axis) {
        if (axis.type === "value") {
          if (opt.facts.y.min < 0) axis.min = opt.facts.y.min;
          axis.max = max;
        }
      });
      option.radiusAxis.forEach(function (axis) {
        if (axis.type === "value") {
          if (opt.facts.y.min < 0) axis.min = opt.facts.y.min;
          axis.max = opt.facts.y.max;
        }
      });
      option.angleAxis.forEach(function (axis) {
        if (axis.type === "value") {
          if (opt.facts.y.min < 0) axis.min = opt.facts.y.min;
          axis.max = opt.facts.y.max;
        }
      });
      option.singleAxis.forEach(function (axis) {
        if (axis.type === "value") {
          if (opt.facts.y.min < 0) axis.min = opt.facts.y.min;
          axis.max = opt.facts.y.max;
        }
      });
    }

    var t_ndx = 0;
    opt.timeline.forEach(function (line) {
      // timeline
      var opt_t = {
        title: {
          subtext: line,
          subtextStyle: {
            color: opt.subtitle.color,
            fontSize: opt.subtitle.size,
            fontStyle: opt.subtitle.style,
            fontWeight: opt.subtitle.weight,
          },
        },
        series: [],
      };
      // вставка данных оси категорий, если есть динамическая сортировка
      if (opt.sort) {
        hor =
          type === "HorizontalBar" ||
          type === "PairedBar" ||
          type === "BubbleColumn";
        var axises = hor
          ? optionTl.baseOption.yAxis
          : optionTl.baseOption.xAxis;
        if (axises[0].type === "category") {
          var isLink = { flag: false };

          var adata = axisData(opt, hor ? opt.yAxis : opt.xAxis, isLink, t_ndx);
          if (hor) {
            opt_t.yAxis = [];
            opt_t.yAxis.push({ data: adata });
          } else {
            opt_t.xAxis = [];
            opt_t.xAxis.push({ data: adata });
          }
        }
      }

      var ndx = 0;
      opt.series[t_ndx].forEach(function (seria) {
        if (seria.type === "PairedBar" && ndx > 1) {
          ++ndx;
          return;
        }

        var series = {};
        series.name = seria.name;
        if (seria.type === "HeatMap") {
          if (ndx > 0) {
            ++ndx;
            return;
          }
          series.data = heatMapData(opt.data[t_ndx]);
        } else if (opt.coordinateSystem === "tree") {
          series.data = opt.data[t_ndx];
          if (seria.type === "Treemap") {
            option.grid.bottom = "10%";
            option.timeline.bottom = "3%";
          }
        } else {
          if (seria.AreaBand === true)
            series.data = getAreaData(opt.data[t_ndx][ndx], "min");
          else series.data = getData(opt.data[t_ndx][ndx], seria, t_ndx);
          series.markLine = { symbol: "none" };
          series.markLine.data = [];
        }
        if (opt.pictorial && opt.imageColumn.clip) {
          var series2 = {};
          series2.data = pictureData(opt.data[t_ndx][ndx], t_ndx, "max");
          series2.label = {};
          series2.label.show = false;
          var itemStyle2 = { normal: {} };
          itemStyle2.normal.color = opt.imageColumn.background;
          series2.itemStyle = itemStyle2;
          opt_t.series.push(series2);
        }
        opt_t.series.push(series);
        if (seria.AreaBand === true) {
          var series2 = {};
          series2.data = getAreaData(opt.data[t_ndx][ndx], "max");
          opt_t.series.push(series2);
        }
        // линия регрессии
        if (opt.regLinesProps !== undefined) {
          var rseries = {};
          var rdata = regressionData(opt, opt.data[t_ndx][ndx]);
          rseries.data = rdata.points;
          rseries.markPoint = {
            label: {
              normal: {
                formatter: rdata.expression,
              },
            },
            data: [
              {
                coord: rdata.points[rdata.points.length - 1],
              },
            ],
          };

          opt_t.series.push(rseries);
        }
        ++ndx;
      });
      while (opt_t.series.length < opt.maxSeriesCount) {
        var series = {};
        series.name = "";
        series.data = null;
        opt_t.series.push(series);
      }
      optionTl.options.push(opt_t);
      ++t_ndx;
    });
    chart.setOption(optionTl, true);
  }
  return chart;
}

function contourChart(div_name, opt, object) {
  if (opt.ChartType == "map") {
    switch (opt.MapType) {
      case "Russia":
        return contourD3Russia(div_name, opt, object);
      case "World":
        return contourD3World(div_name, opt, object);
      case "Globe":
        return contourD3Globe(div_name, opt, object);
      default:
        break;
    }
  } else return contourEChart(div_name, opt, object);
}
