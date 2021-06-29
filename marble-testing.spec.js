import { TestScheduler } from 'rxjs/testing';
import { map, take, delay, catchError } from 'rxjs/operators';
import { concat, from, of, throwError, interval } from 'rxjs';
import { breweryTypeahead } from './index.js'
describe('Marble Testing in RxJS', () => {
  let testScheduler;

  beforeEach(() => {
    testScheduler = new TestScheduler((actual, expected) => {
      expect(actual).toEqual(expected);
    })
  })

  it('should convert ASCII diagrams into observables', () => {
    testScheduler.run(helpers => {
      // all testing logic
      const { cold, expectObservable } = helpers;
      const source$ = cold('--a-b---c');
      const expected =     '--a-b---c';
      expectObservable(source$).toBe(expected);
    });
  })
  it('should allow configuration of emitted values', () => {
    testScheduler.run(helpers => {
      const { cold, expectObservable } = helpers;
      const source$ = cold('--a-b---c', { a: 1, b: 2, c: 3 });
      const final$ = source$.pipe(map(value => value * 10));
      const expected =     '--a-b---c';
      expectObservable(final$).toBe(expected, { a: 10, b: 20, c: 30 });
    });
  })
  it('should let you identify subscription points', () => {
    testScheduler.run(helpers => {
      const { cold, expectObservable, expectSubscriptions } = helpers;
      const source$ =            cold('-a---b-|');
      const sourceTwo$ =         cold('-c---d-|');
      const final$ = concat(source$, sourceTwo$);
      const expected =                '-a---b--c---d-|';
      const sourceOneExpectedSub =    '^------!';
      const sourceTwoExpectedSub =    '-------^------!';
      expectObservable(final$).toBe(expected);
      expectSubscriptions(source$.subscriptions).toBe(sourceOneExpectedSub);
      expectSubscriptions(sourceTwo$.subscriptions).toBe(sourceTwoExpectedSub);
    });
  })
  it('should let you test hot observables', () => {
    testScheduler.run(helpers => {
      const { hot, expectObservable } = helpers;
      const source$ =  hot('--a-b-^-c');
      const final$ = source$.pipe(take(1));
      const expected =           '--(c|)';
      expectObservable(final$).toBe(expected);
    });
  })
  it('should let you test synchronous operations', () => {
    testScheduler.run(helpers => {
      const { expectObservable } = helpers;
      const source$ = from([1, 2, 3, 4, 5]);
      const expected = '(abcde|)'
      expectObservable(source$).toBe(expected, { a: 1, b: 2, c: 3, d: 4, e: 5 });
    });
  })
  it('should let you test asynchronous operations', () => {
  testScheduler.run(helpers => {
      const { expectObservable } = helpers;
      const source$ = from([1, 2, 3, 4, 5]);
      const final$ = source$.pipe(delay(1000));
      const expected = '1s (abcde|)'
      expectObservable(final$).toBe(expected, { a: 1, b: 2, c: 3, d: 4, e: 5 });
    });
  });
  it('should debounce input by 200ms', () => {
    testScheduler.run(helpers => {
      const { cold, expectObservable } = helpers;
      const searchTerm = 'testing';
      const source$ = cold('a', { a: { target: { value: searchTerm }}});
      const final$ = source$.pipe(
        breweryTypeahead({
          getJSON: () => of(searchTerm).pipe(delay(300))
        })
      );
      const expected = '500ms a';
      expectObservable(final$).toBe(expected, { a: searchTerm });
    });
  });
  it('should cancel active requests if another value is emitted ', () => {
    testScheduler.run(helpers => {
      const { cold, expectObservable } = helpers;
      const searchTerm = 'testing';
      const source$ = cold('a 250ms b', {
        a: { target: { value: 'first' }},
        b: { target: { value: 'second' }}
      });
      const final$ = source$.pipe(
        breweryTypeahead({
          getJSON: () => of(searchTerm).pipe(delay(300))
        })
      );
      const expected = '751ms a';
      expectObservable(final$).toBe(expected, { a: searchTerm });
    });
  });
  it('should not emit duplicate values in a row', () => {
    testScheduler.run(helpers => {
      const { cold, expectObservable } = helpers;
      const searchTerm = 'testing';
      const source$ = cold('a 250ms b', {
        a: { target: { value: 'first' }},
        b: { target: { value: 'first' }}
      });
      const final$ = source$.pipe(
        breweryTypeahead({
          getJSON: () => of(searchTerm).pipe(delay(300))
        })
      );
      const expected = '500ms a';
      expectObservable(final$).toBe(expected, { a: searchTerm });
    });
  });
  it('should ignore ajax errors', () => {
    testScheduler.run(helpers => {
      const { cold, expectObservable } = helpers;
      const searchTerm = 'testing';
      const source$ = cold('a 250ms b', {
        a: { target: { value: 'first' }},
        b: { target: { value: 'first' }}
      });
      const final$ = source$.pipe(
        breweryTypeahead({
          getJSON: () => throwError('error')
        })
      );
      const expected = '';
      expectObservable(final$).toBe(expected);
    });
  });
  it('should let you test errors & error messages', () => {
    testScheduler.run(helpers => {
      const { expectObservable } = helpers;
      const source$ = of({ firstName: 'Christian', lastName: 'Bell' }, null).pipe(
        map(o => `${o.firstName} ${o.lastName}`),
        catchError(() => {
          throw 'Invalid user!'
        })
      );
      const expected = '(a#)'
      expectObservable(source$).toBe(expected, { a: 'Christian Bell' }, 'Invalid user!');
    })
  });
  it('should let you test snapshots of streams that do not complete', () => {
    testScheduler.run(helpers => {
      const { expectObservable } = helpers;
      const source$ = interval(1000).pipe(
        map(val => `${val + 1}sec`),
      );
      const expected = '1s a 999ms b 999ms c';
      const unsubscribe = '4s !';
      expectObservable(source$, unsubscribe).toBe(expected, {
        a: '1sec',
        b: '2sec',
        c: '3sec',
      });
    })
  });
});