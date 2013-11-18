describe('Bertram Labs ngCollection - Phase 2 - Paging (Local)', function () {
	
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

	it('Should keep extra items in an internal collection', function () {
		var collection = labsCollection.create({pageSize:5});
		expect(collection.all.toString()).toBe('[object collection]');
	});
	it('Should only keep the number of items specified by a valid (positive) page size in the array', function () {
		var collection = labsCollection.create({pageSize:5});
		expect(collection.length).toBe(0);
		collection.add({test:'test'});
		expect(collection.length).toBe(1);
		collection.addAll([{a:'a'},{f:'f'},{e:'e'},{d:'d'},{c:'c'},{b:'b'}]);
		expect(collection.length).toBe(5);
		collection.addAll({test:'test'});
		expect(collection.length).toBe(5);
	});
	it('Should know the total count of items it has in the total property', function () {
		var collection = labsCollection.create({pageSize:5});
		expect(collection.total).toBe(0);
		collection.add({test:'test'});
		expect(collection.total).toBe(1);
		collection.addAll([{a:'a'},{f:'f'},{e:'e'},{d:'d'},{c:'c'},{b:'b'}]);
		expect(collection.total).toBe(7);
		collection.addAll({test:'test'});
		expect(collection.total).toBe(8);

	});
	it('Should be able to load a new page from its "all" array', function () {
		var collection = labsCollection.create({pageSize:5});
		expect(collection.length).toBe(0);
		collection.add({test:'test'});
		expect(collection.length).toBe(1);
		collection.addAll([{a:'a'},{f:'f'},{e:'e'},{d:'d'},{c:'c'},{b:'b'}]);
		expect(collection.length).toBe(5);
		collection.addAll({test:'test'});
		collection.getPage(2);
		expect(collection.length).toBe(3);
	});
	it('Should sort the correct page of items in the array', function () {
		var collection = labsCollection.create({
			pageSize:5,
			comparator: function (item) {
				return item.value;
			}
		});
		expect(collection.length).toBe(0);
		collection.add({value:'test'});
		expect(collection[0].value).toBe('test');
		collection.addAll([{value:'a'},{value:'f'},{value:'e'},{value:'d'},{value:'c'},{value:'b'}]);
		expect(collection[0].value).toBe('a');
		collection.addAll({value:'test'});
		collection.getPage(2);
		expect(collection[0].value).toBe('f');
	});
	it('Should know how many pages of items there are', function () {
		var collection = labsCollection.create({pageSize:5});
		expect(collection.totalPages).toBe(1);
		collection.add({test:'test'});
		expect(collection.totalPages).toBe(1);
		collection.addAll([{a:'a'},{f:'f'},{e:'e'},{d:'d'},{c:'c'},{b:'b'}]);
		expect(collection.totalPages).toBe(2);
	});
	it('Should update the number of items displayed when the page size is changed.', function () {
		var collection = labsCollection.create({pageSize:5});
		expect(collection.totalPages).toBe(1);
		collection.add({test:'test'});
		expect(collection.totalPages).toBe(1);
		collection.addAll([{a:'a'},{f:'f'},{e:'e'},{d:'d'},{c:'c'},{b:'b'}]);
		expect(collection.totalPages).toBe(2);
		collection.setPageSize(2);
		expect(collection.totalPages).toBe(4);
		expect(collection.length).toBe(2);
	});
});