export interface SetRep {
  set: number;
  side: "left" | "right" | false;
  rep: number;
  started: number;

  /**
   * If the user is "past" this rep - either completed, or skipped.
   */
  complete: boolean;
}

export interface Set {
  _id: string;
  kind: "Set";

  exerciseId?: string;

  hold: boolean;

  duration?: number;

  reps: number;

  sides: "single" | "sides";

  sets: number;

  rep?: SetRep[];
}
