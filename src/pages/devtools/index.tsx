import ReactDOM from 'react-dom/client';

import { App } from './App';
import 'content/tailwind.css';
import '@algolia/satellite/satellite.min.css';

ReactDOM.createRoot(document.getElementById('root')!).render(<App />);
