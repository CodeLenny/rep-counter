import { Exercise } from "../dto/Exercise";

export const Pushup = {
  _id: "pushup",
  kind: "Exercise",
  name: {
    en: "Push-up",
  },
  reps: 10,
  sets: 10,
  sided: false,
  setRest: 20,
} as const satisfies Exercise;

export const exercises = [Pushup] as const;
