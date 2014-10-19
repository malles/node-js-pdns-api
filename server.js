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

var express = require('express');
var bodyParser = require('body-parser');
var expressValidator = require('express-validator')
var domains = require('./controllers/domains');
var records = require('./controllers/records');

var app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(expressValidator());

var port = process.env.PORT || 3000;
var router = express.Router();

router.get('/', function(req, res) {
	res.json({ message: 'Please see the documentation for support routes' });
	});

router.route ('/domains')
	.get(domains.list)
	.post(domains.insert);

router.route ('/domains/:id')
        .get(domains.singlebyid)
        .put(domains.savebyid)
        .delete(domains.deletebyid);

router.route ('/records/:id')
	.get (records.getbyid)
	.put (records.savebyid)
	.delete(records.deletebyid)
	.post(records.insert);


app.use('/api', router);
app.listen(port);
console.log('Server started on port ' + port);
