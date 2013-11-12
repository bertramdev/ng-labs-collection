ng-labs-collection
==================

Angular collection that works with ng-repeat and other cool features

##Usage

* include module 'labsCollection'
* inject '$labsCollection'
* in your controller/factory/etc:  $scope.awesomeThings = new $labsCollection();
* in your view using with ng-repeat="thing in awesomeThings"

##TODO:

* [ ] Remotely load data
* [ ] Autoload remote data
* [ ] Page remote data
* [ ] Page local data
* [ ] Use IndexedDb when available