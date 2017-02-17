import React from 'react';
import DataVisualization from './data-visualization';

export default class App extends React.Component {
	render(){
		return (
			<div className="container">				
				<ul className="nav nav-tabs">
				  <li role="presentation"><a href="#bachelor">View Bachelor Visualization</a></li>
				  <li role="presentation"><a href="#advanced">View Advanced Visualization</a></li>
				</ul>				
				<div className='jumbotron'>Homework 1 Getting started with Data Visualization</div>
				<div id='bachelor'>
					<h3> <span className="label label-default">Bachelor Visualization</span></h3>
					<DataVisualization file_name='bachelor'/>
				</div>
				<div id='advanced'>
					<h3> <span className="label label-default">Advanced Visualization</span></h3>
					<DataVisualization file_name='advanced'/>
				</div>
			</div>
		)
	}
}