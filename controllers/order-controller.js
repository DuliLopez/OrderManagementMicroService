const express = require('express');
const router = express.Router();
var _ = require("underscore");
const bcrypt = require('bcrypt');
let Order = require('../models/order')
const Axios = require("axios")

function infolevellogger(text) {
    const slack = Axios.post(
        'https://hooks.slack.com/services/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', {
        text: text
    }
    );
}

function warnlevellogger(text) {
    const slack = Axios.post(
        'https://hooks.slack.com/services/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', {
        text: text
    }
    );
}


function generalLevelLogger(text) {
    const slack = Axios.post(
        'https://hooks.slack.com/services/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', {
        text: text
    }
    );
}

function fatalLevelLogger(text) {
    const slack = Axios.post(
        'https://hooks.slack.com/services/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', {
        text: text
    }
    );
}

function errorlevelLogger(text) {
    const slack = Axios.post(
        'https://hooks.slack.com/services/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', {
        text: text
    }
    );
}

function getTimeStamp() {
    let date_ob = new Date();

    // current date
    // adjust 0 before single digit date
    let date = ("0" + date_ob.getDate()).slice(-2);

    // current month
    let month = ("0" + (date_ob.getMonth() + 1)).slice(-2);

    // current year
    let year = date_ob.getFullYear();

    // current hours
    let hours = date_ob.getHours();

    // current minutes
    let minutes = date_ob.getMinutes();

    // current seconds
    let seconds = date_ob.getSeconds();

    // prints date in YYYY-MM-DD format


    // prints date & time in YYYY-MM-DD HH:MM:SS format
    return (year + "-" + month + "-" + date + " at " + hours + ":" + minutes + ":" + seconds);
}

module.exports = function () {

  
    router.post('/add-order', function (req, res) {
        let ReservationData = new Order(req.body);
        ReservationData.save()
            .then(Order => {
                var data = {
                    Status: "Sucess",
                    Message: "Order Created Sucessfully"
                }
               // generalLevelLogger("Order Created Sucessfully" + " TimeStamp :" + getTimeStamp())
                res.status(201).send(data);
            }).catch(err => {
                var data = {
                    Status: "Fail",
                    Message: "Unexpected Error PLease Contact System Admin"
                }
               // errorlevelLogger("Unexpected Error PLease Contact System Admin " + err + " TimeStamp :" + getTimeStamp())
                res.status(200).send(data);
            });

    })

    
    router.post('/remove-order', function (req, res) {
        try {
            console.log(req.body)
            Order.findByIdAndRemove({ _id: req.body.id }, function (err, todo) {
                if (!err) {
                    var data = {
                        Status: "Sucess",
                        Message: "Order Deleted"
                    }
                  //  generalLevelLogger("Order Deleted" + " TimeStamp :" + getTimeStamp())
                    res.status(200).send(data);
                } else {
                    var data = {
                        Status: "Fail",
                        Message: "Unexpected Error PLease Contact System Admin"
                    }
                   // errorlevelLogger("Unexpected Error PLease Contact System Admin " + err + " TimeStamp :" + getTimeStamp())
                    res.status(200).send(data);
                }
            });

        } catch {
            var data = {
                Status: "Fail",
                Message: "Unexpected Error PLease Contact System Admin"
            }
            //errorlevelLogger("Unexpected Error PLease Contact System Admin " + err + " TimeStamp :" + getTimeStamp())
            res.status(200).send(data);

        }

    })


    
    router.post('/update-order', function (req, res) {
        console.log("Test")
        try {
            Order.updateOne({ _id: req.body.id }, { User_Name: req.body.User_Name, Room_ID: req.body.Room_ID, From_Date: req.body.From_Date, To_Date: req.body.To_Date,Price:req.body.Price,Status:req.body.Status }, function (err, docs) {
                if (!err) {
                    console.log("Test2")
                    var data = {
                        Status: "Sucess",
                        Message: "Order Data Updated"
                    }
                   // generalLevelLogger("Order Data Updated" + " TimeStamp :" + getTimeStamp())
                    res.status(200).send(data);
                } else {
                    console.log("Test3")
                    var data = {
                        Status: "Fail",
                        Message: "Unexpected Error PLease Contact System Admin"
                    }
                    errorlevelLogger("Unexpected Error PLease Contact System Admin " + err + " TimeStamp :" + getTimeStamp())
                    res.status(200).send(data);
                }
            })
        } catch {
            var data = {
                Status: "Fail",
                Message: "Unexpected Error PLease Contact System Admin"
            }
           // errorlevelLogger("Unexpected Error PLease Contact System Admin " + err + " TimeStamp :" + getTimeStamp())
            res.status(200).send(data);

        }
    })

  

    router.post('/get-all-reserveration-by-user-id', function (req, res) {
       console.log(req.body)
       Order.find(function (err, data) {
            var filtered = _.where(data, { User_Name: req.body.User_Name });
            filtered = _.where(filtered, { Status: "Pending"});
            if (!err) {
                var data = {
                    Status: "Sucess",
                    Message: "Retrived All user Reservations",
                    data :filtered
                }
               // generalLevelLogger("Retrived All user Reservations" + " TimeStamp :" + getTimeStamp())
                res.status(200).send(data);
            } else {
                var data = {
                    Status: "Fail",
                    Message: "Unexpected Error PLease Contact System Admin"
                }
               // errorlevelLogger("Unexpected Error PLease Contact System Admin " + err + " TimeStamp :" + getTimeStamp())
                res.status(200).send(data);
            }
        })
    })



    router.get('/get-all-orders', function (req, res) {
       
        Order.find(function (err, data) {
           
            if (!err) {
                var data = {
                    Status: "Sucess",
                    Message: "Retrived All user order",
                    data :data
                }
               // generalLevelLogger("Retrived All user order" + " TimeStamp :" + getTimeStamp())
                res.status(200).send(data);
            } else {
                var data = {
                    Status: "Fail",
                    Message: "Unexpected Error PLease Contact System Admin"
                }
               // errorlevelLogger("Unexpected Error PLease Contact System Admin " + err + " TimeStamp :" + getTimeStamp())
                res.status(200).send(data);
            }
        })
    })

  
    return router;
}