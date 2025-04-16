import * as React from 'react';
import OutlinedInput from '@mui/material/OutlinedInput';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import ListItemText from '@mui/material/ListItemText';
import Select from '@mui/material/Select';
import Checkbox from '@mui/material/Checkbox';

export default function ObjectFilterBox( {objects, objectName, setObject} ) {

  const handleChange = (event) => {
    const { value } = event.target;

    if (value.includes('all')) {
      if (objectName.length === objects.length) {
        setObject([]);
      } else {
        setObject(objects);
      }
    } else {
      setObject(typeof value === 'string' ? value.split(',') : value);
    }
  };

  const handleCheckboxClick = (object) => {
    if (object === 'all') {
      if (objectName.includes('all')) {
        setObject([]);
      } else {
        setObject(objects);
      }
    } else {
      if (objectName.includes(object)) {
        const newSelection = objectName.filter((item) => item !== object);
        if (newSelection.includes('all')) {
          newSelection.splice(newSelection.indexOf('all'), 1);
        }
        if (newSelection.length === 0) {
          return;
        }
        setObject(newSelection);
      } else {
        const newSelection = [...objectName, object];
        if (newSelection.length === objects.length - 1) {
          newSelection.push('all');
        }
        setObject(newSelection);
      }
    }
  };

  return (
    <div>
      <FormControl sx={{ m: 1, width: 300 }}>
        <InputLabel id="object-filter">Object</InputLabel>
        <Select
          labelId="object-filter"
          id="obj-fil"
          multiple
          value={objectName}
          onChange={handleChange}
          input={<OutlinedInput label="Object" />}
          renderValue={(selected) => selected.join(', ')}
        >
          {objects.map((object) => (
            <MenuItem key={object} value={object}>
              <Checkbox
                checked={objectName.includes(object)}
                onChange={() => handleCheckboxClick(object)}
              />
              <ListItemText primary={object} />
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </div>
  );
}