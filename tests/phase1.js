'use strict';

describe('Bertram Labs ngCollection - Phase 1 - Base features', function () {
	
	var labsCollection;

	// load the controller's module
	beforeEach(function () {
		angular.module('labsCollection');
	});

	// Initialize the controller and a mock scope
	beforeEach(function () {
		angular.injector(['ng', 'labsCollection']).invoke(function ($labsCollection){
			labsCollection = $labsCollection;
		});
	});

	it('Angular should think the collection is an array', function () {
		expect(angular.isArray(labsCollection.create())).toBeTruthy();
	});
	it('Should be a collection', function () {
		var collection = labsCollection.create();
		expect(collection.toString()).toBe('[object collection]');
	});
	it('Should be able to add items', function() {
		var collection = labsCollection.create();
		expect(collection.length).toBe(0);
		collection.add({test:'test'});
		expect(collection.length).toBe(1);
		collection.addAll([{a:'a'},{f:'f'},{e:'e'},{d:'d'},{c:'c'},{b:'b'}]);
		expect(collection.length).toBe(7);
		collection.addAll({test:'test'});
		expect(collection.length).toBe(8);
	});
	it('Should be able to remove an item',function() {
		var collection = labsCollection.create();
		expect(collection.length).toBe(0);
		var item = {test:'test'};
		collection.add(item);
		collection.add({test2:'test2'});
		expect(collection.length).toBe(2);
		collection.remove(item);
		expect(collection.length).toBe(1);
	});
	it('Should not sort by default', function () {
		var collection = labsCollection.create();
		collection.addAll(['d','e','b','a','c']);
		expect(collection[0]).toBe('d');
	});
	it('Should sort when given a comparator', function() {
		var collection = labsCollection.create({
			comparator: function (a) {
				return a;
			}
		});
		collection.addAll(['d','e','b','a','c']);
		expect(collection[0]).toBe('a');
	});
	it('Should be able to find an item', function() {
		var collection = labsCollection.create();
		expect(collection.length).toBe(0);
		collection.add({test:'test'});
		expect(collection.length).toBe(1);
		var found = collection.find('test','test');
		expect(found.test).toBe('test');
	});
	it('Should be able to find all item of a given criteria', function() {
		var collection = labsCollection.create();
		expect(collection.length).toBe(0);
		collection.addAll({test:'test'});
		expect(collection.length).toBe(1);
		collection.addAll([{a:'a',find:'found'},{f:'f',find:'found'},{e:'e'},{d:'d'},{c:'c',find:'found'},{b:'b'}]);
		var found = collection.findAll('find','found');
		expect(angular.isArray(found)).toBeTruthy();
		expect(found.length).toBe(3);
	});
});
