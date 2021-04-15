import React from 'react'

import {render /* fireEvent */} from '@testing-library/react'
import user from '@testing-library/user-event'

import {FavoriteNumber} from '../favorite-number'

test('entering an invalid input value', () => {
  const screen = render(<FavoriteNumber />)
  const input = screen.getByLabelText(/favorite number/i)

  user.type(input, '10')
  // fireEvent.change(input, {target: {value: '10'}})
  expect(screen.getByRole('alert')).toHaveTextContent(/number is invalid/i)
})
