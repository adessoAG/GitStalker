export class ChartJSData {

    private chartJSLabels: Array<string>;
    private chartJSDataset: Array<number>;

    constructor(chartJSLabels: Array<string>,
        chartJSDataset: Array<number>) {

        this.chartJSLabels = chartJSLabels;
        this.chartJSDataset = chartJSDataset;
    }

    getChartJSLabels(): Array<string> {
        return this.chartJSLabels;
    }

    getChartJSDataset(): Array<number> {
        return this.chartJSDataset;
    }
}