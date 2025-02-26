import { Component, Input, OnChanges, OnInit } from "@angular/core";
import { ComponentChanges } from "@nova-ui/bits";
import {
    Chart,
    ChartAssist,
    GaugeMode,
    GaugeUtil,
    IAccessors,
    IChartAssistSeries,
    IGaugeLabelsPluginConfig,
    IGaugeConfig,
    linearGaugeGridConfig,
    LinearGaugeLabelsPlugin,
    stack,
    XYGrid,
    XYGridConfig
} from "@nova-ui/charts";

@Component({
    selector: "linear-gauge-vertical-prototype",
    templateUrl: "./linear-gauge-vertical-prototype.component.html",
    styleUrls: ["./linear-gauge-vertical-prototype.component.less"],
})
export class LinearGaugeVerticalPrototypeComponent implements OnChanges, OnInit {
    @Input() public thickness: number;
    @Input() public gaugeConfig: IGaugeConfig;
    @Input() public flipLabels = false;

    public chartAssist: ChartAssist;
    public seriesSet: IChartAssistSeries<IAccessors>[];
    private labelsPlugin: LinearGaugeLabelsPlugin;

    public ngOnChanges(changes: ComponentChanges<LinearGaugeVerticalPrototypeComponent>) {
        if ((changes.thickness && !changes.thickness.firstChange) || (changes.flipLabels && !changes.flipLabels.firstChange)) {
            const gridConfig = this.chartAssist.chart.getGrid().config();
            if (changes.thickness) {
                gridConfig.dimension.width(this.thickness);
            }
            if (changes.flipLabels) {
                this.labelsPlugin.config.flipLabels = this.flipLabels;
                // reset the margins to accommodate the label direction change
                gridConfig.dimension.margin = {
                    top: 0,
                    right: 0,
                    bottom: 0,
                    left: 0,
                };
            }
            this.chartAssist.chart.updateDimensions();
        }

        if (changes.gaugeConfig && !changes.gaugeConfig.firstChange) {
            this.chartAssist.update(GaugeUtil.updateSeriesSet(this.seriesSet, this.gaugeConfig));
        }
    }

    public ngOnInit() {
        const grid = new XYGrid(linearGaugeGridConfig(GaugeMode.Vertical, this.thickness) as XYGridConfig);
        const chart = new Chart(grid);

        this.chartAssist = new ChartAssist(chart, stack);

        const labelConfig: IGaugeLabelsPluginConfig = {
            flipLabels: this.flipLabels,
            // extra clearance for the longer labels generated by the formatter
            clearance: {
                top: 0,
                right: 40,
                bottom: 0,
                left: 40,
            },
        };
        this.labelsPlugin = new LinearGaugeLabelsPlugin(labelConfig);
        this.chartAssist.chart.addPlugin(this.labelsPlugin);

        this.seriesSet = GaugeUtil.assembleSeriesSet(this.gaugeConfig, GaugeMode.Vertical);
        this.seriesSet = GaugeUtil.setThresholdLabelFormatter((d: string) => `${d}ms`, this.seriesSet);

        this.chartAssist.update(this.seriesSet);
    }
}
