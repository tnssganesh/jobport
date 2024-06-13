import {Route, Switch, Redirect} from 'react-router-dom'
import LoginForm from './component/LoginForm'
import Home from './component/Home'
import ProtectedRoute from './component/ProtectedRoute'
import Jobs from './component/Jobs'
import ProductItemDetails from './component/ProductItemDetails'
import NotFound from './component/NotFound'
import './App.css'

// These are the lists used in the application. You can move them to any component needed.

// Replace your code here
const App = () => (
  <div>
    <Switch>
      <Route exact path="/login" component={LoginForm} />

      <ProtectedRoute exact path="/" component={Home} />
      <ProtectedRoute exact path="/jobs/:id" component={ProductItemDetails} />
      <ProtectedRoute exact path="/jobs" component={Jobs} />
      <Route exact path="/not-found" component={NotFound} />
      <Redirect to="not-found" />
    </Switch>
  </div>
)

export default App

/* 





import './App.css'

// These are the lists used in the application. You can move them to any component needed.

// Replace your code here
const App = () => (
  <div>
    <Switch>
     
    </Switch>
  </div>
)

export default App
 */
