// // GETTING STARTED 0
// // document.addEventListener('click', () => console.log('Clicked!'));

// import { fromEvent } from 'rxjs';
// fromEvent(document, 'click')
//   .subscribe(() => console.log('Clicked!'));




































// creation operators
// fromEvent
// of - emits, then completes
// from - emits, then completes
// interval
// timer

// mapping
  // map, pluck, mapTo
// filtering
  // filter - returns an observable that only emits certain values from the source observable
  // take - accepts a number of values you define from the source, before completing
  // first - take one value, but you want this to be dependant on some logic (shortcut for filtering for a specific condition, then taking 1 value)
  // takeWhile - accepts a predicate operator, emitting the same values as the source observable, as long of the predicate condition is met. As soon as the predicate returns false, the obsevable completes.
  // takeUntil - emits the same values as the source observable until a second Observable that you provide, notifier, emits a value. Then, it completes.
  // distinctUntilChanged - emits unique values from the source observable, based on a comparison to the previously emitted value. Can supply a custom comparison function as an argument

  // rate-limiting operators (subset of filtering operators)
    // debounceTime - lets you emit the last emitted value from a source observable after the specified amount of time has passed since emissions
    // throttleTime - ignores values after a duration you specify after an emitted value. This timer behavior repeats for each value emitteds.

    // compare throttleTime & debounceTime

  // TODO: finish
  // sampleTime emits the latest value from the source observable in each section of time. literally lets you sample 1 emission per each sample of time

  // TODO: finish
  // auditTime

// reducing
  // reduce - applies a reducer function on each value emitted from the source. On source observable completion, emits the final accumulated value. (The pipeable operator scan will emit the accumulator on each source obervable emission)
  // scan - allows you to accumulate state over time, applying a reducer function on each emission from the source observable to generate an accumulator, and emitting that accumulator on each source emission
  // tap lets you spy on a source observable, performing side effects, without affecting the underlying stream. very usefule for debugging. tap completely ignores any return values from any of the next, error, complete functions you provide. Tap does NOT trigger Observable execution the way subscribe does.

// transformations
  // flattening subsection on transformation operators
    // observable that emits an observable, a higher order observable
    // managing the creation of inner subscriptions for us, emitting the results. These are called flattening operators.
    // They take an observable that emits observables, and return an observable of just the emitted observable's values.

  // mergeMap - maps values to a new observable on emissions from source, subscribing to & emitting results of inner observables. By default does NOT limit number of active inner observables (so be cautious about memory leaks from long running inner observables!)
  // switchMap - like mergeMap, but only maintains one innerobservable at a time. So when we map to a new inner observable, the previous is completed.
  // switches to a new observable on emissions from source, cancelling any previously active inner observables
  // because of this cancellation behavior, it's the safest flattening operator, as it's much harder to create memory leaks than it is with mergeMap 
  // useful for HTTP requests that can be cancelled (GET, probably), as well as any functionality around resetting, pausing, or resuming
  // avoid switchMap when cancellation can have undesired effects, such as saves (POSTs, probably)
  // concatMap - queues each inner observable, until the previous one completes
  // exhaustMap - also maintains only 1 inner observable. Any new observable emissions are ignored if the current inner observable is still active. Useful when you have some UI element that can be spammed (ie, login button that triggers an AJAX request)

// combination operators
  // startWith / endWith - appends any number of values to the beginning / end of a stream

  // TODO: finish
  // concat (there are creation as well as pipeable operator versions) - creates an observable from a variable number of other observables that you supply. On subscription, concat will subscribe to the inner Observables in order. ie, as the first inner observable completes, concat subscribes to the second, etc... Any values emitted by inner observables are emitted by concat. default to concat as a creation operator, as it tends to be easier to read and reason about.

  // **creation operators**

  // TODO: finish
  // merge

  // TODO: finish
  // combineLatest

  // TODO: finish
  // forkJoin

  // TODO: finish
  // forkJoin