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
		borderRadius:'1rem',
    width:'0.5em',
    background:'red'
	},
}));
var hierarchicallySorted=[];
var nodeElments = [];

const EmptyProgress = ({elements}) => {
  const classes = useStyles();
  const ref = useRef(null);
  const [divWidth,setDivWidth]=useState(0);
  const [durationElements,setDurationElements] = useState([]);

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
    // debugger;

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
      for(var a=0;a<nodeElments.length;a++){
        if(nodeElments[a].parent === el.id){
          hierarchicallySorted.push(nodeElments[a])
          findChildren(nodeElments[a]);
        }
      }
    }
    return;
  }

  const positionDots=(hierarchicallySorted,Duration)=>{
    // debugger;
    var assignedSpace = 0;
    for(var a=0;a<hierarchicallySorted.length;a++){
      // hierarchicallySorted[a].percent = '0';
      // for(var b=0;b<hierarchicallySorted.length;b++){
        // var found = hierarchicallySorted[b].id === temp[a].id;
        // if(found){
          hierarchicallySorted[a].startPoint = ( assignedSpace / Duration ) * divWidth ;
          hierarchicallySorted[a].width = (hierarchicallySorted[a].estimatedDuration / Duration) *divWidth;
          assignedSpace += hierarchicallySorted[a].estimatedDuration;
          // if(temp[a].started){
          //   debugger;
          //   const diff = moment().diff(temp[a].startTime);
          //   temp[a].percent = (diff / temp[a].duration) * 100;
            
          // }

          // for(var c=0;c<temp.length;c++){
          //   for(var d=1;d<=temp.length;d++){
          //     if(temp[c].id === `horizontal-${c}-${d}`){
          //       temp[c].startPoint = ( assignedSpace / Duration ) * divWidth ;
          //       temp[c].width = (temp[c].duration / Duration) *divWidth;
          //       assignedSpace += temp[c].duration;
          //     }
          //   }
          // }
        // }
      // }
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
                1
              </span>
              <progress value={val.percent} max='100' style={{width:'100%'}}/>
            </div>
          )
        })
      }
      <progress value='0' max='100' style={{width:'100%'}}/>
      <Button onClick={()=>totalDuration(elements)}>
        useEffect
      </Button>
      <Button onClick={()=>CalculatePercentage()}>
        CalculatePercentage
      </Button>
    </div>
  );
};

export default EmptyProgress;
