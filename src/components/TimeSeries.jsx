import React, { useEffect, useRef, useState } from "react";
import MOCK_DATA from "../utils/mockData";
import * as d3 from "d3";
import TimeSeriesWrapper from "./TimeSeries.style";
import { HEADER_TEXT, NEXT_48_MONTHS, PREVIOUS_48_MONTHS,DATE_RANGE } from "../utils/constants";

const TimeSeries = ({width,height}) => {

    const[data,setData]=useState([]);
    const [startDateString, setStartDateString]=useState(DATE_RANGE.start);
    const [disablePrevious, setDisablePrevious]=useState(false);
    const [disableNext, setDisableNext]=useState(false);

    useEffect(()=>{
      if(data.length>0){
        drawChart();
      }
      else
        getURLData();

      //disable previous and next buttons as per the date falls beyond range;
      if(startDateString===DATE_RANGE.start){

        setDisablePrevious(true);
        setDisableNext(false);
      }
      else if(new Date(startDateString)>=new Date(DATE_RANGE.end)){
        setDisablePrevious(false);
        setDisableNext(true);
      }
      else{
        setDisablePrevious(false);
        setDisableNext(false);
      }
    },[data])


    function handlePrevious(){
      const startDate=new Date(startDateString);
      const prevDate=new Date(startDate.setMonth(startDate.getMonth()-48));
      setStartDateString(prevDate.toLocaleDateString());
      setData([]);
    }

    function handleNext(){
      const startDate=new Date(startDateString);
      const nextDate=new Date(startDate.setMonth(startDate.getMonth()+48));
      setStartDateString(nextDate.toLocaleDateString());
      setData([]);
    }


    const getURLData=()=>{

      //pickup data from local Storage if it is present
      if(localStorage.getItem(startDateString)!==null){
        const storedData=JSON.parse(localStorage.getItem(startDateString)).map((data,index)=>{

          //convert data stored in local storage into suitable format for graph plotting
          return {
            ...data,date:d3.timeParse("%m/%d/%Y")(new Date(data.date).toLocaleDateString())
          }
          
        });
        setData(storedData);
      }
      else{

        let tempData=[];

        const ind=MOCK_DATA.findIndex((data)=>data[0]===startDateString);
        MOCK_DATA.map((data,index)=>{
            if(index>=ind && index<=(ind+49))
             tempData.push({date:d3.timeParse("%m/%d/%Y")(data[0]),value: parseFloat(data[1])});

        })

        setData(tempData);
        localStorage.setItem(startDateString,JSON.stringify(tempData));


      }

      return 1;
      
    }

    const drawChart = () => {

        //deleting previous svg content if any
        d3.selectAll('svg').remove();

        // establish margins
        const margin = { top: 10, right: 50, bottom: 50, left: 50 };
    
        // create the chart area
        const svg = d3
            .select(`#time_series`)
            .append('svg')
            .attr('width', width + margin.left + margin.right)
            .attr('height', height + margin.top + margin.bottom)
            .append('g')
            .attr('transform', `translate(${margin.left},${margin.top})`);

        svg.selectAll('*').remove();

    
    // Add X axis --> it is a date format
        var x = d3.scaleTime()
          .domain(d3.extent(data, function(d) { return d.date; }))
          .range([ 0, width ]);
          
        svg.append("g")
          .attr("transform", "translate(0," + height + ")")
          .call(d3.axisBottom(x));
    
    
        // Add Y axis
        var y = d3.scaleLinear()
          .domain([0, d3.max(data, function(d) { return +d.value; })])
          .range([ height, 0 ]);
        svg.append("g")
          .call(d3.axisLeft(y));

        

        // set line coordinates
        const line = d3.line()
          .x(function(d) { return x(d.date) })
          .y(function(d) { return y(d.value) })

    
        // Add the line
        svg.append("path")
          .datum(data)
          .attr("fill", "none")
          .attr("stroke", "steelblue")
          .attr("stroke-width", 2.5)
          .attr("d", line)
        
     }


  return (
    <TimeSeriesWrapper>
      <h1>{HEADER_TEXT}</h1>
      <div className="container">
        <button title={PREVIOUS_48_MONTHS}
        onClick={handlePrevious}
        disabled={disablePrevious}
        >⏮️
        </button>

        <div id="time_series"/>

        <button title={NEXT_48_MONTHS} 
        onClick={handleNext}
        disabled={disableNext}
        >⏭️
        </button>

      </div>
    </TimeSeriesWrapper>
  )
};

export default TimeSeries;
