import { useEffect, useLayoutEffect, useRef, useState } from "react";
import WaveSurfer from 'wavesurfer.js';
import { useTheme } from '@mui/material/styles';

import { Icon } from '@iconify/react';
import { IconButton } from '@mui/material';
import playIcon from '@iconify/icons-ic/play-circle-outline';
import pauseIcon from '@iconify/icons-ic/pause-circle-outline';
import { WaveformContianer, Wave, PlayButton } from './Waveform.styled';

function VoicePlayer({ Url }) {
  const theme = useTheme();
  const waveformRef = useRef(null);
  const [play, setplay] = useState(false)
  const [urlPlay, seturlPlay] = useState(null);

  useEffect(() => {
    const track = document.querySelector('#track');

    waveformRef.current = WaveSurfer.create({
      barWidth: 3,
      cursorWidth: 1,
      container: '#waveform',
      backend: 'WebAudio',
      height: 80,
      progressColor: theme.palette.primary.light,
      responsive: true,
      waveColor: theme.palette.primary.darker,
      cursorColor: 'transparent',
    });

    waveformRef.current.load(track);

  }, []);




  const handlePlay = () => {
    if (Url) {
      seturlPlay(Url);
    }
    setplay(!play);
    waveformRef.current.playPause();
  }

  return (
    <>
      <IconButton onClick={handlePlay}>
        {play ? <Icon icon={pauseIcon} width={34} height={34} /> : <Icon icon={playIcon} width={34} height={34} />}
      </IconButton>

      <Wave id="waveform" />
      {urlPlay ? <audio id="track" src={urlPlay}>
        <track src="captions_en.vtt" kind="captions" srcLang="en" label="english_captions" />
      </audio> : <audio id="track" src="https://www.mfiles.co.uk/mp3-downloads/gs-cd-track2.mp3">
        <track src="captions_en.vtt" kind="captions" srcLang="en" label="english_captions" />
      </audio>}
    </>
  )
}

export default VoicePlayer
