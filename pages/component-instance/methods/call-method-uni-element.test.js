const PAGE_PATH = '/pages/component-instance/methods/call-method-uni-element-options'
const PAGE_COMPOSITION_PATH = '/pages/component-instance/methods/call-method-uni-element-composition'

describe('call-method-uni-element', () => {
  let page

  it('callMethodTest Options API', async () => {
    page = await program.reLaunch(PAGE_PATH)
    await page.waitFor(500)
    const title = Date.now() + ''
    const result = await page.callMethod('callMethodTest', title)
    expect(result).toBe(title)
  })

  it('callMethodTest Composition API', async () => {
    page = await program.reLaunch(PAGE_COMPOSITION_PATH)
    await page.waitFor(500)
    const title = Date.now() + ''
    const result = await page.callMethod('callMethodTest', title)
    expect(result).toBe(title)
  })
})
