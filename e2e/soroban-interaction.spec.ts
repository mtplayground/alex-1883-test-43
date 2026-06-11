import { expect, test } from '@playwright/test'
import type { Locator, Page } from '@playwright/test'

test('slides beads and updates the decimal readout', async ({ page }) => {
  await page.goto('/')

  await expect(
    page.getByRole('heading', { name: 'Interactive soroban' }),
  ).toBeVisible()

  const valueReadout = page.getByLabel('Decimal value')
  const tensRod = page.getByRole('group', { name: 'Rod 4' })
  const onesRod = page.getByRole('group', { name: 'Rod 5' })

  await expect(valueReadout).toContainText('0')

  await slideBead(
    page,
    onesRod.getByRole('button', { name: 'Earth bead 3 is inactive' }),
    -52,
  )
  await expect(valueReadout).toContainText('3')

  await slideBead(
    page,
    onesRod.getByRole('button', { name: 'Heavenly bead is inactive' }),
    52,
  )
  await expect(valueReadout).toContainText('8')

  await slideBead(
    page,
    tensRod.getByRole('button', { name: 'Earth bead 2 is inactive' }),
    -52,
  )
  await expect(valueReadout).toContainText('28')
})

async function slideBead(page: Page, bead: Locator, deltaY: number) {
  const box = await bead.boundingBox()

  if (!box) {
    throw new Error('Expected bead to have a visible bounding box.')
  }

  const x = box.x + box.width / 2
  const y = box.y + box.height / 2

  await page.mouse.move(x, y)
  await page.mouse.down()
  await page.mouse.move(x, y + deltaY, { steps: 6 })
  await page.mouse.up()
}
