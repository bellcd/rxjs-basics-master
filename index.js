// import { Observable } from 'rxjs';

// // PART 1
// // creating an observable from scratch

// const observer = {
//   next: value => console.log('next: ', value),
//   error: error => console.log('error: ', error),
//   complete: () => console.log('complete')
// }

// const observable = new Observable(subscriber => {
//   subscriber.next('hello');
//   subscriber.next('world');
//   subscriber.complete()
//   subscriber.next('world');
// });

// console.log('before');
// observable.subscribe(observer)
// console.log('after');

// in RxJS, calling next on a subscriber is telling that subscriber that we have a new value for them. This is also know as pushing, or emitting a value.

// The Observable constructor accepts a function, which itself takes a parameter called subscriber.
// this subscriber is an enhanced version of the observer you supply when subscribing to this observable
// within this function, you can deliver 0 to many values to the observer by calling the subscriber's .next() method

// Observables are lazy, meaning that until there is something subscribing to the observable, nothing will be run

// what does 'triggering an observable execution' mean?
// calling subscribe on the observable, a way of hooking up an observable to its observer. Observers are the public, vanilla version of the subscriber that the Observable constructor function recieves as an argument.

// when you call subscribe on an observable, it converts the observer you provide into a subscriber in order to safely handle things like completion, error handling, and unsubscribing. Subscribers are a wrapped, safe version of an observer
// some of the values for the observer are optional, is this why?

// observers are simply objects, that can contain up to 3 properties - next, error, complete, which can contain callbacks to be registered on the observable
// next - represents the happy path function that is invoked when the observable emits a value. can be called 0 to many times
// error - invoked once when an error occurs and is passed the error object
// completes - invoked 0 or 1 times. Can only be invoked when the observable completes. Receives no values.

// additional emissions from an observable after completing are ignored

// PART 2 - variations for the subscribe method
// the subscribe method can accept
  // an observer object with
    // 1, 2, or 3 of the next, error, & complete functions, in any combination. When you're observer is converted into a subscriber, the functions you do not supply will be ignored, or stubbed out with defaults
  // nothing - but be careful because that could be a warning sign you've moved the logic elsewhere
  // next, error, & complete functions directly as arguments, in that order

// // PART 3 - Observables emitting values asynchronously
// import { Observable } from 'rxjs';

// const observer = {
//   next: value => console.log('next: ', value),
//   error: error => console.log('error: ', error),
//   complete: () => console.log('complete')
// }

// const observable = new Observable(subscriber => {
//   let count = 0;
//   const id = setInterval(() => {
//     subscriber.next(count);
//     subscriber.complete();
//     count += 1;
//   }, 1000);

//   return () => {
//     clearInterval(id);
//     console.log('called');
//   };
// });

// console.log('before');
// observable.subscribe(observer)
// console.log('after');

// // Observbales can deliver values synchronously or asynchronously over any period of time.

// // The Observable subscribe function that we pass to the constructor, can itself return a function that will be invoked when the Observable completes. This is a great place for clean up logic for any resources that the Observable created.

// PART 4 - Managing Observable subscriptions
import { Observable } from 'rxjs';

const observer = {
  next: value => console.log('next: ', value),
  error: error => console.log('error: ', error),
  complete: () => console.log('complete')
}

const observable = new Observable(subscriber => {
  let count = 0;
  const id = setInterval(() => {
    subscriber.next(count);
    count += 1;
  }, 1000);

  return () => {
    clearInterval(id);
    console.log('called');
  };
});

console.log('before');
const subscription = observable.subscribe(observer)
console.log('after');

const subscriptionTwo = observable.subscribe(observer);
subscription.add(subscriptionTwo)
setTimeout(() => {
  subscription.unsubscribe()
}, 3500)

// One big advantage of using Observables is they allow for cancellation. ie, the consumer can tell the Observable that they've had enough, and no more values will be delivered.
// Whenever you subscribe to an Observable, a subscription object is returned. 
// One method that subscription object has is unsubscribe, which
  // cleans up any resources being used by the Observable
  // invokes the cleanup method for the Observable
  // does NOT emit a complete notification

// calling subscribe() on the Observable again will trigger a second execution path, so there will now be two (2) intervals running

// subscription objects have an add() method which lets you add multiple subscriptions together, and also clean them up in one call.

// RECAP 1
// Observables are push based, the Observable decides when to deliver data to the Observer, by invoking callbacks that you provide.
// Observables are cold by default. Observables are not activated until you subscribe. Each subscription creates its own execution path between the producer and consumer (also known as unicasting)
// Observables can emit multiple 0 - many, values
// Observables can deliver values both synchronously or asynchronously
// Observables can be cancelled. The producer can, at any time, unsubscribe, which will prevent any future values from being delivered

// OVERVIEW
/*
 * Any code samples you want to play with can go in this file.
 * Updates will trigger a live reload on http://localhost:1234/
 * after running npm start.
 */
// of('Hello', 'RxJS').subscribe(console.log);

// creating an Observable, you can new-up an Observable instance, but more likely, you'd use the creation operators.

// creation operators
// fromEvent
// of
// from
// interval
// timer

// pipeable operators
// mapping
  // map, pluck, mapTo
// filtering
  // filter
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