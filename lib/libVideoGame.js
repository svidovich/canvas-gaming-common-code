import { uuidv4 } from "./utils.js";

// Class for input keys, probably used mostly in the extension
// of the following class, BasicKeyboardInput.
export class InputKey {
  constructor(code) {
    this.code = code;
    this.active = false;
  }
}

// Basic, functional keyboard input offering WASD directional
// controls and some extras. Easy to expand, and easy to extend
// as well. Registers its own event listeners to Window.
export class BasicKeyboardInput {
  constructor() {
    // Directions
    this.inputs = {
      up: new InputKey(87), // w
      down: new InputKey(83), // s
      left: new InputKey(65), // a
      right: new InputKey(68), // d
      space: new InputKey(32),
      enter: new InputKey(13),
      lshift: new InputKey(16),
    };

    this.register();
  }

  changeInputByEventType = (eventType) => {
    if (eventType === "keydown") {
      return true;
    } else if (eventType === "keyup") {
      return false;
    }
  };

  register() {
    window.addEventListener("keydown", this.keySwitch);
    window.addEventListener("keyup", this.keySwitch);
  }

  keySwitch = (keyPressEvent) => {
    const keyCode = keyPressEvent.keyCode;
    const eventType = keyPressEvent.type;

    // For every input on our class,
    Object.entries(this.inputs).forEach(([inputName, inputKey]) => {
      // Compare the keycode to that input's keycode;
      if (keyCode === inputKey.code) {
        // If there's a match, change whether it's active.
        inputKey.active = this.changeInputByEventType(eventType);
      }
    });
  };
}

// A generic ABC for in-game entities based on what I've done before.
// This might change somewhat.
export class Entity {
  constructor(x, y) {
    this.id = uuidv4();
    this.x = x;
    this.y = y;
    this.visible = true;
    this.queueDeletion = false;
  }

  get coordinates() {
    return {
      x: this.x,
      y: this.y,
    };
  }

  draw() {
    throw new Error("Classes extending Entity should implement draw().");
  }

  update() {
    throw new Error("Classes extending Entity should implement update().");
  }
}

export class Player extends Entity {
  constructor(x, y, health) {
    super(x, y);
    this.health = health;
    this.input = new BasicKeyboardInput();
  }

  draw() {
    throw new Error("Classes extending Player should implement draw().");
  }

  update() {
    throw new Error("Classes extending Player should implement update().");
  }
}

export class GameState {
  constructor() {
    this.paused = false;
    this.activeMenu = null;
    this.allEntities = new Object();
    this.entitiesByClass = new Object();
    this.visibleEntities = new Array();
  }

  addEntity(entity) {
    if (entity.id) {
      this.allEntities[entity.id] = entity;
      const entityClass = entity.constructor.name;
      if (!this.entitiesByClass[entityClass]) {
        this.entitiesByClass[entityClass] = new Array();
      }
      this.entitiesByClass[entityClass].push(entity.id);
    } else {
      throw new Error("Entity doesn't have an ID! This is catastrophic, in like, my opinion!");
    }
  }

  removeEntity(entity) {
    // Let's check some stuff.
    // Is it in the visible entities array?
    const id = entity.id;
    const entityClass = entity.constructor.name;

    const entityPositionInVisibleEntitiesArray = this.visibleEntities.indexOf(id);
    if (entityPositionInVisibleEntitiesArray !== -1) {
      // If so, we should get it out of there.
      this.visibleEntities.splice(entityPositionInVisibleEntitiesArray);
    }
    // Is it in the 'entities by class' array for this entity's class?
    const entityPositionInEntitiesByClassArray = this.entitiesByClass[entityClass].indexOf(id);
    if (entityPositionInEntitiesByClassArray !== -1) {
      // If so, we should get it out of there.
      this.entitiesByClass[entityClass].splice(entityPositionInEntitiesByClassArray);
    }
    // Once we've done that, we need to remove its reference from our entities object.
    // We _cannot recover the entity_.
    delete this.allEntities.id;
  }

  updateEntities(CanvasContext) {
    // For each of our entities that are being tracked in the game state...
    Object.entries(this.allEntities).forEach(([id, entity]) => {
      // Update the entity.
      entity.update(CanvasContext);
      // If our entity has become invisible,
      if (entity.visible === false) {
        // do our best to remove it from the 'visibleEntities' array.
        const entityPositionInVisibleEntitiesArray = this.visibleEntities.indexOf(id);
        if (entityPositionInVisibleEntitiesArray > -1) {
          this.visibleEntities.splice(entityPositionInVisibleEntitiesArray);
        }
      }
      // If our entity is visible but not in the 'visibleEntities' array,
      if (entity.visible === true && this.visibleEntities.indexOf(id) === -1) {
        // We should add its id to the array.
        this.visibleEntities.push(id);
      }
      // If it's time to delete our entity,
      if (entity.queueDeletion) {
        // Well. There it went.
        this.removeEntity(entity);
      }
    });
  }
}
