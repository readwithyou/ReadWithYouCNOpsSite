import Vue from 'vue'

const apiCall = ({ url, data, method }) => new Promise((resolve, reject) => {

  if (method === 'GET') {
    var resource = Vue.resource(url);
    resource.get().then(
      response => {
        resolve(response.body)
      },
      response => {
        reject(new Error())
      }
    );
  } if (method === 'POST') {
    var resource = Vue.resource(url);
    resource.save(data).then(
      response => {
        resolve(response.body)
      },
      response => {
        reject(new Error())
      }
    );
  }
})

export default apiCall
