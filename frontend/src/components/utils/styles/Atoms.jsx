import { Link } from 'react-router-dom'
import styled, {keyframes} from 'styled-components'
import colors from './colors'

const rotate = keyframes`
  from {
    transform: rotate(0deg);
  }

  to {
    transform: rotate(360deg);
  }
`

export const Loader = styled.div`
  padding: 10px;
  border: 6px solid ${colors.primary};
  border-bottom-color: transparent;
  border-radius: 22px;
  animation: ${rotate} 1s infinite linear;
  height: 0;
  width: 0;
  `

export const StyledLink = styled(Link)`
  padding: 10px 15px;
  color: #8186a0;
  text-decoration: none;
  font-size: 18px;
  text-align: center;
  ${(props) =>
    props.$isFullLink &&
    `color: white; 
    border-radius: 30px; 
    background-color: ${colors.primary};`}
  &:hover {
    transform: scale(1.1);
  }
  &:active {
    box-shadow: 0 0 5px 0 #000000;
    transform: translateY(2px);
    border: none;
    border-radius: 30px;
  }
`
export const InfoError = styled.span`
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 100px;
  font-size: 30px;
`
export const LinkStyled = styled(Link)`
  text-decoration: none;
  ${(props) =>
  props.$isNoUnderlined &&
  ` background-color: #5843e46c;
    border-radius: 30px;
    padding: 7px;
    transition: width 2s, height 2s, transform 2s;
    &:hover {
      height: 50px;
      transform: scale(1.1);
      box-shadow: 0 0.1255rem 0.9rem rgba( 255, 255, 255, 0.9), 0 0.125rem 0.9rem rgba(7, 7, 7, 0.995);
    }
    &:active {
      box-shadow: 0 0 5px 0 #000000;
      transform: translateY(2px);
      border: none;
      border-radius: 30px;
    }
  `}
` 