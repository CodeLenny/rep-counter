import { customAlphabet } from "nanoid";
import { nolookalikesSafe } from "nanoid-dictionary";
import { Exercise } from "../dto/Exercise";
import { Set } from "../dto/Set";

export function createSet(exercise: Exercise): Set {
  return {
    _id: customAlphabet(nolookalikesSafe)(6),
    kind: "Set",
    sets: exercise.sets,
    sides: exercise.sided ? "sides" : "single",
    hold: typeof exercise.rest === "number",
    reps: exercise.reps,
    duration: exercise.duration,
    exerciseId: exercise._id,
  };
}
