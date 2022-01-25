import React from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import DialogTitle from '@material-ui/core/DialogTitle';
import {Typography,Dialog} from '@material-ui/core';
import { blue } from '@material-ui/core/colors';
import StopIcon from '@material-ui/icons/Stop';
import {red} from '../consts/test'
import FormatListBulletedIcon from '@material-ui/icons/FormatListBulleted';
import IconButton from '@material-ui/core/IconButton';


const emails = ['username@gmail.com', 'user02@gmail.com'];
const useStyles = makeStyles({
  avatar: {
    backgroundColor: blue[100],
    color: blue[600],
  },
});

function SimpleDialog(props) {
  const classes = useStyles();
  const { onClose, selectedValue, open,durationElements } = props;

  const listItems = durationElements.map((number) =>{
    if(number.position.x <= 250){
      return <Typography 
        style={{marginLeft:`${number.position.x / 250}rem`}} 
        variant="h4"key={number.id}>{number.data.label}</Typography>
      // return <div style={{marginLeft:`${number.position.x / 250}rem`}} key={number.id}>{number.data.label}</div>
    }else if(number.position.x == 500){
      return <Typography 
        style={{marginLeft:`${number.position.x / 250}rem`}} 
        variant="h5"key={number.id}>{number.data.label}</Typography>
      // return <div style={{marginLeft:`${number.position.x / 250}rem`}} key={number.id}>{number.data.label}</div>
    }
    else{
      return <Typography 
      style={{marginLeft:`${number.position.x / 250}rem`}} 
      variant="body1"key={number.id}>{number.data.label}</Typography>
    }
  }
  );
  const handleClose = () => {
    // debugger;
    console.log(durationElements)
    onClose(selectedValue);
  };

  return (
    <Dialog onClose={handleClose} aria-labelledby="simple-dialog-title" open={open}>
      <div>
        <DialogTitle id="simple-dialog-title" style={{background:'black',color:'white'}}>Agenda</DialogTitle>
          <div style={{padding:'1rem', fontSize:'14px'}}>
            <ul>{listItems}</ul>
          </div>
        <div style={{display:"flex",justifyContent:'flex-end'}}> 
          <Button style={{background:"#c4c4c4",margin:'1rem'}} onClick={()=>{handleClose()}}>
            Cancel
          </Button>
        </div>
      </div>
    </Dialog>
  );
}

SimpleDialog.propTypes = {
  onClose: PropTypes.func.isRequired,
  open: PropTypes.bool.isRequired,
  selectedValue: PropTypes.string.isRequired,
};

export default function SimpleDialogDemo({durationElements}) {
  const [open, setOpen] = React.useState(false);
  const [selectedValue, setSelectedValue] = React.useState(emails[1]);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = (value) => {
    setOpen(false);
    setSelectedValue(value);
  };

  return (
    <div style={{display:"inline-block"}}>
      <label htmlFor="Agenda List">
        <IconButton onClick={()=>{
          console.log(durationElements);
          handleClickOpen()}} color="primary" aria-label="upload picture" component="span">
          <FormatListBulletedIcon />
        </IconButton>
      </label>
      <SimpleDialog durationElements={durationElements} selectedValue={selectedValue} open={open} onClose={handleClose} />
    </div>
  );
}