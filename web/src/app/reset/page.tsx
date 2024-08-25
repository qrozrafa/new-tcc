'use client'
import { Layout } from "@/components/layout";
import { SnackbarContext } from "@/context/snackbar.context";
import { login } from "@/service/login";
import { resetPasswordUser } from "@/service/user";
import { useUserStore } from "@/store/user";
import { zodResolver } from "@hookform/resolvers/zod";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { Button, IconButton, InputAdornment, TextField } from "@mui/material";
import { useMutation } from "@tanstack/react-query";
import { useContext } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuthStore } from "@/store/auth";


export default function ResetPassword() {
  const pathName = useSearchParams();
  const router = useRouter();
  const useAuth = useAuthStore();
  const useUser = useUserStore();
  const snackbarContext = useContext(SnackbarContext);

  const editData = z.object({
    newPassword: z
      .string()
      .min(8, 'A senha deve ter pelo menos 8 caracteres')
      .regex(/[A-Z]/, 'A senha deve conter pelo menos uma letra maiúscula')
      .regex(/[a-z]/, 'A senha deve conter pelo menos uma letra minúscula')
      .regex(/[0-9]/, 'A senha deve conter pelo menos um número')
      .regex(/[^a-zA-Z0-9]/, 'A senha deve conter pelo menos um caractere especial'),
    showPassword: z.boolean().default(false).optional(),

  });

  type resetPasswordData = z.infer<typeof editData>

  const { register, watch, formState: { errors }, clearErrors, setValue, handleSubmit, setError } = useForm<resetPasswordData>({
    defaultValues: {
      newPassword: '',
      showPassword: false,
    },
    resolver: zodResolver(editData),
  });

  const { mutate: handlePassword, isPending: isLoading } = useMutation({
    mutationFn: async () => {
      const data = {
        password: watch('newPassword'),
        token: pathName.get('token'),
      }
      
      return await resetPasswordUser(data);

    },
    onSuccess: async (resp) => {
      snackbarContext.success('Senha resetada com sucesso!');
      const data = {
        email: resp?.user.email,
        password: watch('newPassword')
      };
  
      const response = await login(data);
  
      if(response) {
      useAuth.setToken(response?.access_token);
      useUser.setUser(response.user);
      router.push('/');
      }
    },
    onError: (error) => {
      snackbarContext.error(`Erro ao resetar senha! ${error}`);
    }
  })

  const handleClickShowPassword = () => {
    setValue('showPassword', !watch('showPassword'));
  };

  const handleMouseDownPassword = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
  }; 

  const onSubmit = handleSubmit(() => {
      handlePassword();
  })

  return (
    <Layout>
      <div className="w-[300px] flex flex-col justify-center gap-4 mx-auto">
      <TextField
        id="outlined-size-small" 
        variant="standard"
        placeholder="Digite sua senha"
        label="Nova senha:"
        type={watch('showPassword') ? 'text' : 'password'}
        color="success"
        {...register('newPassword')}
        onChange={
          () => {
            clearErrors('newPassword')
          }
        }
        error={Boolean(errors.newPassword)}
        size="small"
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <IconButton
                aria-label="toggle password visibility"
                onClick={handleClickShowPassword}
                onMouseDown={handleMouseDownPassword}
                edge="end"
              >
                {watch('showPassword') ? <VisibilityOff /> : <Visibility />}
              </IconButton>
            </InputAdornment>
          )
        }}
        helperText={errors.newPassword?.message}
      />

      <div className='flex flex-col gap-4 justify-center'>
        <Button 
          variant="contained"
          color="success"
          type="submit"
          fullWidth
          onClick={onSubmit}
          size="small"
          className="bg-green-600"
          disabled={isLoading}
        >
          Salvar
        </Button>
      </div>
    </div>
    </Layout>
  )
}