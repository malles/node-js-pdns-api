// The MIT License (MIT)
//
// Copyright (c) 2014 Rik Bruggink
//
// Permission is hereby granted, free of charge, to any person obtaining a copy
// of this software and associated documentation files (the "Software"), to deal
// in the Software without restriction, including without limitation the rights
// to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
// copies of the Software, and to permit persons to whom the Software is
// furnished to do so, subject to the following conditions:
//
// The above copyright notice and this permission notice shall be included in all
// copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
// FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
// AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
// LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
// OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
// SOFTWARE.

var getConnection = require('../controllers/mysql');
var uuid = require('node-uuid');

exports.getbyid = function(req, res){
    getConnection(function(err, connection) {
       connection.query('SELECT `name`,`type`,`content`,`ttl`,`prio`,`id` FROM records where domain_id = ? ',req.params.id,function(err,rows)     {
         if(err){
                res.status(400).json("Status: Error");
                console.log(err);
                return;
        }
        if(rows.length < 1)
                return res.json("No records found for this id");
        res.json(rows)
    
	connection.release();
         });
    });
};

exports.insert = function(req, res){

	req.assert('name','Name is required').notEmpty();
    req.assert('type','Type is required').notEmpty();
    req.assert('content','Content is required').notEmpty();
	req.assert('ttl','TTL is required').notEmpty().isInt();
	req.assert('prio','Prio is required').optional().notEmpty();

        var errors = req.validationErrors();
    if(errors){
        res.status(422).json(errors);
        return;
    }

        getConnection(function(err, connection) {
	
	var data = {
        name:req.body.name,
        type:req.body.type,
        content:req.body.content,
		prio:req.body.prio,
		ttl:req.body.ttl,
		domain_id:req.params.id,
		change_date: new Date() / 1000,
        id:uuid.v4()
        };

	connection.query('INSERT INTO records SET ? ', data, function(err,rows) {

        if(err){
                res.status(400).json("Status: Error");
                console.log(err);
                return;
                }
        res.status(200).json("Status: Succes");
		connection.release();
         });
    }); 
};

exports.savebyid = function(req, res){
	
	req.assert('name','Name is required').optional().notEmpty();
    req.assert('type','Type is required').optional().notEmpty();
    req.assert('content','Content is required').optional().notEmpty();
    req.assert('ttl','TTL is required').optional().notEmpty();
    req.assert('prio','Prio is required').optional().notEmpty();

    var errors = req.validationErrors();
    if(errors){
        res.status(422).json(errors);
        return;
    }

        getConnection(function(err, connection) {

        var data = {
        name:req.body.name,
        type:req.body.type,
        content:req.body.content,
        prio:req.body.prio,
        ttl:req.body.ttl,
        change_date: new Date() / 1000,
        };

	connection.query('UPDATE records SET ? where id = ?' ,[data, req.params.id], function(err,rows) {
        if(err){
                res.status(400).json("Status: Error");
                console.log(err);
                return;
                }

        res.status(200).json("Status: Succes");

   	connection.release();
         });
    });
};

exports.deletebyid = function(req, res){
    getConnection(function(err, connection) {
        connection.query('DELETE FROM records where id = ?',req.params.id ,function(err,rows) {
          if(err){
                res.status(400).json("Status: Error");
                console.log(err);
                return;
                }
        res.status(200).json("Status: Succes");
        connection.release();
         });
    });
};

