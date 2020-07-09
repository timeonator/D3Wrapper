import React, { Component } from 'react';
import D3Chart from './D3Chart';
import StateSelector from './RCStateSelector'

function status(response) {
    if (response.status >= 200 && response.status < 300) {
    return Promise.resolve(response)
    } else {
    return Promise.reject(new Error(response.statusText))
    }
}

function json(response) {
    return response.json()
}

export default class ChartWrapper extends Component {
    constructor(props) {
        super(props)
        this.state = {
            'data':[],
            'loading':true,
            'currentState': {state : 'ca', name : 'California' }
        };
        this.handleStateChange = this.handleStateChange.bind(this);
  
      }
	componentDidMount() {
		this.setState({
			chart: new D3Chart(this.refs.chart)
		})
    }
    
    componentDidUpdate(){
        console.log("ComponentDidUpdate()")
    }

	shouldComponentUpdate() {
		return false
    }

   
    stateURL(state) {
        let s = "https://covidtracking.com/api/v1/states/".concat(state).concat("/daily.json");
        console.log(s) 
        return(s); 
    }
    // fetch the state daily json data
    fetchData(){
        this.url = this.stateURL(this.state.currentState.state);

        fetch(this.url)
            .then(status)
            .then(json)
            .then((data) => {
                this.setState ({ 'data' : data })
                console.log('Request succeeded with JSON response', this.state);
            }).catch(function(error) {
                console.log('Request failed', error);
            });
    }

    handleStateChange(value){
        this.setState(value);
        this.state.chart.update(value);
    }

	render() {
		return (
            <div className='container'>
                <div ref="chart"></div>
                <StateSelector  handleStateChange = {this.handleStateChange}/>
            </div>
        )
    }
}