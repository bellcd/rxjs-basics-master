import { ObservableStore } from './store';

const store = new ObservableStore({
  user: 'Christian',
  isAuthenticated: false
});


// store.selectState('user').subscribe(console.log);

store.updateState({
  user: 'Dan'
});

store.updateState({
  isAuthenticated: true
})