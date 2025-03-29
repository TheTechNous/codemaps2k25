import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import { motion } from 'framer-motion';
import AddConstraints from './components/AddConstraints';
import AddCourse from './components/AddCourse';
import AddTemplate from './components/AddTemplate';
import ConstraintList from './components/ConstraintList';
import CourseList from './components/CourseList';
import EditConstraints from './components/EditConstraints';
import EditCourse from './components/EditCourse';
import EditTemplate from './components/EditTemplate';
import RecommendationSystem from './components/RecommendationSystem';
import TemplateList from './components/TemplateList';
import Timetable from './components/Timetable';
import UserRegistration from './components/UserRegistration';
import UserLogin from './components/UserLogin';
import RoleBasedAccessControl from './components/RoleBasedAccessControl';
import TrelloIntegration from './components/TrelloIntegration';
import AsanaIntegration from './components/AsanaIntegration';

const App = () => {
  return (
    <Router>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
        <Switch>
          <Route path="/add-constraints" component={AddConstraints} />
          <Route path="/add-course" component={AddCourse} />
          <Route path="/add-template" component={AddTemplate} />
          <Route path="/constraint-list" component={ConstraintList} />
          <Route path="/course-list" component={CourseList} />
          <Route path="/edit-constraints/:id" component={EditConstraints} />
          <Route path="/edit-course/:id" component={EditCourse} />
          <Route path="/edit-template/:id" component={EditTemplate} />
          <Route path="/recommendations" component={RecommendationSystem} />
          <Route path="/template-list" component={TemplateList} />
          <Route path="/timetable" component={Timetable} />
          <Route path="/register" component={UserRegistration} />
          <Route path="/login" component={UserLogin} />
          <Route path="/role-based-access-control" component={RoleBasedAccessControl} />
          <Route path="/trello-integration" component={TrelloIntegration} />
          <Route path="/asana-integration" component={AsanaIntegration} />
        </Switch>
      </motion.div>
    </Router>
  );
};

export default App;
