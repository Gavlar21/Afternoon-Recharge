const Alexa = require('ask-sdk-core');

const STATIONS = {
  hour one: {
    name:   'Hour One',
    stream: 'http://afternoonrecharge.co.uk/Alexa%20Skill/AFTERNOON%20RECHARGE%20%e2%80%93%20HOUR%201.mp3',
  },
  hour two: {
    name:   'Hour Two',
    stream: 'http://afternoonrecharge.co.uk/Alexa%20Skill/AFTERNOON%20RECHARGE%20%e2%80%93%20HOUR%202.mp3',
  },
  hour three: {
    name:   'Hour Three',
    stream: 'http://afternoonrecharge.co.uk/Alexa%20Skill/AFTERNOON%20RECHARGE%20%e2%80%93%20HOUR%203.mp3',
  },

};

// Welcome message when skill opens
const LaunchHandler = {
  canHandle(handlerInput) {
    return handlerInput.requestEnvelope.request.type === 'LaunchRequest';
  },
  handle(handlerInput) {
    return handlerInput.responseBuilder
      .speak('Hello and Welcome to the Afternoon Recharge Alexa skill! New episodes are updated every Saturday afternoon. To start listening to the latest show, you can say Open Hour One, Open Hour Two or Open Hour Three.')
      .reprompt('Please say Open Hour One, Open Hour Two or Open Hour Three.')
      .withSimpleCard('Afternoon Recharge', 'Say Open Hour One\nSay Open Hour Two\nSay Open Hour Three')
      .getResponse();
  },
};

// User says "Open Hour One", "Open Hour Two" or "Open Hour Three"
const OpenStationHandler = {
  canHandle(handlerInput) {
    return handlerInput.requestEnvelope.request.type === 'IntentRequest' &&
      handlerInput.requestEnvelope.request.intent.name === 'OpenStationIntent';
  },
  handle(handlerInput) {
    const slotValue = handlerInput.requestEnvelope.request.intent.slots.Station.value || '';
    const key = slotValue.toLowerCase().includes('hour one') : 'hour two' : 'hour three';
    const station = STATIONS[key];

    return handlerInput.responseBuilder
      .speak(`Starting ${station.name}. Here comes Afternoon Recharge with Gavin Bass. Enjoy the show!`)
      .addDirective({
        type: 'AudioPlayer.Play',
        playBehavior: 'REPLACE_ALL',
        audioItem: {
          stream: {
            token: key,
            url: station.stream,
            offsetInMilliseconds: 0,
          },
          metadata: {
            title: station.name,
            subtitle: 'Afternoon Recharge',
          },
        },
      })
      .getResponse();
  },
};

// Stop / Pause / Cancel
const StopHandler = {
  canHandle(handlerInput) {
    const name = handlerInput.requestEnvelope.request.intent && handlerInput.requestEnvelope.request.intent.name;
    return handlerInput.requestEnvelope.request.type === 'IntentRequest' &&
      (name === 'AMAZON.StopIntent' || name === 'AMAZON.CancelIntent' || name === 'AMAZON.PauseIntent');
  },
  handle(handlerInput) {
    return handlerInput.responseBuilder
      .addDirective({ type: 'AudioPlayer.Stop' })
      .speak('Stopped. Do you want to listen again? Say Open Hour One, Open Hour Two or Open Hour Three.')
      .reprompt('Say Open Hour One, Open Hour Two, or Open Hour Three.')
      .getResponse();
  },
};

// Help
const HelpHandler = {
  canHandle(handlerInput) {
    return handlerInput.requestEnvelope.request.type === 'IntentRequest' &&
      handlerInput.requestEnvelope.request.intent.name === 'AMAZON.HelpIntent';
  },
  handle(handlerInput) {
    return handlerInput.responseBuilder
      .speak('Say Open Hour One, Say Open Hour Two or Open Hour Three.')
      .reprompt('Say Open Hour One, Say Open Hour Two or Open Hour Three.')
      .getResponse();
  },
};

// Required stubs
const AudioPlayerHandler = {
  canHandle(handlerInput) {
    return handlerInput.requestEnvelope.request.type.startsWith('AudioPlayer.');
  },
  handle(handlerInput) {
    return handlerInput.responseBuilder.getResponse();
  },
};

const SessionEndedHandler = {
  canHandle(handlerInput) {
    return handlerInput.requestEnvelope.request.type === 'SessionEndedRequest';
  },
  handle(handlerInput) {
    return handlerInput.responseBuilder.getResponse();
  },
};

const ErrorHandler = {
  canHandle() { return true; },
  handle(handlerInput) {
    return handlerInput.responseBuilder
      .speak('Ooops! Sorry, something went wrong there. Please can you try that again.')
      .getResponse();
  },
};

exports.handler = Alexa.SkillBuilders.custom()
  .addRequestHandlers(
    LaunchHandler,
    OpenStationHandler,
    StopHandler,
    HelpHandler,
    AudioPlayerHandler,
    SessionEndedHandler,
  )
  .addErrorHandlers(ErrorHandler)
  .lambda();