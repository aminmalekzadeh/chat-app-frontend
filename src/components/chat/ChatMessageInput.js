import { v4 as uuidv4 } from 'uuid';
import PropTypes from 'prop-types';
import { Icon } from '@iconify/react';
import { useContext, useEffect, useRef, useState } from 'react';
import micFill from '@iconify/icons-eva/mic-fill';
import roundSend from '@iconify/icons-ic/round-send';
import closeOutline from '@iconify/icons-ic/outline-close';
import attach2Fill from '@iconify/icons-eva/attach-2-fill';
import roundAddPhotoAlternate from '@iconify/icons-ic/round-add-photo-alternate';
// material
import { styled } from '@mui/material/styles';
import { Input, Divider, IconButton, InputAdornment, Stack, Button, Typography } from '@mui/material';
//
import { Box } from '@mui/system';
import EmojiPicker from '../EmojiPicker';
import { me } from '../../utils/jwt';
import AttachmentItem from "./FileAttachmentReader";
import { ChatContext } from "../../contexts/ChatContext";
import { useDispatch } from '../../redux/store';
import {
  createNewConversation,
  UnBlockUser
} from '../../redux/slices/chat';
import useAuth from '../../hooks/useAuth';

// ----------------------------------------------------------------------

const RootStyle = styled('div')(({ theme }) => ({
  minHeight: 'cover',
  display: 'flex',
  position: 'relative',
  alignItems: 'center',
  paddingLeft: theme.spacing(2)
}));

const MessageImgStyle = styled('img')(({ theme }) => ({
  width: '100%',
  cursor: 'pointer',
  objectFit: 'cover',
  borderRadius: theme.shape.borderRadius,
  [theme.breakpoints.up('md')]: {
    height: 200,
    minWidth: 200,
  }
}));


// ----------------------------------------------------------------------

ChatMessageInput.propTypes = {
  disabled: PropTypes.bool,
  conversationId: PropTypes.string,
  onSend: PropTypes.func
};

