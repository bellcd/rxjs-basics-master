import { BehaviorSubject, Subject } from 'rxjs';
import { scan, distinctUntilKeyChanged, pluck } from 'rxjs/operators';

export class ObservableStore {
  constructor(initialState) {
    this._store = new BehaviorSubject(initialState)
    this._stateUpdates = new Subject();

    // accumulate state
    this._stateUpdates.pipe(
      scan((acc, currentValue) => {
        return {
          ...acc, 
          ...currentValue
        }
      }, initialState)
    ).subscribe(this._store)
  }

  updateState(stateUpdate) {
    this._stateUpdates.next(stateUpdate); 
  }

  selectState(stateKey) {
    return this._store.pipe(
      distinctUntilKeyChanged(stateKey ),
      pluck(stateKey)
    )
  }

  stateChanges() {
    return this._store.asObservable();
  }
}