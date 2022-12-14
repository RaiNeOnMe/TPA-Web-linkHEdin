import React from 'react'
import ReactDOM from 'react-dom/client'
import Register from './pages/register'
import Login from './pages/login'
import Home from './pages/Home'
import AccActivation from './pages/accActivation'
import Profile from './pages/Profile'
import ForgotPass from './pages/ForgotPass'
import ResetPass from './pages/ResetPass'
import NetworkPage from './pages/NetworkPage'
import { Outlet, Routes, Route, BrowserRouter as Router} from "react-router-dom"
import { ApolloClient, InMemoryCache, ApolloProvider, gql, ApolloLink, createHttpLink } from '@apollo/client';
import AuthContextProvider, { UserAuth } from './contexts/authContext'
import { ProtectedRoute, UnprotectedRoute} from './contexts/middleware'
import RefetchContextProvider from './contexts/refetch'
import useLocalStorage from './contexts/useLocalStrg'
import JobPage from './pages/JobPage'
import NotifPage from './pages/NotifPage'
import MessagePage from './pages/MessagePage'
import SearchPage from './pages/SearchPage'
import SpecPostPage from './pages/SpecPostPage'

const Protected = () => {
  return(
    <ProtectedRoute>
      <AuthContextProvider>
        <Outlet></Outlet>
      </AuthContextProvider>
    </ProtectedRoute>
  )
}

const Unprotected = () => {
  return(
    <UnprotectedRoute>
      <Outlet></Outlet>
    </UnprotectedRoute>
  )
}

function App(){
  const userContext = UserAuth();

  const main_url = "http://localhost:4444";
  const url = main_url + "/query";
  const [ token, setToken ] = useLocalStorage("token", "")
  console.log(token)

  const authLink = new ApolloLink((operation:any, forward:any)=>{
    if(token !== undefined && Object.keys(token).length !== 0){
      operation.setContext({
        headers:{
          Authorization: `Bearer ${token}`,
        }
      })
    }
    return forward(operation)
  })

  const httplink = createHttpLink({
    uri:url,
  })

  const client = new ApolloClient({
    link:authLink.concat(httplink),
    cache: new InMemoryCache({})
  })

  return(
    <ApolloProvider client={client}>
      <RefetchContextProvider>

        <Routes>
          <Route element={<Unprotected />}>
            <Route path='/' element = {<Login />}></Route>
            <Route path='/activate/:id' element = {<AccActivation />}></Route>
            <Route path='/forgot' element = {<ForgotPass />}></Route>
            <Route path='/register' element = {<Register />}></Route>
            <Route path='/resetPass/:id' element = {<ResetPass />}></Route>
          </Route>
          
          <Route element={<Protected />}>
            <Route path='/home' element = {<Home />}></Route>
            <Route path='/Profile/:id' element = {<Profile />}></Route>
            <Route path='/network' element = {<NetworkPage />}></Route>
            <Route path='/job' element = {<JobPage/>}></Route>
            <Route path='/notification' element = {<NotifPage />}></Route>
            <Route path='/message/*' element = {<MessagePage />}></Route>
            <Route path='/search/:text' element = {<SearchPage />}></Route>
            <Route path='/post/:id' element = {<SpecPostPage />}></Route>
          </Route>
        </Routes>
        
      </RefetchContextProvider>
    </ApolloProvider>
  )
}

export default App
