const emptyDataPlugin = {
    id: 'isempty',
    afterDraw: function(chart, args, options) {
        if (chart.data.datasets[0].data.every(value => value === 0)) {
            let {ctx, width, height} = chart;

            ctx.save();
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.font = options.font;
            ctx.fillText(options.text, width / 2, height / 2);
            ctx.restore();
        }
    }
}

export { emptyDataPlugin }