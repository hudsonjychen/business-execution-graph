import * as React from 'react';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';

export default function ProcessSizeCongig({ items, itemName, setItem }) {

  const handleChange = (event) => {
    setItem(event.target.value);
  };

  return (
    <div>
      <FormControl sx={{ m: 1, width: 300 }}>
        <InputLabel id="process-size-config">Process Size</InputLabel>
        <Select
          labelId="process-size-config"
          id="pro-size-config"
          value={itemName}
          label='Process Size'
          onChange={handleChange}
        >
          {items.map((item) => (
            <MenuItem key={item} value={item}>
              {item}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </div>
  );
}

