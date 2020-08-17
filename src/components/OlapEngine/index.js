class GroupHeader {
    constructor(json) {
        this._groupset_offset = json.g; // Offset to beginning of sequence of groups belonging to a group given
        // The number of items (subgroups or leafs) belonging to a group can be
        // determined as nextGroup.groupset_offset - thisGroup.groupset_offset
        this._index_offset = json.i;
        this.weight = json.v;
    }

    grp_offs() { return Math.abs(this._groupset_offset) - 1; }
    index_offs() { return this._index_offset; }

    // set_grp_offs(offs) { this._groupset_offset = offs + 1 ; }

    // true if this GroupHeader refers to a fact (i.e. to a hypercube row, not to another group)
    is_leaf() { return this._groupset_offset < 0; }
};

class Dimension {
    constructor(json) {
        this.number = json.num;
        this.is_index = json.index;
        this.group_data = [];
        for (var d in json.data) this.group_data.push(new GroupHeader(json.data[d]));
    }
    groups() { return this.group_data; }
    group_begin(group_ndx) { return this.groups()[group_ndx].grp_offs(); }
    weight(group_ndx) { return this.groups()[group_ndx].weight; }
    size() { return this.groups().length - 1; }
}

class Permutation {
    constructor(json) {
        json = json || {} ;
        this._permutation = json.permutation || []; // [Dimension1.number, Dimension2.number, ...]
        this._dimgroups   = json.dimgroups   || []; // [GroupCount_Level1, GroupCount_Level2, GroupCount_Level3, ...]
        this._dimensions  = [];                     // [Dimension, ...]
        for (var d in json.dimensions) { this._dimensions.push(new Dimension(json.dimensions[d])); };
        this._dimgroups_cumulative = [0, 1];
        for (var i = 0; i < this._dimgroups.length; i++) { this._dimgroups_cumulative[i + 2] = this._dimgroups_cumulative[i + 1] + this._dimgroups[i]; };
    }
    root() { return new Group(this, -1, 0); }
    size() { return this._permutation.length; }

    // level -  dimension level (-1..size()-1)
    dimension(level) { return this._dimensions[level + 1]; }
    dimension_num(level) { return this._permutation[level]; }

    group(g) { return new Group(this, g.l, g.i); }
    weight(g) { return this.dimension(g.l).weight(g.i); }
    dimension_value(g) {
      if (!this.dimension(g.l))
        console.log("BUG HERE!!!") ;
      return this.dims_val[this.dimension(g.l).number].values[this.weight(g)];
    }
}

class Group {
    constructor(permutation, level, num) {
        this.permutation = permutation;
        this.level = level;
        this.num = num;
    }
    dimension(up) { return this.permutation.dimension(this.level + up); }
    dimension_num() { return this.dimension(0).number; }

    index() { return this.num; }

    begin_index() { return this.dimension(0).group_begin(this.index()); }
    sub_index(num) { return this.begin_index() + num; }

    weight() { return this.permutation.dimension(this.level).weight(this.index()); }

    // xz1() { return this.permutation.dimension(this.level).groups()[this.num].index_offs(); }
    // xz2() { return this.permutation.dimension(this.level).groups()[this.num].grp_offs(); }

    size() {
        var group = this.dimension(0).groups()[this.num];
        var start_offset = group.grp_offs();
        return !group.is_leaf() ? this.dimension(0).groups()[this.num + 1].grp_offs() - start_offset : this.dimension(1).group()[start_offset].grp_offs();
    }
}

class Axis {
    constructor(permutation, width) {
        this.permutation = permutation;
        this._maxlevel = -1;
        this._width = width;
        this._size = -1;
        this._axis = [];
        this._collapse_status = [];

        this.isTree = true;
        this.isAllowCollapse = true;
    }
    size()  { return this._size; }
    width() { return this._width; }
    root()  { return this.permutation.root(); }
    currentWidth() { return this._maxlevel ; }

    childValuesForGroup(group, positionY, r, isCol) {
      var skipChild = group.level + 1 >= this.width() - 1 ;
      var size   = group.size();
      var begin = 0 ;
      var inc   = 1 ;
      while (size--) {
          var childGroup = new Group(group.permutation, group.level + 1, group.sub_index(begin));
          begin += inc;

          if (!skipChild)
            this.childValuesForGroup(childGroup, positionY, r, isCol) ;
          else {
            var p = { l: childGroup.level, i: childGroup.index() } ;
            var num   =  isCol ? this.permutation._values[positionY][this.position_level_index(p.l, p.i)] :
                                 this.permutation._values[this.position_level_index(p.l, p.i)][positionY] ;
            r.v.push(num) ;
            var label = this.permutation.dimension_value(p);
            r.l.push(label) ;
          }
      }
    }

    childValues(x, positionY, isCol) {   
      var g = x ;
      var l = g.l ;

      var group = l === -1 ? this.root() : new Group(this.permutation, l, this.isTree ? g.i : g.i[l]) ;
      var r = { l: [], v: [] };
      if (group.level < this.width() - 1)
        this.childValuesForGroup(group, positionY, r, isCol) ;
          
      return r;
    }

    childPositionsForGroup(group, r, level) {
      var skipChild = group.level + 1 >= level ;
      var size   = group.size();
      var begin = 0 ;
      var inc   = 1 ;
      while (size--) {
          var childGroup = new Group(group.permutation, group.level + 1, group.sub_index(begin));
          begin += inc;

          if (!skipChild)
            this.childPositionsForGroup(childGroup, r, level) ;
          else {
            var p = { l: childGroup.level, i: childGroup.index() } ;      
            r.push(this.position_level_index(p.l, p.i)) ;
          }
      }
    }
    
