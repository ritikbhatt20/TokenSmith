import './App.css';
import MintNft from './components/MintNft';
import MintToken from './components/MintToken';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        
        <MintToken/>
        <MintNft/>
      </header>
    </div>
  );
}

export default App;
