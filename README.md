ng-labs-collection [![Build Status](https://travis-ci.org/bertramdev/ng-labs-collection.png?branch=master)](https://travis-ci.org/bertramdev/ng-labs-collection)
==================

Angular collection that works with ng-repeat and other cool features

## Usage

* include module 'labsCollection'
* inject '$labsCollection'


#### example
```
angular.module('myApp',['labsCollection'])
	.controller('myController', ['$labsCollection', function ('$labsCollection') {

}]);
``` 


## Options

* __idAttr__: the id attribute of the objects you are adding (*defaults to id*)
* __url__: the url to use to load remote data
* __httpConfig__: the standard $http config object to be used to load remote data
* __ngResource__: the non instanciated version of your resource
  * the collection will use the query function for paging
* __autoLoad__: will load the first page if loading remote data (*defaults to false*)
* __arrayProp__: used to find the array of items in a response object (*defaults to data*)
* __totalProp__: used to find the property of a response object that contains the total count of items (*defaults to total*)
* __pageAttr__: the attribute name to use when making a call to get more data (*defaults to page*)
* __pageSizeAttr__: the attribute name to use when making a call to get more data (*defaults to pageSize*)
* __keepAll__: keeps all items in another collection when loading items remotely (*defaults to false*)
* __pageSize__: the number of items per page (*defaults to 10*)
   * use 'ALL' to no use any page attributes

## Examples

#### Basic usage:

```
	var myCollection = $labsCollection.create()
```

#### Simple Remote loading:

```
	var myCollection = $labsCollection.create({
    	url: '/query',
        autoLoad: true //optional
    })
```

#### Complex Remote loading:

```
	var myCollection = $labsCollection.create({
    	httpConfig: {
			url:'/query',
			method:'GET',
			transformResponse: function (data) {
				return data;
			},
			transformRequest: function (data) {

			},
			responseType:'json'
		},
        autoLoad: true //optional
    })
```

#### ngResource:

```
	var resouce = new $resource('/some/url');
	var myCollection = $labsCollection.create({
    	ngResource: resource,
        autoLoad: true //optional
    })
```
