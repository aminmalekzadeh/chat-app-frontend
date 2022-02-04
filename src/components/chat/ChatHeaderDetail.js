import PropTypes from 'prop-types';
import { useState, useContext } from "react";
import { Icon } from '@iconify/react';
import { capitalCase } from 'change-case';
import videoFill from '@iconify/icons-eva/video-fill';
import phoneFill from '@iconify/icons-eva/phone-fill';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import { useSnackbar } from 'notistack';
import closeFill from '@iconify/icons-eva/close-fill';

import moreVerticalFill from '@iconify/icons-eva/more-vertical-fill';
import arrowIosForwardFill from '@iconify/icons-eva/arrow-ios-forward-fill';
// material
import { styled } from '@mui/material/styles';
import { Box, Link, Avatar, Typography, AvatarGroup } from '@mui/material';
// utils
import { fToNow } from '../../utils/formatTime';
//
import { MIconButton } from '../@material-extend';
import BadgeStatus from '../BadageStatus';
import CallModal from '../Modals/CallModal';
import { ChatContext } from "../../contexts/ChatContext";
import { addNewUsersBlock, UnBlockUser, ReportUser } from "../../redux/slices/chat";
import { useDispatch, useSelector } from '../../redux/store';
import { me } from '../../utils/jwt';


// ----------------------------------------------------------------------

const RootStyle = styled('div')(({ theme }) => ({
  flexShrink: 0,
  minHeight: 92,
  display: 'flex',
  alignItems: 'center',
  padding: theme.spacing(0, 3)
}));

// ----------------------------------------------------------------------

OneAvatar.propTypes = {
  participants: PropTypes.array
};

function OneAvatar({ participants }) {
  const participant = [...participants][0];

  if (participant === undefined) {
    return null;
  }

  return (
    <Box sx={{ display: 'flex', alignItems: 'center' }}>
      <Box sx={{ position: 'relative' }}>
        <Avatar src={participant.avatar} alt={participant.name} />
        <BadgeStatus status={participant.status} sx={{ position: 'absolute', right: 2, bottom: 2 }} />
      </Box>
      <Box sx={{ ml: 2 }}>
        <Typography variant="subtitle2">{participant.name}</Typography>
        <Typography variant="body2" sx={{ color: 'text.secondary' }}>
          {participant.status !== 'offline' ? participant.status : fToNow(participant.lastActivity)}
        </Typography>
      </Box>
    </Box>
  );
}

GroupAvatar.propTypes = {
  participants: PropTypes.array
};

function GroupAvatar({ participants }) {
  return (
    <div>
      <AvatarGroup
        max={3}
        sx={{
          mb: 0.5,
          '& .MuiAvatar-root': { width: 32, height: 32 }
        }}
      >
        {participants.map((participant) => (
          <Avatar key={participant.hash_id} alt={participant.name} src={participant.avatar} />
        ))}
      </AvatarGroup>
      <Link variant="body2" underline="none" component="button" color="text.secondary" onClick={() => { }}>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          {participants.length} persons
          <Icon icon={arrowIosForwardFill} />
        </Box>
      </Link>
    </div>
  );
}

ChatHeaderDetail.propTypes = {
  participants: PropTypes.array
};

export default function ChatHeaderDetail({ participants, ...other }) {
  const isGroup = participants.length > 1;
  const hashId = participants.map((participant) => participant.hash_id)[0];
  const [anchorEl, setAnchorEl] = useState(null);
  const [modalAudioCall, setmodalAudioCall] = useState(false);
  const chat = useContext(ChatContext);
  const dispatch = useDispatch();
  const { peerjsService } = chat;
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();

  const open = Boolean(anchorEl);
  const { blockUsers } = useSelector((state) => state.chat);
  const OtherHashId = participants.find(
    (participant) => participant.hash_id !== me()
  );
  let isUserBlock;
  if (OtherHashId !== undefined) {
    isUserBlock = blockUsers.find((blockUser) => blockUser === OtherHashId.hash_id);
  }
  console.log('isUserBlock4234', OtherHashId)

  const handleClickUnblock = (e) => {
    dispatch(UnBlockUser(hashId));
  }

  const handleClickReportUser = (e) => {
    dispatch(ReportUser(hashId));
    setAnchorEl(null);
    enqueueSnackbar('User successfully reported, thanks.', {
      variant: 'success',
      action: (key) => (
        <MIconButton size="small" onClick={() => closeSnackbar(key)}>
          <Icon icon={closeFill} />
        </MIconButton>
      )
    });
  }

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleClickBlock = (e) => {
    dispatch(addNewUsersBlock(OtherHashId.hash_id));
    e.target.innerText = 'Unblock';
    setAnchorEl(null);
  }



  return (
    <RootStyle {...other}>
      {isGroup ? <GroupAvatar participants={participants} /> : <OneAvatar participants={participants} />}

      <Box sx={{ flexGrow: 1 }} />

      <MIconButton
        aria-controls={open ? 'basic-menu' : undefined}
        aria-haspopup="true"
        aria-expanded={open ? 'true' : undefined}
        onClick={handleClick} >
        <Icon icon={moreVerticalFill} width={20} height={20} />
      </MIconButton>



      <Menu
        id="basic-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        MenuListProps={{
          'aria-labelledby': 'basic-button',
        }}
      >
        <MenuItem onClick={handleClickReportUser}> Report </MenuItem>
        {isUserBlock === undefined ? <MenuItem onClick={handleClickBlock} id="button-block" sx={{ color: 'red' }}> Block </MenuItem> :
          <MenuItem onClick={handleClickUnblock} id="button-block" sx={{ color: 'red' }}> Unblock </MenuItem>}
      </Menu>

    </RootStyle>
  );
}
