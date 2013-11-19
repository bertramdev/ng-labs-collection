describe('Bertram Labs ngCollection - Phase 3 - Remote data', function () {
	var labsCollection, httpBackend;

	// load the controller's module
	beforeEach(function () {
		angular.module('labsCollection');
	});

	// Initialize the controller and a mock scope
	beforeEach(function () {
		angular.injector(['ng', 'ngMock', 'labsCollection']).invoke(function ($labsCollection, $httpBackend){
			httpBackend = $httpBackend;
			labsCollection = $labsCollection;
		});
	});
	it('Should have a mode of remote if the option url or httpConfig is set', function () {
		httpBackend.expectGET(/\/query.*/).respond([{value:'a'},{value:'e'},{value:'b'},{value:'c'},{value:'d'}]);
		var collection = labsCollection.create({url:'/query'});
		expect(collection.mode).toBe('remote');
	});
	it ('Should fetch data with method: GET by default', function () {
		httpBackend.expectGET(/\/query.*/).respond([{value:'a'},{value:'e'},{value:'b'},{value:'c'},{value:'d'}]);
		var collection = labsCollection.create({url:'/query'});
		collection.fetch({});
		httpBackend.flush();
		expect(collection.length).toBe(5);
	});
	it ('Should fetch the first page if autoLoad is true in options', function () {
		httpBackend.expectGET(/\/query.*/).respond([{value:'a'},{value:'e'},{value:'b'},{value:'c'},{value:'d'}]);
		var collection = labsCollection.create({url:'/query', autoLoad:true});
		httpBackend.flush();
		expect(collection.length).toBe(5);
	});
	it ('Should apply a $http config if given in option httpConfig', function () {
		httpBackend.expectGET(/\/query.*/).respond([{value:'a'},{value:'e'},{value:'b'},{value:'c'},{value:'d'}]);
		var httpConfig = {
			url:'/query',
			method:'GET',
			transformResponse: function (data) {
				return data;
			},
			transformRequest: function (data) {

			},
			responseType:'json'
		};
		spyOn(httpConfig, 'transformResponse').andCallThrough();
		var collection = labsCollection.create({httpConfig:httpConfig, autoLoad:true});
		httpBackend.flush();
		expect(collection.length).toBe(5);
		expect(httpConfig.transformResponse).toHaveBeenCalled();
	});
	it ('Should get always get pages from server', function () {
		httpBackend.whenGET('/query?page=1&pageSize=2').respond([{value:'a'},{value:'b'}]);
		httpBackend.whenGET('/query?page=2&pageSize=2').respond([{value:'c'},{value:'d'}]);
		var collection = labsCollection.create({url:'/query', pageSize:2});
		collection.getPage(1);
		httpBackend.flush();
		expect(collection.length).toBe(2);
		expect(collection[0].value).toBe('a');
		collection.getPage(2);
		httpBackend.flush();
		expect(collection.length).toBe(2);
		expect(collection[0].value).toBe('c');
	});
	it('Should be able to be configured to add pages instead of switching out pages', function () {
		httpBackend.whenGET('/query?page=1&pageSize=2').respond([{value:'a'},{value:'b'}]);
		httpBackend.whenGET('/query?page=2&pageSize=2').respond([{value:'c'},{value:'d'}]);
		var collection = labsCollection.create({
			url:'/query',
			pageSize:2,
			keepAll:true
		});
		collection.getPage(1);
		httpBackend.flush();
		expect(collection.length).toBe(2);
		expect(collection[0].value).toBe('a');
		collection.getPage(2);
		httpBackend.flush();
		expect(collection.length).toBe(4);
		expect(collection[0].value).toBe('a');
	});
	it ('Should sort through the server', function () {

	});
});
