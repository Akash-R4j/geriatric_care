import type { Assessment } from './schema';

// Fake save: there is no backend, so just wait.
export async function saveAssessment(_assessment: Assessment): Promise<void> {
  await new Promise((resolve) => setTimeout(resolve, 800));
}
