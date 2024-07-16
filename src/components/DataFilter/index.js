import { Box, MenuItem, FormControl, InputLabel, Select } from "@material-ui/core";
import React, { useState } from "react";

export function DataFilter({ onFiltered }) {
  const [selected, setSelected] = useState("DESC"); // ASC como default

  const onChange = (event) => {
    const value = event.target.value;
    setSelected(value);
    onFiltered(value);
  };

  const options = [
    { name: 'Mais novo', value: 'DESC' },
    { name: 'Mais antigo', value: 'ASC' },
  ];

  return (
    <Box style={{ padding: 10}}>
      <FormControl variant="outlined" fullWidth>
        <InputLabel>Filtro por tempo</InputLabel>
        <Select
          value={selected}
          onChange={onChange}
          label="Filtro por tempo"
        >
          {options.map((option) => (
            <MenuItem key={option.value} value={option.value}>
              {option.name}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </Box>
  );
}
