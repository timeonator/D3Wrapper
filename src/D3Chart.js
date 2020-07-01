import * as d3 from 'd3'

var url = "https://covidtracking.com/api/v1/states/or/daily.json";
var width = 400
var height = 350
var margin = {
    left: 30,
    top: 40,
    right: 30,
    bottom : 30
} 

export default class D3Chart {
	constructor(element) {
        this.element = element;
        console.log("element =", element)

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
        
        var data = d3.json(url)
        .then (thedata => { 
            this.data = thedata.reverse();
            this.update()
            return(this.data)
        },
        function(error)  {
            console.error("Something went wrong : ", error);
            return error;
        });
	}

	update() {

        console.log("data =", this.data)

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

        var gx = this.svg.append("g")
            .attr("class","x-axis")
            .attr("transform", "translate(" + margin.left + "," + (height+margin.top) + ")")
            .call(d3.axisBottom(xScale).ticks(4))

		// DATA JOIN
		const rects = this.svg.selectAll("rect")
			.data(this.data)

		// EXIT
    // rects.exit()
    //     .transition().duration(500)
    //         .attr("height", 0)
    //         .attr("y", height)
    //         .remove()

		// UPDATE
		// rects.transition().duration(500)
		// 	.attr("x", (d, i) => { return (margin.left + i * 6) })
		// 	.attr("y", d => height)
		// 	.attr("width", (d,i) => {return 2})
		// 	.attr("height", d => height - yScale(d.positiveIncrease))

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