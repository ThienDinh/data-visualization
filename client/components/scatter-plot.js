import React from 'react';
import * as d3 from 'd3';

export default class ScatterPlot extends React.Component {
	constructor(props){
		super(props);
		this.state = {
			group:props.group,
			id: props.id,
			title: props.title,
			label_x: props.label_x,
			label_y: props.label_y,
			data_x: props.data_x,
			data_y:props.data_y,
			regression_intercept: props.regression_intercept,
			regression_slope: props.regression_slope,
		}
	}
	componentDidMount(){
			// console.log('\n' + JSON.stringify(data_relations[i]))
			var intercept = this.state.regression_intercept
			var slope = this.state.regression_slope
			var regression = function(x) {
				return x * slope + intercept
			}

			// Get the label names.
			var label_x =  this.state.label_x
			var label_y = this.state.label_y

			// Get data for the two axis.
			var data_y_prime = []
			var data_x = this.state.data_x
			var data_y = this.state.data_y

			var data_point = []
			data_x.forEach(function(x, i) {
				data_point.push({x: x, y: data_y[i]})
			})
			// console.log('x:' +data_x)
			// console.log('y:' +data_y)

			// console.log('data points:' + JSON.stringify(data_point))

			var svg_scatter = d3.select('#'+this.props.group).select(`#scatter-plot-${this.props.id}`).append('svg')
					.attr('height', window.innerHeight - 20).attr('width', window.innerHeight  - 20)

			var plot_scatter = svg_scatter.append('g');

			var margin_space = svg_scatter.attr('width') / 7;

			var margin = {
				top: margin_space,
				right: margin_space,
				bottom: margin_space,
				left: margin_space
			}
			var plot_scatter_width = svg_scatter.attr('width') - margin.right - margin.left;
			var plot_scatter_height = svg_scatter.attr('height') - margin.top - margin.bottom;
			plot_scatter.append('rect').attr('x', 0).attr('width', plot_scatter_width)
					.attr('y', 0).attr('height', plot_scatter_height)
					.attr('fill', '#75a5ff')

			var range_x = Math.max(...data_x) - Math.min(...data_x)
			var max_y = Math.max(...data_y)//Math.max(Math.max(...data_y), Math.max(...data_y_prime))
			var min_y = Math.min(...data_y) //Math.min(Math.min(...data_y), Math.min(...data_y_prime))
			var range_y = max_y - min_y

			var scale_x = d3.scaleLinear().domain([Math.min(...data_x) - 1 * range_x / 4, Math.max(...data_x) + 1 * range_x / 4]).range([0, plot_scatter_width])
			var scale_y = d3.scaleLinear().domain([min_y - 1 * range_y / 4, max_y + 1 * range_y / 4]).range([0, plot_scatter_height])
			var scale_y_reverse = d3.scaleLinear().domain([min_y - 1 * range_y / 4, max_y + 1 * range_y / 4]).range([plot_scatter_height, 0])

			var group_axis = svg_scatter.append('g')

			var axis_x = group_axis.append('g').call(d3.axisBottom(scale_x).ticks(5)).attr('transform',`translate(0,${plot_scatter_height})`)
			var axis_y = group_axis.append('g').call(d3.axisLeft(scale_y_reverse).ticks(5)).attr('transform', `translate(0,0)`)

			plot_scatter.selectAll('circle')
						.data(data_point)
						.enter()
						.append('circle')
						.attr('cx', function(d, i) {
							var x = scale_x(d.x)
							return x
						})
						.attr('cy', function(d, i) {
							var y = plot_scatter_height - scale_y(d.y)
							return y
						})
						.attr('r', 5)
						.attr('fill', 'white')
						.attr('stroke', 'red')
						.attr('defined-clicked', null)
						.on('click', function(d, i) {
							var circle = d3.select(this)
							var clicked = Boolean(circle.attr('defined-clicked'))
							if(clicked == false) {
								circle.attr('fill', 'yellow')
									.attr('stroke', 'red')
									.attr('defined-clicked', true);

							var x = scale_x(d.x)
							var y = plot_scatter_height - scale_y(d.y)	
							plot_scatter.append('text')
								.text(`(${d.x},${d.y})`)
								.attr('id', 'point-'+i)
								.attr('font-size', 10)
								.attr('text-anchor', 'begin')
								.attr('dominant-baseline', 'bottom')
								.attr('x', x + 8)
								.attr('y', y - 8)
							}
							else {
								circle.attr('fill', 'white')
									.attr('stroke', 'red')							
									.attr('defined-clicked', null);
								plot_scatter.selectAll('#point-'+i).remove();
							}
						})
						.on('mouseover', function(d, i) {
							d3.select(this).attr('r', 7)
						})
						.on('mouseout', function(d, i) {
							d3.select(this).attr('r', 5)
						})

			var title = svg_scatter.append('g')
			title.append('text')
							.text(`${label_x} vs. ${label_y}`)
							.attr('font-size', margin.top / 4)
							.attr('text-anchor', 'middle')
							.attr('dominant-baseline', 'middle')
							.attr('x', plot_scatter_width / 2)
							.attr('y', margin.top / 2)
			var graph_x_label = svg_scatter.append('text')
				.text(this.state.label_x)
				.attr('font-size', margin.left / 4)
				.attr('text-anchor', 'middle')
				.attr('dominant-baseline', 'middle')
				.attr('transform', `translate(${margin.left / 4},${plot_scatter_height / 2 + margin.top}) rotate(-90)`)
			var graph_y_label = svg_scatter.append('text')
				.text(this.state.label_y)
				.attr('font-size', margin.bottom / 4)
				.attr('text-anchor', 'middle')
				.attr('dominant-baseline', 'middle')
				.attr('transform', `translate(${margin.left + plot_scatter_width / 2 },${plot_scatter_height + margin.top + margin.bottom / 2})`)

			// var regression_line = svg_scatter.append('g')
			// regression_line.append('line')
			// 				.attr('x1', scale_x(Math.min(...data_x)))
			// 				.attr('y1', scale_y_reverse(regression(Math.min(...data_x))))
			// 				.attr('x2', scale_x(Math.max(...data_x)))
			// 				.attr('y2', scale_y_reverse(regression(Math.max(...data_x))))
			// 				.attr('stroke-width', 2)
			// 				.attr('stroke', 'red')
			// regression_line.attr('transform', `translate(${margin.left},${margin.top})`)

			plot_scatter.attr('transform', `translate(${margin.left},${margin.top})`)
			group_axis.attr('transform', `translate(${margin.left},${margin.top})`)
			title.attr('transform', `translate(${margin.left},0)`)
	}
	render(){
		return (
						<div id={"scatter-plot-"+this.props.id}/>
		)
	}
}