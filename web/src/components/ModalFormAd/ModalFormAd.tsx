import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import { useContext, useEffect, useState } from 'react';
import { Button, FormControlLabel, FormGroup, Switch, TextField, ToggleButton, ToggleButtonGroup, Typography } from '@mui/material';
import { DetailAd, TOptions } from '@/type/ads';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { TSubjects } from '@/type/subject';
import { InputTime } from '../inputs/InputTime';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useUserStore } from '@/store/user';
import { createAd, updateAd } from '@/service/formAd';
import { format, set } from 'date-fns';
import { SnackbarContext } from '@/context/snackbar.context';
import { getSubjects } from '@/service/subject';
import Subject from '@/app/subject/[id]/page';

const style = {
  position: 'absolute' as 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'rgb(241 245 249)',
  borderRadius: 4,
  boxShadow: 24,
  p: 4,
  gap: 8,
}; 

type TModalForm = {
  open: boolean;
  ad?: DetailAd;
  subjects: TSubjects[];
  handleClose: () => void;
}

export default function ModalFormAd({ open, ad, subjects, handleClose }: TModalForm) {
  const queryClient = useQueryClient();
  const useUser = useUserStore();
  const snackbarContext = useContext(SnackbarContext);
  
  const [selectSubjects, setSelectSubjects] = useState<TOptions[]>([{label: 'Selecione a disciplina que deseja', value: ''}]);
  const [alignment, setAlignment] = useState<string[]>([]);

  const formAd = z.object({
    subjects: z.string().nonempty('Selecione a(s) disciplina(s)'),
    name: z.string().nonempty('Insira o nome da(s) aula(s)'),
    hourStart: z.string().nonempty('Selecione o hora inicial'),
    hourEnd: z.string().nonempty('Selecione o hora final'),
    linkCall: z.string().nonempty('Insira o link da chamada'),
    useVoice: z.boolean().default(true),
    useVideo: z.boolean().default(true),
  });

  type createFormAd = z.infer<typeof formAd>

  const initialValues = {
    subjects: ad?.subjectId ?? '',
    name: ad?.name ?? '',
    hourStart: ad?.hourStart ? format(new Date(ad?.hourStart), 'HH:mm') : '' ,
    hourEnd: ad?.hourEnd ? format(new Date(ad?.hourEnd), 'HH:mm') : '' ,
    weekDay: ad?.weekDay ?? [],
    linkCall: ad?.linkCall ?? '',
    useVoice: ad?.useVoice ? true : false,
    useVideo: ad?.useVideo ? true : false,
  }

  
  const { register, watch, formState: { errors }, clearErrors, setValue, handleSubmit, setError, reset } = useForm<createFormAd>({
    defaultValues: initialValues,
    resolver: zodResolver(formAd),
  });

  useEffect(() => {
    reset(initialValues);
    setSelectSubjects(subjects?.map((subject: TSubjects) => ({ value: subject.id, label: subject.name })));
    setAlignment(ad?.weekDay ?? []);
  }, [open]);



  const handleChange = (
    event: React.MouseEvent<HTMLElement>,
    newAlignment: string,
  ) => {
    const index = alignment.indexOf(newAlignment);

    if (index === -1) {
      setAlignment([...alignment, newAlignment]);
    } else {
      const newAlignmentArray = alignment.filter((item) => item !== newAlignment);
      setAlignment(newAlignmentArray);
    }
  };

  const { mutate: submitFormAd, isPending: isLoading } = useMutation({
    mutationFn: async () => {
      const startTimeString = watch('hourStart'); // Hora inicial no formato HH:mm
      const endTimeString = watch('hourEnd'); // Hora final no formato HH:mm

      // Divide as strings de hora em horas e minutos
      const [startHourString, startMinuteString] = startTimeString.split(':');
      const [endHourString, endMinuteString] = endTimeString.split(':');

      // Cria objetos Date para a hora inicial e final
      const startDate = set(new Date(), {
        hours: parseInt(startHourString, 10),
        minutes: parseInt(startMinuteString, 10),
      });

      const endDate = set(new Date(), {
        hours: parseInt(endHourString, 10),
        minutes: parseInt(endMinuteString, 10),
      });

      const data = {
        userId: useUser.user?.id,
        subjectId: watch('subjects'),
        name: watch('name'),
        weekDay: alignment,
        hourStart: startDate,
        hourEnd: endDate,
        useVoice: watch('useVoice'),
        useVideo: watch('useVideo'),
        linkCall: watch('linkCall'),
      }

      if (ad?.id) {
        return await updateAd(ad.id, data);
      } else {
        return await createAd(data);
      }

    },
    onSuccess: async () => {
      snackbarContext.success( ad?.id ? 'Anúncio editado com sucesso!' : 'Anúncio criado com sucesso!');
      await handleRefresh();
      handleClose();
    },
    onError: (data) => {
      setError('root', { message: data.message});
      snackbarContext.error(data.message);
    }
  })

  async function handleRefresh() {
    await queryClient.refetchQueries({ queryKey: ['subjects'] });
    await queryClient.refetchQueries({ queryKey: ['subjectAds', ad?.userId] });
  }



  return (
    <div>
      <Modal
        open={open}
        onClose={() => {
            handleClose();
            reset();  
          }
        }
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <>
          <Box sx={style}>
            <Typography id="modal-modal-title" variant="h6" component="h2" className='text-green-500 mb-3'>
              {ad?.id ? 'Atualizar anúncio' : 'Publique um anúncio'}
            </Typography>
            <div style={{display: 'flex', flexDirection: 'column', gap: 16, margin: `32px 0 0`}}>
              <TextField
                id="standard-select-currency-native"
                select
                color='success'
                label="Qual a disciplina:"
                defaultValue={{label: 'Selecione a disciplina que deseja', value: ''}}
                SelectProps={{
                  native: true,
                }}
                {...register('subjects')}
                variant="standard"
                required
                disabled={Boolean(ad?.id)}
              >
                {selectSubjects?.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </TextField>

              <TextField
                id="outlined-size-small"
                variant="standard"
                placeholder="Digite o conteúdo do anúncio"
                label="Qual o conteúdo:"
                type="text"
                color="success"
                {...register('name')}
                onChange={
                  () => {
                    clearErrors('name');
                  }
                }
                size="small"
                required
              />

              <TextField
                id="outlined-size-small"
                variant="standard"
                placeholder="Digite o link da sala"
                label="Link da sala:"
                type="text"
                color="success"
                {...register('linkCall')}
                onChange={
                  () => {
                    clearErrors('linkCall');
                  }
                }
                size="small"
                required
              />

              <Typography variant="body1" className='text-black' color={'GrayText'}>Quais os dias da semana ? *</Typography>

              <ToggleButtonGroup
                color="success"
                value={alignment}
                exclusive
                onChange={handleChange}
                aria-label="Platform"                
              >
                <ToggleButton value="SUNDAY" selected={alignment.includes('SUNDAY')}>D</ToggleButton>
                <ToggleButton value="MONDAY" selected={alignment.includes('MONDAY')}>S</ToggleButton>
                <ToggleButton value="TUESDAY" selected={alignment.includes('TUESDAY')}>T</ToggleButton>
                <ToggleButton value="WEDNESDAY" selected={alignment.includes('WEDNESDAY')}>Q</ToggleButton>
                <ToggleButton value="THURSDAY" selected={alignment.includes('THURSDAY')}>Q</ToggleButton>
                <ToggleButton value="FRIDAY" selected={alignment.includes('FRIDAY')}>S</ToggleButton>
                <ToggleButton value="SATURDAY" selected={alignment.includes('SATURDAY')}>S</ToggleButton>
              </ToggleButtonGroup>

              <Typography variant="body1" className='text-black' color={'GrayText'}>Qual horário do dia ? *</Typography>
              <div style={{display: 'flex', gap: 16, alignContent: 'center', maxWidth: 350 }}>
                <InputTime onChange={(e) => setValue('hourStart', e)} value={watch('hourStart')}/> 
                  <p className='text-gray-400'>-</p>
                <InputTime onChange={(e) => setValue('hourEnd', e)} value={watch('hourEnd')}/> 
              </div> 

              <FormGroup>
                <FormControlLabel
                  control={
                    <Switch
                      checked={watch('useVoice')}
                      color='success'
                      onChange={(e) => setValue('useVoice', e.target.checked)}
                      value={watch('useVoice')}
                    />
                  }
                  label="Microfone"
                  className='text-gray-500'
                />
                <FormControlLabel
                  control={
                    <Switch
                      checked={watch('useVideo')}
                      color='success'
                      value={watch('useVideo')}
                      onChange={(e) => setValue('useVideo', e.target.checked)}
                    />
                  }
                  label="Câmera"
                  className='text-gray-500'
                />
              </FormGroup>

              <div style={{display: 'flex', gap: 16, alignContent: 'center', marginBottom: 32, justifyContent: 'flex-end' }}>
                <Button variant="outlined" color="success" onClick={handleClose}>Cancelar</Button>
                <Button variant="contained" color="success" onClick={() => submitFormAd()} disabled={isLoading} className='bg-green-500'>Publicar</Button>
              </div>           
            </div>
          </Box>
        </>
      </Modal>
    </div>
  );
}