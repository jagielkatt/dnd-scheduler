import { Scheduler } from "./components/scheduler/Scheduler";
import { BottomMenu } from "./components/scheduler/components/bottomMenu/BottomMenu";
import { SheetBar } from "./components/scheduler/components/sheetBar/SheetBar";
import { EditContextProvider } from "./context/EditContext";

function App() {
  return (
    <div className="App">
      <EditContextProvider>
        <Scheduler />
        <BottomMenu />
        <SheetBar />
      </EditContextProvider>
    </div>
  );
}

export default App;
