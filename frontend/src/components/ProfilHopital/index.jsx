import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import styled from "styled-components";
import colors from "../utils/styles/colors";
import { InfoError, Loader } from "../utils/styles/Atoms";import DefaultPicture from '../assets/images/Default_Profile.png'
import { useFetch, useTheme } from "../utils/hooks";

const CardContainer = styled.div`
    display: flex;
    flex-wrap: wrap;
    justify-content: flex-start;
    background-color: ${({theme}) => theme === 'light' ? colors.backgroundLight : colors.backgroundDark};
    border-radius: 30px;
    height: 400px;
    margin: 60px 200px 60px 200px;
    transition: 200ms;
    box-shadow: 0 0 0 8px rgba(0, 0, 0, .1);
`
const CardInfos =  styled.div`
    display: flex;
    flex-direction: column;
    justify-content: space-evenly;
    height: 300px;
    margin: 30px 0px 0px 150px;
`;
const Ville =  styled.div`
    margin: 63px 200px 0px 0px;
    color: ${({ theme }) => theme === 'light' ? 'black' : 'white'};
`
const CardLabel = styled.span`
    color: ${({ theme }) => theme === 'light' ? 'black' : 'white'};
    font-size: 22px;
    font-weight: normal;
    font-weight: bold;
`;
const CardImage = styled.img`
    height: 300px;
    width: 300px;
    align-self: center;
    border-radius: 50%;
    margin: 0px 0px 0px 100px;
`
const CardTitle = styled.span`
    color: ${({ theme }) => theme === 'light' ? 'black' : 'white'};
    font-size: 22px;
    font-weight: normal;
`
const Competence = styled.div`
    display: flex;
    flex-wrap: wrap;
    flex-direction: row;
    justify-content: space-between;
    font-family: 'Roboto', sans-serif;
    font-weight: lighter;
`
const Skill = styled.div`
    margin: 0px 10px 0px 0px;
    padding: 5px;
    color: ${({ theme }) => theme === 'light' ? 'black' : 'white'};
    border: ${({ theme }) => theme === 'light' ? '1px solid #000000' : '1px solid #fffff2'};
    border-radius:  7px;
`
const Tarif = styled.div`
    font-size: 30px;
    color: ${({ theme }) => theme === 'light' ? 'black' : 'white'};
`
const Available = styled.div`
    display: flex;
    justify-content: flex-start;
    align-items: center;
    color: ${({ theme }) => theme === 'light' ? 'black' : 'white'};
`
const Disponible = styled.div`
    height: 12px;
    width: 12px;
    margin: 0px 10px 0px 0px;
    box-shadow: ${({theme}) => theme === 'light' ? '0 1px 3px #000000' : '0 1px 3px #fffff2'};
    border-radius: 50%;
    background-color: green;
`
const Indisponible = styled.div`
    height: 12px;
    width: 12px;
    box-shadow: ${({theme}) => theme === 'light' ? '0 1px 3px #000000' : '0 1px 3px #fffff2'};
    margin: 0px 10px 0px 0px;
    border-radius: 50%;
    background-color: red;
`

const ProfilHopital = () => {
    const { id } = useParams();
    const [data, setData] = useState({});
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(false)
    const { theme } = useTheme()
    const { Loading, response, errorLoading } = useFetch(`http://localhost:5000/Hopital/get_hopitalById?id=${id}`)

    
    useEffect(() => {
        try {
            setError(errorLoading)
            setIsLoading(Loading)
            setData(response);
        } catch (error) {
            setError(error)
        } finally {
            setIsLoading(false);
        }

    }, [ id, Loading, response, errorLoading, setData, setIsLoading, setError]);
    
    if (error) {
        return <InfoError>Oups il y a eu un problème...</InfoError>
    }

    if (!data || !id) {
        return <Loader />
    }

    console.log(data);

    const handleError = (event) => {
        event.target.src = DefaultPicture
      }

    return (
        <>
            {isLoading ? (<CardContainer theme={theme}>
                <Loader/>
            </CardContainer>) : (
            <CardContainer theme={ theme }>
                <CardImage 
                    src={data.freelanceData.picture}
                    alt="freelance"
                    onError={handleError}>
                </CardImage>
                <CardInfos>
                    <CardTitle  theme={ theme }>{ data.freelanceData.name }</CardTitle>
                    <CardLabel  theme={ theme }>{data.freelanceData.job}</CardLabel>
                    <Competence> 
                    {data.freelanceData.skills.map((skill, index) =>(
                        <Skill  theme={ theme }
                            key={index}>{ skill } 
                        </Skill>
                    ))}
                    </Competence>
                    <Available  theme={ theme }>
                        {data.freelanceData.available ? (
                            <Disponible />
                        ) : (
                            <Indisponible />
                        )}
                        {data.freelanceData.available ? 'Disponible Maintenant' : 'Indisponible pour l\'instant'}
                    </Available>
                    <Tarif theme={ theme }>{data.freelanceData.tjm}€ / jour</Tarif>
                </CardInfos>
                <Ville  theme={ theme }>{ data.freelanceData.location }</Ville>
            </CardContainer>
            ) }
        </>
    )
}

export default ProfilHopital;