/*jshint -W098 */
'use strict';

var request = require('supertest'),
    app = require('../../../../server'),
    agent = request.agent(app),
    mongoose = require('mongoose'),
    should = require('should'),
    App = mongoose.model('App');

describe('API Test', function () {


    describe('GET /api/apps', function () {
        it('should return an empty list', function (done) {
            agent.get('/api/apps').expect(200, done);
        });
    });

    describe('POST /api/apps', function () {
        beforeEach(function(done){
            App.remove(done);
        });
        it('should return the newly created App', function (done) {
            var data = {
                'title': 'TestApp1',
                'url': 'http://www.google.ch'
            };

            agent.post('/api/apps').send(data).end(function (err, res) {
                should.not.exist(err);
                res.should.have.status(201);
                res.body.title.should.eql(data.title);
                res.body.url.should.eql(data.url);
                done();
            });

        });

        it('should return error 422 Unprocessable Entity if title or url empty', function (done) {
            var data = {
                'title': '',
                'url': 'http://www.google.ch'
            };

            agent.post('/api/apps').send(data).end(function (err, res) {
                should.not.exist(err);
                res.should.have.status(422);

                data = {
                    'title': 'MyApp',
                    'url': ''
                };
                agent.post('/api/apps').send(data).end(function (err, res) {
                    should.not.exist(err);
                    res.should.have.status(422);
                    done();
                });
            });
        });
    });
});