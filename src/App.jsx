import Editor from "./pages/Editor";
import SettingsContextProvider from "./context/SettingsContext";

export default function App() {
  return (
    <SettingsContextProvider>
      <Editor />
    </SettingsContextProvider>
  );
}
