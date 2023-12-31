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

const postArtikel = async (article)=>{
  try {
    const entity = {
      key: pool.db.key(['article']),
      data: article,
    }
  
    try {
      await pool.db.save(entity)
      const formattedArticle = [entity.data].map((article)=>({
        id:article.id,
        title:article.title,
        description:article.description,
        imageUrl:article.imageUrl,
        webUrl:article.webUrl,
        updateAt:new Date(article.updateAt).toLocaleString(),
        createdAt :new Date(article.createdAt).toLocaleString(),

      })

      )
      
      return formattedArticle
    } catch (err) {
      throw new Error(err.message)
    }
  } catch (error) {
    // eslint-disable-next-line no-console
    console.log(error.message)
    return error
  }
}

const getAllArticles =async (pool)=>{
  const kind = 'article' // Assuming 'articles' is the kind in your datastore

  // Create a query to retrieve all articles
  const query = pool.db.createQuery(kind)

  const [articles] = await pool.db.runQuery(query)

 

  const formattedArticle = articles.map((article)=>({
    id:article.id,
    title:article.title,
    description:article.description,
    imageUrl:article.imageUrl,
    webUrl:article.webUrl,
    updateAt:new Date(article.updateAt).toLocaleString(),
    createdAt :new Date(article.createdAt).toLocaleString(),

  })

  )

  return formattedArticle
}

async function getArticleById(articleId,pool) {
  const kind = 'article' 
  const query = pool.db
    .createQuery(kind)
    .filter('id', '=', articleId)

  const [article] = await pool.db.runQuery(query)
 
 
      
  if (!article) {
    throw new Error('Article not found')
  }

  const formattedArticle = article.map((article)=>({
    id:article.id,
    title:article.title,
    description:article.description,
    imageUrl:article.imageUrl,
    webUrl:article.webUrl,
    updateAt:new Date(article.updateAt).toLocaleString(),
    createdAt :new Date(article.createdAt).toLocaleString(),

  }))
      
      
        
      
  return formattedArticle
}

async function UpdateArticleById(ArticleData, pool) {
  try {
    const query = pool.db.createQuery('article').filter('id', '=', ArticleData.id)
    const [entities] = await pool.db.runQuery(query)

    if (entities && entities.length > 0) {
      const entityKey = entities[0][pool.db.KEY] // Assuming the key is needed for update

      // Update the entity data with ArticleData
      const updatedEntity = {
        key: entityKey,
        data: { ...entities[0], ...ArticleData },
      }

      // Save the updated entity back to the Datastore
      const updatedArticle = await pool.db.update(updatedEntity)
      
      if (!updatedArticle) {
        throw new Error('Failed to update Article')
      }

      return updatedArticle
    } else {
      throw new Error('Article not found')
    }
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('Error updating Article:', error.message)
    throw error
  }
}

const deleteArticle=async(articleId,pool)=> {
  try {
    const kind = 'article'
    
    const query = pool.db
      .createQuery(kind)
      .filter('id', '=', articleId)

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


module.exports ={ postArtikel, getAllArticles, getArticleById, UpdateArticleById,deleteArticle,pool}