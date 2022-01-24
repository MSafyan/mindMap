import React,{useRef,useEffect,useState} from 'react';
import { makeStyles } from '@material-ui/core/styles';
import {Button} from '@material-ui/core';
import moment from 'moment'

const useStyles = makeStyles((theme) => ({
  mainBar:{
    position:'relative',
    width:'80%',
    margin:'auto'
  },
  subBar:{
    position:'absolute',
    display:'flex'
  },
	lable: {
    height: '15px',
    width: '15px',
    backgroundColor: '#bbb',
    borderRadius: '50%',
    display: 'inline-block'
	},
}));
var hierarchicallySorted=[];
var nodeElments = [];

const EmptyProgress = ({elements}) => {
  const classes = useStyles();
  const ref = useRef(null);
  const [divWidth,setDivWidth]=useState(0);
  const [durationElements,setDurationElements] = useState([]);

  const init = new Date()
  const [date, setDate] = useState(init)

  const tick = () => {
    setDate(new Date())
  }

  useEffect(() => {
    const timerID = setInterval(() => totalDuration(elements), 10000)
    return () => {
      clearInterval(timerID)
    }
  }, [])

  useEffect(() => {
    console.log('width', ref.current ? ref.current.offsetWidth : 0);
    setDivWidth(ref.current?.offsetWidth || 0);
  }, [ref]);

  useEffect(()=>{
    console.log(elements);
    totalDuration(elements);
  },[elements])

  const totalDuration = (elements)=>{
    var Duration = 0;
    hierarchicallySorted=[];
    debugger;

    var startingNode = elements.filter((el)=>{
      const pattern = /^horizontal-0/;
      return pattern.test(el.id);
    })

    nodeElments = elements.filter((el)=>{
      const pattern = /^horizontal-/;
      return pattern.test(el.id);
    })
    findChildren(startingNode[0]);

    hierarchicallySorted.map((el)=>{
      Duration += el.estimatedDuration || 0;
      el.percent='0';
    })
  
    positionDots(hierarchicallySorted,Duration);
    CalculatePercentage();
    console.log(Duration);
  }

  const findChildren = (el)=>{
    // debugger;
    if(el?.child > 0){
      var number = 0;
      for(var a=0;a<el.child;a++){
        for(var b=0;b<nodeElments.length;b++){
          if(nodeElments[b].parent === el.id && nodeElments[b].number === number){
            number++;
            hierarchicallySorted.push(nodeElments[b])
            findChildren(nodeElments[b]);
          }
        }
      }
    }
    return;
  }

  const positionDots=(hierarchicallySorted,Duration)=>{
    // debugger;
    var assignedSpace = 0;
    for(var a=0;a<hierarchicallySorted.length;a++){
      hierarchicallySorted[a].percent = '0';
          hierarchicallySorted[a].startPoint = ( assignedSpace / Duration ) * divWidth ;
          hierarchicallySorted[a].width = (hierarchicallySorted[a].estimatedDuration / Duration) *divWidth;
          assignedSpace += hierarchicallySorted[a].estimatedDuration;
    }
  }



  const CalculatePercentage = ()=>{
    for(var a=0;a< hierarchicallySorted.length; a++){
      if(hierarchicallySorted[a].started){
        // debugger;
        const diff = moment().diff(hierarchicallySorted[a].startTime);
        hierarchicallySorted[a].percent = `${(diff / hierarchicallySorted[a].estimatedDuration) * 100}`; 
      }
    }
    setDurationElements(hierarchicallySorted);
  }

  return ( 
    <div ref={ref} className={classes.mainBar}>
      {
        durationElements.map((val)=>{
          return (
            <div className={classes.subBar} style={{left:val.startPoint,width:val.width}}>
              <span className={classes.lable}>
                
              </span>
              <progress value={val.percent} max='100' style={{width:'100%'}}/>
            </div>
          )
        })
      }
      <Button onClick={()=>totalDuration(elements)}>
        useEffect
      </Button>
    </div>
  );
};

export default EmptyProgress;
