import { SnackbarContext } from "@/context/snackbar.context";
import { activeUser, disableUser, getUsers } from "@/service/user";
import { UserData } from "@/store/user";
import { Divisor } from "@/styles/styles";
import { AccountCircle, Edit, Search, Visibility, VisibilityOff } from "@mui/icons-material";
import { Button, CircularProgress, IconButton, Pagination, TextField, Tooltip, Typography } from "@mui/material";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { format } from "date-fns";
import { useContext, useState } from "react";
import ModalFormUser from "../Modais/ModalFormUser/ModalFormUser";
import Image from "next/image";

export default function ListUsers() {
  const queryClient = useQueryClient();
  const snackbarContext = useContext(SnackbarContext);

  const [search, setSearch] = useState<string>('');
  const [openModalFormUser, setOpenModalFormUser] = useState<boolean>(false);
  const [currentPage, setCurrentPage] = useState<Number | any>(1);
  const [usersPerPage] = useState<Number | any>(6);
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
      snackbarContext.success('Usuário desabilitada com sucesso!');
    } else {
      await activeUser(user.id as string);
      snackbarContext.success('Usuário habilitada com sucesso!');
    }
    await queryClient.refetchQueries({ queryKey: ['users'] });
  }

  async function handleUser(user: UserData) {
    await setSelectedUser(user);
    setOpenModalFormUser(true);
  }

  const filteredUsers = users?.filter(user => {
    return user.name.toLowerCase().includes(search.toLowerCase());
  })

  function paginate(pageNumber: any): void {
    return setCurrentPage(pageNumber);
  }

  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = filteredUsers?.slice(indexOfFirstUser, indexOfLastUser);

  return (
    <>
      {loadingUsers  && (
        <div className='flex justify-center w-full'>
          <CircularProgress color="success" />
        </div>
      )}
      <div className="flex justify-end w-full">
        <Button
          variant='contained'
          color='success'
          size='small'
          sx={{ width: 160 }}
          className='bg-green-500'
          onClick={() => setOpenModalFormUser(true)}
        >
          Adicionar usuário
        </Button>
      </div>
      {!loadingUsers && currentUsers && filteredUsers &&(
        <>
          <div className={`w-full mx-auto mt-4 gap-4 bg-zinc-200 py-4 px-3 flex justify-between rounded-lg`}>
            <TextField
              variant="standard"
              color="success"
              placeholder="Digita o usuário"
              className="w-full border-none"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />            
            <div className={`self-center`}>
              <Search color="success"/>
            </div>
          </div>
          {currentUsers?.length === 0 && (
            <Typography variant="body1" className="text-zinc-400 text-center">Nenhum usuário encontrado</Typography>
          )}
          {currentUsers?.length > 0 && (
          <div className={`w-full mx-auto mt-4 gap-4 bg-zinc-200 py-4 px-3 flex flex-col justify-between rounded-lg`}>
            {currentUsers?.map(user => (
              <>
                <div className="flex justify-between">
                  <div className="flex items-center gap-2">
                    {user?.image ? (
                      <Image
                        src={`${process.env.NEXT_PUBLIC_BASE_URL}/storage/user/${user.image}`}
                        alt="profile"
                        width={40}
                        height={40}
                        style={{ borderRadius: '50%', marginLeft: 4 }}
                    />
                    ) : (
                      <AccountCircle sx={{ color: 'rgb(22 163 74)', ml: 1, width: 40, height: 40 }}/>
                    )}
                    <div className={`flex flex-col`}>
                      <Typography variant='body1'className='font-bold text-green-500'><b>{user.name}</b></Typography>
                      <Typography variant='body2'className="text-zinc-400">{format(new Date(user.createdAt), 'dd/MM/yyyy')}</Typography>
                    </div>
                  </div>
                  <div className={`flex gap-2 self-start`}>
                    <Tooltip title="Editar Usuário">
                      <IconButton color="success" onClick={() => handleUser(user)}>
                        <Edit color="disabled"/>
                      </IconButton>
                    </Tooltip>
                    <Tooltip title={user.status === 'ACTIVE' ? 'Desabilitar Usuário' : 'Habilitar Usuário'}>
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
          {filteredUsers?.length > usersPerPage && (
            <div className={`w-full mx-auto mt-4 flex justify-center `}>
              <Pagination 
                count={Math.ceil(filteredUsers.length / usersPerPage)}
                color="standard"
                variant="outlined"
                shape="rounded"
                // showFirstButton={true}
                // showLastButton={true}
                hideNextButton={true}
                hidePrevButton={true}
                onChange={(e, value) => paginate(value)}
              />
            </div>
          )}
        </>
      )}

      {openModalFormUser && (
        <ModalFormUser
          user={selectedUser}
          open={openModalFormUser}
          handleClose={() => {
            setOpenModalFormUser(false)
            setSelectedUser({} as UserData);
            }
          }
        />
      )}
    </>
  )
}