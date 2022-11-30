import { Button, Grid } from "@material-ui/core";
import { Field, Formik, Form } from "formik";
import { DiagnosisSelection, TypeSelectField, TextField } from "../AddPatientModal/FormField";
import { useStateValue } from "../state";
import { Diagnosis, HealthCheckRating, SickLeave } from "../types";

interface Props {
  onSubmit: (values: EntryFormValues) => void;
  onCancel: () => void;
  id: string;
}

const typeOptions = [
  { value: 'Hospital', label: "Hospital" },
  { value: 'OccupationalHealthcare', label: "Occupational Healthcare" },
  { value: 'HealthCheck', label: "Health Check" },
];

const AddEntryForm = ({ onSubmit, onCancel, id }: Props) => {
  const [{ diagnoses }] = useStateValue();

  return (
    <Formik
      initialValues={{
        type: 'Hospital',
        description: '',
        date: '',
        specialist: '',
        id: id,        
        dischargeDate: '',
        dischargeReason: '',
        healthCheckRating: HealthCheckRating.Healthy,
        sickLeaveStart: '',
        sickLeaveEnd: '',
        employerName: '',
        diagnosisCodes: [],
      }}
      onSubmit={onSubmit}
      validate={values => {
        const requiredError = "Field is required";
        const dateError = 'Please enter a correct date';
        const errors: { [field: string]: string } = {};
        if (!values.description) {
          errors.description = requiredError;
        }
        if (values.type === 'Hospital' && !values.dischargeDate) {
          errors.dischargeDate = requiredError;
        }
        if (values.type === 'Hospital' && !values.dischargeReason) {
          errors.dischargeReason = requiredError;
        }
        if (values.type === 'OccupationalHealthcare' && !values.employerName) {
          errors.employerName = requiredError;
        }
        if (values.type === 'HealthCheck' && !values.healthCheckRating) {
          errors.healthCheckRating = requiredError;
        }
        if (
          values.type === 'HealthCheck' &&
          !(['0', '1', '2', '3']).includes(String(values.healthCheckRating))
        ) {
          errors.healthCheckRating = 'Please enter a value of 0-3';
        }
        if (!Date.parse(values.date)) {
          errors.date = dateError;
        }
        if (values.type === 'Hospital' && !Date.parse(String(values.dischargeDate))) {
          errors.dischargeDate = dateError;
        } 
        if (
          values.type === 'OccupationalHealthcare' &&
          values.sickLeaveStart &&
          !Date.parse(String(values.sickLeaveStart))
        ) {
          errors.sickLeaveStart = dateError;
        } 
        if (
          values.type === 'OccupationalHealthcare' &&
          values.sickLeaveEnd &&
          !Date.parse(String(values.sickLeaveEnd))
        ) {
          errors.sickLeaveEnd = dateError;
        }  
          
        return errors;
      }}
    >
    {({ dirty, isValid, setFieldValue, setFieldTouched, values }) => {

      return (
        <Form className="form ui">
          <TypeSelectField label="Type" name="type" options={typeOptions} />
          <Field
            label="Description"
            placeholder="Description"
            name="description"
            component={TextField}
          />
          <Field
            label="Date"
            placeholder="2023-01-01"
            name="date"
            component={TextField}
          />
          <Field
            label="Specialist"
            placeholder="Specialist"
            name="specialist"
            component={TextField}
          />
          
          {values.type === 'Hospital' ? 
            <>
              <Field
                label='Discharge Date'
                placeholder='2023-01-01'
                name="dischargeDate"
                component={TextField}
              />
              <Field
                label="Discharge Reason"
                placeholder='Discharge reason'
                name="dischargeReason"
                component={TextField}
              />
            </>
          : null}

          {values.type === 'HealthCheck' ?
            <Field
              label="Health rating (0-3)"
              placeholder=""
              name="healthCheckRating"
              component={TextField}
            />          
          : null}

          {values.type === 'OccupationalHealthcare' ?
            <>
              <Field 
                label="Employer name"
                placeholder=""
                name="employerName"
                component={TextField}
              />
              <Field
                label="Sick leave (start)"
                placeholder="2000-01-01"
                name="sickLeaveStart"
                component={TextField}
              />
              <Field
                label="Sick leave (end)"
                placeholder="2000-01-02"
                name="sickLeaveEnd"
                component={TextField}
              />
            </>
          : null}
          <DiagnosisSelection
            setFieldValue={setFieldValue}
            setFieldTouched={setFieldTouched}
            diagnoses={Object.values(diagnoses)}
          />
          <Grid>
              <Grid item>
                <Button
                  color="secondary"
                  variant="contained"
                  style={{ float: "left" }}
                  type="button"
                  onClick={onCancel}
                >
                  Cancel
                </Button>
              </Grid>
              <Grid item>
                <Button
                  style={{
                    float: "right",
                  }}
                  type="submit"
                  variant="contained"
                  disabled={!dirty || !isValid}
                >
                  Add
                </Button>
              </Grid>
            </Grid> 
        </Form>
      );
    }}
  </Formik>
  );
};

type EntryType = 'Hospital' | 'HealthCheck' | 'OccupationalHealthcare';

interface NewEntry {
  id: string;
  type: EntryType;
  description: string;
  date: string;
  specialist: string;
  diagnosisCodes?: Array<Diagnosis['code']>,
  dischargeDate?: string,
  dischargeReason?: string,
  discharge?: { date: string, reason: string },
  sickLeaveStart?: string,
  sickLeaveEnd?: string,
  sickLeave?: SickLeave,
  healthCheckRating?: HealthCheckRating,
  employerName?: string,
}

export type EntryFormValues = NewEntry;

export default AddEntryForm;