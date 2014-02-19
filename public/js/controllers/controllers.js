'use strict';

/* Controllers */

console.log('defining myApp.controllers');

angular.module('myApp.controllers', [])
  
  .controller('HeaderCtrl', ['$scope', '$location', function ($scope, $location) {
    $scope.foo = $location.hash();

    $scope.isActive = function (aPath) {
      return aPath === $location.path();
    };

    $scope.pages = [
      {
        text: 'Home',
        path: '/home'
      },
      {
        text: 'Categories',
        path: '/categories'
      }
    ];
  }])

  // ================================================
  // Notes

  .controller('HomeCtrl', 
    ['$scope', '$http', 'jgLocalStorage', 'API_PATH',
    function ($scope, $http, jgLocalStorage, API_PATH) {

    // TODO Notes should be provided by a factory.
    var notesPath = API_PATH + 'notes';

    $scope.noteText = '';
    $scope.currentCategory = '';
    $scope.notes = jgLocalStorage.get('notes');
    $scope.categories = jgLocalStorage.get('categories');

    $scope.newNote = function () {
      var note = {
        dateStart: Date.now(),
        dateEnd: null,
        text: $scope.noteText || 'not sure',
        category: $scope.currentCategory
      };
      postNote(note);
      $scope.noteText = '';

      // pretend we have an endpoint
      $http.post(notesPath, note)
        .success(function (data, status, headers, config) {
          // note.id = data;
          // add new note to collection
          console.log(data);
        })
        .error(function (data, status, headers, config) {
          console.error(data);
        });
    };

    $scope.copyNote = function (note) {
      var newNote = angular.copy(note);
      newNote.dateStart = Date.now();
      newNote.dateEnd = null;
      postNote(newNote);

      $http.post(notesPath, newNote)
        .success(function (data) {
          newNote.id = data;
          // add new note to local collection
        })
        .error(function (resp, status) {
          console.error(status, resp);
        });
    };

    $scope.copyNoteByCategory = function (note) {
      var newNote = angular.copy(note);
      newNote.dateStart = Date.now();
      newNote.dateEnd = null;
      newNote.text = 'not sure';

      postNote(newNote);

      $http.post(notesPath, newNote)
        .success(function (resp) {
          newNote.id = resp;
          // add to collection
        })
        .error(function (resp, status) {
          console.error(status, resp);
        });
    };

    $scope.stop = function (note) {
      var notes = jgLocalStorage.get('notes'),
        index = getNoteIndex(note, notes);

      if (index !== -1) {
        notes[index].dateEnd = Date.now();
        saveNotes(notes);
      }

      $http.put(notesPath + '/' + note.id, { dateEnd: Date.now() })
        .success(function (resp) {
          // merge any changes with local version
        })
        .error(function (resp, status) {
          console.error(status, resp);
        });
    };

    $scope.deleteNote = function (note) {
      var notes = jgLocalStorage.get('notes'),
        index = getNoteIndex(note, notes);
      if (index !== -1) {
        notes.splice(index, 1);
        saveNotes(notes);
      }

      $http.delete(notesPath + '/' + note.id)
        .success(function (resp) {
          // delete local copy
        })
        .error(function (resp, status) {
          console.error(status, resp);
        });
    };

    $scope.setCategory = function (category, note) {
      var notes = jgLocalStorage.get('notes'),
        index = getNoteIndex(note, notes);

      notes[index].category = category;
      saveNotes(notes);

      $http.put(notesPath + '/' + note.id, {
        category: category
      })
      .success(function (resp) {
        // update local version
      })
      .error(function (resp, status) {
        console.error(status, resp);
      });
    };

    $scope.setNoteText = function (note, text) {
      var notes = jgLocalStorage.get('notes'),
        index = getNoteIndex(note, notes);

      notes[index].text = text;
      saveNotes(notes);


      // prep for service ================================================
      $http.put(notesPath + '/' + note.id, {
        text: text
      })
      .success(function (resp) {
        // update local version
      })
      .error(function (resp, status) {
        console.error(status, resp);
      });
    };

    $scope.revertChanges = function (note) {
      console.log('revertChanges', note);
    };

    function postNote (note) {
      var notes = jgLocalStorage.get('notes');
      notes.unshift(note);
      saveNotes(notes);
    }

    function getNoteIndex (note, notes) {
      var index = -1;
      angular.forEach(notes, function (value, i) {
        if (value.dateStart === note.dateStart) {
          index = i;
        }
      });
      return index;
    }

    function saveNotes (notes) {
      jgLocalStorage.saveCollection(notes, 'notes');
      $scope.notes = notes;
    }
  }])

  // ================================================
  // Categories

  .controller('CategoriesCtrl', 
    ['$scope', '$http', 'jgLocalStorage', 'API_PATH',
    function ($scope, $http, jgLocalStorage, API_PATH) {

    var categoriesPath = API_PATH + 'categories';

    $scope.newCategory;
    $scope.categories = jgLocalStorage.get('categories');
    $scope.foo = jgLocalStorage.get('categories', 2);

    // watch example
    // $scope.$watch(
    //   'newCategory',
    //   function (newVal, oldVal) {
    //     console.log(newVal, oldVal);
    //   },
    //   true
    // );

    // pretend to load categories from service
    $http({
      method: 'GET',
      url: categoriesPath
    })
    .success(function (data, status, headers, config) {
      console.log(data);
      // $scope.categories = data;
    })
    .error(function (data, status, headers, config) {
      console.error(arguments);
    });


    $scope.reset = function () {
      var DEFAULTS = 'admin|support|coding|break|other|jira'.split('|').sort();
      $scope.categories = DEFAULTS;
      jgLocalStorage.saveCollection($scope.categories, 'categories');

      // pretend we have a service
      // use a different endpoint so we can batch
      $http({
        method: 'POST',
        url: API_PATH + 'category-reset',
        data: DEFAULTS
      })
      .success(function (data, status, headers, config) {
        console.log(data);
        // set $scope.categories
      })
      .error(function (data, status, headers, config) {
        console.error(arguments);
      });
    };

    $scope.removeCategory = function (category) {
      var categories = jgLocalStorage.get('categories'),
        index = categories.indexOf(category);
      
      categories.splice(index, 1);
      jgLocalStorage.saveCollection(categories, 'categories');
      $scope.categories = categories;


      $http({
        method: 'DELETE',
        url: categoriesPath + '/' + category.id
      })
      .success(function (data, status, headers, config) {
        console.log(data);
        // delete from $scope.categories
      })
      .error(function (data, status, headers, config) {
        console.error(data);
      });
    };

    $scope.addCategory = function (category) {
      var categories = jgLocalStorage.get('categories');
      categories.push(category);
      categories.sort();
      $scope.categories = categories;
      jgLocalStorage.saveCollection(categories, 'categories');
      $scope.newCategory = '';

      $http({
        method: 'POST',
        url: categoriesPath,
        data: category
      })
      .success(function (data, status, headers, config) {
        console.log(data);
        // category.id = data;
        // reload the categories
      })
      .error(function (data, status, headers, config) {
        console.error(data);
      });
    }
  }]);