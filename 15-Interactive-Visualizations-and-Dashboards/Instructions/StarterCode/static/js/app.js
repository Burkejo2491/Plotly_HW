function demographic(sampleID){
    d3.json("samples.json").then((sampleData)=>{
        var metadata = sampleData.metadata;

        var filterData = metadata.filter(row => row.id ==sampleID);
        console.log(filterData)
        var results = filterData[0];

        var demographicDisplay = d3.select("#sample-metadata");
        demographicDisplay.html("")
        Object.entries(results).forEach(([key,value])=>{
            demographicDisplay.append("h6").text(`${key.toUpperCase()}: ${value}`)
        })
    })
}

function buildChart(sample){
    d3.json("samples.json").then((sampleData) => {
        var samples = sampleData.samples;
        var resultsArray = samples.filter(sampleobject => sampleobject.id == sample);
        var result = resultsArray[0];
        var otu_ids = result.otu_ids;
    var otu_labels = result.otu_labels;
    var sample_values = result.sample_values;
    // Build a Bubble Chart
    var bubbleLayout = {
      title: "Bacteria Cultures Per Sample",
      margin: { t: 0 },
      hovermode: "closest",
      xaxis: { title: "OTU ID" },
      margin: { t: 30}
    };
    var bubbleData = [
      {
        x: otu_ids,
        y: sample_values,
        text: otu_labels,
        mode: "markers",
        marker: {
          size: sample_values,
          color: otu_ids,
          colorscale: "Earth"
        }
      }
    ];
    Plotly.newPlot("bubble", bubbleData, bubbleLayout);
    var yticks = otu_ids.slice(0, 10).map(otuID => `OTU ${otuID}`).reverse();
    var barData = [
      {
        y: yticks,
        x: sample_values.slice(0, 10).reverse(),
        text: otu_labels.slice(0, 10).reverse(),
        type: "bar",
        orientation: "h",
      }
    ];
    var barLayout = {
      title: "Top 10 Bacteria Cultures Found",
      margin: { t: 30, l: 150 }
    };
    Plotly.newPlot("bar", barData, barLayout);
  });
}

function init() {
    // Grab a reference to the dropdown select element
    var selector = d3.select("#selDataset");
    
    // Use the list of sample names to populate the select options
    d3.json("samples.json").then((sampleData) => {
      var sampleNames = sampleData.names;
      sampleNames.forEach((sample) => {
        selector
          .append("option")
          .text(sample)
          .property("value", sample);
      });
    
      // Use the first sample from the list to build the initial plots
      const firstSample = sampleNames[0];
      buildChart(firstSample);
      demographic(firstSample);
    });
    }
    
    function optionChanged(newSample) {
    // Fetch new data each time a new sample is selected
    buildChart(newSample);
    demographic(newSample);
    }
    
    
    
    // Initialize the dashboard
    init();