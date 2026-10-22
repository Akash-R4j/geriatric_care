import { useState } from 'react';
import {
  Alert,
  Button,
  Checkbox,
  Code,
  Container,
  Group,
  NumberInput,
  Paper,
  Select,
  Stack,
  TextInput,
  Title,
} from '@mantine/core';
import { DateInput } from '@mantine/dates';
import { schemaResolver, useForm } from '@mantine/form';
import { samplePatient } from './fixtures';
import { type Assessment, assessmentSchema, MOBILITY } from './schema';

// What the inputs hold while the nurse is typing: blanks allowed, so it cannot be Assessment.
// Derived from Assessment so the field list stays in one place.
type FormValues = {
  [K in keyof Assessment]: Assessment[K] extends number
    ? number | string
    : Assessment[K] extends boolean
      ? boolean
      : string | null;
};

const initialValues: FormValues = {
  mrn: '',
  patientName: '',
  dateOfBirth: null,
  assessmentDate: null,
  mobility: null,
  barthelIndex: '',
  medicationCount: '',
  pharmacistReviewRequested: false,
  followUpDate: null,
  consentObtained: false,
};

// 'home_visit' -> 'Home visit'
const toLabel = (value: string) => {
  const words = value.replace(/_/g, ' ');
  return words.charAt(0).toUpperCase() + words.slice(1);
};
const mobilityOptions = MOBILITY.map((value) => ({ value, label: toLabel(value) }));

const today = new Date().toISOString().slice(0, 10);

interface AssessmentFormProps {
  onSave: (assessment: Assessment) => Promise<void>;
}

export function AssessmentForm({ onSave }: AssessmentFormProps) {
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState<Assessment | null>(null);

  const form = useForm<FormValues, Assessment>({
    mode: 'uncontrolled',
    initialValues,
    validate: schemaResolver(assessmentSchema, { sync: true }),
    validateInputOnBlur: true,
    // Runs only after validation passes, so this returns what Zod parsed (e.g. trimmed strings).
    transformValues: (values) => assessmentSchema.parse(values),
  });

  const handleSubmit = async (assessment: Assessment) => {
    setSaved(null);
    setSaving(true);
    try {
      await onSave(assessment);
      setSaved(assessment);
    } finally {
      setSaving(false);
    }
  };

  const loadSample = () => {
    form.setValues(samplePatient);
    form.clearErrors();
    setSaved(null);
  };

  return (
    <Container size="sm" my="xl">
      <Paper withBorder shadow="sm" p="lg">
        <form onSubmit={form.onSubmit(handleSubmit)} noValidate>
          <Stack>
            <Title order={2}>Geriatric Care Assessment</Title>

            <TextInput
              label="Medical record number"
              placeholder="MRN-004821"
              key={form.key('mrn')}
              {...form.getInputProps('mrn')}
            />
            <TextInput
              label="Patient name"
              key={form.key('patientName')}
              {...form.getInputProps('patientName')}
            />
            <DateInput
              label="Date of birth"
              valueFormat="YYYY-MM-DD"
              key={form.key('dateOfBirth')}
              {...form.getInputProps('dateOfBirth')}
            />
            <DateInput
              label="Assessment date"
              valueFormat="YYYY-MM-DD"
              maxDate={today}
              key={form.key('assessmentDate')}
              {...form.getInputProps('assessmentDate')}
            />
            <Select
              label="Mobility"
              placeholder="Select"
              data={mobilityOptions}
              allowDeselect={false}
              key={form.key('mobility')}
              {...form.getInputProps('mobility')}
            />
            <NumberInput
              label="Barthel Index"
              step={5}
              min={0}
              max={100}
              clampBehavior="none"
              key={form.key('barthelIndex')}
              {...form.getInputProps('barthelIndex')}
            />
            <NumberInput
              label="Regular medications"
              min={0}
              max={30}
              clampBehavior="none"
              key={form.key('medicationCount')}
              {...form.getInputProps('medicationCount')}
            />
            <Checkbox
              label="Pharmacist review requested"
              key={form.key('pharmacistReviewRequested')}
              {...form.getInputProps('pharmacistReviewRequested', { type: 'checkbox' })}
            />
            <DateInput
              label="Next review date"
              valueFormat="YYYY-MM-DD"
              key={form.key('followUpDate')}
              {...form.getInputProps('followUpDate')}
            />
            <Checkbox
              label="Patient or representative has given consent"
              key={form.key('consentObtained')}
              {...form.getInputProps('consentObtained', { type: 'checkbox' })}
            />

            <Group justify="space-between">
              <Button variant="default" onClick={loadSample} disabled={saving}>
                Load sample patient
              </Button>
              <Button type="submit" loading={saving} disabled={saving}>
                Save assessment
              </Button>
            </Group>

            {saved && (
              <Alert color="green" title="Assessment saved">
                <Code block>{JSON.stringify(saved, null, 2)}</Code>
              </Alert>
            )}
          </Stack>
        </form>
      </Paper>
    </Container>
  );
}
