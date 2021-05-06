import type { SurfaceInterface } from "../../types/models";
import Level from "./Level";
import { generateBlocks, isMob } from "../../utils";
import Point from "../../basics/Point";
import Vector from "../../basics/Vector";
import GLOBAL from "../../constants/global";
import EVENT from "../../constants/event";
import {
  patternReconfigure,
  configureRule,
} from "../../algorithm/patternReconfiguration";
import Mob from "../entity/mobs/Mob";
import Cow from "../entity/mobs/Cow";
import Sheep from "../entity/mobs/Sheep";
import Goat from "../entity/mobs/Goat";
import Pig from "../entity/mobs/Pig";
import Door from "../entity/item/Door";
import Time from "../Time";

class Surface extends Level implements SurfaceInterface {
  constructor(time: Time) {
    super(time);
  }

  public onDaylightCycle(listener: (lightLevel: number) => void) {
    this.on(EVENT.SURFACE.DAYLIGHT_CYCLE, listener);
  }

  public onMobMove(listener: (mob: Mob) => void) {
    this.on(EVENT.SURFACE.MOB.MOVE, listener);
  }

  public updateTarget(pos: Point, motion: Vector) {
    this.entities.forEach((entity) => {
      if (isMob(entity)) {
        entity.updateTarget(pos, motion);
      }
    });
  }

  protected create() {
    super.create();

    const entities = [
      new Cow(new Point(5 * GLOBAL.UNIT_LENGTH, 5 * GLOBAL.UNIT_LENGTH)),
      new Sheep(new Point(6 * GLOBAL.UNIT_LENGTH, 6 * GLOBAL.UNIT_LENGTH)),
      new Goat(new Point(7 * GLOBAL.UNIT_LENGTH, 7 * GLOBAL.UNIT_LENGTH)),
      new Pig(new Point(7 * GLOBAL.UNIT_LENGTH, 7 * GLOBAL.UNIT_LENGTH)),
      new Door(new Point(4 * GLOBAL.UNIT_LENGTH, 4 * GLOBAL.UNIT_LENGTH)),
    ];

    entities.forEach((entity) => {
      if (isMob(entity)) {
        entity.onMove((mob) => {
          this.emit(EVENT.SURFACE.MOB.MOVE, mob);
        });
      }
    });

    this.lightLevel = 11;
    this.blocks = patternReconfigure(
      generateBlocks(20, 20, GLOBAL.UNIT_LENGTH),
      configureRule
    );
    this.entities = entities;
    this.spawnPos = new Point(2 * GLOBAL.UNIT_LENGTH, 2 * GLOBAL.UNIT_LENGTH);
  }

  protected update() {
    super.update();

    if (this.lastTime % 160 === 0) {
      this.updateLight();
    }
  }

  private updateLight() {
    if (this.time.dayTime >= 22800 || this.time.dayTime < 1200) {
      this.lightLevel += 1;
      this.emit(EVENT.SURFACE.DAYLIGHT_CYCLE, this.lightLevel);
    } else if (this.time.dayTime >= 10800 && this.time.dayTime < 13200) {
      this.lightLevel -= 1;
      this.emit(EVENT.SURFACE.DAYLIGHT_CYCLE, this.lightLevel);
    }
  }
}

export default Surface;