export default function ChatMessageInput({ disabled, conversationId, hashId, recipients, onSend, blockUsers, blockedOthers, ...other }) {
  const fileInputRef = useRef(null);
  const [message, setMessage] = useState('');
  const [record, setrecord] = useState({ status: null, URL: null });
  const { logout } = useAuth();
  const chat = useContext(ChatContext);
  const { socketService, update } = chat;
  const dispatch = useDispatch();
  const [attachment, setattachment] = useState({ file: null })
  const uuid = uuidv4();
  const user = JSON.parse(localStorage.getItem('user'));
  const isUserBlock = blockUsers.find((blockUser) => blockUser === hashId);
  const isUserBlockMe = blockedOthers.find((blockedOther) => blockedOther === hashId)
  console.log('isUserBlockMe', isUserBlockMe);

  useEffect(() => {
    const messageListener = (message) => {
      console.log('message', message);
      if (onSend) {
        if (message.senderId !== me()) {
          onSend(message);
        }
      }
    };

    socketService.connection.on('online_users', (value) => {
      socketService.connection.emit('online_users', {
        id: value.socketId,
        hash_id: user.hash_id
      });
    })
    socketService.connection.on('file-meta', messageListener);
    socketService.connection.on('base64_file', messageListener);
    socketService.connection.on('message', messageListener);
    socketService.connection.emit('getMessages');


    return () => {
      socketService.connection.off('message', messageListener);
    };
  }, [socketService])

  const handleAttach = () => {
    fileInputRef.current.click();
  };

  const handleSendVoice = () => {
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {

      navigator.mediaDevices.getUserMedia(
        {
          audio: true
        })
        .then(stream => {
          const mediaRecorder = new MediaRecorder(stream);
          mediaRecorder.start();

          const audioChunks = [];


          mediaRecorder.ondataavailable = (event) => {
            audioChunks.push(event.data);
          }

          mediaRecorder.onstart = () => {
            setrecord({ status: 'stop', URL: null });
          };

          mediaRecorder.onstop = () => {
            const audioBlob = new Blob(audioChunks);
            const audioUrl = URL.createObjectURL(audioBlob);
            setrecord({ status: 'start', URL: audioUrl });
            const data = {
              conversationId,
              messageId: '23783224-0',
              message: audioUrl,
              contentType: 'voice',
              attachments: [],
              createdAt: new Date(),
              senderId: me()
            }


          }



          if (record.status === 'start') {
            mediaRecorder.start();
          } else if (record.status === 'stop') {
            mediaRecorder.stop();
          }

        })
        .catch(err => {
          console.log('The following getUserMedia error occurred: ', err);
        }
        );
    } else {
      console.log('not supported')
    }
  }

  const handleChangeMessage = (event) => {
    setMessage(event.target.value);
  };

  const handleKeyUp = (event) => {
    if (event.key === 'Enter') {
      handleSend();
    }
  };

  const myInfo = {
    hash_id: me(),
    name: user.displayName,
    username: user.userName,
    avatar: user.photoURL
  }

  const handleSend = () => {
    if (!message && !attachment.file) {
      return '';
    }

    if (conversationId === null) {
      const newrecipients = recipients.map((item) => {
        const obj = {
          hash_id: item.hash_id,
          name: item.displayName,
          username: item.userName,
          avatar: item.photoURL
        }
        return obj;
      })

      newrecipients.push(myInfo);
      const data = {
        messages: [
          {
            body: message,
            contentType: 'text',
            attachments: [],
            senderId: me()
          }
        ],
        participants: newrecipients,
        type: "ONE_TO_ONE",
        unreadCount: 1
      }
      dispatch(createNewConversation(data))

    } else if (onSend) {
      let data = null;
      const msg = {};

      if (attachment.file) {

        const typeFileUpload = attachment.file.type.split('/')[0];
        const reader = new FileReader();
        const newObject = {
          lastModified: attachment.file.lastModified,
          name: attachment.file.name,
          type: attachment.file.type,
          size: attachment.file.size
        };

        data = {
          conversationId,
          messageId: uuid,
          message: typeFileUpload === 'image' ? window.URL.createObjectURL(attachment.file) : `${uuid}.${attachment.file.type.split('/').pop()}`,
          contentType: typeFileUpload,
          attachments: [newObject],
          createdAt: new Date(),
          senderId: me()
        }

        reader.onload = function (evt) {

          msg.conversationId = conversationId;
          msg.message = typeFileUpload === 'image' ? evt.target.result : JSON.stringify(newObject);
          msg.contentType = attachment.file.type;
          msg.attachments = [newObject];
          msg.createdAt = new Date();
          msg.senderId = me();

          const buffer = new Uint8Array(reader.result);
          if (typeFileUpload === 'image') {
            socketService.connection.emit('base64_file', msg);
          } else {
            shareFile({
              filename: attachment.file.name,
              type: attachment.file.type,
              total_buffer_size: buffer.length,
              buffer_size: 4096
            }, buffer, msg);

          }
        };
        if (typeFileUpload === 'image') {
          reader.readAsDataURL(attachment.file);
        } else {
          reader.readAsArrayBuffer(attachment.file);
        }

        setattachment({ file: null });

      } else {
        data = {
          conversationId,
          messageId: uuid,
          message,
          contentType: 'text',
          attachments: [],
          createdAt: new Date(),
          senderId: me()
        }
        socketService.connection.emit('message', data);
      }

      onSend(data);
    }
    return setMessage('');
  };


  const shareFile = (metadata, buffer, msg) => {
    socketService.connection.emit('file-meta', {
      metadata,
      msg
    });

    socketService.connection.emit('fs-start', {})
    socketService.connection.on('fs-share', (processNode) => {
      let chunk = buffer.slice(0, metadata.buffer_size);
      buffer = buffer.slice(metadata.buffer_size, buffer.length);
      const messageIds = [];
      messageIds.splice(uuid, 0, processNode);
      update(messageIds);
      if (chunk.length !== 0) {
        socketService.connection.emit('file-raw', {
          buffer: chunk,
          metadata
        });
      } else {
        chunk = null;
      }
    })

  }

  const handleClickUnblock = (e) => {
    dispatch(UnBlockUser(hashId));
  }

  const handleSetAttachment = (event, data) => {

    event.target.value = null;
    setattachment(data)
  }

  const block = isUserBlock === undefined ? <RootStyle {...other}>
    {attachment.file ? <Box sx={{ width: '100%' }}>
      <IconButton onClick={(e) => handleSetAttachment(e, { file: null })} sx={{ mx: 1 }}>
        <Icon icon={closeOutline} width={24} height={24} />
      </IconButton>
      {attachment.file.type.split('/')[0] === 'application' ? <AttachmentItem file={attachment.file} fileUrl={attachment.file.name} /> : <MessageImgStyle alt="attachment" src={window.URL.createObjectURL(attachment.file)} />}

    </Box> : <Input
      disabled={disabled}
      fullWidth
      value={message}
      disableUnderline
      onKeyUp={handleKeyUp}
      onChange={handleChangeMessage}
      placeholder="Type a message"
      startAdornment={
        <InputAdornment position="start">
          <EmojiPicker disabled={disabled} value={message} setValue={setMessage} />
        </InputAdornment>
      }
      endAdornment={
        <Stack direction="row" spacing={0.5} mr={1.5}>
          <IconButton disabled={disabled} size="small" onClick={handleAttach}>
            <Icon icon={roundAddPhotoAlternate} width={24} height={24} />
          </IconButton>
          <IconButton disabled={disabled} size="small" onClick={handleAttach}>
            <Icon icon={attach2Fill} width={24} height={24} />
          </IconButton>
          <IconButton disabled={disabled} onClick={(e) => handleSendVoice()} size="small">
            <Icon icon={micFill} width={24} height={24} />
          </IconButton>
        </Stack>
      }
      sx={{ height: '100%' }}
    />}

    <Divider orientation="vertical" flexItem />
    {/* disabled={!message || !attachment.file} */}
    <IconButton color="primary" onClick={handleSend} sx={{ mx: 1 }}>
      <Icon icon={roundSend} width={24} height={24} />
    </IconButton>

    <input type="file" id="upload_input" ref={fileInputRef} onChange={(e) => handleSetAttachment(e, { file: fileInputRef.current.files[0] })} style={{ display: 'none' }} />
  </RootStyle> : <RootStyle {...other}>
    <Box sx={{ width: '100%', padding: 1, justifyContent: 'center', alignItems: 'center', display: 'flex' }}>
      <Button sx={{ color: 'red' }} onClick={handleClickUnblock}>Unblock</Button>
    </Box>
  </RootStyle>

  return (
    <>
      {isUserBlockMe === undefined ? block
        : <Box sx={{ padding: 1, justifyContent: 'center', alignItems: 'center', display: 'flex' }}>
           <Typography>
              You can't send message, You Blocked.
           </Typography>
        </Box>}

    </>
  );
}
