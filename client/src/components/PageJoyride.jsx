import { useNavigate, useLocation } from 'react-router-dom'
import Joyride from 'react-joyride'
import useStore from '../store/useStore'

const pageSequence = ['/onboarding', '/storyboard', '/soundboard', '/review']

export default function PageJoyride() {
  const { tourRun, tourStepIndex, tourSteps, nextTourStep, stopTour } = useStore()
  const navigate = useNavigate()
  const location = useLocation()

  if (!tourRun || tourSteps.length === 0) return null

  return (
    <Joyride
      run={tourRun}
      stepIndex={tourStepIndex}
      steps={tourSteps}
      continuous
      showProgress
      showSkipButton
      callback={({ action, status }) => {
        if (action === 'next') nextTourStep()

        if (status === 'finished') {
          const currentIndex = pageSequence.indexOf(location.pathname)
          const nextPage = pageSequence[currentIndex + 1]
          if (nextPage) {
            navigate(nextPage)
          } else {
            stopTour()
          }
        }

        if (status === 'skipped') stopTour()
      }}
      styles={{ options: { zIndex: 9999 } }}
    />
  )
}
