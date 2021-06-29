

// creation operators
// fromEvent
// subscription objects
  // console.log()s as Subscriber object
  // apparently you can call next() on these ... (ie, VS an observable, which you can NOT call next() on)
// of - each argument becomes a next notification, no flattening of the arguments. Then completes
// from - converts various data types to observables. Iterables (ie, arrays an such) will be emitted as a sequence. Then completes
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

  // concatMap - queues each inner observable, until the previous one completes
  // exhaustMap - also maintains only 1 inner observable. Any new observable emissions are ignored if the current inner observable is still active. Useful when you have some UI element that can be spammed (ie, login button that triggers an AJAX request)

// combination operators
  // startWith / endWith - appends any number of values to the beginning / end of a stream

  // **creation operators**

  // TODO: finish
  // merge

  // TODO: finish
  // combineLatest

  // TODO: finish
  // forkJoin

  // TODO: finish
  // forkJoin

  // MASTERCLASS
  // TODO: 
    // multicast()
    // .connect()
    // multicast() & refCount()
    // share()

    // behaviorSubject
      // variant of Subject, whereby any additional subscribers receive the last emitted value from the Subject on subscription
    
    // replaySubject
      // variant of Subject, where you can configure some number, n, of values to be emitted to late subscribers on subscription

    // shareReplay
      // pipeable operator, that uses ReplaySubject behind the scenes (ie, turning a unicasting observable into a multicasting observable) while also emitting old values to late subscribers. Provides many options for controlling how & when replay values. If you don't need late subscribers to have access to old values, use the share operator instead.

    // AsyncSubject
      // variant of Subject that only emits the last emitted value to all subscribers when the Subject completes. AsyncSubjects do NOT emit any values to subscribers until completion. Only the last value is emitted to subscribers on completion. All previous values emitted to the AsyncSubject are ignored. Probably the least used of the Subject variants, useful when you want to multicast a single value on complete.

    // Schedulers
      // each scheduler accepts three arguments, 
        // work - a function to be invoked on schedule
        //  delay - time before the function should be called
        // state - data that will be provided to your work function
      // most static creation operators accept an optional scheduler as the last argument
      // observeOn
        // Lets you include schedulers at any point in the operator chain, mirroring the source emission values, but wrapping next, error, & complete notifications in the provided scheduler.
        // observeOn wraps ALL notifications in the provided scheduler (so even error notifications will be delayed! VS delay, which will emit error notifications immediately)
      // subscribeOn
        // you can think about this as sort of like wrapping your entire subscribe block in a setTimeout
    // asyncScheduler
      // Lets you schedule tasks to be fired asynchronously, similar to setTimeout 
    // asapScheduler
      // executes tasks asynchronously, but as soon as possible, similar to queueing a microtask. Exercise caution when using the asapScheduler, because of how the microtask queue blocks.
    // animationFrameScheduler
      // Lets you schedule tasks before browser repaint, similar to requestAnimationFrame
      // the delay must NOT be set (or set to 0), or else the asyncScheduler will be used instead
    // queueScheduler
      // Lets you schedule tasks synchronously, executing the next when the previous completes. ie, executes tasks synchronously, in a queue
      // primary use case for this is when you need to control the order of tasks scheduled inside other tasks - tasks scheduled inside of other tasks will always be run after the outer task completes.

import { animationFrameScheduler, interval, queueScheduler, ajax, EMPTY, fromEvent } from 'rxjs';
import { takeWhile, debounceTime, pluck, distinctUntilChanged, switchMap, catchError } from 'rxjs/operators';

const observer = {
  next: val => console.log('next', val),
  error: err => console.log('error', err),
  complete: () => console.log('complete')
};

queueScheduler.schedule(() => {
  queueScheduler.schedule(() => {
    console.log('inner queue');
  });
  console.log('first queue');
});
console.log('sync');

const BASE_URL = ''

// brewery typeahead custom pipeable operator, for testing purposes
export const breweryTypeahead = (ajaxHelper = ajax) => sourceObservable => {
  return sourceObservable.pipe(
    debounceTime(200),
    pluck('target', 'value'),
    distinctUntilChanged(),
    switchMap(searchTerm => 
      ajaxHelper.
        getJSON(`${BASE_URL}?by_name=${searchTerm}`)
        .pipe(catchError(() => EMPTY))
    )
  )
}

const source$ = fromEvent(document, 'click');
const subscription = source$.subscribe(observer);
source$.next();
// console.log('subscription', subscription);
// subscription.next('value');
// subscription.unsubscribe();
// subscription.next('value');