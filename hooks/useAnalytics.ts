import ReactGA from 'react-ga'

interface Event {
  action: string
  category: string
  label?: string
}

export const useAnalytics = () => {
  return {
    init: (trackingId: string) => {
      ReactGA.initialize(trackingId)
    },
    trackPageViewed: (path?: string) => {
      if (path) {
        return ReactGA.pageview(path)
      }
      return ReactGA.pageview(window.location.pathname + window.location.search)
    },
    trackEvent: (params: Event) => {
      ReactGA.event(params)
    },
  }
}
