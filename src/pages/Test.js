import { Button } from '@material-ui/core';
import React, { useState, useEffect, useCallback,useContext } from 'react';
import EmptyProgress from '../components/emptyProgress';
import './Test.css'
import data from '../consts/test';
import {gray,blue} from '../consts/test';
import moment from 'moment';
import Layout from '../components/Layout';
import NodeDialog from '../components/dialog';
// import Counter from '../components/Counter';
import TextNode from '../components/TextNode';
import TopicNode from '../components/TopicNode';
// import Moment from 'react-moment';
import { toast } from "react-toastify";
import { AppContext,RecordingContext } from '../context';
import {red} from '../consts/test'


import ReactFlow, {
  removeElements,
  addEdge,
  Controls,
} from 'react-flow-renderer';
const onNodeDragStop = (event, node) => console.log('drag stop', node);
const initBgColor = '#fff';

const connectionLineStyle = { stroke: '#fff' };
const snapGrid = [20, 20];
const nodeTypes = {
  textNode: TextNode,
  topicNode:TopicNode
};

const CustomNodeFlow = () => {
  const [reactflowInstance, setReactflowInstance] = useState(null);
  const [elements, setElements] = useState([]);
  const [selectedElement, setSelectedElement] = useState(null);
  const { durationElements, setDurationElements } = useContext(AppContext);
  const { setRecording } = useContext(RecordingContext);

  const [count,setCount]=useState(0);
  const [nodeText,setNodeText]=useState('');
  const [percentage,setPercentage]=useState('0')


  const onElementClick = (event, element) => {
    setElements((els) =>
    els.map((el) => {
      if (el.id === element.id) {
            setSelectedElement(el);
            // it's important that you create a new object here
            // in order to notify react flow about the change
            el.style = { ...el.style, backgroundColor: red };
          }else{
            if(el.type !== 'textNode'){
              el.style = { ...el.style, backgroundColor: gray };
            }else if(el.type === 'textNode'){
              el.style = { ...el.style, backgroundColor:'white' }
            }
          }
          // console.log(el)
          return el;
        })
      );
    // console.log('click', element)
  };

  var columnMaxChildCount = [];
  var newConvertedArray = [];
  var columnOneElements 
  var columnTwoElements 
  var columnTheeElements 
  var columnFourElements
  var combinedColumns=[];
  var unSelectedElements=[];
  var SelectedElements=[];
  var blueElements =[]
  var SelectedElementsTextChild=[];

  const convertToReactFlow = () =>{
    combinedColumns = [
      ...columnOneElements, ...columnTwoElements,
      ...columnTheeElements, ...columnFourElements]
      debugger;

    for(var a=0; a<combinedColumns.length; a++){
      if(combinedColumns[a].parent === undefined){
        newConvertedArray.push({
          id : 'horizontal-0',
          sourcePosition :'right',
          type : 'input',
          data : {
            label : combinedColumns[a].text
          },
          child : combinedColumns[a].child,
          position : combinedColumns[a].position,
          style: {backgroundColor:'#e5e5e5'}
        })
      }else{
        var bg = gray;
        // for(var c=0; c<combinedColumns.length;c++){
          if(combinedColumns[a].key===1){
            bg = blue
            // setSelectedElement(els=>[...els,combinedColumns[a]]);
          }
        // }

        newConvertedArray.push({ 
          id : `horizontal-${combinedColumns[a].key}`,
          sourcePosition : 'right',
          targetPosition : 'left',
          number : combinedColumns[a].number,
          parent:`horizontal-${combinedColumns[a].parent}`,
          type : combinedColumns[a].node ? 'topicNode' : 'textNode',
          estimatedDuration:combinedColumns[a]?.estimatedDuration || 100000,
          started: combinedColumns[a]?.started || undefined,
          startTime: combinedColumns[a]?.startTime || undefined,
          data : {
            label : combinedColumns[a].text,
            started: combinedColumns[a]?.started,
            CompleteTask: CompleteTask
          },
          child : combinedColumns[a].child,
          position:combinedColumns[a].position,
          style:combinedColumns[a].node ? 
          {backgroundColor:bg ,padding:'0.5rem',border:'1px solid #777'} : {borderBottom:'1px solid #777',borderLeft:'1px solid #777',backgroundColor:'white'}
        })
        newConvertedArray.push({
          id: `e${combinedColumns[a].parent}-${combinedColumns[a].key}`,
          source:  `horizontal-${combinedColumns[a].parent}`,
          target: `horizontal-${combinedColumns[a].key}`,
          style: { stroke: '#001318' },
        })
      }
    }
    debugger;
    setElements(newConvertedArray);
    console.log(elements);
  }

  const setColumns = () =>{
    columnOneElements = set1stColumn(data);
    columnTwoElements = setOtherColumns(columnOneElements,1);
    columnTheeElements = setOtherColumns(columnTwoElements,2);
    columnFourElements = setOtherColumns(columnTheeElements,3);

    assignMultiplier();
    
    setPositioncolumnOne(columnOneElements);
    setPositionOtherColumns(columnTwoElements,columnOneElements,columnMaxChildCount[1].multiplier);
    setPositionOtherColumns(columnTheeElements,columnTwoElements,columnMaxChildCount[2].multiplier);
    setPositionOtherColumns(columnFourElements,columnTheeElements,1);
    
    blueElements.push(columnTwoElements[0]);


    console.log(elements);

    convertToReactFlow();
  }

  const set1stColumn = (data)=>{
    for(var a=0;a<data.length;a++){
      if(data[a].parent === undefined){
        data[a].column = 1;
        return [data[a]];
      }
    }
  }

  const setOtherColumns = (columnElements,columnRank)=>{
    var newColumnElements= [];
    var childCount = 0;
    var maxCount = 0;
    for(var a=0;a<columnElements.length;a++){
      for(var b=0;b<data.length;b++){
        if(data[b].parent === columnElements[a].key){
          data[b].column = columnRank;
          data[b].number = childCount;
          newColumnElements.push(data[b]);
          childCount++;
          if(columnElements[a].child === undefined){
            columnElements[a].child = 1;
          }else{
            columnElements[a].child += 1;
          }
        }
      }
      if(maxCount <= childCount){
        maxCount = childCount;
      }
      childCount = 0;
    }
    columnMaxChildCount.push({
      columnRank,
      maxCount    
    })
    return newColumnElements;
  }

  const assignMultiplier=()=>{
    for(var a=columnMaxChildCount.length - 1;a >= 0; a--){
      if(columnMaxChildCount[a+1]===undefined){
        columnMaxChildCount[a].multiplier = Math.ceil(columnMaxChildCount[a].maxCount/2) +2;
      }else{
        columnMaxChildCount[a].multiplier = 
        (Math.floor(columnMaxChildCount[a].maxCount/2) +1) * columnMaxChildCount[a+1].multiplier;
      }
    }
  }

  const setPositioncolumnOne =(columnOneElements)=>{
    for(var a = 0; a< columnOneElements.length; a++){
      columnOneElements[a].position = {x:0,y:0};
    }
  }

  const setPositionOtherColumns = (columnElements,parentColumnElements,multiplier) =>{
    for(var a=0;a<parentColumnElements.length;a++){
      for(var b=0;b<columnElements.length;b++){
        if(parentColumnElements[a].key === columnElements[b].parent){
          if(parentColumnElements[a].child === undefined){
            return;
          }
          else if(columnElements[b].number === 0){
            columnElements[b].position = {
              x : parentColumnElements[a].position.x + 250,
              y : parentColumnElements[a].position.y
            }
          }
          else {
            var saver;
            if(columnElements[b]?.number > 0){
              saver = (multiplier * Math.ceil(columnElements[b].number / 2) );
            }else{
              saver = 1.5;
            }
            if(columnElements[b].number % 2 === 0){
              columnElements[b].position =  {
                x : parentColumnElements[a].position.x + 250 , 
                y : parentColumnElements[a].position.y + (-60 * saver)}
            }else{
              columnElements[b].position =  {
                x : parentColumnElements[a].position.x + 250 , 
                y : parentColumnElements[a].position.y + ( 60 * saver)
              }
            }
          }
        }
      }
    }
  }

  const AddNode =()=>{
    if(!selectedElement.id){
      return toast.warn('Please select a Node first')
    }else if(selectedElement.type==='textNode'){
      return toast.warn('Can not add to text Node')
    }else if(selectedElement.position.x>=750){
      return toast.warn('Can not add to this Column');
    }
    if(selectedElement){
      for(var a=0;a<elements.length;a++){
        if(elements[a].id===selectedElement.id){
          if(elements[a].child){
            elements[a].child++;
          }else{
            elements[a].child=1;
          }

          // debugger;
          data.push({
            parent:parseInt(selectedElement.id.slice(11)),
            text:nodeText,
            key:`${parseInt(selectedElement.id.slice(11))}${elements[a].child}`
          })
          setColumns();
          console.log(data);
        }
      }
    }
    setRecording(false);
  }

  const startTask=(durationChild)=>{
    debugger;
    // setSelectedElement(el);

    if(durationChild){
      unSelectedElements = elements.filter((el)=>{
        if(el.id !== durationChild.id && el.type !== 'textNode'){
          el.style = {...el.style,background:gray}
          return true;
        } 
        return false;
      })

      
      SelectedElements = elements.filter((el)=>{
        return el.id === durationChild.id
      })

      var unSelectedElementsTextChild = elements.filter((el)=>{
        if(el.parent !== durationChild.id && el.type ==='textNode'){
          el.style = {...el.style,background:'white'};
          return true;
        }
        return false;
      })

      SelectedElementsTextChild = elements.filter((el)=>{
        if(el.parent === durationChild.id && el.type ==='textNode'){
          el.style = {...el.style,background:blue};
          return true;
        }
        return false;
      })

      SelectedElements[0].started = true;
      SelectedElements[0].startTime = moment();
      SelectedElements[0].style = {...SelectedElements[0].style,background:blue};
      SelectedElements[0].data.started = true;
      SelectedElements[0].data.CompleteTask = CompleteTask;

      setElements([...unSelectedElements,...SelectedElements,...SelectedElementsTextChild, ...unSelectedElementsTextChild]);

    }else{
      unSelectedElements = elements.filter((el)=>{
        return el.style.background!==blue
      })
      SelectedElements = elements.filter((el)=>{
        return el.style.background===blue
      })
      if(!SelectedElements[0]){
        SelectedElements = elements.filter((el)=>{
          return el.id === 'horizontal-1'
        })
      }
      if(SelectedElements[0].started !==true){
        SelectedElements[0].started = true;
        SelectedElements[0].startTime = moment();
        SelectedElements[0].data.started = true;
        SelectedElements[0].data.CompleteTask = CompleteTask;

      }
  
      setElements([...unSelectedElements,...SelectedElements]);
      console.log(elements);
    }
    // setCount((count)=> ++count)
  }

  const CompleteTask =()=>{
    debugger;
    for(var a=0;a<elements.length;a++){
      // elements[a].style = {...elements[a].style,background:gray}

      if(elements[a].started === true){
        elements[a].started = false;
        elements[a].completed = true;


        for(var b=0;b<durationElements.length;b++){
          if(durationElements[b].id===elements[a].id){
            var c=1;
            while(durationElements[b+c].type==='textNode'){
              c++
            }
            startTask(durationElements[b+c]);
          }
        }
      }
    }
    console.log('form text hi');
  }

  useEffect(() => {
    setColumns();
    setSelectedElement(blueElements[0]);

  }, []);

  useEffect(() => {
    if (reactflowInstance && elements.length > 0) {
      reactflowInstance.fitView();
    }
  }, [reactflowInstance, elements.length]);

  const onElementsRemove = useCallback(
    (elementsToRemove) =>
      setElements((els) => removeElements(elementsToRemove, els)),
    []
  );
  const onConnect = useCallback(
    (params) =>
      setElements((els) =>
        addEdge({ ...params, animated: true, style: { stroke: '#fff' } }, els)
      ),
    []
  );

  const onLoad = useCallback(
    (rfi) => {
      if (!reactflowInstance) {
        setReactflowInstance(rfi);
        console.log('flow loaded:', rfi);
      }
    },
    [reactflowInstance]
  );

  return (
    <Layout durationElements={durationElements}  CompleteTask={CompleteTask} startTask={()=>{startTask()}} selectedElement={selectedElement}>
      <div style={{height:'30em'}}>
        <ReactFlow
          elements={elements}
          onElementClick={onElementClick}
          onElementsRemove={onElementsRemove}
          onConnect={onConnect}
          onNodeDragStop={onNodeDragStop}
          style={{ background: initBgColor }}
          onLoad={onLoad}
          nodeTypes={nodeTypes}
          connectionLineStyle={connectionLineStyle}
          snapToGrid={true}
          snapGrid={snapGrid}
          defaultZoom={1.5}
        >
          {/* <Controls /> */}
        </ReactFlow>

        {/* <Counter/> */}

        <EmptyProgress elements={elements} durationElements={durationElements} setDurationElements={setDurationElements}/>
        <NodeDialog nodeText={nodeText} setNodeText={setNodeText} AddNode={AddNode}/>
      </div>
    </Layout>
  );
};

export default CustomNodeFlow;