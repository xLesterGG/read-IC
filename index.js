'use strict';

const api = require('smartcard'); //main package that contains communication handler for reader hardware and smart card
const Devices = api.Devices;
const Iso7816Application = api.Iso7816Application;
const CommandApdu = api.CommandApdu;
const fs = require('fs')
const sharp = require('sharp');

const devices = new Devices();

//This event will fire once the device is plugged in and detected
devices.on('device-activated', event => {
    const currentDevices = event.devices;
    let device = event.device;
    // console.log(`Device '${device}' activated, devices: ${currentDevices}`);
    currentDevices.map((device, index) => {
        // console.log(`Device #${index + 1}: ${device.name}`);
    });

	//This event will fire once the card is inserted, all reading operation happens here...
    device.on('card-inserted', event => {
        let card = event.card;
        // console.log(`\nCard '${card.getAtr()}' inserted into '${event.device}'`);  //Show card Attributes

        card.on('command-issued', event => {
            // console.log(`Command '${event.command}' issued to '${event.card}' `);  //This event will fire once command is succesfully issued by the reader (just a feedback to ensure command is issued)
        });

        card.on('response-received', event => {
            // console.log(event.command);
            // console.log(event.card);
            // console.log(event.response.meaning());
            // console.log(event.response.getStatusCode());
            // console.log(event.response.isOk());

            // console.log(event.response.correctLength());
            // console.log('response-recieved length is '+event.response.buffer.length);
            // console.log(event.response.hasMoreBytesAvailable());
            // console.log(`Response '${event.response}' received from '${event.card}' in response to '${event.command}'`);  //The card will reply to the command issued and this event will fire (for debugging)
        });
        /*Mykad reading operation starts here. See attached documentation for elaborate explanation*/


        card.issueCommand(new CommandApdu({bytes: [0x00,0xA4,0x04,0x00,0x0A,0xA0,0x00,0x00,0x00,0x74,
            0x4A,0x50,0x4E,
            0x00,0x10
        ]})) //Select Application


        let xx = [];


        let x = 0
        let hxx = ''
        let xy = []

        getHex(14)

        function getHex(offset){

            let readLength = 256
            // if(offset == 3750){
            //     readLength = readLength - 50
            // }

            let a = new CommandApdu({
                cla:204,
                ins:6,
                p1:0,
                p2:0,
                le:readLength
            })

            card.issueCommand(new CommandApdu({bytes: [0xC8,0x32,0x00,0x00,0x05,0x08,0x00,0x00, //Set Length
                readLength,0x00
            ]}))//end Set Length

            card.issueCommand(new CommandApdu({bytes: [0xCC,0x00,0x00,0x00,0x08, //Set Information
                0x03,0x00,0x01,0x00,
                offset+3,0x00,
                readLength,0x00
            ]}))
            .then(() => {

                card.issueCommand(a)
                .then((response) => {
                    // xx.push(response)
                    // console.log(offset);
                    // hxx= hxx+ response.toString('hex').slice(0, -4)
                    // xx.push(new Buffer.from(response.toString('hex').slice(0, -4), "hex"))

                    // if(offset == 3750){
                    // }
                    console.log(response)
                    console.log(response.toString())

                    console.log(response.toString('hex').slice(0, -4)); // I get bytes here
                    console.log('currently ' + offset + ' to ' + (offset+readLength));

                    if(offset<=424){ //3500
                        // if(offset==3750){
                        //     console.log('aaaa');
                            // getHex(offset+424)
                        // }else{
                            // getHex(offset+250)
                        // }
                    }else{
                        // doPicture()
                    }
                }) //end Read Information
            })
        }





        // hxx= hxx+ response.toString('hex').replace('9000','')
        // xy.push(offset)
        // // console.log(xy);
        //


        // let read = new CommandApdu({bytes: [0xCC,0x06,0x00,0x00,
        //     0xFF
        // ]})//Read Information


        const application = new Iso7816Application(card);

		// This event will fire once the correct Application is selected
        application.on('application-selected', event => {
            console.log(`Application Selected ${event.application}`);
        });
    });

	//This event will fire once card is removed
	device.on('card-removed', event => {
        console.log(`Card ${event.card} removed from '${event.name}' `);
    });

});


//This event will fire once device is removed from USB port
devices.on('device-deactivated', event => {
	console.log(`Device '${event.device}' deactivated, devices: [${event.devices}]`);
});
