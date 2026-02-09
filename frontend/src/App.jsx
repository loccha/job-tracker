import { useState } from 'react'
import StatusColumn from './components/StatusColumn/StatusColumn'
import './App.css'

function App() {

    const columns = [
        { id: 1, title: 'To Apply', status: 'to-apply' },
        { id: 2, title: 'Pending', status: 'pending' },
        { id: 3, title: 'Interview', status: 'interview' },
        { id: 4, title: 'Declined', status: 'declined' }
    ];

  return (
    <div className="kanban-board">
        {columns.map(column => (
            <StatusColumn
                key={column.id}
                title={column.title}
                status={column.status}
            />
          ))
        }
    </div>
  );
}


export default App;
