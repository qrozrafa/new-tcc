'use client';
import MyAds from "@/components/MyAds/MyAds";
import { Layout } from "@/components/layout";
import { Edit, ListAlt, Password, Person } from "@mui/icons-material";
import { BottomNavigation, BottomNavigationAction, Box } from "@mui/material";
import { useState } from "react";

export default function ProfilePage() {
  const [tab, setTab] = useState(0);

  return (
    <Layout>
      <div className='flex flex-col gap-4 justify-center p-8'>
        <div className={`w-full mx-auto mt-4 gap-4 bg-zinc-200 py-4 px-3 flex flex-col justify-between rounded-lg`}>
          <Box>
            <BottomNavigation
              showLabels
              value={tab}
              onChange={(event, newValue) => {
                setTab(newValue);
              }}
              sx={{
                width: 350,
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
              <BottomNavigationAction label="Meus Anun." icon={<ListAlt />} />
              <BottomNavigationAction label="Editar Perfil" icon={<Edit />} />
              <BottomNavigationAction label="Editar Senha" icon={<Password />} />
            </BottomNavigation>
          </Box>

          {tab === 0 && (
            <MyAds />
          )}
        </div>
      </div>
    </Layout>
  );
}