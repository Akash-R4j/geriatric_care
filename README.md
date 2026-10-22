# Geriatric Care Assessment Form

One-page assessment form for a visiting nurse. React 19, TypeScript, Mantine, `@mantine/form`, Zod 4.

**Live URL:** _TODO: add deployed URL_

## Run

```
yarn install
yarn dev        # dev server
yarn test       # typecheck, lint, format check, stylelint, vitest, build
```

## Layout

- `src/features/assessment/schema.ts` – the given Zod schema; the only place rules live.
- `AssessmentForm.tsx` – the form. Validation is `schemaResolver(assessmentSchema)`.
- `fixtures.ts` – the invented sample patient. `saveAssessment.ts` – fake 800ms save.

## Decisions

- **Input vs output type:** `FormValues` is a mapped type over `Assessment` (numbers may be blank, dates and mobility may be `null`). On a valid submit, `transformValues` runs `assessmentSchema.parse`, so the save handler and the success `Code` block get Zod's output, not form state.
- **No silent changes to numbers:** `NumberInput` uses `clampBehavior="none"`, so `105` or `82` stays as typed and is rejected by the schema instead of being clamped.
- **`assessmentDate` max** is computed from the browser's current date.
- **Template changes:** removed the demo components, router and Storybook. The stylelint script now uses double quotes (single quotes fail on Windows) and `--allow-empty-input` (the project has no CSS files). No lint or format config was removed.

## Not done

- Deployment URL still to add.
- Only the two requested tests; the other fixture cases were checked by hand (an empty submit gives exactly 9 errors).

## Time

Roughly 1 hour.
