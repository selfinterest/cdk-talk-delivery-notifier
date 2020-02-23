const AWS = require('aws-sdk')
const moment = require('moment')

/*
  Incoming notifications look like this:

{
  "promisedDate": "2020-02-23T21:54:20.772Z",
  "deliveryDate": "2020-02-24T21:54:20.772Z",
  "shipmentId": "abcd" 
}

*/
const processSnsMessage = (message) => {
  let shipmentNotification = {}
  try {
    shipmentNotification = JSON.parse(message)
  } catch (e) {
    console.error(`Problems parsing delivery notification message ${message}`)
    return null
  }

  if(!shipmentNotification || !shipmentNotification.promisedDate || !shipmentNotification.deliveryDate) {
    console.error(`invalid shipment notification: ${message}`)
    return null
  }

  return shipmentNotification
}

// If it returns anything greater than 0, shipment was late
const wasShipmentLate = (shipmentNotification = {}) => {
  const {promisedDate, deliveryDate} = shipmentNotification

    // was the shipment late?
    const promisedMom = moment(promisedDate)
    const deliveryMom = moment(deliveryDate)

    const dur = moment.duration(deliveryMom.diff(promisedMom));

    return dur.asHours()
}

const publishLateNotice = (shipmentNotification, hoursLate, topicArn) => {
  const sns = new AWS.SNS({region: "us-east-1"})

  const message = {
    ...shipmentNotification,
    hoursLate
  }

  console.log("A shipment was late!", message)

  const params = {
    Message: JSON.stringify(message),
    Subject: "Shipment was late!",
    TopicArn: topicArn
  }

  return sns.publish(params).promise()
  
}

const main = (event) => {
  const records = event.Records
  const lateTopicArn = process.env.LATE_TOPIC_ARN

  if(!records) return
  // lambda can get multiple messages. Iterate over them and parse to JSON
  
  // Array to hold async stuff
  const promises = []

  records.forEach( record => {
    console.log("Received shipment notification", record)

    const message = record.Sns.Message
    const shipmentNotification = processSnsMessage(message)

    if(shipmentNotification) {
      const hoursLate = wasShipmentLate(shipmentNotification)

      if(hoursLate > 0) {
        promises.push(
          publishLateNotice(shipmentNotification, hoursLate, lateTopicArn)
        )
      }
    }
  })

  // Wait until all the records are processed
  return Promise.all(promises)

}


module.exports = {main}