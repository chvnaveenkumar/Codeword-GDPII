import auth from './auth'

export default {
  auth (to, from, next) {
    next(auth.check() ? true : {
      path: '/',
      query: {
        redirect: to.name
      }
    })
  }
}
