import React from 'react'
import {render} from '@testing-library/react'
import {axe} from 'jest-axe'

function Form() {
  return (
    <form>
      <label htmlFor="email">Email</label>
      <input id="email" type="text" />
    </form>
  )
}

test('the form is accessible', async () => {
  const screen = render(<Form />)
  const results = await axe(screen.container)
  expect(results).toHaveNoViolations()
})
