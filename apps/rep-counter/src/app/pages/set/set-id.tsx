import {
  Box,
  Button,
  Center,
  Container,
  Flex,
  Heading,
  Progress,
  Stack,
  Text,
} from "@chakra-ui/react";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import { useDoc, usePouch } from "use-pouchdb";
import { Set, SetRep } from "../../dto/Set";

export function SetPage() {
  const sets = usePouch<Set>("sets");
  const [storingSet, setStoringSet] = useState(false);
  const { setId } = useParams();
  const [undoConfirm, setUndoConfirm] = useState(false);

  const [repStart, setRepStart] = useState<number | false>(false);
  const [repTime, setRepTime] = useState("");
  const [repProgress, setRepProgress] = useState(0);

  const { doc, loading, error } = useDoc<Set>(setId ?? "", {
    db: "sets",
  });

  // TODO: Load a default, either from {@link doc} or from local storage or other persistant storage.
  const [trackEachRep, setTrackEachRep] = useState(true);

  const duration = useMemo(() => {
    if (!doc || !doc.duration) {
      return false;
    }
    return doc.duration * 1000;
  }, [doc]);

  const setIndex = useMemo(() => {
    if (!doc) {
      return [];
    }
    const sets: number[] = [];
    for (let set = 0; set < doc.sets; set++) {
      sets.push(set);
    }
    return sets;
  }, [doc]);

  const repIndex = useMemo(() => {
    if (!doc) {
      return [];
    }
    const reps: number[] = [];
    for (let rep = 0; rep < doc.reps; rep++) {
      reps.push(rep);
    }
    return reps;
  }, [doc]);

  const [currentRep, lastRep] = useMemo(() => {
    if (!doc) {
      return [undefined, undefined];
    }

    let lastRep = undefined;
    for (let set = 0; set < doc.sets; set++) {
      const sideIndex =
        doc.sides === "sides"
          ? (["left", "right"] as const)
          : ([false] as const);
      for (const side of sideIndex) {
        for (let rep = 0; rep < doc.reps; rep++) {
          const stored = (doc.rep ?? []).find(
            (r) => r.set === set && r.side === side && r.rep === rep
          );

          const repInfo = {
            set,
            side,
            rep,
            started: stored?.started ?? false,
          };

          if (!stored || stored.complete !== true) {
            return [repInfo, lastRep];
          }

          lastRep = repInfo;
        }
      }
    }

    return [undefined, lastRep];
  }, [doc]);

  const storeRep = useCallback(async () => {
    if (!doc || !currentRep || storingSet) {
      return;
    }

    const rep: SetRep = {
      set: currentRep.set,
      side: currentRep.side,
      rep: currentRep.rep,
      started: repStart ? repStart : Date.now(),
      complete: true,
    };

    setStoringSet(true);
    await sets.put({
      ...doc,
      rep: [
        ...(doc.rep ?? []).filter(
          (r) =>
            !(r.set === rep.set && r.side === rep.side && r.rep === rep.rep)
        ),
        rep,
      ],
    });
    setStoringSet(false);
  }, [currentRep, doc, repStart, sets, storingSet]);

  useEffect(() => {
    if (!repStart || !duration) {
      return;
    }
    const interval = setInterval(() => {
      const elapsed = Date.now() - repStart;
      if (elapsed > duration) {
        setRepStart(false);
        clearInterval(interval);
        storeRep();
        return;
      }
      setRepTime(`${Math.round((duration - elapsed) / 100) / 10}`);
      setRepProgress(100 * (elapsed / duration));
    }, 50);
    return () => {
      clearInterval(interval);
    };
  }, [duration, repStart, storeRep]);

  if (error) {
    return (
      <Container maxW="container.lg">
        <Heading>Error Loading Set</Heading>
      </Container>
    );
  }

  if (loading || !doc) {
    return (
      <Container maxW="container.lg">
        <Heading>Loading...</Heading>
      </Container>
    );
  }

  return (
    <Container maxW="container.lg">
      <Stack w="full">
        {setIndex.map((set) => (
          <Flex key={`set${set}`} direction="row">
            {(doc.sides === "sides"
              ? (["left", "right"] as const)
              : ([false] as const)
            ).map((side) => (
              <Stack key={`side-${set}-${side}`} flex="1">
                {typeof side === "string" && <Text size="sm">{side}</Text>}
                <Stack direction="row">
                  {repIndex.map((rep) => {
                    const existing = (doc.rep ?? []).find(
                      (r) => r.set === set && r.side === side && r.rep === rep
                    );

                    return (
                      <Box
                        key={`rep${set}${side}${rep}`}
                        w={2}
                        h={2}
                        borderRadius="sm"
                        bg={
                          existing && existing.complete
                            ? "green"
                            : existing && existing.started
                            ? "purple"
                            : "gray"
                        }
                      />
                    );
                  })}
                </Stack>
              </Stack>
            ))}
          </Flex>
        ))}
      </Stack>
      {currentRep && (
        <Box mt={10}>
          <Heading as="h1" size="lg" textAlign="center">
            Set {currentRep.set + 1}
            {typeof currentRep.side === "string"
              ? `, ${currentRep.side} side`
              : ""}
          </Heading>
          <Heading as="h2" size="sm" textAlign="center">
            Rep {currentRep.rep + 1} / {doc.reps}
          </Heading>

          {trackEachRep && doc.hold && (
            <Box>
              <Center>
                <Text width="4em" fontSize="2xl">
                  {repStart === false
                    ? doc.duration
                    : `${repTime}`.includes(".")
                    ? repTime
                    : `${repTime}.0`}
                </Text>
              </Center>
              <Progress
                colorScheme="purple"
                value={repStart === false ? 0 : repProgress}
                my={2}
              />
              {repStart === false && (
                <Center my={2}>
                  <Button
                    colorScheme="purple"
                    size="lg"
                    onClick={async () => {
                      const started = Date.now();
                      const rep: SetRep = {
                        set: currentRep.set,
                        side: currentRep.side,
                        rep: currentRep.rep,
                        started,
                        complete: false,
                      };
                      if (storingSet) {
                        return;
                      }
                      setStoringSet(true);
                      await sets.put({
                        ...doc,
                        rep: [
                          ...(doc.rep ?? []).filter(
                            (r) =>
                              !(
                                r.set === rep.set &&
                                r.side === rep.side &&
                                r.rep === rep.rep
                              )
                          ),
                          rep,
                        ],
                      });
                      setStoringSet(false);
                      setRepProgress(0);
                      setRepTime(`${doc.duration}`);
                      setRepStart(started);
                    }}
                  >
                    Start
                  </Button>
                </Center>
              )}
            </Box>
          )}

          {trackEachRep && !doc.hold && (
            <Center my={3}>
              <Button colorScheme="purple" size="lg" onClick={() => storeRep()}>
                Record Rep
              </Button>
            </Center>
          )}

          {!trackEachRep && !doc.hold && (
            <Center my={3}>
              <Button
                colorScheme="purple"
                size="lg"
                onClick={async () => {
                  if (storingSet) {
                    return;
                  }
                  setStoringSet(true);
                  await sets.put({
                    ...doc,
                    rep: [
                      ...(doc.rep ?? []).filter(
                        (r) =>
                          !(
                            r.set === currentRep.set &&
                            r.side === currentRep.side
                          )
                      ),
                      ...repIndex.map<SetRep>((rep) => ({
                        set: currentRep.set,
                        side: currentRep.side,
                        rep,
                        started: Date.now(),
                        complete: true,
                      })),
                    ],
                  });
                  setStoringSet(false);
                }}
              >
                Record all {doc.reps} reps
              </Button>
            </Center>
          )}
        </Box>
      )}
      {lastRep && (
        <Box mt={10}>
          <Button
            colorScheme="orange"
            size="xs"
            variant={undoConfirm ? "solid" : "outline"}
            onClick={async () => {
              if (!undoConfirm) {
                setUndoConfirm(true);
              } else {
                setUndoConfirm(false);
                if (storingSet) {
                  return;
                }
                setStoringSet(true);
                await sets.put({
                  ...doc,
                  rep: (doc.rep ?? []).filter(
                    (r) =>
                      !(
                        r.set === lastRep.set &&
                        r.side === lastRep.side &&
                        r.rep === lastRep.rep
                      )
                  ),
                });
                setStoringSet(false);
              }
            }}
          >
            Undo Rep {lastRep.rep + 1} (set {lastRep.set + 1}
            {typeof lastRep.side === "string" ? `, ${lastRep.side} side` : ""})
          </Button>
          {undoConfirm && (
            <Button
              ml={2}
              colorScheme="green"
              size="xs"
              variant="solid"
              onClick={() => {
                setUndoConfirm(false);
              }}
            >
              Cancel
            </Button>
          )}
        </Box>
      )}
      {!doc.hold && (
        <Box my={2}>
          <Button size="xs" onClick={() => setTrackEachRep(!trackEachRep)}>
            {trackEachRep
              ? "Record entire sets at once"
              : "Track each rep individually"}
          </Button>
        </Box>
      )}
    </Container>
  );
}
