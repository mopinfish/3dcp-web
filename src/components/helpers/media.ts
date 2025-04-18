import { css, Interpolation } from 'styled-components'

type SimpleInterpolation = Interpolation<object>

const breakpoints: { [key: string]: string } = {
  sm: '576px',
  md: '768px',
  lg: '992px',
  xl: '1200px',
}

type BreakpointsKeys = keyof typeof breakpoints

type Media = {
  [K in BreakpointsKeys]: (...args: Parameters<typeof css>) => SimpleInterpolation
}

export const media = Object.keys(breakpoints).reduce<Media>((acc, label) => {
  acc[label as BreakpointsKeys] = (...args) => css`
    @media (min-width: ${breakpoints[label]}) {
      ${css(...args)}
    }
  `
  return acc
}, {} as Media)
