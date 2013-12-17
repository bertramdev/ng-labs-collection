/*
 * labsCollection - A collection module for AngularJS from the Bertram Labs Team
 * @version v.0.0 11/11/2013
 * @author Andy Warner
 * @license MIT License, http://www.opensource.org/licenses/MIT
 */

(function(window, angular) {
'use strict';


//taken from angularjs code to make the sort work the same as in angular
function map(obj, iterator, context) {
	var results = [];
	angular.forEach(obj, function(value, index, list) {
		results.push(iterator.call(context, value, index, list));
	});
	return results;
}
function toBoolean(value) {
	if (value && value.length !== 0) {
		var v = angular.lowercase("" + value);
		value = !(v == 'f' || v == '0' || v == 'false' || v == 'no' || v == 'n' || v == '[]');
	} else {
		value = false;
	}
	return value;
}

function makeId () {
	return Math.round(Math.random() * 100000) + '-' + Math.round(Math.random() * 100000) + '-' + Math.round(Math.random() * 100000) + '-' + Math.round(Math.random() * 100000) + '-' + Math.round(Math.random() * 100000);
}

angular.module('labsCollection', []).
	factory('$labsCollection', ['$http', '$parse', function ($http, $parse) {
		return {
			create: function (options) {

				var labsCollection = new Array();
		
				angular.extend(labsCollection, {
					currentPage: 1,
					pageCount: 1,
					totalPages: 1,
					pageSize: 10,
					idAttr: 'id',
					mode: 'local',
					add: function (obj, options) {
						options || (options = {});
						var sort = this.comparator && options.sort !== false && this.mode === 'local';
						if (this.all) {
							//add all the items to the complete collection
							this.all.add(obj);
							this.setTotals();
							this.getPage(this.currentPage);
							return this;
						}
						else {
							if (typeof obj !== 'object'){
								this.push(obj);
							}
							else {
								if (!obj[this.idAttr]) {
									obj[this.idAttr] = makeId();
								}

								if (!this.find(this.idAttr, obj[this.idAttr])) {
									this.push(obj);
								}
								else {
									this.update(obj);
								}
							}
						}
						
						
						if (sort) this.ngSort();

						return this;
					},
					addAll: function (arr) {
						//if there is an all Array then this is a paged collection
						if (this.all) {
							//add all the items to the complete collection
							this.all.addAll(arr);
							this.setTotals();
							
							this.getPage(this.currentPage);
							return this;
						}
						
						if (angular.isArray(arr)) {
							angular.forEach(arr, function(item) {
								this.add(item, {sort:false});
							}, this);
						}
						else {
							this.add(arr);
						}
						

						if (this.comparator && this.mode === 'local') {
							this.ngSort();
						}
						
						return this;
					},
					update: function (obj) {
						var item = this.find(this.idAttr, obj[this.idAttr]);
						angular.copy(item,obj);
					},
					remove: function (obj) {
						this.splice(this.indexOf(obj), 1);
						return this;
					},
					clear: function () {
						this.splice(0,this.length);
						return this;
					},
					getPage: function (pageNumber) {
						var pageStart = (pageNumber - 1) * this.pageSize;
						var items;
						if (this.all) {
							items = this.all.getRange(pageStart, this.pageSize);
							//clear out all items in the current collection
							this.clear();

							angular.forEach(items,function (item){
								this.push(item);
							}, this);
						}
						else if (this.mode === 'remote') {
							this.fetch({page:pageNumber});
						} 
					},
					last: function() {
						return this[this.length-1];
					},
					// Credit goes out to the angularjs team here.
					// Had to copy it since the orderBy filter copies the array instead of sorting the original
					ngSort: function () {
						var sortPredicate = this.comparator;
						var reverse = this.reverseSort;
						if (!sortPredicate) return this;
						
						sortPredicate = angular.isArray(sortPredicate) ? sortPredicate: [sortPredicate];

						sortPredicate = map(sortPredicate, function(predicate){
							var descending = false, get = predicate || identity;
							if (angular.isString(predicate)) {
								if ((predicate.charAt(0) == '+' || predicate.charAt(0) == '-')) {
									descending = predicate.charAt(0) == '-';
									predicate = predicate.substring(1);
								}
								get = $parse(predicate);
							}
							return reverseComparator(function(a,b){
								return compare(get(a),get(b));
							}, descending);
						});
						

						function comparator(o1, o2){
							for ( var i = 0; i < sortPredicate.length; i++) {
								var comp = sortPredicate[i](o1, o2);
								if (comp !== 0) return comp;
							}
							return 0;
						}
						
						function reverseComparator(comp, descending) {
							return toBoolean(descending)
								? function(a,b){return comp(b,a);}
								: comp;
						}
						
						function compare(v1, v2){
							var t1 = typeof v1;
							var t2 = typeof v2;
							if (t1 == t2) {
								if (t1 == "string") {
									v1 = v1.toLowerCase();
									v2 = v2.toLowerCase();
								}
								if (v1 === v2) return 0;
									return v1 < v2 ? -1 : 1;
							} else {
								return t1 < t2 ? -1 : 1;
							}
						}
						if (this.mode == 'local') {
							this.sort(reverseComparator(comparator, reverse));
						}
						else {
							this.fetch();
						}
						return this;
					},
					getRange: function (start, count) {
						var i = start;
						var end = start + count;
						var item;
						var toReturn = [];
						if(this.length < end) {
							end = this.length;
						}
						for (i; i < end; i++) {
							toReturn.push(this[i]);
						}
						return toReturn;
					},
					setTotals: function (totalOverride) {
						this.total = totalOverride || this.all.length;
						this.totalPages = Math.ceil(this.total / this.pageSize);
					},
					find: function(strKey, value) {
						if(typeof strKey !== 'string'){
							throw new Error("The key must be a string!");
							return;
						}
						var findFn = $parse(strKey);
						
						//loop over all the items in the array
						for (var i = 0; i < this.length; i++){
							if (findFn(this[i]) === value){
								return this[i];
							}
						}
						
						//if nothing matches return void
						return void 0;
					},

					findAll: function(strKey, value) {
						var results = [];
					
						if(typeof strKey !== 'string'){
							throw new Error("The key must be a string!");
							return;
						}
						
						var findFn = $parse(strKey);
						
						//loop over all the items in the array
						for (var i = 0; i < this.length; i++){
							if (findFn(this[i]) === value){
								results.push(this[i]);
							}
						}
						
						//if nothing matches return void
						return results;
					},
					getPageCount: function () {
						return pageCount;
					},
					setPageSize: function (pageSize) {
						this.pageSize = pageSize;
						this.setTotals();
						this.getPage(this.currentPage);
						return this;
					},
					setComparator: function (comparator) {
						this.comparator = comparator;
						return this;
					},
					fetch: function (options) {
						var thisCollection = this;
						var arrayGetter = $parse(this.arrayProp || 'data');
						var totalGetter = $parse(this.totalProp || 'total');
						if (this.resource) {
							this.resource.query(this.serialize(options || {})).$promise.then(
								function (response) {
									if (!labsCollection.keepAll) {
										labsCollection.clear();
									}
									if (angular.isArray(response)){
										thisCollection.addAll(response);
									}
									else {
										thisCollection.addAll(arrayGetter(response));
										thisCollection.setTotals(totalGetter(response));
									}
								});
						}
						else {
							if (!this.httpConfig) {
								this.httpConfig = {
									url:this.url,
									method:'GET'
								}
							}
							//set options to the correct place
							if (this.httpConfig.method === 'GET') {
								this.httpConfig.params = this.serialize(options || {});
							}
							else {
								this.httpConfig.data = this.serialize(options || {});
							}
							$http(this.httpConfig).success(this.successResponse).error(this.errorResponse);
						}

						return this;
					},
					serialize: function (options) {
						var pageObj = {}
						if (typeof(this.pageSize) === 'string' && this.pageSize === 'ALL') {
							delete options.page;
						}
						else {
							pageObj[this.pageAttr] = options.page;
							pageObj[this.pageSizeAttr] = this.pageSize;
						}
						var serialized = angular.extend(pageObj, options);
						if (angular.isObject(this.comparator) && !angular.isFunction(this.comparator)) {
							serialized.sort = this.comparator;
						}
						return serialized;
					},
					toString: function() {
						return '[object collection]';
					}
				}, options || {});

				if (options && (options.url || options.httpConfig || options.ngResource)) {
					if (options.ngResource) {
						labsCollection.resource = options.ngResource;
					}
					labsCollection.mode = 'remote';
					labsCollection.pageAttr = options.pageAttr || 'page';
					labsCollection.pageSizeAttr = options.pageSizeAttr || 'pageSize';
					labsCollection.successResponse = function (data, status) {
						if (!labsCollection.keepAll) {
							labsCollection.clear();
						}
						if (angular.isArray(data)) {
							labsCollection.addAll(data);
						}
						else if (angular.isObject(data)){
							labsCollection.addAll(data.results);
							labsCollection.setTotals(data.total);
						}
					}
					labsCollection.errorResponse = function (data, status) {
						console.console.error('collection fetch error', data, status);
					}
					if (options.autoLoad) {
						labsCollection.fetch({page:1});
					}
				}
				if (options && options.pageSize && options.pageSize > 0 && labsCollection.mode !== 'remote') {
					labsCollection.all = this.create({comparator: options.comparator});
					labsCollection.total = 0;
				}

				return labsCollection;
			}
		}
	}]);
})(window, window.angular);