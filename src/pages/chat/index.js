import { useEffect } from 'react';
// material
import { Card, Container } from '@mui/material';
// redux
import { useDispatch } from '../../redux/store';
import { getConversations, getContacts, getUsersBlocked, getBlockedbyOthers } from '../../redux/slices/chat';

// hooks
import useSettings from '../../hooks/useSettings';
// components
import Page from '../../components/Page';
import { ChatSidebar, ChatWindow } from '../../components/chat';
import { ChatProvider } from "../../contexts/ChatContext";

// ----------------------------------------------------------------------

export default function Chat() {
  const { themeStretch } = useSettings();
  const dispatch = useDispatch();
  

  useEffect(() => {
    dispatch(getConversations());
    dispatch(getContacts());
    dispatch(getUsersBlocked());
    dispatch(getBlockedbyOthers());
  }, [dispatch]);
  

  return (
    <ChatProvider>
      <Page title="Chat | Massenger-app">
        <Container maxWidth={themeStretch ? false : 'xl'}>
          {/* <HeaderBreadcrumbs heading="Chat" links={[{ name: 'chat', href: PATH_CHAT.root }, { name: 'Chat' }]} /> */}
          <Card sx={{ height: '95vh', display: 'flex' }}>
            <ChatSidebar />
            <ChatWindow />
          </Card>
        </Container>
      </Page>
    </ChatProvider>
  );
}
