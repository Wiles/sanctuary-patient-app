import React from "react";
import { Button, InputLabel, Select, MenuItem } from '@material-ui/core';
import { getTemplates, getLanguages, getAppointment } from '../services';


class NewMessage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isSent: false,
      appointment: null,
      languages: [],
      templates: [],
      message: {
        languageId: '',
        templateId: ''
      }
    }
  }

  async componentDidMount() {
    const languages = await getLanguages();
    const templates = await getTemplates();
    const appointment = await getAppointment('1');
    this.setState({
      appointment,
      languages,
      templates,
      message: {
        ...this.state.message,
        languageId: (languages[0]) ? languages[0].id : '1',
        templateId: (templates[0]) ? templates[0].templateId : '1'
      }
    });
  }

  updateSelect = (e) => {
    this.setState({
      message: {
        ...this.state.message,
        [e.target.name]: e.target.value
      }
    });
  }

  displayMessage() {
    const { templates, message, appointment } = this.state;
    let messageBody = "";
    messageBody = templates.find(tpl => tpl.templateId === message.templateId)[message.languageId];
    messageBody = messageBody.replace('${patient}', appointment.patientName);
    messageBody = messageBody.replace('${practitioner}', appointment.practitionerName);
    messageBody = messageBody.replace('${date}', appointment.date);
    messageBody = messageBody.replace('${clinic}', appointment.clinicName + ', ' + appointment.clinicAddress);
    return messageBody;
  }

  createNewMessage = (e) => {
    e.preventDefault();
    this.setState({
      isSent: true
    })
  }

  render() {
    const { isSent, appointment, message, languages, templates } = this.state;
    if (isSent) return (
      <div>
        <p style={{ fontWeight: 'bold', fontSize: '2rem', color: 'darkGreen', padding: '1.5rem' }}>Message Sent!</p>
      </div>
    )
    return <div>
      <form onSubmit={this.createNewMessage} style={{ padding: '1.5rem' }}>
        <div style={{ margin: '1.5rem 0' }}>
          <InputLabel id="language">Language</InputLabel>
          <Select labelId="language" name="languageId" value={message.languageId} onChange={this.updateSelect}>
            {languages.map(lang => (
              <MenuItem value={lang.id} key={lang.id}>{lang.name}</MenuItem>
            ))}
          </Select>
        </div>
        <div style={{ marginBottom: '1.5rem' }}>
          <InputLabel id="template">Template</InputLabel>
          <Select labelId="template" name="templateId" value={message.templateId} onChange={this.updateSelect}>
            {templates.map(tpl => (
              <MenuItem value={tpl.templateId} key={tpl.templateId}>{tpl.templateName}</MenuItem>
            ))}
          </Select>
        </div>
        {message.templateId && message.languageId && appointment && (
          <div style={{ border: 'solid 1px #ccc', padding: '1rem', marginBottom: '1.5rem' }}>
            {this.displayMessage()}
          </div>
        )}
        <div>
          <Button variant="contained" color="primary" type="submit">Send Message</Button>
        </div>
      </form>
    </div>
  }
}

export default NewMessage;
