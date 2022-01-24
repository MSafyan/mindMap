import { Button } from '@material-ui/core';
import React, { useState, useEffect, useCallback } from 'react';
import EmptyProgress from '../components/emptyProgress';
import './Test.css'
import data from '../consts/test';
import moment from 'moment';
import Layout from '../components/Layout';
import NodeDialog from '../components/dialog';
import Counter from '../components/Counter';
import ColorSelectorNode from '../components/ColorSelectorNode';
// import Moment from 'react-moment';

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
  textNode: ColorSelectorNode,
};

const CustomNodeFlow = () => {
  const [reactflowInstance, setReactflowInstance] = useState(null);
  const [elements, setElements] = useState([]);
  const [selectedElement, setSelectedElement] = useState(null);

  const onElementClick = (event, element) => {
    setSelectedElement(element);
    setElements((els) =>
        els.map((el) => {
          if (el.id === element.id) {
            // it's important that you create a new object here
            // in order to notify react flow about the change
            el.style = { ...el.style, backgroundColor: '#b6ffff' };
          }else{
            // el.style = { ...el.style, backgroundColor: '#red' };
          }
          // console.log(el.style)
          return el;
        })
      );
    console.log('click', element)
  };

  var columnMaxChildCount = [];
  var newConvertedArray = [];
  var columnOneElements 
  var columnTwoElements 
  var columnTheeElements 
  var columnFourElements
  var combinedColumns=[];

  const convertToReactFlow = () =>{
    combinedColumns = [
      ...columnOneElements, ...columnTwoElements,
      ...columnTheeElements, ...columnFourElements]
      // debugger;

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
          style: {background:'#e5e5e5'}
        })
      }else{
        newConvertedArray.push({ 
          id : `horizontal-${combinedColumns[a].key}`,
          sourcePosition : 'right',
          targetPosition : 'left',
          number : combinedColumns[a].number,
          parent:`horizontal-${combinedColumns[a].parent}`,
          type : combinedColumns[a].node ? 'default' : 'textNode',
          estimatedDuration:combinedColumns[a]?.estimatedDuration || 100000,
          started: combinedColumns[a]?.started || undefined,
          startTime: combinedColumns[a]?.startTime || undefined,
          data : {
            label : combinedColumns[a].text
          },
          child : combinedColumns[a].child,
          position:combinedColumns[a].position,
          style:combinedColumns[a].node ? {background:'#e5e5e5'} : {borderBottom:'1px solid #777',borderLeft:'1px solid #777',background:'transparent'}
        })
        newConvertedArray.push({
          id: `e${combinedColumns[a].parent}-${combinedColumns[a].key}`,
          source:  `horizontal-${combinedColumns[a].parent}`,
          target: `horizontal-${combinedColumns[a].key}`,
          style: { stroke: '#001318' },
        })
      }
    }
    // debugger;
    setElements(newConvertedArray);
  }

  const setColumns = () =>{
    columnOneElements = set1stColumn(data);
    columnTwoElements = setOtherColumns(columnOneElements,1);
    columnTheeElements = setOtherColumns(columnTwoElements,2);
    columnFourElements = setOtherColumns(columnTheeElements,3);

    assignMultiplier();
    
    setPositioncolumnOne(columnOneElements);
    setPositionOtherColumns(columnTwoElements,columnOneElements,columnMaxChildCount[1].multiplier);
    // debugger;
    setPositionOtherColumns(columnTheeElements,columnTwoElements,columnMaxChildCount[2].multiplier);
    setPositionOtherColumns(columnFourElements,columnTheeElements,1);
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
    // debugger;
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
            // debugger;
            if(columnElements[b]?.child > 0){
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
                y : parentColumnElements[a].position.y + ( 60 * saver)}
            }
          }
        }
      }
    }
  }

  const AddNode =()=>{
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
            text:'hey there',
            key:`${parseInt(selectedElement.id.slice(11))}${elements[a].child}`
          })
          setColumns();
          console.log(data);
        }
      }
    }
  }

  const startTask=()=>{
    // debugger;
    const unSelectedElements = elements.filter((el)=>{
      return el.id !== selectedElement.id
    })
    const SelectedElements = elements.filter((el)=>{
      return el.id === selectedElement.id
    })

    SelectedElements[0].started = true;
    SelectedElements[0].startTime = moment();

    setElements([...unSelectedElements,...SelectedElements]);
    console.log(elements);
  }

  useEffect(() => {
    setColumns();
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
    <Layout>
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
          <Controls />
        </ReactFlow>
        <Button onClick={()=>AddNode()}>
          Add
        </Button>

        <NodeDialog AddNode={AddNode}/>

        <Button onClick={()=>startTask()}>
          Start Task
        </Button>

        <Button onClick={()=>setColumns()}>
          setColumns
        </Button>

        <Counter/>

        <EmptyProgress elements={elements}/>
      </div>
    </Layout>
  );
};

export default CustomNodeFlow;