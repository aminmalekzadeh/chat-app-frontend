// routes
import Router from './routes';
// theme
import ThemeConfig from './theme';
import GlobalStyles from './theme/globalStyles';
// components
import RtlLayout from './components/RtlLayout';
import ScrollToTop from './components/ScrollToTop';
import { ProgressBarStyle } from './components/LoadingScreen';
import ThemePrimaryColor from './components/ThemePrimaryColor';
import NotistackProvider from './components/NotistackProvider';

// ----------------------------------------------------------------------

export default function App() {
  return (
    <ThemeConfig>
      <ThemePrimaryColor>
        <NotistackProvider>
          <RtlLayout>
            <GlobalStyles />
            <ProgressBarStyle />
            <ScrollToTop />
            <Router />
          </RtlLayout>
        </NotistackProvider>
      </ThemePrimaryColor>
    </ThemeConfig>
  );
}
