const OPTIONS_PAGE_PATH = '/pages/directive/v-if/v-if-options'
const COMPOSITION_PAGE_PATH = '/pages/directive/v-if/v-if-composition'

describe('v-if', () => {
  let page
  const test = async (page) => {
    let vIfShow = await page.$('#v-if-show')
    expect(await vIfShow.text()).toBe('show')
    
    const switchVIfBtn = await page.$('#switch-v-if-btn')
    await switchVIfBtn.tap()
    vIfShow = await page.$('#v-if-show')
    expect(vIfShow).toBeNull()
    
    await switchVIfBtn.tap()
    vIfShow = await page.$('#v-if-show')
    expect(await vIfShow.text()).toBe('show')
    
    const num = await page.$('#num')
    expect(await num.text()).toBe('1')
    let numVIf = await page.$('#num-v-if')
    expect(await numVIf.text()).toBe('v-if num = 1')
    let numVElseIf = await page.$('#num-v-else-if')
    expect(numVElseIf).toBeNull()
    let numVElse = await page.$('#num-v-else')
    expect(numVElse).toBeNull()
    
    const changeNumBtn = await page.$('#change-num-btn')
    await changeNumBtn.tap()
    
    expect(await num.text()).toBe('2')
    numVIf = await page.$('#num-v-if')
    expect(numVIf).toBeNull()
    numVElseIf = await page.$('#num-v-else-if')
    expect(await numVElseIf.text()).toBe('v-else-if num = 2')
    numVElse = await page.$('#num-v-else')
    expect(numVElse).toBeNull()
    
    await changeNumBtn.tap()
    
    expect(await num.text()).toBe('3')
    numVIf = await page.$('#num-v-if')
    expect(numVIf).toBeNull()
    numVElseIf = await page.$('#num-v-else-if')
    expect(numVElseIf).toBeNull()
    numVElse = await page.$('#num-v-else')
    expect(await numVElse.text()).toBe('v-else')
    
    await changeNumBtn.tap()
    
    expect(await num.text()).toBe('1')
    numVIf = await page.$('#num-v-if')
    expect(await numVIf.text()).toBe('v-if num = 1')
    numVElseIf = await page.$('#num-v-else-if')
    expect(numVElseIf).toBeNull()
    numVElse = await page.$('#num-v-else')
    expect(numVElse).toBeNull()
  }
  
  it('v-if options API', async () => {
    page = await program.reLaunch(OPTIONS_PAGE_PATH)
    await page.waitFor('view')
    
    await test(page)
  })
  
  it('v-if composition API', async () => {
    page = await program.reLaunch(COMPOSITION_PAGE_PATH)
    await page.waitFor('view')
    
    await test(page)
  })
})