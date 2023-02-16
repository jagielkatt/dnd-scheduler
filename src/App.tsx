import { Scheduler } from "./components/scheduler/Scheduler";
import { EditContextProvider } from "./context/EditContext";

function App() {
  return (
    <div className="App">
      <EditContextProvider>
        <Scheduler />
      </EditContextProvider>
    </div>
  );
}

export default App;
