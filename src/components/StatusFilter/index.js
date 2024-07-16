import { Box, MenuItem, FormControl, InputLabel, Select } from "@material-ui/core";
import React, { useState } from "react";

export function StatusFilter({ onFiltered }) {
  const [selected, setSelected] = useState(undefined); // Inicializar com "Todos" como padrão

  const onChange = (event) => {
    const value = event.target.value;
    setSelected(value);
    onFiltered(value);
  };

  const options = [
    { name: 'Todos', value: undefined },
    { name: 'Pendentes', value: "pending" },
    { name: 'Em atendimento', value: "open" },
    { name: 'Finalizado', value: "closed" },
  ];

  return (
    <Box style={{ padding: 10 }}>
      <FormControl variant="outlined" fullWidth>
        <InputLabel>Filtro por status</InputLabel>
        <Select
          value={selected}
          onChange={onChange}
          label="Filtro por status"
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
