import { Component, Input, OnInit } from "@angular/core";
import {
    Chart,
    ChartAssist,
    GaugeMode,
    GaugeUtil,
    IAccessors,
    IChartAssistSeries,
    IGaugeConfig,
    linearGaugeGridConfig,
    LinearGaugeLabelsPlugin,
    stack,
    XYGrid,
    XYGridConfig
} from "@nova-ui/charts";

@Component({
    selector: "vertical-gauge-tester",
    templateUrl: "./vertical-gauge-tester.component.html",
    styleUrls: ["./vertical-gauge-tester.component.less"],
})
export class VerticalGaugeTesterComponent implements OnInit {
    @Input() public gaugeConfig: IGaugeConfig;

    public chartAssist: ChartAssist;
    public seriesSet: IChartAssistSeries<IAccessors>[];

    public ngOnInit() {
        const grid = new XYGrid(linearGaugeGridConfig(GaugeMode.Vertical) as XYGridConfig);
        const chart = new Chart(grid);

        this.chartAssist = new ChartAssist(chart, stack);
        this.chartAssist.chart.addPlugin(new LinearGaugeLabelsPlugin());

        this.seriesSet = GaugeUtil.assembleSeriesSet(this.gaugeConfig, GaugeMode.Vertical);
        this.chartAssist.update(this.seriesSet);
    }
}
