import { samplePatient } from './fixtures';
import { assessmentSchema } from './schema';

describe('assessmentSchema age rule', () => {
  it('accepts a patient who turns 60 on the assessment date', () => {
    const result = assessmentSchema.safeParse({ ...samplePatient, dateOfBirth: '1966-08-07' });
    expect(result.success).toBe(true);
  });

  it('rejects a patient one day short of 60, on dateOfBirth', () => {
    const result = assessmentSchema.safeParse({ ...samplePatient, dateOfBirth: '1966-08-08' });
    expect(result.success).toBe(false);
    expect(result.error?.issues).toMatchObject([
      { path: ['dateOfBirth'], message: 'This pathway is for patients aged 60 and over' },
    ]);
  });
});
