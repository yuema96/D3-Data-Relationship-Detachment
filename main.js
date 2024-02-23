var button3 = document.getElementById("no-restrictions-button");




const MARGIN = { LEFT: 50, RIGHT: 50, TOP: 50, BOTTOM: 100 }


const WIDTH = 1800 - MARGIN.LEFT - MARGIN.RIGHT
const HEIGHT = 900 - MARGIN.TOP - MARGIN.BOTTOM


let flag = true


const svg = d3.select("#chart-area").append("svg")
  .attr("width", WIDTH + MARGIN.LEFT + MARGIN.RIGHT)
  .attr("height", HEIGHT + MARGIN.TOP + MARGIN.BOTTOM)


//create the border for visualizations
  createSVGRectangle(svg, "chart-group1", "chart-border", WIDTH / 4 + 100, HEIGHT / 4 + 100, 10, 10, MARGIN.LEFT + 6, MARGIN.TOP + 10);


  createSVGRectangle(svg, "chart-group2", "chart-border", WIDTH / 2 + 400, HEIGHT / 4 + 100, 10, 10, MARGIN.LEFT + 6, MARGIN.TOP + 410);
 
  // createSVGRectangle(svg, "chart-group3", "chart-border", WIDTH / 2 + 140, HEIGHT / 4 + 100, 10, 10, MARGIN.LEFT + 600, MARGIN.TOP + 10);
 


let selectedBars = [];
let selectedBars2 = [];
let links = [];
let individualDragMode = false;



//******************************************************************************************************************
//g1 starts here
//******************************************************************************************************************
const g1 = svg.append("g")
  .attr("transform", "translate(120, 100)")
  .attr("class", "chart-group1")
// X label
g1.append("text")
  .attr("class", "x axis-label")
  .attr("x", WIDTH / 8)
  .attr("y", HEIGHT/4+35)
  .attr("font-size", "20px")
  .attr("text-anchor", "middle")
  .text("Cylinders")


// Y label
const yLabel = g1.append("text")
  .attr("class", "y axis-label")
  .attr("x", - (HEIGHT / 8))
  .attr("y", -35)
  .attr("font-size", "20px")
  .attr("text-anchor", "middle")
  .attr("transform", "rotate(-90)")
  .text("count")


const x = d3.scaleBand()
  .range([0, WIDTH/4])
  .paddingInner(0.3)
  .paddingOuter(0.2)


const y = d3.scaleLinear()
  .range([HEIGHT/4, 0])


const xAxisGroup = g1.append("g")
  .attr("class", "x axis")
  .attr("transform", `translate(0, ${HEIGHT/4})`)


const yAxisGroup = g1.append("g")
  .attr("class", "y axis")


//******************************************************************************************************************
//g2 starts here
//******************************************************************************************************************
const g2 = svg.append("g")
  .attr("transform", "translate(120, 500)") // Adjust the translation to position it below the first visualization
  .attr("class", "chart-group2")






// Define scales and axes for the second visualization (similar to the first one)
const x2 = d3.scaleBand()
  .range([0, WIDTH/1.5])
  .paddingInner(0.3)
  .paddingOuter(0.2)


const y2 = d3.scaleLinear()
  .range([HEIGHT/4, 0])


const xAxisGroup2 = g2.append("g")
  .attr("class", "x axis")
  .attr("transform", `translate(0, ${HEIGHT/4})`)


const yAxisGroup2 = g2.append("g")
  .attr("class", "y axis")


  g2.append("text")
  .attr("class", "x axis-label")
  .attr("x", WIDTH / 4+100)
  .attr("y", HEIGHT/4+35)
  .attr("font-size", "20px")
  .attr("text-anchor", "middle")
  .text("ID")


// Y label
 g2.append("text")
  .attr("class", "y axis-label")
  .attr("x", - (HEIGHT / 8))
  .attr("y", -35)
  .attr("font-size", "20px")
  .attr("text-anchor", "middle")
  .attr("transform", "rotate(-90)")
  .text("Horsepower")


//******************************************************************************************************************
//Define the function for No Restrictions Button
//******************************************************************************************************************


