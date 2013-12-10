describe('Bertram Labs ngCollection - Phase 4 - using ngResource', function () {
	var labsCollection, httpBackend, resource, resource2;

	// load the controller's module
	beforeEach(function () {
		angular.module('labsCollection');
		angular.module('ngResource');
	});

	// Initialize the controller and a mock scope
	beforeEach(function () {
		angular.injector(['ng', 'ngMock', 'labsCollection', 'ngResource']).invoke(function ($labsCollection, $httpBackend, $resource){
			httpBackend = $httpBackend;
			labsCollection = $labsCollection;
			resource = $resource('/test/:id', {id:'@id'});
			resource2 = $resource('/test/:id', {id:'@id'},
			{
				query: {
					method:'GET',
					url:'/test/',
					isArray: false
				}
			});
		});
	});
	it('Should accept a $resource as a parameter and add all plain objects as a new $resource', function () {
		httpBackend.expectGET('/test?page=1&pageSize=10').respond([{value:'a'},{value:'e'},{value:'b'},{value:'c'},{value:'d'}]);
		var collection = labsCollection.create({ngResource:resource, autoLoad:true});
		httpBackend.flush();
		expect(collection.length).toBe(5);
	});
	it('Should accept an arrayProp and a totalProp for queries returning objects', function() {
		httpBackend.expectGET('/test?page=1&pageSize=10').respond({data:[{value:'a'},{value:'e'},{value:'b'},{value:'c'},{value:'d'}],total:100});
		var collection = labsCollection.create({ngResource:resource2, autoLoad:true, arrayProp:'data', totalProp: 'total'});
		httpBackend.flush();
		expect(collection.totalPages).toBe(10);
		expect(collection.length).toBe(5);
	});
});