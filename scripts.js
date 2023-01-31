let jsondata = "https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/GDP-data.json";
let req = new XMLHttpRequest();

let data
let values = [];

let heightScale
let xScale
let xAxisScale
let yAxisScale

let width = 1000;
let height = 600;
let padding = 40;

let svg = d3.select("svg")

let createCanvas = () => {
    svg.attr("width", width)
    svg.attr("height", height);
};

let createScales = () => {

    heightScale = d3.scaleLinear()
                    .domain([0,d3.max(values, (i) => {
                        return i[1]
                    })])
                    .range([0, height - (2*padding)])

    xScale = d3.scaleLinear()
                    .domain([0, values.length -1])
                    .range([padding, width - padding])

    let dates = values.map((i) => {
        return new Date(i[0])
    })

    xAxisScale = d3.scaleTime()
                    .domain([d3.min(dates), d3.max(dates)])
                    .range([padding, width-padding])

    yAxisScale = d3.scaleLinear()
                    .domain([0, d3.max(values, (i) => {
                        return i[1]
                    })])
                    .range([height - padding, padding ])

            svg.append("text")
                    .style("text-anchor", "middle")
                    .attr("fill", "black")
                    .text("United States GDP Data")
                    .style("font-size", "18px")
                    .style("fill", "black")
                    .attr("transform", "translate(65,280)rotate(-90)")

            svg.append("text")
                    .style("text-anchor", "top")
                    .attr("fill", "black")
                    .text("Billions of Dollars")
                    .style("font-size", "11px")
                    .style("font-weight", "400")
                    .style("fill", "black")
                    .attr("transform", "translate(3,25)");
};

let createBars =() => {

    let tooltip = d3.select("body")
                    .append("div")
                    .attr("id", "tooltip")
                    .style("visibility", "hidden")
                    .style("width", "auto")
                    .style("height", "auto")

                    

    svg.selectAll("rect")
        .data(values)
        .enter()
        .append("rect")
        .attr("class", "bar")
        .attr("width", (width - (2 * padding)) / values.length)
        .attr("data-date", (i) => {
            return i[0]
        })
        .attr("data-gdp", (i) => {
            return i[1]
        })
        .attr("height", (i) => {
            return heightScale(i[1])
        })
        .attr("x", (i, index) => {
            return xScale(index)
        })
        .attr("y", (i) => {
            return (height - padding) - heightScale(i[1])
        })
        .on("mouseover", (event, i) => {
            tooltip.transition()
                .style("visibility", "visible")
                .style("font-family", "Arial")
                .style("font-size", "18px")
                .style("color", "#17252A")
                .style("z-index", "10")

            tooltip.text("GDP value for " + i[0] + " amounts " + i[1] + " billions of dollars")

            document.querySelector("#tooltip").setAttribute("data-date", i[0])
        })
        .on("mouseout", (event, i) => {
            tooltip.transition()
                .style("visibility", "hidden")
                .style("z-index", "10")
        
        })
        svg.append("text")
            .attr("transform", "translate(500,595)")
            .style("text-anchor", "middle")
            .attr("fill", "black")
            .text("Dates")
            .style("font-size", "18px"); 
    };



let createAxes = () => {

    let xAxis = d3.axisBottom(xAxisScale)
    let yAxis = d3.axisLeft(yAxisScale)

    svg.append("g")
        .call(xAxis)
        .attr("id", "x-axis")
        .attr("transform", "translate(0, " + (height-padding) + ")")

    svg.append("g")
        .call(yAxis)
        .attr("id", "y-axis")
        .attr("transform", "translate(" + padding + ", 0)");
};

req.open("GET", jsondata, true);

req.onload = () => {
    data = JSON.parse(req.responseText)
    values = data.data
    console.log(values)
    createCanvas()
    createScales()
    createBars()
    createAxes();
};

req.send();
