'use client'
import AllAds from "@/components/AllAds/AllAds";
import ListSubjects from "@/components/ListSubjects/ListSubjects";
import ListUsers from "@/components/ListUsers/ListUsers";
import { Layout } from "@/components/layout";
import { BookSharp, ListAlt, Person3 } from "@mui/icons-material";
import { BottomNavigation, BottomNavigationAction, Box, Typography } from "@mui/material";
import { useState } from "react";

export default function Painel() {
  const [tab, setTab] = useState(0);

  return (
    <Layout>
      <div className='flex flex-col gap-4 justify-center p-8 w-full max-w-3xl'>
        <div>
          <div className="flex w-full items-center">
            <Typography variant='h4' className='text-green-500 font-bold whitespace-nowrap mr-2'>Painel</Typography>
            <span className="bg-green-500 w-full h-2 rounded"/>
            <br/>
          </div>
        </div>
        <span className="bg-red-500 w-full h-2 rounded"/>
        <div className={`w-full mx-auto mt-4 gap-4 bg-zinc-200 py-4 px-3 flex flex-col justify-center rounded-lg`}>
          <Box>
            <BottomNavigation
              showLabels
              value={tab}
              onChange={(event, newValue) => {
                setTab(newValue);
              }}
              sx={{
                width: 308,
                borderRadius: 4,
                margin: 'auto',
                bgcolor: 'rgb(241 245 249)',
                '& .Mui-selected': {
                  color: 'rgb(34 197 94)'
                },
                '& .MuiBottomNavigationAction-root': {
                  color: 'rgb(107 114 128)'
                },
                '& .MuiSvgIcon-root': {
                  color: 'rgb(107 114 128)'
                },
                '& .MuiSvgIcon-selected': {
                  color: 'rgb(34 197 94)'
                }
              }}
            >
              <BottomNavigationAction label="Anuncios" icon={<ListAlt />} />
              <BottomNavigationAction label="Disciplinas" icon={<BookSharp />} />
              <BottomNavigationAction label="Usuários" icon={<Person3 />} />
            </BottomNavigation>
          </Box>
          {tab === 0 && (
            <AllAds />
          )}
          {tab === 1 && (
            <ListSubjects />
          )}
          {tab === 2 && (
            <ListUsers />
          )}
        </div>
      </div>
    </Layout>
  )
}