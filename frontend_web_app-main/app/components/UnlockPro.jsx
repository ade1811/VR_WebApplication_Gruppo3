import React from 'react';
import styled from 'styled-components';

const Button = () => {
  return (
    <StyledButton>
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 36 24">
        <path d="m18 0 8 12 10-8-4 20H4L0 4l10 8 8-12z" />
      </svg>
      Unlock Pro
    </StyledButton>
  );
}

const StyledButton = styled.button`
  display: flex;
  align-items: center;
  gap: 0.3rem; /* Ridotto lo spazio tra l'icona e il testo */
  padding: 0.6em 0.9em; /* Ridotto il padding per un bottone più compatto */
  border: none;
  font-weight: bold;
  border-radius: 30px;
  cursor: pointer;
  text-shadow: 2px 2px 3px rgb(136 0 136 / 50%);
  background: linear-gradient(
    15deg,
    #880088,
    #aa2068,
    #cc3f47,
    #de6f3d,
    #f09f33,
    #de6f3d,
    #cc3f47,
    #aa2068,
    #880088
  ) no-repeat;
  background-size: 300%;
  background-position: left center;
  color: #fff;
  transition: background 0.3s ease;

  &:hover {
    background-size: 320%;
    background-position: right center;
  }

  svg {
    width: 18px; /* Ridotto la dimensione dell'icona SVG */
    fill: #f09f33;
    transition: 0.3s ease;
  }

  &:hover svg {
    fill: #fff;
  }
`;

export default Button;
