const data = [
  {
    templateId: "1",
    templateName: "New Appointment",
    "1":
      "Hello, This is a message from Dr. Michael Stephenson’s office for ${patient}. You have an appointment with ${practitioner} on ${date} at the following location: ${clinic}",
    "2":
      "(Arabic) Hello, This is a message from Dr. Michael Stephenson’s office for ${patient}. You have an appointment with ${practitioner} on ${date} at the following location: ${clinic}"
  }
];

// TODO: update to use /templates
const getTemplates = () => {
  return new Promise(r => r(data));
};

export { getTemplates };
