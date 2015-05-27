var server = require("../server/server");
var request = require("request");
var assert = require("chai").assert;

var testPort = 52684;
var baseUrl = "http://localhost:" + testPort;
var todoListUrl = baseUrl + "/api/todo";

describe("server", function() {
    var serverInstance;
    beforeEach(function() {
        serverInstance = server(testPort);
    });
    afterEach(function() {
        serverInstance.close();
    });
    describe("get list of todos", function() {
        it("responds with status code 200", function(done) {
            request(todoListUrl, function(error, response, body) {
                assert.equal(response.statusCode, 200);
                done();
            });
        });
        it("responds with a body encoded as JSON in UTF-8", function(done) {
            request(todoListUrl, function(error, response, body) {
                assert.equal(response.headers["content-type"], "application/json; charset=utf-8");
                done();
            });
        });
        it("responds with a body that is a JSON empty array", function(done) {
            request(todoListUrl, function(error, response, body) {
                assert.equal(body, "[]");
                done();
            });
        });
    });
    describe("put a new todo", function() {
        it("responds with status code 200", function(done) {
            request.put({
                url: todoListUrl,
                json: {
                    title: "This is a TODO item",
                    done: false
                }
            }, function(error, response, body) {
                assert.equal(response.statusCode, 200);
                done();
            });
        });
        it("inserts the todo at the end of the list of todos", function(done) {
            request.put({
                url: todoListUrl,
                json: {
                    title: "This is a TODO item",
                    done: false
                }
            }, function() {
                request.get(todoListUrl, function(error, response, body) {
                    assert.deepEqual(JSON.parse(body), [{
                        title: "This is a TODO item",
                        done: false,
                        id: "0"
                    }]);
                    done();
                });
            });
        });
    });
});