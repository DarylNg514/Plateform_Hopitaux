import PropTypes from 'prop-types'
import styled from 'styled-components'
import colors from '../utils/styles/colors'
import { useFetch, useTheme } from "../utils/hooks";
import { LinkStyled } from '../utils/styles/Atoms'
import DefaultPicture from '../../assets/images/profile.png';


const CardWrapper = styled.div`
  display: flex;
  flex-direction: column;
  padding: 15px;
  background-color: ${({ theme }) => theme === 'light' ? colors.backgroundLight : colors.backgroundDark};
  justify-content: space-around;
  border-radius: 30px;
  width: 300px;
  height: 300px;
  box-shadow: 0 0 0 8px rgba(0, 0, 0, .1);
  transition: 200ms;
  &:hover {
      cursor: pointer;
      box-shadow: 2px 2px 10px #e2e3e9;
  }
`
const CardLabel = styled.span`
  color: wheat;
  font-size: 22px;
  font-weight: normal;
  padding-left: 15px;
  font-weight: bold;
  text-decoration: none;
`;
const CardImage = styled.img`
  height: 150px;
  width: 150px;
  align-self: center;
  border-radius: 50%;
`
const CardTitle = styled.span`
  color: ${({ theme }) => theme === 'light' ? colors.dark : colors.dark};
  font-size: 22px;
  font-weight: normal;
  align-self: center;
`

function Card({ id, label, title, picture }) {
  const { theme } = useTheme()

  const handleError = (event) => {
    event.target.src = DefaultPicture
  }

  const handleEdit = () => {
    // Code pour rediriger vers la page de modification ou ouvrir une modal de modification
    console.log(`Modifier l'hôpital avec l'ID: ${id}`)
    // Exemple : redirection vers la page de modification
    window.location.href = `/edit-hopital/${id}`;
  }

  const handleDelete = async () => {
    try {
      const response = useFetch(`http://localhost:5000/auth//hopital/:id`, 'DELETE')
      if (response.ok) {
        console.log(`Hôpital avec l'ID: ${id} supprimé`)
        // Code pour mettre à jour l'interface utilisateur après la suppression
        window.location.reload(); // Recharger la page pour actualiser la liste
      } else {
        console.error('Erreur lors de la suppression de l\'hôpital')
      }
    } catch (error) {
      console.error('Erreur lors de la suppression de l\'hôpital', error)
    }
  }

  return (
    <LinkStyled to={`/ProfileHopital/${id}`} id={id}>
      <CardWrapper theme={theme} >
        <CardLabel>{label}</CardLabel>
        <CardImage
          src={picture}
          alt="freelance"
          onError={handleError}
        />
        <CardTitle theme={theme}>{title}</CardTitle>

        <button onClick={handleDelete}><ion-icon name="trash-outline"></ion-icon></button>
        <button onClick={handleEdit}><ion-icon name="pencil-outline"></ion-icon></button>
      </CardWrapper>
    </LinkStyled>
  )
}

Card.propTypes = {
  id: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  picture: PropTypes.string.isRequired,
}

Card.defaultProps = {
  title: 'Mon Nom par défaut',
  label: 'Ma Profession par défaut',
  picture: DefaultPicture,
}

export default Card
