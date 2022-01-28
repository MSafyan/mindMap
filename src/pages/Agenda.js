import React,{useContext} from 'react';
import Layout from '../components/Layout';
import {AppContext} from '../context';
import {Typography} from '@material-ui/core';

const Agenda = () => {

  const {durationElements} = useContext(AppContext);

  const listItems = durationElements.map((number) =>{
    if(number.position.x <= 250){
      return <Typography 
        style={{marginLeft:`${number.position.x / 250}rem`}} 
        variant="body1"key={number.id}>{number.data.label}</Typography>
    }else if(number.position.x == 500){
      return <Typography 
        style={{marginLeft:`${number.position.x / 250}rem`}} 
        variant="body1"key={number.id}>{number.data.label}</Typography>
    }
    else{
      return <Typography 
      style={{marginLeft:`${number.position.x / 250}rem`}} 
      variant="body1"key={number.id}>{number.data.label}</Typography>
    }
  }
  );

  return <Layout>
    <ul>
      {listItems}
    </ul>
  </Layout>;
};

export default Agenda;