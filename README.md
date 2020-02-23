# Late delivery notification service for CDK
This project is built using CDK and Node.js. It demonstrates SNS and lambda but otherwise doesn't do anything that cool

## What's it do?
The scenario:

- there is an already existant service that publishes notifications when shipments have been delivered to a SNS topic
- these notifications look like this:

```json
{
  "promisedDate": "2020-02-23T21:54:20.772Z",
  "deliveryDate": "2020-02-24T21:54:20.772Z",
  "shipmentId": "abcd" 
}
```

- the delivery notification service (that is, this service) subscribes to the delivery topic. Every time it receives a notification that a shipment was delivered, the service spins up a lambda that checks if the shipment was delivered on time.

- if the shipment was not delivered on time, the lambda publishes a late notification to another SNS topic. An email address is subscribed to this topic (it is hardcoded in the demo). But you can assume that the email address belongs to someone VERY IMPORTANT who will be grumpy if a shipment is delivered late.

## How to install
` $ npm install && cd functions/notifier && npm install`

## Other useful commands

 * `npm run build`   compile typescript to js
 * `npm run watch`   watch for changes and compile
 * `npm run test`    perform the jest unit tests
 * `cdk deploy`      deploy this stack to your default AWS account/region
 * `cdk diff`        compare deployed stack with current state
 * `cdk synth`       emits the synthesized CloudFormation template

 ## TODO
 - organize CDK code better
 - use a queue instead of having the lambda subscribe to SNS directly
