import * as d3 from 'd3'

var width = 600
var height = 350
var margin = {
    left: 50,
    top: 40,
    right: 50,
    bottom : 30
} 

export default class D3Chart {
	constructor(element) {
        this.element = element;
        console.log("element =", element)
        this.data = [];


        console.log("width =", width)
        console.log("height =", height)

        this.svg = d3.select(this.element)
        .append("svg")
        .attr("className","d3-chart")
        .attr("height", height)
        .attr("width", width);
    

        width = this.svg.attr("width") - (margin.left+margin.right)
        height = this.svg.attr("height") - (margin.top+margin.bottom)
        // this.xLabel = this.svg.append("text")
		// 	.attr("x", this.svg.width / 2)
		// 	.attr("y", this.svg.height + 50)
		// 	.attr("text-anchor", "middle")

		// this.svg.append("text")
		// 	.attr("x", -(this.svg.height / 2))
		// 	.attr("y", -50)
		// 	.attr("text-anchor", "middle")
		// 	.text("height in cm")
		// 	.attr("transform", "rotate(-90)")

		// this.xAxisGroup = this.svg.append("g")
		// 	.attr("transform", `translate(0, ${height})`)

        // this.yAxisGroup = this.svg.append("g")
        

	}



	update(value) {
        console.log("update(value)", value.currentState.state)
         let url = "https://covidtracking.com/api/v1/states/".concat(value.currentState.state).concat("/daily.json");
         console.log("URL", url)
         this.loading = true;
         d3.json(url)
            .then (thedata => { 
                console.log ("thedata", thedata)
                this.data = thedata.reverse();
                console.log("THis.DATA", this.data)
                return(this.data)
            },
            function(error)  {
                console.error("Something went wrong : ", error);
                return error;
            }
        );

        //while(this.loading === true) this.timer = setInterval(() => this.fetchData(), 5000);
        console.log("D3Chart.update data =", this.data)

        this.posInc = (this.data.map(day=>day.positiveIncrease));

        let formatter = d3.timeFormat("%m/%d/%Y")
        let parseDate = d3.utcParse("%Y%m%d")

        this.timeLine = this.data.map(d => 
            d.dateModified ? d.dateModified : new Date(formatter(parseDate(d.date)))
        )
        console.log("Positive Increase =", this.posInc)
        console.log("timeLine:", this.timeLine);

//		this.svg.xLabel.text(`Blah Blah Blah`)

        var yScale = d3.scaleLinear()
            .domain([d3.min(this.posInc), d3.max(this.posInc)])
            .range ([height, 0]);

//  Clear out the x and y axis before drawing new ones
        this.svg.select(".x-axis").remove()
        this.svg.select(".y-axis").remove() 

        var gy = this.svg.append("g")
            .attr("class", "y-axis")
            .attr("transform", "translate(" + margin.left + "," + margin.top + ")")
            .call(d3.axisLeft(yScale).ticks(10))
            
        const timeScale = d3.scaleTime()
            .domain([this.timeLine[0], new Date()])
            .range([width, height]);
        // Add scales to axis
        // Add scales to axis
        var xScale = d3.scaleTime()
            .domain([this.timeLine[0],new Date()])
            .range ([0, width])
        console.log("xScale=", xScale)
        //d3.svg.selectAll(".x-axis").remove()

        var gx = this.svg.append("g")
            .attr("class","x-axis")
            .attr("transform", "translate(" + margin.left + "," + (height+margin.top) + ")")
            .call(d3.axisBottom(xScale).ticks(4))

		// DATA JOIN
		const rects = this.svg.selectAll("rect")
			.data(this.data)

		// EXIT
    rects.exit()
        .transition().duration(500)
            .attr("height", 0)
            .attr("y", height)
            .remove()

		// UPDATE
		rects.transition().duration(500)
        .attr("height", d => { return ( height - yScale(d.positiveIncrease)) })
        .attr("y", function(d)  { return (yScale(d.positiveIncrease))})
        .attr("x", function(d, i) { return (margin.left + 
            xScale(new Date(formatter(parseDate(d.date))))) })
        .attr("width", function(d, i) { return width/119 })
        .attr("transform", "translate(" + 0 + "," + (margin.top) + ")")
        .attr("class","bar")
        // .transition().duration(500)
        // 	.attr("height", d => height - yScale(d.positiveIncrease))
        // 	.attr("y", d => yScale(height))


		// ENTER
		rects.enter().append("rect")
            .attr("height", d => { return ( height - yScale(d.positiveIncrease)) })
            .attr("y", function(d)  { return (yScale(d.positiveIncrease))})
            .attr("x", function(d, i) { return (margin.left + 
                xScale(new Date(formatter(parseDate(d.date))))) })
            .attr("width", function(d, i) { return width/119 })
            .attr("transform", "translate(" + 0 + "," + (margin.top) + ")")
            .attr("class","bar")
			// .transition().duration(500)
			// 	.attr("height", d => height - yScale(d.positiveIncrease))
			// 	.attr("y", d => yScale(height))

			console.log(rects)
	}
}