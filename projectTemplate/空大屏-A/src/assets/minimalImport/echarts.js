import * as echarts from 'echarts/core';
import 'echarts/lib/component/dataZoom'
import {
  LineChart,
  LinesChart ,
  BarChart,
  PieChart,
  PictorialBarChart,
  ThemeRiverChart,
  CustomChart,
} from 'echarts/charts';
import {
  TitleComponent,
  ToolboxComponent,
  TooltipComponent,
  GridComponent,
  LegendComponent,
  VisualMapComponent,
  TimelineComponent,
  CalendarComponent,
  SingleAxisComponent ,
  GeoComponent ,
  MarkLineComponent,
} from 'echarts/components';
import {
  CanvasRenderer
} from 'echarts/renderers';

export default function importEcharts(){
  echarts.use([
    LineChart, 
    LinesChart,
    BarChart,
    PieChart,
    PictorialBarChart,
    ThemeRiverChart,
    CustomChart,
  ])
  echarts.use([
    TitleComponent,
    ToolboxComponent,
    TooltipComponent,
    GridComponent, 
    LegendComponent, 
    VisualMapComponent,
    TimelineComponent,
    CalendarComponent,
    SingleAxisComponent ,
    GeoComponent ,
    MarkLineComponent,
  ])
  echarts.use([CanvasRenderer])
}