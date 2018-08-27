import { Ability } from '@casl/ability'
import { AUTH_SUCCESS, AUTH_LOGOUT } from './actions'

export const ability = new Ability()

export const abilityPlugin = (store) => {
  ability.update(store.state.rules)

  return store.subscribe((mutation) => {
    switch (mutation.type) {
      case AUTH_SUCCESS:
        ability.update(mutation.payload.rules)
        break
      case AUTH_LOGOUT:
        ability.update([{}])
        break
    }
  })
}
