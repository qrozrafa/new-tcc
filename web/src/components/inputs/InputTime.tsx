import { TextField } from "@mui/material";
import { useState } from "react";
import InputMask from "@mona-health/react-input-mask";

export type TInputTime = {
  label?: string;
  value: string;
  onChange: (value: string) => void;
}

export function InputTime({label, value, onChange}: TInputTime) {
  const [time, setTime] = useState<string>(value);

  const handleChange = (hours: string) => {
    const inputTime = hours;
    const isValidFormat = /^([01]?[0-9]|2[0-3]):[0-5][0-9]$/.test(inputTime);

    if (isValidFormat) {
      const [hours, minutes] = inputTime.split(':');
      const hoursNum = parseInt(hours, 10);
      const minutesNum = parseInt(minutes, 10);

      if (hoursNum <= 23 && minutesNum <= 59) {
        setTime(inputTime);
        onChange(inputTime);
      }
    }
  };

  return (
      <TextField
        label={label}
        color="success"
        variant="standard"
        placeholder="__:__"
        type="time"
        id="time"
        name="time"
        value={time}
        onChange={(event) => {
          handleChange(event.target.value);
        }}
        required
      />
    );
  }
