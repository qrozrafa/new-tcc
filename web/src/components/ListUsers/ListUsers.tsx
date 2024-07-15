import { SnackbarContext } from "@/context/snackbar.context";
import { activeUser, disableUser, getUsers } from "@/service/user";
import { UserData } from "@/store/user";
import { Divisor } from "@/styles/styles";
import { Edit, Visibility, VisibilityOff } from "@mui/icons-material";
import { CircularProgress, IconButton, Tooltip, Typography } from "@mui/material";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { format } from "date-fns";
import { useContext, useState } from "react";
import ModalEditUser from "../ModalEditUser/ModalEditUser";

export default function ListUsers() {
  const queryClient = useQueryClient();
  const snackbarContext = useContext(SnackbarContext);

  const [openModalEditUser, setOpenModalEditUser] = useState<boolean>(false);
  const [selectedUser, setSelectedUser] = useState<UserData>();


  const { data: users, isFetching: loadingUsers } = useQuery<UserData[]>({
    queryKey: ['users'],
    queryFn: async () => {
      return await getUsers();
    },
  });

  async function handleVisibleUser(user: UserData) {
    if (user.status === 'ACTIVE') { 
      await disableUser(user.id as string);
      snackbarContext.success('Usuario disabilidata com sucesso!');
    } else {
      await activeUser(user.id as string);
      snackbarContext.success('Usuario habilitada com sucesso!');
    }
    await queryClient.refetchQueries({ queryKey: ['users'] });
  }

  async function handleUser(user: UserData) {
    await setSelectedUser(user);
    setOpenModalEditUser(true);
  }

  return (
    <>
      {loadingUsers  && (
        <div className='flex justify-center w-full'>
          <CircularProgress color="success" />
        </div>
      )}
      {!loadingUsers && users && (
        <>
          {users?.length > 0 && (
          <div className={`w-full mx-auto mt-4 gap-4 bg-zinc-200 py-4 px-3 flex flex-col justify-between rounded-lg`}>
            {users?.map(user => (
              <>
                <div className="flex justify-between">
                  <div className={`flex flex-col`}>
                    <Typography variant='body1'className='font-bold text-green-500'><b>{user.name}</b></Typography>
                    <Typography variant='body2'className="text-zinc-400">{format(new Date(user.createdAt), 'dd/MM/yyyy')}</Typography>
                  </div>
                  <div className={`flex gap-2 self-start`}>
                    <Tooltip title="Editar usuario">
                      <IconButton color="success" onClick={() => handleUser(user)}>
                        <Edit color="disabled"/>
                      </IconButton>
                    </Tooltip>
                    <Tooltip title={user.status === 'ACTIVE' ? 'Desabilitar usuario' : 'Habilitar usuario'}>
                      <IconButton color="success"  onClick={() => handleVisibleUser(user)}>
                        {user.status === 'ACTIVE' ? <Visibility color="disabled"/> : <VisibilityOff color="disabled"/>}
                      </IconButton>
                    </Tooltip>
                  </div>
                </div>
                <Divisor />
              </>
            ))}
          </div>
        )}
        </>
      )}

      {openModalEditUser && selectedUser && (
        <ModalEditUser
          user={selectedUser}
          open={openModalEditUser}
          handleClose={() => setOpenModalEditUser(false)}
        />
      )}
    </>
  )
}