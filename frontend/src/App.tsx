import { Navigate, Route, Routes } from 'react-router';
import AppHeader from 'src/components/AppHeader';
import AuthorCredit from 'src/components/AuthorCredit';
import LegacyRedirect from 'src/components/LegacyRedirect';
import ScrollToTop from 'src/components/ScrollToTop';
import CreatePollPage from 'src/pages/CreatePollPage';
import HomePage from 'src/pages/HomePage';
import NotFoundPage from 'src/pages/NotFoundPage';
import ResultsPage from 'src/pages/ResultsPage';
import SharePage from 'src/pages/SharePage';
import SimulatorPage from 'src/pages/SimulatorPage';
import VotePage from 'src/pages/VotePage';
import { paths, PATTERNS } from 'src/paths';

export default function App() {
  return (
    <div className={'flex min-h-dvh flex-col'}>
      <a
        className={
          'sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 focus:z-50 focus:rounded-md focus:bg-accent focus:px-3 focus:py-2 focus:text-sm focus:text-on-accent'
        }
        href={'#main'}
      >
        Skip to content
      </a>
      <ScrollToTop />
      <AppHeader />
      <main className={'mx-auto w-full max-w-5xl flex-1 px-4 py-8 sm:px-6 sm:py-10'} id={'main'}>
        <Routes>
          <Route element={<HomePage />} index />
          <Route element={<SimulatorPage />} path={paths.simulator} />
          <Route element={<CreatePollPage />} path={paths.newPoll} />
          <Route element={<VotePage />} path={PATTERNS.poll} />
          <Route element={<ResultsPage />} path={PATTERNS.results} />
          <Route element={<SharePage />} path={PATTERNS.share} />

          <Route element={<Navigate replace to={paths.newPoll} />} path={'/create-poll'} />
          <Route element={<Navigate replace to={paths.simulator} />} path={'/simulation/*'} />
          <Route element={<LegacyRedirect to={paths.poll} />} path={'/voting/:link'} />
          <Route element={<LegacyRedirect to={paths.results} />} path={'/results/:link'} />
          <Route element={<LegacyRedirect to={paths.share} />} path={'/creation-success/:link'} />

          <Route element={<NotFoundPage />} path={'*'} />
        </Routes>
      </main>
      <footer className={'border-t border-ink/10'}>
        <div className={'mx-auto max-w-5xl px-4 py-6 sm:px-6'}>
          <AuthorCredit />
        </div>
      </footer>
    </div>
  );
}
