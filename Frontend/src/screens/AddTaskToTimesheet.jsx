import { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { toast } from 'react-toastify';
import Container from '@mui/material/Container';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import MenuItem from '@mui/material/MenuItem';
import Loader from '../common/Loader';
import Alert from '../common/Alert';
import FlexBetween from '../common/FlexBetween';
import { timesheetTaskSchema as schema } from '../validations/timesheet';
import {
  useAddTaskToTimesheetMutation,
  useGetTimesheetDetailsQuery,
} from '../state/features/apiSlice';

const hours = Array.from(Array(24).keys()).map((x) => ({
  label: x.toString().padStart(2, '0'),
  value: x,
}));
const minutes = Array.from(Array(60).keys()).map((x) => ({
  label: x.toString().padStart(2, '0'),
  value: x,
}));

const AddTaskToTimesheet = () => {
  const { id } = useParams();
  const { isLoading, data, error } = useGetTimesheetDetailsQuery(id);
  const [
    addTaskToTimesheet,
    { isLoading: addingTask, data: taskData, error: addTaskFailed },
  ] = useAddTaskToTimesheetMutation();

  const defaultValues = {
    hour: 0,
    minute: 0,
    description: '',
    remarks: '',
  };

  const {
    control,
    formState: { errors },
    reset,
    handleSubmit,
  } = useForm({
    mode: 'onTouched',
    defaultValues,
    resolver: yupResolver(schema),
  });

  useEffect(() => {
    if (taskData) {
      toast.success('Task added to Timesheet!');
      reset(defaultValues);
    }
    if (addTaskFailed) {
      toast.error(addTaskFailed?.data?.message || addTaskFailed.message);
      reset(defaultValues);
    }
  }, [taskData, addTaskFailed, reset]);

  const onSubmit = (data) => {
    data.timesheet = id;
    addTaskToTimesheet(data);
  };

  return (
    <Container>
      <Typography my={4} variant='h2' component='h1' textAlign='center'>
        Add Task to Timesheet
      </Typography>
      {isLoading ? (
        <Loader />
      ) : error ? (
        <Alert message={error?.data?.message || error.message} />
      ) : data ? (
        <>
          <FlexBetween
            flexWrap='wrap'
            gap={2}
            p={2}
            mb={4}
            border='2px solid'
            borderColor='primary.main'
            borderRadius='40px'
          >
            <Typography variant='h6' color='primary'>
              Project Name: {data.timesheet.projectName}
            </Typography>
            <Typography variant='h6' color='primary'>
              {data.timesheet.employee.name}
            </Typography>
            <Typography variant='h6' color='primary'>
              ID: {data.timesheet._id}
            </Typography>
            <Typography variant='h6' color='primary'>
              Date: {new Date(data.timesheet.date).toLocaleDateString('en-IN')}
            </Typography>
          </FlexBetween>
          <Container>
            <Box component='form' onSubmit={handleSubmit(onSubmit)}>
              <Stack direction='row' gap={2} mb={2}>
                <Controller
                  name='hour'
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      select
                      label='HH'
                      error={!!errors?.hour}
                      helperText={errors?.hour?.message}
                      disabled={addingTask}
                      sx={{ width: '120px' }}
                    >
                      {hours.map((option) => (
                        <MenuItem key={option.value} value={option.value}>
                          {option.label}
                        </MenuItem>
                      ))}
                    </TextField>
                  )}
                />
                <Controller
                  name='minute'
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      select
                      label='MM'
                      error={!!errors?.minute}
                      helperText={errors?.minute?.message}
                      disabled={addingTask}
                      sx={{ width: '120px' }}
                    >
                      {minutes.map((option) => (
                        <MenuItem key={option.value} value={option.value}>
                          {option.label}
                        </MenuItem>
                      ))}
                    </TextField>
                  )}
                />
              </Stack>

              <Stack direction={{ xs: 'column', sm: 'row' }} gap={4}>
                <Box flex={1}>
                  <Controller
                    name='description'
                    control={control}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        label='Description'
                        error={!!errors?.description}
                        helperText={errors?.description?.message}
                        disabled={addingTask}
                        autoFocus
                        multiline
                        rows={5}
                        fullWidth
                      />
                    )}
                  />
                </Box>
                <Box flex={1}>
                  <Controller
                    name='remarks'
                    control={control}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        label='Remarks'
                        error={!!errors?.remarks}
                        helperText={errors?.remarks?.message}
                        disabled={addingTask}
                        multiline
                        rows={5}
                        fullWidth
                      />
                    )}
                  />
                </Box>
              </Stack>
              <Button
                type='submit'
                disabled={addingTask}
                variant='contained'
                sx={{ mt: 3, mb: 2 }}
              >
                {addingTask ? 'Adding Task...' : 'Add Task'}
              </Button>
            </Box>
          </Container>
        </>
      ) : null}
    </Container>
  );
};

export default AddTaskToTimesheet;