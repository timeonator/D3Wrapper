import React, { Component } from 'react';

function status(response) {
    if (response.status >= 200 && response.status < 300) {
        return Promise.resolve(response)
    } else {
        return Promise.reject(new Error(response.statusText))
    }
}

function json(response) {
    return (response.json());
}

class RCStateSelector extends Component {
    constructor(props){
        super(props);
        this.url = 'https://covidtracking.com/api/v1/states/info.json';
    }
   
    // fetch the state metat states json data
    fetchData() {
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


    componentDidMount() {
        console.log("RCStateSelector commponentDidMount()")
        this.fetchData(this.url)
        this.timer = setInterval(() => this.fetchData(), 5000);
        console.log("State Meta Data is:", this.state)
    }
    componentDidUpdate() {
        console.log("RSCStateSelector componentDidUpdate()")
    }

    buildSelector(){

    }

    render(props){
        return(
            <select>
                { this.state.data.foreach (s)}
                <option>{s.state}</option>
            </select>
        );
    }
}
export default RCStateSelector