var express = require("express");
var router = express.Router();

var _ = require("underscore");
var Promise = require("bluebird");
var log = require("../logger");

var Tinder = require("../Tinder").Tinder;
var Job = require("../Tinder").Job;

var Person = require("../models/Person");


router.get("/person/list",function(req,res){
    log.debug("[%s %s] - %j",req.method,req.url,req.body,{});
    Person.findAll({})
        .then(function(people){
            res.send(people);
        })
        .catch(function(err){
            log.error("[%s %s] - %s",req.method,req.url,err.message,{});
            res.status(500).send(err);
        });
});

router.get("/person/:_id",function(req,res){
    log.debug("[%s %s] - %j",req.method,req.url,req.body,{});
    Person.findOne({where:{_id:req.params._id}})
        .then(function(person){
            if (person) {
                res.send(person);
            } else {
                throw new Person.PersonNotFoundError(req.params._id);
            }
        })
        .catch(Person.PersonNotFoundError,function(err){
            log.error("[%s %s] - (%s) %s",req.method,req.url,err.name,err.message,{});
            res.status(404).send(err);
        })
        .catch(function(err){
            log.error("[%s %s] - %s",req.method,req.url,err.message,{});
            res.status(500).send(err);
        });
});

module.exports = router;
