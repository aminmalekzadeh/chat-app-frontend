import PropTypes from 'prop-types';
import { formatDistanceToNowStrict } from 'date-fns';
import SimpleReactLightbox, { SRLWrapper } from "simple-react-lightbox";

// material
import { styled, useTheme } from '@mui/material/styles';
import { Avatar, Box, Typography } from '@mui/material';
import { me } from '../../utils/jwt';
import VoicePlayer from "../VoicePlayer";
import AttachmentItem from "./FileAttachmentReader";

// ----------------------------------------------------------------------

const RootStyle = styled('div')(({ theme }) => ({
  display: 'flex',
  marginBottom: theme.spacing(3)
}));

const ContentStyle = styled('div')(({ theme }) => ({
  maxWidth: 320,
  padding: theme.spacing(1.5),
  marginTop: theme.spacing(0.5),
  borderRadius: theme.shape.borderRadius,
  backgroundColor: theme.palette.background.neutral
}));

const InfoStyle = styled(Typography)(({ theme }) => ({
  display: 'flex',
  marginBottom: theme.spacing(0.75),
  color: theme.palette.text.secondary
}));

const MessageImgStyle = styled('img')(({ theme }) => ({
  width: '100%',
  cursor: 'pointer',
  objectFit: 'cover',
  borderRadius: theme.shape.borderRadius,
  [theme.breakpoints.up('md')]: {
    height: 200,
    minWidth: 296
  }
}));

// ----------------------------------------------------------------------

ChatMessageItem.propTypes = {
  message: PropTypes.object.isRequired,
  conversation: PropTypes.object.isRequired,
  onOpenLightbox: PropTypes.func
};

export default function ChatMessageItem({ message, conversation, onOpenLightbox }) {
  const sender = conversation.participants.find((participant) => participant.hash_id === message.senderId);
  const senderDetails =
    message.senderId === me()
      ? { type: 'me' }
      : { avatar: sender?.avatar, name: sender?.name };

  const isMe = senderDetails.type === 'me';
  const isImage = message.contentType === 'image';
  const isVoice = message.contentType === 'voice';
  const isApplication = message.contentType === 'application';
  const firstName = senderDetails.name && senderDetails.name.split(' ')[0];
  const theme = useTheme();
  let loadItem = null;
  
  if (isVoice) {
    loadItem = <VoicePlayer Url={message.body} />
  } else if (isImage) {
    loadItem = <SimpleReactLightbox>
      <SRLWrapper>
        <MessageImgStyle alt="attachment" src={message.body} />
      </SRLWrapper>
    </SimpleReactLightbox>
  } else if (isApplication) {
    const data = message.attachments[0];
    loadItem = <AttachmentItem file={data} fileUrl={data.name} downloadUrl={message.body} itemId={message.id} />
  } else {
    loadItem = <Typography variant="body2">{message.body}</Typography>
  }

  return (
    <RootStyle>

      <Box
        sx={{
          display: 'flex',
          ...(isMe && {
            ml: 'auto'
          })
        }}
      >
        {senderDetails.type !== 'me' && (
          <Avatar alt={senderDetails.name} src={senderDetails.avatar} sx={{ width: 32, height: 32, mr: 2 }} />
        )}

        <div>
          <InfoStyle variant="caption" sx={{ ...(isMe && { justifyContent: 'flex-end' }) }}>
            {!isMe && `${firstName},`}&nbsp;
            {formatDistanceToNowStrict(new Date(message.createdAt), {
              addSuffix: true
            })}
          </InfoStyle>

          <ContentStyle
            sx={{
              ...(isMe && { color: 'grey.800', bgcolor: 'primary.lighter' }),
              ...(isImage && { p: 0 }),
              ...(isApplication && {
                background: theme.palette.background.default,
              }),
              ...(isVoice && {
                paddingRight: 3,
                paddingTop: 0,
                paddingBottom: 0,
                display: 'flex',
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'center',
                height: '20',
                width: 500,
                background: theme.palette.background.default,
                marginTop: 0
              })
            }}
          >

            {loadItem}

          </ContentStyle>
        </div>
      </Box>

    </RootStyle>
  );
}
