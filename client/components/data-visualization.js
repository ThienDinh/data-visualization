import React from 'react';
import BarChart from './bar-chart';
import ScatterPlot from './scatter-plot';
import * as d3 from 'd3';

export default class DataVisualization extends React.Component {
	constructor(props){
		super(props);
		this.state = {			
			fileName: props.file_name,
			bar_charts: [],
			scatter_plots: []
		}
	}
	componentDidMount(){
		var fileName = this.state.fileName;
		d3.csv(fileName+'_numerics.csv').get((error, data_numerics) => {
			d3.csv(fileName+'_statistics.csv').get((error, data_statistics) => {
				d3.csv(fileName+'_relations.csv').get((err, data_relations) => {
					// select the SVG tag.
					var row_names = Object.getOwnPropertyNames(data_numerics[0])
					var bar_charts = []
					row_names.forEach((r_name, i) => {
						// Skip the observations' labels column.
						if (i == 0) return;
						var title = r_name; // income.
						var data = []
						var labels = []
						data_numerics.forEach(function(d, i) {
							// for each observation, get the value of income.
							data.push(d[title])
							labels.push(d[''])
						})
						var selection = function(element) {
							// find the statistics for Income.
							return element[''] == title
						}
						// console.log(JSON.stringify(data_statistics))
						var mean_value = Number(data_statistics.find(selection)['Mean'])
						var standard_deviation_value = Number(data_statistics.find(selection)['Standard Deviation'])
						bar_charts.push({group:fileName, title: title, data: data, labels: labels, mean: mean_value, std: standard_deviation_value})
					})
					// console.log('componentWillMount:' + JSON.stringify(this.state.bar_charts))
			
					var names_pairs = data_relations.map(function(e) {
						var pair = e['']
						return pair.slice(1, pair.length - 1)
					})
					var scatter_plots = []
					names_pairs.forEach(function(pair, i) {
						// console.log('\n' + JSON.stringify(data_relations[i]))
						var intercept = Number(data_relations[i]["Regression Intercept"])
						var slope = Number(data_relations[i]["Regression Slope"])
						// Get the label names.
						var pair_split = pair.split(',')
						var label_x =  pair_split[0]
						var label_y = pair_split[1]

						var data_x = data_numerics.map(function(d, i) {
							var v = Number(d[label_x])
							return v
						})
						var data_y = data_numerics.map(function(d, i) {
							return Number(d[label_y])
						})
						var title =  `${label_x} vs. ${label_y}`
						scatter_plots.push({
							group: fileName,
							title: title,
							label_x: label_x,
							label_y: label_y,
							data_x: data_x,
							data_y: data_y,
							regression_intercept: intercept,
							regression_slope: slope,
						});
					})

					this.setState({
						bar_charts: bar_charts,
						scatter_plots: scatter_plots
					})
				})			
			})
		})
	}
	render(){
		return (
			<div className="container">
				{this.state.bar_charts.map(function(bar_chart, i) {
			    		var title = bar_chart.title.replace(/[^a-zA-Z]/g,'_').toLowerCase();
					return (
						<div key={i} className='jumbotron'>
					    		<BarChart id={title} {...bar_chart}/>
						</div>					
					)
				})}
			    	{this.state.scatter_plots.map(function(scatter_plot, i) {
			    		var title = scatter_plot.title.replace(/[^a-zA-Z]/g,'_').toLowerCase();
					return (
						<div key={i} className='jumbotron'>
							<ScatterPlot id={title} {...scatter_plot}/>
						</div>
					)
				})}		
			</div>
		)
	}
}