import React from 'react';
import * as d3 from 'd3';

export default class BarChart extends React.Component {
	constructor(props){
		super(props)
		// console.log('In BarChart: ' + JSON.stringify(props))
		this.state = {
			group: props.group,
			id: props.id, // key identifies the chart.
			title: props.title,
			data: props.data, // arrays of data for labels
			labels: props.labels, // arrays of labels
			mean: props.mean,
			std: props.std
		}			
	}
	componentDidMount(){

			var svg_chart = d3.select('#'+this.props.group).select(`#bar-chart-${this.props.id}`).append('svg')
				.attr('height', window.innerHeight  - 20).attr('width', window.innerHeight  - 20);

			// set margin left and right within the drawing area.
			var margin_space = svg_chart.attr('width') / 7
			var margin = {
				top: margin_space,
				right: margin_space,
				bottom: margin_space * 1.5,
				left: margin_space
			}

			// width of the drawing area. reserve spaces for margin
			var area_width = svg_chart.attr('width') - margin.right - margin.left;
			// height of the drawing area.
			var area_height = svg_chart.attr('height') - margin.top - margin.bottom;
			// console.log(area_width + ", " + area_height)

			// Draw background.
			svg_chart.append('rect').
				attr('x', margin.right).attr('width', area_width)
				.attr('y', margin.top).attr('height', area_height)
				.attr('fill', '#fff9da')

			// Get the maximum value within the data array.
			var data_array = this.state.data;
			// console.log('Data in for this attribute: ' + data_array)
			var max_value = Math.max.apply(Math, data_array);

			// spacing between each charts. assuming the axis takes 1 bar chart.
			var spacing = area_width / this.state.data.length;

			var emptySpace = 1 / 5;
			var fillSpace = 4 / 5;

			// Apply scaling so that regardless the range of data,
			// the charts fit in the drawing area.
			var myScale = d3.scaleLinear()
							.domain([0, max_value + max_value / 8])
							.range([0, area_height]);

			var yAxisScale = d3.scaleLinear()
							.domain([0, max_value + max_value / 8])
							.range([area_height, 0]);

			var mean_value = this.state.mean
			var standar_deviation_value = this.state.std
			// console.log(standar_deviation_value)

			// Standard deviation.
			var sdd = svg_chart.append('g');
			sdd.append('rect')
				.attr('x', 0)
				.attr('width', area_width)
				.attr('y', area_height - myScale(mean_value) - myScale(standar_deviation_value))
				.attr('height', 2 * myScale(standar_deviation_value))
				.attr('fill', '#75a5ff')

			var mean = svg_chart.append('g')
			mean.append('line')
				.attr('x1', 0)
				.attr('y1', area_height - myScale(mean_value))
				.attr('x2', area_width)
				.attr('y2', area_height - myScale(mean_value))
				.attr('stroke-width', 2)
				.attr('stroke', 'red')


			var yAxis = d3.axisLeft(yAxisScale).ticks(15);

			// call will pass parameters along with the first object.
			// apply will pass parameters in an array along with an object.
			var axis = svg_chart.append('g');
			axis.call(yAxis);

			var chartsAndLabels = svg_chart.append('g');
			// Draw all rectangles.
			chartsAndLabels.selectAll('rect')
				.data(data_array) // Map to data.
				.enter() // Enter these data and create placeholders for the data. Begin apply to all.
				.append('rect') // append each element of the data into the rectangles.
				.attr('y', function(d, i) {
					var bar_height = myScale(d)
					return area_height - bar_height;
				})
				.attr('height', function(d, i){
					var bar_height = myScale(d)
					return bar_height;
				})
				.attr('x', (d, i) => {
					var chart_begin_x = spacing * i + spacing * emptySpace
					chartsAndLabels.append('text')
						.text(this.state.labels[i])
						.attr('font-size', (spacing * fillSpace) / 2)
						.attr('text-anchor', 'end')
						.attr('dominant-baseline', 'middle')
						.attr('transform', `translate(${chart_begin_x + spacing * fillSpace / 2},${area_height + 10})rotate(-75)`)
					
					chartsAndLabels.append('text')
						.text(d)
						.attr('font-size', (spacing * fillSpace) / 2)
						.attr('text-anchor', 'middle')
						.attr('dominant-baseline', 'middle')
						.attr('fill', 'black')
						.attr('transform', `translate(${chart_begin_x + spacing * fillSpace / 2},${yAxisScale(d) - 13})rotate(-50)`)
					return chart_begin_x;
				})
				.attr('width', function(d, i) {
					return spacing * fillSpace;
				})
				.attr('title', function(d, i) {
					return d;
				})
				.style('fill', 'blue')
				.style('stroke', 'black')
				.attr('defined-clicked', null)
				.on('click', function(d, i) {
					var rect = d3.select(this)
					var clicked = Boolean(rect.attr('defined-clicked'))
					if(clicked == false) {
						rect.style('fill', 'yellow')
							.attr('defined-clicked', true);
					}
					else {
						rect.style('fill', 'blue')								
							.attr('defined-clicked', null);
					}
				})
				// .on('mouseover', function(d, i) {
				// 	// select the current rectangle.
				// 	d3.select(this).style('fill', 'yellow')
				// })
				// .on('mouseout', function(d, i) {
				// 	d3.select(this)
				// 		.style('fill', 'blue')
				// });

			var graph_title = svg_chart.append('text')
				.text(this.state.title)
				.attr('font-size', margin.top / 4)
				.attr('text-anchor', 'middle')
				.attr('dominant-baseline', 'middle')

			// Move.
			chartsAndLabels.attr('transform', `translate(${margin.left},${margin.top})`)
			axis.attr('transform', `translate(${margin.left},${margin.top})`)
			mean.attr('transform', `translate(${margin.left},${margin.top})`)
			sdd.attr('transform', `translate(${margin.left},${margin.top})`)
			graph_title.attr('transform', `translate(${margin.top / 4},${area_height / 2 + margin.top}) rotate(-90)`)
	}
	render() {
		return (
						<div id={"bar-chart-"+this.props.id}/>
			)
	}
}