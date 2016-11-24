(function() {
  "use strict";

  angular.module('questCreator', ['ui.router', 'LocalStorageModule'])
        .config(function($stateProvider, $urlRouterProvider) {
          $urlRouterProvider.otherwise('/');

          $stateProvider.state('main', {
            abstract: true,
            url: '/',
            templateUrl: './src/views/main.html',
            controller: 'mainCtrl as main'
          }).state('main.landing', {
            // landing page
            url: '',
            templateUrl: './src/views/landing.html',
            controller: 'landingCtrl as landing'
          }).state('main.game', {
            // url: ':name'
            url: 'game',
            templateUrl: './src/views/game.html',
            controller: 'gameCtrl as game'
          }).state('main.game.detail', {
            url: '/detail',
            templateUrl: './src/views/game/detail.html',
            controller: 'detailCtrl as detail'
          }).state('main.game.play', {
            url: '/play',
            templateUrl: './src/views/game/play.html',
            controller: 'playCtrl as play'
          }).state('main.game.editor', {
            // "/game/editor"
            abstract: true,
            url: '/editor',
            templateUrl: './src/views/game/editor.html',
            controller: 'editorCtrl as editor',
          }).state('main.game.editor.views', {
            url: '/',
            views: {
              'palette': {
                templateUrl: './src/views/game/editor/palette.html',
                controller: 'paletteCtrl as palette'
              },
              'maps': {
                templateUrl: './src/views/game/editor/map.html',
                controller: 'mapCtrl as map'
              },
              'scenes': {
                templateUrl: './src/views/game/editor/scene.html',
                controller: 'sceneCtrl as scene'
              },
              'backgrounds': {
                templateUrl: './src/views/game/editor/bg.html',
                controller: 'bgCtrl as bg'
              },
              'objects': {
                templateUrl: './src/views/game/editor/obj.html',
                controller: 'objCtrl as obj'
              },
              'entities': {
                templateUrl: './src/views/game/editor/ent.html',
                controller: 'entCtrl as ent'
              },
              'scripts': {
                templateUrl: './src/views/game/editor/scripts.html',
                controller: 'scriptsCtrl as scripts'
              }
            }
          }).state('main.profile', {
            url: 'profile',
            templateUrl: './src/views/profile.html',
            controller: 'profileCtrl as profile'
          });
        });

})();
;angular.module('questCreator').filter('capitalize', function() {

    return function(input) {
        input = input || '';
        return input.replace(/\w\S*/g, function(txt) {
            return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
        });
    };

});
;angular.module('questCreator')
.filter('nospace', function () {
    return function (value) {
        return (!value) ? '' : value.replace(/ /g, '');
    };
});
;angular.module('questCreator').factory('Avatar', function() {
  function Avatar(avatarInfo) {
    this.name = avatarInfo.name;
    this.info = avatarInfo.info;
    this.user_id = avatarInfo.user_id;
    this.current = avatarInfo.current;
    this.action = 'stand';
  };

  Avatar.prototype.updatePos = function() {
    this.info.pos.x += this.info.speed.x;
    this.info.pos.y += this.info.speed.y;
  }

  Avatar.prototype.stop = function() {
    this.action = 'stand';
    this.info.speed.x = 0;
    this.info.speed.y = 0;
  }

  Avatar.prototype.collide = function(direction) {
    this.stop();
    switch (direction) {
      case 'left':
        this.info.pos.x += this.info.speed.mag;
        break;
      case 'right':
        this.info.pos.x -= this.info.speed.mag;
        break;
      case 'up':
        this.info.pos.y += this.info.speed.mag;
        break;
      case 'down':
        this.info.pos.y -= this.info.speed.mag;
        break;
    }
  }

  return Avatar;
});
;angular.module('questCreator').factory('Background', function() {
  function Background(backgroundInfo) {
    this.name = backgroundInfo.name;
    this.obj = backgroundInfo.obj;
    this.game_id = backgroundInfo.game_id;
  };

  return Background;
});
;angular.module('questCreator').factory('Entity', function() {
  function Entity(entity) {
    this.name = entity.name;
    this.game_id = entity.game_id;
    this.action = 'walkLeft';
    this.info = entity.info;
    this.info.speed = {
      mag: 3,
      x: 0,
      y: 0
    };
    this.info.currentFrameIndex = 0;
    this.info.currentFrame = this.info.animate[this.action][this.info.currentFrameIndex];
    this.animateDelay = 20;
    this.animateTime = 0;
  };

  Entity.prototype.updatePos = function() {
    this.info.pos.x += this.info.speed.x;
    this.info.pos.y += this.info.speed.y;
  }

  Entity.prototype.checkAction = function() {
    var self = this;
    if (self.animateTime > self.animateDelay) {
      if (self.action === 'stand' || self.action === 'walkLeft' || self.action === 'walkUp' || self.action === 'walkRight' || self.action === 'walkDown') {
          switch (self.action) {
              case 'walkLeft':
                  self.info.speed.x = -self.info.speed.mag;
                  self.info.speed.y = 0;
                  break;
              case 'walkUp':
                  self.info.speed.x = 0;
                  self.info.speed.y = -self.info.speed.mag;
                  break;
              case 'walkRight':
                  self.info.speed.x = self.info.speed.mag;
                  self.info.speed.y = 0;
                  break;
              case 'walkDown':
                  self.info.speed.x = 0;
                  self.info.speed.y = self.info.speed.mag;
                  break;
          }
          // Animate the entity.
          self.info.currentFrame = self.info.animate[self.action][self.info.currentFrameIndex];
          self.info.currentFrameIndex++;
          if (self.info.currentFrameIndex > self.info.animate[self.action].length - 1) {
              self.info.currentFrameIndex = 0;
          }
      }
      self.animateTime = 0;
    }
    self.animateTime++;
  }

  Entity.prototype.stop = function() {
    this.action = 'walkRight';
    this.info.speed.x = 0;
    this.info.speed.y = 0;
  }

  Entity.prototype.wander = function() {
    this.info.speed.x = 0;
    this.info.speed.y = 0;
    // Entities bounce instead of stopping.
    var randomAction = (Math.floor(Math.random() * 4));
    switch (randomAction) {
      case 0:
        this.action = 'walkLeft';
        break;
      case 1:
        this.action = 'walkRight';
        break;
      case 2:
        this.action = 'walkUp';
        break;
      case 3:
        this.action = 'walkDown';
        break;
    }
  }

  Entity.prototype.collide = function(direction) {
    this.wander();
    switch (direction) {
      case 'left':
        this.info.pos.x += this.info.speed.mag;
        break;
      case 'right':
        this.info.pos.x -= this.info.speed.mag;
        break;
      case 'up':
        this.info.pos.y += this.info.speed.mag;
        break;
      case 'down':
        this.info.pos.y -= this.info.speed.mag;
        break;
    }
  }

  return Entity;
});
;angular.module('questCreator').factory('Game', function() {
  function Game(name) {
    this.name = name;
    this.maps = [];
    this.scenes = [];
    this.backgrounds = [];
    this.sceneObjects = [];
    this.entities = [];
  };

  return Game;
});
;angular.module('questCreator').factory('Map', function() {
  function Map(name) {
    this.name = name;
    this.scenes = [];
    /*
      Structure of scenes array:
      [ [ scenes[0][0], scenes[0][1], scenes[0][2], scenes[0][3] ],
        [ scenes[1][0], scenes[1][1], scenes[1][2], scenes[1][3] ],
        [ scenes[2][0], scenes[2][1], scenes[2][2], scenes[2][3] ] ]
    */
  };

  return Map;
});
;angular.module('questCreator')
.factory('PopupFactory', function ($compile) {

  function create(content, title, scope) {
    var popup = $('<popup>')
      .attr({
        'popup-title': '\"'+ title +'\"'
        }
      )
      .append(content);
    popup = $compile(popup)(scope);
    $(popup).prependTo('body');
  };

  return {
    new: create
  };

});
;angular.module('questCreator').factory('Scene', function() {
  function Scene(name) {
    this.name = name;
    this.backgrounds = [];
    this.sceneObjects = [];
    this.entities = [];
  };

  return Scene;
});
;angular.module('questCreator').factory('SceneObject', function() {
  function SceneObject(sceneObjectInfo) {
    this.name = sceneObjectInfo.name;
    this.obj = sceneObjectInfo.obj;
    this.game_id = sceneObjectInfo.game_id;
    this.action = 'none';
    this.allActions = [];
  };

  return SceneObject;
});
;// credit: https://gist.github.com/anri-asaturov/10208667

angular.module('questCreator')
.directive('blurOnEnter', function(){
    return {
        link:  function (scope, element, attrs) {
            element.bind("keypress", function (event) {
              console.log("in directive");
                if(event.which === 13) {
                    console.log('blurrin');
                    element.blur();
                    event.preventDefault();
                }
            });
        }
    }
});
;angular.module('questCreator')
.directive('popup', function(){
  return {
    scope: {
      title: '=popupTitle',
      kill: '@'
    },
    replace: true,
    transclude: true,
    link: function (scope, element, attrs) {
      scope.kill = function(){
        $('#overlay').remove();
      }
    },
    templateUrl: './src/views/popup.html',
    controller: function($scope) {
      $scope.killPopUp = function(){
        $scope.kill();
      }
    }
  };
});
;angular.module('questCreator').service('EditorService', function (UserService, $state) {

    var drawingCopy = {
      image: [],
      collision: []
    };

    function copy(image, collision) {
      drawingCopy = {
        image: image,
        collision: collision
      };
    }

    function paste(type) {
      if (type === 'image') {
        return drawingCopy.image;
      } else if (type === 'collision') {
        return drawingCopy.collision;
      }
    }

    function getGame(name) {
      var nameWrapper = {
        name: name.toLowerCase()
      }
      return $.ajax({
        method: 'GET',
        url: 'https://forge-api.herokuapp.com/games/load',
        data: nameWrapper,
        success: function(response) {
          return response;
        },
        error: function(error) {
          alert('There was a problem loading this game');
        }
      });
    }

    function getGameAssets(game_id) {
        var headerData = {
          user_id: UserService.get().id,
          token: UserService.get().token
        };
        var data = {
          game_id: game_id
        };
        return $.ajax({
          method: 'GET',
          url: 'https://forge-api.herokuapp.com/articles/game/all',
          headers: headerData,
          data: data,
          success: function(response) {
            return response;
          },
          error: function(error) {
            console.log(error);
          }
        });
    }

    function createGame(name) {
      var headerData = {
        user_id: UserService.get().id,
        token: UserService.get().token
      };
      var titleScene = {
        name: 'Title Screen',
        pos: [0,0,0],
        background: null,
        objects: [],
        entities: []
      };
      var titleMap = {
        name: 'Title Map',
        scenes: [
          [titleScene]
        ]
      };
      var game = {
        name: name,
        description: "",
        tags: [],
        info: {
          maps: [
            titleMap
          ]
        }
      };
      return $.ajax({
        method: 'POST',
        url: 'https://forge-api.herokuapp.com/games/create',
        data: JSON.stringify(game),
        headers: headerData,
        dataType: 'json',
        contentType: 'application/json',
        success: function(response) {
          game = response;
          createBackground('Title Screen', game.id)
          createCollaborator(game.id).done(function(response) {
            console.log(response);
          });
          return game;
        },
        error: function(error) {
          alert('There was a problem creating this game. Please try again.');
          $state.go('main.landing');
        }
      });
    }

    function createCollaborator(game_id) {
      var headerData = {
        user_id: UserService.get().id,
        token: UserService.get().token
      };
      var data = {
        game_id: game_id,
      };
      return $.ajax({
        method: 'POST',
        url: 'https://forge-api.herokuapp.com/collaborators/self',
        headers: headerData,
        data: data,
        success: function(response) {
          return response;
        },
        error: function(error) {
          console.log(error);
        }
      });
    }

    function saveGame(game) {
      var gameUpdateData = {
        name: game.name,
        id: game.id,
        tags: game.tags,
        description: game.description,
        info: game.info,
        published: true,
        thumbnail: game.info.maps[0].scenes[0][0].background.thumbnail || null
      };
      console.log(gameUpdateData);
      var headerData = {
        user_id: UserService.get().id,
        token: UserService.get().token
      };
      return $.ajax({
        method: 'PUT',
        url: 'https://forge-api.herokuapp.com/games/update',
        headers: headerData,
        data: JSON.stringify(gameUpdateData),
        dataType: 'json',
        contentType: 'application/json',
        success: function(response) {
          return response;
        },
        error: function(error) {
          console.log(error);
        }
      });
    }

    function createBackground(name, game_id) {
      var headerData = {
        user_id: UserService.get().id,
        token: UserService.get().token
      };
      var backgroundInfo = {
        image: [],
        collisionMap: []
      };
      var currentBackground = {
        name: name,
        info: backgroundInfo,
        tags: [],
        published: true,
        game_id: game_id
      };
      return $.ajax({
        method: 'POST',
        url: 'https://forge-api.herokuapp.com/backgrounds/create',
        headers: headerData,
        data: JSON.stringify(currentBackground),
        dataType: 'json',
        contentType: 'application/json',
        success: function(response) {
          return response;
        },
        error: function(error) {
          console.log(error);
        }
      });
    }

    function saveBackground(imageArr, collisionArr, currentBackground, thumbnail) {
      currentBackground.info.image = imageArr;
      currentBackground.info.collisionMap = collisionArr;
      currentBackground.thumbnail = thumbnail;
      var headerData = {
        user_id: UserService.get().id,
        token: UserService.get().token
      };
      return $.ajax({
        method: 'PUT',
        url: 'https://forge-api.herokuapp.com/backgrounds/update',
        headers: headerData,
        data: JSON.stringify(currentBackground),
        dataType: 'json',
        contentType: 'application/json',
        success: function(response) {
          return response;
        },
        error: function(error) {
          console.log(error);
        }
      });
    }

    function createObject(name, game_id) {
      var headerData = {
        user_id: UserService.get().id,
        token: UserService.get().token
      };
      var objectInfo = {
        pos: {
          x: 350,
          y: 250
        },
        image: [],
        collisionMap: []
      };
      var currentObject = {
        name: name,
        info: objectInfo,
        tags: [],
        published: false,
        game_id: game_id
      };
      return $.ajax({
        method: 'POST',
        url: 'https://forge-api.herokuapp.com/obstacles/create',
        headers: headerData,
        data: JSON.stringify(currentObject),
        dataType: 'json',
        contentType: 'application/json',
        success: function(response) {
          return response;
        },
        error: function(error) {
          console.log(error);
        }
      });
    }

    function saveObject(imageArr, collisionArr, currentObject, thumbnail) {
      currentObject.info.image = imageArr;
      currentObject.info.collisionMap = collisionArr;
      currentObject.thumbnail = thumbnail;
      var headerData = {
        user_id: UserService.get().id,
        token: UserService.get().token
      };
      return $.ajax({
        method: 'PUT',
        url: 'https://forge-api.herokuapp.com/obstacles/update',
        headers: headerData,
        data: JSON.stringify(currentObject),
        dataType: 'json',
        contentType: 'application/json',
        success: function(response) {
          return response;
        },
        error: function(error) {
          console.log(error);
        }
      });
    }

    function createEntity(name, game_id) {
      var headerData = {
        user_id: UserService.get().id,
        token: UserService.get().token
      };
      var entityInfo = {
        pos: {
          x: 350,
          y: 250
        },
        animate: {
          walkLeft: [
            {
              image: [],
              collisionMap: []
            }, {
              image: [],
              collisionMap: []
            }, {
              image: [],
              collisionMap: []
            }
          ],
          walkRight: [
            {
              image: [],
              collisionMap: []
            },
            {
              image: [],
              collisionMap: []
            }, {
              image: [],
              collisionMap: []
            }
          ],
          walkUp: [
            {
              image: [],
              collisionMap: []
            },
            {
              image: [],
              collisionMap: []
            }, {
              image: [],
              collisionMap: []
            }
          ],
          walkDown: [
            {
              image: [],
              collisionMap: []
            },
            {
              image: [],
              collisionMap: []
            }, {
              image: [],
              collisionMap: []
            }
          ]
        }
      };
      var currentEntity = {
        name: name,
        info: entityInfo,
        tags: [],
        published: false,
        game_id: game_id
      };
      return $.ajax({
        method: 'POST',
        url: 'https://forge-api.herokuapp.com/entities/create',
        headers: headerData,
        data: JSON.stringify(currentEntity),
        dataType: 'json',
        contentType: 'application/json',
        success: function(response) {
          return response;
        },
        error: function(error) {
          console.log(error);
        }
      });
    }

    function saveEntity(imageArr, collisionArr, currentEntity, currentAnimation, frameIndex, thumbnail) {
      currentEntity.info.animate[currentAnimation][frameIndex].image = imageArr;
      currentEntity.info.animate[currentAnimation][frameIndex].collisionMap = collisionArr;
      currentEntity.thumbnail = thumbnail;
      currentEntity.published = true;
      var headerData = {
        user_id: UserService.get().id,
        token: UserService.get().token
      };
      return $.ajax({
        method: 'PUT',
        url: 'https://forge-api.herokuapp.com/entities/update',
        headers: headerData,
        data: JSON.stringify(currentEntity),
        dataType: 'json',
        contentType: 'application/json',
        success: function(response) {
          return response;
        },
        error: function(error) {
          console.log(error);
        }
      });
    }

    return {
      getGame: getGame,
      getGameAssets: getGameAssets,
      createGame: createGame,
      saveGame: saveGame,
      createBackground: createBackground,
      saveBackground: saveBackground,
      createObject: createObject,
      saveObject: saveObject,
      createEntity: createEntity,
      saveEntity: saveEntity,
      copy: copy,
      paste: paste
    };
});
;angular.module('questCreator').service('GameService', function() {

    var gameDetail = {};

    function loadGame(name) {
      var nameWrapper = {
        name: name.toLowerCase()
      };

      return $.ajax({
          method: 'GET',
          url: 'https://forge-api.herokuapp.com/games/load',
          data: nameWrapper,
          success: function(response) {
              return response;
          },
          error: function(error) {
              alert('There was a problem loading this game');
          }
      });
    }

    function getAllGames() {
        return $.ajax({
            method: 'GET',
            url: 'https://forge-api.herokuapp.com/games/all',
            contentType: 'application/json',
            success: function(response) {
                return response;
            },
            error: function(error) {
                alert('There was a problem loading the games');
            }
        });
    }

    function getGameDetail() {
        return gameDetail;
    }

    function setGameDetail(game) {
        gameDetail = game;
    }

    function searchGames(keyword) {
      return $.ajax({
        method: 'GET',
        url: 'https://forge-api.herokuapp.com/games/search',
        data: {
          name: keyword
        },
        // dataType: 'json',
        // contentType: 'application/json',
        success: function(response) {
          console.log(response);
          return response;
        },
        error: function(error) {
          alert('There was a problem loading the games');
        }
      });
    }



    return {
        loadGame: loadGame,
        getGameDetail: getGameDetail,
        setGameDetail: setGameDetail,
        getGames: getAllGames,
        searchGames: searchGames
    };
});
;angular.module('questCreator').service('PaletteService', function (UserService) {

  var currentType = '';

  var assets = null;

  var headerData = {
    user_id: UserService.get().id,
    token: UserService.get().token
  };

  function getAssetsInService() {
    return assets;
  }

  function getCurrentType() {
    return currentType;
  }

  function getAllAssets() {
      $.ajax({
          method: 'GET',
          url: 'https://forge-api.herokuapp.com/articles/index',
          contentType: 'application/json',
          success: function(response) {
              return response;
          },
          error: function(error) {
              alert('There was a problem loading the assets');
          }
      });
  }

  function getAssetsByType(type) {
    currentType = type;
    return $.ajax({
      method: 'GET',
      url: 'https://forge-api.herokuapp.com/' + type + '/all',
      headers: headerData,
      success: function(response) {
        assets = response;
        return assets;
      },
      error: function(error) {
        alert('There was a problem loading the ' + currentType + '.');
      }
    });
  }

  function getAssetsByTag(tag) {
    return $.ajax({
      method: 'GET',
      url: 'https://forge-api.herokuapp.com/' + currentType + '/search',
      headers: headerData,
      data: {
        name: tag
      },
      success: function(response) {
        assets = response;
        return assets;
      },
      error: function(error) {
        alert('There was a problem loading the ' + currentType +'s matching your search for ' + tag);
      }
    });
  }

  return {
    getCurrent: getAssetsInService,
    getCurrentType: getCurrentType,
    getAll: getAllAssets,
    getByType: getAssetsByType,
    getByTag: getAssetsByTag
  };
});
;angular.module('questCreator')
.service('PopupService', function ($templateRequest, PopupFactory, $rootScope) {

  var path = './src/views/popups/';

  var templates = {
    'welcome': {
      title: 'Welcome!',
      content: 'welcome.html'
    },
    'user-register': {
      title: 'Hey, you\'re new!',
      content: 'user-register.html'
    },
    'edit-game': {
      title: 'Awesome! Now you\'re editing:',
      content: 'edit-game.html'
    },
    'create-game': {
      title: 'Name your game:',
      content: 'create-game.html'
    },
  }

  function templateSelector(name, scope) {
    scope = scope || $rootScope.$$childHead;
    var template = path + templates[name].content;
    var content = $('<ng-include>').attr('src', '\''+ template+ '\'');
    // Creates new popup on the page in specified scope:
    PopupFactory.new(content, templates[name].title, scope);
  }

  function close() {
    $('#overlay').remove();
  }

  return {
    open: templateSelector,
    close: close
  }
});
;angular.module('questCreator').service('socket', function() {
  var socket = io();

  return {
    on: function(eventName, callback){
      socket.on(eventName, callback);
    },
    emit: function(eventName, data) {
      socket.emit(eventName, data);
    },
    off: function(eventName, data) {
      socket.off(eventName, data);
    }
  };
});
;angular.module('questCreator')
    .service('UserService', function(PopupService) {
        // Google Info
        var apiKey = 'AIzaSyCe__2EGSmwp0DR-qKGqpYwawfmRsTLBEs';
        var clientId = '730683845367-tjrrmvelul60250evn5i74uka4ustuln.apps.googleusercontent.com';
        var user = {
            uid: null,
            token: null,
            username: null,
            picture: null,
            id: null,
            games: null,
            joined: null,
            editGame: null
        };
        var loggedIn = false;

        function checkLogin() {
          return new Promise(function(resolve, reject) {
            var loopHandle = setInterval(function() {
              if (loggedIn) {
                resolve(true);
                clearInterval(loopHandle);
              }
            }, 20);
          });
        }

        //Get the current values for user data
        function getUser() {
          return user;
        }

        function setUser(adjUser) {
            user = adjUser;
        }

        function setGameEdit(name) {
            user.editGame = name;
        }

        function getGameEdit() {
            return user.editGame || null;
        }

        function archiveGame(gameId) {
            $.ajax({
                method: 'DELETE',
                url: 'https://forge-api.herokuapp.com/games/archive',
                data: {
                    id: gameId
                },
                headers: {
                    user_id: user.id,
                    token: user.token
                },
                success: function(response) {
                    alert('Your game has been archived. If you ever want to see it again, click "Archived Games" below the list of your games. Carry on.');
                },
                error: function(error) {
                    alert('There was a problem archiving this game. Please try again.');
                }
            });
        }

        var auth2;
        // When the api has loaded, run the init function.
        gapi.load('client:auth2', initAuth);

        // Get authorization from the user to access profile info
        function initAuth() {
            gapi.client.setApiKey(apiKey); // Define the apiKey for requests
            gapi.auth2.init({ // Define the clientId and the scopes for requests
                client_id: clientId,
                scope: 'profile'
            }).then(function() {
                auth2 = gapi.auth2.getAuthInstance(); // Store authInstance for easier accessibility
                console.log("Session authorized");
                auth2.isSignedIn.listen(updateSignInStatus);
                updateSignInStatus(auth2.isSignedIn.get());
            });
        }

        function updateSignInStatus(isSignedIn) {
            if (isSignedIn) {
                $('#login').hide();
                $('#logout').show();
                console.log("Signed In!");
                getLogin();
            } else {
                $('#login').show();
                $('#logout').hide();
                console.log("Signed Out!");
            }
        }

        // Sign the user in to their google account when the sign in button is clicked
        function signIn() {
            auth2.signIn({
                prompt: 'login'
            });
        }

        // Sign the user out of their google account when the sign out button is clicked
        function signOut() {
            auth2.signOut();
        }

        // Get the name of the user who signed in.
        function getLogin() {
            var requestUser = gapi.client.request({
                path: 'https://people.googleapis.com/v1/people/me',
                method: 'GET'
            });
            requestUser.then(function(response) {
                user.picture = response.result.photos[0].url;
                user.uid = auth2.currentUser.Ab.El;
                user.token = auth2.currentUser.Ab.Zi.access_token;
                $.ajax({
                    method: 'PATCH',
                    url: 'https://forge-api.herokuapp.com/users/login',
                    data: {
                        uid: user.uid,
                        token: user.token
                    },
                    success: function(response) {
                        user.joined = response.created_at;
                        user.username = response.username;
                        user.id = response.id;
                        PopupService.open('welcome');
                        loggedIn = true;
                    },
                    error: function(error) {
                        if (error.status === 404) {
                            // $('#register-form').css('display', 'flex');
                            PopupService.open('user-register');
                        } else if (error.status === 0) {
                            // Do nothing
                        } else {
                            alert('There was a problem logging in. Please try again');
                            signOut();
                        }
                    }
                });
            });
        }

        function registerUser(username) {
            user.username = username;
            $.ajax({
                method: 'POST',
                url: 'https://forge-api.herokuapp.com/users/create',
                data: {
                    username: user.username,
                    uid: user.uid,
                    token: user.token
                },
                success: function(response) {
                    user.id = response.id;
                    // $('#register-form').css('display', 'none');
                    PopupService.open('user-register');
                },
                error: function(error) {
                    alert('There was a problem logging in. Please try again');
                    signOut();
                }
            });
        }

        function getUserGames() {
            return $.ajax({
                method: 'GET',
                url: 'https://forge-api.herokuapp.com/games/user-games',
                headers: {
                    user_id: user.id,
                    token: user.token
                },
                success: function(response) {
                    return response;
                },
                error: function(error) {
                    alert('There was a problem loading the profile. Please try again.');
                }
            });
            }

        function validateCollabRequest(gameId) {
            return $.ajax({
                method: 'GET',
                url: 'https://forge-api.herokuapp.com/collaborators/existence',
                headers: {
                    user_id: user.id,
                    token: user.token
                },
                data: {
                    game_id: gameId
                },
                dataType: 'json',
                contentType: 'application/json',
                success: function(response) {
                    return response;
                },
                error: function(error) {
                    return error;
                }
            });
        }

        function sendCollabRequest(gameId) {
            $.ajax({
                method: 'POST',
                url: 'https://forge-api.herokuapp.com/collaborators/create',
                headers: {
                    user_id: user.id,
                    token: user.token
                },
                data: {
                    game_id: gameId
                },
                // dataType: 'json',
                // contentType: 'application/json',
                success: function(response) {
                    console.log(response);
                },
                error: function(error) {
                    console.log(error);
                }
            });
        }

        function getCollabRequests() {
            return $.ajax({
                method: 'GET',
                url: 'https://forge-api.herokuapp.com/collaborators/user/requesters',
                headers: {
                    user_id: user.id,
                    token: user.token
                },
                // dataType: 'json',
                // contentType: 'application/json',
                success: function(response) {
                    console.log('success requests', response);
                },
                error: function(error) {
                    console.log('error requests', error);
                }
            });
        }

        function getCollaborators() {
            return $.ajax({
                method: 'GET',
                url: 'https://forge-api.herokuapp.com/collaborators/user/collaborators',
                headers: {
                    user_id: user.id,
                    token: user.token
                },
                dataType: 'json',
                contentType: 'application/json',
                success: function(response) {
                    console.log('success collaborators', response);
                },
                error: function(error) {
                    console.log('error collaborators', error);
                }
            });
        }

        function getCollaborations() {
            return $.ajax({
                method: 'GET',
                url: 'https://forge-api.herokuapp.com/users/collaborations',
                headers: {
                    user_id: user.id,
                    token: user.token
                },
                dataType: 'json',
                contentType: 'application/json',
                success: function(response) {
                    console.log('success collaborations', response);
                },
                error: function(error) {
                    console.log('error collaborations', error);
                }
            });
        }

        function toggleAccepted(gameId, requesterId) {
            $.ajax({
                method: 'PATCH',
                url: 'https://forge-api.herokuapp.com/collaborators/update/accepted',
                headers: {
                    user_id: user.id,
                    token: user.token
                },
                data: {
                    game_id: gameId,
                    requester_id: requesterId
                },
                success: function(response) {
                    console.log(response);
                },
                error: function(error) {
                    console.log(error);
                }
            });
        }

        function toggleRequested(gameId, requesterId) {
          console.log(gameId, requesterId);
            $.ajax({
                method: 'PATCH',
                url: 'https://forge-api.herokuapp.com/collaborators/update/requested',
                headers: {
                    user_id: user.id,
                    token: user.token
                },
                data: {
                  game_id: gameId,
                  requester_id: requesterId
                },
                success: function(response) {
                    console.log(response);
                },
                error: function(error) {
                    console.log(error);
                }
            });
        }

        function requestAgain(gameId) {
            $.ajax({
                method: 'PATCH',
                url: 'https://forge-api.herokuapp.com/collaborators/rerequest',
                headers: {
                    user_id: user.id,
                    token: user.token
                },
                data: {
                  game_id: gameId,
                },
                dataType: 'json',
                contentType: 'application/json',
                success: function(response) {
                    console.log(response);
                },
                error: function(error) {
                    console.log(error);
                }
            });
        }

        return {
            get: getUser,
            set: setUser,
            setGameEdit: setGameEdit,
            getGameEdit: getGameEdit,
            getUserGames: getUserGames,
            validateCollabRequest: validateCollabRequest,
            sendCollabRequest: sendCollabRequest,
            getCollabRequests: getCollabRequests,
            getCollaborators: getCollaborators,
            getCollaborations: getCollaborations,
            toggleAccepted: toggleAccepted,
            toggleRequested: toggleRequested,
            requestAgain: requestAgain,
            archive: archiveGame,
            register: registerUser,
            signOut: signOut,
            signIn: signIn,
            checkLogin: checkLogin
        };
    });
