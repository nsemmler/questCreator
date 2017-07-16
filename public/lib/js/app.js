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
              'events': {
                templateUrl: './src/views/game/editor/events.html',
                controller: 'eventsCtrl as events'
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
    this.action = 'stand';
    this.info.speed = {
      mag: 3,
      x: 0,
      y: 0
    };
    this.info.currentFrameIndex = 0;
    this.info.currentFrame = this.info.animate['walkDown'][this.info.currentFrameIndex];
    this.animateDelay = 10;
    this.animateTime = 0;
    this.scale = 1;
  }

  Avatar.prototype.updatePos = function() {
    this.info.pos.x += this.info.speed.x;
    this.info.pos.y += this.info.speed.y;
  };

  Avatar.prototype.checkAction = function() {
    var self = this;
    if (self.action === 'stand' || self.action === 'walkLeft' || self.action === 'walkUp' || self.action === 'walkRight' || self.action === 'walkDown') {
      switch (self.action) {
          case 'stand':
              self.info.speed.x = 0;
              self.info.speed.y = 0;
              break;
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
      if (self.animateTime > self.animateDelay) {
        // Animate the avatar.
        if (self.action !== 'stand') {
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
  }

  Avatar.prototype.stop = function() {
    this.action = 'stand';
    this.info.speed.x = 0;
    this.info.speed.y = 0;
  };

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
  };

  Avatar.prototype.teleport = function(pos) {
    this.info.pos = pos;
  };

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
    this.scale = 1;
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
.factory('PopupFactory', function ($compile, $q) {

  function create(content, title, scope) {
    // var defer = $q.defer();

    var popup = $('<popup>')
      .attr({
        'popup-title': '\"'+ title +'\"'
      }
      )
      .append(content);
    popup = $compile(popup)(scope);
    $(popup).prependTo('body');
    // return defer.promise;
  }

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
        terminal: true,
        link:  function (scope, element, attrs) {
            element.bind("keyup", function (event) {
                if(event.which === 13) {
                    element.blur();
                    // event.preventDefault();
                }
            });
        }
    }
});
;angular.module('questCreator').directive('elastic', ['$document', '$window', function($document, $window) {

    var wrapper = angular.element('<div style="position:fixed; top:-999px; left:0;"></div>');
    angular.element($document[0].body).append(wrapper);

    function getStyle(oElm, css3Prop){
        var strValue = "";

        if(window.getComputedStyle){
            strValue = getComputedStyle(oElm).getPropertyValue(css3Prop);

        } else if (oElm.currentStyle){ //IE
            try {
                strValue = oElm.currentStyle[css3Prop];
            } catch (e) {}
        }
        return strValue;
    }

    function getParentWidth(element) {

        var parent = element[0], width;

        do {
            parent = parent.parentNode;
            width = parseInt(getStyle(parent, 'width'), 10) - parseInt(getStyle(parent, 'padding-left'), 10) - parseInt(getStyle(parent, 'padding-right'), 10);

        } while( getStyle(parent, 'display') != 'block' && parent.nodeName.toLowerCase() != 'body' );

        return width + 'px';
    }

    function setMirrorStyle(mirror, element, attrs) {
        var style = $window.getComputedStyle(element[0]);
        var defaultMaxWidth = style.maxWidth === 'none' ? getParentWidth(element) : style.maxWidth;
        element.css('minWidth', attrs.puElasticInputMinwidth || style.minWidth);
        element.css('maxWidth', attrs.puElasticInputMaxwidth || defaultMaxWidth);

        angular.forEach(['fontFamily', 'fontSize', 'fontWeight', 'fontStyle',
            'letterSpacing', 'textTransform', 'wordSpacing'], function(value) {
            mirror.css(value, style[value]);
        });

        mirror.css('paddingLeft', style.textIndent);

        if (style.boxSizing === 'border-box') {
            angular.forEach(['paddingLeft', 'paddingRight',
                'borderLeftStyle', 'borderLeftWidth',
                'borderRightStyle', 'borderRightWidth'], function(value) {
                mirror.css(value, style[value]);
            });
        } else if (style.boxSizing === 'padding-box') {
            angular.forEach(['paddingLeft', 'paddingRight'], function(value) {
                mirror.css(value, style[value]);
            });
        }
    }

    return {
        restrict: 'A',
        link: function postLink(scope, element, attrs) {

            // Disable trimming inputs by default
            attrs.$set('ngTrim', attrs.ngTrim === 'true' ? 'true' : 'false');

            // Initial value of mirror is null character what should trigger initial width update
            var mirror = angular.element('<span style="white-space:pre;">&#000;</span>');
            setMirrorStyle(mirror, element, attrs);

            wrapper.append(mirror);

            function update() {

                var newValue = element.val() || attrs.placeholder || '';

                // If new value is the same value as previous one there is no need to update the styling
                if ( mirror.text() == newValue ) return;

                mirror.text( newValue );

                var delta = parseInt(attrs.puElasticInputWidthDelta) || 1;
                element.css('width', mirror.prop('offsetWidth') + delta + 'px');
            }

            update();

            scope.$watch(attrs.ngModel, update);
            element.on('keydown keyup focus input propertychange change', update);

            scope.$on('$destroy', function() {
                mirror.remove();
            });
        }
    };
}]);
;angular.module('questCreator')
.directive('focus', ['$timeout', '$parse', function ($timeout, $parse) {
    return {
        //scope: true,   // optionally create a child scope
        link: function (scope, element, attrs) {
            var model = $parse(attrs.focus);
            scope.$watch(model, function (value) {
                if (value === true) {
                    $timeout(function () {
                        element[0].focus();
                    });
                }
            });
        }
    };
}]);
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
      };
    },
    templateUrl: './src/views/popup.html',
    controller: function($scope) {
      $scope.killPopUp = function(){
        $scope.kill();
      };
    }
  };
});
;angular.module('questCreator').service('EditorService', function (UserService, $state, PopupService) {

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
      };
      return $.ajax({
        method: 'GET',
        url: 'https://forge-api.herokuapp.com/games/load',
        data: nameWrapper,
        success: function(response) {
          return response;
        },
        error: function(error) {
          PopupService.open('fail-game-load');
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
        entities: [],
        events: []
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
          createBackground('Title Screen', game.id);
          createCollaborator(game.id).done(function(response) {
            console.log(response);
          });
          return game;
        },
        error: function(error) {
          PopupService.openTemp('fail-game-create');
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
        published: game.published || false,
        thumbnail: game.info.maps[0].scenes[0][0].background.thumbnail
      };
      var slimGameData = angular.copy(gameUpdateData);
      slimGameData.info.maps.forEach(function(map) {
        map.scenes.forEach(function(row) {
          row.forEach(function(scene) {
            if (scene.background) {
              scene.background.thumbnail = null;
              scene.background.info = null;
            }
            if (scene.entities) {
              scene.entities.forEach(function(entity) {
                entity.thumbnail = null;
                entity.info.animate = null;
              });
            }
            if (scene.objects) {
              scene.objects.forEach(function(object) {
                object.thumbnail = null;
                object.info.collisionMap = null;
                object.info.image = null;
              });
            }
          });
        });
      });
      console.log("Game Save Object", slimGameData);
      var headerData = {
        user_id: UserService.get().id,
        token: UserService.get().token
      };
      return $.ajax({
        method: 'PUT',
        url: 'https://forge-api.herokuapp.com/games/update',
        headers: headerData,
        data: JSON.stringify(slimGameData),
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

    function createBackground(name, game_id, info, thumbnail) {
      var headerData = {
        user_id: UserService.get().id,
        token: UserService.get().token
      };
      var backgroundInfo = info || {
        image: [],
        collisionMap: []
      };
      var currentBackground = {
        thumbnail: thumbnail || null,
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

    function createObject(name, game_id, info) {
      var headerData = {
        user_id: UserService.get().id,
        token: UserService.get().token
      };
      var objectInfo = info || {
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

    function createEntity(name, game_id, info) {
      var headerData = {
        user_id: UserService.get().id,
        token: UserService.get().token
      };
      var entityInfo = info || {
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

    // NOTE I HAVE NO IDEA IF THIS WORKS, NOT TESTED YET:
    // --TOUPS

    function deleteEntity(currentEntity){
      return $.ajax({
        method: 'DELETE',
        url: 'https://forge-api.herokuapp.com/entities/delete',
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

    function createEvent(name, type, game_id) {
      var headerData = {
        user_id: UserService.get().id,
        token: UserService.get().token
      };
      var eventInfo = {
        requirements: [],
        triggers: [],
        results: {
          text: [],
          achievements: [],
          inventory: [],
          portal: {}
        }
      };
      var newEvent = {
        name: name,
        category: type,
        info: eventInfo,
        tags: [],
        published: false,
        game_id: game_id
      };
      return $.ajax({
        method: 'POST',
        url: 'https://forge-api.herokuapp.com/events/create',
        headers: headerData,
        data: JSON.stringify(newEvent),
        dataType: 'json',
        contentType: 'application/json',
        success: function(response) {
          console.log(response);
          return response;
        },
        error: function(error) {
          console.log(error);
        }
      });
    }

    function saveEvent(eventUpdate) {
      var saveData = {
        id: eventUpdate.id,
        info: eventUpdate.info,
        game_id: eventUpdate.game_id,
        published: eventUpdate.published,
        name: eventUpdate.name,
        tags: eventUpdate.tags,
        category: eventUpdate.category
      };
      console.log(saveData);
      var headerData = {
        user_id: UserService.get().id,
        token: UserService.get().token
      };
      return $.ajax({
        method: 'PUT',
        url: 'https://forge-api.herokuapp.com/events/update',
        headers: headerData,
        data: JSON.stringify(saveData),
        dataType: 'json',
        contentType: 'application/json',
        success: function(response) {
          console.log(response);
          return response;
        },
        error: function(error) {
          console.log(error);
        }
      });
    }

    function getAssetInfo(id, type) {
      if (type === 'objects') {
        type = 'obstacles';
      }
      var headerData = {
        user_id: UserService.get().id,
        token: UserService.get().token
      };
      return $.ajax({
         method: 'GET',
         url: 'https://forge-api.herokuapp.com/' + type + '/select',
         headers: headerData,
         data: {
           id: id
         },
         success: function(response) {
          //  console.log(response);
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
      getAssetInfo: getAssetInfo,
      createGame: createGame,
      saveGame: saveGame,
      createBackground: createBackground,
      saveBackground: saveBackground,
      createObject: createObject,
      saveObject: saveObject,
      createEntity: createEntity,
      saveEntity: saveEntity,
      deleteEntity: deleteEntity,
      createEvent: createEvent,
      saveEvent: saveEvent,
      copy: copy,
      paste: paste
    };
});
;angular.module('questCreator').service('GameService', function(PopupService) {

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
              PopupService.open('fail-game-load');
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
                PopupService.openTemp('fail-games-load');
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
        success: function(response) {
          return response;
        },
        error: function(error) {
          PopupService.openTemp('fail-games-load');
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
;angular.module('questCreator').service('StorageService', function (localStorageService) {
  function getSavedGames(gameName) {
    var allSavedGames = localStorageService.get('savedGames') || [];
    var yourSaves = allSavedGames[gameName];
    return yourSaves;
  }

  function setSavedGames(gameName, newSavedGames) {
    var allSavedGames = localStorageService.get('savedGames') || [];
    allSavedGames[gameName] = newSavedGames;
    localStorageService.set('savedGames', allSavedGames);
  }

  function getPlayingGame() {
    return localStorageService.get('currentPlaying') || null;
  }

  function setPlayingGame(gameName) {
    localStorageService.set('currentPlaying', gameName);
  }

  return {
    getSavedGames: getSavedGames,
    setSavedGames: setSavedGames,
    getPlayingGame: getPlayingGame,
    setPlayingGame: setPlayingGame
  };
});
;angular.module('questCreator').service('PaletteService', function (UserService, PopupService) {

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
              PopupService.openTemp('fail-assets-load');
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
        PopupService.openTemp('fail-assets-load');
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
        PopupService.openTemp('fail-assets-load');
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
    'about': {
      title: 'About:',
      content: 'about.html'
    },
    'video': {
      title: 'YazuaDPS:',
      content: 'video.html'
    },
    'welcome': {
      title: 'Welcome!',
      content: 'welcome.html'
    },
    'user-register': {
      title: 'Hey, you\'re new!',
      content: 'user-register.html'
    },
    'edit-username': {
      title: 'Change your name:',
      content: 'edit-username.html'
    },
    'edit-game': {
      title: 'Awesome! Now you\'re editing:',
      content: 'edit-game.html'
    },
    'create-game': {
      title: 'Name your game:',
      content: 'create-game.html'
    },
    'signin-to-continue': {
      title: 'Please...',
      content: 'signin-to-continue.html'
    },
    'loading-screen': {
      title: 'Loading...',
      content: 'loading-screen.html'
    },
    'fail-user-load': {
      title: 'Oops!',
      content: 'fail-user-load.html'
    },
    'fail-user-games': {
      title: 'Oops!',
      content: 'fail-user-games.html'
    },
    'fail-collab-load': {
      title: 'Oops!',
      content: 'fail-collab-load.html'
    },
    'fail-game-load': {
      title: 'Oops!',
      content: 'fail-game-load.html'
    },
    'fail-games-load': {
      title: 'Oops!',
      content: 'fail-games-load.html'
    },
    'fail-game-create': {
      title: 'Oops!',
      content: 'fail-game-create.html'
    },
    'fail-request-collab': {
      title: 'Oops!',
      content: 'fail-request-collab.html'
    },
    'fail-assets-load': {
      title: 'Oops!',
      content: 'fail-assets-load.html'
    },
    'fail-game-archive': {
      title: 'Oops!',
      content: 'fail-game-archive.html'
    },
    'alert-request-sent': {
      title: 'Delivered:',
      content: 'alert-request-sent.html'
    },
    'alert-request-resent': {
      title: 'Delivered:',
      content: 'alert-request-resent.html'
    },
    'alert-already-requested': {
      title: 'Chill:',
      content: 'alert-already-requested.html'
    },
    'alert-already-collab': {
      title: 'Wait a minute...',
      content: 'alert-already-collab.html'
    },
    'alert-game-archived': {
      title: 'Done',
      content: 'alert-game-archived.html'
    },
    'event-prompt': {
      title: 'Choose event type:',
      content: 'event-prompt.html'
    }
  };

  function templateSelector(name, scope) {
    scope = scope || $rootScope.$$childHead;
    var template = path + templates[name].content;
    var content = $('<ng-include>').attr('src', '\''+ template+ '\'');
    $rootScope.$$childHead.popupTemp = false;
    PopupFactory.new(content, templates[name].title, scope);
  }

  function templateSelectorTemp(name, scope) {
    scope = scope || $rootScope.$$childHead;
    var template = path + templates[name].content;
    var content = $('<ng-include>').attr('src', '\''+ template+ '\'');
    $rootScope.$$childHead.popupTemp = true;
    PopupFactory.new(content, templates[name].title, scope);
      setTimeout(function () {
        close();
      }, 1500);
  }

  function close() {
    $('#overlay').remove();
  }



  return {
    open: templateSelector,
    openTemp: templateSelectorTemp,
    close: close
  };
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
    .service('UserService', function(PopupService, $rootScope) {
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
            return $.ajax({
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
                    PopupService.openTemp('alert-game-archived');
                },
                error: function(error) {
                    PopupService.openTemp('fail-game-archive');
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
                auth2.isSignedIn.listen(updateSignInStatus);
                updateSignInStatus(auth2.isSignedIn.get());
            });
        }

        function updateSignInStatus(isSignedIn) {
            if (isSignedIn) {
              $rootScope.$$childHead.main.loggedIn = true;
                getLogin();
            } else {
              $rootScope.$$childHead.main.loggedIn = false;
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
                        setTimeout(function() {
                          PopupService.openTemp('welcome');
                        }, 500);
                        loggedIn = true;
                    },
                    error: function(error) {
                        if (error.status === 404) {
                            // $('#register-form').css('display', 'flex');
                            PopupService.open('user-register');
                        } else if (error.status === 0) {
                            // Do nothing
                        } else {
                            PopupService.openTemp('fail-user-load');
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
                    PopupService.close();
                },
                error: function(error) {
                  PopupService.close();
                  PopupService.openTemp('fail-user-load');
                    signOut();
                }
            });
        }

        function editUsername(newName) {
          console.log(newName);
            user.username = newName;
            return $.ajax({
              method: 'PATCH',
              url: 'https://forge-api.herokuapp.com/users/update',
              headers: {
                  user_id: user.id,
                  token: user.token
              },
              data: {
                username: newName
              },
              success: function (response) {
                return response;
              },
              error: function (error) {

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
                    PopupService.openTemp('fail-user-games');
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
                success: function(response) {
                    // console.log(response);
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
                success: function(response) {
                    // console.log('success requests', response);
                },
                error: function(error) {
                  console.clear();
                    PopupService.openTemp('fail-collab-load');
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
                    // console.log('success collaborators', response);
                },
                error: function(error) {
                  PopupService.openTemp('fail-collab-load');
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
                    // console.log('success collaborations', response);
                },
                error: function(error) {
                  PopupService.openTemp('fail-collab-load');
                }
            });
        }

        function toggleAccepted(gameId, requesterId) {
            return $.ajax({
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
                    // console.log(response);
                },
                error: function(error) {
                    console.log(error);
                }
            });
        }

        function toggleRequested(gameId, requesterId) {
          console.log(gameId, requesterId);
            return $.ajax({
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
                    // console.log(response);
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
                    // console.log(response);
                },
                error: function(error) {
                    console.log(error);
                }
            });
        }

        function getPlayerAvatar() {
          return $.ajax({
              method: 'GET',
              url: 'https://forge-api.herokuapp.com/users/avatar',
              headers: {
                  user_id: user.id,
                  token: user.token
              },
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

        function getAvatars() {
          return $.ajax({
              method: 'GET',
              url: 'https://forge-api.herokuapp.com/entities/user',
              headers: {
                  user_id: user.id,
                  token: user.token
              },
              dataType: 'json',
              contentType: 'application/json',
              success: function(response) {
                // console.log(response);
                  return response;
              },
              error: function(error) {
                  console.log(error);
              }
          });
        }

        function updateAvatar(current, id) {
          console.log(current, id);
          $.ajax({
              method: 'PATCH',
              url: 'https://forge-api.herokuapp.com/entities/make-current',
              headers: {
                  user_id: user.id,
                  token: user.token
              },
              data: {
                current: current,
                id: id
              },
              success: function(response) {
                // console.log(response);
                  return response;
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
            getAvatars: getAvatars,
            updateAvatar: updateAvatar,
            getPlayerAvatar: getPlayerAvatar,
            archive: archiveGame,
            register: registerUser,
            editUsername: editUsername,
            signOut: signOut,
            signIn: signIn,
            checkLogin: checkLogin
        };
    });
;angular.module('questCreator').controller('bgCtrl', function($state, $scope, EditorService) {
  var self = this;      // To help with scope issues
  var drawingBackground = false;
  var currentMouseX = null;
  var currentMouseY = null;
  var mouseIsDown = false;
  var mouseMoveEvent;       // Global variable to track mouse movement events
  var touchMoveEvent;       // Global variable to track touch movement events
  var mobileWidth = 850;    // Width for mobile screen sizes
  var tabletWidth = 1100;   // Width for tablet screen sizes
  var tabletScale = 1.4;
  var mobileScaleX = 2.5;
  var mobileScaleY = 1.6;
  var moveType = '';    // Either mouse or touch
  var undoBackgroundArray = [];   //Array to keep track of background objects that were undone.
  var undoCollisionArray = [];
  this.currentColor = $scope.editor.currentColor;    // Value of color input in draw.html
  this.myCanvas = document.getElementById('bg-canvas');  // Canvas html element
  this.canvasPos = {    // Canvas top and left coordinates on page
    x: self.myCanvas.getBoundingClientRect().left,
    y: self.myCanvas.getBoundingClientRect().top
  };
  this.draw = this.myCanvas.getContext('2d'); // Canvas context
  var canvasWidth = self.myCanvas.width;
  var canvasHeight = self.myCanvas.height;
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
  function Square(x, y, width, height, color, type, teleportTarget, deathDescription) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.color = color;
    this.type = type;
    var self = this;
    if (teleportTarget) {
      self.teleportTarget = teleportTarget;
    }
    if (deathDescription) {
      self.deathDescription = deathDescription;
    }
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
    //NOTE probably can edit this out eventually^
  });

  // Called when the mouse button is pressed.
  // Starts the interval to run every 100ms while the mouse button is still held down.
  // Only start the interval if it is not already running.
  function mouseDown(event) {
    mouseIsDown = true;
    // if (drawHandle === -1) {
    //   drawHandle = setInterval(mousePressed, 100);
    // }
  }

  // Called when the mouse button is released.
  // If the interval is running, then clear it and reset it.
  function mouseUp(event) {
    mouseIsDown = false;
    // if (drawHandle !== -1) {
    //   clearInterval(drawHandle);
    //   drawHandle = -1;
    // }
  }

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

  function drawGrid() {
    self.draw.clearRect(0, 0, canvasWidth, canvasHeight);
    drawBackgroundSquares();
    drawCollisionSquares();
    var drawSize = $scope.editor.currentPixelSize;
    self.canvasPos = {    // Canvas top and left coordinates on page
      x: self.myCanvas.getBoundingClientRect().left,
      y: self.myCanvas.getBoundingClientRect().top
    };
    var numSquaresX = 70;
    var numSquaresY = 50;
    var gridWidth = canvasWidth / numSquaresX;
    var gridHeight = canvasHeight / numSquaresY;
    var color = $scope.editor.drawingCollision ? 'rgba(100, 50, 0, 0.5)' : $scope.editor.currentColor;
    if ($scope.editor.drawingCollision && $scope.editor.collisionType == 'teleport') {
      color = 'rgba(0, 0, 255, 0.5)';
    } else if ($scope.editor.drawingCollision && $scope.editor.collisionType == 'swim') {
      color = 'rgba(0, 100, 100, 0.5)'
    } else if ($scope.editor.drawingCollision && $scope.editor.collisionType == 'death') {
      color = 'rgba(0, 0, 0, 0.5)'
    }
    self.draw.fillStyle = color;
    for (var xIndex = -drawSize; xIndex <= drawSize; xIndex++) {
      for (var yIndex = -drawSize; yIndex <= drawSize; yIndex++) {
        var rectX = Math.floor( (currentMouseX - self.canvasPos.x) / gridWidth + xIndex) * gridWidth;
        var rectY = Math.floor( (currentMouseY - self.canvasPos.y) / gridHeight + yIndex) * gridHeight;
        if ($scope.editor.erasing) {
          self.draw.strokeStyle = 'black';
          self.draw.strokeRect(rectX, rectY, gridWidth, gridHeight);
        } else {
          self.draw.fillRect(rectX, rectY, gridWidth, gridHeight);
        }
        if (mouseIsDown) {
          if (!$scope.editor.drawingCollision) {
            var squaresToRemove = [];
            self.allBackgroundSquares.forEach(function(square) {
              if ( rectX === square.x && rectY === square.y) {
                // console.log("Erasing old squares!");
                squaresToRemove.push(self.allBackgroundSquares.indexOf(square));
              }
            });
            squaresToRemove.forEach(function(index) {
              self.allBackgroundSquares.splice(index, 1);
            });
          } else if ($scope.editor.drawingCollision) {
            var squaresToRemove = [];
            self.allCollisionSquares.forEach(function(square) {
              if ( rectX === square.x && rectY === square.y) {
                squaresToRemove.push(self.allCollisionSquares.indexOf(square));
              }
            });
            squaresToRemove.forEach(function(index) {
              self.allCollisionSquares.splice(index, 1);
            });
          }
        }
        if (mouseIsDown && !$scope.editor.erasing) {
          // console.log("Drawing New Square!");
          var type = $scope.editor.drawingCollision ? $scope.editor.collisionType : 'normal';
          var teleportTarget = $scope.editor.teleportTarget;
          if ($scope.editor.collisionType == 'teleport') {
            var newSquare = new Square(rectX, rectY, gridWidth, gridHeight, color, type, teleportTarget);
          } else if ($scope.editor.collisionType == 'death') {
            var newSquare = new Square(rectX, rectY, gridWidth, gridHeight, color, type, null, deathDescription);
          } else {
            var newSquare = new Square(rectX, rectY, gridWidth, gridHeight, color, type);
          }
          if ($scope.editor.drawingCollision) {
            self.allCollisionSquares.push(newSquare);
          } else {
            self.allBackgroundSquares.push(newSquare);
          }
        }
      }
    }
    self.draw.beginPath();
    for (var index = 0; index <= canvasWidth; index += gridWidth) {
      self.draw.moveTo(index, 0);
      self.draw.lineTo(index, canvasHeight);
    }
    for (var index = 0; index <= canvasHeight; index += gridHeight) {
      self.draw.moveTo(0, index);
      self.draw.lineTo(canvasWidth, index);
    }
    self.draw.strokeStyle = 'rgba(75, 75, 75, 0.8)';
    self.draw.stroke();
    self.draw.closePath();
    // console.log("Background array", self.allBackgroundSquares);
    // console.log("Collision array", self.allCollisionSquares);
    if (drawingBackground) {
      requestAnimationFrame(drawGrid);
    } else {
      self.draw.clearRect(0, 0, canvasWidth, canvasHeight);
      drawBackgroundSquares();
    }
  }
  // if (loopHandle) {
  //   clearInterval(loopHandle);
  // }
  // var loopHandle = setInterval(drawGrid, 50);

  // When the user clicks the undo button, remove the last element from the object array and push it to the undo array, based on current drawing type. Then redraw canvas.
  $('#tool-bar').on('click', '#undoBackground', function() {
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
  });

  // When the user clicks the redo button, remove the last element from the undo array and push it to the object array, based on current drawing type. Then redraw canvas.
  $('#tool-bar').on('click', '#redoBackground', function() {
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
  });

  // When the Clear Canvas button is clicked, make the current Background and current Scene empty objects and reload the view.
  // Note: may need extra testing here.
  $('#tool-bar').on('click', '#clearBackground', function() {
    canvasWidth = self.myCanvas.width;
    canvasHeight = self.myCanvas.height;
    self.draw.clearRect(0, 0, canvasWidth, canvasHeight);
    self.allBackgroundSquares = [];
    self.allCollisionSquares = [];
    var undoBackgroundArray = [];
    var undoCollisionArray = [];
  });

  $('#scene').on('click', '#saveBackground', function() {
    console.log("Saving!");
    EditorService.saveBackground(self.allBackgroundSquares, self.allCollisionSquares, $scope.editor.currentBackground, self.myCanvas.toDataURL()).done(function(background) {
      console.log(background);
    });
  });

  // When the mouse is pressed, released, moved, or leaves the canvas, run the corresponding function.
  $(self.myCanvas).on('mousedown', mouseDown);
  $(self.myCanvas).on('mouseup', mouseUp);
  $(self.myCanvas).on('mouseenter', function() {
    drawingBackground = true;
    requestAnimationFrame(drawGrid);
  });
  $(self.myCanvas).on('mouseleave', function() {
    drawingBackground = false;
  });
  $(self.myCanvas).on('mousemove', function(event) {
    currentMouseX = event.clientX;
    currentMouseY = event.clientY;
  });

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
;angular.module('questCreator').controller('detailCtrl', function ($state, GameService, UserService, PopupService) {

    this.playGame = function (name) {
        $state.go('main.game.play');
    };

    this.game = GameService.getGameDetail();
    console.log(this.game);

    this.sendCollabRequest = function (gameId) {
      var request = UserService.validateCollabRequest(gameId).done(function (response) {
        if (response.message){
          UserService.sendCollabRequest(gameId);
          PopupService.openTemp('alert-request-sent');
        } else if (response.requested && !response.accepted) {
          PopupService.openTemp('alert-already-requested');
        } else if (!response.requested && !response.accepted) {
          PopupService.open('alert-request-resent');
          UserService.requestAgain(gameId);
        } else if (response.requested && response.accepted) {
          PopupService.open('alert-already-collab');
        } else {
          PopupService.openTemp('fail-request-collab');
        }
      });
    };

    //This is for testing only
    this.players = [
      {
        name: 'billy bad',
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
        this.currentEvent = null;
        //NOTE probably can remove:
        // this.currentSceneImg = {};
        //NOTE probably can remove^
        this.currentLargeView = 'map';
        this.currentSmallView = 'welcome';
        this.assetsView = 'backgrounds';
        this.qState = {
          undo: 'undoBackground',
          redo: 'redoBackground',
          clear: 'clearBackground'
        };
        this.availableBackgrounds = [];
        this.availableObjects = [];
        this.availableEntities = [];
        this.availableEvents = [];
        this.eventTypes = [{
            name: 'text',
            description: 'Events triggered by text input.',
          }, {
            name: 'location',
            description: 'Events triggered by player position.'
        }];
        this.eventType = null;
        this.eventRequirements = [
            'inventory',
            'achievement'
        ];
        this.selectedAnimation = "walkLeft";

        this.currentColor = 'green';
        this.inputColor = 'green';
        this.colorPalette = {
          1: "skyblue",
          2: "green",
          3: "brown",
          4: "orange"
        };
        this.currentPixelSize = 4;
        this.drawingCollision = false;
        this.collisionType = 'wall';
        this.teleportTarget = {
          map: {},
          scene: {},
          pos: {
            x: 100,
            y: 100
          }
        };
        this.deathDescription = {
          text: "Game Over! Thanks for playing."
        };
        this.erasing = false;
        this.selectingAssets = false;
        this.currentFrameIndex = 0;
        this.modeledFrameIndex = 0; // For some reason ng-model is being wacky for the first click of navigating entity frames. This is the duct tape solution.
        this.dragIndex = null;
        this.dragAsset = null;

        this.goToPalette = function(type) {
            self.selectingAssets = true;
            $scope.$broadcast('paletteInit', {
                type: type
            });
        };

        this.selectColor = function(index) {
            // Convert hex color to rgb
            var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(self.inputColor);
            // console.log("color result: ", result);
            var rgb = result ? {
                r: parseInt(result[1], 16),
                g: parseInt(result[2], 16),
                b: parseInt(result[3], 16)
            } : null;
            self.colorPalette[index] = 'rgb(' + rgb.r + ', ' + rgb.g + ', ' + rgb.b + ')';
        };

        if (this.currentEditingGame.name === null) {
            PopupService.close();
            PopupService.open('create-game', $scope);
        } else {
            PopupService.close();
            PopupService.open('edit-game', $scope);
        }

        this.cancel = function() {
            PopupService.close();
            $state.go('main.profile');
        };


        this.createNewGame = function(name) {
            PopupService.close();
            EditorService.createGame(name).done(function(game) {
                // console.log(game);
                self.currentEditingGame = game;
                EditorService.getGameAssets(game.id).done(function(assets) {
                    // console.log(assets);
                    self.availableBackgrounds = assets.availableBackgrounds;
                    self.availableObjects = assets.availableObstacles;
                    self.availableEntities = assets.availableEntities;
                    self.availableEvents = assets.availableEvents;
                    self.currentBackground = self.availableBackgrounds[0] || null;
                    $scope.$apply();
                });
            });
            UserService.setGameEdit(name);
        };

        this.editGame = function() {
            PopupService.close();
            $scope.assetsToLoad = 0;
            $scope.assetsLoaded = 0;
            PopupService.open('loading-screen', $scope);
            EditorService.getGame(self.currentEditingGame.name).done(function(game) {
                self.currentEditingGame = game;
                EditorService.getGameAssets(game.id).done(function(assets) {
                    self.availableBackgrounds = assets.availableBackgrounds;
                    self.availableObjects = assets.availableObstacles;
                    self.availableEntities = assets.availableEntities;
                    self.availableEvents = assets.availableEvents;
                    game.info.maps.forEach(function(map) {
                      map.scenes.forEach(function(row) {
                        row.forEach(function(scene) {
                          if (scene.background) {
                            $scope.assetsToLoad++;
                            var backgroundId = scene.background.id;
                            // console.log(scene.background.info);
                            EditorService.getAssetInfo(backgroundId, 'backgrounds').done(function(info) {  // Get each background's info from the database
                                scene.background.info = info;
                                // console.log("Found background info!", scene.background.info);
                                $scope.assetsLoaded++;
                                $scope.$apply();
                            });
                            assets.availableBackgrounds.forEach(function(availableBackground) {
                              if (backgroundId === availableBackground.id) {
                                // console.log("Background match found!");
                                scene.background.thumbnail = availableBackground.thumbnail;
                              }
                            });
                          }
                          if (scene.entities) {
                            $scope.assetsToLoad += scene.entities.length;
                            scene.entities.forEach(function(entity) {
                              var entityId = entity.id;
                              // console.log(entity.info);
                              EditorService.getAssetInfo(entityId, 'entities').done(function(info) {  // Get each entity's info from the database
                                  entity.info.animate = info.animate;
                                  // console.log("Found entity info!", entity.info);
                                  $scope.assetsLoaded++;
                                  $scope.$apply();
                              });
                              assets.availableEntities.forEach(function(availableEntity) {
                                if (entityId === availableEntity.id) {
                                  // console.log("Entity match found!");
                                  entity.thumbnail = availableEntity.thumbnail;
                                }
                              });
                            });
                          }
                          if (scene.objects) {
                            $scope.assetsToLoad += scene.objects.length;
                            scene.objects.forEach(function(object) {
                              var objectId = object.id;
                              // console.log(object.info);
                              EditorService.getAssetInfo(objectId, 'objects').done(function(info) {  // Get each object's info from the database
                                  object.info.collisionMap = info.collisionMap;
                                  object.info.image = info.image;
                                  // console.log("Found object info!", object.info);
                                  $scope.assetsLoaded++;
                                  $scope.$apply();
                              });
                              assets.availableObstacles.forEach(function(availableObject) {
                                if (objectId === availableObject.id) {
                                  // console.log("Object match found!");
                                  object.thumbnail = availableObject.thumbnail;
                                }
                              });
                            });
                          }
                        });
                      });
                    });
                    var checkGameLoadLoop = setInterval(function() {
                      // console.log("Loading " + $scope.assetsToLoad + " assets.");
                      // console.log($scope.assetsLoaded + " assets loaded.");
                      var finishedLoading = false;
                      if ($scope.assetsLoaded >= $scope.assetsToLoad) {
                        finishedLoading = true;
                      }
                      if (finishedLoading) {
                        // console.log("Game Loaded!",game);
                        clearInterval(checkGameLoadLoop);
                        $scope.$apply();
                        PopupService.close();
                      }
                    }, 200);
                });
            });
            $('.edit-game').hide();
        };

        this.saveGame = function() {
          PopupService.close();
          PopupService.open('loading-screen');
            EditorService.saveGame(self.currentEditingGame).done(function(savedGame) {
                // console.log("Saved Game:", savedGame);
                PopupService.close();
            });
        };

        this.publishGame = function() {
            self.currentEditingGame.published = true;
            this.saveGame();
        };

        this.assetNamer = function(name, address) {
            if (self[address].filter(function(asset) {
                    return asset.name.includes(name.toLowerCase());
                })) {
                var num = 1;
                self[address].forEach(function(value) {
                    num = (value.name.includes(name.toLowerCase())) ? num + 1 : num;
                });
                name = name + " " + num;
            }
            return name;
        };

        this.createBackground = function() {
            var name = "New Background";
            var game_id = self.currentEditingGame.id;
            name = self.assetNamer(name, 'availableBackgrounds');
            EditorService.createBackground(name, game_id).done(function(background) {
                // console.log(background);
                self.availableBackgrounds.push(background);
                self.currentBackground = background;
                $scope.$apply();
            });
        };

        this.editBackground = function(background) {
            EditorService.getAssetInfo(background.id, 'backgrounds').done(function(info) {
                background.info = info;
                self.currentBackground = background;
                $scope.$broadcast('redrawBackground', background.info.image, background.info.collisionMap);
                $scope.$apply();
            });
        };

        this.createObject = function() {
            var name = "New Object";
            var game_id = self.currentEditingGame.id;
            name = self.assetNamer(name, 'availableObjects');
            EditorService.createObject(name, game_id).done(function(object) {
                // console.log(object);
                self.availableObjects.push(object);
                self.currentObject = object;
                self.currentSmallView = 'object';
                $scope.$apply();
            });
        };

        this.editObject = function(object) {
            EditorService.getAssetInfo(object.id, 'obstacles').done(function(info) {
                object.info = info;
                self.currentObject = object;
                self.currentSmallView = 'object';
                self.qState = {
                  undo: 'undoObject',
                  redo: 'redoObject',
                  clear: 'clearObject'
                };
                $scope.$broadcast('redrawObject', object.info.image, object.info.collisionMap);
                $scope.$apply();
            });
        };

        this.createEntity = function() {
            var name = "New Entity";
            var game_id = self.currentEditingGame.id;
            name = self.assetNamer(name, 'availableEntities');
            EditorService.createEntity(name, game_id).done(function(entity) {
                PopupService.close();
                self.availableEntities.push(entity);
                self.currentEntity = entity;
                self.currentSmallView = 'entity';
                $scope.$apply();
            });
        };

        this.editEntityFrame = function(entity) {
            self.currentFrameIndex = self.modeledFrameIndex || 0;
            EditorService.getAssetInfo(entity.id, 'entities').done(function(info) {
                entity.info = info;
                // console.log(entity);
                self.currentEntity = entity;
                self.currentSmallView = 'entity';
                self.qState = {
                  undo: 'undoEntity',
                  redo: 'redoEntity',
                  clear: 'clearEntity'
                };
                $scope.$broadcast('redrawEntity',entity.info.animate[self.selectedAnimation][self.currentFrameIndex].image, entity.info.animate[self.selectedAnimation][self.currentFrameIndex].collisionMap);
                $scope.$apply();
            });
        };

        this.selectEventType = function() {
            PopupService.open('event-prompt', $scope);
        };

        this.createEvent = function(type) {
            var name = "New Event";
            var game_id = self.currentEditingGame.id;
            EditorService.createEvent(name, type, game_id).done(function(event) {
                PopupService.close();
                self.availableEvents.push(event);
                self.currentEvent = event;
                self.currentSmallView = 'event';
                $scope.$apply();
            });
        };

        this.editEvent = function(event) {
            self.currentEvent = event;
            self.currentSmallView = 'event';
            $scope.$apply();
        };

        this.setThumbnail = function(asset) {
          if (asset) {
            if (asset === undefined || !asset.thumbnail) {
                return {
                    "background-image": "none"
                };
            } else {
                return {
                    "background-image": 'url("' + asset.thumbnail + '")',
                    "background-size": "contain",
                    "background-position": "center",
                    "background-repeat": "no-repeat"
                };
            }
          }
        };

        this.selectText = function($event) {
            $event.target.select();
        };

        this.positionAsset = function(asset) {
            return {
                'top': asset.info.pos.y,
                'left': asset.info.pos.x,
                'position': 'absolute'
            };
        };

        this.dragPositionAsset = function(index, type) {
            self.dragIndex = {
                index: index,
                type: type
            };
        };

        this.dragAvailableAsset = function(asset, type) {
            self.dragAsset = {
                asset: asset,
                type: type
            };
        };

        this.removeAsset = function(index, type) {
            self.currentScene[type].splice(index, 1);
        };

        //jquery UI Stuff
        this.uiDrag = function() {
            this.dragCalls++;
            $('.asset-in-scene').draggable({
                start: function(event, ui) {
                    $(ui.helper).addClass('grabbed');
                },
                stop: function(event, ui) {
                    $(ui.helper).css({
                        'transition': 'transform ease 100ms'
                    }).removeClass('grabbed');
                }
            });

            $('.asset.available').draggable({
                helper: function() {
                    var url = self.dragAsset.asset.thumbnail;
                    return $('<img>').attr('src', url).appendTo('#editor');
                },
                start: function(event, ui) {
                    $(ui.helper).addClass('grabbed');
                },
                stop: function(event, ui) {
                    $(ui.helper).css({
                        'transition': 'transform ease 100ms'
                    }).removeClass('grabbed');
                }
            });

            $('#scene-BG').droppable({
                drop: function(event, ui) {
                    // If already in scene editor view:
                    if (ui.draggable[0].className.toString().includes('-in-scene')) {
                        var type = self.dragIndex.type;
                        var index = self.dragIndex.index;
                        $scope.editor.currentScene[type][index].info.pos.x = ui.position.left;
                        $scope.editor.currentScene[type][index].info.pos.y = ui.position.top;
                        $scope.$apply();
                    }
                    // If dragging from available assets bar
                    else if (ui.draggable[0].className.toString().includes('available')) {
                        var type = self.dragAsset.type;
                        var asset = self.dragAsset.asset;
                        var offset = $('#scene-BG').offset();
                        EditorService.getAssetInfo(asset.id, type).done(function(info) {
                            // console.log(info);
                            asset.info = info;
                            asset.info.pos.x = event.pageX - offset.left;
                            asset.info.pos.y = event.pageY - offset.top;
                            $scope.editor.currentScene[type].push(asset);
                            $scope.$apply();
                        });
                    }
                }
            });
        };
    });
;angular.module('questCreator').controller('entCtrl', function($state, $scope, EditorService) {
  var self = this;      // To help with scope issues
  var drawingEntity = false;
  var currentMouseX = null;
  var currentMouseY = null;
  var mouseIsDown = false;
  var mouseMoveEvent;       // Global variable to track mouse movement events
  var touchMoveEvent;       // Global variable to track touch movement events
  var mobileWidth = 850;    // Width for mobile screen sizes
  var tabletWidth = 1100;   // Width for tablet screen sizes
  var tabletScale = 1.4;
  var mobileScaleX = 2.5;
  var mobileScaleY = 1.6;
  var moveType = '';    // Either mouse or touch
  var undoBackgroundArray = [];   //Array to keep track of background objects that were undone.
  var undoCollisionArray = [];
  this.currentColor = $scope.editor.currentColor;    // Value of color input in draw.html
  this.myCanvas = document.getElementById('ent-canvas');  // Canvas html element
  this.canvasPos = {    // Canvas top and left coordinates on page
    x: self.myCanvas.getBoundingClientRect().left,
    y: self.myCanvas.getBoundingClientRect().top
  };
  this.draw = this.myCanvas.getContext('2d'); // Canvas context
  var canvasWidth = self.myCanvas.width;
  var canvasHeight = self.myCanvas.height;
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

  // Called when the mouse button is pressed.
  function mouseDown(event) {
    mouseIsDown = true;
  }

  // Called when the mouse button is released.
  function mouseUp(event) {
    mouseIsDown = false;
  }

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

  function drawGrid() {
    self.draw.clearRect(0, 0, canvasWidth, canvasHeight);
    drawBackgroundSquares();
    drawCollisionSquares();
    var drawSize = $scope.editor.currentPixelSize;
    self.canvasPos = {    // Canvas top and left coordinates on page
      x: self.myCanvas.getBoundingClientRect().left,
      y: self.myCanvas.getBoundingClientRect().top
    };
    var numSquaresX = 20;
    var numSquaresY = 20;
    var gridWidth = canvasWidth / numSquaresX;
    var gridHeight = canvasHeight / numSquaresY;
    var color = $scope.editor.drawingCollision ? 'rgba(100, 100, 100, 0.5)' : $scope.editor.currentColor;
    if ($scope.editor.drawingCollision && $scope.editor.collisionType !== 'wall') {
      color = 'rgba(0, 0, 255, 0.5)';
    }
    var type = $scope.editor.drawingCollision ? $scope.editor.collisionType : 'normal';
    self.draw.fillStyle = color;
    for (var xIndex = -drawSize; xIndex <= drawSize; xIndex++) {
      for (var yIndex = -drawSize; yIndex <= drawSize; yIndex++) {
        var rectX = Math.floor( (currentMouseX - self.canvasPos.x) / gridWidth + xIndex) * gridWidth;
        var rectY = Math.floor( (currentMouseY - self.canvasPos.y) / gridHeight + yIndex) * gridHeight;
        if ($scope.editor.erasing) {
          self.draw.strokeStyle = 'black';
          self.draw.strokeRect(rectX, rectY, gridWidth, gridHeight);
        } else {
          self.draw.fillRect(rectX, rectY, gridWidth, gridHeight);
        }
        if (mouseIsDown) {
          if (!$scope.editor.drawingCollision) {
            var squaresToRemove = [];
            self.allBackgroundSquares.forEach(function(square) {
              if ( rectX === square.x && rectY === square.y) {
                // console.log("Erasing old squares!");
                squaresToRemove.push(self.allBackgroundSquares.indexOf(square));
              }
            });
            squaresToRemove.forEach(function(index) {
              self.allBackgroundSquares.splice(index, 1);
            });
          } else if ($scope.editor.drawingCollision) {
            var squaresToRemove = [];
            self.allCollisionSquares.forEach(function(square) {
              if ( rectX === square.x && rectY === square.y) {
                squaresToRemove.push(self.allCollisionSquares.indexOf(square));
              }
            });
            squaresToRemove.forEach(function(index) {
              self.allCollisionSquares.splice(index, 1);
            });
          }
        }
        if (mouseIsDown && !$scope.editor.erasing) {
          // console.log("Drawing New Square!");
          var newSquare = new Square(rectX, rectY, gridWidth, gridHeight, color, type);
          // newSquare.draw();
          if ($scope.editor.drawingCollision) {
            self.allCollisionSquares.push(newSquare);
          } else {
            self.allBackgroundSquares.push(newSquare);
          }
        }
      }
    }
    self.draw.beginPath();
    for (var index = 0; index <= canvasWidth; index += gridWidth) {
      self.draw.moveTo(index, 0);
      self.draw.lineTo(index, canvasHeight);
    }
    for (var index = 0; index <= canvasHeight; index += gridHeight) {
      self.draw.moveTo(0, index);
      self.draw.lineTo(canvasWidth, index);
    }
    self.draw.strokeStyle = 'rgba(75, 75, 75, 0.8)';
    self.draw.stroke();
    self.draw.closePath();
    // console.log("Background array", self.allBackgroundSquares);
    // console.log("Collision array", self.allCollisionSquares);
    if (drawingEntity) {
      requestAnimationFrame(drawGrid);
    } else {
      self.draw.clearRect(0, 0, canvasWidth, canvasHeight);
      drawBackgroundSquares();
    }
  }
  // if (loopHandle) {
  //   clearInterval(loopHandle);
  // }
  // var loopHandle = setInterval(drawGrid, 50);

  // When the user clicks the undo button, remove the last element from the object array and push it to the undo array, based on current drawing type. Then redraw canvas.
  $('#tool-bar').on('click', '#undoEntity', function() {
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
  });

  // When the user clicks the redo button, remove the last element from the undo array and push it to the object array, based on current drawing type. Then redraw canvas.
  $('#tool-bar').on('click', '#redoEntity', function() {
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
  });

  // When the Clear Canvas button is clicked, make the current Background and current Scene empty objects and reload the view.
  // Note: may need extra testing here.
  $('#tool-bar').on('click', '#clearEntity', function() {
    canvasWidth = self.myCanvas.width;
    canvasHeight = self.myCanvas.height;
    self.draw.clearRect(0, 0, canvasWidth, canvasHeight);
    self.allBackgroundSquares = [];
    self.allCollisionSquares = [];
    var undoBackgroundArray = [];
    var undoCollisionArray = [];
  });

  // When the Save Background button is clicked
  $('#saveEntity').click(function() {
    console.log("saving entity!");
    EditorService.saveEntity(self.allBackgroundSquares, self.allCollisionSquares, $scope.editor.currentEntity, $scope.editor.selectedAnimation, $scope.editor.currentFrameIndex, self.myCanvas.toDataURL()).done(function(entity) {
      console.log("After save:", entity);
    });
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

  // When the mouse is pressed, released, moved, or leaves the canvas, run the corresponding function.
  $(self.myCanvas).on('mousedown', mouseDown);
  $(self.myCanvas).on('mouseup', mouseUp);
  $(self.myCanvas).on('mouseenter', function() {
    drawingEntity = true;
    requestAnimationFrame(drawGrid);
  });
  $(self.myCanvas).on('mouseleave', function() {
    drawingEntity = false;
  });
  $(self.myCanvas).on('mousemove', function(event) {
    currentMouseX = event.clientX;
    currentMouseY = event.clientY;
  });

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
;angular.module('questCreator').controller('eventsCtrl', function($state, $scope, EditorService) {
  this.view = 'triggers';
  this.resultType = 'text';
  this.requirementType = null;
  this.requirements = {
    achievements: null,
    inventory: null
  }
  this.locationView = 'scene';
  this.map = null;
  this.scene = null;
  this.newWord = null;
  this.wordBuffer = {};
  this.counter = 0;
// DEBUG
  this.log = function(){
    console.log($scope.editor.currentEvent);
    console.log("requirements: ", this.requirements);
  }

  this.save = function(event) {
    EditorService.saveEvent(event).done(function(response){
    });
  }

////
//REQUIREMENTS:
////

  this.findRequirements = function() {
    var achievements = [];
    var itemList = [];
    $scope.editor.currentEditingGame.info.maps.forEach(function(map){
      map.scenes.forEach(function(sceneRow){
        sceneRow.forEach(function(scene){
          if (scene.events) {
            scene.events.forEach(function(event){
              event.info.results.achievements.forEach(function(achievement){
                achievements.push(achievement.name);
              });
              event.info.results.inventory.forEach(function(item){
                itemList.push(item);
              });
            })
          }
        })
      });
    });
    this.requirements = {
      achievements: achievements,
      inventory: itemList
    };
  }

  this.addRequirement = function(requirement, type) {
    if ($scope.editor.currentEvent.info.requirements.length === 0) {
      $scope.editor.currentEvent.info.requirements = {
        achievements: [],
        inventory: []
      };
    }
    $scope.editor.currentEvent.info.requirements[type].push(requirement);
  };

  this.anyRequirements = function(){
    if (!$scope.editor.currentEvent) {
      return false;
    }

    //Backwards compat fix, should remove someday...:
    if (!$scope.editor.currentEvent.info.requirements.achievements) {
      $scope.editor.currentEvent.info.requirements.achievements = [];
    }
    if (!$scope.editor.currentEvent.info.requirements.inventory) {
      $scope.editor.currentEvent.info.requirements.inventory = [];
    }
    //

    var requirements = $scope.editor.currentEvent.info.requirements;
    if (requirements.achievements.length > 0 ||
        requirements.inventory.length > 0) {
      return true;
    } else {
      return false;
    }
  };


////
//TRIGGERS:
////

//TRIGGER
////TEXT:

  this.addWordList = function(word){
    if (!word) {
      console.log("no word!");
      return;
    }
    var newList = [word];
    $scope.editor.currentEvent.info.triggers.push(newList);
    this.newWord = null;
    this.counter++;
  }

  this.addAlias = function(word, index){
    if (!word) {
      console.log("no word!");
      return;
    }
    $scope.editor.currentEvent.info.triggers[index].push(word);
    this.counter++;
  };

  this.bufferIndex = function() {
    return this.counter;
  }

//TRIGGER
////LOCATION:

  this.selectScene = function(scene){
    this.scene = scene;
    if (scene.background){
      $scope.editor.currentEvent.info.thumbnail = scene.background.thumbnail;
      console.log("added thumbnail");
    } else {
      $scope.editor.currentEvent.info.thumbnail = false;
    }
  };

////
//RESULTS:
////

//GENERAL:

  this.anyResults = function(){
    if (!$scope.editor.currentEvent) {
      return false;
    }
    //Backwards compat fix, should remove someday...:
    if (!$scope.editor.currentEvent.info.results) {
      $scope.editor.currentEvent.info.results = {
        text: [],
        achievements: [],
        inventory: [],
        portal: {}
      };
    }
    if (!$scope.editor.currentEvent.info.results.achievements) {
      $scope.editor.currentEvent.info.results.achievements = [];
    }
    if (!$scope.editor.currentEvent.info.results.inventory) {
      $scope.editor.currentEvent.info.results.inventory = [];
    }
    if (!$scope.editor.currentEvent.info.results.text) {
      $scope.editor.currentEvent.info.results.text = [];
    }
    if (!$scope.editor.currentEvent.info.results.portal) {
      $scope.editor.currentEvent.info.results.portal = {};
    }
    //

    var results = $scope.editor.currentEvent.info.results;
    if (results.text.length > 0 ||
        results.achievements.length > 0 ||
        results.inventory.length > 0 ||
        Object.keys(results.portal).length > 0) {
      return true;
    } else {
      return false;
    }
  };

//RESULT:
////TEXT:

  this.addText = function(){
    $scope.editor.currentEvent.info.results.text.push('');
  };

  this.removeText = function(index){
    $scope.editor.currentEvent.info.results.text.splice(index, 1);
  };

//RESULT:
////ACHIEVEMENT:

  this.addAchievement = function(){
    $scope.editor.currentEvent.info.results.achievements.push({
      name: '',
      description: '',
      points: 0
    });
  };

  this.removeAchievement = function(index){
    $scope.editor.currentEvent.info.results.achievements.splice(index, 1);
  };

//RESULT:
////ITEM:

  this.addItem = function(){
    $scope.editor.currentEvent.info.results.inventory.push('');
  };

  this.removeItem = function(index){
    $scope.editor.currentEvent.info.results.inventory.splice(index, 1);
  };

  //RESULT:
  ////PORTAL:

  this.addPortal = function(){
    $scope.editor.currentEvent.info.results.portal = {
      scenePos: [1, 0, 0],
      pos: {
        x: 200,
        y: 200
      }
    };
    console.log("Portal Result made!", $scope.editor.currentEvent.info.results.portal);
  };

  this.removePortal = function() {
    $scope.editor.currentEvent.info.results.portal = {};
  };

});
;angular.module('questCreator').controller('gameCtrl', function(socket, $state, $scope) {
});
;angular.module('questCreator').controller('landingCtrl', function($state, $scope, UserService, GameService, PopupService, StorageService) {

    this.searching = false;
    var self = this;

    GameService.getGames().done(function(response) {
      self.allGames = response;
      $scope.$apply();
    });

    $scope.createGame = function() {
        var user = UserService.get();
        if (user.id) {
            user.editGame = null;
            UserService.set(user);
            $state.go('main.game.editor.views');
        } else {
            PopupService.openTemp('signin-to-continue');
            main.signIn();
        }
    };

    $scope.goToGameDetail = function(game) {
      if (!$scope.main.loggedIn) {
        PopupService.openTemp('signin-to-continue');
        $scope.main.signIn();
      }
        StorageService.setPlayingGame(game.name);
        GameService.setGameDetail(game);
        $state.go('main.game.detail');
    };

    this.searchGames = function (keyword) {
        this.searching = true;
        GameService.searchGames(keyword).done(function (response) {
          self.allGames = response;
          $scope.$apply();
        });
    };

    this.showAll = function () {
        this.searching = false;
        GameService.getGames().done(function(response) {
          self.allGames = response;
            $scope.$apply();
        });
    };
});
;angular.module('questCreator')
    .controller('mainCtrl', function(socket, $state, UserService, PopupService, $scope) {
    var self = this;
    this.loggedIn = null;
    $scope.popupTemp = false;
    //When the user clicks "Home" on the nav bar view is changed to landing
    this.goHome = function () {
        $state.go('main.landing');
    };

    //When the user clicks "Profile" on the nav bar user information is loaded and view is changed to profile
    this.goToUser = function () {
      if (UserService.get().id) {
        $state.go('main.profile');
      } else {
        PopupService.openTemp('signin-to-continue');
        $scope.signIn();
      }
    };

    // When the user clicks the sign in button, prompt them to sign in to their google account.
    this.signIn = function() {
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

    this.createGame = function() {
        var user = UserService.get();
        if (user.id) {
            user.editGame = null;
            UserService.set(user);
            $state.go('main.game.editor.views');
        } else {
            PopupService.openTemp('signin-to-continue', $scope);
            self.signIn();
        }
    };

    //New user can register a user name
    this.register = function (name) {
        UserService.register(name);
    };

    //If the user chooses not to register, they can cancel out of the process.
    this.cancelRegister = function () {
        PopupService.close();
        $state.go('main.landing');
        UserService.signOut();
    };

    this.cancel = function () {
        PopupService.close();
        $state.go('main.landing');
    };

    this.okay = function () {
        PopupService.close();
    };

    this.about = function () {
      PopupService.open('about');
    };

    this.watchVid = function () {
      PopupService.close();
      PopupService.open('video');
    };

    this.return = function () {
        PopupService.close();
        PopupService.open('about');
    };
});
;angular.module('questCreator').controller('mapCtrl', function($state, $scope) {
  var self = this;

  this.width = 1;
  this.height = 1;

  // Scene pos should be [x,y,z], where x=mapIndex, y=rowIndex, z=columnIndex

  this.createMap = function() {
    var name = "New Map";
    var sceneName = "New Scene (1, 1)";
    var newScene = {
      name: sceneName,
      background: undefined,
      objects: [],
      entities: [],
      events: []
    };
    var newMap = {
      name: name,
      scenes: [
        [newScene]
      ]
    };
    $scope.editor.currentEditingGame.info.maps.push(newMap);
  }

  this.sceneNamer = function(coord) {
    if ([address].filter(function(asset){return asset.name.includes(name.toLowerCase())})){
      var num = 1;
      [address].forEach(function(value){
        num = (value.name.includes(name.toLowerCase())) ? num + 1 : num;
      });
      name = name + " " + num;
    }
    return name;
  };

  this.initScene = null;

  this.createMapRow = function(mapObj) {
    var name = "New Scene ("+self.initScene[0]+", "+self.initScene[1]+")";
    var newScene = {
      name: name,
      background: undefined,
      objects: [],
      entities: [],
      events: []
    };
    $scope.editor.currentEditingGame.info.maps[$scope.editor.currentEditingGame.info.maps.indexOf(mapObj)].scenes.push([newScene]);
  }

  this.createScene = function(mapObj, rowNum) {
    var name = "New Scene ("+self.initScene[0]+", "+self.initScene[1]+")";
    var newScene = {
      name: name,
      background: undefined,
      objects: [],
      entities: [],
      events: []
    };
    $scope.editor.currentEditingGame.info.maps[$scope.editor.currentEditingGame.info.maps.indexOf(mapObj)].scenes[rowNum].push(newScene);
  }

  this.editScene = function(scene) {
    //backwards compatibility fix:
    if (!scene.events) {
      scene.events = [];
    }
    $scope.editor.currentScene = scene;
    $scope.editor.currentLargeView = 'scene';
  }

});
;angular.module('questCreator').controller('objCtrl', function($state, $scope, EditorService) {
  var self = this;      // To help with scope issues
  var drawingObject = false;
  var currentMouseX = null;
  var currentMouseY = null;
  var mouseIsDown = false;
  var mouseMoveEvent;       // Global variable to track mouse movement events
  var touchMoveEvent;       // Global variable to track touch movement events
  var mobileWidth = 850;    // Width for mobile screen sizes
  var tabletWidth = 1100;   // Width for tablet screen sizes
  var tabletScale = 1.4;
  var mobileScaleX = 2.5;
  var mobileScaleY = 1.6;
  var moveType = '';    // Either mouse or touch
  var undoBackgroundArray = [];   //Array to keep track of background objects that were undone.
  var undoCollisionArray = [];
  this.currentColor = $scope.editor.currentColor;    // Value of color input in draw.html
  this.myCanvas = document.getElementById('obj-canvas');  // Canvas html element
  this.canvasPos = {    // Canvas top and left coordinates on page
    x: self.myCanvas.getBoundingClientRect().left,
    y: self.myCanvas.getBoundingClientRect().top
  };
  this.draw = this.myCanvas.getContext('2d'); // Canvas context
  var canvasWidth = self.myCanvas.width;
  var canvasHeight = self.myCanvas.height;
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

  // Called when the mouse button is pressed.
  // Starts the interval to run every 100ms while the mouse button is still held down.
  // Only start the interval if it is not already running.
  function mouseDown(event) {
    mouseIsDown = true;
    // if (drawHandle === -1) {
    //   drawHandle = setInterval(mousePressed, 100);
    // }
  }

  // Called when the mouse button is released.
  // If the interval is running, then clear it and reset it.
  function mouseUp(event) {
    mouseIsDown = false;
    // if (drawHandle !== -1) {
    //   clearInterval(drawHandle);
    //   drawHandle = -1;
    // }
  }

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

  function drawGrid() {
    self.draw.clearRect(0, 0, canvasWidth, canvasHeight);
    drawBackgroundSquares();
    drawCollisionSquares();
    var drawSize = $scope.editor.currentPixelSize;
    self.canvasPos = {    // Canvas top and left coordinates on page
      x: self.myCanvas.getBoundingClientRect().left,
      y: self.myCanvas.getBoundingClientRect().top
    };
    var numSquaresX = 20;
    var numSquaresY = 20;
    var gridWidth = canvasWidth / numSquaresX;
    var gridHeight = canvasHeight / numSquaresY;
    var color = $scope.editor.drawingCollision ? 'rgba(100, 100, 100, 0.5)' : $scope.editor.currentColor;
    if ($scope.editor.drawingCollision && $scope.editor.collisionType !== 'wall') {
      color = 'rgba(0, 0, 255, 0.5)';
    }
    var type = $scope.editor.drawingCollision ? $scope.editor.collisionType : 'normal';
    self.draw.fillStyle = color;
    for (var xIndex = -drawSize; xIndex <= drawSize; xIndex++) {
      for (var yIndex = -drawSize; yIndex <= drawSize; yIndex++) {
        var rectX = Math.floor( (currentMouseX - self.canvasPos.x) / gridWidth + xIndex) * gridWidth;
        var rectY = Math.floor( (currentMouseY - self.canvasPos.y) / gridHeight + yIndex) * gridHeight;
        if ($scope.editor.erasing) {
          self.draw.strokeStyle = 'black';
          self.draw.strokeRect(rectX, rectY, gridWidth, gridHeight);
        } else {
          self.draw.fillRect(rectX, rectY, gridWidth, gridHeight);
        }
        if (mouseIsDown) {
          if (!$scope.editor.drawingCollision) {
            var squaresToRemove = [];
            self.allBackgroundSquares.forEach(function(square) {
              if ( rectX === square.x && rectY === square.y) {
                // console.log("Erasing old squares!");
                squaresToRemove.push(self.allBackgroundSquares.indexOf(square));
              }
            });
            squaresToRemove.forEach(function(index) {
              self.allBackgroundSquares.splice(index, 1);
            });
          } else if ($scope.editor.drawingCollision) {
            var squaresToRemove = [];
            self.allCollisionSquares.forEach(function(square) {
              if ( rectX === square.x && rectY === square.y) {
                squaresToRemove.push(self.allCollisionSquares.indexOf(square));
              }
            });
            squaresToRemove.forEach(function(index) {
              self.allCollisionSquares.splice(index, 1);
            });
          }
        }
        if (mouseIsDown && !$scope.editor.erasing) {
          // console.log("Drawing New Square!");
          var newSquare = new Square(rectX, rectY, gridWidth, gridHeight, color, type);
          // newSquare.draw();
          if ($scope.editor.drawingCollision) {
            self.allCollisionSquares.push(newSquare);
          } else {
            self.allBackgroundSquares.push(newSquare);
          }
        }
      }
    }
    self.draw.beginPath();
    for (var index = 0; index <= canvasWidth; index += gridWidth) {
      self.draw.moveTo(index, 0);
      self.draw.lineTo(index, canvasHeight);
    }
    for (var index = 0; index <= canvasHeight; index += gridHeight) {
      self.draw.moveTo(0, index);
      self.draw.lineTo(canvasWidth, index);
    }
    self.draw.strokeStyle = 'rgba(75, 75, 75, 0.8)';
    self.draw.stroke();
    self.draw.closePath();
    // console.log("Background array", self.allBackgroundSquares);
    // console.log("Collision array", self.allCollisionSquares);
    if (drawingObject) {
      requestAnimationFrame(drawGrid);
    } else {
      self.draw.clearRect(0, 0, canvasWidth, canvasHeight);
      drawBackgroundSquares();
    }
  }
  // if (loopHandle) {
  //   clearInterval(loopHandle);
  // }
  // var loopHandle = setInterval(drawGrid, 50);

  // When the user clicks the undo button, remove the last element from the object array and push it to the undo array, based on current drawing type. Then redraw canvas.
  $('#tool-bar').on('click', '#undoObject', function() {
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
  });

  // When the user clicks the redo button, remove the last element from the undo array and push it to the object array, based on current drawing type. Then redraw canvas.
  $('#tool-bar').on('click', '#redoObject', function() {
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
  });

  // When the Clear Canvas button is clicked, make the current Background and current Scene empty objects and reload the view.
  // Note: may need extra testing here.
  $('#tool-bar').on('click', '#clearObject', function() {
    canvasWidth = self.myCanvas.width;
    canvasHeight = self.myCanvas.height;
    self.draw.clearRect(0, 0, canvasWidth, canvasHeight);
    self.allBackgroundSquares = [];
    self.allCollisionSquares = [];
    var undoBackgroundArray = [];
    var undoCollisionArray = [];
  });

  // When the save button is clicked
  $('.asset-container').on('click', '#saveObject', function() {
    console.log("Saving Object!");
    EditorService.saveObject(self.allBackgroundSquares, self.allCollisionSquares, $scope.editor.currentObject, self.myCanvas.toDataURL()).done(function(object) {
      console.log(object);
    });
  });

  // When the mouse is pressed, released, moved, or leaves the canvas, run the corresponding function.
  $(self.myCanvas).on('mousedown', mouseDown);
  $(self.myCanvas).on('mouseup', mouseUp);
  $(self.myCanvas).on('mouseenter', function() {
    drawingObject = true;
    requestAnimationFrame(drawGrid);
  });
  $(self.myCanvas).on('mouseleave', function() {
    drawingObject = false;
  });
  $(self.myCanvas).on('mousemove', function(event) {
    currentMouseX = event.clientX;
    currentMouseY = event.clientY;
  });

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
;angular.module('questCreator').controller('paletteCtrl', function(PaletteService, $scope, EditorService) {

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
                    self.saveElements();
                }
            }
            this.elements = [];
            $scope.editor.selectingAssets = false;
        };

        self.testDupes = function (id, game) {
          var notDupe = true;
          if (game === $scope.editor.currentEditingGame.id) {
            notDupe = false;
          }
          for (var i = 0; i < self.elements.length; i++) {
            if (self.elements[i].id === id) {
              notDupe = false;
            }
          }
          return notDupe;
        };

        self.addToPalette = function(asset, index) {
          self.assets.forEach(function (element) {
          });
          self.assets.splice(index, 1);
          var element = angular.copy(asset);
          EditorService.getAssetInfo(element.id, self.currentType).done(function (info) {
            element.info = info;
            self.elements.push(element);
            $scope.$apply();
          });
        };

        self.removeFromPalette = function (index) {
          self.elements.splice(index, 1);
        };

        self.saveElements = function() {
          var currentObjects = [];
          var savedAssets = [];
          var asset = null;
          if (self.currentType === 'backgrounds') {
            for (var i = 0; i < self.elements.length; i++) {
              asset = self.elements[i];
                EditorService.createBackground(asset.name, $scope.editor.currentEditingGame.id, asset.info, asset.thumbnail).done(function (response) {
                  $scope.editor.availableBackgrounds.push(response);
                });
            }
          } else if (self.currentType === 'obstacles') {
            for (var j = 0; j < self.elements.length; j++) {
              asset = self.elements[j];
                EditorService.createObject(asset.name, $scope.editor.currentEditingGame.id, asset.info).done(function (response) {
                  $scope.editor.availableObjects.push(response);
              });
            }
          } else if (self.currentType === 'entities') {
            for (var k = 0; k < self.elements.length; k++) {
              asset = self.elements[k];
                EditorService.createEntity(asset.name, $scope.editor.currentEditingGame.id, asset.info).done(function (response) {
                  $scope.editor.availableEntities.push(response);
              });
            }
          }
          self.elements = [];
          return self.elements;
        };

    });
});
;angular.module('questCreator').controller('playCtrl', function(socket, Avatar, Background, SceneObject, Entity, UserService, EditorService, GameService, $state, $scope, PopupService, StorageService) {
  var self = this;
  UserService.checkLogin().then(function(response) {
    // var socketDelay = 5;
    // var socketIterator = 0;
    var fullPlayer = {
      id: null,
      game: null,
      // scenePos: null,
      // avatar: null,
      socketId: null
    };
    // var playerUpdate = {
    //   id: null,
    //   game: null,
    //   scenePos: null,
    //   socketId: null
    // };
    // var allPlayers = [];
    var playerInfo = {
        id: UserService.get().id,
    };
    var gameCanvas = document.getElementById('play-canvas');
    var gameCtx = gameCanvas.getContext('2d');
    var gameWidth = 700;
    var gameHeight = 500;
    self.warning = '';
    self.typing = {
        show: false,
        phrase: ''
    };
    self.responding = {
        show: false,
        phrase: ''
    };
    self.showingInventory = false;
    var pause = false;

    var avatar = null;
    var background = null;
    var objects = null;
    var entities = null;
    var events = null;

    var avatarLoaded = false;
    var entitiesLoaded = false;

    self.gameName = StorageService.getPlayingGame() || GameService.getGameDetail().name || 'harry potter quest';
    var gameInfo = null;
    var startPos = null;
    var allMaps = null;
    var currentGame = null;
    self.currentMap = null;
    self.allRows = null;
    self.currentRow = null;
    self.currentScene = null;
    self.currentScenePos = [0, 0, 0];
    self.gameLoaded = false;
    self.allSavedGames = StorageService.getSavedGames(self.gameName) || [];
    self.saveInfo = {
      game: '',
      name: '',
      score: 0,
      time: 0,
      inventory: [],
      achievements: [],
      scenePos: [1, 0, 0],
      pos: {
        x: 350,
        y: 250
      }
    };
    self.startTime = new Date();
    self.timeDiff = 0;
    self.displayTime = '';

    self.gameStarted = false;

    self.saveGame = function() {
      self.saveInfo.time = self.timeDiff;
      self.saveInfo.pos = avatar.info.pos;
      var newSave = angular.copy(self.saveInfo);
      self.allSavedGames.push(newSave);
      StorageService.setSavedGames(self.gameName, self.allSavedGames);
      // Call to POST save game to database here
      self.saveInfo.name = '';
    };

    self.restoreGame = function(savedGame) {
      self.saveInfo = angular.copy(savedGame);
      self.startTime = Date.now() - (angular.copy(savedGame.time) * 1000);
      self.currentScenePos = angular.copy(savedGame.scenePos);
      updateLocation();
      avatar.info.pos = angular.copy(savedGame.pos);
    };

    $('body').off('keyup').on('keyup', function(event) {
            var keyCode = event.which;
            if (keyCode === 8) {
              // Backspace
              if (self.typing.phrase.length > 1) {
                self.typing.phrase = self.typing.phrase.substring(0, self.typing.phrase.length - 1);
              } else {
                self.typing.phrase = '';
                self.typing.show = false;
              }
            }
            if (keyCode === 27) {
              // Escape
              if ( $('.option.active').length === 0 ) {
                $('.fileOption').addClass('active');
                $('.save').addClass('active');
                self.pause = true;
              } else {
                $('.option.active').removeClass('active');
                $('.save').removeClass('active');
                self.pause = false;
                runGame();
              }
            }
            if (keyCode === 37) {
                if (self.pause && $('.fileOption.active').length === 0) {
                  $('.option.active').toggleClass('active').prev('.option').toggleClass('active');
                }
                if (!self.pause) {
                  avatar.action = (avatar.action === 'walkLeft') ? 'stand' : 'walkLeft';
                  // playerUpdate = {
                  //   id: angular.copy(fullPlayer.id),
                  //   game: angular.copy(fullPlayer.game),
                  //   scenePos: angular.copy(fullPlayer.scenePos),
                  //   socketId: angular.copy(fullPlayer.socketId),
                  //   action: angular.copy(avatar.action),
                  //   pos: angular.copy(avatar.info.pos)
                  // };
                  // socket.emit('update player', playerUpdate);
                }
            } else if (keyCode === 38) {
                if (self.pause && $('.fileOption.active').length === 1 && $('.save.active').length === 0) {
                   $('.fileOptions li.active').toggleClass('active').prev('li').toggleClass('active');
                }
                if (!self.pause) {
                  avatar.action = (avatar.action === 'walkUp') ? 'stand' : 'walkUp';
                  // playerUpdate = {
                  //   id: angular.copy(fullPlayer.id),
                  //   game: angular.copy(fullPlayer.game),
                  //   scenePos: angular.copy(fullPlayer.scenePos),
                  //   socketId: angular.copy(fullPlayer.socketId),
                  //   action: angular.copy(avatar.action),
                  //   pos: angular.copy(avatar.info.pos)
                  // };
                  // socket.emit('update player', playerUpdate);
                }
            } else if (keyCode === 39) {
                if (self.pause && $('.timeOption.active').length === 0) {
                  $('.option.active').toggleClass('active').next('.option').toggleClass('active');
                }
                if (!self.pause) {
                  avatar.action = (avatar.action === 'walkRight') ? 'stand' : 'walkRight';
                  // playerUpdate = {
                  //   id: angular.copy(fullPlayer.id),
                  //   game: angular.copy(fullPlayer.game),
                  //   scenePos: angular.copy(fullPlayer.scenePos),
                  //   socketId: angular.copy(fullPlayer.socketId),
                  //   action: angular.copy(avatar.action),
                  //   pos: angular.copy(avatar.info.pos)
                  // };
                  // socket.emit('update player', playerUpdate);
                }
            } else if (keyCode === 40) {
                if (self.pause && $('.fileOption.active').length === 1 && $('.restore.active').length === 0) {
                  $('.fileOptions li.active').toggleClass('active').next('li').toggleClass('active');
                }
                if (!self.pause) {
                  avatar.action = (avatar.action === 'walkDown') ? 'stand' : 'walkDown';
                  // playerUpdate = {
                  //   id: angular.copy(fullPlayer.id),
                  //   game: angular.copy(fullPlayer.game),
                  //   scenePos: angular.copy(fullPlayer.scenePos),
                  //   socketId: angular.copy(fullPlayer.socketId),
                  //   action: angular.copy(avatar.action),
                  //   pos: angular.copy(avatar.info.pos)
                  // };
                  // socket.emit('update player', playerUpdate);
                }
            } else if (keyCode === 191) {
              // Forward slash
              if (!self.pause && !self.typing.show && !self.responding.show  && $('.active').length === 0 && !$(".message").is(":focus")) {
                self.pause = true;
                self.showingInventory = true;
              }
            }
        });

    $('body').off('keypress').on('keypress', function(event) {
            var keyCode = event.which;
            if (self.typing.show && keyCode >= 32 && keyCode <= 220 && !self.responding.show && $('.active').length === 0) {
                pause = true;
                var char = String.fromCharCode(keyCode);
                self.typing.phrase += char;
            } else if (keyCode === 13) {
                // Enter
                if (self.typing.show) { // If the user is finishing typing
                    self.typing.show = false;
                    var userPhrase = self.typing.phrase;
                    self.typing.phrase = '';
                    checkTypingEvents(userPhrase);
                } else if (self.responding.show) { // If the user is finished reading a response
                    self.responding.show = false;
                    self.responding.phrase = '';
                } else if (self.showingInventory) { // If the user is finished looking at inventory
                    self.showingInventory = false;
                } else if ($('.invOption.active').length === 1) {
                  self.showingInventory = true;
                  $('.option.active').removeClass('active');
                  runGame(); // runs once - game is still paused
                } else if ($('.save.active').length === 1) {
                  self.savingGame = true;
                  $('.fileOption').removeClass('active');
                  $('.save.active').removeClass('active');
                  runGame(); // runs once - game is still paused
                } else if ($('.restore.active').length === 1) {
                  self.restoringGame = true;
                  $('.fileOption').removeClass('active');
                  $('.restore.active').removeClass('active');
                  runGame(); // runs once - game is still paused
                }
                if (!self.responding.show && !self.showingInventory && $('.active').length === 0 && self.pause === true) { // Resume the game if all windows have been closed and if it is not already running
                    self.pause = false;
                    runGame();
                }
            } else if (keyCode === 32 && !$(".message").is(":focus") && !self.savingGame && !self.restoringGame && !self.showingInventory && !self.typing.show) {
                self.typing.phrase = ':';
                self.typing.show = true;
            }
        });

    function checkTypingEvents(phrase) {
      phrase = phrase.toLowerCase();
      var foundEvent = false; // Whether a typing event has already been triggered
      if (events) {
        events.forEach(function(event) { // Loop through all the typing events
          if (event.category === 'text') {
            var typingEvent = event.info;
            if (!foundEvent) {  // Only continue checking as long as another event has already not been triggered
              var requirementsMet = true;   // Assume that the requirements will be met
              if (typingEvent.requirements.achievements) {
                typingEvent.requirements.achievements.forEach(function(achievement) {  // Loop through all the achievement requirements
                  if (self.saveInfo.achievements.indexOf(achievement.name) === -1) { // If an achievement is required, check the player's past achievements
                    requirementsMet = false;  // Requirements fail if achievement is not present
                  }
                });
              }
              if (typingEvent.requirements.inventory) {
                typingEvent.requirements.inventory.forEach(function(item) {  // Loop through all the inventory requirements
                  if (self.saveInfo.inventory.indexOf(item) === -1) { // If an inventory item is required, check the player's inventory
                    requirementsMet = false;  // Requirements fail if inventory does not contain necessary item
                  }
                });
              }
              if (requirementsMet) {  // If all the requirements have been met, check the event's triggers
                var triggerSatisfied = true;  // Assume that the trigger conditions will be met
                typingEvent.triggers.forEach(function(wordSet) { // Loop through the sets of words to check
                    var possibleMatch = false;  // Assume that each wordset does not satisfy the requirements
                    wordSet.forEach(function(word) {  // Loop through all the words in the wordSet
                      word = word.toLowerCase();
                      if ( phrase.includes(word) ) {  // If the user typed one of the words in the wordSet, it's a possible match
                        possibleMatch = true;
                      }
                    });
                    if (!possibleMatch) { // If the the entire wordSet was passed through without finding a match, then the entire trigger fails
                      triggerSatisfied = false;
                      self.responding.phrase = 'I have literally no idea what you just said.';  // If the trigger failed, set the response to a standard default
                      self.responding.show = true;
                      self.pause = true;
                    }
                });
                if (triggerSatisfied) {
                  foundEvent = true;
                  typingEvent.results.text.forEach(function(textResult) {
                      self.responding.phrase = textResult;
                      self.responding.show = true;
                      self.pause = true;
                  });
                  typingEvent.results.inventory.forEach(function(inventoryItem) {
                    if (self.saveInfo.inventory.indexOf(inventoryItem) === -1) { // Check to see if the player has already gotten this item
                      self.saveInfo.inventory.push(inventoryItem);
                    } else {
                      self.responding.phrase = 'You already have that.';
                    }
                  });
                  typingEvent.results.achievements.forEach(function(achievement) {
                    if (self.saveInfo.achievements.indexOf(achievement.name) === -1) { // Check to see if the player has already gotten this achievement
                      self.saveInfo.achievements.push(achievement.name);
                      self.saveInfo.score += achievement.points;
                    } else {
                      self.responding.phrase = 'You already did that.';
                    }
                  });
                  if (typingEvent.results.portal.scenePos) {
                      var location = typingEvent.results.portal;
                      self.currentScenePos = angular.copy(location.scenePos);
                      updateLocation();
                      avatar.info.pos = angular.copy(location.pos);
                  }
                }
              }
            }
          }
        });
      } else {
        self.responding.phrase = 'I have literally no idea what you just said.';
        self.responding.show = true;
        self.pause = true;
      }
    }

    function checkLocationEvents(collisionType) {
      var foundEvent = false; // Whether a location event has already been triggered
      if (events) {
        events.forEach(function(event) { // Loop through all the location events
          if (event.category === 'location') {
            locationEvent = event.info;
            if (!foundEvent) {  // Only continue checking as long as another event has already not been triggered
              var requirementsMet = true;   // Assume that the requirements will be met
              if (locationEvent.requirements.achievements) {
                locationEvent.requirements.achievements.forEach(function(achievement) {  // Loop through all the achievement requirements
                  if (self.saveInfo.achievements.indexOf(achievement.name) === -1) { // If an achievement is required, check the player's past achievements
                    requirementsMet = false;  // Requirements fail if achievement is not present
                  }
                });
              }
              if (locationEvent.requirements.inventory) {
                locationEvent.requirements.inventory.forEach(function(item) {  // Loop through all the inventory requirements
                  if (self.saveInfo.inventory.indexOf(item) === -1) { // If an inventory item is required, check the player's inventory
                    requirementsMet = false;  // Requirements fail if inventory does not contain necessary item
                  }
                });
              }
              if (requirementsMet) {  // If all the requirements have been met, check the event's triggers
                var triggerSatisfied = false;  // Assume that the trigger conditions will not be met
                if (locationEvent.triggers.length > 0) {
                  locationEvent.triggers.forEach(function(triggerCollisionType) {  // For now, assume any present trigger means the custom collision map is present
                    if (collisionType === triggerCollisionType) {
                      triggerSatisfied = true;
                    }
                  });
                } else {
                  triggerSatisfied = true;  // If there is a location event with no trigger conditions, assume that the event should be triggered
                }
                if (triggerSatisfied) {
                  foundEvent = true;
                  locationEvent.results.text.forEach(function(textResult) {
                      self.responding.phrase = textResult;
                      self.responding.show = true;
                      setTimeout(function() {
                        self.responding.show = false;
                      }, 2000);
                  });
                  locationEvent.results.inventory.forEach(function(inventoryItem) {
                    if (self.saveInfo.inventory.indexOf(inventoryItem) === -1) { // Check to see if the player has already gotten this item
                      self.saveInfo.inventory.push(inventoryItem);
                    } else {
                      // Do nothing
                    }
                  });
                  locationEvent.results.achievements.forEach(function(achievement) {
                    if (self.saveInfo.achievements.indexOf(achievement.name) === -1) { // Check to see if the player has already gotten this achievement
                      self.saveInfo.achievements.push(achievement.name);
                      self.saveInfo.score += achievement.points;
                    } else {
                      // Do nothing
                    }
                  });
                  if (locationEvent.results.portal.scenePos) {
                      var location = locationEvent.results.portal;
                      self.currentScenePos = angular.copy(location.scenePos);
                      updateLocation();
                      avatar.info.pos = angular.copy(location.pos);
                  }
                }
              }
            }
          }
        });
      }
    }

    function checkAvatarBounds() {
      if (avatar.info.currentFrame.collisionMap[0]) {
        var left = avatar.info.currentFrame.collisionMap[0].x;
        var right = avatar.info.currentFrame.collisionMap[0].x + avatar.info.currentFrame.collisionMap[0].width;
        var top = avatar.info.currentFrame.collisionMap[0].y;
        var bottom = avatar.info.currentFrame.collisionMap[0].y + avatar.info.currentFrame.collisionMap[0].height;
        avatar.info.currentFrame.collisionMap.forEach(function(square) {
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
    }

    function checkAvatarCollisions() {
        var collision = {
            found: false,
            direction: 'none',
            type: 'none'
        };
        avatar.info.currentFrame.collisionMap.forEach(function(avatarSquare) { // Loop through all the avatar squares
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
                        collision.type = bgSquare.type;
                        collision.square = bgSquare;
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
                          collision.type = objSquare.type;
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
                    var entLeft = (entSquare.x + entity.info.pos.x) * entity.scale;
                    var entRight = (entSquare.x + entSquare.width + entity.info.pos.x) * entity.scale;
                    var entTop = (entSquare.y + entity.info.pos.y) * entity.scale;
                    var entBottom = (entSquare.y + entSquare.height + entity.info.pos.y) * entity.scale;
                    // Pattern: check the left, right, top, and bottom edges of the current avatar square against the right, left, bottom, and top edges of the current scene object square (in those exact orders).
                    if (avatarLeft <= entRight && avatarRight >= entLeft && avatarTop <= entBottom && avatarBottom >= entTop) {
                        collision.found = true;
                        collision.type = entSquare.type;
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
            if (collision.type === 'wall') {
              avatar.collide(collision.direction);
              // playerUpdate = {
              //   id: angular.copy(fullPlayer.id),
              //   game: angular.copy(fullPlayer.game),
              //   scenePos: angular.copy(fullPlayer.scenePos),
              //   socketId: angular.copy(fullPlayer.socketId),
              //   action: angular.copy(avatar.action),
              //   pos: angular.copy(avatar.info.pos)
              // };
              // socket.emit('update player', playerUpdate);
            } else if (collision.type === 'teleport') {
              console.log(collision);
              var teleportTarget = collision.square.teleportTarget;
              var scenePos = teleportTarget.scenePos;
              var pos = teleportTarget.pos;
              self.currentScenePos = scenePos;
              updateLocation();
              avatar.teleport(pos);
            } else {
              checkLocationEvents(collision.type);
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
              var entityLeft = (entitySquare.x + entity.info.pos.x) * entity.scale;
              var entityRight = (entitySquare.x + entitySquare.width + entity.info.pos.x) * entity.scale;
              var entityTop = (entitySquare.y + entity.info.pos.y) * entity.scale;
              var entityBottom = (entitySquare.y + entitySquare.height + entity.info.pos.y) * entity.scale;
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
        self.saveInfo.scenePos = self.currentScenePos;
        // fullPlayer.scenePos = self.currentScenePos;
        self.currentMap = allMaps[self.currentScenePos[0]];
        self.allRows = self.currentMap.scenes;
        self.currentRow = self.allRows[self.currentScenePos[1]];
        self.currentScene = self.currentRow[self.currentScenePos[2]];
        // playerUpdate = {
        //   id: angular.copy(fullPlayer.id),
        //   game: angular.copy(fullPlayer.game),
        //   scenePos: angular.copy(fullPlayer.scenePos),
        //   socketId: angular.copy(fullPlayer.socketId),
        //   action: angular.copy(avatar.action),
        //   pos: angular.copy(avatar.info.pos)
        // };
        // socket.emit('update player', playerUpdate);
        background = self.currentScene.background;
        events = self.currentScene.events;
        objects = self.currentScene.objects;
        loadEntities();
    }

    function loadEntities() {
      entities = [];
      var oldEntities = angular.copy(self.currentScene.entities);
      oldEntities.forEach(function(entity) {
        var newEntity = new Entity(entity);
        entities.push(newEntity);
      });
      entitiesLoaded = true;
    }

    function updateAvatar() {
      avatar.updatePos();
      // fullPlayer.avatar = avatar;
      // playerUpdate = {
      //   id: angular.copy(fullPlayer.id),
      //   game: angular.copy(fullPlayer.game),
      //   scenePos: angular.copy(fullPlayer.scenePos),
      //   socketId: angular.copy(fullPlayer.socketId),
      //   action: angular.copy(avatar.action),
      //   pos: angular.copy(avatar.info.pos)
      // };
      // if (socketIterator > socketDelay) {
      //   socket.emit('update player', playerUpdate);
      //   socketIterator = 0;
      // }
      // socketIterator++;
    }

    function updateEntities() {
      entities.forEach(function(entity) {
        entity.updatePos();
      });
    }

    function drawAvatar(avatarToDraw) {
        avatarToDraw.checkAction();
        // Save the drawing context
        gameCtx.save();
        // Translate the canvas origin to be the top left of the avatarToDraw
        gameCtx.translate(avatarToDraw.info.pos.x, avatarToDraw.info.pos.y);
        gameCtx.scale(avatarToDraw.scale, avatarToDraw.scale);
        // Draw the squares from the avatarToDraw's current frame
        avatarToDraw.info.currentFrame.image.forEach(function(square) {
            gameCtx.fillStyle = square.color;
            gameCtx.fillRect(square.x, square.y, square.width, square.height);
        });
        gameCtx.globalAlpha = 0.2;
        // Draw the avatarToDraw's collision map (purely for testing)
        // if (avatarToDraw.info.currentFrame.collisionMap.length > 0) {
        //   avatarToDraw.info.currentFrame.collisionMap.forEach(function(square) {
        //       gameCtx.fillStyle = square.color;
        //       gameCtx.fillRect(square.x, square.y, square.width, square.height);
        //   });
        // }
        gameCtx.restore();
    }

    // function drawAllPlayers() {
    //   allPlayers.forEach(function(player) {
    //     // player.avatar.updatePos();
    //     if (player.scenePos[0] === fullPlayer.scenePos[0] && player.scenePos[1] === fullPlayer.scenePos[1] && player.scenePos[2] === fullPlayer.scenePos[2]) {
    //       drawAvatar(player.avatar);
    //     }
    //   });
    // }

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
            // background.info.collisionMap.forEach(function(square) {
            //     gameCtx.fillStyle = square.color;
            //     gameCtx.fillRect(square.x, square.y, square.width, square.height);
            // });
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
      if (objects) {
        objects.forEach(function(object) {

            // Save the drawing context
            gameCtx.save();
            // Translate the canvas origin to be the top left of the object
            gameCtx.translate(object.info.pos.x, object.info.pos.y);
            if (object.bounds) {
              if ( (avatar.bounds.top > object.bounds.bottom && type === 'background') || (avatar.bounds.top < object.bounds.bottom && type === 'foreground') ) {
                // Draw the squares from the object's current frame
                object.info.image.forEach(function(square) {
                    gameCtx.fillStyle = square.color;
                    gameCtx.fillRect(square.x, square.y, square.width, square.height);
                });
                gameCtx.globalAlpha = 0.2;
                // Draw the object's collision map (purely for testing)
                // object.info.collisionMap.forEach(function(square) {
                //     gameCtx.fillStyle = square.color;
                //     gameCtx.fillRect(square.x, square.y, square.width, square.height);
                // });
              }
            } else if (type === 'background'){
              // Draw the squares from the object's current frame
              object.info.image.forEach(function(square) {
                  gameCtx.fillStyle = square.color;
                  gameCtx.fillRect(square.x, square.y, square.width, square.height);
              });
              gameCtx.globalAlpha = 0.2;
              // Draw the object's collision map (purely for testing)
              // object.info.collisionMap.forEach(function(square) {
              //     gameCtx.fillStyle = square.color;
              //     gameCtx.fillRect(square.x, square.y, square.width, square.height);
              // });
            }
            gameCtx.restore();
        });
      }
    }

    function drawEntities(type) {
      // Check for entities existence
      if (entities) {
        entities.forEach(function(entity) {
            entity.checkAction();
            // Save the drawing context
            gameCtx.save();
            // Translate the canvas origin to be the top left of the entity
            gameCtx.translate(entity.info.pos.x, entity.info.pos.y);
            gameCtx.scale(entity.scale, entity.scale);
            if (entity.bounds) {
              if ( (avatar.bounds.top > entity.bounds.bottom && type === 'background') || (avatar.bounds.top < entity.bounds.bottom && type === 'foreground') ) {
                // Draw the squares from the entity's current frame
                entity.info.currentFrame.image.forEach(function(square) {
                    gameCtx.fillStyle = square.color;
                    gameCtx.fillRect(square.x, square.y, square.width, square.height);
                });
                gameCtx.globalAlpha = 0.2;
                // Draw the entity's collision map (purely for testing)
                // entity.info.currentFrame.collisionMap.forEach(function(square) {
                //     gameCtx.fillStyle = square.color;
                //     gameCtx.fillRect(square.x, square.y, square.width, square.height);
                // });
              }
            } else if (type === 'background'){
              // Draw the squares from the entity's current frame
              entity.info.currentFrame.image.forEach(function(square) {
                  gameCtx.fillStyle = square.color;
                  gameCtx.fillRect(square.x, square.y, square.width, square.height);
              });
              gameCtx.globalAlpha = 0.2;
              // Draw the entity's collision map (purely for testing)
              // entity.info.currentFrame.collisionMap.forEach(function(square) {
              //     gameCtx.fillStyle = square.color;
              //     gameCtx.fillRect(square.x, square.y, square.width, square.height);
              // });
            }
            gameCtx.restore();
        });
      }
    }

    function clearCanvas() {
        gameCtx.clearRect(0, 0, gameWidth, gameHeight);
    }

    function updateTime() {
      var currentTime = new Date();
      self.timeDiff = Math.floor( (currentTime - self.startTime) / 1000 );
      // var self.timeDiff = Math.floor( (currentTime - self.startTime) ); // to test higher times
      var numSeconds = self.timeDiff % 60;
      var numMinutes = Math.floor(self.timeDiff / 60) % 60;
      var numHours = Math.floor(self.timeDiff / 3600);
      // Formatting zeros
      numSeconds = (numSeconds < 10) ? '0'+numSeconds : numSeconds;
      numMinutes = (numMinutes < 10) ? '0'+numMinutes : numMinutes;
      numHours = (numHours < 10) ? '0'+numHours : numHours;
      self.displayTime = numHours + ":" + numMinutes + ":" + numSeconds;
    }

    $scope.assetsToLoad = 0;
    $scope.assetsLoaded = 0;
    PopupService.open('loading-screen', $scope);
    currentGame = GameService.loadGame(self.gameName).done(function(response) {
      // console.log(response);
      response.info.maps.forEach(function(map) {
        map.scenes.forEach(function(row) {
          row.forEach(function(scene) {
            if (scene.background) {
              $scope.assetsToLoad++;
              var backgroundId = scene.background.id;
              // console.log(scene.background.info);
              EditorService.getAssetInfo(backgroundId, 'backgrounds').done(function(info) {  // Get each background's info from the database
                  scene.background.info = info;
                  // console.log("Found background info!", scene.background.info);
                  $scope.assetsLoaded++;
                  $scope.$apply();
              });
            }
            if (scene.entities) {
              $scope.assetsToLoad += scene.entities.length;
              scene.entities.forEach(function(entity) {
                var entityId = entity.id;
                // console.log(entity.info);
                EditorService.getAssetInfo(entityId, 'entities').done(function(info) {  // Get each entity's info from the database
                    entity.info.animate = info.animate;
                    // console.log("Found entity info!", entity.info);
                    $scope.assetsLoaded++;
                    $scope.$apply();
                });
              });
            }
            if (scene.objects) {
              $scope.assetsToLoad += scene.objects.length;
              scene.objects.forEach(function(object) {
                var objectId = object.id;
                // console.log(object.info);
                EditorService.getAssetInfo(objectId, 'objects').done(function(info) {  // Get each object's info from the database
                    object.info.collisionMap = info.collisionMap;
                    object.info.image = info.image;
                    // console.log("Found object info!", object.info);
                    $scope.assetsLoaded++;
                    $scope.$apply();
                });
              });
            }
          });
        });
      });

      var checkGameLoadLoop = setInterval(function() {
        // console.log("Loading " + $scope.assetsToLoad + " assets.");
        // console.log($scope.assetsLoaded + " assets loaded.");
        var finishedLoading = false;
        if ($scope.assetsLoaded >= $scope.assetsToLoad) {
          finishedLoading = true;
        }
        if (finishedLoading) {
          clearInterval(checkGameLoadLoop);
          PopupService.close();
          self.gameLoaded = true;
          gameInfo = response.info;
          allMaps = gameInfo.maps;
          self.currentMap = allMaps[0];
          self.allRows = self.currentMap.scenes;
          self.currentRow = self.allRows[0];
          self.currentScene = self.currentRow[0];
          background = self.currentScene.background;
          objects = self.currentScene.objects;
          loadEntities();
          events = self.currentScene.events;
          drawEntities('background');
          drawObjects('background');
          drawBackground();
          startPos = {    // Eventually will come from game object
            map: 1,
            row: 0,
            column: 0,
            x: 300,
            y: 250
          };
          $scope.$apply();
        }
      }, 200);
    });

    function loadMainCharacter() {
        UserService.getPlayerAvatar().done(function(playerAvatar) {
          avatar = new Avatar(playerAvatar);
          avatar.info.pos.x = startPos.x;
          avatar.info.pos.y = startPos.y;
          avatar.info.currentFrame = avatar.info.animate.walkLeft[0];
          avatarLoaded = true;
          // fullPlayer.avatar = avatar;
          updateLocation();
          initSocket();
          // Tell the server that I joined this game
          fullPlayer.id = playerInfo.id;
          fullPlayer.game = self.gameName;
          socket.emit('game joined', fullPlayer);
        });
    }

    self.startGame = function() {
        self.currentScenePos = [startPos.map, startPos.row, startPos.column];
        // fullPlayer.scenePos = self.currentScenePos;
        loadMainCharacter();
        self.startTime = new Date();
        self.gameStarted = true;
    };

    function runGame() {
      // Any loading animation would happen here
      // Play button and appears when game is loaded and disappears when clicked
        if (self.gameStarted) {
            clearCanvas();
            if (avatarLoaded) {
                updateTime();
                updateAvatar();
                checkAvatarBounds();
                checkAvatarCollisions();
                updateEntities();
                checkEntityCollisions();
                drawEntities('background');
                drawObjects('background');
                drawAvatar(avatar);
                // drawAllPlayers();
                drawEntities('foreground');
                drawObjects('foreground');
                drawBackground();
            }
        }
        if (!self.pause) {
          requestAnimationFrame(runGame);
        }
    }
    requestAnimationFrame(runGame);


    function initSocket() {
    //   // Socket functionality
    //   // Get my own information
    //   socket.off('self info');
    //   socket.on('self info', function(id) {
    //     fullPlayer.socketId = id;
    //   });
    //
      // Notify me in the chat window that another player joined the game.
      socket.off('new player');
      socket.on('new player', function(playerBasic) {
        var msg = "Player " + playerBasic.id + ' is playing ' + playerBasic.game;
        $('.chat-messages').append($('<li>').text(msg));
      });
    //
    //   socket.off('draw new player');
    //   socket.on('draw new player', function(newPlayer) {
    //     newPlayer.avatar = new Avatar(newPlayer.avatar);
    //     allPlayers.push(newPlayer);
    //     var response = {
    //       data: fullPlayer,
    //       dest: newPlayer.socketId
    //     };
    //     socket.emit('draw old player', response);
    //   });
    //
    //   socket.off('draw old player');
    //   socket.on('draw old player', function(oldPlayer) {
    //     oldPlayer.avatar = new Avatar(oldPlayer.avatar);
    //     allPlayers.push(oldPlayer);
    //   });
    //
    //   socket.off('update player');
    //   socket.on('update player', function(playerUpdate) {
    //     // playerUpdate = {
    //     //   id: angular.copy(fullPlayer.id),
    //     //   game: angular.copy(fullPlayer.game),
    //     //   scenePos: angular.copy(fullPlayer.scenePos),
    //     //   socketId: angular.copy(fullPlayer.socketId),
    //     //   action: avatar.action
    //     // };
    //     for (var index = 0; index < allPlayers.length; index++) {
    //       if (allPlayers[index].id === playerUpdate.id) {
    //         allPlayers[index].avatar.action = angular.copy(playerUpdate.action);
    //         allPlayers[index].scenePos = angular.copy(playerUpdate.scenePos);
    //         allPlayers[index].avatar.info.pos = angular.copy(playerUpdate.pos);
    //       }
    //     }
    //   });
    //
      // When I submit a chat message, send it to the server along with the game I'm playing
      $('.chat-submit').submit(function(){
        var msgInfo = {
          msg: playerInfo.id + ': ' + $('.message').val(),
          gameName: self.gameName
        };
        socket.emit('chat message', msgInfo);
        $('.message').val('');
        return false;   // Prevent default page refresh
      });

      // When a message has been received, display it on the screen
      socket.off('chat message');
      socket.on('chat message', function(msg){
        $('.chat-messages').append($('<li>').text(msg));
      });

      // Notify me if a player leaves the game
      socket.off('player left');
      socket.on('player left', function(leavingPlayer) {
        var msg = "Player " + leavingPlayer.id + ' left ' + leavingPlayer.game;
        $('.chat-messages').append($('<li>').text(msg));
        // var indexToRemove = null;
        // for (var index = 0; index < allPlayers.length; index++) {
        //   if (allPlayers[index].id === leavingPlayer.id) {
        //     indexToRemove = index;
        //   }
        // }
        // if (indexToRemove !== null) {
        //   allPlayers.splice(indexToRemove, 1);
        // }
      });

      // Let others know that I left the game if the controller ceases (closing browser, etc)
      $scope.$on("$destroy", function(){
        var leavingPlayer = {
          id: playerInfo.id,
          game: self.gameName
        };
        socket.emit('game left', leavingPlayer);
      });
    }
    $scope.$apply();
  });
});
;angular.module('questCreator').controller('profileCtrl', function(socket, $state, $scope, UserService, PopupService) {

    $scope.showReqs = false;
    $scope.showCollabs = false;
    $scope.requestActive = false;
    $scope.collabActive = false;
    $scope.games = null;
    $scope.requests = null;
    $scope.avatars = null;
    $scope.large = null;

    UserService.checkLogin().then(function(response) {
        PopupService.open('loading-screen');
        $scope.user = UserService.get();

        $scope.getJoinedDate = function(date) {
            return new Date(date);
        };

        UserService.getUserGames().done(function(games) {
            $scope.games = games;
            $scope.$apply();
            UserService.getCollabRequests().done(function(requests) {
                $scope.requests = requests;
                $scope.$apply();
            });
            UserService.getCollaborators().done(function(collaborators) {
                $scope.collaborators = collaborators;
                $scope.$apply();
            });

            UserService.getAvatars().done(function(avatars) {
                $scope.avatars = avatars;
                for (var i = 0; i < avatars.length; i++) {
                    if (avatars[i].current)
                        $scope.large = avatars[i];
                    $scope.$apply();
                }
                PopupService.close();
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

        $scope.archiveGame = function(game, index) {
            var agree = confirm("Are you sure you wanna archive '" + game.name + "'? That means no one will be able to play it and all player information will be lost. You will NOT be able to retrieve this later");
            if (agree) {
                console.log('before', $scope.games);
                UserService.archive(game.id).done(function(response) {
                    $scope.games.splice(index, 1);
                    $scope.$apply();
                });
            }
        };

        $scope.showCollaborators = function() {
            $scope.collabActive = !$scope.collabActive;
            $scope.showCollabs = !$scope.showCollabs;
        };

        $scope.showRequests = function() {
            $scope.requestActive = !$scope.requestActive;
            $scope.showReqs = !$scope.showReqs;
        };

        $scope.toggleCollab = function(info) {
            UserService.toggleAccepted(info.game_id, info.user_id);
            var games = $scope.games;
            UserService.getCollabRequests().done(function(requests) {
                getGameName(requests, games);
            });
            UserService.getCollaborators().done(function(collaborators) {
                filterCollaborators(collaborators, games);
            });
        };

        $scope.removeRequest = function(collab, index) {
            UserService.toggleRequested(collab.game_id, collab.user_id).done(function(response) {
                $scope.requests.splice(index, 1);
                $scope.$apply();
            });
        };

        $scope.removeCollaborator = function(collaborator, index) {
            if (collaborator.requested) {
                UserService.toggleRequested(collaborator.game_id, collaborator.user_id);
            }
            UserService.toggleAccepted(collaborator.game_id, collaborator.user_id).done(function(response) {
                $scope.collaborators.splice(index, 1);
                $scope.$apply();
            });
        };

        $scope.highlightAvatar = function(avatar, index) {
            $scope.large = avatar;
        };

        $scope.updateDefault = function() {
            if ($scope.large) {
                for (var i = 0; i < $scope.avatars.length; i++) {
                    if ($scope.avatars[i].current && $scope.avatars[i].id !== $scope.large.id) {
                        $scope.avatars[i].current = false;
                        UserService.updateAvatar(false, $scope.avatars[i].id);
                    }
                    if ($scope.avatars[i].id === $scope.large.id) {
                        $scope.avatars[i].current = $scope.large.current;
                    }
                }
                UserService.updateAvatar($scope.large.current, $scope.large.id);
            }
        };

        $scope.openToEdit = function () {
            PopupService.open('edit-username', $scope);
        };

        $scope.cancel = function () {
          PopupService.close();
        };

        $scope.editUsername = function (newName) {
          console.log('here');
          PopupService.close();
          $scope.user.username = newName;
          UserService.editUsername(newName);
        };
    });
});
;angular.module('questCreator').controller('sceneCtrl', function(socket, $state, $scope, $compile, EditorService) {
  var self = this;

  this.view = 'events';

  this.selecting = {
    background: false,
    object: false,
    entity: false
  };

  this.selectedObject = null;
  this.selectedEntity = null;
  this.selectedEvent= null;

  this.selectBackground = function(background) {
    EditorService.getAssetInfo(background.id, 'backgrounds').done(function(info) {
        background.info = info;
        $scope.editor.currentScene.background = angular.copy(background);
        self.selecting.background = false;
        $scope.$apply();
    });
  };

  this.selectObject = function(object) {
    if (!object) {
      return;
    }
    EditorService.getAssetInfo(object.id, 'obstacles').done(function(info) {
        object.info = info;
        $scope.editor.currentScene.objects.push(angular.copy(object));
        self.selecting.object = false;
    });
  };

  this.selectEntity = function(entity) {
    if (!entity) {
      return;
    }
    EditorService.getAssetInfo(entity.id, 'entities').done(function(info) {
        entity.info = info;
        $scope.editor.currentScene.entities.push(angular.copy(entity));
        self.selecting.entity = false;
    });
  };

  this.selectEvent = function(event) {
    if (!event){
      return;
    }
    $scope.editor.currentScene.events.push(angular.copy(event));
  };

  this.alreadyAdded = function(event){
    if (!$scope.editor.currentScene){
      return false;
    } else {
      return $scope.editor.currentScene.events.forEach(function(element) {
        if (event.id === element.id){
          return true;
        } else {
          return false;
        }
      });
    }
  }

  this.removeEvent = function(index){
    $scope.editor.currentScene.events.splice(index, 1);
  };

  this.addLocationEvent = function(){
    var locationCount = ($scope.editor.currentScene.events.filter(function(element){
      return element.category === "location";
    })).length;
    console.log("LocationCount: ", locationCount);
    var name = (locationCount >= 1) ? "New Location Event " + (locationCount) : "New Location Event";
    var newEvent = {
      name: name,
      category: 'location',
      info: {
        requirements: [],
        results: {
          achievements: [],
          inventory: [],
          portal: {},
          text: []
        },
        triggers: []
      },
    };
    console.log("newEvent: ", newEvent);
    $scope.editor.currentScene.events.push(newEvent);
  };

  this.anyResults = function(event){
    if (!event) {
      return false;
    }
    var results = event.info.results;
    if (results.text.length > 0 ||
        results.achievements.length > 0 ||
        results.inventory.length > 0 ||
        Object.keys(results.portal).length > 0) {
      return true;
    } else {
      return false;
    }
  };

  this.anyRequirements = function(event){
    if (!event) {
      return false;
    }
    if (event.info.requirements.length === 0) {
      event.info.requirements = {
        achievements: [],
        inventory: []
      }
    }
    var requirements = event.info.requirements;
    //OH MY GOD THIS IS SO HACKY
    if (requirements.achievements.length > 0 ||
        requirements.inventory.length > 0) {
      return true;
    } else {
      return false;
    }
  };

  this.removeAsset = function(index, type){
    $scope.editor.currentScene[type].splice(index, 1);
  };

  this.saveScene = function(scene) {
    console.log("Turns out saving is unnecessary here. Here's the game as proof.");
    console.log($scope.editor.currentEditingGame);
  };

  this.placeAsset = function(asset, type) {
    console.log("placin");
    var position = {
      'top': "{{"+type+ ".info.pos.x}}",
      'left': "{{"+type+ ".info.pos.y}}",
      'position': 'absolute'
    };
    var url = asset.thumbnail;
    var html = '<img src="'+url+'" draggable">';
    var template = angular.element(html);
    var linkFn = $compile(template);
    var element = linkFn($scope);
    $(element).appendTo('#scene-BG');
    $scope.apply;
  };

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

  // Testing creation of avatar
  // var avatarTest = {
  //     name: 'Avatar Test',
  //     info: {
  //         // The x and y coordinate of the top left corner of the avatar
  //         pos: {
  //             x: 100,
  //             y: 250
  //         },
  //         // The character's speed
  //         speed: {
  //             mag: 3,
  //             x: 0,
  //             y: 0
  //         },
  //         // The animate object contains all the possible character actions with all of the frames to be drawn for each action.
  //         animate: {
  //             // Key: possible action, Value: array of frames
  //             walkLeft: [
  //                 // Each frame array element is an array of square objects to be drawn
  //                 // Frame 1 - walk left
  //                 [
  //                     {
  //                         x: 100,
  //                         y: 100,
  //                         width: 30,
  //                         height: 30,
  //                         color: 'blue'
  //                     }, {
  //                         x: 110,
  //                         y: 150,
  //                         width: 30,
  //                         height: 30,
  //                         color: 'green'
  //                     }
  //                 ],
  //                 // Frame 2 - walk left
  //                 [
  //                     {
  //                         x: 110,
  //                         y: 100,
  //                         width: 30,
  //                         height: 30,
  //                         color: 'blue'
  //                     }, {
  //                         x: 100,
  //                         y: 150,
  //                         width: 30,
  //                         height: 30,
  //                         color: 'green'
  //                     }
  //                 ]
  //             ],
  //             walkRight: [
  //                 // Frame 1 - walk right
  //                 [
  //                     {
  //                         x: 150,
  //                         y: 100,
  //                         width: 30,
  //                         height: 30,
  //                         color: 'blue'
  //                     }, {
  //                         x: 140,
  //                         y: 150,
  //                         width: 30,
  //                         height: 30,
  //                         color: 'green'
  //                     }
  //                 ],
  //                 // Frame 2 - walk right
  //                 [
  //                     {
  //                         x: 140,
  //                         y: 100,
  //                         width: 30,
  //                         height: 30,
  //                         color: 'blue'
  //                     }, {
  //                         x: 150,
  //                         y: 150,
  //                         width: 30,
  //                         height: 30,
  //                         color: 'green'
  //                     }
  //                 ]
  //             ],
  //             walkUp: [
  //                 // Frame 1 - walk up
  //                 [
  //                     {
  //                         x: 100,
  //                         y: 110,
  //                         width: 30,
  //                         height: 30,
  //                         color: 'red'
  //                     }, {
  //                         x: 150,
  //                         y: 100,
  //                         width: 30,
  //                         height: 30,
  //                         color: 'yellow'
  //                     }
  //                 ],
  //                 // Frame 2 - walk up
  //                 [
  //                     {
  //                         x: 100,
  //                         y: 100,
  //                         width: 30,
  //                         height: 30,
  //                         color: 'red'
  //                     }, {
  //                         x: 150,
  //                         y: 110,
  //                         width: 30,
  //                         height: 30,
  //                         color: 'yellow'
  //                     }
  //                 ]
  //             ],
  //             walkDown: [
  //                 // Frame 1 - walk down
  //                 [
  //                     {
  //                         x: 100,
  //                         y: 140,
  //                         width: 30,
  //                         height: 30,
  //                         color: 'red'
  //                     }, {
  //                         x: 150,
  //                         y: 150,
  //                         width: 30,
  //                         height: 30,
  //                         color: 'yellow'
  //                     }
  //                 ],
  //                 // Frame 2 - walk down
  //                 [
  //                     {
  //                         x: 100,
  //                         y: 150,
  //                         width: 30,
  //                         height: 30,
  //                         color: 'red'
  //                     }, {
  //                         x: 150,
  //                         y: 140,
  //                         width: 30,
  //                         height: 30,
  //                         color: 'yellow'
  //                     }
  //                 ]
  //             ],
  //             swimLeft: [
  //                 // Frame 1 - swim left
  //                 [
  //                     {
  //                         x: 100,
  //                         y: 100,
  //                         width: 30,
  //                         height: 30,
  //                         color: 'lightblue'
  //                     }, {
  //                         x: 150,
  //                         y: 150,
  //                         width: 30,
  //                         height: 30,
  //                         color: 'lightblue'
  //                     }
  //                 ],
  //                 // Frame 2 - swim left
  //                 [
  //                     {
  //                         x: 100,
  //                         y: 100,
  //                         width: 30,
  //                         height: 30,
  //                         color: 'gray'
  //                     }, {
  //                         x: 150,
  //                         y: 150,
  //                         width: 30,
  //                         height: 30,
  //                         color: 'gray'
  //                     }
  //                 ]
  //             ],
  //             swimRight: [
  //                 // Frame 1 - swim right
  //                 [
  //                     {
  //                         x: 100,
  //                         y: 100,
  //                         width: 30,
  //                         height: 30,
  //                         color: 'lightblue'
  //                     }, {
  //                         x: 150,
  //                         y: 150,
  //                         width: 30,
  //                         height: 30,
  //                         color: 'lightblue'
  //                     }
  //                 ],
  //                 // Frame 2 - swim right
  //                 [
  //                     {
  //                         x: 100,
  //                         y: 100,
  //                         width: 30,
  //                         height: 30,
  //                         color: 'gray'
  //                     }, {
  //                         x: 150,
  //                         y: 150,
  //                         width: 30,
  //                         height: 30,
  //                         color: 'gray'
  //                     }
  //                 ]
  //             ],
  //             swimUp: [
  //                 // Frame 1 - swim up
  //                 [
  //                     {
  //                         x: 100,
  //                         y: 100,
  //                         width: 30,
  //                         height: 30,
  //                         color: 'lightblue'
  //                     }, {
  //                         x: 150,
  //                         y: 150,
  //                         width: 30,
  //                         height: 30,
  //                         color: 'lightblue'
  //                     }
  //                 ],
  //                 // Frame 2 - swim up
  //                 [
  //                     {
  //                         x: 100,
  //                         y: 100,
  //                         width: 30,
  //                         height: 30,
  //                         color: 'gray'
  //                     }, {
  //                         x: 150,
  //                         y: 150,
  //                         width: 30,
  //                         height: 30,
  //                         color: 'gray'
  //                     }
  //                 ]
  //             ],
  //             swimDown: [
  //                 // Frame 1 - swim down
  //                 [
  //                     {
  //                         x: 100,
  //                         y: 100,
  //                         width: 30,
  //                         height: 30,
  //                         color: 'lightblue'
  //                     }, {
  //                         x: 150,
  //                         y: 150,
  //                         width: 30,
  //                         height: 30,
  //                         color: 'lightblue'
  //                     }
  //                 ],
  //                 // Frame 2 - swim down
  //                 [
  //                     {
  //                         x: 100,
  //                         y: 100,
  //                         width: 30,
  //                         height: 30,
  //                         color: 'gray'
  //                     }, {
  //                         x: 150,
  //                         y: 150,
  //                         width: 30,
  //                         height: 30,
  //                         color: 'gray'
  //                     }
  //                 ]
  //             ]
  //             // Other actions could go here
  //         },
  //         // The collision map is how the game can know whether the character has collided with another object or event trigger. It is an array of invisible (or gray for now) squares.
  //         collisionMap: [
  //             {
  //                 x: 100,
  //                 y: 180,
  //                 width: 80,
  //                 height: 10,
  //                 color: 'gray'
  //             }, {
  //                 x: 100,
  //                 y: 185,
  //                 width: 80,
  //                 height: 10,
  //                 color: 'gray'
  //             }
  //         ]
  //     },
  //     current: false
  // };

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
