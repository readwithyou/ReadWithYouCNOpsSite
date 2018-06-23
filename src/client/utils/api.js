import Vue from 'vue'

const mocks = {
  '/api/auth': { 'POST': { token: 'This-is-a-mocked-token' } },
  'user/me': { 'GET': { name: 'doggo', title: 'sir' } }
}

const apiCall = ({url, data, method}) => new Promise((resolve, reject) => {
  var resource = Vue.resource(url);
  resource.save(data).then(
    response => {
      resolve(mocks[url][method || 'GET'])
    },
    response => {
      reject(new Error())
    }
  );
})

export default apiCall