function function3() {


  d3.csv("cars.csv").then(data => {


//*************************This Data is for the bottom left bar chart************************************************
      var categoryCount = {};
      // Create an empty dictionary
const carDictionary = {};
count=1
 // Loop through the first 50 cars in the data
 data.slice(0, 50).forEach(d=>{
  const name = count
  const horsepower = parseFloat(d.horsepower)
  const cylinders = parseInt(d.cylinders);


  // Add the car to the dictionary with name as the key and horsepower as the value
  carDictionary[name] = {horsepower,cylinders}
  count++;
});
// Convert the dictionary into an array of objects
const arrayOfDictionaries= Object.keys(carDictionary).map(function(key) {
  return { id: "C"+key, horsepower: carDictionary[key].horsepower, cylinders: carDictionary[key].cylinders};
});


console.log(arrayOfDictionaries);




//*****************************This data is for the top left chart****************************************************
data.forEach(function(d) {


  var category = d.cylinders;
  if (categoryCount[category]) {
      categoryCount[category]++;
  } else {
      categoryCount[category] = 1;
  }
});


var categoryData = Object.keys(categoryCount).map(function(category) {
  return { category: category, count: categoryCount[category] };
});


console.log(categoryData);
data.forEach(function(d, index) {
d.num = index + 1;
});
data.forEach(function(d) {
d.horsepower = +d.horsepower; // Convert to a numeric value
d.mpg = +d.mpg; // Convert to a numeric value
});
//*****************************Data preprocessing is end**************************************************************
//top left vis
      x.domain(categoryData.map(d => d.category))
      y.domain([0, d3.max(categoryData, d => d.count)])


      const xAxisCall = d3.axisBottom(x)
      xAxisGroup.call(xAxisCall)
       .selectAll("text")
         .attr("y", "10")
         .attr("x", "2")
         .attr("text-anchor", "end")
 
     const yAxisCall = d3.axisLeft(y)
       // .ticks(3)
       .tickFormat(d => d)
     yAxisGroup.call(yAxisCall)
//Bottom left vis
      x2.domain(arrayOfDictionaries.map(d => d.id))
      y2.domain([0, d3.max(arrayOfDictionaries, d => d.horsepower)])


      const xAxisCall2 = d3.axisBottom(x2)
      xAxisGroup2.call(xAxisCall2)
       .selectAll("text")
         .attr("y", "10")
         .attr("x", "2")
         .attr("text-anchor", "end")
   
     const yAxisCall2 = d3.axisLeft(y2)
       // .ticks(3)
       .tickFormat(d => d)
     yAxisGroup2.call(yAxisCall2)


//*****************************Top left Vis starts here****************************************************  
      const rects = g1.selectAll("rect")
      .data(categoryData)
      .enter().append("rect")
      .attr("class", "bar") // Add the class "bar" to your actual bars
      .attr("y", d => y(d.count))
      .attr("x", (d) => x(d.category))
      .attr("width", x.bandwidth)
      .attr("height", d => HEIGHT/4 - y(d.count))
      .attr("fill", "steelblue")
      .on("click", function(event, d) {
   
     
        const isSelected = selectedBars.includes(d);
       
        if (isSelected) {
            // If the bar is already selected, remove it from the selection
            selectedBars = selectedBars.filter(bar => bar !== d);


        } else {
            // If the bar is not selected, add it to the selection
            selectedBars.push(d);
       
        }
        updateBarColors();
        console.log("Selected Bars from the top left vis",selectedBars);


      })


      .call(d3.drag()
      .on("start", function (event, d) {
       
        if (!individualDragMode) {

        selectedBars.forEach(selectedBar => {
          selectedBar.initialX = event.x - MARGIN.LEFT - x.bandwidth() / 2+350;
          selectedBar.initialY = event.y - MARGIN.TOP;


           // Store the initial x position and width of the bars
    // selectedBar.initialXPos = x(selectedBar.category)
    selectedBar.initialXPos = x(selectedBar.category)+selectedBar.initialX/2-300
    selectedBar.initialWidth = x.bandwidth();


     // Store the initial y position and height of the bars
    //  selectedBar.initialYPos = y(selectedBar.count)
     selectedBar.initialYPos = y(selectedBar.count)+selectedBar.initialY/2
     selectedBar.initialHeight = HEIGHT / 2 - y(selectedBar.count);


          // Store the current category being dragged
        draggedCategory = selectedBar.category;


//new
// Store the current x and y positions of the selected bars
selectedBar.xPos = d3.select(this).attr("x");
selectedBar.yPos = d3.select(this).attr("y");
       
      }
      );
   
           }
       else{    
           d.initialX = event.x - MARGIN.LEFT- x.bandwidth() / 2+350;
           d.initialY = event.y - MARGIN.TOP;

           // Store the current x and y positions of the selected bars
d.xPos = d3.select(this).attr("x");
d.yPos = d3.select(this).attr("y");

       } 
      })
 
      .on("drag", function(event, d) {

        if (!individualDragMode) {
       // Calculate the new x and y positions based on drag movement
       const newX = event.x - MARGIN.LEFT - x.bandwidth() / 2;
       const newY = event.y - MARGIN.TOP;


         selectedBars.forEach(selectedBar => {
          const correspondingBar = rects.filter(barData => barData === selectedBar);
          const gap = x.bandwidth()-61; // Adjust the gap as needed
          const newXPos = selectedBar.initialXPos + (newX - selectedBar.initialX) + (gap * selectedBars.indexOf(selectedBar))+450;
          const newYPos = selectedBar.initialYPos+newY-100;
          correspondingBar
            .attr("fill", "orange")
            .attr("x", newXPos+100)
            .attr("y", newYPos)
          // Show the corresponding drag placeholder
        const correspondingPlaceholder = dragPlaceholders.filter(p => p.category === selectedBar.category);
        correspondingPlaceholder.style("display", "block");


        //new
                  // Update the x and y positions of the selected bars
                  selectedBar.xPos = newXPos+250
                  selectedBar.yPos = newYPos+120
                  updateLinks();
       
         })
        }
        else {

 
          const newX = event.x - MARGIN.LEFT - x.bandwidth() / 2;
       const newY = event.y - MARGIN.TOP;
          
    
          // Move the bar to the new position
          d3.select(this)
            .attr("x", newX+50)
            .attr("y", newY);
         // Update the x and y positions of the selected bars
                  d.xPos = newX+200
                  d.yPos = newY+120
                  updateLinks();
          
          if (selectedBars.includes(d)) {
            selectedBars = selectedBars.filter(bar => bar !== d);
            }
      
            
        }

        }
     
        )
      .on("end", function() {


  selectedBars.forEach(selectedBar => {
    const correspondingBar = rects.filter(barData => barData === selectedBar);
    correspondingBar.attr("fill", "steelblue");
  })
 
 
      })
        )
        .on("mouseenter", function (event, d) {
          // Change the fill of the corresponding placeholder when hovering over the bar
          const correspondingPlaceholder = dragPlaceholders.filter(p => p.category === d.category);
          correspondingPlaceholder.attr("fill", "orange");
        })
        .on("mouseleave", function (event, d) {
          // Change the fill of the corresponding placeholder back when leaving the bar
          const correspondingPlaceholder = dragPlaceholders.filter(p => p.category === d.category);
          correspondingPlaceholder.attr("fill", "none");
        })
        .on("dblclick", function (event, d) {
       
 // Handle double-click to deselect the bar
 if (selectedBars.includes(d)) {
  selectedBars = selectedBars.filter(bar => bar !== d);
  updateBarColors();
}
       
             })




//*****************************Top left vis is end *************************************************************


//*****************************Bottom left Vis starts here**************************************************************


   const rects2 = g2.selectAll("rect")
      .data(arrayOfDictionaries)
      .enter().append("rect")
      .attr("class", "bar") // Add the class "bar" to your actual bars
      .attr("id", d =>  d.id)
      .attr("y", d => y2(d.horsepower))
      .attr("x", (d) => x2(d.id))
      .attr("width", x2.bandwidth)
      .attr("height", d => HEIGHT/4 - y2(d.horsepower))
      .attr("fill", "steelblue")
      .call(d3.drag()
      .on("start", function (event, d) {

        if (!individualDragMode) {


        selectedBars2.forEach(selectedBar => {
          selectedBar.initialX = event.x - MARGIN.LEFT - x2.bandwidth() / 2+175;
          selectedBar.initialY = event.y - MARGIN.TOP;


           // Store the initial x position and width of the bars
    // selectedBar.initialXPos = x(selectedBar.category)
    selectedBar.initialXPos = x2(selectedBar.id)+selectedBar.initialX/2-200;
    selectedBar.initialWidth = x2.bandwidth();


     // Store the initial y position and height of the bars
    //  selectedBar.initialYPos = y(selectedBar.count)
     selectedBar.initialYPos = y2(selectedBar.horsepower)+selectedBar.initialY/2-50
     selectedBar.initialHeight = HEIGHT / 2 - y2(selectedBar.horsepower);


          // Store the current category being dragged
        draggedCategory = selectedBar.id;




        //new
// Store the current x and y positions of the selected bars
selectedBar.xPos = d3.select(this).attr("x");
selectedBar.yPos = d3.select(this).attr("y");
       
      }
      );
    }
else {
  d.initialX = event.x - MARGIN.LEFT- x2.bandwidth() / 2+175;
  d.initialY = event.y - MARGIN.TOP;

  // Store the current x and y positions of the selected bars
d.xPos = d3.select(this).attr("x");
d.yPos = d3.select(this).attr("y");
}

 
       
           })
 
      .on("drag", function(event, d) {

        if (!individualDragMode) {
       // Calculate the new x and y positions based on drag movement
       const newX = event.x - MARGIN.LEFT - x2.bandwidth() / 2;
       const newY = event.y - MARGIN.TOP;


         selectedBars2.forEach(selectedBar => {
          const correspondingBar = rects2.filter(barData => barData === selectedBar);
          const gap = x2.bandwidth()-15; // Adjust the gap as needed
          const newXPos = selectedBar.initialXPos + (newX - selectedBar.initialX) + (gap * selectedBars2.indexOf(selectedBar));
          const newYPos = selectedBar.initialYPos+newY;
          correspondingBar
            .attr("fill", "orange")
            .attr("x", newXPos)
            .attr("y", newYPos)
          // Show the corresponding drag placeholder
        const correspondingPlaceholder = dragPlaceholders2.filter(p => p.id === selectedBar.id);
        correspondingPlaceholder.style("display", "block");
 

        //new for links
        selectedBar.xPos =newXPos+130
        selectedBar.yPos = newYPos+510
        updateLinks();
     
     
      })
    }
    else {
      const newX = event.x - MARGIN.LEFT - x2.bandwidth() / 2;
      const newY = event.y - MARGIN.TOP;
         
   
         // Move the bar to the new position
         d3.select(this)
           .attr("x", newX+50)
           .attr("y", newY);
        // Update the x and y positions of the selected bars
                 d.xPos = newX+180
                 d.yPos = newY+510
                 updateLinks();
      //when switch between enable and disable individual bar dragging, the individually dragged bar should be removed from the selected bars
      //in this way, when switch back to the group draging, the individually dragged bars will not follow the group.
       if (selectedBars2.includes(d)) {
            selectedBars2 = selectedBars2.filter(bar => bar !== d);
           }
           
    }
   
        }
     
        )
      .on("end", function() {


  selectedBars2.forEach(selectedBar => {
    const correspondingBar = rects2.filter(barData => barData === selectedBar);
    correspondingBar.attr("fill", "steelblue");
  })
 
 
      })
        )


        .on("mouseenter", function (event, d) {
          // Change the fill of the corresponding placeholder when hovering over the bar
          const correspondingPlaceholder = dragPlaceholders2.filter(p => p.id === d.id);
          correspondingPlaceholder.attr("fill", "orange");
        })
        .on("mouseleave", function (event, d) {
          // Change the fill of the corresponding placeholder back when leaving the bar
          const correspondingPlaceholder = dragPlaceholders2.filter(p => p.id === d.id);
          correspondingPlaceholder.attr("fill", "none");
        })
        .on("dblclick", function (event, d) {
       
          // Handle double-click to deselect the bar
          if (selectedBars2.includes(d)) {
            selectedBars2 = selectedBars2.filter(bar => bar !== d);
            updateBarColors2();
          }
       
             })


//*****************************Bottom left Vis ends here**************************************************************


//*****************************Bottom left Vis's brushing starts here*************************************************
const brush = d3.brushX()
  .extent([[120, 490], [1255, 700]])
  .on("end", brushed);


  svg.append("g")
  .attr("class", "brush")
  .call(brush);


 svg.append("g")
  .attr("class", "brush")
  .call(brush)
  .style("pointer-events", "none"); // Disable pointer events for the brush initially


function brushed(event) {
  const selection = event.selection;


  // Reset all bars to their original color
  svg.selectAll(".bar").attr("class", "bar");


  // Log currently selected bars
  if (selection) {
    const selectedBars = arrayOfDictionaries.filter(d =>{
      // x2(d.id) >= selection[0] && x2(d.id) + x2.bandwidth() <= selection[1]
    const barStartX = x2(d.id)+120;
    const barEndX = barStartX + x2.bandwidth();
    const selectionStartX = selection[0];
    const selectionEndX = selection[1];


    // Check if the bar is fully or partially inside the selection box
    return (barStartX >= selectionStartX && barEndX <= selectionEndX) ||
           (barStartX <= selectionEndX && barEndX >= selectionStartX);}
    );


    // Change the class of selected bars to 'selected' for styling
    selectedBars.forEach(selectedBar => {
      svg.select(`#${selectedBar.id}`)
      .attr("fill", "pink")
        // .attr("class", "bar selected");
    });


    selectedBars2 = selectedBars2.concat(selectedBars);
     // Remove the brush after the selection is made
    //  svg.select(".brush").remove();
    console.log("Selected bars from bottom left vis:", selectedBars2);
    // // Hide the brush after the selection is made
    // brushGroup.style("display", "none");


  } else {
    console.log("No bars selected.");
  }
}


const showBrushButton = document.getElementById("show-brush-button");
showBrushButton.addEventListener("click", showBrush);


const hideBrushButton = document.getElementById("hide-brush-button");
hideBrushButton.addEventListener("click", hideBrush);
function hideBrush() {
  console.log("button is clicked");
  // Hide the brush by setting its style to 'none'
  svg.select(".brush").remove();
}


function showBrush() {
  svg.append("g")
    .attr("class", "brush")
    .call(brush);
brushGroup = svg.select(".brush"); // Update brushGroup reference
}
//*****************************Bottom left Vis's brushing ends here**************************************************


//*****************************All the placeholders******************************************************************
//top left's vis Placeholders
const dragPlaceholders = g1.selectAll(".drag-placeholder")
.data(categoryData)
.enter()
// .append("rect")
.insert("rect", "rect.bar") // Insert before the bars
.attr("class", "drag-placeholder")
.attr("width", x.bandwidth())
.attr("height", d => HEIGHT / 4 - y(d.count))
.attr("fill", "none")
.attr("stroke", "purple")
.attr("stroke-dasharray", "5,5")
.attr("x", d => x(d.category))
.attr("y", d => y(d.count) )
.style("display", "none")
.attr("pointer-events", "all") // This allows the transparent rectangle to capture events
.style("cursor", "pointer") // Change cursor style to indicate clickability
.on("dblclick", function (event, d) {
  // Prevent the double-click event from propagating to the bars
event.stopPropagation();
// Handle double-click on the transparent rectangle
d3.select(this).style("display", "none"); // Hide the transparent rectangle
const correspondingBar = rects.filter(barData => barData.category === d.category);
correspondingBar
.transition()
.duration(500)
.attr("x", d => x(d.category))
.attr("y", d => y(d.count))
.attr("fill", "steelblue");

//remove the links as well
links = links.filter(link => link.source.category !== d.category);
  updateLinks();

})


//bottom left's vis Placeholders
const dragPlaceholders2 = g2.selectAll(".drag-placeholder")
.data(arrayOfDictionaries)
.enter()
// .append("rect")
.insert("rect", "rect.bar") // Insert before the bars
.attr("class", "drag-placeholder")
.attr("width", x2.bandwidth())
.attr("height", d => HEIGHT / 4 - y2(d.horsepower))
.attr("fill", "none")
.attr("stroke", "purple")
.attr("stroke-dasharray", "5,5")
.attr("x", d => x2(d.id))
.attr("y", d => y2(d.horsepower) )
.style("display", "none")
.attr("pointer-events", "all") // This allows the transparent rectangle to capture events
.style("cursor", "pointer") // Change cursor style to indicate clickability
.on("dblclick", function (event, d) {
  // Prevent the double-click event from propagating to the bars
event.stopPropagation();
// Handle double-click on the transparent rectangle
d3.select(this).style("display", "none"); // Hide the transparent rectangle
const correspondingBar = rects2.filter(barData => barData.id === d.id);
correspondingBar
.transition()
.duration(500)
.attr("x", d => x2(d.id))
.attr("y", d => y2(d.horsepower))
.attr("fill", "steelblue");

//remove the links as well
links = links.filter(link => link.target.id !== d.id);
  updateLinks();
  
})




//****************************Update bar colors!!******************************************************************
//top left
function updateBarColors() {


  g1.selectAll("rect.bar") // Add a class "bar" to your actual bars
    .attr("fill", (d) => (selectedBars.includes(d) ? "pink" : "steelblue"))


}
//bottom left
 function updateBarColors2() {


  g2.selectAll("rect.bar")
    .attr("fill", (d) => (selectedBars2.includes(d) ? "pink" : "steelblue"))


}
//****************************Create Links for selected bars from different groups************************************
function createLinks() {


  // Iterate through the selected bars in group A (selectedBars) and group B (selectedBars2)
  for (const barA of selectedBars) {
    for (const barB of selectedBars2) {
      if (barA.category == barB.cylinders) {
        // Match found, create a link between barA and barB
        console.log("I found",barB)
        drawLink(barA, barB);
      }
      else{
        console.log("i did not find")
      }
    }
  }
}


function drawLink(barA, barB) {
  // Calculate the coordinates for the line (link) between the two bars.
  const link = {
    source: barA,
    target: barB,
  };


  links.push(link);
  // Draw the line between the two bars.
  svg.append("line")
    .attr("x1", barA.xPos)
    .attr("y1", barA.yPos)
    .attr("x2", barB.xPos)
    .attr("y2", barB.yPos)
    .attr("stroke", "green")
    .attr("stroke-width", 1);
}


function updateLinks() {
  svg.selectAll("line").remove(); // Remove all existing links


  links.forEach((link) => {
    svg
      .append("line")
      .attr("x1", link.source.xPos)
      .attr("y1", link.source.yPos)
      .attr("x2", link.target.xPos)
      .attr("y2", link.target.yPos)
      .attr("stroke", "green")
      .attr("stroke-width", 1);
  });
}




const createLinksButton = document.getElementById("create-links-button");
createLinksButton.addEventListener("click", createLinks);


const clearLinksButton = document.getElementById("clear-links-button");


clearLinksButton.addEventListener("click", clearLinks);


function clearLinks() {
  // Remove all the links from the SVG
  svg.selectAll("line").remove();
}

const individualDragButton = document.getElementById("individual-drag-button");
individualDragButton.addEventListener("click", toggleIndividualDrag);

function toggleIndividualDrag() {
  individualDragMode = !individualDragMode;
  
  if (individualDragMode) {
    individualDragButton.textContent = "Disable Individual Bar Dragging";
  } else {
    individualDragButton.textContent = "Enable Individual Bar Dragging";
  }
}


//The end of data brackets
    });
 
    }


//******************************************************************************************************************
//function for No Restrictions Button is end
//******************************************************************************************************************
function createSVGRectangle(svg, classValue, idValue, width, height, rx, ry, translateX, translateY) {
  svg.append("rect")
    .attr("class", classValue)
    .attr("id", idValue)
    .attr("width", width)
    .attr("height", height)
    .attr("rx", rx)
    .attr("ry", ry)
    .attr("transform", `translate(${translateX}, ${translateY})`);
}






button3.addEventListener("click", function3);


    // Define a function to clear the selectedBars array
function clearSelection() {
  selectedBars=[];
  selectedBars2= [];


}


// Attach a click event listener to the clear selection button
const clearSelectionButton = document.getElementById("clear-selection-button");
clearSelectionButton.addEventListener("click", clearSelection);

