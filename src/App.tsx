import React from 'react'
import Weather from './Components/Weather'
import OfflineNotification from './Components/OfflineNotification'
import PWAInstallPrompt from './Components/PWAInstallPrompt'
import './App.css'

const App: React.FC = () => {
  return (
    <div>
      <OfflineNotification />
      <PWAInstallPrompt />
      <Weather />
    </div>
  )
}

export default App
