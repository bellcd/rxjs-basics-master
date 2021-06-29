import { of } from 'rxjs'
import { map, mergeMap, toArray, delay, catchError } from 'rxjs/operators';

describe('subscribe and assert testing in RxJS', () => {
  it('should compare each emitted value', done => {
    const source$ = of(1, 2, 3);
    const final$ = source$.pipe(
      map(value => value * 10),
      toArray()
    );
    const expected = [10, 20, 30];
    final$.subscribe({
      next: value => {
        expect(value).toEqual(expected);  
      },
      complete: () => done()
    });
  });
  it('should let you test async operations with done callback', done => {
    const source$ = of('ready', 'set', 'go').pipe(
      mergeMap((message, index) => of(message).pipe(
        delay(index * 1000)
      ))
    );
    const expected = ['ready', 'set', 'go'];
    let index = 0;
    source$.subscribe(
      value => {
        console.log('value', value)
        expect(value).toBe(expected[index]);
        ++index;
      },
      null,
      done
    )
  });
  it('should let you test errors & error messages', done => {
    const source$ = of({ firstName: 'Christian', lastName: 'Bell' }, null).pipe(
      map(o => `${o.firstName} ${o.lastName}`),
      catchError(() => {
        throw 'Invalid user!'
      })
    );
    const expected = ['Christian Bell', 'Invalid user!'];
    const actual = [];
    source$.subscribe({
      next: value => {
        actual.push(value);
      },
      error: error => {
        actual.push(error);
        expect(actual).toEqual(expected);
        done();
      },
    })
  });
});