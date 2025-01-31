import { FilterList, FilterListOff, Search } from "@mui/icons-material";
import { Button, TextField, Typography } from "@mui/material";
import { Fragment, useState } from "react";

type TFilterAd = {
  title?: string;
  search: string
  filterLastAds: boolean
  onSearch: (value: string) => void
  onFilteredDate: (value: boolean) => void
}

export function FilterAd({ title = '', filterLastAds, search, onFilteredDate, onSearch }: TFilterAd) {
  return (
    <Fragment>
      <div className={`w-full mx-auto mt-4 gap-4 bg-zinc-200 py-4 px-3 flex justify-between rounded-lg`}>
        <TextField
          variant="standard"
          color="success"
          placeholder={title ? title : "Digita a matéria ou criador"}
          className="w-full border-none"
          value={search}
          onChange={(e) => onSearch(e.target.value)}
        />            
        <div className={`self-center`}>
          <Search color="success"/>
        </div>
      </div>

      <div className="flex self-end items-center">
        <Button
          variant="text"
          color="success"
          onClick={() => onFilteredDate(!filterLastAds)}
          >
          <Typography variant="body1" className="text-zinc-400">{filterLastAds ? 'Mais recente' : 'Mais antigo'}</Typography>
          {filterLastAds ? <FilterListOff color="disabled"/> : <FilterList color="disabled"/>}
        </Button>                
      </div>
    </Fragment>
  )
}