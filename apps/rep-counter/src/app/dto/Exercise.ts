import { Translatable } from "./Translatable";

/**
 * The definition of an exercise.
 */
export interface Exercise {
  _id: string;

  kind: "Exercise";

  name: Translatable;

  /**
   * A short description for the exercise,
   * that may be shown in a list.
   */
  description?: Translatable;

  /**
   * Longer text that is not shown unless the exercise is expanded.
   */
  explanation?: Translatable;

  /**
   * The total number of sets.
   */
  sets: number;

  /**
   * The number of reps in each set.
   */
  reps: number;

  /**
   * If each set should be divided in two, for "left"/"right" sides.
   * Will double the number of {@link reps}.
   */
  sided: boolean;

  /**
   * The duration that each rep should be held for.
   * `undefined` if reps should not be held.
   */
  duration?: number;

  /**
   * The number of seconds between each rep.
   */
  rest?: number;

  /**
   * The number of seconds between each set.
   */
  setRest?: number;
}

export interface StoredExercise extends Exercise {
  _id: string;
}
