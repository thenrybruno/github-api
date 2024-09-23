import { useCallback, useEffect, useState } from "react"
import { Container, DeleteButton, Form, List, SubmitButton } from "./styles"
import { FaBars, FaGithub, FaPlus, FaSpinner, FaTrash } from "react-icons/fa"
import api from '../../services/api'
import { Link } from "react-router-dom"

const Home = () => {
    const [newRepo, setNewRepo] = useState('')
    const [repositorios, setRepositorios] = useState([])
    // const [repositorios, setRepositorios] = useState(() => {
    //     const repoStorage = localStorage.getItem('repo')

    //     return repoStorage ? JSON.parse(repoStorage) : []
    // })
    const [loading, setLoading] = useState(false)
    const [alert, setAlert] = useState(null)

    //Buscando repositórios salvos no localStorage
    useEffect(() => {
        const repoStorage = localStorage.getItem('repo')

        if (repoStorage) {
            setRepositorios(JSON.parse(repoStorage))
        }
    }, [])

    //Salvando repositórios no localStorage
    useEffect(() => {
        localStorage.setItem('repo', JSON.stringify(repositorios))
    }, [repositorios])

    const handleSubmit = useCallback((e) => {
        e.preventDefault()

        async function submit() {
            setLoading(true)
            setAlert(null)
            try {
                if (newRepo === '') {
                    throw new Error('Você precisa indicar um repositório!')
                }

                const response = await api.get(`repos/${newRepo}`)

                const hasRepo = repositorios.find(repo => repo.name === newRepo)

                if (hasRepo) {
                    throw new Error('Repositório Duplicado.')
                }

                const data = {
                    name: response.data.full_name
                }

                setRepositorios([...repositorios, data])
                setNewRepo('')
            } catch (error) {
                setAlert(true)
                console.log(error)
            } finally {
                setLoading(false)
            }
        }

        submit()
    }, [newRepo, repositorios])

    function handleInputChange(e) {
        setNewRepo(e.target.value)
        setAlert(null)
    }

    const handleDelete = useCallback((repo) => {
        const find = repositorios.filter(r => r.name !== repo)
        setRepositorios(find)
    }, [repositorios])

    return (
        <Container>
            <h1>
                <FaGithub size={25} />
                Meus Repositórios
            </h1>

            <p>
                Descubra as Issues abertas e fechadas do repósitorio de sua escolha! Basta colocar o nome do dono do repositório e depois o nome do repositório.
                <p>Ex.: facebook/react</p>
            </p>

            <Form onSubmit={handleSubmit} error={alert}>
                <input
                    type="text"
                    placeholder="Adicionar Repositórios"
                    value={newRepo}
                    onChange={handleInputChange}
                />

                <SubmitButton loading={loading ? 1 : 0}>
                    {
                        loading ? (
                            <FaSpinner color='#fff' size={14} />
                        ) : (
                            <FaPlus color="#fff" size={14} />
                        )
                    }
                </SubmitButton>
            </Form>

            <List>
                {repositorios.map(repo => (
                    <li key={repo.name}>
                        <span>
                            <DeleteButton onClick={() => handleDelete(repo.name)}>
                                <FaTrash size={14} />
                            </DeleteButton>
                            {repo.name}
                        </span>
                        <Link to={`/repositorio/${encodeURIComponent(repo.name)}`}>
                            <FaBars size={20} />
                        </Link>
                    </li>
                ))}
            </List>
        </Container>
    )
}

export default Home