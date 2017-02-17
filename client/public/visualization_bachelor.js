d3.csv('bachelor_numerics.csv').get(function(error, data_numerics){
	d3.csv('bachelor_statistics.csv').get(function(error, data_statistic) {				
		d3.csv('bachelor_relations.csv').get(function(err, data_relations) {
			
			var names_pairs = data_relations.map(function(e) {
				var pair = e['']
				return pair.slice(1, pair.length - 1)
			})
			names_pairs.forEach(function(pair, i) {
				// console.log('\n' + JSON.stringify(data_relations[i]))
				intercept = Number(data_relations[i]["Regression Intercept"])
				slope = Number(data_relations[i]["Regression Slope"])
				regression = function(x) {
					return x * slope + intercept
				}

				// Get the label names.
				pair_split = pair.split(',')
				label_x =  pair_split[0]
				label_y = pair_split[1]

				// Get data for the two axis.
				data_y_prime = []
				data_x = data_numerics.map(function(d, i) {
					v = Number(d[label_x])
					data_y_prime.push(regression(v))
					return v
				})
				data_y = data_numerics.map(function(d, i) {
					return Number(d[label_y])
				})

				data_point = []
				data_x.forEach(function(x, i) {
					data_point.push({x: x, y: data_y[i]})
				})
				// console.log('x:' +data_x)
				// console.log('y:' +data_y)

				// console.log('data points:' + JSON.stringify(data_point))

				var svg_scatter = d3.select('body').append('svg')
						.attr('height', window.innerHeight).attr('width', window.innerHeight)

				plot_scatter = svg_scatter.append('g');

				var margin = {
					top: 50, right:50, bottom:50, left:50
				}
				var plot_scatter_width = svg_scatter.attr('width') - margin.right - margin.left;
				var plot_scatter_height = svg_scatter.attr('height') - margin.top - margin.bottom;
				plot_scatter.append('rect').attr('x', 0).attr('width', plot_scatter_width)
						.attr('y', 0).attr('height', plot_scatter_height)
						.attr('fill', '#efffe2')

				range_x = Math.max(...data_x) - Math.min(...data_x)
				max_y = Math.max(...data_y)//Math.max(Math.max(...data_y), Math.max(...data_y_prime))
				min_y = Math.min(...data_y) //Math.min(Math.min(...data_y), Math.min(...data_y_prime))
				range_y = max_y - min_y

				scale_x = d3.scaleLinear().domain([Math.min(...data_x) - 1 * range_x / 4, Math.max(...data_x) + 1 * range_x / 4]).range([0, plot_scatter_width])
				scale_y = d3.scaleLinear().domain([min_y - 1 * range_y / 4, max_y + 1 * range_y / 4]).range([0, plot_scatter_height])
				scale_y_reverse = d3.scaleLinear().domain([min_y - 1 * range_y / 4, max_y + 1 * range_y / 4]).range([plot_scatter_height, 0])

				group_axis = svg_scatter.append('g')

				axis_x = group_axis.append('g').call(d3.axisBottom(scale_x).ticks(5)).attr('transform',`translate(0,${plot_scatter_height})`)
				axis_y = group_axis.append('g').call(d3.axisLeft(scale_y_reverse).ticks(5)).attr('transform', `translate(0,0)`)

				plot_scatter.selectAll('circle')
							.data(data_point)
							.enter()
							.append('circle')
							.attr('cx', function(d, i) {
								return scale_x(d.x)
							})
							.attr('cy', function(d, i) {
								return plot_scatter_height - scale_y(d.y)
							})
							.attr('r', 5)
							.attr('fill', 'yellow')
							.attr('stroke', 'red')

				title = svg_scatter.append('g')
				title.append('text')
								.text(`${label_x} vs. ${label_y}`)
								.attr('font-size', margin.top / 2)
								.attr('text-anchor', 'middle')
								.attr('dominant-baseline', 'middle')
								.attr('x', plot_scatter_width / 2)
								.attr('y', margin.top / 2)

				// regression_line = svg_scatter.append('g')
				// regression_line.append('line')
				// 				.attr('x1', scale_x(Math.min(...data_x)))
				// 				.attr('y1', plot_scatter_height)
				// 				.attr('x2', scale_x(Math.max(...data_x)))
				// 				.attr('y2', scale_y_reverse(regression(Math.max(...data_x)) - regression(Math.min(...data_x))))
				// 				.attr('stroke-width', 2)
				// 				.attr('stroke', 'red')

				plot_scatter.attr('transform', `translate(${margin.left},${margin.top})`)
				group_axis.attr('transform', `translate(${margin.left},${margin.top})`)
				title.attr('transform', `translate(${margin.left},0)`)
				// regression_line.attr('transform', `translate(${margin.left},${margin.top})`)
			})
		})
	})
})