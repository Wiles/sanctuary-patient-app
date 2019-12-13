import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import { Input, Link, Checkbox, Typography, Stepper, Step, StepLabel, Button, Select, MenuItem, FormControl, InputLabel, FormHelperText, FormControlLabel } from "@material-ui/core";
import {
  MuiPickersUtilsProvider,
  KeyboardTimePicker,
  KeyboardDatePicker
} from "@material-ui/pickers";
import { ContentSwitch } from "../components";
import MomentUtils from "@date-io/moment";

const useStyles = makeStyles(theme => ({
  button: {
    marginRight: theme.spacing(1)
  },
  instructions: {
    marginTop: theme.spacing(1),
    marginBottom: theme.spacing(1)
  },
  formControl: {
    margin: theme.spacing(1),
    minWidth: 120,
  },
  selectEmpty: {
    marginTop: theme.spacing(2),
  }
}));

function getSteps() {
  return ["Patient Information", "Clinic Information", "Appointment Information"];
}

const NewAppointment = () => {
  const classes = useStyles();
  const [activeStep, setActiveStep] = React.useState(0);
  const [skipped, setSkipped] = React.useState(new Set());
  const steps = getSteps();

  const isStepOptional = step => step === 3;
  const isStepSkipped = step => skipped.has(step);

  const [selectedDate, setSelectedDate] = React.useState(new Date());
  const [patientName, setPatientName] = React.useState("");
  const [patientPhone, setPatientPhone] = React.useState("");
  const [patientLanguage, setPatientLanguage] = React.useState(0);
  const [clinicName, setClinicName] = React.useState("");
  const [physicianName, setPhysicianName] = React.useState("");
  const [clinicAddress, setClinicAddress] = React.useState("");
  const [clinicPhone, setClinicPhone] = React.useState("");
  const [template, setTemplate] = React.useState(0);
  const [moreInfo, setMoreInfo] = React.useState("");
  const [needInterpretor, setNeedInterpretor] = React.useState();

  const handleDateChange = date => {
    setSelectedDate(date);
  };

  const handleNext = () => {
    let newSkipped = skipped;
    if (isStepSkipped(activeStep)) {
      newSkipped = new Set(newSkipped.values());
      newSkipped.delete(activeStep);
    }

    setActiveStep(prevActiveStep => prevActiveStep + 1);
    setSkipped(newSkipped);
  };

  const handleBack = () => {
    setActiveStep(prevActiveStep => prevActiveStep - 1);
  };

  const handleSkip = () => {
    if (!isStepOptional(activeStep)) {
      // You probably want to guard against something like this,
      // it should never occur unless someone's actively trying to break something.
      throw new Error("You can't skip a step that isn't optional.");
    }

    setActiveStep(prevActiveStep => prevActiveStep + 1);
    setSkipped(prevSkipped => {
      const newSkipped = new Set(prevSkipped.values());
      newSkipped.add(activeStep);
      return newSkipped;
    });
  };

  const handleReset = () => setActiveStep(0);

  const languages = [
    {
      id: 1,
      iso: "en",
      name: "English",
      direction: "ltr"
    },
    {
      id: 2,
      iso: "ar",
      name: "Arabic",
      direction: "rtl"
    },
    {
      id: 3,
      iso: "es",
      name: "Spanish",
      direction: "ltr"
    }
  ];

  const templates = []; // GET TEMPLATES HERE

  var languageOptions = languages.map(function(language) {
    return <MenuItem value={language.id}>{language.name}</MenuItem>
  });

  var templateOptions = templates.map(function(template) {
    return <MenuItem value={template.templateId}>{template.templateName}</MenuItem>
  });

  return (
    <>
      <Typography variant="h1" gutterBottom>Create an Appointment</Typography>
      <form id="new-appointment-form" noValidate autoComplete="off">
        <Stepper activeStep={activeStep}>
          {steps.map((label, index) => {
            const stepProps = {};
            const labelProps = {};
            if (isStepOptional(index)) {
              labelProps.optional = (
                <Typography variant="caption">Optional</Typography>
              );
            }
            if (isStepSkipped(index)) {
              stepProps.completed = false;
            }
            return (
              <Step key={label} {...stepProps}>
                <StepLabel {...labelProps}>{label}</StepLabel>
              </Step>
            );
          })}
        </Stepper>
        <div>
          {activeStep === steps.length ? (
            <div>
              {window.location = "/appointments"}
            </div>
          ) : (
            <div>
              <ContentSwitch index={activeStep}>
                <div>
                  <Typography variant="h2" gutterBottom>Patient</Typography>
                  <FormControl className={classes.formControl}>
                    <InputLabel htmlFor="name">Name</InputLabel>
                    <Input id="name" value={patientName} />
                  </FormControl>
                  <FormControl className={classes.formControl}>
                    <InputLabel htmlFor="phone">Phone Number</InputLabel>
                    <Input id="phone" aria-describedby="phone-helper-text" value={patientPhone} />
                    <FormHelperText id="phone-helper-text">In the format 123-123-1234</FormHelperText>
                  </FormControl>
                  <FormControl className={classes.formControl}>
                    <InputLabel id="language-label">Language</InputLabel>
                    <Select displayEmpty id="language" labelId="language-label" value={patientLanguage} onChange={setPatientLanguage}>
                      <MenuItem value={0} disabled>None</MenuItem>
                      {languageOptions}
                    </Select>
                  </FormControl>
                </div>
                <div>
                <Typography variant="h2" gutterBottom>Clinic</Typography>
                    <FormControl className={classes.formControl}>
                        <InputLabel htmlFor="clinic-name">Clinic Name</InputLabel>
                        <Input id="clinic-name" value={clinicName} />
                    </FormControl>

                    <FormControl className={classes.formControl}>
                        <InputLabel htmlFor="practitioner-name">Practitioner Name</InputLabel>
                        <Input id="practitioner-name" value={physicianName} />
                    </FormControl>

                    <FormControl className={classes.formControl}>
                        <InputLabel htmlFor="address">Address</InputLabel>
                        <Input id="address" value={clinicAddress} />
                    </FormControl>

                    <FormControl className={classes.formControl}>
                        <InputLabel htmlFor="phone">Phone Number</InputLabel>
                        <Input id="phone" aria-describedby="phone-helper-text" value={clinicPhone} />
                        <FormHelperText id="phone-helper-text">In the format 123-123-1234</FormHelperText>
                    </FormControl>
                </div>
                <div>
                  <Typography variant="h2" gutterBottom>
                    Appointment
                  </Typography>
                  <MuiPickersUtilsProvider utils={MomentUtils}>
                    <FormControl className={classes.formControl}>
                      <KeyboardDatePicker
                        disableToolbar
                        variant="inline"
                        format="MM/DD/YYYY"
                        margin="normal"
                        label="Appointment Date"
                        value={selectedDate}
                        onChange={handleDateChange}
                        id="date"
                        KeyboardButtonProps={{
                          "aria-label": "change date"
                        }}
                        aria-describedby="date-helper-text"
                      />
                    </FormControl>
                    <FormControl className={classes.formControl}>
                      <KeyboardTimePicker
                        margin="normal"
                        id="time"
                        label="Appointment Time"
                        KeyboardButtonProps={{
                          "aria-label": "change time"
                        }}
                        value={selectedDate}
                        onChange={handleDateChange}
                        aria-describedby="time-helper-text"
                      />
                    </FormControl>
                  </MuiPickersUtilsProvider>

                  <FormControl className={classes.formControl}>
                    <InputLabel id="template-label">Template</InputLabel>
                    <Select displayEmpty id="template" labelId="template-label" value={template} onChange={setTemplate}>
                      <MenuItem value={0} disabled>
                        None
                      </MenuItem>
                      <MenuItem value="1">Template 1</MenuItem>
                    </Select>
                  </FormControl>

                  <FormControl className={classes.formControl}>
                    <FormControlLabel
                      control={
                      <Checkbox
                          id="additional-information"
                          color="primary"
                          value={moreInfo}
                      />
                      }
                      label="Additional Information"
                    />
                  </FormControl>

                  <FormControl className={classes.formControl}>
                    <FormControlLabel
                      control={
                      <Checkbox
                          id="interpretor-required"
                          color="primary"
                          value={needInterpretor}
                      />
                      }
                      label="Interpretor"
                    />
                  </FormControl>
                </div>
              </ContentSwitch>
              <div>
              {activeStep === 0 && (
                  <Link
                  href="/appointments"
                  className={classes.button}
                  >
                    CANCEL
                  </Link>
                )}
                {activeStep !== 0 && (
                  <Button
                  onClick={handleBack}
                  className={classes.button}
                >
                  Back
                </Button>
                )}
                {isStepOptional(activeStep) && (
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={handleSkip}
                    className={classes.button}
                  >
                    Skip
                  </Button>
                )}
                {activeStep !== steps.length - 1 && (
                  <Button
                  variant="contained"
                  color="primary"
                  onClick={handleNext}
                  className={classes.button}
                  type="button"
                  >
                  Next
                </Button>
                )}
                {activeStep === steps.length - 1 && (
                  <Button
                  variant="contained"
                  color="primary"
                  onClick={handleNext}
                  className={classes.button}
                  type="submit"
                  >
                  Create Appointment
                </Button>
                )}
              </div>
            </div>
          )}
        </div>
      </form>
    </>
  );
};

export default NewAppointment;
