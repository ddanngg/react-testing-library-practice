import React from 'react'
import {render} from '@testing-library/react'
import user from '@testing-library/user-event'

import {ErrorBoundary} from '../error-boundary'
import {reportError as mockReportError} from '../api'

jest.mock('../api')

beforeAll(() => {
  jest.spyOn(console, 'error').mockImplementation(() => {})
})

afterAll(() => {
  console.error.mockRestore() // restore original implementation
})

afterEach(() => {
  jest.clearAllMocks() // clear mocks prevent leaks to another test
})

function Bomb({shouldThrow}) {
  if (shouldThrow) {
    throw new Error('💣')
  } else {
    return null
  }
}

test('calls report error and render there was a problem', () => {
  mockReportError.mockResolvedValueOnce({success: true})
  const screen = render(
    <ErrorBoundary>
      <Bomb />
    </ErrorBoundary>,
  )

  screen.rerender(
    <ErrorBoundary>
      <Bomb shouldThrow={true} />
    </ErrorBoundary>,
  )
  const error = expect.any(Error)
  const info = {componentStack: expect.stringContaining('Bomb')}
  expect(mockReportError).toHaveBeenCalledWith(error, info)
  expect(mockReportError).toHaveBeenCalledTimes(1)
  expect(console.error).toBeCalledTimes(2) // 1 jest-dom, 1 react-dom
  expect(screen.getByRole('alert')).toBeInTheDocument()

  mockReportError.mockClear()
  console.error.mockClear()

  screen.rerender(
    <ErrorBoundary>
      <Bomb />
    </ErrorBoundary>,
  )
  const tryAgainBtn = screen.getByText(/try again/i)
  user.click(tryAgainBtn)

  expect(mockReportError).not.toHaveBeenCalled()
  expect(console.error).not.toHaveBeenCalled()
  expect(screen.queryByRole('alert')).not.toBeInTheDocument()
  expect(tryAgainBtn).not.toBeInTheDocument()
})
