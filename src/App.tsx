import { useEffect, useReducer, useState } from 'react'
import './App.css'
import { Box, Button, Chip, createTheme, CssBaseline, LinearProgress, Modal, Stack, TextField, Theme, ThemeProvider, Typography } from '@mui/material';
import { useCountdown } from 'usehooks-ts';
import { secondsDisplay, secondsToMinutesDisplay } from './utils/timeUtils';
import RestartAltIcon from '@mui/icons-material/RestartAlt';
import SettingsIcon from '@mui/icons-material/Settings';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import StopIcon from '@mui/icons-material/Stop';
// import useSound from 'use-sound';
// import rewardSfx from '../src/assets/sounds/reward.mp3'

const theme: Theme = createTheme({
  typography: {
    fontFamily: 'Lazy Dog',
    h1: {
      fontSize: '4em',
      color: 'textPrimary'
    },
    h6: {
      fontSize: '1.5em',
      color: 'textPrimary'
    }
  },
  palette: {
    mode: 'dark',
    primary: {
      main: '#a16eff',
    },
    secondary: {
      main: '#44008b',
    },
    success: {
      main: '#00b887',
    },
    info: {
      main: '#006fd6',
    },
    error: {
      main: '#db2c66',
    },
  },
});

type pomodoroMode = 'pomodoro' | 'short_break' | 'long_break'


const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
};

interface PomodoroState {
  shortBreakAmountMinutes: number
  longBreakAmountMinutes: number
  pomoDoroAmountMinutes: number
  currentMode: pomodoroMode
  stopped: boolean
}

const initialPomoDoroState: PomodoroState = {
  currentMode: 'pomodoro',
  longBreakAmountMinutes: 10,
  pomoDoroAmountMinutes: 25,
  shortBreakAmountMinutes: 5,
  stopped: true
}

const pomodoroReducer = (currentState: PomodoroState, updateState: Partial<PomodoroState>): PomodoroState => {
  return {
    ...currentState,
    ...updateState
  }
};


function App() {
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  // const [play] = useSound(rewardSfx);


  const [pomoState, pomoDispatch] = useReducer(pomodoroReducer, initialPomoDoroState);
  const {
    currentMode,
    longBreakAmountMinutes,
    pomoDoroAmountMinutes,
    shortBreakAmountMinutes,
    stopped
  } = pomoState

  const currentCountMap = {
    pomodoro: pomoDoroAmountMinutes,
    short_break: shortBreakAmountMinutes,
    long_break: longBreakAmountMinutes
  }
  const currentCount = currentCountMap[currentMode]




  const [count, { startCountdown, stopCountdown, resetCountdown }] =
    useCountdown({
      countStart: currentCount * 60
    })



  const [formState, formDispatch] = useReducer(pomodoroReducer, pomoState)



  useEffect(() => {
    resetCountdown()
    pomoDispatch({ stopped: true })
  }, [currentMode, longBreakAmountMinutes, pomoDoroAmountMinutes, shortBreakAmountMinutes, resetCountdown])

  useEffect(() => {
    if (stopped) {
      stopCountdown()
    } else {
      startCountdown()
    }
  }, [stopped, startCountdown, stopCountdown]);



  const minutes = secondsToMinutesDisplay(count)
  const seconds = secondsDisplay(count)

  const currentProgress = 100 - (count / (currentCount * 60)) * 100

  const StartStopButtonIcon = stopped ? <PlayArrowIcon /> : <StopIcon />

  const changeMode = (mode: pomodoroMode) => {
    pomoDispatch({ currentMode: mode })
  }
  const startPauseHandler = () => {
    pomoDispatch({ stopped: !stopped })
  }

  const resetHandler = () => {
    resetCountdown()
    pomoDispatch({ stopped: true })
  }
  const handleFormClick = () => {
    pomoDispatch({ ...formState })
    handleClose()
  }

  const handleFormResetClick = () => {
    formDispatch(initialPomoDoroState)
  }



  return (
    <ThemeProvider theme={theme} >
      <CssBaseline />
      <Box mt='.8em' mb='1em'  >
        <Typography className='lazy-dog' color='textPrimary' variant='h1' textAlign='center' >
          Pomodoro Study App
        </Typography>
        <Typography className='lazy-dog' textAlign='center' variant='h6'>
          By Ray
        </Typography>
      </Box>
      <Box style={{ marginTop: '1.5em' }} >
        <Typography margin='.5em 0em' color='success' variant='h4' textAlign='center'>
          Start Studying Effectively!
        </Typography>
        <Stack margin='auto' maxWidth='40%' direction={{ xs: 'column', sm: 'row', md: 'row' }} justifyContent='center' spacing={1}>
          <Chip onClick={() => changeMode('pomodoro')} style={{ fontSize: '1.5em', padding: '.4em' }} clickable variant={currentMode === 'pomodoro' ? 'filled' : 'outlined'} label="pomodoro" color="primary" />
          <Chip onClick={() => changeMode('short_break')} style={{ fontSize: '1.5em', padding: '.4em' }} clickable variant={currentMode === 'short_break' ? 'filled' : 'outlined'} label="short break" color="primary" />
          <Chip onClick={() => changeMode('long_break')} style={{ fontSize: '1.5em', padding: '.4em' }} clickable variant={currentMode === 'long_break' ? 'filled' : 'outlined'} label="long break" color="primary" />
        </Stack>
        <Typography fontSize='4em' margin='.8em' variant='h1' textAlign='center'>
          {minutes}:{seconds}
        </Typography>
        <Box margin='1.5em auto' sx={{ maxWidth: '30%' }}>
          <LinearProgress
            color={currentProgress < 60 ? 'primary' : 'success'}
            variant="determinate" value={currentProgress} />
        </Box>
        <Box
          marginX='auto' marginBottom='2em'  maxWidth='40%' flexDirection={{ xs: 'column', sm: 'row', md: 'row' }}
          gap='1em' justifyContent='center' display='flex' textAlign='center'>

          <Button onClick={startPauseHandler} size='large' variant='contained' >
            {StartStopButtonIcon}
          </Button>

          <Button
            onClick={resetHandler} size='large' variant='contained' >
            <RestartAltIcon />
          </Button>
          <Button
            onClick={handleOpen} size='large' variant='contained' >
            <SettingsIcon />
          </Button>
        </Box>
      </Box>


      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Stack gap='1em' direction='column' sx={style} >
          <TextField onChange={(e) => formDispatch({
            pomoDoroAmountMinutes: parseInt(e.target.value)
          })} value={formState.pomoDoroAmountMinutes} type='number' label="Pomodoro Time" variant="outlined" />
          <TextField
            onChange={(e) => formDispatch({
              shortBreakAmountMinutes: parseInt(e.target.value)
            })}

            value={formState.shortBreakAmountMinutes} type='number' label="Short Break Time" variant="outlined" />
          <TextField
            onChange={(e) => formDispatch({
              longBreakAmountMinutes: parseInt(e.target.value)
            })}
            value={formState.longBreakAmountMinutes} type='number' label="Long Break Time" variant="outlined" />

          <Stack justifyContent='space-around' direction='row'>
            <Button
              variant='outlined'
              onClick={handleFormResetClick}
            >
              Reset
            </Button>
            <Button variant='contained'
              onClick={handleFormClick}
            >
              Submit
            </Button>
          </Stack>
        </Stack>
      </Modal>

    </ThemeProvider >
  )
}

export default App
