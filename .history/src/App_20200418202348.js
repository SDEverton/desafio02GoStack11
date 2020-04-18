import React, { useEffect, useState } from "react";

import "./styles.css";

import api from './services/api';

function App() {
  const [repositories, setRepositories] = useState([]);

  useEffect(() => {
    api.get('repositories').then(response => {
      setRepositories(response.data);
    });

  }, []);

  async function handleAddRepository() {
    const response = await api.post('repositories', {
      title: `Novo elemento ${Date.now()}`,
	    url: "https://github.com.br",
	    techs: ["React js", "Node js"]
    });

    const repository = response.data;

    setRepositories([...repositories, repository]);
  }

  async function handleRemoveRepository(id) {
    const response = await api.delete(`repositories/${id}`);

    const repositoryIndex = repositories.findIndex(repo => repo.id === id);

    if (repositoryIndex < 0) {
      return response.status(400).json({ error: 'Repository not found.'})
    }

    repositories.splice(repositoryIndex, 1);

    setRepositories([...repositories]);
  }

  return (
    <div>
      <ul data-testid="repository-list">
        {repositories.map(repository => 
          <li key={repository.id}>
            {repository.title}
            <button onClick={() => handleRemoveRepository(repository.id)}>
              Remover
            </button>
          </li>
        )}
      </ul>

      <button onClick={handleAddRepository}>Adicionar</button>
    </div>
  );
}

export default App;
