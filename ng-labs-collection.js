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

angular.module('labsCollection', []).
	factory('$labsCollection', ['$http', '$parse', function ($http, $parse) {
		function LabsCollection (options) {
			
			var serializedAttrs = {
				currentPage: 0,
				pageCount: 0,
				loaded: 0,
				filter: {},
				sort: {}
			}
			var queryUrl;

			this.options = options || {};

			if (this.options.queryUrl !== void 0) queryUrl = this.options.queryUrl;
			if (this.options.comparator !== void 0) this.comparator = this.options.comparator;

			this.idAttr = 'id';
			this.pageSize = 10;

			this.add = function (object, options) {
				options || (options = {});
				var sort = this.comparator && options.sort !== false;
				
				this.push(object);
				
				if (sort) this.ngSort();

				return this
			}

			this.addAll = function (arr) {

				if (angular.isArray(arr)){
					angular.forEach(arr, function(item){
						this.add(item, {sort:false});
					}, this);
				}
				else {
					this.add(item);
				}

				this.ngSort('+title',true);
				
				return this;
			}
			this.remove = function (obj) {
				this.array.splice(this.array.indexOf(obj), 1);
				return this;
			}

			this.last = function() {
				return this[this.length-1];
			}

			this.at = function(index) {
				return this[index];
			}

			// Credit goes out to the angularjs team here.
			// Had to copy it since the orderBy filter copies the array instead of sorting the original
			this.ngSort = function(sortPredicate, reverseOrder) {
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
				
				this.sort(reverseComparator(comparator, reverseOrder));

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

				return this;
			}

			this.find = function(strKey, value) {
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
			}

			this.findAll = function(strKey, value) {
				var results = [];
			
				if(typeof strKey !== 'string'){
					throw new Error("The key must be a string!");
					return;
				}
				
				var findFn = $parse(strKey);
				
				//loop over all the items in the array
				for (var i = 0; i < this.array.length; i++){
					if (findFn(this.array[i]) === value){
						results.push(this.array[i]);
					}
				}
				
				//if nothing matches return void
				return results;
			}
			this.getPageCount = function () {
				return pageCount;
			}
			this.fetch = function (options) {
				if (queryUrl){
					$http.get(queryUrl,{params:this.serialize(options)});
				}
			}
			this.serialize = function (options) {
				if (angular.isObject(options)){
					return angular.extend(serializedAttrs, options);
				}
			}
		}

		LabsCollection.prototype = Object.create( Array.prototype );

		return LabsCollection;
	}]);
})(window, window.angular);