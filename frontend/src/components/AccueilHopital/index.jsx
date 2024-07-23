
import styled from "styled-components";
import colors from "../utils/styles/colors";
import { InfoError, Loader } from "../utils/styles/Atoms";
import { useEffect, useState } from "react";
import { useFetch, useTheme } from "../utils/hooks";
import Card from '../../components/Card'

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
const CardsContainer = styled.div`
  display: grid;
  gap: 5em;
  grid-template-rows: 350px 350px;
  grid-template-columns: repeat(3, 1fr);
  align-items: center;
  justify-items: center;
`
const LoaderWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
`

const AccueilHopital = () => {
    const [data, setData] = useState({});
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(false)
    const { theme } = useTheme()

    const { Loading, response, errorLoading } = useFetch(`http://localhost:5000/auth/get_all_hopital`)


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

    }, [ Loading, response, errorLoading, setData, setIsLoading, setError]);
    
    if (error) {
        return <InfoError>Oups il y a eu un problème...</InfoError>
    }

    if (!data) {
        return <Loader />
    }

    console.log(data);

    return (
        <>
            {isLoading ? (
                <CardContainer theme={theme}>
                    <LoaderWrapper>
                        <Loader />
                    </LoaderWrapper>
                </CardContainer>
            ) : (
            <CardsContainer>
                {data.map((profile, index) => (
                <Card
                    key={`${profile.id}-${index}`}
                    id= {profile.id}
                    label={profile.job}
                    title={profile.name}
                    picture={profile.picture}
                />
                ))}
            </CardsContainer>
            ) }
        </>
    )
}

export default AccueilHopital;