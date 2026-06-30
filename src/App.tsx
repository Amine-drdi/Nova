import { HashRouter, Routes, Route } from 'react-router-dom'
import Layout from './components/Layout'
import Home from './pages/Home'
import Login from "./pages/Login"
import NotFound from "./pages/NotFound"
import Seo from './pages/Seo'
import Geo from './pages/Geo'
import Competitors from './pages/Competitors'
import SiteBuilder from './pages/SiteBuilder'
import GoogleAds from './pages/GoogleAds'
import MetaAds from './pages/MetaAds'
import Email from './pages/Email'
import Social from './pages/Social'
import Visual from './pages/Visual'
import Crm from './pages/Crm'
import CplRoi from './pages/CplRoi'
import AbTest from './pages/AbTest'
import Cyber from './pages/Cyber'
import Reporting from './pages/Reporting'
import Strategy from './pages/Strategy'
import Onboarding from './pages/Onboarding'
import SettingsPage from './pages/SettingsPage'
import CrmConnect from './pages/CrmConnect'
import MissionControl from './pages/MissionControl'

export default function App() {
  return (
    <HashRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<Home />} />
          <Route path="/dashboard" element={<Home />} />
          <Route path="/seo" element={<Seo />} />
          <Route path="/geo" element={<Geo />} />
          <Route path="/competitors" element={<Competitors />} />
          <Route path="/sitebuilder" element={<SiteBuilder />} />
          <Route path="/google-ads" element={<GoogleAds />} />
          <Route path="/meta-ads" element={<MetaAds />} />
          <Route path="/email" element={<Email />} />
          <Route path="/social" element={<Social />} />
          <Route path="/visual" element={<Visual />} />
          <Route path="/crm" element={<Crm />} />
          <Route path="/cpl-roi" element={<CplRoi />} />
          <Route path="/ab-testing" element={<AbTest />} />
          <Route path="/cyber" element={<Cyber />} />
          <Route path="/reporting" element={<Reporting />} />
          <Route path="/strategy" element={<Strategy />} />
          <Route path="/onboarding" element={<Onboarding />} />
          <Route path="/settings" element={<SettingsPage />} />
          <Route path="/crm-connect" element={<CrmConnect />} />
          <Route path="/mission-control" element={<MissionControl />} />
        </Route>
        <Route path="/login" element={<Login />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </HashRouter>
  )
}
