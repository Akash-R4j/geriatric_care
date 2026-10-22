import { render, screen, userEvent, waitFor } from '@test-utils';
import { AssessmentForm } from './AssessmentForm';
import { samplePatient } from './fixtures';

describe('AssessmentForm', () => {
  it('saves the parsed values after loading the sample patient', async () => {
    const onSave = vi.fn().mockResolvedValue(undefined);
    const user = userEvent.setup();
    render(<AssessmentForm onSave={onSave} />);

    await user.click(screen.getByRole('button', { name: 'Load sample patient' }));
    await user.click(screen.getByRole('button', { name: 'Save assessment' }));

    await waitFor(() => expect(onSave).toHaveBeenCalledWith(samplePatient));
    expect(await screen.findByText('Assessment saved')).toBeInTheDocument();
  });
});
