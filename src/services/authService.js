// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional

//Import the functions you need from the SDKs you need
const { initializeApp } = require('firebase/app')
const { Datastore } = require('@google-cloud/datastore')

// Instantiate a Datastore client

// TODO: Add SDKs for Firebase products that you want to use

const firebaseConfig = {
  apiKey: "AIzaSyBClv6sNt9E1d0uKqH3CSMT7ZZznYwL8tM",
  authDomain: "capstone-404613.firebaseapp.com",
  projectId: "capstone-404613",
  storageBucket: "capstone-404613.appspot.com",
  messagingSenderId: "810640269478",
  appId: "1:810640269478:web:eb717633f558bb3f535467"
}

  
// Initialize Firebase
const app = initializeApp(firebaseConfig,"Capstone")
  
const projectId = app.options.projectId
const keyFilename = 'credentials.json'
// Instantiate a Datastore client with the project ID
const db = new Datastore({
  projectId,
  keyFilename,
  databaseId: `${process.env.DATABASE_ID}`,
})

const pool = {
  db
}
module.exports = pool


const addToken=async(token,pool)=> {
  try {
    const entity = {
      key: pool.db.key(['auth']),
      data: {
        refreshToken: token,
      },
    }

    try {
      await pool.db.save(entity)
      return true // Assuming RegisterUser is a class, adjust as needed
    } catch (err) {
      throw new Error(err.message)
    }
  } catch (error) {
    throw new Error(error.message)
  }
}

const checkAvailableToken= async(token,pool)=> {
  try {
    const kind = 'auth'

    // Create a query with an explicit filter for the refreshToken
    const query = pool.db
      .createQuery(kind)
      .filter('refreshToken', '=', token)

    const [entities] = await pool.db.runQuery(query)
    if (entities.length < 0) {
      throw new Error('Token is not available')
    }
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error(error)
    throw new Error(error.message)
  }
}

const deleteToken=async(token,pool)=> {
  try {
    const kind = 'auth'

    // Create a query with an explicit filter for the refreshToken
    const query = pool.db
      .createQuery(kind)
      .filter('refreshToken', '=', token)

    const [entities] = await pool.db.runQuery(query)

    if (entities.length > 0) {
      const entityKey = entities[0][pool.db.KEY]
      await pool.db.delete(entityKey)
      return true
    }else{
      return false
    }
   
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error(error)
    throw new Error(error.message)
  }
}
module.exports = {
  addToken,
  checkAvailableToken,
  deleteToken
}