    childPositions(x) {   
      var g = x ;
      var l = g.l - 1 ;
      if (l === -2)
        return [0] ;

      var group = this.root() ;//l == -1 ? this.root() : new Group(this.permutation, l, g.i[l]) ;
      var r = [];
      if (group.level < this.width() - 1)
        this.childPositionsForGroup(group, r, g.l) ;
          
      return r;
    }
    
    position_level_index(level, index) { return this.permutation._dimgroups_cumulative[level + 1] + index; }

    position(g) {
        if (g.l === -1)
            return 0 ;
        var i = this.isTree ? g.i : g.i[g.i.length - 1] ;
        return this.permutation._dimgroups_cumulative[g.l + 1] + i;
    }
    
    dim_number(level) {
        return this.permutation.dimension(level).number ;
    }

    isCollapsed(level, index) {
        if (this.isAllowCollapse === false)
            return false ;
        
        var f = this._collapse_status[level + 1];
        return f ? f[index] : true;
    }
    
    group(g) {
        return new Group(this.permutation, g.l, g.i) ;  
    }

    setCollapsed(level, index, is) {
        if (!this._collapse_status[level + 1]) {
            this._collapse_status[level + 1] = new Array(this.isFilters ? Object.keys(this.permutation.dims_names).length + 1 : this.permutation.dimension(level).size()).fill(true);;
        }
        this._collapse_status[level + 1][index] = is;
    }

    setCollapsedLevel(level, is) {
        if (!this._width || level > this._width - 1)
          return ;
        this._collapse_status[level + 1] = new Array(this.permutation.dimension(level).size()).fill(is);
    }

    validate() {
        this._axis = [];
        this._size = 0;
        this._maxlevel = -1;
        
        if (this.permutation.size() === 0) // пустой куб
            return;

        var r = this.root();
        if (r.size() === 0) {
            this._maxlevel = this.width() - 1;
        } else {
            this._maxlevel = -1;
            this._size = this.isTree ? this.insert_group(0, Math.min(this.permutation.size(), this.width()), r) :
                                       this.insert_group_plain(0, Math.min(this.permutation.size(), this.width()), r, []);
        }
        return this._size;
    }
    
    insert_group(from, width, group) {
        var last  = from;
        var level = group.level;

        // var next  = level + 1;
        // var dim_num = group.dimension_num();

        var collapsed = this.isCollapsed(level, group.index()) ;
        
        var totalPos ;
        var isFiltered ;
        
        if (!(level === -1 && this.isShowGrandTotal === false)) {
            var isLeaf = width === 0;
            const g = { 'l': level, 'i': group.index(), 'isLeaf': isLeaf } ;

            isFiltered = this._filterText && this.permutation.dimension_value(g).indexOf(this._filterText) === -1 ;
            if (!isLeaf)
                totalPos = last ;

            if (!isLeaf || !isFiltered) {
                this._axis[last++] = g;
                this._maxlevel = Math.max(this._maxlevel, level);
            }
        }
        
        if (width > 0 && !collapsed) {
            var inverse = this.isInverseSort;
            var size = group.size();
            var inc = 1;
            var begin = 0;
            if (inverse) {
                inc = -1;
                begin = size - 1;
            }

            while (size--) {
                last = this.insert_group(last, width - 1, new Group(group.permutation, group.level + 1, group.sub_index(begin)));
                begin += inc;
            }
            
            if (totalPos === last - 1 ) {
                if (isFiltered === true) { // empty group
                    this._axis.splice(totalPos, 1) ;
                    --last ;
                } else
                    this._axis[totalPos].isEmpty = true ;
            }
        }
        
        return last;
    }

    insert_group_plain(from, width, group, groupsIndex) {
        var last  = from;
        var level = group.level;

        // var next  = level + 1;
        // var dim_num = group.dimension_num();

        var collapsed = this.isCollapsed(level, group.index());

        var isLeaf = width === 0;
        if (level !== -1) {
            groupsIndex.push(group.index());
        }
        
        function insert_total_plain(self) {
            if ((level === -1 && self.isShowGrandTotal === true) || (level !== -1 && self.isShowTotal === true)) {
                self._axis[last++] = {
                    'l': level,
                    'i': groupsIndex,
                    'isLeaf': isLeaf
                };
                self._maxlevel = Math.max(self._maxlevel, level);
            }
        }

        if (width > 0 && !collapsed) {
            if (this.isTotalFirst === true) {
                insert_total_plain(this) ;    
            }

            var inverse = this.isInverseSort; // flags(next) & View:: F_INVERSE_ORDER;
            var size = group.size();
            var inc = 1;
            var begin = 0;
            if (inverse) {
                inc = -1;
                begin = size - 1;
            }

            while (size--) {
                var ps = groupsIndex.slice();
                last = this.insert_group_plain(last, width - 1, new Group(group.permutation, group.level + 1, group.sub_index(begin)), ps);
                begin += inc;
            }
            
            if (this.isTotalFirst === false) {
                insert_total_plain(this) ;
            }            

        } else {
            this._axis[last++] = { 'l': level, 'i': groupsIndex, 'isLeaf': isLeaf } ;
            this._maxlevel = Math.max(this._maxlevel, level);
        }

        return last;
    }
}

exports.Permutation = Permutation ;
exports.Axis        = Axis ;
