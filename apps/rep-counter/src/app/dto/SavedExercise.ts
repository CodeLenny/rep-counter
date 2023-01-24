import { Exercise } from "./Exercise";

/**
 * Tracks the exercises that a user has "saved" - either in a generic "favorites" list,
 * or categorized.
 */
export interface SavedExercise {
  /**
   * Use a long UUID.
   */
  _id: string;

  kind: "SavedExercise";

  /**
   * Users may categorize saved exercises (this may be presented as folders).
   *
   * A generic list (which may be presented as "liked exercises") should be used if no {@link list} is provided.
   */
  list?: string;

  /**
   * Users may add tags to saved exercises for organization.
   */
  tags: string[];

  /**
   * The origin of this exercise:
   * - `"built-in"` for exercises that are compiled into the software
   * - `"user"` for exercises in the user's personal database
   * - `"public"` for exercises in the public library of exercises
   * - `"shared"` for exercises that are individually shared with this user
   *
   * Not all of these options are implemented (e.g. sharing),
   * but they are defined in the database schema for future planning.
   */
  type: "built-in" | "user" | "public" | "shared";

  /**
   * Foreign key.  Depends on {@link type} to determine which data set the exercise should be loaded from.
   */
  exerciseId: string;

  /**
   * User notes about the exercise.
   */
  notes?: string;

  /**
   * User changes to the saved exercise.
   *
   * Saving overrides and loading them may not be implemented yet.
   */
  overrides?: Partial<Exercise>;
}