;angular.module('questCreator').controller('bgCtrl', function($state, $scope, EditorService) {
  var self = this;      // To help with scope issues
  var drawHandle = -1;  // Interval handle for drawing rate
  var moveHandle = -1;  // Interval handle for movement of mouse (possibly does not need to be global)
  var mouseX = 0;
  var mouseY = 0;
  var mouseMoveEvent;       // Global variable to track mouse movement events
  var touchMoveEvent;       // Global variable to track touch movement events
  var mobileWidth = 850;    // Width for mobile screen sizes
  var tabletWidth = 1100;   // Width for tablet screen sizes
  var tabletScale = 1.4;
  var mobileScaleX = 2.5;
  var mobileScaleY = 1.6;
  var moveType = '';    // Either mouse or touch
  var moved = false;    // Whether mouse has moved or not
  var moving = {        // Direction that the main character should be moving.
    left: false,
    right: false,
    up: false,
    down: false
  };
  var drawing = {       // Type of object being drawn. Default: background.
    // mobile: false,
    // static: false,
    background: true
  };
  var pixelWidth = $scope.editor.currentPixelSize;
  var pixelHeight = $scope.editor.currentPixelSize;
  var undoBackgroundArray = [];   //Array to keep track of background objects that were undone.
  var undoCollisionArray = [];
  // var undoObstacleArray = [];   //Array to keep track of obstacle objects that were undone.
  // var undoCharacterArray = [];   //Array to keep track of character objects that were undone.
  this.speedRange = 5;     // How fast mobile objects should move.
  // this.radiusRange = 5;  // Value of radius input in draw.html
  // this.widthRangeBackground = 50;   // Value of width input in draw.html
  // this.heightRangeBackground = 50;  // Value of height input in draw.html
  // this.widthRangeObstacle = 50;     // Value of width input in draw.html
  // this.heightRangeObstacle = 50;    // Value of height input in draw.html
  this.currentColor = $scope.editor.currentColor;    // Value of color input in draw.html
  // this.currentScene = Scenes.fetchCurrentScene() || {}; // Scene selected from scenes controller
  // this.currentBackground = Backgrounds.fetchCurrentBackground() || {};  // Background selected from scenes controller
  this.myCanvas = document.getElementById('bg-canvas');  // Canvas html element
  this.canvasPos = {    // Canvas top and left coordinates on page
    x: self.myCanvas.getBoundingClientRect().left,
    y: self.myCanvas.getBoundingClientRect().top
  };
  this.draw = this.myCanvas.getContext('2d'); // Canvas context
  // this.sceneName =  this.currentScene.name || '';       // Current selected Scene name
  // this.allMobileCircles = this.currentScene.mobileArr || [];  // Array of all mobile objects in current scene
  // this.allObstacleSquares = this.currentScene.staticArr || [];  // Array of all static objects in current scene
  // this.backgroundName = this.currentBackground.name || '';  // Current selected Background name
  // this.allBackgroundSquares = this.currentBackground.staticArr || []; // Array of all static objects in current background
  this.allCollisionSquares = [];
  this.allBackgroundSquares = [];

  /*
  *   Rectangle object constructor
  *   @params
  *     x: horizontal coord of top left corner
  *     y: vertical coord of top left corner
  *     width: width of rectangle
  *     height: height of rectangle
  *     color: color of rectangle
  *   @methods
  *     draw: draw the rectangle on the canvas using its position, size, and color.
  */
  function Square(x, y, width, height, color, type) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.color = color;
    this.type = type;
  }

  Square.prototype.draw = function() {
    self.draw.fillStyle = this.color;
    if (window.innerWidth <= mobileWidth) { // Mobile size
      self.draw.fillRect(this.x * mobileScaleX, this.y * mobileScaleY, this.width, this.height);
    } else if (window.innerWidth <= tabletWidth) { // Tablet size
      self.draw.fillRect(this.x * tabletScale, this.y / tabletScale, this.width, this.height);
    } else {  // Desktop size
      self.draw.fillRect(this.x, this.y, this.width, this.height);
    }
  };

  $scope.$on('redrawBackground', function(event, imageArr, collisionArray) {
    canvasWidth = self.myCanvas.width;
    canvasHeight = self.myCanvas.height;
    self.draw.clearRect(0, 0, canvasWidth, canvasHeight);
    self.allBackgroundSquares = [];
    self.allCollisionSquares = [];
    var undoBackgroundArray = [];
    var undoCollisionArray = [];
    self.allBackgroundSquares = imageArr;
    self.allCollisionSquares = collisionArray;
    drawBackgroundSquares();
    drawCollisionSquares();

    //NOTE probably can edit this out eventually:
    var dataURL = self.myCanvas.toDataURL();
    $scope.editor.currentSceneImg = {
      'background': 'url("' + dataURL + '")'
    };
    console.log("??", $scope.editor.currentSceneImg);
    //NOTE probably can edit this out eventually^

  });

  // /*
  // *   Circle object constructor
  // *   @params
  // *     x: horizontal coord of center of circle
  // *     y: vertical coord of center of circle
  // *     radius: radius of circle
  // *     color: color of circle
  // *   @methods
  // *     draw: draw the circle on the canvas using its position, size, and color.
  // */
  // function Circle(x, y, radius, color) {
  //   this.x = x;
  //   this.y = y;
  //   this.radius = radius;
  //   this.color = color;
  //   this.draw = function() {
  //     self.draw.beginPath();
  //     self.draw.fillStyle = this.color;
  //     if (window.innerWidth <= mobileWidth) { // Mobile size
  //       self.draw.arc(this.x * mobileScaleX, this.y * mobileScaleY, this.radius, 0, 2 * Math.PI);
  //     } else if (window.innerWidth <= tabletWidth) { // Tablet size
  //       self.draw.arc(this.x * tabletScale, this.y / tabletScale, this.radius, 0, 2 * Math.PI);
  //     } else {
  //       self.draw.arc(this.x, this.y, this.radius, 0, 2 * Math.PI);
  //     }
  //     self.draw.fill();
  //     // Example for future reference: Can also draw using an image. Image should first be loaded on the page.
  //     // draw.drawImage(imgElem, this.x, this.y, this.radius, this.radius);
  //   }
  // }

  // Called when the mouse button is pressed.
  // Starts the interval to run every 100ms while the mouse button is still held down.
  // Only start the interval if it is not already running.
  function mouseDown(event) {
    if (drawHandle === -1) {
      drawHandle = setInterval(mousePressed, 100);
    }
  }

  // Called when the mouse button is released.
  // If the interval is running, then clear it and reset it.
  function mouseUp(event) {
    if (drawHandle !== -1) {
      clearInterval(drawHandle);
      drawHandle = -1;
    }
  }

  // Runs every 100ms after the mouse button is pressed until it is released.
  // Purpose is to draw the object that the user has chosen every 100ms AND if the mouse has moved from its previous location.
  function mousePressed() {
      self.canvasPos = {  // Get the most recent canvas position in case the window has been resized.
        x: self.myCanvas.getBoundingClientRect().left,
        y: self.myCanvas.getBoundingClientRect().top
      };
      // if (moved && drawing.mobile) { // Create, draw, and record a new mobile object
      //   var radius = parseInt(self.radiusRange);
      //   var color = self.currentColor;
      //   if (moveType === 'mouse') {
      //     var newCircle = new Circle(mouseMoveEvent.clientX - self.canvasPos.x, mouseMoveEvent.clientY - self.canvasPos.y, radius, color);
      //     newCircle.draw();
      //     self.allMobileCircles.push(newCircle);
      //   } else if (moveType === 'touch') {
      //     var newCircle = new Circle(touchMoveEvent.clientX - self.canvasPos.x, touchMoveEvent.clientY - self.canvasPos.y, radius, color);
      //     newCircle.draw();
      //     self.allMobileCircles.push(newCircle);
      //   }
      //   moved = false;
      // } else if (moved && drawing.static) {  // Create, draw, and record a new static object
      //   var width = parseInt(self.widthRangeObstacle);
      //   var height = parseInt(self.heightRangeObstacle);
      //   var color = self.currentColor;
      //   if (moveType === 'mouse') {
      //     var newSquare = new Square(mouseMoveEvent.clientX - width / 2 - self.canvasPos.x, mouseMoveEvent.clientY - height / 2 - self.canvasPos.y, width, height, color);
      //     newSquare.draw();
      //     self.allObstacleSquares.push(newSquare);
      //   } else if (moveType === 'touch') {
      //     var newSquare = new Square(touchMoveEvent.clientX - width / 2 - self.canvasPos.x, touchMoveEvent.clientY - height / 2 - self.canvasPos.y, width, height, color);
      //     newSquare.draw();
      //     self.allObstacleSquares.push(newSquare);
      //   }
      //   moved = false;
      // } else if (moved && drawing.background) { // Create, draw, and record a new background object
      //   var width = parseInt(self.widthRangeBackground);
      //   var height = parseInt(self.heightRangeBackground);
      //   var color = self.currentColor;
      //   if (moveType === 'mouse') {
      //     var newSquare = new Square(mouseMoveEvent.clientX - width / 2 - self.canvasPos.x, mouseMoveEvent.clientY - height / 2 - self.canvasPos.y, width, height, color);
      //     newSquare.draw();
      //     self.allBackgroundSquares.push(newSquare);
      //   } else if (moveType === 'touch') {
      //     var newSquare = new Square(touchMoveEvent.clientX - width / 2 - self.canvasPos.x, touchMoveEvent.clientY - height / 2 - self.canvasPos.y, width, height, color);
      //     newSquare.draw();
      //     self.allBackgroundSquares.push(newSquare);
      //   }
      //   moved = false;
      // }
    if (moved && drawing.background) { // Create, draw, and record a new background object
      var width = $scope.editor.currentPixelSize;
      var height = $scope.editor.currentPixelSize;
      var color = $scope.editor.drawingCollision ? 'rgba(100, 100, 100, 0.5)' : $scope.editor.currentColor;
      if (moveType === 'mouse') {
        var newSquareX = mouseX - self.canvasPos.x;
        var newSquareY = mouseY - self.canvasPos.y;
        var exists = false;
        self.allBackgroundSquares.forEach(function(square) {
          if (square.x === newSquareX && square.y === newSquareY) {
            exists = true;
          }
        });
        if (!exists) {
          var type = $scope.editor.drawingCollision ? 'collision' : 'normal';
          var newSquare = new Square(mouseX - self.canvasPos.x, mouseY - self.canvasPos.y, width, height, color, type);
          newSquare.draw();
          if ($scope.editor.drawingCollision) {
            self.allCollisionSquares.push(newSquare);
          } else {
            self.allBackgroundSquares.push(newSquare);
          }
        }
      } else if (moveType === 'touch') {
        var type = $scope.editor.drawingCollision ? 'collision' : 'normal';
        var newSquare = new Square(touchMoveEvent.clientX - width / 2 - self.canvasPos.x, touchMoveEvent.clientY - height / 2 - self.canvasPos.y, width, height, color, type);
        newSquare.draw();
        if ($scope.editor.drawingCollision) {
          self.allCollisionSquares.push(newSquare);
        } else {
          self.allBackgroundSquares.push(newSquare);
        }
      }
      moved = false;
    }
  }

  // // Check for collisions between all of the mobile objects and all of the obstacle objects.
  // // The collision is categorized according to which direction the obstacle is found.
  // function findCollisions() {
  //   var foundCollision = {  // By default, there is no collision found in any direction.
  //     left: false,
  //     right: false,
  //     up: false,
  //     down: false
  //   };
  //   self.allMobileCircles.forEach(function(circle) {  // Loop through all the mobile objects
  //     self.allObstacleSquares.forEach(function(square) {  // Loop through all the obstacle objects
  //       // Pattern: check the left, right, top, and bottom edges of the current mobile object against the right, left, bottom, and top edges of the current obstacle (in those exact orders).
  //       if (circle.x - circle.radius <= square.x + square.width && circle.x - circle.radius >= square.x && circle.y >= square.y && circle.y <= square.y + square.height) {
  //         foundCollision.left = true;
  //         moving.left = false;
  //       }
  //       if (circle.x + circle.radius <= square.x + square.width && circle.x + circle.radius >= square.x && circle.y >= square.y && circle.y <= square.y + square.height) {
  //         foundCollision.right = true;
  //         moving.right = false;
  //       }
  //       if (circle.x <= square.x + square.width && circle.x >= square.x && circle.y - circle.radius >= square.y && circle.y - circle.radius <= square.y + square.height) {
  //         foundCollision.up = true;
  //         moving.up = false;
  //       }
  //       if (circle.x <= square.x + square.width && circle.x >= square.x && circle.y + circle.radius >= square.y && circle.y + circle.radius <= square.y + square.height) {
  //         foundCollision.down = true;
  //         moving.down = false;
  //       }
  //     });
  //     // Check for collisions with the canvas border as well. Take resizing screen sizes into account.
  //     var canvasEdgeRight;
  //     var canvasEdgeBottom;
  //     if (window.innerWidth <= mobileWidth) {
  //       canvasEdgeRight = self.myCanvas.width / mobileScaleX;
  //       canvasEdgeBottom = self.myCanvas.height / mobileScaleY;
  //     } else if (window.innerWidth <= tabletWidth) {
  //       canvasEdgeRight = self.myCanvas.width / tabletScale;
  //       canvasEdgeBottom = self.myCanvas.height * tabletScale;
  //     } else {
  //       canvasEdgeRight = self.myCanvas.width;
  //       canvasEdgeBottom = self.myCanvas.height;
  //     }
  //     if (circle.x <= 0) {
  //       foundCollision.left = true;
  //       moving.left = false;
  //     }
  //     if (circle.x >= canvasEdgeRight) {
  //       foundCollision.right = true;
  //       moving.right = false;
  //     }
  //     if (circle.y <= 0) {
  //       foundCollision.up = true;
  //       moving.up = false;
  //     }
  //     if (circle.y >= canvasEdgeBottom) {
  //       foundCollision.down = true;
  //       moving.down = false;
  //     }
  //   });
  //   return foundCollision;
  // }

  // // Called when any key is pressed.
  // function handleKeyDown(event) {
  //   // If the user presses the left, right, up, or down arrow keys, toggle the movement direction accordingly
  //   if (event.keyCode === 37) { // Left Key
  //     event.preventDefault();
  //     moving = {
  //       left: !moving.left,
  //       up: false,
  //       right: false,
  //       down: false
  //     };
  //   } else if (event.keyCode === 38) { // Up Key
  //     event.preventDefault();
  //     moving = {
  //       left: false,
  //       up: !moving.up,
  //       right: false,
  //       down: false
  //     };
  //   } else if (event.keyCode === 39) { // Right Key
  //     event.preventDefault();
  //     moving = {
  //       left: false,
  //       up: false,
  //       right: !moving.right,
  //       down: false
  //     };
  //   } else if (event.keyCode === 40) { // Down Key
  //     event.preventDefault();
  //     moving = {
  //       left: false,
  //       up: false,
  //       right: false,
  //       down: !moving.down
  //     };
  //   } else {    // For all other keys, stop all movement.
  //     moving = {
  //       left: false,
  //       up: false,
  //       right: false,
  //       down: false
  //     }
  //   }
  //   // If any of the arrow keys have been pressed, run the moveMobileCircles function every 20ms.
  //   // Otherwise, stop running the moveMobileCircles function.
  //   if ( moving.left || moving.up || moving.right || moving.down ) {
  //     clearInterval(moveHandle);
  //     moveHandle = setInterval(moveMobileCircles, 20);
  //   } else {
  //     clearInterval(moveHandle);
  //   }
  // }

  // // Runs every 20ms after an arrow key has been pressed.
  // function moveMobileCircles() {
  //   // Depending on movement direction and collision detection, do the following:
  //   // 1) Clear the canvas.
  //   // 2) Redraw background and obstacle objects.
  //   // 3) Shift the circles in the corresponding direction.
  //   // 4) Redraw the circles.
  //   // Note: Checking collision detection and checking movement direction may be redundant.
  //   if (moving.left && !findCollisions().left) {
  //     self.draw.clearRect(0, 0, self.myCanvas.width, self.myCanvas.height);
  //     drawBackgroundSquares();
  //     drawObstacleSquares();
  //     self.allMobileCircles.forEach(function(circle) {
  //       circle.x -= parseInt(self.speedRange);
  //       circle.draw();
  //     });
  //   } else if (moving.right && !findCollisions().right) {
  //     self.draw.clearRect(0, 0, self.myCanvas.width, self.myCanvas.height);
  //     drawBackgroundSquares();
  //     drawObstacleSquares();
  //     self.allMobileCircles.forEach(function(circle) {
  //       circle.x += parseInt(self.speedRange);
  //       circle.draw();
  //     });
  //   } else if (moving.up && !findCollisions().up) {
  //     self.draw.clearRect(0, 0, self.myCanvas.width, self.myCanvas.height);
  //     drawBackgroundSquares();
  //     drawObstacleSquares();
  //     self.allMobileCircles.forEach(function(circle) {
  //       circle.y -= parseInt(self.speedRange);
  //       circle.draw();
  //     });
  //   } else if (moving.down && !findCollisions().down) {
  //     self.draw.clearRect(0, 0, self.myCanvas.width, self.myCanvas.height);
  //     drawBackgroundSquares();
  //     drawObstacleSquares();
  //     self.allMobileCircles.forEach(function(circle) {
  //       circle.y += parseInt(self.speedRange);
  //       circle.draw();
  //     });
  //   }
  // }

  // Loop through the array of background objects and draw them all.
  function drawBackgroundSquares() {
    for (var index = 0; index < self.allBackgroundSquares.length; index++) {
      var square = self.allBackgroundSquares[index];
      self.draw.fillStyle = square.color;
      self.draw.fillRect(square.x, square.y, square.width, square.height);
    }
  }
  function drawCollisionSquares() {
    for (var index = 0; index < self.allCollisionSquares.length; index++) {
      var square = self.allCollisionSquares[index];
      self.draw.fillStyle = square.color;
      self.draw.fillRect(square.x, square.y, square.width, square.height);
    }
  }

  // // Loop through the array of obstacle objects and draw them all.
  // function drawObstacleSquares() {
  //   for (var index = 0; index < self.allObstacleSquares.length; index++) {
  //     var square = self.allObstacleSquares[index];
  //     square.draw();
  //   }
  // }

  // // Loop through the array of mobile objects and draw them all.
  // function drawMobileCircles() {
  //   for (var index = 0; index < self.allMobileCircles.length; index++) {
  //     var circle = self.allMobileCircles[index];
  //     circle.draw();
  //   }
  // }

  // // When the Draw Character button is clicked, change the drawing setting to mobile.
  // $('.characterDraw').click(function() {
  //   drawing = {
  //     mobile: true,
  //     static: false,
  //     background: false
  //   };
  //   $('.option').removeClass('active');
  //   $(this).addClass('active');
  // });

  // // When the Draw Obstacles button is clicked, change the drawing setting to static.
  // $('.objectDraw').click(function() {
  //   drawing = {
  //     mobile: false,
  //     static: true,
  //     background: false
  //   }
  //   $('.option').removeClass('active');
  //   $(this).addClass('active');
  // });

  // // When the Draw Background button is clicked, change the drawing setting to background.
  // $('.backgroundDraw').click(function() {
  //   drawing = {
  //     mobile: false,
  //     static: false,
  //     background: true
  //   }
  //   $('.option').removeClass('active');
  //   $(this).addClass('active');
  // });

  // When the user clicks the undo button, remove the last element from the object array and push it to the undo array, based on current drawing type. Then redraw canvas.
  $('#undoBackground').click(function() {
    // if (drawing.mobile && self.allMobileCircles.length > 0) {
    //   var lastObj = self.allMobileCircles.pop();
    //   undoCharacterArray.push(lastObj);
    // } else if (drawing.static && self.allObstacleSquares.length > 0) {
    //   var lastObj = self.allObstacleSquares.pop();
    //   undoObstacleArray.push(lastObj);
    // } else if (drawing.background && self.allBackgroundSquares.length > 0) {
    //   var lastObj = self.allBackgroundSquares.pop();
    //   undoBackgroundArray.push(lastObj);
    // }
    if (!$scope.editor.drawingCollision && self.allBackgroundSquares.length > 0) {
      var lastObj = self.allBackgroundSquares.pop();
      undoBackgroundArray.push(lastObj);
    } else if ($scope.editor.drawingCollision && self.allCollisionSquares.length > 0) {
      var lastObj = self.allCollisionSquares.pop();
      undoCollisionArray.push(lastObj);
    }
    self.draw.clearRect(0, 0, self.myCanvas.width, self.myCanvas.height);
    drawBackgroundSquares();
    drawCollisionSquares();
    // drawObstacleSquares();
    // drawMobileCircles();
  });

  // When the user clicks the redo button, remove the last element from the undo array and push it to the object array, based on current drawing type. Then redraw canvas.
  $('#redoBackground').click(function() {
    // if (drawing.mobile && undoCharacterArray.length > 0) {
    //   var lastObj = undoCharacterArray.pop();
    //   self.allMobileCircles.push(lastObj);
    // } else if (drawing.static && undoObstacleArray.length > 0) {
    //   var lastObj = undoObstacleArray.pop();
    //   self.allObstacleSquares.push(lastObj);
    // } else if (drawing.background && undoBackgroundArray.length > 0) {
    //   var lastObj = undoBackgroundArray.pop();
    //   self.allBackgroundSquares.push(lastObj);
    // }
    if (!$scope.editor.drawingCollision && undoBackgroundArray.length > 0) {
      var lastObj = undoBackgroundArray.pop();
      self.allBackgroundSquares.push(lastObj);
    } else if ($scope.editor.drawingCollision && undoCollisionArray.length > 0) {
      var lastObj = undoCollisionArray.pop();
      self.allCollisionSquares.push(lastObj);
    }
    self.draw.clearRect(0, 0, self.myCanvas.width, self.myCanvas.height);
    drawBackgroundSquares();
    drawCollisionSquares();
    // drawObstacleSquares();
    // drawMobileCircles();
  });

  // When the Clear Canvas button is clicked, make the current Background and current Scene empty objects and reload the view.
  // Note: may need extra testing here.
  $('#clearBackground').click(function() {
    canvasWidth = self.myCanvas.width;
    canvasHeight = self.myCanvas.height;
    // self.allObstacleSquares = [];
    // self.allMobileCircles = [];
    self.draw.clearRect(0, 0, canvasWidth, canvasHeight);
    self.allBackgroundSquares = [];
    self.allCollisionSquares = [];
    var undoBackgroundArray = [];
    var undoCollisionArray = [];
    // var undoObstacleArray = [];
    // var undoCharacterArray = [];
    // Scenes.selectScene({})
    // Backgrounds.selectBackground({});
    // $state.reload();
  });

  // // When the Save Scene button is clicked:
  // // 1) Clear the canvas and redraw only the Obstacles and Character. (ensures thumbnail is scene ONLY)
  // // 2) Create and store a new scene object and make it the current Scene.
  // // 3) Clear the canvas again and this time redraw Background, Obstacles, and Character.
  // $('.saveScene').click(function() {
  //   self.draw.clearRect(0, 0, self.myCanvas.width, self.myCanvas.height);
  //   drawObstacleSquares();
  //   drawMobileCircles();
  //   var newScene = Scenes.create({
  //     name: self.sceneName,
  //     staticArr: self.allObstacleSquares,
  //     mobileArr: self.allMobileCircles,
  //     thumbnail: self.myCanvas.toDataURL()
  //   });
  //   Scenes.selectScene(newScene);
  //   self.draw.clearRect(0, 0, self.myCanvas.width, self.myCanvas.height);
  //   drawBackgroundSquares();
  //   drawObstacleSquares();
  //   drawMobileCircles();
  // });

  // // When the Publish Scene button is clicked, post it to the database.
  // $('.publishScene').click(function() {
  //   // Trying to decide whether to save AND publish or just publish...
  //   self.draw.clearRect(0, 0, self.myCanvas.width, self.myCanvas.height);
  //   drawObstacleSquares();
  //   drawMobileCircles();
  //   var newScene = Scenes.create({
  //     name: self.sceneName,
  //     staticArr: self.allObstacleSquares,
  //     mobileArr: self.allMobileCircles,
  //     thumbnail: self.myCanvas.toDataURL()
  //   });
  //   Scenes.selectScene(newScene);
  //   self.draw.clearRect(0, 0, self.myCanvas.width, self.myCanvas.height);
  //   drawBackgroundSquares();
  //   drawObstacleSquares();
  //   drawMobileCircles();
  //   Scenes.publishScene(newScene);
  // });

  // When the Save Background button is clicked:
  // 1) Clear the canvas and redraw only the Background. (ensures thumbnail is background ONLY)
  // 2) Create and store a new background object and make it the current Background.
  // 3) Finally, draw the Obstacles and Character.
  $('#saveBackground').click(function() {
    EditorService.saveBackground(self.allBackgroundSquares, self.allCollisionSquares, $scope.editor.currentBackground, self.myCanvas.toDataURL()).done(function(background) {
      console.log(background);
    });
    // self.draw.clearRect(0, 0, self.myCanvas.width, self.myCanvas.height);
    // drawBackgroundSquares();
    // var newBackground = Backgrounds.create({
    //   name: self.backgroundName,
    //   staticArr: self.allBackgroundSquares,
    //   thumbnail: self.myCanvas.toDataURL()
    // });
    // Backgrounds.selectBackground(newBackground);
    // drawObstacleSquares();
    // drawMobileCircles();
  });

  // // When the Publish Background button is clicked, post it to the database.
  // $('.publishBackground').click(function() {
  //   // Trying to decide whether to save AND publish or just publish...
  //   self.draw.clearRect(0, 0, self.myCanvas.width, self.myCanvas.height);
  //   drawBackgroundSquares();
  //   var newBackground = Backgrounds.create({
  //     name: self.backgroundName,
  //     staticArr: self.allBackgroundSquares,
  //     thumbnail: self.myCanvas.toDataURL()
  //   });
  //   Backgrounds.selectBackground(newBackground);
  //   drawObstacleSquares();
  //   drawMobileCircles();
  //   Backgrounds.publishBackground(newBackground);
  // });

  // When a key is pressed, run the handleKeyDown function.
  // $(document).on('keydown', handleKeyDown);

  // When the mouse is pressed, released, moved, or leaves the canvas, run the corresponding function.
  $(self.myCanvas).on('mousedown', mouseDown);
  $(self.myCanvas).on('mouseup', mouseUp);
  $(self.myCanvas).on('mouseleave', mouseUp);
  $(self.myCanvas).on('mousemove', function(event) {
    newMouseX = Math.round((event.clientX - $scope.editor.currentPixelSize / 2) / $scope.editor.currentPixelSize) * $scope.editor.currentPixelSize;
    newMouseY = Math.round((event.clientY - $scope.editor.currentPixelSize / 2) / $scope.editor.currentPixelSize) * $scope.editor.currentPixelSize;
    if (newMouseX !== mouseX || newMouseY !== mouseY) {
      mouseX = newMouseX;
      mouseY = newMouseY;
      moveType = 'mouse';
      mouseMoveEvent = event;
      moved = true;
    }
  });

  // // Construct initial full background objects (including methods) from the retrieved partial objects.
  // // Idea - offload object methods to prototype? Possibly make this step unnecessary?
  // function constructBackgroundSquares() {
  //   var oldBackgroundSquares = self.allBackgroundSquares;
  //   var newBackgroundSquares = [];
  //   oldBackgroundSquares.forEach(function(square) {
  //     var newBackgroundSquare = new Square(square.x, square.y, square.width, square.height, square.color);
  //     newBackgroundSquares.push(newBackgroundSquare);
  //   });
  //   self.allBackgroundSquares = newBackgroundSquares;
  // }
  // // Construct mobile objects just like background objects.
  // function constructCircles() {
  //   var oldCircles = self.allMobileCircles;
  //   var newCircles = [];
  //   oldCircles.forEach(function(circle) {
  //     var newCircle = new Circle(circle.x, circle.y, circle.radius, circle.color);
  //     newCircles.push(newCircle);
  //   });
  //   self.allMobileCircles = newCircles;
  // }
  // // Construct static objects just like background and mobile objects.
  // function constructSquares() {
  //   var oldSquares = self.allObstacleSquares;
  //   var newSquares = [];
  //   oldSquares.forEach(function(square) {
  //     var newSquare = new Square(square.x, square.y, square.width, square.height, square.color);
  //     newSquares.push(newSquare);
  //   });
  //   self.allObstacleSquares = newSquares;
  // }

  // Call all object constructing functions.
  // constructBackgroundSquares();
  // constructCircles();
  // constructSquares();
  // Draw all the objects now that they have been made.
  // drawBackgroundSquares();
  // drawMobileCircles();
  // drawObstacleSquares();

  // Experimental touch screen support
  // When the mouse is pressed, released, moved, or leaves the canvas, run the corresponding function.
  $(self.myCanvas).on('touchstart', mouseDown);
  $(self.myCanvas).on('touchend', mouseUp);
  $(self.myCanvas).on('touchcancel', mouseUp);
  $(self.myCanvas).on('touchmove', function(event) {
    moveType = 'touch';
    event.preventDefault();
    touchMoveEvent = event.touches[0];
    moved = true;
  });
});
;angular.module('questCreator').controller('chatCtrl', function(socket, $state) {
  $('form').submit(function(){
    console.log("Submitted!");
    socket.emit('chat message', $('#m').val());
    $('#m').val('');
    return false;
  });
  socket.off('chat message');
  socket.on('chat message', function(msg){
    $('#messages').append($('<li>').text(msg));
  });
});
;angular.module('questCreator').controller('detailCtrl', function ($state, GameService, UserService) {

    this.playGame = function (name) {
        $state.go('main.game.play');
    };

    this.game = GameService.getGameDetail();

    this.sendCollabRequest = function (gameId) {
      console.log(gameId);
      var request = UserService.validateCollabRequest(gameId).done(function (response) {
        console.log(response);
        if (response.message){
          UserService.sendCollabRequest(gameId);
          alert('Your request has been sent.');
        } else if (response.requested && !response.accepted) {
          alert('You have already requested to be a collaborator on this game. Be patient.');
        } else if (!response.requested && !response.accepted) {
          alert('Okay...You have already requested to collaborate on this game and been turned down.  We will try again, but do not be annoying.');
          UserService.requestAgain(gameId);
        } else if (response.requested && response.accepted) {
          alert('You are already a collaborator.  Check your profile page to find and edit games for which you have been approved to collaborate.');
        } else {
          alert('There was a problem sending this collaboration request.  Please try again later.');
        }
      });
    };

    //This is for testing only
    this.players = [
      {
        name: 'billy badass',
        score: 72,
        timeToComplete: '00:45:06'
      }, {
        name: 'jaime presley',
        score: 28,
        timeToComplete: 'incomplete'
      }, {
        name: 'rob helms',
        score: 56,
        timeToComplete: '02:32:06'
      }, {
        name: 'mr. toups',
        score: 61,
        timeToComplete: '01:28:15'
      }, {
        name: 'nate',
        score: 36,
        timeToComplete: 'incomplete'
      }, {
        name: 'fitch',
        score: 73,
        timeToComplete: '03:45:04'
      }];
});
;angular.module('questCreator')
.controller('editorCtrl', function(
  $scope,
  $state,
  EditorService,
  UserService,
  PopupService,
  PaletteService
  ) {

  var self = this;

  this.dragCalls = 0;

  this.gameInfo = {};
  this.currentEditingGame = {
    name: UserService.getGameEdit(),
    description: '',
    info: this.gameInfo,
    tags: [],
    published: false
  };
  this.currentBackground = null;
  this.currentObject = null;
  this.currentEntity = null;
  this.currentScene = null;
  //NOTE probably can remove:
  // this.currentSceneImg = {};
  //NOTE probably can remove^
  this.currentLargeView = 'map';
  this.currentSmallView = 'object';
  this.availableBackgrounds = [];
  this.availableObjects = [];
  this.availableEntities = [];
  this.selectedAnimation = "walkLeft";

  this.currentColor = 'green';
  this.inputColor;
  this.currentPixelSize = 15;
  this.drawingCollision = false;
  this.erasing = false;
  this.selectingAssets = false;
  this.currentFrameIndex = 0;
  this.modeledFrameIndex = 0; // For some reason ng-model is being wacky the first click

  this.goToPalette = function (type) {
    self.selectingAssets = true;
    $scope.$broadcast('paletteInit', {type: type});
  };

  this.selectColor = function() {
      var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(self.inputColor);
      var rgb = result ? {
          r: parseInt(result[1], 16),
          g: parseInt(result[2], 16),
          b: parseInt(result[3], 16)
      } : null;
      self.currentColor = 'rgb(' + rgb.r + ', ' + rgb.g + ', ' + rgb.b + ')';
      console.log(self.currentColor);
      console.log(self.inputColor);  
  };

  if (this.currentEditingGame.name === null) {
    PopupService.close();
    PopupService.open('create-game', $scope);
  } else {
    PopupService.close();
    PopupService.open('edit-game', $scope);
  }

  this.createNewGame = function (name) {
      PopupService.close();
      EditorService.createGame(name).done(function(game) {
        // console.log(game);
        self.currentEditingGame = game;
        EditorService.getGameAssets(game.id).done(function(assets) {
          // console.log(assets);
          self.availableBackgrounds = assets.availableBackgrounds;
          self.availableObjects = assets.availableObstacles;
          self.availableEntities = assets.availableEntities;
          self.currentBackground = self.availableBackgrounds[0] || null;
          $scope.$apply();
        });
      });
      UserService.setGameEdit(name);
  };

  this.editGame = function () {
      PopupService.close();
      EditorService.getGame(self.currentEditingGame.name).done(function(game) {
        self.currentEditingGame = game;
        // console.log(self.currentEditingGame);
        EditorService.getGameAssets(game.id).done(function(assets) {
          // console.log(assets);
          self.availableBackgrounds = assets.availableBackgrounds;
          self.availableObjects = assets.availableObstacles;
          self.availableEntities = assets.availableEntities;
          $scope.$apply();
        });
      });
      $('.edit-game').hide();
  };

  this.saveGame = function() {
    EditorService.saveGame(self.currentEditingGame).done(function(savedGame) {
      console.log(savedGame);
    });
  };

  this.publishGame = function () {
    self.currentEditingGame.published = true;
    this.saveGame();
  };

  this.createBackground = function() {
    var name = "New Background";
    var game_id = self.currentEditingGame.id;
    EditorService.createBackground(name, game_id).done(function(background) {
      // console.log(background);
      self.availableBackgrounds.push(background);
      self.currentBackground = background;
      $scope.$apply();
    });
  };

  this.editBackground = function(background) {
    // console.log(background);
    self.currentBackground = background;
    $scope.$broadcast('redrawBackground', background.info.image, background.info.collisionMap);
  };

  this.createObject = function() {
    var name = "New Object";
    var game_id = self.currentEditingGame.id;
    EditorService.createObject(name, game_id).done(function(object) {
      // console.log(object);
      self.availableObjects.push(object);
      self.currentObject = object;
      self.currentSmallView = 'object';
      $scope.$apply();
    });
  };

  this.editObject = function(object) {
    // console.log(object);
    self.currentObject = object;
    self.currentSmallView = 'object';
    $scope.$broadcast('redrawObject', object.info.image, object.info.collisionMap);
  };

  this.createEntity = function() {
    var name = "New Entity";
    var game_id = self.currentEditingGame.id;
    EditorService.createEntity(name, game_id).done(function(entity) {
      console.log("ent", entity);
      self.availableEntities.push(entity);
      self.currentEntity = entity;
      self.currentSmallView = 'entity';
      $scope.$apply();
    });
  };

  this.editEntityFrame = function(entity) {
    self.currentFrameIndex = self.modeledFrameIndex || 0;
    self.currentEntity = entity;
    self.currentSmallView = 'entity';
    console.log("ent:", entity);
    console.log("frame index:", self.currentFrameIndex);
    console.log("selected frame:", entity.info.animate[self.selectedAnimation][self.currentFrameIndex]);
    $scope.$broadcast('redrawEntity', entity.info.animate[self.selectedAnimation][self.currentFrameIndex].image, entity.info.animate[self.selectedAnimation][self.currentFrameIndex].collisionMap);
  };

  this.setThumbnail = function(asset){
    if (asset === undefined) {
      return {"background": "none"};
    } else {
      return {
        "background": 'url("'+ asset.thumbnail +'")',
        "background-size": "contain",
        "background-position": "center",
        "background-repeat": "no-repeat"
      };      
    }
  }

  this.cancel = function () {
    PopupService.close();
    $state.go('main.profile');
  };

  this.selectText = function($event){
    $event.target.select();
  };

  //jquery UI Stuff
  this.uiDrag = function() {
    this.dragCalls++;
    console.log("you called this function needlessly " + this.dragCalls + " times, ya jerk!");
    $('.asset.available').draggable({
      helper: 'clone',
      start: function(event, ui) {
        $(ui.helper).addClass('grabbed');
      },
      stop: function(event, ui) {
        $(ui.helper).css({'transition': 'transform ease 100ms'}).removeClass('grabbed');
      }
    });
    $('#scene-BG').droppable({
      drop: function(event, ui) {
        log("ui: ", ui);
        log("event: ", event);
        var clone = $(ui.draggable).clone();
        clone.draggable();
        $(this).append(clone);
      }
    });
  };
});
;angular.module('questCreator').controller('entCtrl', function($state, $scope, EditorService) {
  var self = this;      // To help with scope issues
  var drawHandle = -1;  // Interval handle for drawing rate
  var moveHandle = -1;  // Interval handle for movement of mouse (possibly does not need to be global)
  var mouseX = 0;
  var mouseY = 0;
  var mouseMoveEvent;       // Global variable to track mouse movement events
  var touchMoveEvent;       // Global variable to track touch movement events
  var mobileWidth = 850;    // Width for mobile screen sizes
  var tabletWidth = 1100;   // Width for tablet screen sizes
  var tabletScale = 1.4;
  var mobileScaleX = 2.5;
  var mobileScaleY = 1.6;
  var moveType = '';    // Either mouse or touch
  var moved = false;    // Whether mouse has moved or not
  var moving = {        // Direction that the main character should be moving.
    left: false,
    right: false,
    up: false,
    down: false
  };
  var drawing = {       // Type of object being drawn. Default: background.
    // mobile: false,
    // static: false,
    background: true
  };
  var pixelWidth = $scope.editor.currentPixelSize;
  var pixelHeight = $scope.editor.currentPixelSize;
  var undoBackgroundArray = [];   //Array to keep track of background objects that were undone.
  var undoCollisionArray = [];
  // var undoObstacleArray = [];   //Array to keep track of obstacle objects that were undone.
  // var undoCharacterArray = [];   //Array to keep track of character objects that were undone.
  this.speedRange = 5;     // How fast mobile objects should move.
  // this.radiusRange = 5;  // Value of radius input in draw.html
  // this.widthRangeBackground = 50;   // Value of width input in draw.html
  // this.heightRangeBackground = 50;  // Value of height input in draw.html
  // this.widthRangeObstacle = 50;     // Value of width input in draw.html
  // this.heightRangeObstacle = 50;    // Value of height input in draw.html
  this.currentColor = $scope.editor.currentColor;    // Value of color input in draw.html
  // this.currentScene = Scenes.fetchCurrentScene() || {}; // Scene selected from scenes controller
  // this.currentBackground = Backgrounds.fetchCurrentBackground() || {};  // Background selected from scenes controller
  this.myCanvas = document.getElementById('ent-canvas');  // Canvas html element
  this.canvasPos = {    // Canvas top and left coordinates on page
    x: self.myCanvas.getBoundingClientRect().left,
    y: self.myCanvas.getBoundingClientRect().top
  };
  this.draw = this.myCanvas.getContext('2d'); // Canvas context
  // this.sceneName =  this.currentScene.name || '';       // Current selected Scene name
  // this.allMobileCircles = this.currentScene.mobileArr || [];  // Array of all mobile objects in current scene
  // this.allObstacleSquares = this.currentScene.staticArr || [];  // Array of all static objects in current scene
  // this.backgroundName = this.currentBackground.name || '';  // Current selected Background name
  // this.allBackgroundSquares = this.currentBackground.staticArr || []; // Array of all static objects in current background
  this.allCollisionSquares = [];
  this.allBackgroundSquares = [];

  /*
  *   Rectangle object constructor
  *   @params
  *     x: horizontal coord of top left corner
  *     y: vertical coord of top left corner
  *     width: width of rectangle
  *     height: height of rectangle
  *     color: color of rectangle
  *   @methods
  *     draw: draw the rectangle on the canvas using its position, size, and color.
  */
  function Square(x, y, width, height, color, type) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.color = color;
    this.type = type;
  }

  Square.prototype.draw = function() {
    self.draw.fillStyle = this.color;
    if (window.innerWidth <= mobileWidth) { // Mobile size
      self.draw.fillRect(this.x * mobileScaleX, this.y * mobileScaleY, this.width, this.height);
    } else if (window.innerWidth <= tabletWidth) { // Tablet size
      self.draw.fillRect(this.x * tabletScale, this.y / tabletScale, this.width, this.height);
    } else {  // Desktop size
      self.draw.fillRect(this.x, this.y, this.width, this.height);
    }
  };

  $scope.$on('redrawEntity', function(event, imageArr, collisionArray) {
    canvasWidth = self.myCanvas.width;
    canvasHeight = self.myCanvas.height;
    self.draw.clearRect(0, 0, canvasWidth, canvasHeight);
    self.allBackgroundSquares = [];
    self.allCollisionSquares = [];
    var undoBackgroundArray = [];
    var undoCollisionArray = [];
    self.allBackgroundSquares = imageArr;
    self.allCollisionSquares = collisionArray;
    drawBackgroundSquares();
    drawCollisionSquares();
  });

  // /*
  // *   Circle object constructor
  // *   @params
  // *     x: horizontal coord of center of circle
  // *     y: vertical coord of center of circle
  // *     radius: radius of circle
  // *     color: color of circle
  // *   @methods
  // *     draw: draw the circle on the canvas using its position, size, and color.
  // */
  // function Circle(x, y, radius, color) {
  //   this.x = x;
  //   this.y = y;
  //   this.radius = radius;
  //   this.color = color;
  //   this.draw = function() {
  //     self.draw.beginPath();
  //     self.draw.fillStyle = this.color;
  //     if (window.innerWidth <= mobileWidth) { // Mobile size
  //       self.draw.arc(this.x * mobileScaleX, this.y * mobileScaleY, this.radius, 0, 2 * Math.PI);
  //     } else if (window.innerWidth <= tabletWidth) { // Tablet size
  //       self.draw.arc(this.x * tabletScale, this.y / tabletScale, this.radius, 0, 2 * Math.PI);
  //     } else {
  //       self.draw.arc(this.x, this.y, this.radius, 0, 2 * Math.PI);
  //     }
  //     self.draw.fill();
  //     // Example for future reference: Can also draw using an image. Image should first be loaded on the page.
  //     // draw.drawImage(imgElem, this.x, this.y, this.radius, this.radius);
  //   }
  // }

  // Called when the mouse button is pressed.
  // Starts the interval to run every 100ms while the mouse button is still held down.
  // Only start the interval if it is not already running.
  function mouseDown(event) {
    if (drawHandle === -1) {
      drawHandle = setInterval(mousePressed, 100);
    }
  }

  // Called when the mouse button is released.
  // If the interval is running, then clear it and reset it.
  function mouseUp(event) {
    if (drawHandle !== -1) {
      clearInterval(drawHandle);
      drawHandle = -1;
    }
  }

  // Runs every 100ms after the mouse button is pressed until it is released.
  // Purpose is to draw the object that the user has chosen every 100ms AND if the mouse has moved from its previous location.
  function mousePressed() {
      self.canvasPos = {  // Get the most recent canvas position in case the window has been resized.
        x: self.myCanvas.getBoundingClientRect().left,
        y: self.myCanvas.getBoundingClientRect().top
      };
      // if (moved && drawing.mobile) { // Create, draw, and record a new mobile object
      //   var radius = parseInt(self.radiusRange);
      //   var color = self.currentColor;
      //   if (moveType === 'mouse') {
      //     var newCircle = new Circle(mouseMoveEvent.clientX - self.canvasPos.x, mouseMoveEvent.clientY - self.canvasPos.y, radius, color);
      //     newCircle.draw();
      //     self.allMobileCircles.push(newCircle);
      //   } else if (moveType === 'touch') {
      //     var newCircle = new Circle(touchMoveEvent.clientX - self.canvasPos.x, touchMoveEvent.clientY - self.canvasPos.y, radius, color);
      //     newCircle.draw();
      //     self.allMobileCircles.push(newCircle);
      //   }
      //   moved = false;
      // } else if (moved && drawing.static) {  // Create, draw, and record a new static object
      //   var width = parseInt(self.widthRangeObstacle);
      //   var height = parseInt(self.heightRangeObstacle);
      //   var color = self.currentColor;
      //   if (moveType === 'mouse') {
      //     var newSquare = new Square(mouseMoveEvent.clientX - width / 2 - self.canvasPos.x, mouseMoveEvent.clientY - height / 2 - self.canvasPos.y, width, height, color);
      //     newSquare.draw();
      //     self.allObstacleSquares.push(newSquare);
      //   } else if (moveType === 'touch') {
      //     var newSquare = new Square(touchMoveEvent.clientX - width / 2 - self.canvasPos.x, touchMoveEvent.clientY - height / 2 - self.canvasPos.y, width, height, color);
      //     newSquare.draw();
      //     self.allObstacleSquares.push(newSquare);
      //   }
      //   moved = false;
      // } else if (moved && drawing.background) { // Create, draw, and record a new background object
      //   var width = parseInt(self.widthRangeBackground);
      //   var height = parseInt(self.heightRangeBackground);
      //   var color = self.currentColor;
      //   if (moveType === 'mouse') {
      //     var newSquare = new Square(mouseMoveEvent.clientX - width / 2 - self.canvasPos.x, mouseMoveEvent.clientY - height / 2 - self.canvasPos.y, width, height, color);
      //     newSquare.draw();
      //     self.allBackgroundSquares.push(newSquare);
      //   } else if (moveType === 'touch') {
      //     var newSquare = new Square(touchMoveEvent.clientX - width / 2 - self.canvasPos.x, touchMoveEvent.clientY - height / 2 - self.canvasPos.y, width, height, color);
      //     newSquare.draw();
      //     self.allBackgroundSquares.push(newSquare);
      //   }
      //   moved = false;
      // }
    if ($scope.editor.erasing) {
      var newSquareX = mouseX - self.canvasPos.x;
      var newSquareY = mouseY - self.canvasPos.y;
      if (!$scope.editor.drawingCollision) {
        var toRemove = [];
        self.allBackgroundSquares.forEach(function(square) {
          if ( Math.abs(square.x - newSquareX) < 10 && Math.abs(square.y - newSquareY) < 10 ) {
            toRemove.push(self.allBackgroundSquares.indexOf(square));
          }
        });
        toRemove.forEach(function(index) {
          self.allBackgroundSquares.splice(index, 1);
        });
      } else if ($scope.editor.drawingCollision) {
        var toRemove = [];
        self.allCollisionSquares.forEach(function(square) {
          if ( Math.abs(square.x - newSquareX) < 10 && Math.abs(square.y - newSquareY) < 10 ) {
            toRemove.push(self.allBackgroundSquares.indexOf(square));
          }
        });
        toRemove.forEach(function(index) {
          self.allCollisionSquares.splice(index, 1);
        });
      }
      self.draw.clearRect(0, 0, self.myCanvas.width, self.myCanvas.height);
      drawBackgroundSquares();
      drawCollisionSquares();
    }
    if (moved && drawing.background && !$scope.editor.erasing) { // Create, draw, and record a new background object
      var width = $scope.editor.currentPixelSize;
      var height = $scope.editor.currentPixelSize;
      var color = $scope.editor.drawingCollision ? 'rgba(100, 100, 100, 0.5)' : $scope.editor.currentColor;
      if (moveType === 'mouse') {
        var newSquareX = mouseX - self.canvasPos.x;
        var newSquareY = mouseY - self.canvasPos.y;
        var exists = false;
        if ($scope.editor.drawingCollision) {
          self.allCollisionSquares.forEach(function(square) {
            if (square.x === newSquareX && square.y === newSquareY) {
              exists = true;
            }
          });
        } else if (!$scope.editor.drawingCollision) {
          self.allBackgroundSquares.forEach(function(square) {
            if (square.x === newSquareX && square.y === newSquareY) {
              exists = true;
            }
          });
        }
        if (!exists) {
          var type = $scope.editor.drawingCollision ? 'collision' : 'normal';
          var newSquare = new Square(mouseX - self.canvasPos.x, mouseY - self.canvasPos.y, width, height, color, type);
          newSquare.draw();
          if ($scope.editor.drawingCollision) {
            self.allCollisionSquares.push(newSquare);
          } else {
            self.allBackgroundSquares.push(newSquare);
          }
        }
      } else if (moveType === 'touch') {
        var type = $scope.editor.drawingCollision ? 'collision' : 'normal';
        var newSquare = new Square(touchMoveEvent.clientX - width / 2 - self.canvasPos.x, touchMoveEvent.clientY - height / 2 - self.canvasPos.y, width, height, color, type);
        newSquare.draw();
        if ($scope.editor.drawingCollision) {
          self.allCollisionSquares.push(newSquare);
        } else {
          self.allBackgroundSquares.push(newSquare);
        }
      }
      moved = false;
    }
  }

  // // Check for collisions between all of the mobile objects and all of the obstacle objects.
  // // The collision is categorized according to which direction the obstacle is found.
  // function findCollisions() {
  //   var foundCollision = {  // By default, there is no collision found in any direction.
  //     left: false,
  //     right: false,
  //     up: false,
  //     down: false
  //   };
  //   self.allMobileCircles.forEach(function(circle) {  // Loop through all the mobile objects
  //     self.allObstacleSquares.forEach(function(square) {  // Loop through all the obstacle objects
  //       // Pattern: check the left, right, top, and bottom edges of the current mobile object against the right, left, bottom, and top edges of the current obstacle (in those exact orders).
  //       if (circle.x - circle.radius <= square.x + square.width && circle.x - circle.radius >= square.x && circle.y >= square.y && circle.y <= square.y + square.height) {
  //         foundCollision.left = true;
  //         moving.left = false;
  //       }
  //       if (circle.x + circle.radius <= square.x + square.width && circle.x + circle.radius >= square.x && circle.y >= square.y && circle.y <= square.y + square.height) {
  //         foundCollision.right = true;
  //         moving.right = false;
  //       }
  //       if (circle.x <= square.x + square.width && circle.x >= square.x && circle.y - circle.radius >= square.y && circle.y - circle.radius <= square.y + square.height) {
  //         foundCollision.up = true;
  //         moving.up = false;
  //       }
  //       if (circle.x <= square.x + square.width && circle.x >= square.x && circle.y + circle.radius >= square.y && circle.y + circle.radius <= square.y + square.height) {
  //         foundCollision.down = true;
  //         moving.down = false;
  //       }
  //     });
  //     // Check for collisions with the canvas border as well. Take resizing screen sizes into account.
  //     var canvasEdgeRight;
  //     var canvasEdgeBottom;
  //     if (window.innerWidth <= mobileWidth) {
  //       canvasEdgeRight = self.myCanvas.width / mobileScaleX;
  //       canvasEdgeBottom = self.myCanvas.height / mobileScaleY;
  //     } else if (window.innerWidth <= tabletWidth) {
  //       canvasEdgeRight = self.myCanvas.width / tabletScale;
  //       canvasEdgeBottom = self.myCanvas.height * tabletScale;
  //     } else {
  //       canvasEdgeRight = self.myCanvas.width;
  //       canvasEdgeBottom = self.myCanvas.height;
  //     }
  //     if (circle.x <= 0) {
  //       foundCollision.left = true;
  //       moving.left = false;
  //     }
  //     if (circle.x >= canvasEdgeRight) {
  //       foundCollision.right = true;
  //       moving.right = false;
  //     }
  //     if (circle.y <= 0) {
  //       foundCollision.up = true;
  //       moving.up = false;
  //     }
  //     if (circle.y >= canvasEdgeBottom) {
  //       foundCollision.down = true;
  //       moving.down = false;
  //     }
  //   });
  //   return foundCollision;
  // }

  // // Called when any key is pressed.
  // function handleKeyDown(event) {
  //   // If the user presses the left, right, up, or down arrow keys, toggle the movement direction accordingly
  //   if (event.keyCode === 37) { // Left Key
  //     event.preventDefault();
  //     moving = {
  //       left: !moving.left,
  //       up: false,
  //       right: false,
  //       down: false
  //     };
  //   } else if (event.keyCode === 38) { // Up Key
  //     event.preventDefault();
  //     moving = {
  //       left: false,
  //       up: !moving.up,
  //       right: false,
  //       down: false
  //     };
  //   } else if (event.keyCode === 39) { // Right Key
  //     event.preventDefault();
  //     moving = {
  //       left: false,
  //       up: false,
  //       right: !moving.right,
  //       down: false
  //     };
  //   } else if (event.keyCode === 40) { // Down Key
  //     event.preventDefault();
  //     moving = {
  //       left: false,
  //       up: false,
  //       right: false,
  //       down: !moving.down
  //     };
  //   } else {    // For all other keys, stop all movement.
  //     moving = {
  //       left: false,
  //       up: false,
  //       right: false,
  //       down: false
  //     }
  //   }
  //   // If any of the arrow keys have been pressed, run the moveMobileCircles function every 20ms.
  //   // Otherwise, stop running the moveMobileCircles function.
  //   if ( moving.left || moving.up || moving.right || moving.down ) {
  //     clearInterval(moveHandle);
  //     moveHandle = setInterval(moveMobileCircles, 20);
  //   } else {
  //     clearInterval(moveHandle);
  //   }
  // }

  // // Runs every 20ms after an arrow key has been pressed.
  // function moveMobileCircles() {
  //   // Depending on movement direction and collision detection, do the following:
  //   // 1) Clear the canvas.
  //   // 2) Redraw background and obstacle objects.
  //   // 3) Shift the circles in the corresponding direction.
  //   // 4) Redraw the circles.
  //   // Note: Checking collision detection and checking movement direction may be redundant.
  //   if (moving.left && !findCollisions().left) {
  //     self.draw.clearRect(0, 0, self.myCanvas.width, self.myCanvas.height);
  //     drawBackgroundSquares();
  //     drawObstacleSquares();
  //     self.allMobileCircles.forEach(function(circle) {
  //       circle.x -= parseInt(self.speedRange);
  //       circle.draw();
  //     });
  //   } else if (moving.right && !findCollisions().right) {
  //     self.draw.clearRect(0, 0, self.myCanvas.width, self.myCanvas.height);
  //     drawBackgroundSquares();
  //     drawObstacleSquares();
  //     self.allMobileCircles.forEach(function(circle) {
  //       circle.x += parseInt(self.speedRange);
  //       circle.draw();
  //     });
  //   } else if (moving.up && !findCollisions().up) {
  //     self.draw.clearRect(0, 0, self.myCanvas.width, self.myCanvas.height);
  //     drawBackgroundSquares();
  //     drawObstacleSquares();
  //     self.allMobileCircles.forEach(function(circle) {
  //       circle.y -= parseInt(self.speedRange);
  //       circle.draw();
  //     });
  //   } else if (moving.down && !findCollisions().down) {
  //     self.draw.clearRect(0, 0, self.myCanvas.width, self.myCanvas.height);
  //     drawBackgroundSquares();
  //     drawObstacleSquares();
  //     self.allMobileCircles.forEach(function(circle) {
  //       circle.y += parseInt(self.speedRange);
  //       circle.draw();
  //     });
  //   }
  // }

  // Loop through the array of background objects and draw them all.
  function drawBackgroundSquares() {
    for (var index = 0; index < self.allBackgroundSquares.length; index++) {
      var square = self.allBackgroundSquares[index];
      self.draw.fillStyle = square.color;
      self.draw.fillRect(square.x, square.y, square.width, square.height);
    }
  }
  function drawCollisionSquares() {
    for (var index = 0; index < self.allCollisionSquares.length; index++) {
      var square = self.allCollisionSquares[index];
      self.draw.fillStyle = square.color;
      self.draw.fillRect(square.x, square.y, square.width, square.height);
    }
  }

  // // Loop through the array of obstacle objects and draw them all.
  // function drawObstacleSquares() {
  //   for (var index = 0; index < self.allObstacleSquares.length; index++) {
  //     var square = self.allObstacleSquares[index];
  //     square.draw();
  //   }
  // }

  // // Loop through the array of mobile objects and draw them all.
  // function drawMobileCircles() {
  //   for (var index = 0; index < self.allMobileCircles.length; index++) {
  //     var circle = self.allMobileCircles[index];
  //     circle.draw();
  //   }
  // }

  // // When the Draw Character button is clicked, change the drawing setting to mobile.
  // $('.characterDraw').click(function() {
  //   drawing = {
  //     mobile: true,
  //     static: false,
  //     background: false
  //   };
  //   $('.option').removeClass('active');
  //   $(this).addClass('active');
  // });

  // // When the Draw Obstacles button is clicked, change the drawing setting to static.
  // $('.objectDraw').click(function() {
  //   drawing = {
  //     mobile: false,
  //     static: true,
  //     background: false
  //   }
  //   $('.option').removeClass('active');
  //   $(this).addClass('active');
  // });

  // // When the Draw Background button is clicked, change the drawing setting to background.
  // $('.backgroundDraw').click(function() {
  //   drawing = {
  //     mobile: false,
  //     static: false,
  //     background: true
  //   }
  //   $('.option').removeClass('active');
  //   $(this).addClass('active');
  // });

  // When the user clicks the undo button, remove the last element from the object array and push it to the undo array, based on current drawing type. Then redraw canvas.
  $('#undoEntity').click(function() {
    // if (drawing.mobile && self.allMobileCircles.length > 0) {
    //   var lastObj = self.allMobileCircles.pop();
    //   undoCharacterArray.push(lastObj);
    // } else if (drawing.static && self.allObstacleSquares.length > 0) {
    //   var lastObj = self.allObstacleSquares.pop();
    //   undoObstacleArray.push(lastObj);
    // } else if (drawing.background && self.allBackgroundSquares.length > 0) {
    //   var lastObj = self.allBackgroundSquares.pop();
    //   undoBackgroundArray.push(lastObj);
    // }
    if (!$scope.editor.drawingCollision && self.allBackgroundSquares.length > 0) {
      var lastObj = self.allBackgroundSquares.pop();
      undoBackgroundArray.push(lastObj);
    } else if ($scope.editor.drawingCollision && self.allCollisionSquares.length > 0) {
      var lastObj = self.allCollisionSquares.pop();
      undoCollisionArray.push(lastObj);
    }
    self.draw.clearRect(0, 0, self.myCanvas.width, self.myCanvas.height);
    drawBackgroundSquares();
    drawCollisionSquares();
    // drawObstacleSquares();
    // drawMobileCircles();
  });

  // When the user clicks the redo button, remove the last element from the undo array and push it to the object array, based on current drawing type. Then redraw canvas.
  $('#redoEntity').click(function() {
    // if (drawing.mobile && undoCharacterArray.length > 0) {
    //   var lastObj = undoCharacterArray.pop();
    //   self.allMobileCircles.push(lastObj);
    // } else if (drawing.static && undoObstacleArray.length > 0) {
    //   var lastObj = undoObstacleArray.pop();
    //   self.allObstacleSquares.push(lastObj);
    // } else if (drawing.background && undoBackgroundArray.length > 0) {
    //   var lastObj = undoBackgroundArray.pop();
    //   self.allBackgroundSquares.push(lastObj);
    // }
    if (!$scope.editor.drawingCollision && undoBackgroundArray.length > 0) {
      var lastObj = undoBackgroundArray.pop();
      self.allBackgroundSquares.push(lastObj);
    } else if ($scope.editor.drawingCollision && undoCollisionArray.length > 0) {
      var lastObj = undoCollisionArray.pop();
      self.allCollisionSquares.push(lastObj);
    }
    self.draw.clearRect(0, 0, self.myCanvas.width, self.myCanvas.height);
    drawBackgroundSquares();
    drawCollisionSquares();
    // drawObstacleSquares();
    // drawMobileCircles();
  });

  // When the Clear Canvas button is clicked, make the current Background and current Scene empty objects and reload the view.
  // Note: may need extra testing here.
  $('#clearEntity').click(function() {
    canvasWidth = self.myCanvas.width;
    canvasHeight = self.myCanvas.height;
    // self.allObstacleSquares = [];
    // self.allMobileCircles = [];
    self.draw.clearRect(0, 0, canvasWidth, canvasHeight);
    self.allBackgroundSquares = [];
    self.allCollisionSquares = [];
    var undoBackgroundArray = [];
    var undoCollisionArray = [];
    // var undoObstacleArray = [];
    // var undoCharacterArray = [];
    // Scenes.selectScene({})
    // Backgrounds.selectBackground({});
    // $state.reload();
  });

  // // When the Save Scene button is clicked:
  // // 1) Clear the canvas and redraw only the Obstacles and Character. (ensures thumbnail is scene ONLY)
  // // 2) Create and store a new scene object and make it the current Scene.
  // // 3) Clear the canvas again and this time redraw Background, Obstacles, and Character.
  // $('.saveScene').click(function() {
  //   self.draw.clearRect(0, 0, self.myCanvas.width, self.myCanvas.height);
  //   drawObstacleSquares();
  //   drawMobileCircles();
  //   var newScene = Scenes.create({
  //     name: self.sceneName,
  //     staticArr: self.allObstacleSquares,
  //     mobileArr: self.allMobileCircles,
  //     thumbnail: self.myCanvas.toDataURL()
  //   });
  //   Scenes.selectScene(newScene);
  //   self.draw.clearRect(0, 0, self.myCanvas.width, self.myCanvas.height);
  //   drawBackgroundSquares();
  //   drawObstacleSquares();
  //   drawMobileCircles();
  // });

  // // When the Publish Scene button is clicked, post it to the database.
  // $('.publishScene').click(function() {
  //   // Trying to decide whether to save AND publish or just publish...
  //   self.draw.clearRect(0, 0, self.myCanvas.width, self.myCanvas.height);
  //   drawObstacleSquares();
  //   drawMobileCircles();
  //   var newScene = Scenes.create({
  //     name: self.sceneName,
  //     staticArr: self.allObstacleSquares,
  //     mobileArr: self.allMobileCircles,
  //     thumbnail: self.myCanvas.toDataURL()
  //   });
  //   Scenes.selectScene(newScene);
  //   self.draw.clearRect(0, 0, self.myCanvas.width, self.myCanvas.height);
  //   drawBackgroundSquares();
  //   drawObstacleSquares();
  //   drawMobileCircles();
  //   Scenes.publishScene(newScene);
  // });

  // When the Save Background button is clicked:
  // 1) Clear the canvas and redraw only the Background. (ensures thumbnail is background ONLY)
  // 2) Create and store a new background object and make it the current Background.
  // 3) Finally, draw the Obstacles and Character.
  $('#saveEntity').click(function() {
    EditorService.saveEntity(self.allBackgroundSquares, self.allCollisionSquares, $scope.editor.currentEntity, $scope.editor.selectedAnimation, $scope.editor.currentFrameIndex, self.myCanvas.toDataURL()).done(function(entity) {
      console.log("After save:", entity);
    });
    // self.draw.clearRect(0, 0, self.myCanvas.width, self.myCanvas.height);
    // drawBackgroundSquares();
    // var newBackground = Backgrounds.create({
    //   name: self.backgroundName,
    //   staticArr: self.allBackgroundSquares,
    //   thumbnail: self.myCanvas.toDataURL()
    // });
    // Backgrounds.selectBackground(newBackground);
    // drawObstacleSquares();
    // drawMobileCircles();
  });

  // Copy and Paste buttons
  $('#copyEntity').click(function() {
    EditorService.copy(self.allBackgroundSquares, self.allCollisionSquares);
  });


  $('#pasteEntity').click(function() {
    if (!$scope.editor.drawingCollision) {
      var copiedImage = EditorService.paste('image');
      self.allBackgroundSquares.push.apply(self.allBackgroundSquares, copiedImage);
    } else if ($scope.editor.drawingCollision) {
      var copiedCollisionMap = EditorService.paste('collision');
      self.allCollisionSquares.push.apply(self.allCollisionSquares, copiedCollisionMap);
    }
    self.draw.clearRect(0, 0, self.myCanvas.width, self.myCanvas.height);
    drawBackgroundSquares();
    drawCollisionSquares();
  });

  // // When the Publish Background button is clicked, post it to the database.
  // $('.publishBackground').click(function() {
  //   // Trying to decide whether to save AND publish or just publish...
  //   self.draw.clearRect(0, 0, self.myCanvas.width, self.myCanvas.height);
  //   drawBackgroundSquares();
  //   var newBackground = Backgrounds.create({
  //     name: self.backgroundName,
  //     staticArr: self.allBackgroundSquares,
  //     thumbnail: self.myCanvas.toDataURL()
  //   });
  //   Backgrounds.selectBackground(newBackground);
  //   drawObstacleSquares();
  //   drawMobileCircles();
  //   Backgrounds.publishBackground(newBackground);
  // });

  // When a key is pressed, run the handleKeyDown function.
  // $(document).on('keydown', handleKeyDown);

  // When the mouse is pressed, released, moved, or leaves the canvas, run the corresponding function.
  $(self.myCanvas).on('mousedown', mouseDown);
  $(self.myCanvas).on('mouseup', mouseUp);
  $(self.myCanvas).on('mouseleave', mouseUp);
  $(self.myCanvas).on('mousemove', function(event) {
    newMouseX = Math.round((event.clientX - $scope.editor.currentPixelSize / 2) / $scope.editor.currentPixelSize) * $scope.editor.currentPixelSize;
    newMouseY = Math.round((event.clientY - $scope.editor.currentPixelSize / 2) / $scope.editor.currentPixelSize) * $scope.editor.currentPixelSize;
    if (newMouseX !== mouseX || newMouseY !== mouseY) {
      mouseX = newMouseX;
      mouseY = newMouseY;
      moveType = 'mouse';
      mouseMoveEvent = event;
      moved = true;
    }
  });

  // // Construct initial full background objects (including methods) from the retrieved partial objects.
  // // Idea - offload object methods to prototype? Possibly make this step unnecessary?
  // function constructBackgroundSquares() {
  //   var oldBackgroundSquares = self.allBackgroundSquares;
  //   var newBackgroundSquares = [];
  //   oldBackgroundSquares.forEach(function(square) {
  //     var newBackgroundSquare = new Square(square.x, square.y, square.width, square.height, square.color);
  //     newBackgroundSquares.push(newBackgroundSquare);
  //   });
  //   self.allBackgroundSquares = newBackgroundSquares;
  // }
  // // Construct mobile objects just like background objects.
  // function constructCircles() {
  //   var oldCircles = self.allMobileCircles;
  //   var newCircles = [];
  //   oldCircles.forEach(function(circle) {
  //     var newCircle = new Circle(circle.x, circle.y, circle.radius, circle.color);
  //     newCircles.push(newCircle);
  //   });
  //   self.allMobileCircles = newCircles;
  // }
  // // Construct static objects just like background and mobile objects.
  // function constructSquares() {
  //   var oldSquares = self.allObstacleSquares;
  //   var newSquares = [];
  //   oldSquares.forEach(function(square) {
  //     var newSquare = new Square(square.x, square.y, square.width, square.height, square.color);
  //     newSquares.push(newSquare);
  //   });
  //   self.allObstacleSquares = newSquares;
  // }

  // Call all object constructing functions.
  // constructBackgroundSquares();
  // constructCircles();
  // constructSquares();
  // Draw all the objects now that they have been made.
  // drawBackgroundSquares();
  // drawMobileCircles();
  // drawObstacleSquares();

  // Experimental touch screen support
  // When the mouse is pressed, released, moved, or leaves the canvas, run the corresponding function.
  $(self.myCanvas).on('touchstart', mouseDown);
  $(self.myCanvas).on('touchend', mouseUp);
  $(self.myCanvas).on('touchcancel', mouseUp);
  $(self.myCanvas).on('touchmove', function(event) {
    moveType = 'touch';
    event.preventDefault();
    touchMoveEvent = event.touches[0];
    moved = true;
  });
});
;angular.module('questCreator').controller('gameCtrl', function(socket, $state, $scope) {
});
;angular.module('questCreator').controller('landingCtrl', function($state, $scope, UserService, GameService) {

    this.searching = false;

    var self = this;

    this.allGames = GameService.getGames().done(function(response) {
        $scope.$apply();
    });

    $scope.createGame = function() {
        var user = UserService.get();
        if (user.id) {
            user.editGame = null;
            UserService.set(user);
            $state.go('main.game.editor.views');
        } else {
            alert('Please Sign In or Register.');
            $scope.signIn();
        }
    };

    $scope.goToGameDetail = function(game) {
        GameService.setGameDetail(game);
        $state.go('main.game.detail');
    };

    this.searchGames = function (keyword) {
        this.searching = true;
        this.allGames = GameService.searchGames(keyword).done(function (response) {
          $scope.$apply();
        });
    };

    this.showAll = function () {
        this.searching = false;
        this.allGames = GameService.getGames().done(function(response) {
            $scope.$apply();
        });
    };
});
;angular.module('questCreator')
    .controller('mainCtrl', function(socket, $state, UserService, PopupService, $scope) {

    //When the user clicks "Home" on the nav bar view is changed to landing
    this.goHome = function () {
        $state.go('main.landing');
    };

    //When the user clicks "Profile" on the nav bar user information is loaded and view is changed to profile
    this.goToUser = function () {
      if (UserService.get().id) {
        $state.go('main.profile');
      } else {
        alert ("You must login to see your profile page.");
        $scope.signIn();
      }
    };

    // When the user clicks the sign in button, prompt them to sign in to their google account.
    $scope.signIn = function() {
        UserService.signIn();
    };

    // When the user clicks the sign out button, sign them out of their google account
    this.signOut = function() {
        UserService.signOut();
        var user = {
                uid: null,
                token: null,
                username: null,
                picture: null,
                id: null,
                games: null,
                joined: null,
                editGame: null
        };
        UserService.set(user);
        $state.go('main.landing');
    };

    //New user can register a user name
    this.register = function (name) {
        UserService.register(name);
    };

    //If the user chooses not to register, they can cancel out of the process.
    this.cancel = function () {
        $('#user-popup').css('display', 'none');
        UserService.signOut();
    };

});
;angular.module('questCreator').controller('mapCtrl', function($state, $scope) {
  var self = this;

  this.width = 1;
  this.height = 1;

  // Scene pos should be [x,y,z], where x=mapIndex, y=rowIndex, z=columnIndex

  this.createMap = function() {
    var name = "new map";
    var sceneName = "new scene";
    console.log("Creating a map!", name);
    var newScene = {
      name: sceneName,
      background: null,
      objects: [],
      entities: []
    };
    var newMap = {
      name: name,
      scenes: [
        [newScene]
      ]
    };
    $scope.editor.currentEditingGame.info.maps.push(newMap);
  }

  this.createMapRow = function(mapObj) {
    var name = "new scene";
    var newScene = {
      name: name,
      background: null,
      objects: [],
      entities: []
    };
    $scope.editor.currentEditingGame.info.maps[$scope.editor.currentEditingGame.info.maps.indexOf(mapObj)].scenes.push([newScene]);
  }

  this.createScene = function(mapObj, rowNum) {
    var name = "new scene";
    var newScene = {
      name: name,
      background: null,
      objects: [],
      entities: []
    };
    console.log("Creating a scene!", mapObj, rowNum, name);
    $scope.editor.currentEditingGame.info.maps[$scope.editor.currentEditingGame.info.maps.indexOf(mapObj)].scenes[rowNum].push(newScene);
  }

  this.editScene = function(scene) {
    console.log(scene);
    $scope.editor.currentScene = scene;
    $scope.editor.currentLargeView = 'scene';
  }

});
;angular.module('questCreator').controller('objCtrl', function($state, $scope, EditorService) {
  var self = this;      // To help with scope issues
  var drawHandle = -1;  // Interval handle for drawing rate
  var moveHandle = -1;  // Interval handle for movement of mouse (possibly does not need to be global)
  var mouseX = 0;
  var mouseY = 0;
  var mouseMoveEvent;       // Global variable to track mouse movement events
  var touchMoveEvent;       // Global variable to track touch movement events
  var mobileWidth = 850;    // Width for mobile screen sizes
  var tabletWidth = 1100;   // Width for tablet screen sizes
  var tabletScale = 1.4;
  var mobileScaleX = 2.5;
  var mobileScaleY = 1.6;
  var moveType = '';    // Either mouse or touch
  var moved = false;    // Whether mouse has moved or not
  var moving = {        // Direction that the main character should be moving.
    left: false,
    right: false,
    up: false,
    down: false
  };
  var drawing = {       // Type of object being drawn. Default: background.
    // mobile: false,
    // static: false,
    background: true
  };
  var pixelWidth = $scope.editor.currentPixelSize;
  var pixelHeight = $scope.editor.currentPixelSize;
  var undoBackgroundArray = [];   //Array to keep track of background objects that were undone.
  var undoCollisionArray = [];
  // var undoObstacleArray = [];   //Array to keep track of obstacle objects that were undone.
  // var undoCharacterArray = [];   //Array to keep track of character objects that were undone.
  this.speedRange = 5;     // How fast mobile objects should move.
  // this.radiusRange = 5;  // Value of radius input in draw.html
  // this.widthRangeBackground = 50;   // Value of width input in draw.html
  // this.heightRangeBackground = 50;  // Value of height input in draw.html
  // this.widthRangeObstacle = 50;     // Value of width input in draw.html
  // this.heightRangeObstacle = 50;    // Value of height input in draw.html
  this.currentColor = $scope.editor.currentColor;    // Value of color input in draw.html
  // this.currentScene = Scenes.fetchCurrentScene() || {}; // Scene selected from scenes controller
  // this.currentBackground = Backgrounds.fetchCurrentBackground() || {};  // Background selected from scenes controller
  this.myCanvas = document.getElementById('obj-canvas');  // Canvas html element
  this.canvasPos = {    // Canvas top and left coordinates on page
    x: self.myCanvas.getBoundingClientRect().left,
    y: self.myCanvas.getBoundingClientRect().top
  };
  this.draw = this.myCanvas.getContext('2d'); // Canvas context
  // this.sceneName =  this.currentScene.name || '';       // Current selected Scene name
  // this.allMobileCircles = this.currentScene.mobileArr || [];  // Array of all mobile objects in current scene
  // this.allObstacleSquares = this.currentScene.staticArr || [];  // Array of all static objects in current scene
  // this.backgroundName = this.currentBackground.name || '';  // Current selected Background name
  // this.allBackgroundSquares = this.currentBackground.staticArr || []; // Array of all static objects in current background
  this.allCollisionSquares = [];
  this.allBackgroundSquares = [];

  /*
  *   Rectangle object constructor
  *   @params
  *     x: horizontal coord of top left corner
  *     y: vertical coord of top left corner
  *     width: width of rectangle
  *     height: height of rectangle
  *     color: color of rectangle
  *   @methods
  *     draw: draw the rectangle on the canvas using its position, size, and color.
  */
  function Square(x, y, width, height, color, type) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.color = color;
    this.type = type;
  }

  Square.prototype.draw = function() {
    self.draw.fillStyle = this.color;
    if (window.innerWidth <= mobileWidth) { // Mobile size
      self.draw.fillRect(this.x * mobileScaleX, this.y * mobileScaleY, this.width, this.height);
    } else if (window.innerWidth <= tabletWidth) { // Tablet size
      self.draw.fillRect(this.x * tabletScale, this.y / tabletScale, this.width, this.height);
    } else {  // Desktop size
      self.draw.fillRect(this.x, this.y, this.width, this.height);
    }
  };

  $scope.$on('redrawObject', function(event, imageArr, collisionArray) {
    canvasWidth = self.myCanvas.width;
    canvasHeight = self.myCanvas.height;
    self.draw.clearRect(0, 0, canvasWidth, canvasHeight);
    self.allBackgroundSquares = [];
    self.allCollisionSquares = [];
    var undoBackgroundArray = [];
    var undoCollisionArray = [];
    self.allBackgroundSquares = imageArr;
    self.allCollisionSquares = collisionArray;
    drawBackgroundSquares();
    drawCollisionSquares();
  });

  // /*
  // *   Circle object constructor
  // *   @params
  // *     x: horizontal coord of center of circle
  // *     y: vertical coord of center of circle
  // *     radius: radius of circle
  // *     color: color of circle
  // *   @methods
  // *     draw: draw the circle on the canvas using its position, size, and color.
  // */
  // function Circle(x, y, radius, color) {
  //   this.x = x;
  //   this.y = y;
  //   this.radius = radius;
  //   this.color = color;
  //   this.draw = function() {
  //     self.draw.beginPath();
  //     self.draw.fillStyle = this.color;
  //     if (window.innerWidth <= mobileWidth) { // Mobile size
  //       self.draw.arc(this.x * mobileScaleX, this.y * mobileScaleY, this.radius, 0, 2 * Math.PI);
  //     } else if (window.innerWidth <= tabletWidth) { // Tablet size
  //       self.draw.arc(this.x * tabletScale, this.y / tabletScale, this.radius, 0, 2 * Math.PI);
  //     } else {
  //       self.draw.arc(this.x, this.y, this.radius, 0, 2 * Math.PI);
  //     }
  //     self.draw.fill();
  //     // Example for future reference: Can also draw using an image. Image should first be loaded on the page.
  //     // draw.drawImage(imgElem, this.x, this.y, this.radius, this.radius);
  //   }
  // }

  // Called when the mouse button is pressed.
  // Starts the interval to run every 100ms while the mouse button is still held down.
  // Only start the interval if it is not already running.
  function mouseDown(event) {
    if (drawHandle === -1) {
      drawHandle = setInterval(mousePressed, 100);
    }
  }

  // Called when the mouse button is released.
  // If the interval is running, then clear it and reset it.
  function mouseUp(event) {
    if (drawHandle !== -1) {
      clearInterval(drawHandle);
      drawHandle = -1;
    }
  }

  // Runs every 100ms after the mouse button is pressed until it is released.
  // Purpose is to draw the object that the user has chosen every 100ms AND if the mouse has moved from its previous location.
  function mousePressed() {
      self.canvasPos = {  // Get the most recent canvas position in case the window has been resized.
        x: self.myCanvas.getBoundingClientRect().left,
        y: self.myCanvas.getBoundingClientRect().top
      };
      // if (moved && drawing.mobile) { // Create, draw, and record a new mobile object
      //   var radius = parseInt(self.radiusRange);
      //   var color = self.currentColor;
      //   if (moveType === 'mouse') {
      //     var newCircle = new Circle(mouseMoveEvent.clientX - self.canvasPos.x, mouseMoveEvent.clientY - self.canvasPos.y, radius, color);
      //     newCircle.draw();
      //     self.allMobileCircles.push(newCircle);
      //   } else if (moveType === 'touch') {
      //     var newCircle = new Circle(touchMoveEvent.clientX - self.canvasPos.x, touchMoveEvent.clientY - self.canvasPos.y, radius, color);
      //     newCircle.draw();
      //     self.allMobileCircles.push(newCircle);
      //   }
      //   moved = false;
      // } else if (moved && drawing.static) {  // Create, draw, and record a new static object
      //   var width = parseInt(self.widthRangeObstacle);
      //   var height = parseInt(self.heightRangeObstacle);
      //   var color = self.currentColor;
      //   if (moveType === 'mouse') {
      //     var newSquare = new Square(mouseMoveEvent.clientX - width / 2 - self.canvasPos.x, mouseMoveEvent.clientY - height / 2 - self.canvasPos.y, width, height, color);
      //     newSquare.draw();
      //     self.allObstacleSquares.push(newSquare);
      //   } else if (moveType === 'touch') {
      //     var newSquare = new Square(touchMoveEvent.clientX - width / 2 - self.canvasPos.x, touchMoveEvent.clientY - height / 2 - self.canvasPos.y, width, height, color);
      //     newSquare.draw();
      //     self.allObstacleSquares.push(newSquare);
      //   }
      //   moved = false;
      // } else if (moved && drawing.background) { // Create, draw, and record a new background object
      //   var width = parseInt(self.widthRangeBackground);
      //   var height = parseInt(self.heightRangeBackground);
      //   var color = self.currentColor;
      //   if (moveType === 'mouse') {
      //     var newSquare = new Square(mouseMoveEvent.clientX - width / 2 - self.canvasPos.x, mouseMoveEvent.clientY - height / 2 - self.canvasPos.y, width, height, color);
      //     newSquare.draw();
      //     self.allBackgroundSquares.push(newSquare);
      //   } else if (moveType === 'touch') {
      //     var newSquare = new Square(touchMoveEvent.clientX - width / 2 - self.canvasPos.x, touchMoveEvent.clientY - height / 2 - self.canvasPos.y, width, height, color);
      //     newSquare.draw();
      //     self.allBackgroundSquares.push(newSquare);
      //   }
      //   moved = false;
      // }
    if (moved && drawing.background) { // Create, draw, and record a new background object
      var width = $scope.editor.currentPixelSize;
      var height = $scope.editor.currentPixelSize;
      var color = $scope.editor.drawingCollision ? 'rgba(100, 100, 100, 0.5)' : $scope.editor.currentColor;
      if (moveType === 'mouse') {
        var newSquareX = mouseX - self.canvasPos.x;
        var newSquareY = mouseY - self.canvasPos.y;
        var exists = false;
        self.allBackgroundSquares.forEach(function(square) {
          if (square.x === newSquareX && square.y === newSquareY) {
            exists = true;
          }
        });
        if (!exists) {
          var type = $scope.editor.drawingCollision ? 'collision' : 'normal';
          var newSquare = new Square(mouseX - self.canvasPos.x, mouseY - self.canvasPos.y, width, height, color, type);
          newSquare.draw();
          if ($scope.editor.drawingCollision) {
            self.allCollisionSquares.push(newSquare);
          } else {
            self.allBackgroundSquares.push(newSquare);
          }
        }
      } else if (moveType === 'touch') {
        var type = $scope.editor.drawingCollision ? 'collision' : 'normal';
        var newSquare = new Square(touchMoveEvent.clientX - width / 2 - self.canvasPos.x, touchMoveEvent.clientY - height / 2 - self.canvasPos.y, width, height, color, type);
        newSquare.draw();
        if ($scope.editor.drawingCollision) {
          self.allCollisionSquares.push(newSquare);
        } else {
          self.allBackgroundSquares.push(newSquare);
        }
      }
      moved = false;
    }
  }

  // // Check for collisions between all of the mobile objects and all of the obstacle objects.
  // // The collision is categorized according to which direction the obstacle is found.
  // function findCollisions() {
  //   var foundCollision = {  // By default, there is no collision found in any direction.
  //     left: false,
  //     right: false,
  //     up: false,
  //     down: false
  //   };
  //   self.allMobileCircles.forEach(function(circle) {  // Loop through all the mobile objects
  //     self.allObstacleSquares.forEach(function(square) {  // Loop through all the obstacle objects
  //       // Pattern: check the left, right, top, and bottom edges of the current mobile object against the right, left, bottom, and top edges of the current obstacle (in those exact orders).
  //       if (circle.x - circle.radius <= square.x + square.width && circle.x - circle.radius >= square.x && circle.y >= square.y && circle.y <= square.y + square.height) {
  //         foundCollision.left = true;
  //         moving.left = false;
  //       }
  //       if (circle.x + circle.radius <= square.x + square.width && circle.x + circle.radius >= square.x && circle.y >= square.y && circle.y <= square.y + square.height) {
  //         foundCollision.right = true;
  //         moving.right = false;
  //       }
  //       if (circle.x <= square.x + square.width && circle.x >= square.x && circle.y - circle.radius >= square.y && circle.y - circle.radius <= square.y + square.height) {
  //         foundCollision.up = true;
  //         moving.up = false;
  //       }
  //       if (circle.x <= square.x + square.width && circle.x >= square.x && circle.y + circle.radius >= square.y && circle.y + circle.radius <= square.y + square.height) {
  //         foundCollision.down = true;
  //         moving.down = false;
  //       }
  //     });
  //     // Check for collisions with the canvas border as well. Take resizing screen sizes into account.
  //     var canvasEdgeRight;
  //     var canvasEdgeBottom;
  //     if (window.innerWidth <= mobileWidth) {
  //       canvasEdgeRight = self.myCanvas.width / mobileScaleX;
  //       canvasEdgeBottom = self.myCanvas.height / mobileScaleY;
  //     } else if (window.innerWidth <= tabletWidth) {
  //       canvasEdgeRight = self.myCanvas.width / tabletScale;
  //       canvasEdgeBottom = self.myCanvas.height * tabletScale;
  //     } else {
  //       canvasEdgeRight = self.myCanvas.width;
  //       canvasEdgeBottom = self.myCanvas.height;
  //     }
  //     if (circle.x <= 0) {
  //       foundCollision.left = true;
  //       moving.left = false;
  //     }
  //     if (circle.x >= canvasEdgeRight) {
  //       foundCollision.right = true;
  //       moving.right = false;
  //     }
  //     if (circle.y <= 0) {
  //       foundCollision.up = true;
  //       moving.up = false;
  //     }
  //     if (circle.y >= canvasEdgeBottom) {
  //       foundCollision.down = true;
  //       moving.down = false;
  //     }
  //   });
  //   return foundCollision;
  // }

  // // Called when any key is pressed.
  // function handleKeyDown(event) {
  //   // If the user presses the left, right, up, or down arrow keys, toggle the movement direction accordingly
  //   if (event.keyCode === 37) { // Left Key
  //     event.preventDefault();
  //     moving = {
  //       left: !moving.left,
  //       up: false,
  //       right: false,
  //       down: false
  //     };
  //   } else if (event.keyCode === 38) { // Up Key
  //     event.preventDefault();
  //     moving = {
  //       left: false,
  //       up: !moving.up,
  //       right: false,
  //       down: false
  //     };
  //   } else if (event.keyCode === 39) { // Right Key
  //     event.preventDefault();
  //     moving = {
  //       left: false,
  //       up: false,
  //       right: !moving.right,
  //       down: false
  //     };
  //   } else if (event.keyCode === 40) { // Down Key
  //     event.preventDefault();
  //     moving = {
  //       left: false,
  //       up: false,
  //       right: false,
  //       down: !moving.down
  //     };
  //   } else {    // For all other keys, stop all movement.
  //     moving = {
  //       left: false,
  //       up: false,
  //       right: false,
  //       down: false
  //     }
  //   }
  //   // If any of the arrow keys have been pressed, run the moveMobileCircles function every 20ms.
  //   // Otherwise, stop running the moveMobileCircles function.
  //   if ( moving.left || moving.up || moving.right || moving.down ) {
  //     clearInterval(moveHandle);
  //     moveHandle = setInterval(moveMobileCircles, 20);
  //   } else {
  //     clearInterval(moveHandle);
  //   }
  // }

  // // Runs every 20ms after an arrow key has been pressed.
  // function moveMobileCircles() {
  //   // Depending on movement direction and collision detection, do the following:
  //   // 1) Clear the canvas.
  //   // 2) Redraw background and obstacle objects.
  //   // 3) Shift the circles in the corresponding direction.
  //   // 4) Redraw the circles.
  //   // Note: Checking collision detection and checking movement direction may be redundant.
  //   if (moving.left && !findCollisions().left) {
  //     self.draw.clearRect(0, 0, self.myCanvas.width, self.myCanvas.height);
  //     drawBackgroundSquares();
  //     drawObstacleSquares();
  //     self.allMobileCircles.forEach(function(circle) {
  //       circle.x -= parseInt(self.speedRange);
  //       circle.draw();
  //     });
  //   } else if (moving.right && !findCollisions().right) {
  //     self.draw.clearRect(0, 0, self.myCanvas.width, self.myCanvas.height);
  //     drawBackgroundSquares();
  //     drawObstacleSquares();
  //     self.allMobileCircles.forEach(function(circle) {
  //       circle.x += parseInt(self.speedRange);
  //       circle.draw();
  //     });
  //   } else if (moving.up && !findCollisions().up) {
  //     self.draw.clearRect(0, 0, self.myCanvas.width, self.myCanvas.height);
  //     drawBackgroundSquares();
  //     drawObstacleSquares();
  //     self.allMobileCircles.forEach(function(circle) {
  //       circle.y -= parseInt(self.speedRange);
  //       circle.draw();
  //     });
  //   } else if (moving.down && !findCollisions().down) {
  //     self.draw.clearRect(0, 0, self.myCanvas.width, self.myCanvas.height);
  //     drawBackgroundSquares();
  //     drawObstacleSquares();
  //     self.allMobileCircles.forEach(function(circle) {
  //       circle.y += parseInt(self.speedRange);
  //       circle.draw();
  //     });
  //   }
  // }

  // Loop through the array of background objects and draw them all.
  function drawBackgroundSquares() {
    for (var index = 0; index < self.allBackgroundSquares.length; index++) {
      var square = self.allBackgroundSquares[index];
      self.draw.fillStyle = square.color;
      self.draw.fillRect(square.x, square.y, square.width, square.height);
    }
  }
  function drawCollisionSquares() {
    for (var index = 0; index < self.allCollisionSquares.length; index++) {
      var square = self.allCollisionSquares[index];
      self.draw.fillStyle = square.color;
      self.draw.fillRect(square.x, square.y, square.width, square.height);
    }
  }

  // // Loop through the array of obstacle objects and draw them all.
  // function drawObstacleSquares() {
  //   for (var index = 0; index < self.allObstacleSquares.length; index++) {
  //     var square = self.allObstacleSquares[index];
  //     square.draw();
  //   }
  // }

  // // Loop through the array of mobile objects and draw them all.
  // function drawMobileCircles() {
  //   for (var index = 0; index < self.allMobileCircles.length; index++) {
  //     var circle = self.allMobileCircles[index];
  //     circle.draw();
  //   }
  // }

  // // When the Draw Character button is clicked, change the drawing setting to mobile.
  // $('.characterDraw').click(function() {
  //   drawing = {
  //     mobile: true,
  //     static: false,
  //     background: false
  //   };
  //   $('.option').removeClass('active');
  //   $(this).addClass('active');
  // });

  // // When the Draw Obstacles button is clicked, change the drawing setting to static.
  // $('.objectDraw').click(function() {
  //   drawing = {
  //     mobile: false,
  //     static: true,
  //     background: false
  //   }
  //   $('.option').removeClass('active');
  //   $(this).addClass('active');
  // });

  // // When the Draw Background button is clicked, change the drawing setting to background.
  // $('.backgroundDraw').click(function() {
  //   drawing = {
  //     mobile: false,
  //     static: false,
  //     background: true
  //   }
  //   $('.option').removeClass('active');
  //   $(this).addClass('active');
  // });

  // When the user clicks the undo button, remove the last element from the object array and push it to the undo array, based on current drawing type. Then redraw canvas.
  $('#undoObject').click(function() {
    // if (drawing.mobile && self.allMobileCircles.length > 0) {
    //   var lastObj = self.allMobileCircles.pop();
    //   undoCharacterArray.push(lastObj);
    // } else if (drawing.static && self.allObstacleSquares.length > 0) {
    //   var lastObj = self.allObstacleSquares.pop();
    //   undoObstacleArray.push(lastObj);
    // } else if (drawing.background && self.allBackgroundSquares.length > 0) {
    //   var lastObj = self.allBackgroundSquares.pop();
    //   undoBackgroundArray.push(lastObj);
    // }
    if (!$scope.editor.drawingCollision && self.allBackgroundSquares.length > 0) {
      var lastObj = self.allBackgroundSquares.pop();
      undoBackgroundArray.push(lastObj);
    } else if ($scope.editor.drawingCollision && self.allCollisionSquares.length > 0) {
      var lastObj = self.allCollisionSquares.pop();
      undoCollisionArray.push(lastObj);
    }
    self.draw.clearRect(0, 0, self.myCanvas.width, self.myCanvas.height);
    drawBackgroundSquares();
    drawCollisionSquares();
    // drawObstacleSquares();
    // drawMobileCircles();
  });

  // When the user clicks the redo button, remove the last element from the undo array and push it to the object array, based on current drawing type. Then redraw canvas.
  $('#redoObject').click(function() {
    // if (drawing.mobile && undoCharacterArray.length > 0) {
    //   var lastObj = undoCharacterArray.pop();
    //   self.allMobileCircles.push(lastObj);
    // } else if (drawing.static && undoObstacleArray.length > 0) {
    //   var lastObj = undoObstacleArray.pop();
    //   self.allObstacleSquares.push(lastObj);
    // } else if (drawing.background && undoBackgroundArray.length > 0) {
    //   var lastObj = undoBackgroundArray.pop();
    //   self.allBackgroundSquares.push(lastObj);
    // }
    if (!$scope.editor.drawingCollision && undoBackgroundArray.length > 0) {
      var lastObj = undoBackgroundArray.pop();
      self.allBackgroundSquares.push(lastObj);
    } else if ($scope.editor.drawingCollision && undoCollisionArray.length > 0) {
      var lastObj = undoCollisionArray.pop();
      self.allCollisionSquares.push(lastObj);
    }
    self.draw.clearRect(0, 0, self.myCanvas.width, self.myCanvas.height);
    drawBackgroundSquares();
    drawCollisionSquares();
    // drawObstacleSquares();
    // drawMobileCircles();
  });

  // When the Clear Canvas button is clicked, make the current Background and current Scene empty objects and reload the view.
  // Note: may need extra testing here.
  $('#clearObject').click(function() {
    canvasWidth = self.myCanvas.width;
    canvasHeight = self.myCanvas.height;
    // self.allObstacleSquares = [];
    // self.allMobileCircles = [];
    self.draw.clearRect(0, 0, canvasWidth, canvasHeight);
    self.allBackgroundSquares = [];
    self.allCollisionSquares = [];
    var undoBackgroundArray = [];
    var undoCollisionArray = [];
    // var undoObstacleArray = [];
    // var undoCharacterArray = [];
    // Scenes.selectScene({})
    // Backgrounds.selectBackground({});
    // $state.reload();
  });

  // // When the Save Scene button is clicked:
  // // 1) Clear the canvas and redraw only the Obstacles and Character. (ensures thumbnail is scene ONLY)
  // // 2) Create and store a new scene object and make it the current Scene.
  // // 3) Clear the canvas again and this time redraw Background, Obstacles, and Character.
  // $('.saveScene').click(function() {
  //   self.draw.clearRect(0, 0, self.myCanvas.width, self.myCanvas.height);
  //   drawObstacleSquares();
  //   drawMobileCircles();
  //   var newScene = Scenes.create({
  //     name: self.sceneName,
  //     staticArr: self.allObstacleSquares,
  //     mobileArr: self.allMobileCircles,
  //     thumbnail: self.myCanvas.toDataURL()
  //   });
  //   Scenes.selectScene(newScene);
  //   self.draw.clearRect(0, 0, self.myCanvas.width, self.myCanvas.height);
  //   drawBackgroundSquares();
  //   drawObstacleSquares();
  //   drawMobileCircles();
  // });

  // // When the Publish Scene button is clicked, post it to the database.
  // $('.publishScene').click(function() {
  //   // Trying to decide whether to save AND publish or just publish...
  //   self.draw.clearRect(0, 0, self.myCanvas.width, self.myCanvas.height);
  //   drawObstacleSquares();
  //   drawMobileCircles();
  //   var newScene = Scenes.create({
  //     name: self.sceneName,
  //     staticArr: self.allObstacleSquares,
  //     mobileArr: self.allMobileCircles,
  //     thumbnail: self.myCanvas.toDataURL()
  //   });
  //   Scenes.selectScene(newScene);
  //   self.draw.clearRect(0, 0, self.myCanvas.width, self.myCanvas.height);
  //   drawBackgroundSquares();
  //   drawObstacleSquares();
  //   drawMobileCircles();
  //   Scenes.publishScene(newScene);
  // });

  // When the Save Background button is clicked:
  // 1) Clear the canvas and redraw only the Background. (ensures thumbnail is background ONLY)
  // 2) Create and store a new background object and make it the current Background.
  // 3) Finally, draw the Obstacles and Character.
  $('#saveObject').click(function() {
    EditorService.saveObject(self.allBackgroundSquares, self.allCollisionSquares, $scope.editor.currentObject, self.myCanvas.toDataURL()).done(function(object) {
      console.log(object);
    });
    // self.draw.clearRect(0, 0, self.myCanvas.width, self.myCanvas.height);
    // drawBackgroundSquares();
    // var newBackground = Backgrounds.create({
    //   name: self.backgroundName,
    //   staticArr: self.allBackgroundSquares,
    //   thumbnail: self.myCanvas.toDataURL()
    // });
    // Backgrounds.selectBackground(newBackground);
    // drawObstacleSquares();
    // drawMobileCircles();
  });

  // // When the Publish Background button is clicked, post it to the database.
  // $('.publishBackground').click(function() {
  //   // Trying to decide whether to save AND publish or just publish...
  //   self.draw.clearRect(0, 0, self.myCanvas.width, self.myCanvas.height);
  //   drawBackgroundSquares();
  //   var newBackground = Backgrounds.create({
  //     name: self.backgroundName,
  //     staticArr: self.allBackgroundSquares,
  //     thumbnail: self.myCanvas.toDataURL()
  //   });
  //   Backgrounds.selectBackground(newBackground);
  //   drawObstacleSquares();
  //   drawMobileCircles();
  //   Backgrounds.publishBackground(newBackground);
  // });

  // When a key is pressed, run the handleKeyDown function.
  // $(document).on('keydown', handleKeyDown);

  // When the mouse is pressed, released, moved, or leaves the canvas, run the corresponding function.
  $(self.myCanvas).on('mousedown', mouseDown);
  $(self.myCanvas).on('mouseup', mouseUp);
  $(self.myCanvas).on('mouseleave', mouseUp);
  $(self.myCanvas).on('mousemove', function(event) {
    newMouseX = Math.round((event.clientX - $scope.editor.currentPixelSize / 2) / $scope.editor.currentPixelSize) * $scope.editor.currentPixelSize;
    newMouseY = Math.round((event.clientY - $scope.editor.currentPixelSize / 2) / $scope.editor.currentPixelSize) * $scope.editor.currentPixelSize;
    if (newMouseX !== mouseX || newMouseY !== mouseY) {
      mouseX = newMouseX;
      mouseY = newMouseY;
      moveType = 'mouse';
      mouseMoveEvent = event;
      moved = true;
    }
  });

  // // Construct initial full background objects (including methods) from the retrieved partial objects.
  // // Idea - offload object methods to prototype? Possibly make this step unnecessary?
  // function constructBackgroundSquares() {
  //   var oldBackgroundSquares = self.allBackgroundSquares;
  //   var newBackgroundSquares = [];
  //   oldBackgroundSquares.forEach(function(square) {
  //     var newBackgroundSquare = new Square(square.x, square.y, square.width, square.height, square.color);
  //     newBackgroundSquares.push(newBackgroundSquare);
  //   });
  //   self.allBackgroundSquares = newBackgroundSquares;
  // }
  // // Construct mobile objects just like background objects.
  // function constructCircles() {
  //   var oldCircles = self.allMobileCircles;
  //   var newCircles = [];
  //   oldCircles.forEach(function(circle) {
  //     var newCircle = new Circle(circle.x, circle.y, circle.radius, circle.color);
  //     newCircles.push(newCircle);
  //   });
  //   self.allMobileCircles = newCircles;
  // }
  // // Construct static objects just like background and mobile objects.
  // function constructSquares() {
  //   var oldSquares = self.allObstacleSquares;
  //   var newSquares = [];
  //   oldSquares.forEach(function(square) {
  //     var newSquare = new Square(square.x, square.y, square.width, square.height, square.color);
  //     newSquares.push(newSquare);
  //   });
  //   self.allObstacleSquares = newSquares;
  // }

  // Call all object constructing functions.
  // constructBackgroundSquares();
  // constructCircles();
  // constructSquares();
  // Draw all the objects now that they have been made.
  // drawBackgroundSquares();
  // drawMobileCircles();
  // drawObstacleSquares();

  // Experimental touch screen support
  // When the mouse is pressed, released, moved, or leaves the canvas, run the corresponding function.
  $(self.myCanvas).on('touchstart', mouseDown);
  $(self.myCanvas).on('touchend', mouseUp);
  $(self.myCanvas).on('touchcancel', mouseUp);
  $(self.myCanvas).on('touchmove', function(event) {
    moveType = 'touch';
    event.preventDefault();
    touchMoveEvent = event.touches[0];
    moved = true;
  });
});
;angular.module('questCreator').controller('paletteCtrl', function(PaletteService, $scope) {

    var self = this;
    this.elements = [];
    this.currentType = '';

    $scope.$on('paletteInit', function(event, type) {

        PaletteService.getByType(type.type).then(function(response) {
            self.assets = response;
            $scope.$apply();
            self.currentType = PaletteService.getCurrentType();
            $scope.$apply();
        });

        self.searchByTag = function(tag) {
            PaletteService.getByTag(tag).done(function (response) {
              self.assets = response;
              $scope.$apply();
            });
        };

        self.goToEditor = function() {
            if (self.elements.length > 0) {
                var confirmed = confirm('Do you wanna save the assets you chose before leaving this screen?');
                if (confirmed) {
                    PaletteService.saveToPalette(self.elements);
                }
            }
            $scope.editor.selectingAssets = false;
        };

        self.addToPalette = function(element) {
            self.elements.push(element);
        };

        self.saveElements = function() {
          var currentObjects = null;
          if (self.currentType === 'backgrounds') {
            currentObjects =  $scope.editor.availableBackgrounds.concat(self.elements);
            $scope.editor.availableBackgrounds = currentObjects;
          } else if (self.currentType === 'obstacles') {
            currentObjects = $scope.editor.availableObjects.concat(self.elements);
            $scope.editor.availableObjects = currentObjects;
          } else if (self.currentType === 'entities') {
            currentObjects = $scope.editor.availableEntities.concat(self.elements);
            $scope.editor.availableEntities = currentObjects;
          }
          console.log(currentObjects);

          self.elements = [];
          return self.elements;
        };
    });
});
;angular.module('questCreator').controller('playCtrl', function(socket, Avatar, Background, SceneObject, Entity, UserService, GameService, $state, $scope) {
    var self = this;
    var playerInfo = {
        userId: UserService.get().id,
    };
    var gameCanvas = document.getElementById('play-canvas');
    var gameCtx = gameCanvas.getContext('2d');
    var gameWidth = 700;
    var gameHeight = 500;
    this.warning = '';
    var typing = {
        show: false,
        phrase: ''
    };
    var responding = {
        show: false,
        phrase: ''
    };
    var inventory = {
        show: false,
        contents: ''
    }
    var pause = false;
    var startTime = new Date();

    var avatar = null;
    var background = null;
    var objects = null;
    var entities = null;
    var scene = null;

    var gameLoaded = false;
    var avatarLoaded = false;
    var entitiesLoaded = false;

    this.gameToPlay = GameService.getGameDetail().name;
    var gameInfo = null;
    var allMaps = null;
    this.currentMap = null;
    this.allRows = null;
    this.currentRow = null;
    this.currentScene = null;
    this.currentScenePos = [0, 0, 0];
    this.gameLoaded = false;

    this.gameStarted = false;

    var currentGame = GameService.loadGame(self.gameToPlay).done(function(response) {
        self.gameLoaded = true;
        gameInfo = response.info;
        allMaps = gameInfo.maps;
        self.currentMap = allMaps[0];
        self.allRows = self.currentMap.scenes;
        self.currentRow = self.allRows[0];
        self.currentScene = self.currentRow[0];
        background = self.currentScene.background;
        drawBackground();
        $scope.$apply();
    });

    $('body').off('keyup').on('keyup', function(event) {
        var keyCode = event.which;
        if (keyCode === 37) {
            avatar.action = (avatar.action === 'walkLeft')
                ? 'stand'
                : 'walkLeft';
            avatar.info.speed.x = (avatar.info.speed.x === -1 * avatar.info.speed.mag)
                ? 0
                : -1 * avatar.info.speed.mag;
            avatar.info.speed.y = 0;
        } else if (keyCode === 38) {
            avatar.action = (avatar.action === 'walkUp')
                ? 'stand'
                : 'walkUp';
            avatar.info.speed.x = 0;
            avatar.info.speed.y = (avatar.info.speed.y === -1 * avatar.info.speed.mag)
                ? 0
                : -1 * avatar.info.speed.mag;
        } else if (keyCode === 39) {
            avatar.action = (avatar.action === 'walkRight')
                ? 'stand'
                : 'walkRight';
            avatar.info.speed.x = (avatar.info.speed.x === avatar.info.speed.mag)
                ? 0
                : avatar.info.speed.mag;
            avatar.info.speed.y = 0;
        } else if (keyCode === 40) {
            avatar.action = (avatar.action === 'walkDown')
                ? 'stand'
                : 'walkDown';
            avatar.info.speed.x = 0;
            avatar.info.speed.y = (avatar.info.speed.y === avatar.info.speed.mag)
                ? 0
                : avatar.info.speed.mag;
        }
    });

    $('body').off('keypress').on('keypress', function(event) {
        var keyCode = event.which;
        if (typing.show && keyCode >= 32 && keyCode <= 220 && !responding.show && $('.active').length === 0) {
            pause = true;
            var char = String.fromCharCode(keyCode);
            typing.phrase += char;
            $('.typing').text(typing.phrase);
        } else if (keyCode === 13) {
            // Enter
            if (typing.show) { // If the user is finishing typing
                typing.show = false;
                $('.typing').hide();
                var userPhrase = typing.phrase;
                typing.phrase = '';
                checkTyping(userPhrase);
            } else if (responding.show) { // If the user is finished reading a response
                responding.show = false;
                $('.dialog').hide();
                responding.phrase = '';
            } else if (inventory.show) { // If the user is finished looking at inventory
                // $('.inventoryContainer').hide();
                // this.inventory.show = false;
            }
            if (!responding.show && !inventory.show && $('.active').length === 0) { // Resume the game if all windows have been closed
                pause = false;
            }
        } else if (keyCode === 32) {
            // Space
            if (!typing.show) {
                typing.phrase = '>';
                typing.show = true;
                $('.typing').text(typing.phrase).show();
            }
        }
    });

    function loadMainCharacter() {
        // Testing creation of avatar
        var avatarTest = {
            name: 'Avatar Test',
            info: {
                // The x and y coordinate of the top left corner of the avatar
                pos: {
                    x: 100,
                    y: 250
                },
                // The character's speed
                speed: {
                    mag: 3,
                    x: 0,
                    y: 0
                },
                // The animate object contains all the possible character actions with all of the frames to be drawn for each action.
                animate: {
                    // Key: possible action, Value: array of frames
                    walkLeft: [
                        // Each frame array element is an array of square objects to be drawn
                        // Frame 1 - walk left
                        [
                            {
                                x: 100,
                                y: 100,
                                width: 30,
                                height: 30,
                                color: 'blue'
                            }, {
                                x: 110,
                                y: 150,
                                width: 30,
                                height: 30,
                                color: 'green'
                            }
                        ],
                        // Frame 2 - walk left
                        [
                            {
                                x: 110,
                                y: 100,
                                width: 30,
                                height: 30,
                                color: 'blue'
                            }, {
                                x: 100,
                                y: 150,
                                width: 30,
                                height: 30,
                                color: 'green'
                            }
                        ]
                    ],
                    walkRight: [
                        // Frame 1 - walk right
                        [
                            {
                                x: 150,
                                y: 100,
                                width: 30,
                                height: 30,
                                color: 'blue'
                            }, {
                                x: 140,
                                y: 150,
                                width: 30,
                                height: 30,
                                color: 'green'
                            }
                        ],
                        // Frame 2 - walk right
                        [
                            {
                                x: 140,
                                y: 100,
                                width: 30,
                                height: 30,
                                color: 'blue'
                            }, {
                                x: 150,
                                y: 150,
                                width: 30,
                                height: 30,
                                color: 'green'
                            }
                        ]
                    ],
                    walkUp: [
                        // Frame 1 - walk up
                        [
                            {
                                x: 100,
                                y: 110,
                                width: 30,
                                height: 30,
                                color: 'red'
                            }, {
                                x: 150,
                                y: 100,
                                width: 30,
                                height: 30,
                                color: 'yellow'
                            }
                        ],
                        // Frame 2 - walk up
                        [
                            {
                                x: 100,
                                y: 100,
                                width: 30,
                                height: 30,
                                color: 'red'
                            }, {
                                x: 150,
                                y: 110,
                                width: 30,
                                height: 30,
                                color: 'yellow'
                            }
                        ]
                    ],
                    walkDown: [
                        // Frame 1 - walk down
                        [
                            {
                                x: 100,
                                y: 140,
                                width: 30,
                                height: 30,
                                color: 'red'
                            }, {
                                x: 150,
                                y: 150,
                                width: 30,
                                height: 30,
                                color: 'yellow'
                            }
                        ],
                        // Frame 2 - walk down
                        [
                            {
                                x: 100,
                                y: 150,
                                width: 30,
                                height: 30,
                                color: 'red'
                            }, {
                                x: 150,
                                y: 140,
                                width: 30,
                                height: 30,
                                color: 'yellow'
                            }
                        ]
                    ],
                    swimLeft: [
                        // Frame 1 - swim left
                        [
                            {
                                x: 100,
                                y: 100,
                                width: 30,
                                height: 30,
                                color: 'lightblue'
                            }, {
                                x: 150,
                                y: 150,
                                width: 30,
                                height: 30,
                                color: 'lightblue'
                            }
                        ],
                        // Frame 2 - swim left
                        [
                            {
                                x: 100,
                                y: 100,
                                width: 30,
                                height: 30,
                                color: 'gray'
                            }, {
                                x: 150,
                                y: 150,
                                width: 30,
                                height: 30,
                                color: 'gray'
                            }
                        ]
                    ],
                    swimRight: [
                        // Frame 1 - swim right
                        [
                            {
                                x: 100,
                                y: 100,
                                width: 30,
                                height: 30,
                                color: 'lightblue'
                            }, {
                                x: 150,
                                y: 150,
                                width: 30,
                                height: 30,
                                color: 'lightblue'
                            }
                        ],
                        // Frame 2 - swim right
                        [
                            {
                                x: 100,
                                y: 100,
                                width: 30,
                                height: 30,
                                color: 'gray'
                            }, {
                                x: 150,
                                y: 150,
                                width: 30,
                                height: 30,
                                color: 'gray'
                            }
                        ]
                    ],
                    swimUp: [
                        // Frame 1 - swim up
                        [
                            {
                                x: 100,
                                y: 100,
                                width: 30,
                                height: 30,
                                color: 'lightblue'
                            }, {
                                x: 150,
                                y: 150,
                                width: 30,
                                height: 30,
                                color: 'lightblue'
                            }
                        ],
                        // Frame 2 - swim up
                        [
                            {
                                x: 100,
                                y: 100,
                                width: 30,
                                height: 30,
                                color: 'gray'
                            }, {
                                x: 150,
                                y: 150,
                                width: 30,
                                height: 30,
                                color: 'gray'
                            }
                        ]
                    ],
                    swimDown: [
                        // Frame 1 - swim down
                        [
                            {
                                x: 100,
                                y: 100,
                                width: 30,
                                height: 30,
                                color: 'lightblue'
                            }, {
                                x: 150,
                                y: 150,
                                width: 30,
                                height: 30,
                                color: 'lightblue'
                            }
                        ],
                        // Frame 2 - swim down
                        [
                            {
                                x: 100,
                                y: 100,
                                width: 30,
                                height: 30,
                                color: 'gray'
                            }, {
                                x: 150,
                                y: 150,
                                width: 30,
                                height: 30,
                                color: 'gray'
                            }
                        ]
                    ]
                    // Other actions could go here
                },
                // The collision map is how the game can know whether the character has collided with another object or event trigger. It is an array of invisible (or gray for now) squares.
                collisionMap: [
                    {
                        x: 100,
                        y: 180,
                        width: 80,
                        height: 10,
                        color: 'gray'
                    }, {
                        x: 100,
                        y: 185,
                        width: 80,
                        height: 10,
                        color: 'gray'
                    }
                ]
            },
            current: false
        };
        var headerData = {
            user_id: UserService.get().id,
            token: UserService.get().token
        };
        // Avatar
        $.ajax({
            method: 'POST',
            url: 'https://forge-api.herokuapp.com/characters/create',
            headers: headerData,
            data: JSON.stringify(avatarTest),
            dataType: 'json',
            contentType: 'application/json',
            success: function(response) {
                avatar = new Avatar(response);
                avatar.info.currentFrame = avatar.info.animate.walkLeft[0];
                avatarLoaded = true;
                setInterval(checkAvatarAction, 75);
            },
            error: function(error) {
                console.log(error);
            }
        });
    }

    function checkTyping(phrase) {
        if (phrase.includes('look')) {
            responding.phrase = "This is a description of your current scene. I hope it's helpful.";
        } else {
            responding.phrase = "I don't understand that.";
        }
        $('.dialog').text(responding.phrase).show();
        responding.show = true;
        pause = true;
    }
    function checkAvatarBounds() {
        var left = avatar.info.collisionMap[0].x;
        var right = avatar.info.collisionMap[0].x + avatar.info.collisionMap[0].width;
        var top = avatar.info.collisionMap[0].y;
        var bottom = avatar.info.collisionMap[0].y + avatar.info.collisionMap[0].height;
        avatar.info.collisionMap.forEach(function(square) {
            if (square.x < left) {
                left = square.x;
            }
            if (square.x + square.width > right) {
                right = square.x + square.width;
            }
            if (square.y < top) {
                top = square.y;
            }
            if (square.y + square.height > bottom) {
                bottom = square.y + square.height;
            }
        });
        avatar.bounds = {
            left: left + avatar.info.pos.x,
            right: right + avatar.info.pos.x,
            top: top + avatar.info.pos.y,
            bottom: bottom + avatar.info.pos.y,
            width: right - left,
            height: bottom - top
        };
        if (avatar.bounds.right < 0) { // Character moves to the left scene
            self.currentScenePos[2]--;
            if (self.currentScenePos[2] < 0) {
                self.currentScenePos[2] = self.currentRow.length - 1;
            }
            updateLocation();
            avatar.info.pos.x += gameWidth;
        } else if (avatar.bounds.left > gameWidth) { // Character moves to the right scene
            self.currentScenePos[2]++;
            if (self.currentScenePos[2] > self.currentRow.length - 1) {
                self.currentScenePos[2] = 0;
            }
            updateLocation();
            avatar.info.pos.x -= gameWidth;
        } else if (avatar.bounds.bottom < 0) { // Character moves to the above scene
            self.currentScenePos[1]--;
            if (self.currentScenePos[1] < 0) {
                self.currentScenePos[1] = self.allRows.length - 1;
            }
            updateLocation();
            avatar.info.pos.y += gameHeight;
        } else if (avatar.bounds.top > gameHeight) { // Character moves to the below scene
            self.currentScenePos[1]++;
            if (self.currentScenePos[1] > self.allRows.length - 1) {
                self.currentScenePos[1] = 0;
            }
            updateLocation();
            avatar.info.pos.y -= gameHeight;
        }
    }

    function checkAvatarCollisions() {
        var collision = {
            found: false,
            direction: 'none',
            type: 'none'
        };
        avatar.info.collisionMap.forEach(function(avatarSquare) { // Loop through all the avatar squares
            var avatarLeft = avatarSquare.x + avatar.info.pos.x;
            var avatarRight = avatarSquare.x + avatarSquare.width + avatar.info.pos.x;
            var avatarTop = avatarSquare.y + avatar.info.pos.y;
            var avatarBottom = avatarSquare.y + avatarSquare.height + avatar.info.pos.y;
            if (background) {
                background.info.collisionMap.forEach(function(bgSquare) { // Loop through all the background's squares
                    var bgLeft = bgSquare.x;
                    var bgRight = bgSquare.x + bgSquare.width;
                    var bgTop = bgSquare.y;
                    var bgBottom = bgSquare.y + bgSquare.height;
                    // Pattern: check the left, right, top, and bottom edges of the current avatar square against the right, left, bottom, and top edges of the current bg square (in those exact orders).
                    if (avatarLeft <= bgRight && avatarRight >= bgLeft && avatarTop <= bgBottom && avatarBottom >= bgTop) {
                        collision.found = true;
                        collision.type = 'wall';
                        if (avatar.info.speed.x > 0) {
                            collision.direction = 'right';
                        } else if (avatar.info.speed.x < 0) {
                            collision.direction = 'left';
                        } else if (avatar.info.speed.y < 0) {
                            collision.direction = 'up';
                        } else if (avatar.info.speed.y > 0) {
                            collision.direction = 'down';
                        }
                    }
                });
            }
            if (objects) {
                objects.forEach(function(object) {
                    // Find the bounds of the object, if it has any
                    if (object.info.collisionMap[0]) {
                      var left = object.info.collisionMap[0].x;
                      var right = object.info.collisionMap[0].x + object.info.collisionMap[0].width;
                      var top = object.info.collisionMap[0].y;
                      var bottom = object.info.collisionMap[0].y + object.info.collisionMap[0].height;
                      object.info.collisionMap.forEach(function(square) {
                          if (square.x < left) {
                              left = square.x;
                          }
                          if (square.x + square.width > right) {
                              right = square.x + square.width;
                          }
                          if (square.y < top) {
                              top = square.y;
                          }
                          if (square.y + square.height > bottom) {
                              bottom = square.y + square.height;
                          }
                      });
                      object.bounds = {
                          left: left + object.info.pos.x,
                          right: right + object.info.pos.x,
                          top: top + object.info.pos.y,
                          bottom: bottom + object.info.pos.y,
                          width: right - left,
                          height: bottom - top
                      };
                    }
                    object.info.collisionMap.forEach(function(objSquare) { // Loop through all the scene object's squares
                      var objLeft = objSquare.x + object.info.pos.x;
                      var objRight = objSquare.x + objSquare.width + object.info.pos.x;
                      var objTop = objSquare.y + object.info.pos.y;
                      var objBottom = objSquare.y + objSquare.height + object.info.pos.y;
                      // Pattern: check the left, right, top, and bottom edges of the current avatar square against the right, left, bottom, and top edges of the current scene object square (in those exact orders).
                      if (avatarLeft <= objRight && avatarRight >= objLeft && avatarTop <= objBottom && avatarBottom >= objTop) {
                          collision.found = true;
                          collision.type = 'wall';
                          if (avatar.info.speed.x > 0) {
                              collision.direction = 'right';
                          } else if (avatar.info.speed.x < 0) {
                              collision.direction = 'left';
                          } else if (avatar.info.speed.y < 0) {
                              collision.direction = 'up';
                          } else if (avatar.info.speed.y > 0) {
                              collision.direction = 'down';
                          }
                      }
                  });
              });
            }
            if (entities) {
              entities.forEach(function(entity) {
                  // Find the bounds of the entity, if it has any
                  if (entity.info.currentFrame.collisionMap[0]) {
                    var left = entity.info.currentFrame.collisionMap[0].x;
                    var right = entity.info.currentFrame.collisionMap[0].x + entity.info.currentFrame.collisionMap[0].width;
                    var top = entity.info.currentFrame.collisionMap[0].y;
                    var bottom = entity.info.currentFrame.collisionMap[0].y + entity.info.currentFrame.collisionMap[0].height;
                    entity.info.currentFrame.collisionMap.forEach(function(square) {
                        if (square.x < left) {
                            left = square.x;
                        }
                        if (square.x + square.width > right) {
                            right = square.x + square.width;
                        }
                        if (square.y < top) {
                            top = square.y;
                        }
                        if (square.y + square.height > bottom) {
                            bottom = square.y + square.height;
                        }
                    });
                    entity.bounds = {
                        left: left + entity.info.pos.x,
                        right: right + entity.info.pos.x,
                        top: top + entity.info.pos.y,
                        bottom: bottom + entity.info.pos.y,
                        width: right - left,
                        height: bottom - top
                    };
                  }
                  entity.info.currentFrame.collisionMap.forEach(function(entSquare) { // Loop through all the scene entity's squares
                    var entLeft = entSquare.x + entity.info.pos.x;
                    var entRight = entSquare.x + entSquare.width + entity.info.pos.x;
                    var entTop = entSquare.y + entity.info.pos.y;
                    var entBottom = entSquare.y + entSquare.height + entity.info.pos.y;
                    // Pattern: check the left, right, top, and bottom edges of the current avatar square against the right, left, bottom, and top edges of the current scene object square (in those exact orders).
                    if (avatarLeft <= entRight && avatarRight >= entLeft && avatarTop <= entBottom && avatarBottom >= entTop) {
                        collision.found = true;
                        collision.type = 'wall';
                        if (avatar.info.speed.x > 0) {
                            collision.direction = 'right';
                        } else if (avatar.info.speed.x < 0) {
                            collision.direction = 'left';
                        } else if (avatar.info.speed.y < 0) {
                            collision.direction = 'up';
                        } else if (avatar.info.speed.y > 0) {
                            collision.direction = 'down';
                        }
                    }
                });
              });
            }
        });
        if (collision.found) {
          console.log("Avatar Collided!");
            switch (collision.type) {
                case 'wall':
                    avatar.collide(collision.direction);
                    break;
            }
            collision = {
                found: false,
                direction: 'none',
                type: 'none'
            };
        }
    }

    function checkEntityCollisions() {
      if (entities) {
        entities.forEach(function(entity) {
          var collision = {
              found: false,
              direction: 'none',
              type: 'none'
          };
          entity.info.currentFrame.collisionMap.forEach(function(entitySquare) { // Loop through all the entity squares
              var entityLeft = entitySquare.x + entity.info.pos.x;
              var entityRight = entitySquare.x + entitySquare.width + entity.info.pos.x;
              var entityTop = entitySquare.y + entity.info.pos.y;
              var entityBottom = entitySquare.y + entitySquare.height + entity.info.pos.y;
              if (background) {
                  background.info.collisionMap.forEach(function(bgSquare) { // Loop through all the background's squares
                      var bgLeft = bgSquare.x;
                      var bgRight = bgSquare.x + bgSquare.width;
                      var bgTop = bgSquare.y;
                      var bgBottom = bgSquare.y + bgSquare.height;
                      // Pattern: check the left, right, top, and bottom edges of the current entity square against the right, left, bottom, and top edges of the current bg square (in those exact orders).
                      if (entityLeft <= bgRight && entityRight >= bgLeft && entityTop <= bgBottom && entityBottom >= bgTop) {
                          collision.found = true;
                          collision.type = 'wall';
                          if (entity.info.speed.x > 0) {
                              collision.direction = 'right';
                          } else if (entity.info.speed.x < 0) {
                              collision.direction = 'left';
                          } else if (entity.info.speed.y < 0) {
                              collision.direction = 'up';
                          } else if (entity.info.speed.y > 0) {
                              collision.direction = 'down';
                          }
                      }
                  });
              }
              if (objects) {
                  objects.forEach(function(object) {
                      // Find the bounds of the object, if it has any
                      if (object.info.collisionMap[0]) {
                        var left = object.info.collisionMap[0].x;
                        var right = object.info.collisionMap[0].x + object.info.collisionMap[0].width;
                        var top = object.info.collisionMap[0].y;
                        var bottom = object.info.collisionMap[0].y + object.info.collisionMap[0].height;
                        object.info.collisionMap.forEach(function(square) {
                            if (square.x < left) {
                                left = square.x;
                            }
                            if (square.x + square.width > right) {
                                right = square.x + square.width;
                            }
                            if (square.y < top) {
                                top = square.y;
                            }
                            if (square.y + square.height > bottom) {
                                bottom = square.y + square.height;
                            }
                        });
                        object.bounds = {
                            left: left + object.info.pos.x,
                            right: right + object.info.pos.x,
                            top: top + object.info.pos.y,
                            bottom: bottom + object.info.pos.y,
                            width: right - left,
                            height: bottom - top
                        };
                      }
                      object.info.collisionMap.forEach(function(objSquare) { // Loop through all the scene object's squares
                        var objLeft = objSquare.x + object.info.pos.x;
                        var objRight = objSquare.x + objSquare.width + object.info.pos.x;
                        var objTop = objSquare.y + object.info.pos.y;
                        var objBottom = objSquare.y + objSquare.height + object.info.pos.y;
                        // Pattern: check the left, right, top, and bottom edges of the current entity square against the right, left, bottom, and top edges of the current scene object square (in those exact orders).
                        if (entityLeft <= objRight && entityRight >= objLeft && entityTop <= objBottom && entityBottom >= objTop) {
                            collision.found = true;
                            collision.type = 'wall';
                            if (entity.info.speed.x > 0) {
                                collision.direction = 'right';
                            } else if (entity.info.speed.x < 0) {
                                collision.direction = 'left';
                            } else if (entity.info.speed.y < 0) {
                                collision.direction = 'up';
                            } else if (entity.info.speed.y > 0) {
                                collision.direction = 'down';
                            }
                        }
                    });
                });
              }
              /* Not checking for collisions with other entities
              if (entities) {
                entities.forEach(function(otherEntity) {
                  // Don't check the entity with itself
                  if (entity !== otherEntity) {
                    // Find the bounds of the entity, if it has any
                    if (otherEntity.info.currentFrame.collisionMap[0]) {
                      var left = otherEntity.info.currentFrame.collisionMap[0].x;
                      var right = otherEntity.info.currentFrame.collisionMap[0].x + otherEntity.info.currentFrame.collisionMap[0].width;
                      var top = otherEntity.info.currentFrame.collisionMap[0].y;
                      var bottom = otherEntity.info.currentFrame.collisionMap[0].y + otherEntity.info.currentFrame.collisionMap[0].height;
                      otherEntity.info.currentFrame.collisionMap.forEach(function(square) {
                          if (square.x < left) {
                              left = square.x;
                          }
                          if (square.x + square.width > right) {
                              right = square.x + square.width;
                          }
                          if (square.y < top) {
                              top = square.y;
                          }
                          if (square.y + square.height > bottom) {
                              bottom = square.y + square.height;
                          }
                      });
                      otherEntity.bounds = {
                          left: left + otherEntity.info.pos.x,
                          right: right + otherEntity.info.pos.x,
                          top: top + otherEntity.info.pos.y,
                          bottom: bottom + otherEntity.info.pos.y,
                          width: right - left,
                          height: bottom - top
                      };
                    }
                    otherEntity.info.currentFrame.collisionMap.forEach(function(entSquare) { // Loop through all the scene entity's squares
                      var entLeft = entSquare.x + otherEntity.info.pos.x;
                      var entRight = entSquare.x + entSquare.width + otherEntity.info.pos.x;
                      var entTop = entSquare.y + otherEntity.info.pos.yotherEntity
                      var entBottom = entSquare.y + entSquare.height + otherEntity.info.pos.y;
                      // Pattern: check the left, right, top, and bottom edges of the current entity square against the right, left, bottom, and top edges of the current scene object square (in those exact orders).
                      if (entityLeft <= entRight && entityRight >= entLeft && entityTop <= entBottom && entityBottom >= entTop) {
                          collision.found = true;
                          collision.type = 'wall';
                          if (entity.info.speed.x > 0) {
                              collision.direction = 'right';
                          } else if (entity.info.speed.x < 0) {
                              collision.direction = 'left';
                          } else if (entity.info.speed.y < 0) {
                              collision.direction = 'up';
                          } else if (entity.info.speed.y > 0) {
                              collision.direction = 'down';
                          }
                      }
                    });
                  }
                });
              }
              */
            });
            if (collision.found) {
                switch (collision.type) {
                    case 'wall':
                        entity.collide(collision.direction);
                        break;
                }
                collision = {
                    found: false,
                    direction: 'none',
                    type: 'none'
                };
            }
        });
      }
    }

    function updateLocation() {
        self.currentMap = allMaps[self.currentScenePos[0]];
        self.allRows = self.currentMap.scenes;
        self.currentRow = self.allRows[self.currentScenePos[1]];
        self.currentScene = self.currentRow[self.currentScenePos[2]];
        background = self.currentScene.background;
        objects = self.currentScene.objects;
        loadEntities();
    }

    function loadEntities() {
      entities = [];
      var oldEntities = self.currentScene.entities;
      oldEntities.forEach(function(entity) {
        var newEntity = new Entity(entity);
        entities.push(newEntity);
      });
      entitiesLoaded = true;
    }

    function updateAvatar() {
            avatar.updatePos();
        }

    function updateEntities() {
      entities.forEach(function(entity) {
        entity.updatePos();
      });
    }

    // NOTE: these frame index variables should probably belong to the individual avatar, object, or entity in the factory
    // var currentAvatarFrameIndex = 0;
    function checkAvatarAction() {
      avatar.info.currentFrameIndex = avatar.info.currentFrameIndex || 0;
        if (avatar.action === 'walkLeft' || avatar.action === 'walkUp' || avatar.action === 'walkRight' || avatar.action === 'walkDown') {
            if (avatar.info.currentFrameIndex > avatar.info.animate[avatar.action].length - 1) {
                avatar.info.currentFrameIndex = 0;
            }
            avatar.info.currentFrame = avatar.info.animate[avatar.action][avatar.info.currentFrameIndex];
            avatar.info.currentFrameIndex++;
        } else {
            // Do nothing, or set frame to a given specific frame.
            // avatar.info.currentFrame = avatar.info.animate.walkLeft[0];
        }
    }

    // Not currently animating objects
    // var currentSceneObjFrameIndex = 0;
    // function checkSceneObjectAction() {
    //   // Animate the object.
    //   if (currentSceneObjFrameIndex > sceneObject.info.animate[sceneObject.allActions[0]].length - 1) {
    //     currentSceneObjFrameIndex = 0;
    //   }
    //   sceneObject.info.currentFrame = sceneObject.info.animate[sceneObject.allActions[0]][currentSceneObjFrameIndex];
    //   currentSceneObjFrameIndex++;
    // }

    function drawAvatar() {
        // Save the drawing context
        gameCtx.save();
        // Translate the canvas origin to be the top left of the avatar
        gameCtx.translate(avatar.info.pos.x, avatar.info.pos.y);
        // Draw the squares from the avatar's current frame
        avatar.info.currentFrame.forEach(function(square) {
            gameCtx.fillStyle = square.color;
            gameCtx.fillRect(square.x, square.y, square.width, square.height);
        });
        gameCtx.globalAlpha = 0.2;
        // Draw the avatar's collision map (purely for testing)
        avatar.info.collisionMap.forEach(function(square) {
            gameCtx.fillStyle = square.color;
            gameCtx.fillRect(square.x, square.y, square.width, square.height);
        });
        gameCtx.restore();
    }

    function drawBackground() {
        if (background) {
            // Save the drawing context
            gameCtx.save();
            // Draw the squares from the background object.
            gameCtx.globalCompositeOperation = "destination-over";
            for (var index = background.info.image.length - 1; index >= 0; index--) {
                var square = background.info.image[index];
                gameCtx.fillStyle = square.color;
                gameCtx.fillRect(square.x, square.y, square.width, square.height);
            }
            gameCtx.globalCompositeOperation = "source-over";
            gameCtx.globalAlpha = 0.2;
            // Draw the background's collision map (purely for testing)
            background.info.collisionMap.forEach(function(square) {
                gameCtx.fillStyle = square.color;
                gameCtx.fillRect(square.x, square.y, square.width, square.height);
            });
            gameCtx.restore();
        } else {
            self.warning = "This scene has no background yet!";
            setTimeout(function() {
                self.warning = '';
            }, 2000);
        }
        $scope.$apply();
    }

    function drawObjects(type) {
        // objects.sort(function(objectA, objectB) {
        //   if (!objectA.bounds) {
        //     objectA.bounds.bottom = null;
        //   }
        //   if (!objectB.bounds) {
        //     objectB.bounds.bottom = null;
        //   }
        //   if (objectA.bounds.bottom < objectB.bounds.bottom) {
        //     return 1;
        //   } else {
        //     return -1;
        //   }
        // });
        // console.log(objects);
        objects.forEach(function(object) {

            // Save the drawing context
            gameCtx.save();
            // Translate the canvas origin to be the top left of the object
            gameCtx.translate(object.info.pos.x, object.info.pos.y);
            // If object has collision map bounds, check avatar location. Otherwise, draw behind character by default.
            // if (object.bounds) {
            //   if (avatar.bounds.top > object.bounds.bottom) {
            //     gameCtx.globalCompositeOperation = "destination-over";  // If object is behind character.
            //   } else {
            //     gameCtx.globalCompositeOperation = "source-over"; // If object is in front of character.
            //   }
            // } else {
            //   gameCtx.globalCompositeOperation = "destination-over";  // If object is behind character.
            // }
            if ( (avatar.bounds.top > object.bounds.bottom && type === 'background') || (avatar.bounds.top < object.bounds.bottom && type === 'foreground') ) {
              // Draw the squares from the object's current frame
              object.info.image.forEach(function(square) {
                  gameCtx.fillStyle = square.color;
                  gameCtx.fillRect(square.x, square.y, square.width, square.height);
              });
              gameCtx.globalAlpha = 0.2;
              // Draw the object's collision map (purely for testing)
              object.info.collisionMap.forEach(function(square) {
                  gameCtx.fillStyle = square.color;
                  gameCtx.fillRect(square.x, square.y, square.width, square.height);
              });
            }
            gameCtx.restore();
        });
    }

    function drawEntities(type) {
      entities.forEach(function(entity) {
          entity.checkAction();
          // Save the drawing context
          gameCtx.save();
          // Translate the canvas origin to be the top left of the entity
          gameCtx.translate(entity.info.pos.x, entity.info.pos.y);
          // If entity has collision map bounds, check avatar location. Otherwise, draw behind character by default.
          // if (entity.bounds) {
          //   if (avatar.bounds.top > entity.bounds.bottom) {
          //     gameCtx.globalCompositeOperation = "destination-over";  // If entity is behind character.
          //   } else {
          //     gameCtx.globalCompositeOperation = "source-over"; // If entity is in front of character.
          //   }
          // } else {
          //   gameCtx.globalCompositeOperation = "destination-over";  // If entity is behind character.
          // }
          if (entity.bounds) {
            if ( (avatar.bounds.top > entity.bounds.bottom && type === 'background') || (avatar.bounds.top < entity.bounds.bottom && type === 'foreground') ) {
              // Draw the squares from the entity's current frame
              entity.info.currentFrame.image.forEach(function(square) {
                  gameCtx.fillStyle = square.color;
                  gameCtx.fillRect(square.x, square.y, square.width, square.height);
              });
              gameCtx.globalAlpha = 0.2;
              // Draw the entity's collision map (purely for testing)
              entity.info.currentFrame.collisionMap.forEach(function(square) {
                  gameCtx.fillStyle = square.color;
                  gameCtx.fillRect(square.x, square.y, square.width, square.height);
              });
            }
          } else if (type === 'background'){
            // Draw the squares from the entity's current frame
            entity.info.currentFrame.image.forEach(function(square) {
                gameCtx.fillStyle = square.color;
                gameCtx.fillRect(square.x, square.y, square.width, square.height);
            });
            gameCtx.globalAlpha = 0.2;
            // Draw the entity's collision map (purely for testing)
            entity.info.currentFrame.collisionMap.forEach(function(square) {
                gameCtx.fillStyle = square.color;
                gameCtx.fillRect(square.x, square.y, square.width, square.height);
            });
          }
          gameCtx.restore();
      });
    }

    function clearCanvas() {
            gameCtx.clearRect(0, 0, gameWidth, gameHeight);
        }

    this.startGame = function() {
        self.currentScenePos = [1, 0, 0]; // NOTE: Initial character start position, need to get from editor
        updateLocation();
        loadMainCharacter();
        self.gameStarted = true;
    };

    function runGame() {
        if (self.gameStarted) {
            clearCanvas();
            if (avatarLoaded) {
                checkAvatarBounds();
                checkAvatarCollisions();
                checkEntityCollisions();
                updateAvatar();
                updateEntities();
                drawEntities('background');
                drawObjects('background');
                drawAvatar();
                drawEntities('foreground');
                drawObjects('foreground');
                drawBackground();
            }
        }
        requestAnimationFrame(runGame);
    }
    requestAnimationFrame(runGame);

  // Socket functionality
  var socketId;
  var allPlayers = [];

  // Tell server I've come to the landing page
  socket.emit('game joined');

  // Get my socket id from the Node server and send my player information to existing players. Then send updates after.
  var loopHandle;
  socket.off('create character');
  socket.on('create character', function(id) {  // Use this immediate response from the server to get my own socket id
    socketId = id;
    var charInfo = {   // My player info

    };
    allPlayers.push(charInfo); // Put myself in the array of players?
    socket.emit('send new player', charInfo); // Send my player information to other users
    loopHandle = setInterval(function() { // Send frequent updates to other players
      playerUpdate = {  // My updated info to be sent to all other players
      }
      allPlayers.forEach(function(player, index) {  // Update myself in the array?
        if (player.id === id) {
          allPlayers[index] = playerUpdate;
        }
      });
      socket.emit('player update', playerUpdate);
    }, 20);
  });

  // Receive an existing player's information if I just join a game
  socket.off('old player found');
  socket.on('old player found', function(oldCharInfo) {
    console.log("Found old player");
    // Add old player to array of players
    allPlayers.push(oldCharInfo);
  });

  // Receive a new player's information if I'm already playing when they join
  socket.off('new player joining');
  socket.on('new player joining', function(newCharInfo) {
    var response = {
      oldCharInfo: charInfo,
      id: newCharInfo.id
    };
    // Add new player to array of players
    allPlayers.push(newCharInfo);
    // Send my response back to the new player to let them know I was already here.
    socket.emit('send old player', response);
  });

  // Update an existing player's information (received at constant interval from every player)
  socket.off('updating player');
  socket.on('updating player', function(playerUpdate) {
    // Find the player who is being updated in the array, and update their details
  });

  // Notify me if a player leaves the game
  socket.off('player left');
  socket.on('player left', function(playerId) {
    console.log("Player left!");
    allPlayers.forEach(function(player, index) {
      if (player.id === playerId) {
        //Remove player from array here
      }
    });
  });

  $scope.$on("$destroy", function(){
    socket.emit('game left'); // Let others know that I left the game if the controller ceases (closing browser, etc)
    clearInterval(loopHandle);
  });

  // Send a text message to the server, to be broadcast to everyone.
  $('.chat-submit').submit(function(){
    socket.emit('chat message', $('.message').val());
    $('.message').val('');
    return false;   // Prevent default page refresh
  });
  // Receieve any broadcast message, and display it in the chat window.
  socket.off('chat message');
  socket.on('chat message', function(msg){
    $('.chat-messages').append($('<li>').text(playerInfo.userId + ': ' + msg));
  });

});
;angular.module('questCreator').controller('profileCtrl', function(socket, $state, $scope, UserService) {

    UserService.checkLogin().then(function(response) {

        $scope.games = null;
        $scope.requests = null;

        $scope.user = UserService.get();

        $scope.getJoinedDate = function(date) {
            return new Date(date);
        };

        UserService.getUserGames().done(function(games) {
            $scope.games = games;
            $scope.$apply();
            UserService.getCollabRequests().done(function(requests) {
              for (var i = 0; i < requests.length; i++) {
                for (var j = 0; j < games.length; j++) {
                  if (requests[i].game_id === games[j].id) {
                    requests[i].gameName = games[j].name;
                  }
                }
              }
              $scope.requests = requests;
              $scope.$apply();
            });
            UserService.getCollaborators().done(function(collaborators) {
              for (var i = collaborators.length - 1; i >= 0 ; i--) {
                console.log(collaborators[i].id, $scope.user.id);
                if (collaborators[i].user_id === $scope.user.id) {
                  collaborators.splice(i, 1);
                } else {}
                for (var j = 0; j < games.length; j++) {
                  if (collaborators[i].game_id === games[j].id) {
                    collaborators[i].gameName = games[j].name;
                  }
                }

              }
              $scope.collaborators = collaborators;
              $scope.$apply();
            });
        });



        UserService.getCollaborations().done(function(collaborations) {
            $scope.collaborations = collaborations;
            $scope.$apply();
        });

        $scope.createGame = function() {
            $scope.user.editGame = null;
            UserService.set($scope.user);
            $state.go('main.game.editor.views');
        };

        $scope.editGame = function(name) {
            $scope.user.editGame = name;
            UserService.set($scope.user);
            $state.go('main.game.editor.views');
        };

        $scope.archiveGame = function(game) {
            var agree = confirm("Are you sure you wanna archive '" + game.name + "'? That means no one will be able to play it and all player information will be lost. You will NOT be able to retrieve this later");
            if (agree) {
                UserService.archive(game.id);
                UserService.getUserGames().done(function(games) {
                    $scope.games = games;
                    $scope.$apply();
                });
            }
        };

        $scope.showCollaborators = function() {

        };

        $scope.showRequests = function() {

        };

        $scope.toggleCollab = function(info) {
            UserService.toggleAccepted(info.game_id, info.user_id);
        };

        $scope.removeRequest = function(collab) {
            UserService.toggleRequested(collab.game_id, collab.user_id);
        };

        $scope.removeCollaborator = function(collaborator) {
            UserService.toggleRequested(collaborator.game_id, collaborator.user_id);
            UserService.toggleAccepted(collaborator.game_id, collaborator.user_id);
        };

    });
});
;angular.module('questCreator').controller('sceneCtrl', function(socket, $state, $scope) {
  var self = this;

  this.selecting = {
    background: false,
    object: false,
    entity: false
  };

  this.selectedObject = null;
  this.selectedEntity = null;

  this.selectBackground = function(background) {
    console.log(background);
    $scope.editor.currentScene.background = background;
    self.selecting.background = false;
  }

  this.selectObject = function(object) {
    if (!object) {
      return;
    }
    console.log(object);
    $scope.editor.currentScene.objects.push(object);
    self.selecting.object = false;
  }

  this.selectEntity = function(entity) {
    if (!entity) {
      return;
    }
    // console.log(entity);
    console.log($scope.editor.currentScene.entities);
    $scope.editor.currentScene.entities.push(entity);
    console.log($scope.editor.currentScene.entities);
    self.selecting.entity = false;
  }

  this.saveScene = function(scene) {
    console.log("Turns out saving is unnecessary here. Here's the game as proof.");
    console.log($scope.editor.currentEditingGame);
  }


});
;angular.module('questCreator').controller('scriptsCtrl', function($state) {

});
;if (false) {

  // Thumbnail code:
  // In JS:
  // game.thumbnail = gameCanvas.toDataURL();
  // In HTML:
  // <img ng-cloak src="{{game.thumbnail}}">
  /* Also:
  clearCanvas();
  base_image = new Image();
  base_image.src = "./lib/images/logo.png";
  base_image.onload = function(){
    gameCtx.drawImage(base_image, 0, 0, gameWidth, gameHeight);
    self.thumbnail = gameCanvas.toDataURL();
    console.log(self.thumbnail);
  }
  */

  var headerData = {
    user_id: UserService.get().id,
    token: UserService.get().token
  };

  // returns 3 separate arrays of objects with all asset information
  $.ajax({
    method: 'GET',
    url: 'https://forge-api.herokuapp.com/articles/index',
    headers: headerData,
    success: function(response) {
      console.log(response);
    },
    error: function(error) {
      console.log(error);
    }
  });


  // returns correct objects still broken out into backgrounds, obstacles, and entities.
  var testData = {
    // tags needs to be userInput from search.  As of now, the tags are limited to one search term.
    tags: 'sky',
  };

  $.ajax({
    method: 'GET',
    url: 'https://forge-api.herokuapp.com/articles/search',
    data: testData,
    headers: headerData,
    success: function(response) {
      console.log(response);
    },
    error: function(error) {
      console.log(error);
    }
  });


  // returns all backgrounds
  $.ajax({
    method: 'GET',
    url: 'https://forge-api.herokuapp.com/backgrounds/index',
    success: function(response) {
      console.log(response);
    },
    error: function(error) {
      console.log(error);
    }
  });


  //returns all characters (including all data re:character) that match the user ID given - see note below

  $.ajax({
    method: 'GET',
    url: 'https://forge-api.herokuapp.com/characters/index',
    headers: headerData,
    success: function(response) {
      console.log(response);
    },
    error: function(error) {
      console.log(error);
    }
  });


  // returns only one character and data that match the truthfulness of current boolean
  $.ajax({
    method: 'GET',
    url: 'https://forge-api.herokuapp.com/characters/current_character',
    headers: headerData,
    success: function(response) {
      console.log(response);
    },
    error: function(error) {
      console.log(error);
    }
  });


  // returns array of entities objects
  $.ajax({
    method: 'GET',
    url: 'https://forge-api.herokuapp.com/entities/index',
    headers: headerData,
    success: function(response) {
      console.log(response);
    },
    error: function(error) {
      console.log(error);
    }
  });


  // returns games based on a search term in their tags column in the database or the specific name
  var testData = {
    // tags needs to be userInput from search.  As of now, the tags are limited to one search term.
    tags: 'war',
  };

  $.ajax({
    method: 'GET',
    url: 'https://forge-api.herokuapp.com/games/search',
    data: testData,
    headers: headerData,
    success: function(response) {
      console.log(response);
    },
    error: function(error) {
      console.log(error);
    }
  });


  // returns all games a user has created.
  $.ajax({
    method: 'GET',
    url: 'https://forge-api.herokuapp.com/games/user-games',
    headers: headerData,
    success: function(response) {
      console.log(response);
    },
    error: function(error) {
      console.log(error);
    }
  });


  //returns all maps - we should probably add some sort of data validation like, per game request which will req game_id be sent in the data body.
  $.ajax({
    method: 'GET',
    url: 'https://forge-api.herokuapp.com/maps/index',
    headers: headerData,
    success: function(response) {
      console.log(response);
    },
    error: function(error) {
      console.log(error);
    }
  });


  // returns a specific map if name CONTAINS any part of the searched word
  var testData = {
    // this should be searched data from the user
    name: 'map 1',
  };

  $.ajax({
    method: 'GET',
    url: 'https://forge-api.herokuapp.com/maps/search',
    data: testData,
    headers: headerData,
    success: function(response) {
      console.log(response);
    },
    error: function(error) {
      console.log(error);
    }
  });


  // returns all obstacles
  $.ajax({
    method: 'GET',
    url: 'https://forge-api.herokuapp.com/obstacles/index',
    headers: headerData,
    success: function(response) {
      console.log(response);
    },
    error: function(error) {
      console.log(error);
    }
  });


  // returns searched scenes
  var testData = {
    name: 'scene',
  };

  $.ajax({
    method: 'GET',
    url: 'https://forge-api.herokuapp.com/scenes/search',
    data: testData,
    headers: headerData,
    success: function(response) {
      console.log(response);
    },
    error: function(error) {
      console.log(error);
    }
  });
}
