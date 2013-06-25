/****************************************************************************
 * The purpose of this file is to test the account functions against a 
 * CreateSend account.  Many of the tests are just to ensure we
 * got something valid back from the server
 ***************************************************************************/
var createsend  = require('../');
var fs          = require('fs');
var chai        = require('chai');
var sleep       = require('sleep');

var should      = chai.should();
var apiDetails;
var api;
var isIntegrationTest = process.env.NODE_ENV == 'integration';

if (isIntegrationTest) {  
    apiDetails = JSON.parse(fs.readFileSync('./integration/credentials.json'));
    api = new createsend(apiDetails);
} else {
    apiDetails = { 
        apiKey: "981298u298ue98u219e8u2e98u2", 
        siteurl: "", 
        username: "", 
        password: "" 
    };
    api = new createsend(apiDetails, {
        secure: false,
        baseUri: 'localhost:3000'
    })
}

describe('Lists', function () {
    var testClient;
    var testList;
    var customFieldKey;

    before(function (done) {
        api.clients.addClient({
            'CompanyName': 'Client One',
            'Country': 'Australia',
            'TimeZone': '(GMT+10:00) Canberra, Melbourne, Sydney'
        }, function (err, client) {
            should.not.exist(err);
            should.exist(client);
            should.exist(client.getDetails);
            testClient = client;

            testClient.createList({
                'Title': 'New Test List'
            }, function (err, list) {
                should.not.exist(err);
                should.exist(list);
                should.exist(list.getDetails);
                testList = list;
                done();
            })
        });
    });

    after(function (done) {
        testClient.delete(function (err) {
            should.not.exist(err);
            done();
        });
    });

    it('should create a custom field', function (done) {
        api.lists.createCustomField(testList.listId, {
            'FieldName': 'New Custom Field',
            'DataType': 'MultiSelectOne',
            'Options': [ 'HTML', 'Text' ],
            'VisibleInPreferenceCenter': true
        }, function (err, result) {
            should.not.exist(err);
            should.exist(result);
            customFieldKey = result;
            done();
        });
    });

    it('should update existing options', function (done) {
        api.lists.updateCustomFieldOptions(testList.listId, customFieldKey, {
            'KeepExistingOptions': true,
            'Options': [ 'Image' ]
        }, function (err) {
            should.not.exist(err);
            done();
        });
    });

    it('should update a custom field', function (done) {
        api.lists.updateCustomField(testList.listId, customFieldKey, {
            'FieldName': 'New Custom Field Renamed',
            'VisibleInPreferenceCenter': false
        }, function (err, result) {
            should.not.exist(err);
            should.exist(result);
            customFieldKey = result;
            done();
        });
    });

    it('should get the custom fields', function (done) {
        api.lists.getCustomFields(testList.listId, function (err, fields) {
            should.not.exist(err);
            should.exist(fields);
            should.exist(fields.length);
            done();
        });
    });

    it('should delete the custom field', function (done) {
        api.lists.deleteCustomField(testList.listId, customFieldKey, function (err) {
            should.not.exist(err);
            done();
        });
    });

    it('should update the list', function (done) {
        api.lists.updateList(testList.listId, {
            'Title': 'New Test List Renamed'
        }, function (err) {
            should.not.exist(err);
            done();
        })
    });

    it('should delete the list', function (done) {
        api.lists.deleteList(testList.listId, function (err) {
            should.not.exist(err);
            done();
        });
    });
})