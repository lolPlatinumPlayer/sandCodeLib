/* 
本文件复制于elementUI el-table-column的源码

- 本文件与el-table-column的不同处
  - 功能目录见“自建props”
  - 转换插槽里的标签里的的值  
    要用这个功能的话需要标注值存在哪个标签里
    （目前设计只允许有一个『存有值的标签』，且这个标签要是“没有枝叶”的）
    标注方法：给标签加上valTag属性
  - 如果插槽第一级同时存在文本和标签的话
    当前设计拒绝转换第一级的文本
- 同文件夹内的dealVal.js不存在于el-table-column内
*/
import { cellStarts, cellForced, defaultRenderCell, treeCellPrefix } from './config';
import { mergeOptions, parseWidth, parseMinWidth, compose } from './util';
import ElCheckbox from 'element-ui/packages/checkbox';
import Vue from 'vue';
import dealVal from './dealVal'

let columnIdSeed = 1000;

export default /* Vue.extend( */{
  name: 'MyTableCol',

  props: {
    // 自建props（目前不考虑插入的template标签里无内容的情况）
    isChangeEmptyVal:{ // 是否转换空值
      type:Boolean,
      default:true,
    },
    changeEmptyValTo:{ // 空值转换为的值
      default:'-',
    },
    isUseThousandthSignInNum:{ // 是否在值为数字时使用千分符
      /* 
      目前有个缺陷，如果使用template。无法判断原值的数据类型
      要判断的话去column.renderCell的data参数里找原值
      */
      type:Boolean,
      default:true,
    },
    isUseThousandthSignForce:{ // 是否对值使用千分符（不管是什么值）
      type:Boolean,
      default:false,
    },

    // 原props
    type: {
      type: String,
      default: 'default'
    },
    label: String,
    className: String,
    labelClassName: String,
    property: String,
    prop: String,
    width: {},
    minWidth: {},
    renderHeader: Function,
    sortable: {
      type: [Boolean, String],
      default: false
    },
    sortMethod: Function,
    sortBy: [String, Function, Array],
    resizable: {
      type: Boolean,
      default: true
    },
    columnKey: String,
    align: String,
    headerAlign: String,
    showTooltipWhenOverflow: Boolean,
    showOverflowTooltip: Boolean,
    fixed: [Boolean, String],
    formatter: Function,
    selectable: Function,
    reserveSelection: Boolean,
    filterMethod: Function,
    filteredValue: Array,
    filters: Array,
    filterPlacement: String,
    filterMultiple: {
      type: Boolean,
      default: true
    },
    index: [Number, Function],
    sortOrders: {
      type: Array,
      default() {
        return ['ascending', 'descending', null];
      },
      validator(val) {
        return val.every(order => ['ascending', 'descending', null].indexOf(order) > -1);
      }
    }
  },

  data() {
    return {
      isSubColumn: false,
      columns: []
    };
  },

  computed: {
    owner() {
      let parent = this.$parent;
      while (parent && !parent.tableId) {
        parent = parent.$parent;
      }
      return parent;
    },

    columnOrTableParent() {
      let parent = this.$parent;
      while (parent && !parent.tableId && !parent.columnId) {
        parent = parent.$parent;
      }
      return parent;
    },

    realWidth() {
      return parseWidth(this.width);
    },

    realMinWidth() {
      return parseMinWidth(this.minWidth);
    },

    realAlign() {
      return this.align ? 'is-' + this.align : null;
    },

    realHeaderAlign() {
      return this.headerAlign ? 'is-' + this.headerAlign : this.realAlign;
    }
  },

  methods: {
    getPropsData(...props) {
      const result= props.reduce((prev, cur) => {
        if (Array.isArray(cur)) {
          cur.forEach((key) => {
            prev[key] = this[key];
          });
        }
        return prev;
      }, {});
      // console.warn(result,'getPropsData') // wjx: 没有单元格数据，只有列的一些信息
      return result
    },

    getColumnElIndex(children, child) {
      return [].indexOf.call(children, child);
    },

    setColumnWidth(column) {
      if (this.realWidth) {
        column.width = this.realWidth;
      }
      if (this.realMinWidth) {
        column.minWidth = this.realMinWidth;
      }
      if (!column.minWidth) {
        column.minWidth = 80;
      }
      column.realWidth = column.width === undefined ? column.minWidth : column.width;
      return column;
    },

    setColumnForcedProps(column) {
      // 对于特定类型的 column，某些属性不允许设置
      const type = column.type;
      const source = cellForced[type] || {};
      Object.keys(source).forEach(prop => {
        let value = source[prop];
        if (value !== undefined) {
          column[prop] = prop === 'className' ? `${column[prop]} ${value}` : value;
        }
      });
      // console.warn(column,'setColumnForcedProps')  // wjx: 没有单元格数据
      return column;
    },

    setColumnRenders(column) {
      // renderHeader 属性不推荐使用。
      if (this.renderHeader) {
        console.warn('[Element Warn][TableColumn]Comparing to render-header, scoped-slot header is easier to use. We recommend users to use scoped-slot header.');
      } else if (column.type !== 'selection') {
        column.renderHeader = (h, scope) => {
          const renderHeader = this.$scopedSlots.header;
          return renderHeader ? renderHeader(scope) : column.label;
        };
      }

      let originRenderCell = column.renderCell;
      // element团队的TODO: 这里的实现调整
      if (column.type === 'expand') {
        // 对于展开行，renderCell 不允许配置的。在上一步中已经设置过，这里需要简单封装一下。
        column.renderCell = (h, data) => (<div class="cell">
          { originRenderCell(h, data) }
        </div>);
        this.owner.renderExpanded = (h, data) => {
          return this.$scopedSlots.default
            ? this.$scopedSlots.default(data)
            : this.$slots.default;
        };
      } else {
        originRenderCell = originRenderCell || defaultRenderCell;
        // 对 renderCell 进行包装
        column.renderCell = (h, data) => {

          /* 
          wjx:el-table-column中children变量最终值的说明

          - 如果用户在el-table-column间塞了template
            那么就是vNode树
            - 这个树是包含文本节点的
            - 如果template中没有内容则返回undefined
          - 如果用户没有在el-table-column间放任何内容
            那么就是单元格的值(也就是el-table组件data这个prop传入数据的对应值)
           */
          let children = null;

          if (this.$scopedSlots.default) {
            children = this.$scopedSlots.default(data);
          } else {
            children = originRenderCell(h, data);
          }
          const prefix = treeCellPrefix(h, data);
          const props = {
            class: 'cell',
            style: {}
          };
          if (column.showOverflowTooltip) {
            props.class += ' el-tooltip';
            props.style = {width: (data.column.realWidth || data.column.width) - 1 + 'px'};
          }

          /* console.log(
            {
              data,
              props,
              prefix,
            }
          )
          console.log({
            label:this.label, // 是想象中的样子
            prop:this.prop, // 是想象中的样子
            props:this.$props, // 是想象中的样子
          }) 
          // 如果标签上没有属性的话`this.属性名`会是undefined
          */

        /* if(typeof children==='object'){
          console.log(children)
console.log(this.$VNode)
        } */



        /* if(this.label==='合规校验总条数'){
          console.log(children[0])
          debugger
        } */
          
          children=dealVal(children,this)

          return (<div { ...props }>
            { prefix }
            { children }
          </div>);
        };
      }
      // console.warn(column,'setColumnRenders') // wjx: 没有单元格数据
      return column;
    },

    registerNormalWatchers() {
      const props = ['label', 'property', 'filters', 'filterMultiple', 'sortable', 'index', 'formatter', 'className', 'labelClassName', 'showOverflowTooltip'];
      // 一些属性具有别名
      const aliases = {
        prop: 'property',
        realAlign: 'align',
        realHeaderAlign: 'headerAlign',
        realWidth: 'width'
      };
      const allAliases = props.reduce((prev, cur) => {
        prev[cur] = cur;
        return prev;
      }, aliases);

      Object.keys(allAliases).forEach(key => {
        const columnKey = aliases[key];

        this.$watch(key, (newVal) => {
          this.columnConfig[columnKey] = newVal;
        });
      });
    },

    registerComplexWatchers() {
      const props = ['fixed'];
      const aliases = {
        realWidth: 'width',
        realMinWidth: 'minWidth'
      };
      const allAliases = props.reduce((prev, cur) => {
        prev[cur] = cur;
        return prev;
      }, aliases);

      Object.keys(allAliases).forEach(key => {
        const columnKey = aliases[key];

        this.$watch(key, (newVal) => {
          this.columnConfig[columnKey] = newVal;
          const updateColumns = columnKey === 'fixed';
          this.owner.store.scheduleLayout(updateColumns);
        });
      });
    }
  },

  components: {
    ElCheckbox
  },

  beforeCreate() {
    this.row = {};
    this.column = {};
    this.$index = 0;
    this.columnId = '';
  },

  created() {
    const parent = this.columnOrTableParent;
    this.isSubColumn = this.owner !== parent;
    this.columnId = (parent.tableId || parent.columnId) + '_column_' + columnIdSeed++;

    const type = this.type || 'default';
    const sortable = this.sortable === '' ? true : this.sortable;
    const defaults = {
      ...cellStarts[type],
      id: this.columnId,
      type: type,
      property: this.prop || this.property,
      align: this.realAlign,
      headerAlign: this.realHeaderAlign,
      showOverflowTooltip: this.showOverflowTooltip || this.showTooltipWhenOverflow,
      // filter 相关属性
      filterable: this.filters || this.filterMethod,
      filteredValue: [],
      filterPlacement: '',
      isColumnGroup: false,
      filterOpened: false,
      // sort 相关属性
      sortable: sortable,
      // index 列
      index: this.index
    };

    const basicProps = ['columnKey', 'label', 'className', 'labelClassName', 'type', 'renderHeader', 'formatter', 'fixed', 'resizable'];
    const sortProps = ['sortMethod', 'sortBy', 'sortOrders'];
    const selectProps = ['selectable', 'reserveSelection'];
    const filterProps = ['filterMethod', 'filters', 'filterMultiple', 'filterOpened', 'filteredValue', 'filterPlacement'];

    let column = this.getPropsData(basicProps, sortProps, selectProps, filterProps);
    column = mergeOptions(defaults, column);

    // 注意 compose 中函数执行的顺序是从右到左
    const chains = compose(this.setColumnRenders, this.setColumnWidth, this.setColumnForcedProps);
    column = chains(column);

    this.columnConfig = column;

    // 注册 watcher
    this.registerNormalWatchers();
    this.registerComplexWatchers();
  },

  mounted() {
    const owner = this.owner;
    const parent = this.columnOrTableParent;
    const children = this.isSubColumn ? parent.$el.children : parent.$refs.hiddenColumns.children;
    const columnIndex = this.getColumnElIndex(children, this.$el);

    owner.store.commit('insertColumn', this.columnConfig, columnIndex, this.isSubColumn ? parent.columnConfig : null);
  },

  destroyed() {
    if (!this.$parent) return;
    const parent = this.$parent;
    this.owner.store.commit('removeColumn', this.columnConfig, this.isSubColumn ? parent.columnConfig : null);
  },

  render(h) { // 这个render不影响单元格内容
    // slots 也要渲染，需要计算合并表头
    return h('div', this.$slots.default);
  }
}/* ) */
