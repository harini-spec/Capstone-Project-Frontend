import { BrowserRouter } from 'react-router-dom';
import { Route, Routes } from 'react-router';
import './Styles/MainStyles.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min';
import 'react-toastify/dist/ReactToastify.css';
import { DashBoardComponent } from './Components/DashBoard/DashBoardComponent';
import { HealthLogComponent } from './Components/HealthLog/HealthLogComponent';
import { GetAllTargetsComponent } from './Components/Target/GetAllTargetsComponent';
import { TargetFormComponent } from './Components/Target/TargetFormComponent';
import { HomeComponent } from './Components/HomeComponent';
import { LoginComponent } from './Components/Auth/LoginComponent';
import { RegisterComponent } from './Components/Auth/RegisterComponent';
import { UserPreferencesComponent } from './Components/Metric/UserPreferencesComponent';
import { Navbar } from './Components/Navbar';

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Navbar />
        <Routes>
          <Route path="/" element={<HomeComponent/>}/>
          <Route path="/Login" element={<LoginComponent/>}/>
          <Route path="/Register" element={<RegisterComponent/>}/>
          <Route path="/UserPreferences" element={<UserPreferencesComponent />}/>
          <Route path="/DashBoard" element={<DashBoardComponent/>}/>
          <Route path="/AddHealthLog/:PrefId" element={<HealthLogComponent isUpdateMode={false}/>}/>
          <Route path="/UpdateHealthLog/:PrefId/:HealthLogId" element={<HealthLogComponent isUpdateMode={true}/>}/>
          <Route path="/Alltargets/:PrefId" element={<GetAllTargetsComponent/>}/>
          <Route path="/AddTarget/:PrefId" element={<TargetFormComponent isUpdateMode={false}/>}/>
          <Route path="/UpdateTarget/:PrefId/:TargetId" element={<TargetFormComponent isUpdateMode={true}/>}/>
          
          {/* /CoachDashBoard */}
          {/* /Suggestions */}
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
