import ReactDOM from 'react-dom/client';

import { Page } from './Page';
import 'content/tailwind.css';
import '@algolia/satellite/satellite.min.css';

ReactDOM.createRoot(document.getElementById('root')!).render(<Page />);
