'use strict'

import { lambdaHandler } from '../../app.mjs'
import { expect } from 'chai'
let event, context

describe('Tests index', function () {
  it('verifies successful response', async () => {
    const result = await lambdaHandler(event, context)

    expect(result).to.be.an('object')
    expect(result.statusCode).to.equal(200)
  })
})
