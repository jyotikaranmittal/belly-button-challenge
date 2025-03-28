// Build the metadata panel
function buildMetadata(sample) {
  let dropdownMenu = d3.select("#selDataset");

  d3.json("https://static.bc-edx.com/data/dl-1-2/m14/lms/starter/samples.json").then((data) => {
    // get the metadata field
  let metadata = data.metadata;
  console.log("Metadata Field:", metadata);

    // Filter the metadata for the object with the desired sample number
  let result = metadata.find(obj => obj.id == sample);
  console.log(`Metadata for Sample ${sample}:`, result);


    // Use d3 to select the panel with id of `#sample-metadata`
  let panel = d3.select("#sample-metadata");
  console.log(`Metadata for Sample ${sample}:`, result);


    // Use `.html("") to clear any existing metadata
  panel.html("");
  console.log("Clearing existing metadata...");

    // Inside a loop, you will need to use d3 to append new
    // tags for each key-value in the filtered metadata.
    Object.entries(result).forEach(([key, value]) => {
      console.log(`Appending Metadata - Key: ${key}, Value: ${value}`);
      panel.append("h6").text(`${key.toUpperCase()}: ${value}`);
    })
  });
}

// function to build both charts
function buildCharts(sample) {
  console.log(`buildCharts called with sample: ${sample}`);

  d3.json("https://static.bc-edx.com/data/dl-1-2/m14/lms/starter/samples.json").then((data) => {
    console.log("Full Data:", data);

    // Get the samples field
    let samples = data.samples;
    console.log("Samples Field:", samples);

    // Filter the samples for the object with the desired sample number
    let result = samples.find(obj => obj.id == sample);
    console.log(`Sample Data for Sample ${sample}:`, result);
   // Get the otu_ids, otu_labels, and sample_values

    let otu_ids = result.otu_ids;
    let otu_labels = result.otu_labels;
    let sample_values = result.sample_values;
    console.log("OTU IDs:", otu_ids);
    console.log("OTU Labels:", otu_labels);
    console.log("Sample Values:", sample_values);

    // Build a Bubble Chart
    let bubbleLayout = {
      title: "Bacteria Cultures Per Sample",
      xaxis: { title: "OTU ID" },
      hovermode: "closest"
    };

    let bubbleData = [{
      x: otu_ids,
      y: sample_values,
      text: otu_labels,
      mode: "markers",
      marker: {
        size: sample_values,
        color: otu_ids,
        colorscale: "Earth"
      }
    }];
    console.log("Rendering Bubble Chart...");
    // Render the Bubble Chart
    Plotly.newPlot("bubble", bubbleData, bubbleLayout);

    // For the Bar Chart, map the otu_ids to a list of strings for your yticks
    let yticks = otu_ids.slice(0, 10).map(id => `OTU ${id}`).reverse();
    console.log("Rendering Bar Chart...");
    // Build a Bar Chart
    let barData = [{
      x: sample_values.slice(0, 10).reverse(),
      y: yticks,
      text: otu_labels.slice(0, 10).reverse(),
      type: "bar",
      orientation: "h"
    }];

    let barLayout = {
      title: "Top 10 Bacteria Cultures Found",
      margin: { t: 30, l: 150 }
    };
    console.log("Rendering Bar Chart...");
    // Don't forget to slice and reverse the input data appropriately
    // Render the Bar Chart
    Plotly.newPlot("bar", barData, barLayout);
  });
}

// Function to run on page load
function init() {
  console.log("Initializing dashboard...");

  d3.json("https://static.bc-edx.com/data/dl-1-2/m14/lms/starter/samples.json").then((data) => {
    console.log("Full Data:", data);
    // Get the names field
    let sampleNames = data.names;
    console.log("Sample Names:", sampleNames);
    // Use d3 to select the dropdown with id of `#selDataset`
    let dropdownMenu = d3.select("#selDataset");
    console.log("Populating dropdown menu...");
    // Use the list of sample names to populate the select options
    // Hint: Inside a loop, you will need to use d3 to append a new
    // option for each sample name.
    sampleNames.forEach((sample) => {
      dropdownMenu.append("option").text(sample).property("value", sample);
      console.log(`Added dropdown option: ${sample}`);
    });

    // Get the first sample from the list
     // Build charts and metadata panel with the first sample
    let firstSample = sampleNames[0];
    console.log(`First Sample: ${firstSample}`);
    buildCharts(firstSample);
    buildMetadata(firstSample);
  });
}


// Function for event listener
function optionChanged(newSample) {
  console.log(`New sample selected: ${newSample}`);

  // Build charts and metadata panel each time a new sample is selected
  buildCharts(newSample);
  buildMetadata(newSample);

}

// Initialize the dashboard
init();